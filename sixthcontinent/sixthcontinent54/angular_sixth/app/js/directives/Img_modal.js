app.directive('allImgModal',['$timeout', '$location', function($timeout, $location) 
{
    return {
        restrict: 'A',
        scope : true,
        controller : function ($scope,$modal,$log, ProfileService, AlbumService, $routeParams)
        {
            $scope.createModal = function(index, viewalbum, leng, mainId, type,userdetails) 
            {
                $scope.parent_id    = mainId;
                $scope.parent_type  = type;
                $scope.media_index  = index;
                $scope.leng         = leng
                $scope.pre_visible  = true;
                $scope.next_visible = true;
                $scope.modal_loader = false;
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
                if($scope.viewalbum && $scope.viewalbum.length == 0)  $scope.viewalbum = viewalbum
                if(!$scope.viewalbum) $scope.viewalbum = viewalbum
                
                if(index === 0) $scope.pre_visible = false;
                if((leng-1)=== index) $scope.next_visible = false;


                $scope.tagged_friends_arry = function(index){
                    $scope.tagged_Friends = [];
                    if($scope.tagged_collection[index] === undefined){
                        angular.forEach($scope.viewalbum[index].tagged_friends_info, function(obj){
                            obj.user_id = obj.id;
                            obj.user_info = {};
                            obj.user_info.first_name = obj.first_name;
                            obj.user_info.last_name = obj.last_name;
                            $scope.tagged_Friends.push(obj)
                        });
                        $scope.tagged_collection[index] = $scope.tagged_Friends;
                    }else{
                       $scope.tagged_Friends = $scope.tagged_collection[index]
                    }
                    $scope.untagg_friend = JSON.parse(JSON.stringify($scope.tagged_Friends));
                };

                $scope.putFocus = function(){
                    document.getElementById('searchTagFriend').focus();
                }

                if($scope.parent_type === 'dashboard_post')
                {
                   $scope.media_id   = viewalbum[index].id;
                   $scope.img_src    = $scope.viewalbum[index].media_link;
                   $scope.img_date   = $scope.viewalbum[index].create_date.date;
                   $scope.user_id    = userdetails.id;
                   $scope.user_profile_image_thumb = userdetails.profile_image_thumb;
                   $scope.user_name = userdetails.first_name + ' ' + userdetails.last_name;

                }else if($scope.parent_type === 'user_profile_album_photo' || $scope.parent_type === 'club_album_photo' || $scope.parent_type === 'store_media' || $scope.parent_type === 'friend_album' || $scope.parent_type === 'friend_tagged_photos' || $scope.parent_type === 'user_tagged_photos' || $scope.parent_type === 'shop_post' || $scope.parent_type === 'club_post'){
                   $scope.media_id   = $scope.viewalbum[index].id;
                   $scope.img_src    = $scope.viewalbum[index].media_path;
                   $scope.user_id    = APP.currentUser.id;
                   $scope.user_profile_image_thumb = APP.currentUser.profile_img_thumb;
                   $scope.user_name = APP.currentUser.firstname + ' ' + APP.currentUser.lastname;
                   
                   if($scope.parent_type === 'club_album_photo'){
                        $scope.img_date   = '';
                        $scope.is_member= userdetails.is_member;
                        //console.log($scope.is_member);
                   }else{
                        if($scope.parent_type === 'user_profile_album_photo'){
                            $scope.tagged_friends_arry(index);
                            $scope.img_date   = userdetails[0].created_at.date;
                        }else if($scope.parent_type === 'store_media'){
                            $scope.img_date   = $scope.viewalbum[index].create_on.date;
                        }else{
                            $scope.img_date   = '' ;  
                        }
                        
                   }
                   if($scope.parent_type === 'friend_tagged_photos' || $scope.parent_type === 'user_tagged_photos'){
                        $scope.index = index;
                        $scope.toBelong = true;
                        if($routeParams.id && $scope.viewalbum[index].creater_id){
                            $scope.toBelong = undefined;
                        }else{
                            $scope.toBelong = true;
                        }

                        if ($scope.viewalbum[index].creater_id===APP.currentUser.id) $scope.toBelong = true;
                   }
                   
                }

                var modalInstance = $modal.open({
                    templateUrl: "app/views/img_modal.html",
                    controller: 'ModalController',
                    backdrop: 'static',
                    'static': true,
                    size: 'lg',
                    scope: $scope,
                });

                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                    $scope.tagged_Friends = [];
                    $scope.UpdateTag      = false;
                });

                $scope.untagg = function(type){
                    $scope.modal_loader = true;
                    var opts ={};
                    opts.user_id = APP.currentUser.id;
                    opts.untag_user_id = $routeParams.id? $routeParams.id : APP.currentUser.id;
                    opts.media_id = $scope.viewalbum[$scope.index].id;
                    
                    AlbumService.removeTaggedPhoto(opts,function(data){
                        
                        if(data.code===101){
                            modalInstance.close();
                            var tempIndex = $scope.tagged_photo.indexOf($scope.viewalbum[$scope.index])
                            $scope.tagged_photo.splice(tempIndex,1)
                            // console.log($scope.album,$scope.photo_of_you)
                            if($scope.tagged_photo.length == 0){
                                $scope.album = true;// this code and after this code is not showing any modification
                                $scope.photo_of_you =false;//value set at modal is not reflecting at page
                                $("#taggedPhoto").addClass("ng-hide");//that why I added jquery to do the work
                                $("#albumColl").removeClass("ng-hide");
                            }
                        }else{
                            $scope.modal_loader = false;
                        }
                    })
                }

                $scope.change_image = function (index, viewablum, leng,id,type,changetype){
                    // 
                  $scope.pre_visible  = true;
                  $scope.modal_loader = true;
                  $scope.next_visible = true;
                  $scope.img_src = "";
                  $scope.media_index  = (changetype == 'pre' ? index - 1 : index + 1);
                  if($scope.media_index === 0) $scope.pre_visible = false;
                  if((leng-1) === $scope.media_index) $scope.next_visible = false;
                  
                  if($scope.parent_type === 'dashboard_post'){
                       $scope.media_id   = $scope.viewalbum[$scope.media_index].id;
                       $scope.img_src    = $scope.viewalbum[$scope.media_index].media_link;
                       $scope.img_date   = $scope.viewalbum[$scope.media_index].create_date.date;
                    }else if($scope.parent_type === 'user_profile_album_photo' || $scope.parent_type === 'club_album_photo' || $scope.parent_type === 'store_media' || $scope.parent_type === 'friend_album' ||  $scope.parent_type === 'friend_tagged_photos' || $scope.parent_type === 'user_tagged_photos' || $scope.parent_type === 'shop_post' || $scope.parent_type === 'club_post'){
                       $scope.media_id   = $scope.viewalbum[$scope.media_index].id;
                       $scope.img_src    = $scope.viewalbum[$scope.media_index].media_path;
                       $scope.user_id    = APP.currentUser.id;
                       $scope.user_profile_image_thumb = APP.currentUser.profile_img_thumb;
                       $scope.user_name = APP.currentUser.firstname + ' ' + APP.currentUser.lastname;
                       if($scope.parent_type === 'user_profile_album_photo'){
                            $scope.img_date   = userdetails[0].created_at.date;
                            $scope.tagged_friends_arry($scope.media_index);
                       }
                       if($scope.parent_type === 'friend_tagged_photos' || $scope.parent_type === 'user_tagged_photos'){
                            
                            $scope.toBelong = true;
                            if($routeParams.id && $scope.viewalbum[$scope.media_index].creater_id){
                                $scope.toBelong = undefined;
                            }else{
                                $scope.toBelong = true;
                            }
                            if ($scope.viewalbum[$scope.media_index].creater_id===APP.currentUser.id) $scope.toBelong = true;
                       }
                    }
                    $timeout(function(){
                        $scope.modal_loader = false
                    },1000);
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
                
                $scope.Tagtoggle = function(){
                    $scope.UpdateTag = !$scope.UpdateTag;
                }

                $scope.taggService = function(){
                    var pre_visible_status = $scope.pre_visible;
                    var next_visible_status = $scope.next_visible;
                    $scope.pre_visible = false;
                    $scope.next_visible = false;
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    opts.album_id = $scope.parent_id;
                    opts.post_type = 1;
                    opts.media_id = [$scope.media_id];
                    var frnd_array = []
                    angular.forEach($scope.tagged_Friends,function(index){
                        frnd_array.push(index.user_id);
                    });
                    opts.tagged_friends = frnd_array.join(',')
                    $scope.UpdateTag = false;
                    $scope.TagLoader = true;
                    if($scope.tagged_Friends.length > 0 ){
                       AlbumService.photoTaging(opts,function(data){
                            if(data.code === 101){
                                $scope.choose = true;
                                $scope.TagLoader = false;
                                angular.forEach($scope.tagged_Friends,function(obj){
                                    if(!obj.first_name) obj.first_name = obj.user_info.first_name;
                                    if(!obj.last_name) obj.last_name = obj.user_info.last_name;
                                });
                                
                                $scope.untagg_friend = JSON.parse(JSON.stringify($scope.tagged_Friends));
                            }
                            $scope.pre_visible = pre_visible_status;
                            $scope.next_visible = next_visible_status;
                            $scope.viewalbum[$scope.media_index].tagged_friends_info = $scope.untagg_friend
                        }) 
                   }else{
                        if($scope.untagg_friend.length > 0){
                            var friend_id = [];
                            
                            angular.forEach($scope.untagg_friend, function(friend){
                                id_on = friend.id ? friend.id : friend.user_info.id;
                                friend_id.push(id_on)
                            })
                            var opts ={};
                            opts.user_id = APP.currentUser.id;
                            opts.untag_user_id = friend_id.join(',');
                            opts.media_id = $scope.media_id;

                            AlbumService.removeTaggedPhoto(opts,function(data){
                                if(data.code===101){
                                    $scope.viewalbum[$scope.media_index].tagged_friends_info = $scope.untagg_friend
                                }else{
                                }
                            })
                            $scope.untagg_friend = [];
                            $scope.TagLoader = false;
                            $scope.pre_visible = pre_visible_status;
                            $scope.next_visible = next_visible_status;                            
                        }else{
                            $scope.TagLoader = false;
                            $scope.pre_visible = pre_visible_status;
                            $scope.next_visible = next_visible_status; 
                        }
                   }
                    
                }

                $scope.selectFriend = function(friendInfo){
                    $scope.dublicate = false;
                    $scope.choose = false;  
                    angular.forEach($scope.tagged_Friends,function(index){
                        if(index.user_id === friendInfo.user_id){
                            $scope.dublicate = true;
                        }
                    });

                    if($scope.dublicate === false){
                        $scope.tagged_Friends.push(friendInfo);
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
                
                // stop the service for loading more service
                $scope.lostFocus = function(){
                    $timeout(function(){
                        $scope.friends = [];
                        $scope.cancelFriendSearch = true;
                        $scope.friendTagIndex = -1;
                        angular.element('#searchTagFriend').val("");
                        $scope.showFriendList = false;
                    },300);
                };
                // Remove selected friend
                $scope.removeTagFriend = function(friendIndex){
                    $scope.tagged_Friends.splice(friendIndex,1);
                    if($scope.tagged_Friends.length===0) {
                      $scope.choose = true;  
                    }
                };

                
                $scope.getFile = function () {
                    /*var tempopts = {};
                        tempopts.user_id = APP.currentUser.id;
                        tempopts.postid = attrs.postId;
                        tempopts.body = scope.i18n.editprofile.comment_image_test;
                        tempopts.comment_type = '0';
                        tempopts.image_id = '';
                        tempopts.comment_id = '';
                    var len = scope.commentFiles.length;
                    ProfileService.createDashboardCommentImage(tempopts, scope.commentFiles[0], function(data){
                        if(data.code == 101) {
                            scope.comment_id = data.data.id;
                            scope.imgSrc.push(data.data);
                            scope.image_id.push(data.data.media_id);
                            tempopts.comment_id = scope.comment_id;
                            scope.selectInProgress.splice(0,1);
                            for(j=1; j < len; j++){
                                ProfileService.createDashboardCommentImage(tempopts, scope.commentFiles[j], function(data){
                                    if(data.code == 101) {
                                        scope.comment_id = data.data.id;
                                        scope.imgSrc.push(data.data);
                                        scope.image_id.push(data.data.media_id);
                                        scope.selectInProgress.splice(0,1);
                                    }else{
                                        scope.commentErrCls = 'text-red';
                                        scope.commentErrMsg = scope.i18n.dashboard.postcomment.upload_media_fail;
                                    }
                                });
                            }
                        }else{
                            scope.commentErrCls = 'text-red';
                            scope.commentErrMsg = scope.i18n.dashboard.postcomment.upload_media_fail;
                        }
                    });
                    setTimeout(function(){
                        scope.commentErrCls = '';
                        scope.commentErrMsg = '';
                    }, 15000);
                    */
                };

                $scope.removeImage = function(index) {
                    /*var tempMedia = scope.image_id[index];
                    var opts = {};
                        opts.user_id = APP.currentUser.id;
                        opts.postid = attrs.postId;
                        opts.image_id = tempMedia;
                    ProfileService.deleteDashboardMediaComments(opts, function(data){
                      if(data.code == 101) {
                        scope.imgSrc.splice(index, 1);
                        scope.isInProgress.splice(index, 1);
                        if(scope.imgSrc.length == 0){
                            scope.commentFiles == [];
                            scope.file = [];
                        }
                        scope.image_id.splice(index, 1);
                        if(scope.imgSrc.length == 0){
                            scope.selectInProgress = [];
                            scope.showImgSelect = true;
                            scope.showPreview = false;
                        }
                      } else {
                        scope.showImgSelect = true;
                        scope.showPreview = true;
                        scope.commentErrCls = 'text-red';
                        scope.commentErrMsg = scope.i18n.dashboard.postcomment.remove_img_fail;
                      }
                        setTimeout(function(){
                        scope.commentErrCls = '';
                        scope.commentErrMsg = '';
                        }, 15000);
                    });*/
                };

                $scope.addComment = function(){
                    /*scope.postIndx = attrs.postIndx;
                    scope.comments = attrs.loadComment;
                    scope.finalCommentInProcess = true;
                    scope.commentErrMsg = "";
                    scope.commentErrCls = '';
                    var filescount = scope.imgSrc.length;
                    if ((scope.commentText == undefined  || scope.commentText == '') && filescount == 0) {
                        scope.finalCommentInProcess = false;
                        scope.commentErrCls = 'text-red';
                        scope.commentErrMsg = scope.i18n.editprofile.photo_update;
                        setTimeout(function(){
                            scope.commentErrCls = '';
                            scope.commentErrMsg = '';
                        },15000);
                        return false;
                    }
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    opts.postid = attrs.postId;
                    opts.body = scope.commentText;
                    opts.media_id = [];
                    opts.comment_id = "";
                    if(scope.image_id.length != 0){
                      opts.media_id = scope.image_id;
                    }
                    if(scope.comment_id != ''){
                      opts.comment_id = scope.comment_id;  
                    }
                    opts.comment_type = '1';
                    ProfileService.createDashboardCommentFinal(opts, function(data){
                        if(data.code == 101) {
                            scope.commentText = '';
                            scope.post.comments.push(data.data);
                            scope.finalCommentInProcess = false;
                            scope.commentErrMsg = '';
                            scope.commentErrCls = '';
                            scope.commentText = '';
                            scope.commentFiles = [];
                            scope.imgSrc = [];
                            scope.file = [];
                            scope.showPreview = false;
                            scope.showImgSelect = true;
                            scope.comment_id = '';
                        } else {
                            scope.finalCommentInProcess = false;
                            scope.commentErrCls = 'text-red';
                            scope.commentErrMsg = scope.i18n.editprofile.comment_no_post;
                            scope.commentFiles = [];
                            scope.imgSrc = [];
                            scope.file = []
                            scope.showPreview = false;
                            scope.showImgSelect = true;
                            scope.comment_id = '';
                        }
                        setTimeout(function(){
                            scope.commentErrCls = '';
                            scope.commentErrMsg = '';
                        }, 15000);
                    });*/
                };

                $scope.rateThisAlbum = function(rating, album_id, type){
                var update = "";
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = 'club_album';
                opts.type_id = album_id;
                opts.rate = rating;
                
                if($scope.albumDetails.is_rated){
                    update = "update";
                }else{
                    update = "add";
                }
                $scope.waitRateResponse = true;
                ProfileService.rateThis(opts, update, function(data){
                    if(data.code === 101 && data.message === "SUCCESS"){
                        $scope.albumDetails.avg_rate = data.data.avg_rate;
                        $scope.albumDetails.no_of_votes = data.data.no_of_votes;
                        $scope.albumDetails.is_rated = true;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.is_rated = true;
                    }
                    $scope.waitRateResponse = false;
                });
            };
            $scope.waitRateResponse = false;
            $scope.ratePicture = function(rating, picture_id, mediaIndex){
                    var update = "";
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    if($scope.parent_type == 'friend_album'){
                        opts.type = 'user_profile_album_photo'
                    }else {
                        opts.type = $scope.parent_type;
                    }
                    opts.type_id = picture_id;
                    opts.rate = rating;
                    if($scope.viewalbum[mediaIndex].is_rated){
                        update = "update";
                    }else{
                        update = "add";
                    }
                    $scope.waitRateResponse = true;
                    ProfileService.rateThis(opts, update, function(data){
                        if(data.code === 101 && data.message === "SUCCESS"){
                            $scope.viewalbum[mediaIndex].avg_rate = data.data.avg_rate;
                            $scope.viewalbum[mediaIndex].no_of_votes = data.data.no_of_votes;
                            $scope.viewalbum[mediaIndex].is_rated = true;
                        }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                            $scope.viewalbum[mediaIndex].current_user_rate = 0;
                            $scope.viewalbum[mediaIndex].is_rated = true;
                        }
                        $scope.waitRateResponse = false;
                    });
                };
            $scope.removeRating = function(pictureIndex , mediaIndex){
                var opts = {};
                opts.user_id = APP.currentUser.id;
                if($scope.parent_type == 'friend_album'){
                    opts.type = 'user_profile_album_photo'
                }else {
                    opts.type = $scope.parent_type;
                }
                opts.type_id = pictureIndex;
                if($scope.waitRateResponse === false){
                    $scope.waitRateResponse = true;
                }else{
                    return;
                }
                ProfileService.removeRating(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.viewalbum[mediaIndex].current_user_rate = 0;
                        $scope.viewalbum[mediaIndex].avg_rate = data.data.avg_rate;
                        $scope.viewalbum[mediaIndex].no_of_votes = data.data.no_of_votes;
                        $scope.viewalbum[mediaIndex].is_rated = false;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.viewalbum[mediaIndex].current_user_rate = 0;
                        $scope.viewalbum[mediaIndex].is_rated = false;
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
                var modalInstance = $modal.open({
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
                        $scope.ratedUsers = data.data.users_rated;
                        if(data.data.users_rated.length == 0){
                            $scope.message = $scope.i18n.dashboard.no_vote;
                        }
                    }else{
                        $scope.showPeopleLoader = false;
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                $scope.viewFriendProile = function(friendId){
                    modalInstance.dismiss('cancel');
                    $location.path('/viewfriend/'+friendId);
                };
            };
            //
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

            $scope.max = 5;
            $scope.isReadonly = false;
            $scope.viewUserProfile = function(friendId){
                if(friendId == APP.currentUser.id){
                    modalInstance.dismiss('cancel');
                    $location.path('profiles');
                }else{
                    modalInstance.dismiss('cancel');
                    $location.path('/viewfriend/'+friendId);
                }
            };

            /*  $scope.rateThis = function(value, id, index){
                $scope.ratePost(value, id, index);
            };*/
            
            $scope.ratingStates = [
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            ];
            }
        }
    };
}]);


app.directive('rateMe',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
            templateUrl: 'app/views/rating_star_comment.html',
            restrict: "E",
            scope: true,
            controller : function($scope, $modal, $log, ProfileService){
                $scope.hovering = function(value) {
                    $scope.overStar = value;
                    $scope.percent = 100 * (value / $scope.max);
                };
                $scope.averageVoting = 0;
                $scope.vote_count = 0;
                $scope.waitRateResponse = false;
                $scope.findPeopleRate = function(id, type, count_Vote){
                    if(count_Vote === 0 ){
                        return false;
                    }
                    var opts = {};
                    $scope.ratedUsers = {};
                    var modalInstance = $modal.open({
                                templateUrl: 'app/views/find_people.html',
                                controller: 'ModalController',
                                size: 'lg',
                                scope: $scope,
                    });
                    $scope.showPeopleLoader = true;
                    opts.type = type;
                    opts.type_id = id;
                    opts.session_id = APP.currentUser.id;
                    ProfileService.findPeople(opts,function(data){
                        if(data.code == 101 && data.message == "SUCCESS"){
                            $scope.showPeopleLoader = false;
                            $scope.ratedUsers = data.data.users_rated;
                            if(data.data.users_rated.length == 0){
                                $scope.message = $scope.i18n.dashboard.no_vote;
                            }
                        }else{
                            $scope.showPeopleLoader = false;
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                    $scope.viewFriendProile = function(friendId){
                        modalInstance.dismiss('cancel');
                        $location.path('/viewfriend/'+friendId);
                    };
                };

                $scope.rateComment = function(rating, comment_id, postIndex, commentIndex){
                    var update = "";
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    opts.type = "dashboard_post_comment";
                    opts.type_id = comment_id;
                    opts.rate = rating;
                    if($scope.userPostList[postIndex].comments[commentIndex].is_rated){
                        update = "update";
                    }else{
                        update = "add";
                    }
                    $scope.waitRateResponse = true;
                    ProfileService.rateThis(opts, update, function(data){
                        if(data.code === 101 && data.message === "SUCCESS"){
                            $scope.userPostList[postIndex].comments[commentIndex].avg_rate = data.data.avg_rate;
                            $scope.userPostList[postIndex].comments[commentIndex].no_of_votes = data.data.no_of_votes;
                            $scope.userPostList[postIndex].comments[commentIndex].is_rated = true;
                        }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                            $scope.userPostList[postIndex].comments[commentIndex].current_user_rate = 0;
                            $scope.userPostList[postIndex].comments[commentIndex].is_rated = true;
                        }
                        $scope.waitRateResponse = false;
                    });
                };

                $scope.removeCommentRating = function(comment_id, postIndx, indx){
                    var opts = {};
                    opts.user_id = APP.currentUser.id;
                    opts.type = "dashboard_post_comment";
                    opts.type_id = comment_id;
                    if($scope.WaitDeleteResponse === false){
                        $scope.WaitDeleteResponse = true;
                        $scope.waitRateResponse = true;
                    }else{
                        return;
                    }
                    ProfileService.removeRating(opts,function(data){
                        if(data.code == 101 && data.message == "SUCCESS"){
                            $scope.userPostList[postIndx].comments[indx].current_user_rate = 0;
                            $scope.userPostList[postIndx].comments[indx].avg_rate = data.data.avg_rate;
                            $scope.userPostList[postIndx].comments[indx].no_of_votes = data.data.no_of_votes;
                            $scope.userPostList[postIndx].comments[indx].is_rated = false;
                        }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                            $scope.userPostList[postIndx].comments[indx].current_user_rate = 0;
                            $scope.userPostList[postIndx].comments[indx].is_rated = false;
                        }
                    $scope.WaitDeleteResponse = false;
                    $scope.waitRateResponse = false;
                    });
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

                $scope.max = 5;
                $scope.isReadonly = false;

                /*  $scope.rateThis = function(value, id, index){
                    $scope.ratePost(value, id, index);
                };*/

                $scope.ratingStates = [
                    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'}
                ];
            },
            link: function (scope, element, attrs) {
            }
      }
}]);
app.directive('rateAlbumDir',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
        templateUrl: 'app/views/rating_star_album.html',
        restrict: "E",
        scope: true,
        controller : function($scope, $modal, $log, ProfileService){
            $scope.hovering = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            };
            $scope.averageVoting = 0;
            $scope.vote_count = 0;
            $scope.waitRateResponse = false;
            $scope.findPeopleRate = function(id, type, count_Vote){
                //console.log(count_Vote);
                if(count_Vote === 0 ){
                    return false;
                }
                var opts = {};
                $scope.ratedUsers = {};
                var modalInstance = $modal.open({
                            templateUrl: 'app/views/find_people.html',
                            controller: 'ModalController',
                            size: 'lg',
                            scope: $scope,
                });
                $scope.showPeopleLoader = true;
                opts.type = type;
                opts.type_id = id;
                opts.session_id = APP.currentUser.id;
                ProfileService.findPeople(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.showPeopleLoader = false;
                        $scope.ratedUsers = data.data.users_rated;
                        if(data.data.users_rated.length == 0){
                            $scope.message = $scope.i18n.dashboard.no_vote;
                        }
                    }else{
                        $scope.showPeopleLoader = false;
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                $scope.viewFriendProile = function(friendId){
                    modalInstance.dismiss('cancel');
                    $location.path('/viewfriend/'+friendId);
                };
            };

            $scope.rateThisAlbum = function(rating, album_id, type){
                var update = "";
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = type;
                opts.type_id = album_id;
                opts.rate = rating;
                
                if($scope.albumDetails.is_rated){
                    update = "update";
                }else{
                    update = "add";
                }
                $scope.waitRateResponse = true;
                ProfileService.rateThis(opts, update, function(data){
                    if(data.code === 101 && data.message === "SUCCESS"){
                        $scope.albumDetails.avg_rate = data.data.avg_rate;
                        $scope.albumDetails.no_of_votes = data.data.no_of_votes;
                        $scope.albumDetails.is_rated = true;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.is_rated = true;
                    }
                    $scope.waitRateResponse = false;
                });
            };

            $scope.removeAlbumRating = function(albumIndex){
                //console.log($scope.waitRateResponse);
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = "user_profile_album";
                opts.type_id = albumIndex;
                if($scope.waitRateResponse === false){
                    $scope.waitRateResponse = true;
                }else{
                    return;
                }
                ProfileService.removeRating(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.avg_rate = data.data.avg_rate;
                        $scope.albumDetails.no_of_votes = data.data.no_of_votes;
                        $scope.albumDetails.is_rated = false;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.is_rated = false;
                    }
                $scope.waitRateResponse = false;
                });
            };
            //console.log("hiiii" + rating );
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

            $scope.max = 5;
            $scope.isReadonly = false;

/*            $scope.rateThis = function(value, id, index){
                $scope.ratePost(value, id, index);
            };*/

            $scope.ratingStates = [
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            ];
        },
        link: function (scope, element, attrs) {
            

        }
    }
}]);
app.directive('rateMeClub',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
        templateUrl: 'app/views/ratingStarClub.html',
        restrict: "E",
        scope: true,
        controller : function($scope, $modal, $log, ProfileService){
            $scope.hovering = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            };
            $scope.avg_rate = true;
            $scope.vote_count =0
            $scope.averageVoting = 0;
            $scope.vote_count = 0;
            $scope.waitRateResponse = false;
            $scope.findPeopleRate = function(id, count_Vote){
                if(count_Vote === 0 ){
                    return false;
                }
                var opts = {};
                $scope.ratedUsers = {};
                var modalInstance = $modal.open({
                            templateUrl: 'app/views/find_people.html',
                            controller: 'ModalController',
                            size: 'lg',
                            scope: $scope,
                });
                $scope.showPeopleLoader = true;
                opts.type = "club_post_comment";
                opts.type_id = id;
                opts.session_id = APP.currentUser.id;
                ProfileService.findPeople(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.showPeopleLoader = false;
                        $scope.ratedUsers = data.data.users_rated;
                        if(data.data.users_rated.length == 0){
                            $scope.message = $scope.i18n.dashboard.no_vote;
                        }
                    }else{
                        $scope.showPeopleLoader = false;
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                $scope.viewFriendProile = function(friendId){
                    modalInstance.dismiss('cancel');
                    $location.path('/viewfriend/'+friendId);
                };
            };

            $scope.rateComment = function(rating, comment_id, postIndex, commentIndex){
                var update = "";
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = "club_post_comment";
                opts.type_id = comment_id;
                opts.rate = rating;
                if($scope.posts[postIndex].comments[commentIndex].is_rated){
                    update = "update";
                }else{
                    update = "add";
                }
                $scope.waitRateResponse = true;
                ProfileService.rateThis(opts, update, function(data){
                    if(data.code === 101 && data.message === "SUCCESS"){
                        $scope.posts[postIndex].comments[commentIndex].avg_rate = data.data.avg_rate;
                        $scope.posts[postIndex].comments[commentIndex].no_of_votes = data.data.no_of_votes;
                        $scope.posts[postIndex].comments[commentIndex].is_rated = true;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.posts[postIndex].comments[commentIndex].current_user_rate = 0;
                        $scope.posts[postIndex].comments[commentIndex].is_rated = true;
                    }
                    $scope.waitRateResponse = false;
                });
            };

            $scope.removeCommentRating = function(comment_id, postIndx, indx){
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = "club_post_comment";
                opts.type_id = comment_id;
                if($scope.WaitDeleteResponse === false){
                    $scope.WaitDeleteResponse = true;
                    $scope.waitRateResponse = true;
                }else{
                    return;
                }
                ProfileService.removeRating(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.posts[postIndx].comments[indx].current_user_rate = 0;
                        $scope.posts[postIndx].comments[indx].avg_rate = data.data.avg_rate;
                        $scope.posts[postIndx].comments[indx].no_of_votes = data.data.no_of_votes;
                        $scope.posts[postIndx].comments[indx].is_rated = false;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.posts[postIndx].comments[indx].current_user_rate = 0;
                        $scope.posts[postIndx].comments[indx].is_rated = false;
                    }
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
                });
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

            $scope.max = 5;
            $scope.isReadonly = false;

            /*  $scope.rateThis = function(value, id, index){
                $scope.ratePost(value, id, index);
            };*/

            $scope.ratingStates = [
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            ];
        },
        link: function (scope, element, attrs) {
            

        }
    }
}]);
    
