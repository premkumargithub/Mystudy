app.directive('imgModalNew',['$timeout', '$location', function($timeout, $location) 
{
    return {
        restrict: 'A',
        scope : true,
        controller : function ($scope,$modal,$log, SingleMediaDetailService, ProfileService, AlbumService, $routeParams)
        {
            $scope.OpenModal = function(index, viewalbum, leng, mainId, albumtype, parenttype, supportId, ClubMember) 
            {
                var modalInstance1;
                $scope.showInLimit = true;
                $scope.max          = 5;
                $scope.isReadonly   = false;
                $scope.album_type   = albumtype;
                $scope.parent_type  = parenttype;
                $scope.parent_id    = mainId;
                $scope.media_index  = index;
                $scope.leng         = leng
                $scope.pre_visible  = true;
                $scope.next_visible = true;
                $scope.modal_loader = true;
                $scope.viewalbum    = viewalbum;
                $scope.supportId    = supportId;
                $scope.media_id     = $scope.viewalbum[$scope.media_index].id;  
                if(ClubMember != undefined){/*This is defined when modal is opening from club album*/
                    $scope.is_member = ClubMember;
                }     
                
                $scope.friendTagIndex = 0;
                $scope.tagged_Friends = [];
                $scope.UpdateTag      = false;
                $scope.TagLoader      = false;
                $scope.friends        = [];
                $scope.cancelFriendSearch = false;
                $scope.showSearchLoader   = false;
                $scope.dublicate = false;
                $scope.toBelong = false;
                $scope.tagged_collection = []
                $scope.untagg_friend = {}
                $scope.choose = false;
                
                if(index === 0) $scope.pre_visible = false;
                if((leng-1)=== index) $scope.next_visible = false;
                
                $scope.getmediainfo = function(){
                    $scope.data = [];
                    var opt = new Object();
                        opt.media_id         = $scope.media_id;
                        opt.album_type       = $scope.album_type;
                        opt.album_id         = $scope.parent_id;
                        opt.user_id          = APP.currentUser.id; 
                        opt.owner_id         = $scope.supportId; 
                    
                    SingleMediaDetailService.getMediaInfo(opt, function(data) {
                        if(data.code == 101){
                            $scope.data         = data.data;
                            $scope.modal_loader = false;
                        }
                    });    
                };
                $scope.showAllTaggedFriend = function (){
                    $scope.showInLimit = false;
                }

                $scope.putFocus = function(){
                    document.getElementById('searchTagFriend').focus();
                }
                
                $scope.getmediainfo();

                var modalInstance = $modal.open({
                    templateUrl: "app/views/img_modal_new.html",
                    controller: 'ModalController',
                    size: 'lg',
                    scope: $scope,
                });

                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                    $scope.tagged_Friends = [];
                    $scope.UpdateTag      = false;
                });

                $scope.change_image = function (changetype){
                    $scope.pre_visible  = true;
                    $scope.modal_loader = true;
                    $scope.next_visible = true;
                    $scope.media_index  = (changetype == 'pre' ? $scope.media_index - 1 : $scope.media_index + 1);
                    if($scope.media_index === 0) $scope.pre_visible = false;
                    if(($scope.leng-1) === $scope.media_index) $scope.next_visible = false;
                    $scope.media_id = $scope.viewalbum[$scope.media_index].id;    
                    $scope.getmediainfo();
                };    

                $scope.averageRating = function(rating){
                    return new Array(Math.ceil(rating));
                };

                $scope.blankStar = function(rating){
                    if((5-Math.ceil(rating)) > 0){
                        return new Array(5-Math.ceil(rating));
                    }else{
                        return 0;
                    }
                };

                $scope.viewUserProfile = function(friendId){
                    if(friendId == APP.currentUser.id){
                        modalInstance.dismiss('cancel');
                        modalInstance1.dismiss('cancel');
                        $location.path('profiles');
                    }else{
                        modalInstance.dismiss('cancel');
                        modalInstance1.dismiss('cancel');
                        $location.path('/viewfriend/'+friendId);
                    }
                };

                $scope.Tagtoggle = function(){
                    $scope.UpdateTag = !$scope.UpdateTag;
                }

                $scope.tagFriendSuggestion = function(event, friendname){
                    if(event.keyCode===40){
                        event.preventDefault();
                        if($scope.friendTagIndex+1 !== $scope.friends.length){
                            $scope.friendTagIndex++;
                        }
                    }else if(event.keyCode===38){
                        event.preventDefault();
                        if($scope.friendTagIndex-1 !== -1){
                            $scope.friendTagIndex--;
                        }
                    }else if(event.keyCode===13){
                           if($scope.friends.length > 0  && $scope.friendTagIndex!==-1) $scope.selectFriend($scope.friends[$scope.friendTagIndex]);
                           if($scope.friends.length === 1) $scope.selectFriend($scope.friends[0]);
                    }
                    if($('#searchTagFriend').val().trim()==="") $scope.showFriendList = false;
                    if(!(event.keyCode>=65 && event.keyCode<=95)) return;
                    $scope.cancelFriendSearch = false;
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    friendname ? opts.friend_name = friendname : opts.friend_name = "";
                    opts.session_id = APP.currentUser.id;
                    opts.limit_start = 0;
                    opts.limit_size =  APP.friend_list_pagination.end;
                    $scope.showSearchLoader = true;

                    ProfileService.searchFriends(opts,function(data){
                        $scope.showSearchLoader = false;
                        if($scope.cancelFriendSearch === false){
                            if(data.data.users.length>0) $scope.showFriendList = true;
                            else $scope.showFriendList = false;
                            $scope.friends = data.data.users;
                        }
                    })
                };

                $scope.selectFriend = function(friendInfo){
                    $scope.dublicate = false;
                    $scope.choose = false;  
                    angular.forEach($scope.data.tagged_friends_info,function(index){
                        if(index.id === friendInfo.user_id){
                            $scope.dublicate = true;
                        }
                    });

                    if($scope.dublicate === false){
                        $scope.data.tagged_friends_info.push(friendInfo.user_info);
                        $scope.friends = [];
                        $scope.cancelFriendSearch = true;
                        $scope.friendTagIndex = -1;
                        angular.element('#searchTagFriend').val("");
                        $scope.showFriendList = false;
                    }else{
                        $scope.friends = [];
                        $scope.cancelFriendSearch = true;
                        $scope.friendTagIndex = -1;
                        angular.element('#searchTagFriend').val("");
                        $scope.showFriendList = false;
                    }
                };

                $scope.taggService = function(){
                    var pre_visible_status  = $scope.pre_visible;
                    var next_visible_status = $scope.next_visible;
                    $scope.pre_visible = false;
                    $scope.next_visible = false;
                    var frnd_array = [];
                    angular.forEach($scope.data.tagged_friends_info,function(index){
                        frnd_array.push(index.id);
                    });
                    var opts = {};
                        opts.user_id   = APP.currentUser.id;
                        opts.album_id  = $scope.parent_id;
                        opts.post_type = 1;
                        opts.media_id  = [$scope.media_id];
                        opts.tagged_friends = frnd_array.join(',')
                    $scope.UpdateTag = false;
                    $scope.TagLoader = true;
                
                   AlbumService.photoTaging(opts,function(data){
                        if(data.code === 101){
                            $scope.choose = true;
                            $scope.TagLoader = false;
                        }
                        $scope.pre_visible  = pre_visible_status;
                        $scope.next_visible = next_visible_status;
                    });
                };

                $scope.removeTagFriend = function(friendIndex){
                    $scope.data.tagged_friends_info.splice(friendIndex,1);
                };

                $scope.lostFocus = function(){
                    $timeout(function(){
                        $scope.friends = [];
                        $scope.cancelFriendSearch = true;
                        $scope.friendTagIndex = -1;
                        angular.element('#searchTagFriend').val("");
                        $scope.showFriendList = false;
                    },300);
                };

                $scope.waitRateResponse = false;
                $scope.ratePicture = function(rating, picture_id, mediaIndex){
                    var update = "";
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    opts.type_id = picture_id;
                    opts.rate    = rating;
                    if($scope.parent_type == 'friend_album'){
                        opts.type = 'user_profile_album_photo'
                    }else {
                        opts.type = $scope.parent_type;
                    }
                    if($scope.data.is_rated){
                        update = "update";
                    }else{
                        update = "add";
                    }
                    $scope.waitRateResponse = true;
                    ProfileService.rateThis(opts, update, function(data){
                        if(data.code === 101 && data.message === "SUCCESS"){
                            $scope.data.avg_rate    = data.data.avg_rate;
                            $scope.data.no_of_votes = data.data.no_of_votes;
                            $scope.data.is_rated    = true;
                            $scope.data.current_user_rate = data.data.current_user_rate;
                        }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                            $scope.data.current_user_rate   = 0;
                            $scope.data.is_rated            = true;
                        }
                        $scope.waitRateResponse = false;
                    });
                };

                $scope.removeRating = function(pictureIndex , mediaIndex){
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    opts.type_id = pictureIndex;
                    if($scope.parent_type == 'friend_album'){
                        opts.type = 'user_profile_album_photo'
                    }else {
                        opts.type = $scope.parent_type;
                    }
                    
                    if($scope.waitRateResponse === false){
                        $scope.waitRateResponse = true;
                    }else{
                        return;
                    }
                    ProfileService.removeRating(opts,function(data){
                        if(data.code == 101 && data.message == "SUCCESS"){
                            $scope.data.current_user_rate   = 0;
                            $scope.data.avg_rate            = data.data.avg_rate;
                            $scope.data.no_of_votes         = data.data.no_of_votes;
                            $scope.data.is_rated            = false;
                        }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                            $scope.data.current_user_rate   = 0;
                            $scope.data.is_rated            = false;
                        }
                        $scope.waitRateResponse = false;
                    });
                };

                $scope.findPeopleRate = function(id, count_Vote){
                    if(count_Vote === 0 ){
                        return false;
                    }
                    var opts = {};
                    $scope.ratedUsers = {};
                    modalInstance1 = $modal.open({
                                templateUrl: 'app/views/find_people.html',
                                controller: 'ModalController',
                                size: 'lg',
                                scope: $scope,
                    });
                    $scope.showPeopleLoader = true;
                    if($scope.parent_type == 'friend_album'){
                        opts.type = 'user_profile_album_photo'
                    }else {
                        opts.type = $scope.parent_type;
                    }
                    opts.type_id = id;
                    opts.session_id = APP.currentUser.id;
                    ProfileService.findPeople(opts,function(data){
                        if(data.code == 101 && data.message == "SUCCESS"){
                            $scope.showPeopleLoader = false;
                            $scope.ratedUsers       = data.data.users_rated;
                            if(data.data.users_rated.length == 0){
                                $scope.message = $scope.i18n.dashboard.no_vote;
                            }
                        }else{
                            $scope.showPeopleLoader = false;
                        }
                    });
                    modalInstance1.result.then(function (selectedItem) {
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                    $scope.viewFriendProile = function(friendId){
                        modalInstance1.dismiss('cancel');
                        modalInstance.dismiss('cancel');
                        $location.path('/viewfriend/'+friendId);
                    };
                };
            }
        }
    };
}]);


