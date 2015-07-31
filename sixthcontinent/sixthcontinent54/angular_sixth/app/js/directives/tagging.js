app.directive("contenteditable", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

        function read() {
            var html = element.html();
            // When we clear the content editable the browser leaves a <br> behind
            // If strip-br attribute is provided then we strip this out
            html = html.replace('<br>', '');
            if( attrs.stripBr && html == '<br>' ) {
                html = '';
            }
            ngModel.$setViewValue(html);
        }

        ngModel.$render = function() {
            element.html(ngModel.$viewValue || '');
        };

        // $(element).keydown(function (e) {
        //     if(e.keyCode == 8) {
        //         $(this).prev(".selected-tagg").remove();
        //     }
        // });

        element.bind("keyup change", function() {
            scope.$apply(read);
        });
        }
    };
});

//Search tagging elements 
app.directive('searchTagging', ['$http', function($http){
    return {
        restrict: 'EA',
        templateUrl: 'app/views/tagg_list.html',
        controller: function($scope, $element, $sce, $compile, $timeout, ProfileService){
            $scope.commentText = '';
            $scope.allTaggs = {};
            $scope.taggedObject = {};
            var user = [];
            var club = [];
            var shop = [];
            $scope.taggedObject.user = user;
            $scope.taggedObject.club = club;
            $scope.taggedObject.shop = shop;
            var len = 0;
            $scope.$watch('commentText', function() {
                if ($scope.commentText.indexOf("@") !=-1){
                    len++;
                    var s1 = $scope.commentText;
                    var s2 = s1.substring(s1.indexOf("@")+1, ($scope.commentText.length)) 
                    var s3 = s2.trim();
                    s3 = s3.substr(0, len-1);
                    var res = 1; 
                    if (s3.length > 2){
                        var searchType = 'all_friends';
                        var privacy = $scope.privacy ? $scope.privacy : 4;
                        switch(privacy) {
                            case 1:
                                searchType = 'personal_friends';break;
                            case 2: 
                                searchType = 'professional_friends';break;
                            case 3:
                               searchType = 'all_friends';break;
                            case 4: {
                                searchType = ($scope.clubType == 1)?'all_friends':'club_members';
                            }
                        }
                        $scope.searchTags(s3, searchType, $scope.clubId, function(data){
                            res = 0;
                            $scope.allTaggs = data.data;
                        });
                    } else {
                        $scope.allTaggs = {};
                    }
                }else {
                    len = 0;
                    $scope.allTaggs = {}; 

                }
            }); 

            $scope.clearSearchedTagg = function () {
                $scope.allTaggs = {};
            }
            
            $scope.searchTags = function(text, search_type, club_id, callback) {
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.search_keyword = text;
                opts.search_type = search_type; //all_friends, personal_friends, professional_friends club_members
                opts.club_id = club_id;
                opts.limit_start = APP.user_list_pagination.start;
                opts.limit_size = APP.user_list_pagination.end; 
                ProfileService.searchAllFriend(opts, function(data) {
                    callback(data);
                });
            };
            $scope.getFirstText = function(text) {
                var s1 = text.split('@');
                return s1[0];
            };
            $scope.getSecondText = function(text) {
                var s1 = text.split('@');
                return s1[1].substr(len, s1[1].length);
            };

            $scope.tagUser = function(item) {
                var s = $scope.getFirstText($scope.commentText);
                var l = $scope.getSecondText($scope.commentText);
                //var linkHtml  = '<a contentEditable="false" class="selected-tagg" href="#/viewfriend/'+item.id+'">'+item.firstname+' '+item.last_name+'</a>'; 
                var linkHtml  = '<a class="selected-tagg" href="#/viewfriend/'+item.id+'">'+item.firstname+' '+item.last_name+'</a>'; 
                var finalText = s +' '+ linkHtml +' '+l+'<br/>';
                $scope.commentText = finalText; 
                $scope.taggedObject.user.push(item.id);
                $timeout(function(){
                    $element.focus();
                },0);
                $scope.allTaggs = {};
            };
            $scope.tagShop = function(item) {
                var s = $scope.getFirstText($scope.commentText);
                var l = $scope.getSecondText($scope.commentText);
                //var linkHtml  = '<a contentEditable="false" class="selected-tagg" href="#/shop/view/'+item.id+'">'+(item.business_name?item.business_name:item.name)+'</a>'; 
                var linkHtml  = '<a class="selected-tagg" href="#/shop/view/'+item.id+'">'+(item.name?item.name:item.business_name)+'</a>'; 
                var finalText = s +' '+ linkHtml +' '+l+'<br/>';
                $scope.commentText = finalText; 
                $scope.taggedObject.shop.push(item.id);
                $timeout(function(){
                    $element.focus();
                },0);
                $scope.allTaggs = {};
            }
            $scope.tagClub = function(item) {
                var s = $scope.getFirstText($scope.commentText);
                var l = $scope.getSecondText($scope.commentText);
                //var linkHtml  = '<a contentEditable="false" class="selected-tagg" href="#/club/view/'+item.id+'/'+item.status+'">'+item.name+'</a>'; 
                var linkHtml  = '<a class="selected-tagg" href="#/club/view/'+item.id+'/'+item.status+'">'+item.name+'</a>'; 
                var finalText = s +' '+ linkHtml +' '+l+'<br/>';
                $scope.commentText = finalText;
                $scope.taggedObject.club.push(item.id); 
                $timeout(function(){
                    $element.focus();
                },0);
                $scope.allTaggs = {};
            }
        }
    }
}]);    