app.directive('rateShopComment',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
        templateUrl: 'app/views/ratingStarClub.html',
        restrict: "E",
        scope: true,
        controller : function($scope, $modal, $log, ProfileService){
            $scope.hovering = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            };
            $scope.avg_rate = true;
            $scope.vote_count =0
            $scope.averageVoting = 0;
            $scope.vote_count = 0;
            $scope.waitRateResponse = false;
            $scope.WaitDeleteResponse = false ;
            $scope.findPeopleRate = function(id, count_Vote){
                if(count_Vote === 0 ){
                    return false;
                }
                var opts = {};
                $scope.ratedUsers = {};
                var modalInstance = $modal.open({
                            templateUrl: 'app/views/find_people.html',
                            controller: 'ModalController',
                            size: 'lg',
                            scope: $scope,
                });
                $scope.showPeopleLoader = true;
                opts.type = "store_post_comment";
                opts.type_id = id;
                opts.session_id = APP.currentUser.id;
                ProfileService.findPeople(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.showPeopleLoader = false;
                        $scope.ratedUsers = data.data.users_rated;
                        if(data.data.users_rated.length == 0){
                            $scope.message = $scope.i18n.dashboard.no_vote;
                        }
                    }else{
                        $scope.showPeopleLoader = false;
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                $scope.viewFriendProile = function(friendId){
                    modalInstance.dismiss('cancel');
                    $location.path('/viewfriend/'+friendId);
                };
            };

            $scope.rateComment = function(rating, comment_id, postIndex, commentIndex){
                var update = "";
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = "store_post_comment";
                opts.type_id = comment_id;
                opts.rate = rating;
                if($scope.posts[postIndex].comments[commentIndex].is_rated){
                    update = "update";
                }else{
                    update = "add";
                }
                $scope.waitRateResponse = true;
                ProfileService.rateThis(opts, update, function(data){
                    if(data.code === 101 && data.message === "SUCCESS"){
                        $scope.posts[postIndex].comments[commentIndex].avg_rate = data.data.avg_rate;
                        $scope.posts[postIndex].comments[commentIndex].no_of_votes = data.data.no_of_votes;
                        $scope.posts[postIndex].comments[commentIndex].is_rated = true;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.posts[postIndex].comments[commentIndex].current_user_rate = 0;
                        $scope.posts[postIndex].comments[commentIndex].is_rated = true;
                    }
                    $scope.waitRateResponse = false;
                });
            };

            $scope.removeCommentRating = function(comment_id, postIndx, indx){
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = "store_post_comment";
                opts.type_id = comment_id;
                if($scope.WaitDeleteResponse === false){
                    $scope.WaitDeleteResponse = true;
                    $scope.waitRateResponse = true;
                }else{
                    return;
                }
                ProfileService.removeRating(opts,function(data){
                   if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.posts[postIndx].comments[indx].current_user_rate = 0;
                        $scope.posts[postIndx].comments[indx].avg_rate = data.data.avg_rate;
                        $scope.posts[postIndx].comments[indx].no_of_votes = data.data.no_of_votes;
                        $scope.posts[postIndx].comments[indx].is_rated = false;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.posts[postIndx].comments[indx].current_user_rate = 0;
                        $scope.posts[postIndx].comments[indx].is_rated = false;
                    }
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
                });
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

            $scope.max = 5;
            $scope.isReadonly = false;

/*            $scope.rateThis = function(value, id, index){
                $scope.ratePost(value, id, index);
            };*/

            $scope.ratingStates = [
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            ];
        },
        link: function (scope, element, attrs) {
            

        }
    }
}]);