// app.directive('rateMe',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
//     return {
//             templateUrl: 'app/views/rating_star_comment.html',
//             restrict: "E",
//             scope: true,
//             controller : function($scope, $modal, $log, ProfileService){
//                 $scope.hovering = function(value) {
//                     $scope.overStar = value;
//                     $scope.percent = 100 * (value / $scope.max);
//                 };
//                 $scope.averageVoting = 0;
//                 $scope.vote_count = 0;
//                 $scope.waitRateResponse = false;
//                 $scope.findPeopleRate = function(id, type, count_Vote){
//                     if(count_Vote === 0 ){
//                         return false;
//                     }
//                     var opts = {};
//                     $scope.ratedUsers = {};
//                     var modalInstance = $modal.open({
//                                 templateUrl: 'app/views/find_people.html',
//                                 controller: 'ModalController',
//                                 size: 'lg',
//                                 scope: $scope,
//                     });
//                     $scope.showPeopleLoader = true;
//                     opts.type = type;
//                     opts.type_id = id;
//                     ProfileService.findPeople(opts,function(data){
//                         if(data.code == 101 && data.message == "SUCCESS"){
//                             $scope.showPeopleLoader = false;
//                             $scope.ratedUsers = data.data.users_rated;
//                             if(data.data.users_rated.length == 0){
//                                 $scope.message = $scope.i18n.dashboard.no_vote;
//                             }
//                         }else{
//                             $scope.showPeopleLoader = false;
//                         }
//                     });
//                     modalInstance.result.then(function (selectedItem) {
//                     }, function () {
//                         $log.info('Modal dismissed at: ' + new Date());
//                     });