//Search tagging elements 
app.directive('searchEditTagging', ['$parse', function($parse){
    return {
        restrict: 'EA',
        require: "ngModel",
        templateUrl: 'app/views/tagg_list.html',
        controller: function($scope, $element, $sce, $compile, $attrs, $timeout, ProfileService){
            $scope.allTaggs = {};
            $scope.taggedObject = {};
            var user = [];
            var club = [];
            var shop = [];
            $scope.taggedObject.user = user;
            $scope.taggedObject.club = club;
            $scope.taggedObject.shop = shop;
            var len = 0;
            var modelGetter = $parse($attrs['ngModel']);
            $scope.$watch($attrs.ngModel, function() {
                if (($scope.$eval($attrs.ngModel)).indexOf("@") !=-1){
                    len++;
                    var s1 = $scope.$eval($attrs.ngModel);
                    var s2 = s1.substring(s1.indexOf("@")+1, ($scope.$eval($attrs.ngModel)).length); 
                    var s3 = s2.trim();
                    s3 = s3.substr(0, len-1);
                    var res = 1; 
                    if (s3.length > 2){
                        var searchType = 'all_friends';
                        var privacy = $scope.privacy ? $scope.privacy : 4;
                        switch(privacy) {
                            case 1:
                                searchType = 'personal_friends';break;
                            case 2: 
                                searchType = 'professional_friends';break;
                            case 3:
                               searchType = 'all_friends';break;
                            case 4: {
                                searchType = ($scope.clubType == 1)?'all_friends':'club_members';
                            }
                        }
                        $scope.searchTags(s3, searchType, $scope.clubId, function(data){
                            res = 0;
                            $scope.allTaggs = data.data;
                        });
                    } else {
                        $scope.allTaggs = {};
                    }
                }else {
                    len = 0;
                    $scope.allTaggs = {}; 

                }
            });  

            $scope.clearSearchedTagg = function() {
                $scope.allTaggs = {};
            }

            $scope.searchTags = function(text, search_type, club_id, callback) {
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.search_keyword = text;
                opts.search_type = search_type; //all_friends, personal_friends, professional_friends club_members
                opts.club_id = club_id;
                opts.limit_start = APP.user_list_pagination.start;
                opts.limit_size = APP.user_list_pagination.end; 
                ProfileService.searchAllFriend(opts, function(data) {
                    callback(data);
                });
            };
            $scope.getFirstText = function(text) {
                var s1 = text.split('@');
                return s1[0];
            };
            $scope.getSecondText = function(text) {
                var s1 = text.split('@');
                return s1[1].substr(len, s1[1].length);
            };
            $scope.tagUser = function(item) {
                var s = $scope.getFirstText($scope.$eval($attrs.ngModel));
                var l = $scope.getSecondText($scope.$eval($attrs.ngModel));
                //var linkHtml  = '<a contentEditable="false" class="selected-tagg" href="#/viewfriend/'+item.id+'"><span contentEditable="false">'+item.firstname+'</span>'+' '+'<span contentEditable="false">'+item.last_name+'</a>'; 
                var linkHtml  = '<a class="selected-tagg" href="#/viewfriend/'+item.id+'">'+item.firstname+' '+item.last_name+'</a>';
                var finalText = s +' '+ linkHtml +' '+l+'<br/>';
                var modelSetter = modelGetter.assign;
                modelSetter($scope, finalText);
                $scope.taggedObject.user.push(item.id);
                $timeout(function(){
                    $element.focus();
                },0);
                $scope.allTaggs = {};
            };
            $scope.tagShop = function(item) {
                var s = $scope.getFirstText($scope.$eval($attrs.ngModel));
                var l = $scope.getSecondText($scope.$eval($attrs.ngModel));
                //var linkHtml  = '<a contentEditable="false" class="selected-tagg" href="#/shop/view/'+item.id+'"><span contentEditable="false">'+(item.business_name?item.business_name:item.name)+'</a>'; 
                var linkHtml  = '<a class="selected-tagg" href="#/shop/view/'+item.id+'">'+(item.name?item.name:item.business_name)+'</a>'; 
                var finalText = s +' '+ linkHtml +' '+l+'<br/>';
                var modelSetter = modelGetter.assign;
                modelSetter($scope, finalText); 
                $scope.taggedObject.shop.push(item.id);
                $timeout(function(){
                    $element.focus();
                },0);
                $scope.allTaggs = {};
            }
            $scope.tagClub = function(item) {
                var s = $scope.getFirstText($scope.$eval($attrs.ngModel));
                var l = $scope.getSecondText($scope.$eval($attrs.ngModel));
                var linkHtml  = '<a class="selected-tagg" href="#/club/view/'+item.id+'/'+item.status+'">'+item.name+'</a>'; 
                var finalText = s +' '+ linkHtml +' '+l+'<br/>';
                var modelSetter = modelGetter.assign;
                modelSetter($scope, finalText);
                $scope.taggedObject.club.push(item.id);
                $timeout(function(){
                    $element.focus();
                },0);
                $scope.allTaggs = {};
            }    
        }
    }
}]);