app.controller('rateAlbum',['$scope', '$modal', '$log', '$location', 'ProfileService', function($scope, $modal, $log, $location, ProfileService){

        $scope.hovering = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.averageVoting = 0;
        $scope.vote_count = 0;
        $scope.waitRateResponse = false;
        $scope.findPeopleRate = function(id, type, count_Vote){
            if(count_Vote === 0 ){
                return false;
            }
            var opts = {};
            $scope.ratedUsers = {};
            var modalInstance = $modal.open({
                        templateUrl: 'app/views/find_people.html',
                        controller: 'ModalController',
                        size: 'lg',
                        scope: $scope,
            });
            $scope.showPeopleLoader = true;
            opts.type = type;
            opts.type_id = id;
            opts.session_id = APP.currentUser.id;
            ProfileService.findPeople(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.showPeopleLoader = false;
                    $scope.ratedUsers = data.data.users_rated;
                    if(data.data.users_rated.length == 0){
                        $scope.message = $scope.i18n.dashboard.no_vote;
                    }
                }else{
                    $scope.showPeopleLoader = false;
                }
            });
            modalInstance.result.then(function (selectedItem) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

            $scope.viewFriendProile = function(friendId){
                modalInstance.dismiss('cancel');
                $location.path('/viewfriend/'+friendId);
            };
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

        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];
}]);
app.directive('rateAlbumDirClub',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
        templateUrl: 'app/views/rating_star_album_club.html',
        restrict: "E",
        scope: true,
        controller : function($scope, $modal, $log, ProfileService){
            $scope.hovering = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            };
            $scope.averageVoting = 0;
            $scope.vote_count = 0;
            $scope.waitRateResponse = false;
            $scope.findPeopleRate = function(id, type, count_Vote){
                if(count_Vote === 0 ){
                    return false;
                }
                var opts = {};
                $scope.ratedUsers = {};
                var modalInstance = $modal.open({
                            templateUrl: 'app/views/find_people.html',
                            controller: 'ModalController',
                            size: 'lg',
                            scope: $scope,
                });
                $scope.showPeopleLoader = true;
                opts.type = 'club_album';
                opts.type_id = id;
                opts.session_id = APP.currentUser.id;
                ProfileService.findPeople(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.showPeopleLoader = false;
                        $scope.ratedUsers = data.data.users_rated;
                        if(data.data.users_rated.length == 0){
                            $scope.message = $scope.i18n.dashboard.no_vote;
                        }
                    }else{
                        $scope.showPeopleLoader = false;
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                $scope.viewFriendProile = function(friendId){
                    modalInstance.dismiss('cancel');
                    $location.path('/viewfriend/'+friendId);
                };
            };

            $scope.rateThisAlbum = function(rating, album_id, type){
                var update = "";
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = 'club_album';
                opts.type_id = album_id;
                opts.rate = rating;
                
                if($scope.albumDetails.is_rated){
                    update = "update";
                }else{
                    update = "add";
                }
                $scope.waitRateResponse = true;
                ProfileService.rateThis(opts, update, function(data){
                    if(data.code === 101 && data.message === "SUCCESS"){
                        $scope.albumDetails.avg_rate = data.data.avg_rate;
                        $scope.albumDetails.no_of_votes = data.data.no_of_votes;
                        $scope.albumDetails.is_rated = true;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.is_rated = true;
                    }
                    $scope.waitRateResponse = false;
                });
            };

            $scope.removeAlbumRating = function(albumIndex){
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = "club_album";
                opts.type_id = albumIndex;
                if($scope.waitRateResponse === false){
                    $scope.waitRateResponse = true;
                }else{
                    return;
                }
                ProfileService.removeRating(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.avg_rate = data.data.avg_rate;
                        $scope.albumDetails.no_of_votes = data.data.no_of_votes;
                        $scope.albumDetails.is_rated = false;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.is_rated = false;
                    }
                $scope.waitRateResponse = false;
                });
            };
            //console.log("hiiii" + rating );
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

            $scope.max = 5;
            $scope.isReadonly = false;