//                     $scope.viewFriendProile = function(friendId){
//                         modalInstance.dismiss('cancel');
//                         $location.path('/viewfriend/'+friendId);
//                     };
//                 };

//                 $scope.rateComment = function(rating, comment_id, postIndex, commentIndex){
//                     var update = "";
//                     var opts = {};
//                     opts.user_id = APP.currentUser.id;
//                     opts.type = "dashboard_post_comment";
//                     opts.type_id = comment_id;
//                     opts.rate = rating;
//                     if($scope.userPostList[postIndex].comments[commentIndex].is_rated){
//                         update = "update";
//                     }else{
//                         update = "add";
//                     }
//                     $scope.waitRateResponse = true;
//                     ProfileService.rateThis(opts, update, function(data){
//                         if(data.code === 101 && data.message === "SUCCESS"){
//                             $scope.userPostList[postIndex].comments[commentIndex].avg_rate = data.data.avg_rate;
//                             $scope.userPostList[postIndex].comments[commentIndex].no_of_votes = data.data.no_of_votes;
//                             $scope.userPostList[postIndex].comments[commentIndex].is_rated = true;
//                         }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                             $scope.userPostList[postIndex].comments[commentIndex].current_user_rate = 0;
//                             $scope.userPostList[postIndex].comments[commentIndex].is_rated = true;
//                         }
//                         $scope.waitRateResponse = false;
//                     });
//                 };

//                 $scope.removeCommentRating = function(comment_id, postIndx, indx){
//                     var opts = {};
//                     opts.user_id = APP.currentUser.id;
//                     opts.type = "dashboard_post_comment";
//                     opts.type_id = comment_id;
//                     if($scope.WaitDeleteResponse === false){
//                         $scope.WaitDeleteResponse = true;
//                         $scope.waitRateResponse = true;
//                     }else{
//                         return;
//                     }
//                     ProfileService.removeRating(opts,function(data){
//                         if(data.code == 101 && data.message == "SUCCESS"){
//                             $scope.userPostList[postIndx].comments[indx].current_user_rate = 0;
//                             $scope.userPostList[postIndx].comments[indx].avg_rate = data.data.avg_rate;
//                             $scope.userPostList[postIndx].comments[indx].no_of_votes = data.data.no_of_votes;
//                             $scope.userPostList[postIndx].comments[indx].is_rated = false;
//                         }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                             $scope.userPostList[postIndx].comments[indx].current_user_rate = 0;
//                             $scope.userPostList[postIndx].comments[indx].is_rated = false;
//                         }
//                     $scope.WaitDeleteResponse = false;
//                     $scope.waitRateResponse = false;
//                     });
//                 };

//                 $scope.averageRating = function(rating){
//                     return new Array(Math.ceil(rating));
//                 };

//                 $scope.blankStar = function(rating){
//                     if((5-Math.ceil(rating)) > 0){
//                         return new Array(5-Math.ceil(rating));
//                     }else{
//                         return 0;
//                     }
//                 };

//                 $scope.max = 5;
//                 $scope.isReadonly = false;

//                 /*  $scope.rateThis = function(value, id, index){
//                     $scope.ratePost(value, id, index);
//                 };*/

//                 $scope.ratingStates = [
//                     {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
//                 ];
//             },
//             link: function (scope, element, attrs) {
//             }
//       }
// }]);
// app.directive('rateAlbumDir',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
//     return {
//         templateUrl: 'app/views/rating_star_album.html',
//         restrict: "E",
//         scope: true,
//         controller : function($scope, $modal, $log, ProfileService){
//             $scope.hovering = function(value) {
//                 $scope.overStar = value;
//                 $scope.percent = 100 * (value / $scope.max);
//             };
//             $scope.averageVoting = 0;
//             $scope.vote_count = 0;
//             $scope.waitRateResponse = false;
//             $scope.findPeopleRate = function(id, type, count_Vote){
//                 //console.log(count_Vote);
//                 if(count_Vote === 0 ){
//                     return false;
//                 }
//                 var opts = {};
//                 $scope.ratedUsers = {};
//                 var modalInstance = $modal.open({
//                             templateUrl: 'app/views/find_people.html',
//                             controller: 'ModalController',
//                             size: 'lg',
//                             scope: $scope,
//                 });
//                 $scope.showPeopleLoader = true;
//                 opts.type = type;
//                 opts.type_id = id;
//                 ProfileService.findPeople(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.showPeopleLoader = false;
//                         $scope.ratedUsers = data.data.users_rated;
//                         if(data.data.users_rated.length == 0){
//                             $scope.message = $scope.i18n.dashboard.no_vote;
//                         }
//                     }else{
//                         $scope.showPeopleLoader = false;
//                     }
//                 });
//                 modalInstance.result.then(function (selectedItem) {
//                 }, function () {
//                     $log.info('Modal dismissed at: ' + new Date());
//                 });

//                 $scope.viewFriendProile = function(friendId){
//                     modalInstance.dismiss('cancel');
//                     $location.path('/viewfriend/'+friendId);
//                 };
//             };

//             $scope.rateThisAlbum = function(rating, album_id, type){
//                 var update = "";
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = type;
//                 opts.type_id = album_id;
//                 opts.rate = rating;
                
//                 if($scope.albumDetails.is_rated){
//                     update = "update";
//                 }else{
//                     update = "add";
//                 }
//                 $scope.waitRateResponse = true;
//                 ProfileService.rateThis(opts, update, function(data){
//                     if(data.code === 101 && data.message === "SUCCESS"){
//                         $scope.albumDetails.avg_rate = data.data.avg_rate;
//                         $scope.albumDetails.no_of_votes = data.data.no_of_votes;
//                         $scope.albumDetails.is_rated = true;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.is_rated = true;
//                     }
//                     $scope.waitRateResponse = false;
//                 });
//             };

//             $scope.removeAlbumRating = function(albumIndex){
//                 //console.log($scope.waitRateResponse);
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = "user_profile_album";
//                 opts.type_id = albumIndex;
//                 if($scope.waitRateResponse === false){
//                     $scope.waitRateResponse = true;
//                 }else{
//                     return;
//                 }
//                 ProfileService.removeRating(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.avg_rate = data.data.avg_rate;
//                         $scope.albumDetails.no_of_votes = data.data.no_of_votes;
//                         $scope.albumDetails.is_rated = false;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.is_rated = false;
//                     }
//                 $scope.waitRateResponse = false;
//                 });
//             };
//             //console.log("hiiii" + rating );
//             $scope.averageRating = function(rating){
//                 return new Array(Math.ceil(rating));
//             };