/*            $scope.rateThis = function(value, id, index){
                $scope.ratePost(value, id, index);
            };*/
            
            $scope.ratingStates = [
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            ];
        },
        link: function (scope, element, attrs) {
            

        }
    }
}]);
app.directive('rateAlbumDirShop',['$modal', '$log', '$location', 'ProfileService', function($modal, $log, $location, ProfileService){
    return {
        templateUrl: 'app/views/rating_star_album_club.html',
        restrict: "E",
        scope: true,
        controller : function($scope, $modal, $log, ProfileService){
            $scope.hovering = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            };
            $scope.averageVoting = 0;
            $scope.vote_count = 0;
            $scope.waitRateResponse = false;
            $scope.findPeopleRate = function(id, type, count_Vote){
                if(count_Vote === 0 ){
                    return false;
                }
                var opts = {};
                $scope.ratedUsers = {};
                var modalInstance = $modal.open({
                            templateUrl: 'app/views/find_people.html',
                            controller: 'ModalController',
                            size: 'lg',
                            scope: $scope,
                });
                $scope.showPeopleLoader = true;
                opts.type = 'store_album';
                opts.type_id = id;
                opts.session_id = APP.currentUser.id;
                ProfileService.findPeople(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.showPeopleLoader = false;
                        $scope.ratedUsers = data.data.users_rated;
                        if(data.data.users_rated.length == 0){
                            $scope.message = $scope.i18n.dashboard.no_vote;
                        }
                    }else{
                        $scope.showPeopleLoader = false;
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                $scope.viewFriendProile = function(friendId){
                    modalInstance.dismiss('cancel');
                    $location.path('/viewfriend/'+friendId);
                };
            };

            $scope.rateThisAlbum = function(rating, album_id, type){
                var update = "";
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = 'store_album';
                opts.type_id = album_id;
                opts.rate = rating;
                
                if($scope.albumDetails.is_rated){
                    update = "update";
                }else{
                    update = "add";
                }
                $scope.waitRateResponse = true;
                ProfileService.rateThis(opts, update, function(data){
                    if(data.code === 101 && data.message === "SUCCESS"){
                        $scope.albumDetails.avg_rate = data.data.avg_rate;
                        $scope.albumDetails.no_of_votes = data.data.no_of_votes;
                        $scope.albumDetails.is_rated = true;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.is_rated = true;
                    }
                    $scope.waitRateResponse = false;
                });
            };

            $scope.removeAlbumRating = function(albumIndex){
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type = "store_album";
                opts.type_id = albumIndex;
                if($scope.waitRateResponse === false){
                    $scope.waitRateResponse = true;
                }else{
                    return;
                }
                ProfileService.removeRating(opts,function(data){
                    if(data.code == 101 && data.message == "SUCCESS"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.avg_rate = data.data.avg_rate;
                        $scope.albumDetails.no_of_votes = data.data.no_of_votes;
                        $scope.albumDetails.is_rated = false;
                    }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                        $scope.albumDetails.current_user_rate = 0;
                        $scope.albumDetails.is_rated = false;
                    }
                $scope.waitRateResponse = false;
                });
            };
            //console.log("hiiii" + rating );
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

            $scope.max = 5;
            $scope.isReadonly = false;

/*            $scope.rateThis = function(value, id, index){
                $scope.ratePost(value, id, index);
            };*/
            
            $scope.ratingStates = [
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            ];
        },
        link: function (scope, element, attrs) {
            

        }
    }
}]);