//             $scope.blankStar = function(rating){
//                 if((5-Math.ceil(rating)) > 0){
//                     return new Array(5-Math.ceil(rating));
//                 }else{
//                     return 0;
//                 }
//             };

//             $scope.max = 5;
//             $scope.isReadonly = false;

// /*            $scope.rateThis = function(value, id, index){
//                 $scope.ratePost(value, id, index);
//             };*/

//             $scope.ratingStates = [
//                 {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
//             ];
//         },
//         link: function (scope, element, attrs) {
            

//         }
//     }
// }]);
// app.directive('rateMeClub',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
//     return {
//         templateUrl: 'app/views/ratingStarClub.html',
//         restrict: "E",
//         scope: true,
//         controller : function($scope, $modal, $log, ProfileService){
//             $scope.hovering = function(value) {
//                 $scope.overStar = value;
//                 $scope.percent = 100 * (value / $scope.max);
//             };
//             $scope.avg_rate = true;
//             $scope.vote_count =0
//             $scope.averageVoting = 0;
//             $scope.vote_count = 0;
//             $scope.waitRateResponse = false;
//             $scope.findPeopleRate = function(id, count_Vote){
//                 if(count_Vote === 0 ){
//                     return false;
//                 }
//                 var opts = {};
//                 $scope.ratedUsers = {};
//                 var modalInstance = $modal.open({
//                             templateUrl: 'app/views/find_people.html',
//                             controller: 'ModalController',
//                             size: 'lg',
//                             scope: $scope,
//                 });
//                 $scope.showPeopleLoader = true;
//                 opts.type = "club_post_comment";
//                 opts.type_id = id;
//                 ProfileService.findPeople(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.showPeopleLoader = false;
//                         $scope.ratedUsers = data.data.users_rated;
//                         if(data.data.users_rated.length == 0){
//                             $scope.message = $scope.i18n.dashboard.no_vote;
//                         }
//                     }else{
//                         $scope.showPeopleLoader = false;
//                     }
//                 });
//                 modalInstance.result.then(function (selectedItem) {
//                 }, function () {
//                     $log.info('Modal dismissed at: ' + new Date());
//                 });

//                 $scope.viewFriendProile = function(friendId){
//                     modalInstance.dismiss('cancel');
//                     $location.path('/viewfriend/'+friendId);
//                 };
//             };

//             $scope.rateComment = function(rating, comment_id, postIndex, commentIndex){
//                 var update = "";
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = "club_post_comment";
//                 opts.type_id = comment_id;
//                 opts.rate = rating;
//                 if($scope.posts[postIndex].comments[commentIndex].is_rated){
//                     update = "update";
//                 }else{
//                     update = "add";
//                 }
//                 $scope.waitRateResponse = true;
//                 ProfileService.rateThis(opts, update, function(data){
//                     if(data.code === 101 && data.message === "SUCCESS"){
//                         $scope.posts[postIndex].comments[commentIndex].avg_rate = data.data.avg_rate;
//                         $scope.posts[postIndex].comments[commentIndex].no_of_votes = data.data.no_of_votes;
//                         $scope.posts[postIndex].comments[commentIndex].is_rated = true;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.posts[postIndex].comments[commentIndex].current_user_rate = 0;
//                         $scope.posts[postIndex].comments[commentIndex].is_rated = true;
//                     }
//                     $scope.waitRateResponse = false;
//                 });
//             };

//             $scope.removeCommentRating = function(comment_id, postIndx, indx){
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = "club_post_comment";
//                 opts.type_id = comment_id;
//                 if($scope.WaitDeleteResponse === false){
//                     $scope.WaitDeleteResponse = true;
//                     $scope.waitRateResponse = true;
//                 }else{
//                     return;
//                 }
//                 ProfileService.removeRating(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.posts[postIndx].comments[indx].current_user_rate = 0;
//                         $scope.posts[postIndx].comments[indx].avg_rate = data.data.avg_rate;
//                         $scope.posts[postIndx].comments[indx].no_of_votes = data.data.no_of_votes;
//                         $scope.posts[postIndx].comments[indx].is_rated = false;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.posts[postIndx].comments[indx].current_user_rate = 0;
//                         $scope.posts[postIndx].comments[indx].is_rated = false;
//                     }
//                 $scope.WaitDeleteResponse = false;
//                 $scope.waitRateResponse = false;
//                 });
//             };

//             $scope.averageRating = function(rating){
//                 return new Array(Math.ceil(rating));
//             };

//             $scope.blankStar = function(rating){
//                 if((5-Math.ceil(rating)) > 0){
//                     return new Array(5-Math.ceil(rating));
//                 }else{
//                     return 0;
//                 }
//             };

//             $scope.max = 5;
//             $scope.isReadonly = false;

//             /*  $scope.rateThis = function(value, id, index){
//                 $scope.ratePost(value, id, index);
//             };*/

//             $scope.ratingStates = [
//                 {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
//             ];
//         },
//         link: function (scope, element, attrs) {
            

//         }
//     }
// }]);
    
// app.directive('rateShopComment',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
//     return {
//         templateUrl: 'app/views/ratingStarClub.html',
//         restrict: "E",
//         scope: true,
//         controller : function($scope, $modal, $log, ProfileService){
//             $scope.hovering = function(value) {
//                 $scope.overStar = value;
//                 $scope.percent = 100 * (value / $scope.max);
//             };
//             $scope.avg_rate = true;
//             $scope.vote_count =0
//             $scope.averageVoting = 0;
//             $scope.vote_count = 0;
//             $scope.waitRateResponse = false;
//             $scope.WaitDeleteResponse = false ;
//             $scope.findPeopleRate = function(id, count_Vote){
//                 if(count_Vote === 0 ){
//                     return false;
//                 }
//                 var opts = {};
//                 $scope.ratedUsers = {};
//                 var modalInstance = $modal.open({
//                             templateUrl: 'app/views/find_people.html',
//                             controller: 'ModalController',
//                             size: 'lg',
//                             scope: $scope,
//                 });
//                 $scope.showPeopleLoader = true;
//                 opts.type = "store_post_comment";
//                 opts.type_id = id;
//                 ProfileService.findPeople(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.showPeopleLoader = false;
//                         $scope.ratedUsers = data.data.users_rated;
//                         if(data.data.users_rated.length == 0){
//                             $scope.message = $scope.i18n.dashboard.no_vote;
//                         }
//                     }else{
//                         $scope.showPeopleLoader = false;
//                     }
//                 });
//                 modalInstance.result.then(function (selectedItem) {
//                 }, function () {
//                     $log.info('Modal dismissed at: ' + new Date());
//                 });

//                 $scope.viewFriendProile = function(friendId){
//                     modalInstance.dismiss('cancel');
//                     $location.path('/viewfriend/'+friendId);
//                 };
//             };

//             $scope.rateComment = function(rating, comment_id, postIndex, commentIndex){
//                 var update = "";
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = "store_post_comment";
//                 opts.type_id = comment_id;
//                 opts.rate = rating;
//                 if($scope.posts[postIndex].comments[commentIndex].is_rated){
//                     update = "update";
//                 }else{
//                     update = "add";
//                 }
//                 $scope.waitRateResponse = true;
//                 ProfileService.rateThis(opts, update, function(data){
//                     if(data.code === 101 && data.message === "SUCCESS"){
//                         $scope.posts[postIndex].comments[commentIndex].avg_rate = data.data.avg_rate;
//                         $scope.posts[postIndex].comments[commentIndex].no_of_votes = data.data.no_of_votes;
//                         $scope.posts[postIndex].comments[commentIndex].is_rated = true;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.posts[postIndex].comments[commentIndex].current_user_rate = 0;
//                         $scope.posts[postIndex].comments[commentIndex].is_rated = true;
//                     }
//                     $scope.waitRateResponse = false;
//                 });
//             };

//             $scope.removeCommentRating = function(comment_id, postIndx, indx){
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = "store_post_comment";
//                 opts.type_id = comment_id;
//                 if($scope.WaitDeleteResponse === false){
//                     $scope.WaitDeleteResponse = true;
//                     $scope.waitRateResponse = true;
//                 }else{
//                     return;
//                 }
//                 ProfileService.removeRating(opts,function(data){
//                    if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.posts[postIndx].comments[indx].current_user_rate = 0;
//                         $scope.posts[postIndx].comments[indx].avg_rate = data.data.avg_rate;
//                         $scope.posts[postIndx].comments[indx].no_of_votes = data.data.no_of_votes;
//                         $scope.posts[postIndx].comments[indx].is_rated = false;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.posts[postIndx].comments[indx].current_user_rate = 0;
//                         $scope.posts[postIndx].comments[indx].is_rated = false;
//                     }
//                 $scope.WaitDeleteResponse = false;
//                 $scope.waitRateResponse = false;
//                 });
//             };

//             $scope.averageRating = function(rating){
//                 return new Array(Math.ceil(rating));
//             };

//             $scope.blankStar = function(rating){
//                 if((5-Math.ceil(rating)) > 0){
//                     return new Array(5-Math.ceil(rating));
//                 }else{
//                     return 0;
//                 }
//             };

//             $scope.max = 5;
//             $scope.isReadonly = false;

// /*            $scope.rateThis = function(value, id, index){
//                 $scope.ratePost(value, id, index);
//             };*/

//             $scope.ratingStates = [
//                 {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
//             ];
//         },
//         link: function (scope, element, attrs) {
            

//         }
//     }
// }]);

// app.controller('rateAlbum',['$scope', '$modal', '$log', '$location', 'ProfileService', function($scope, $modal, $log, $location, ProfileService){

//         $scope.hovering = function(value) {
//             $scope.overStar = value;
//             $scope.percent = 100 * (value / $scope.max);
//         };

//         $scope.averageVoting = 0;
//         $scope.vote_count = 0;
//         $scope.waitRateResponse = false;
//         $scope.findPeopleRate = function(id, type, count_Vote){
//             if(count_Vote === 0 ){
//                 return false;
//             }
//             var opts = {};
//             $scope.ratedUsers = {};
//             var modalInstance = $modal.open({
//                         templateUrl: 'app/views/find_people.html',
//                         controller: 'ModalController',
//                         size: 'lg',
//                         scope: $scope,
//             });
//             $scope.showPeopleLoader = true;
//             opts.type = type;
//             opts.type_id = id;
//             ProfileService.findPeople(opts,function(data){
//                 if(data.code == 101 && data.message == "SUCCESS"){
//                     $scope.showPeopleLoader = false;
//                     $scope.ratedUsers = data.data.users_rated;
//                     if(data.data.users_rated.length == 0){
//                         $scope.message = $scope.i18n.dashboard.no_vote;
//                     }
//                 }else{
//                     $scope.showPeopleLoader = false;
//                 }
//             });
//             modalInstance.result.then(function (selectedItem) {
//             }, function () {
//                 $log.info('Modal dismissed at: ' + new Date());
//             });

//             $scope.viewFriendProile = function(friendId){
//                 modalInstance.dismiss('cancel');
//                 $location.path('/viewfriend/'+friendId);
//             };
//         };

//         $scope.averageRating = function(rating){
//             return new Array(Math.ceil(rating));
//         };

//         $scope.blankStar = function(rating){
//             if((5-Math.ceil(rating)) > 0){
//                 return new Array(5-Math.ceil(rating));
//             }else{
//                 return 0;
//             }
//         };

//         $scope.max = 5;
//         $scope.isReadonly = false;

//         $scope.ratingStates = [
//             {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
//         ];
// }]);
// app.directive('rateAlbumDirClub',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
//     return {
//         templateUrl: 'app/views/rating_star_album_club.html',
//         restrict: "E",
//         scope: true,
//         controller : function($scope, $modal, $log, ProfileService){
//             $scope.hovering = function(value) {
//                 $scope.overStar = value;
//                 $scope.percent = 100 * (value / $scope.max);
//             };
//             $scope.averageVoting = 0;
//             $scope.vote_count = 0;
//             $scope.waitRateResponse = false;
//             $scope.findPeopleRate = function(id, type, count_Vote){
//                 if(count_Vote === 0 ){
//                     return false;
//                 }
//                 var opts = {};
//                 $scope.ratedUsers = {};
//                 var modalInstance = $modal.open({
//                             templateUrl: 'app/views/find_people.html',
//                             controller: 'ModalController',
//                             size: 'lg',
//                             scope: $scope,
//                 });
//                 $scope.showPeopleLoader = true;
//                 opts.type = 'club_album';
//                 opts.type_id = id;
//                 ProfileService.findPeople(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.showPeopleLoader = false;
//                         $scope.ratedUsers = data.data.users_rated;
//                         if(data.data.users_rated.length == 0){
//                             $scope.message = $scope.i18n.dashboard.no_vote;
//                         }
//                     }else{
//                         $scope.showPeopleLoader = false;
//                     }
//                 });
//                 modalInstance.result.then(function (selectedItem) {
//                 }, function () {
//                     $log.info('Modal dismissed at: ' + new Date());
//                 });

//                 $scope.viewFriendProile = function(friendId){
//                     modalInstance.dismiss('cancel');
//                     $location.path('/viewfriend/'+friendId);
//                 };
//             };

//             $scope.rateThisAlbum = function(rating, album_id, type){
//                 var update = "";
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = 'club_album';
//                 opts.type_id = album_id;
//                 opts.rate = rating;
                
//                 if($scope.albumDetails.is_rated){
//                     update = "update";
//                 }else{
//                     update = "add";
//                 }
//                 $scope.waitRateResponse = true;
//                 ProfileService.rateThis(opts, update, function(data){
//                     if(data.code === 101 && data.message === "SUCCESS"){
//                         $scope.albumDetails.avg_rate = data.data.avg_rate;
//                         $scope.albumDetails.no_of_votes = data.data.no_of_votes;
//                         $scope.albumDetails.is_rated = true;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.is_rated = true;
//                     }
//                     $scope.waitRateResponse = false;
//                 });
//             };

//             $scope.removeAlbumRating = function(albumIndex){
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = "club_album";
//                 opts.type_id = albumIndex;
//                 if($scope.waitRateResponse === false){
//                     $scope.waitRateResponse = true;
//                 }else{
//                     return;
//                 }
//                 ProfileService.removeRating(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.avg_rate = data.data.avg_rate;
//                         $scope.albumDetails.no_of_votes = data.data.no_of_votes;
//                         $scope.albumDetails.is_rated = false;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.is_rated = false;
//                     }
//                 $scope.waitRateResponse = false;
//                 });
//             };
//             //console.log("hiiii" + rating );
//             $scope.averageRating = function(rating){
//                 return new Array(Math.ceil(rating));
//             };

//             $scope.blankStar = function(rating){
//                 if((5-Math.ceil(rating)) > 0){
//                     return new Array(5-Math.ceil(rating));
//                 }else{
//                     return 0;
//                 }
//             };

//             $scope.max = 5;
//             $scope.isReadonly = false;

// /*            $scope.rateThis = function(value, id, index){
//                 $scope.ratePost(value, id, index);
//             };*/
            
//             $scope.ratingStates = [
//                 {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
//             ];
//         },
//         link: function (scope, element, attrs) {
            

//         }
//     }
// }]);
// app.directive('rateAlbumDirShop',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
//     return {
//         templateUrl: 'app/views/rating_star_album_club.html',
//         restrict: "E",
//         scope: true,
//         controller : function($scope, $modal, $log, ProfileService){
//             $scope.hovering = function(value) {
//                 $scope.overStar = value;
//                 $scope.percent = 100 * (value / $scope.max);
//             };
//             $scope.averageVoting = 0;
//             $scope.vote_count = 0;
//             $scope.waitRateResponse = false;
//             $scope.findPeopleRate = function(id, type, count_Vote){
//                 if(count_Vote === 0 ){
//                     return false;
//                 }
//                 var opts = {};
//                 $scope.ratedUsers = {};
//                 var modalInstance = $modal.open({
//                             templateUrl: 'app/views/find_people.html',
//                             controller: 'ModalController',
//                             size: 'lg',
//                             scope: $scope,
//                 });
//                 $scope.showPeopleLoader = true;
//                 opts.type = 'store_album';
//                 opts.type_id = id;
//                 ProfileService.findPeople(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.showPeopleLoader = false;
//                         $scope.ratedUsers = data.data.users_rated;
//                         if(data.data.users_rated.length == 0){
//                             $scope.message = $scope.i18n.dashboard.no_vote;
//                         }
//                     }else{
//                         $scope.showPeopleLoader = false;
//                     }
//                 });
//                 modalInstance.result.then(function (selectedItem) {
//                 }, function () {
//                     $log.info('Modal dismissed at: ' + new Date());
//                 });

//                 $scope.viewFriendProile = function(friendId){
//                     modalInstance.dismiss('cancel');
//                     $location.path('/viewfriend/'+friendId);
//                 };
//             };

//             $scope.rateThisAlbum = function(rating, album_id, type){
//                 var update = "";
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = 'store_album';
//                 opts.type_id = album_id;
//                 opts.rate = rating;
                
//                 if($scope.albumDetails.is_rated){
//                     update = "update";
//                 }else{
//                     update = "add";
//                 }
//                 $scope.waitRateResponse = true;
//                 ProfileService.rateThis(opts, update, function(data){
//                     if(data.code === 101 && data.message === "SUCCESS"){
//                         $scope.albumDetails.avg_rate = data.data.avg_rate;
//                         $scope.albumDetails.no_of_votes = data.data.no_of_votes;
//                         $scope.albumDetails.is_rated = true;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.is_rated = true;
//                     }
//                     $scope.waitRateResponse = false;
//                 });
//             };

//             $scope.removeAlbumRating = function(albumIndex){
//                 var opts = {};
//                 opts.user_id = APP.currentUser.id;
//                 opts.type = "store_album";
//                 opts.type_id = albumIndex;
//                 if($scope.waitRateResponse === false){
//                     $scope.waitRateResponse = true;
//                 }else{
//                     return;
//                 }
//                 ProfileService.removeRating(opts,function(data){
//                     if(data.code == 101 && data.message == "SUCCESS"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.avg_rate = data.data.avg_rate;
//                         $scope.albumDetails.no_of_votes = data.data.no_of_votes;
//                         $scope.albumDetails.is_rated = false;
//                     }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
//                         $scope.albumDetails.current_user_rate = 0;
//                         $scope.albumDetails.is_rated = false;
//                     }
//                 $scope.waitRateResponse = false;
//                 });
//             };
//             //console.log("hiiii" + rating );
//             $scope.averageRating = function(rating){
//                 return new Array(Math.ceil(rating));
//             };

//             $scope.blankStar = function(rating){
//                 if((5-Math.ceil(rating)) > 0){
//                     return new Array(5-Math.ceil(rating));
//                 }else{
//                     return 0;
//                 }
//             };

//             $scope.max = 5;
//             $scope.isReadonly = false;

// /*            $scope.rateThis = function(value, id, index){
//                 $scope.ratePost(value, id, index);
//             };*/
            
//             $scope.ratingStates = [
//                 {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
//             ];
//         },
//         link: function (scope, element, attrs) {
            

//         }
//     }
// }]);

