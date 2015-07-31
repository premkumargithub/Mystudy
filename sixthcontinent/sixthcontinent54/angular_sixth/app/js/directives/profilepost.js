
//Displaying the comment post form for store detail
app.directive('profileCommentForm',['ProfileService', 'fileReader', '$http', '$timeout', '$interval', function(ProfileService, fileReader, $http, $timeout, $interval) {
    return {
      restrict: 'E',
      templateUrl: 'app/views/profile_comment_form.html',
      scope : true,
      link : function(scope, elem, attrs){
        scope.showPreview = false;
        scope.comment_id = '';
        scope.image_id = [];
        scope.imgSrc = [];
        scope.isInProgress = [];
        scope.commentFiles = [];
        scope.selectInProgress = [];
        scope.imgRes = 1;
        scope.commentErrMsg = '';
        scope.commentErrCls = '';
        scope.getFile = function () {
            var tempopts = {};
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
        };

      //remove iamge from preview array
      scope.removeImage = function(index) {
        var tempMedia = scope.image_id[index];
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
        });
      };

      scope.res = 0;
      scope.addComment = function(){
        scope.postIndx = attrs.postIndx;
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
            }, 15000);
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

        opts.tagging = scope.taggedObject;
        if(scope.res == 0){
            scope.res = 1;
            ProfileService.createDashboardCommentFinal(opts, function(data){
                scope.res = 0;
              if(data.code == 101) {
                scope.commentText = '';
                scope.post.comments.push(data.data);
                scope.post.comment_count++;
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
            });
            $timeout(function(){
                scope.commentErrCls = '';
                scope.commentErrMsg = '';
            }, 15000);
        }
      };
    }
  };
}]);

//Displaying the post form for store detail

app.directive('profilePostList', function($routeParams, $modal, $log, $location, ProfileService, focus) {
    return {
      restrict: 'E',
      controller: function ($scope, $timeout,$sce, $compile){
        $scope.showComments = [];
        $scope.commentsLength = [];
        $scope.userPostList = [];
        $scope.showComments = [];
        $scope.commentsLength = [];
        $scope.noPostList = false; 
        $scope.isLoadPost = true;
        $scope.textLimit = APP.post_charecter_limit;
        $scope.isSingleProfile = false;
        if($routeParams.postId !== '' && $routeParams.postId != undefined){
            $scope.isSingleProfile = true  ;  
        }
        
        $(document).click(function(){
             $("ul.actions-drop-action").hide();
        });

        $scope.toggleEdit = function($event){
            $event.stopPropagation();
            if($($event.currentTarget).next('ul.actions-drop-action').is(':visible')){
                $($event.currentTarget).next('ul.actions-drop-action').hide();
            }else{
                $("ul.actions-drop-action").hide();
                $($event.currentTarget).next('ul.actions-drop-action').show(); 
            }
        };

        //check screen for mobile devicess to show corresponding layou
        $scope.loadMoreFunc = 'loadMorePost()';
        $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
            $scope.windowHeight = newValue.h;
            $scope.windowWidth = newValue.w;
            if($scope.windowWidth <= '768'){
                $scope.isSmallScreen =  true; //declare in main controller
                $scope.loadMoreFunc = '';
            } else {
                $scope.isSmallScreen =  false; //declare in main controller
                $scope.loadMoreFunc = 'loadMorePost()';
            }
        }, true);

        //funciton to list user post on dashboard
        //TODO: infinite scoller is remaining
        $scope.listUserPost = function() {
            var opts = {};
            var limit_start = $scope.userPostList.length;
            opts.user_id = APP.currentUser.id;
            opts.limit_start = limit_start;
            opts.limit_size = APP.dashbord_pagination.end;
            opts.friend_id = APP.currentUser.id;
            //calling the services to get the user post list
            if ((($scope.totalSize > limit_start ) || $scope.totalSize == 0 ) && $scope.myRes == 1) {
                $scope.myRes = 0;
                ProfileService.listDashboardPost(opts, function(data){
                    if(data.code == 101) {
                        $scope.isLoadPost = false; 
                        var items = data.data.post;
                        if(items != undefined){
                            $scope.userPostList = $scope.userPostList.concat(items); 
                            $scope.noPostList = false; 
                        }
                        if($scope.userPostList.length==0){
                            $scope.noPostList = true; 
                        } 
                        $scope.totalSize = data.data.count;
                    } else {
                        $scope.isLoadPost = false;
                        if ($scope.userPostList.length == 0){
                            $scope.noPostList = true; 
                        } 
                        $scope.userPostList;
                    }
                    $scope.myRes = 1;
                });
            } else {
                $scope.isLoadPost = false;
                if($scope.userPostList.length==0){
                    $scope.noPostList = true; 
                } 
                $scope.userPostList;
            }
        };
        //funciton to delete single post
        $scope.deleteErrMsg = [];
        $scope.isDeletePost = [];
        $scope.deleteErrCls = [];
        $scope.deletePost = function(postIndx) {
            var postData = {};
            postData = $scope.userPostList[postIndx];
            $scope.isDeletePost[postIndx] = true;
            $scope.updateBody[postIndx] = '';
            $scope.activeEdit[postIndx] = false;
            $scope.editPostErrorMsg[postIndx] = '';
            var formData = {};
            formData.user_id = APP.currentUser.id;
            formData.post_id = postData.id;

            //calling the service to delete the selected post 
            ProfileService.deleteDashboardPost(formData, function(data){
                if(data.code == 101) {
                    $scope.userPostList.splice(postIndx, 1);
                    if ($scope.userPostList.length == 0){
                        $scope.noPostList = true; 
                    } 
                    $scope.isDeletePost[postIndx] = false;
                } else {
                    $scope.deleteErrCls[postIndx] = 'text-red';
                    $scope.deleteErrMsg[postIndx]= $scope.i18n.dashboard.postcomment.delete_post_fail;
                    $scope.isDeletePost[postIndx] = false;
                }
                $timeout(function(){
                    $scope.deleteErrCls[postIndx] = '';
                    $scope.deleteErrMsg[postIndx] = '';
                }, 15000);
            });
        };

        //modal for remove tag when user clicked on notifications
        $scope.showAllFriend = function(post_id, creater_info, allTagFriend){
            $scope.allTagFriends = allTagFriend;
            $scope.post_id = post_id;
            $scope.creater = creater_info;
            var modalInstance = $modal.open({
                template: '<style>.modal-open .modal.in .modal-dialog{width:620px; height:400px;}</style><div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a href ng-click="viewFriendProile(friend.id)">{{friend.first_name}} {{friend.last_name}}</a></span><span data-ng-if="creater.id === currentUser.id || currentUser.id === friend.id" ng-click="RemoveTagFriend(friend, creater.id)" class="rmv-tag"><a href>{{i18n.profile_post.remove_tagged_friend}}</a></span></li></ul></div><div class="modal-footer"></div>',
                controller: 'ModalController',
                size: 'lg',
                scope: $scope,
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            $scope.viewFriendProile = function(friendId){
                modalInstance.dismiss('cancel');
                $location.path('/viewfriend/'+friendId);
            };
            $scope.RemoveTagFriend = function(friend, createrId){
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.untag_user_id = friend.id;
                opts.post_id = $scope.post_id;
                ProfileService.removeTagedFriends(opts,function(data){
                    if(data.code === 101){
                        var index = $scope.allTagFriends.indexOf(friend)
                        $scope.allTagFriends.splice(index,1);
                        if(createrId != APP.currentUser.id ){
                            modalInstance.close();
                        }
                        if($scope.allTagFriends.length === 0){
                            modalInstance.close();
                        }   
                    } 
                });
            };
        };


        //function to create post
        $scope.editPostErrorMsg = [];
        $scope.updatePostInProcess = [];
        $scope.editPostErrorCls = [];
        $scope.saveUpdatePost = function(postIndx) {
            var opts = {};
            $scope.updatePostInProcess[postIndx] = true;
            var editPostText = escapeHtmlEntities($scope.updateBody[postIndx]); 
            var post = $scope.userPostList[postIndx];

            if(editPostText == undefined || editPostText == '') {
                $scope.updatePostInProcess[postIndx] = false;
                $scope.editPostErrorCls[postIndx] = 'text-red';
                $scope.editPostErrorMsg[postIndx] = $scope.i18n.editprofile.no_empty_status;
                $timeout(function(){
                    $scope.editPostErrorCls[postIndx] = '';
                    $scope.editPostErrorMsg[postIndx] = '';
                }, 15000);
                return false;
            } 
            var regex = /src="([^"]+)"/;
            var src = editPostText.split(regex)[1];
            if(src != undefined && src !='' ){
               editPostText = src; 
            }
            
            opts.user_id = APP.currentUser.id;
            opts.post_id = post.id;
            opts.title = post.title; //This dummy data as currently there is no field to accept the posttitle
            opts.description = editPostText;
            opts.to_id = post.to_id; 
            opts.youtube_url = '';
            opts.post_type = '1';
            opts.privacy_setting = post.privacy_setting;
            var myFile = '';
            var friendIdList = [];
            if($scope.postTaggedFriend[postIndx].length > 0){
                angular.forEach($scope.postTaggedFriend[postIndx],function(index){
                    friendIdList.push(index.id);
                });

                opts.tagged_friends = friendIdList.join();
            }else{
                opts.tagged_friends = "";
            }

            ProfileService.updateDashboardPost(opts, function(data){
                if(data.code == 101) {
                    if($scope.postTaggedFriend[postIndx].length > 0){
                        post.tagged_friends_info = $scope.postTaggedFriend[postIndx];
                    }else{
                        post.tagged_friends_info = "";
                    }
                    $scope.updatePostInProcess[postIndx] = false;
                    $scope.editPostErrorMsg[postIndx] = '';
                    $scope.userPostList[postIndx].description = editPostText;
                    $scope.editPostText = '';
                    $scope.activeEdit[postIndx] = false;
                } else {
                    $scope.updatePostInProcess[postIndx] = false;
                    $scope.editPostErrorCls[postIndx] = 'text-red';
                    $scope.editPostErrorMsg[postIndx] = $scope.i18n.editprofile.post_unsaved;
                }
                $timeout(function(){
                    $scope.editPostErrorCls[postIndx] = '';
                    $scope.editPostErrorMsg[postIndx] = '';
                }, 15000);
            });
        };

        $scope.editPrivacyMsg = [];
        $scope.editPrivacyCls = [];
        $scope.changePrivacy = function(post, postIndx) { 
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.post_id = post.id;
            opts.privacy_setting = post.privacy_setting;
            var myFile = '';
            ProfileService.updatePostPrivacy(opts, function(data){
                if(data.code == 101) {
                    $scope.editPrivacyCls[postIndx] = '';
                    $scope.editPrivacyMsg[postIndx] = '';                    
                } else {
                    $scope.editPrivacyCls[postIndx] = 'text-red';
                    $scope.editPrivacyMsg[postIndx] = $scope.i18n.editprofile.privacy_setting; 
                    $timeout(function(){
                        $scope.editPrivacyCls[postIndx] = '';
                        $scope.editPrivacyMsg[postIndx] = '';
                    }, 15000);
                }
            });
        };

        $scope.gainPostFocus = function(indx){
            focus('postListTagged'+indx);
        };

        $scope.updateBody = [];
        $scope.activeEdit = [];
        $scope.postTaggedFriend = [];
        $scope.showTagLoading = [];
        //funtion to open form to update post
        $scope.updatePost = function(postIndx) {
            $scope.editPostErrorMsg[postIndx]='';
            $scope.editPostErrorCls[postIndx]='';
            var post = $scope.userPostList[postIndx];
            //for resize the textarea
            autosize(document.querySelectorAll('.editpostbox'));
            var str = $.trim(post.description.replace(/\n\n\n+/g, '\n\n'));
            var htmlstr = str.replace(/\n/g,'<br />');
            var height = $('<div style="display:block;" id="postedit-hidden-div"></div>')
            .html(htmlstr)
            .appendTo('#post_'+post.id)
            .height();     
            $('#editpost_'+post.id).css('height',height + 'px');
            str = $('#postedit-hidden-div').html(str).text();
            $('#postedit-hidden-div').remove();
            $scope.updateBody[postIndx] = str;
            
           // $scope.postTaggedFriend[postIndx] = post.tagged_friends_info;
           /* var postTaggedFriend = post.tagged_friends_info;
            $scope.postTaggedFriend[postIndx] = postTaggedFriend;*/
            $scope.postTaggedFriend[postIndx] = [];
            angular.forEach(post.tagged_friends_info, function(val,indx){
                $scope.postTaggedFriend[postIndx].push(val);
            });
            $scope.activeEdit[postIndx] = true;
            $scope.showTagLoading[postIndx] = true;
            //set cursor start of textarea
            $timeout(function(){
                $('#editpost_'+post.id).putCursorAtStart();
            },200);
        };

        // close the edit form on cancel
        $scope.cancelPost = function(postIndx) {
            $('#postedit-hidden-div').remove();
            $scope.updateBody[postIndx] = '';
            $scope.activeEdit[postIndx] = false;
            $scope.editPostErrorMsg[postIndx] = '';
            $scope.editPostErrorCls[postIndx]='';
            $scope.showTagLoading[postIndx] = false;
            $scope.postTaggedFriend = [];
        };

        // function to remove the tagged friend
        $scope.removePostTagFriend  = function(index, postIndex){
            $scope.postTaggedFriend[postIndex].splice(index,1);
        };

        // Add more friend in the post
        var currentTimeout = null;
        $scope.addMoreFriend = function(event, index){
            var DELAY_TIME_BEFORE_POSTING = 300;
            if(currentTimeout) {
                $timeout.cancel(currentTimeout);
            }
            currentTimeout = $timeout(function(){
                if(event.which != 13){ 
                    $scope.searchMoreFriend(index);
                }
            }, DELAY_TIME_BEFORE_POSTING)
        };

        $scope.friends = [];
        $scope.showSearchFriendLoader = [];
        $scope.cancelFriendSearch = false;
        $scope.showSearchFriendList = [];
        $scope.searchMoreFriend = function(postIndx){
            $scope.searchFriend = $('.addMoreTagFriend'+postIndx).val();
            $scope.cancelFriendSearch = false;
            $scope.showSearchFriendList[postIndx] = true;
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.friend_name = $scope.searchFriend;
            opts.session_id = APP.currentUser.id;
            opts.limit_start = 0;
            $scope.friendTagIndex[postIndx] = -1;
            opts.limit_size =  APP.friend_list_pagination.end;
            $scope.showSearchFriendLoader[postIndx] = true;
            $scope.showTagLoading[postIndx] = true
            ProfileService.searchFriends(opts,function(data){
                $scope.showSearchFriendLoader[postIndx] = false;
                if($scope.cancelFriendSearch === false){
                    if(data.data.users.length > 0){
                        $scope.friends[postIndx] = data.data.users;
                    }
                }
            });
        };

        // Store friend 
        $scope.postTaggedFriend = [];
        $scope.dublicate = false;
        $scope.taggedSelectFriend = function(friendInfo, postIndex){
            if(friendInfo === undefined){
                return
            }else{
                $scope.dublicate = false;
                angular.forEach($scope.postTaggedFriend[postIndex],function(index){
                    if(index.id === friendInfo.user_id){
                        $scope.dublicate = true;
                    }
                });

                if($scope.dublicate === false){
                    $scope.postTaggedFriend[postIndex].push({"id":friendInfo.user_id, "first_name": friendInfo.user_info.first_name, "last_name": friendInfo.user_info.last_name,"profile_image": friendInfo.user_info.profile_image,"profile_image_thumb":friendInfo.user_info.profile_image_thumb});
                    $scope.friends[postIndex] = [];
                    $scope.cancelFriendSearch = true;
                    $scope.friendTagIndex[postIndex] = -1;
                    angular.element('.addMoreTagFriend'+postIndex).val("");
                    $scope.showSearchFriendList[postIndex] = false;
                }else{
                    $scope.friends[postIndex] = [];
                    $scope.cancelFriendSearch = true;
                    $scope.friendTagIndex[postIndex] = -1;
                    angular.element('.addMoreTagFriend'+ postIndex).val("");
                    $scope.showSearchFriendList[postIndex] = false;
                }
            }
        };

        // stop the service for loading more service
        $scope.lostFocus = function(postIndex){
            $timeout(function(){
                $scope.friends[postIndex] = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTagIndex[postIndex] = -1;
                angular.element('.addMoreTagFriend'+ postIndex).val("");
                $scope.showSearchFriendList[postIndex] = false;
            },300);
        };

        // Up down key control in search friend list
        $scope.friendTagIndex = [];
        $scope.searchNevigateControl = function(event, index){
            if(event.keyCode===40){
                event.preventDefault();
                if($scope.friendTagIndex[index]+1 !== $scope.friends[index].length){
                    $scope.friendTagIndex[index]++;
                }
            }else if(event.keyCode===38){
                event.preventDefault();
                if($scope.friendTagIndex[index]-1 !== -1){
                    $scope.friendTagIndex[index]--;
                }
            }else if(event.keyCode===13){
                    $scope.taggedSelectFriend($scope.friends[index][$scope.friendTagIndex[index]], index);
            }
        };

        $scope.getUserPostDetail = function(id) {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.post_id = id;
            //calling the services to get the user post list
            if (($scope.totalSize == 0 ) && $scope.myRes == 1) {
                $scope.myRes = 0;
                ProfileService.getDashboardPostDetail(opts, function(data){
                    if(data.code == 101) {
                        $scope.isLoadPost = false; 
                        var items = data.data.post;
                        if(items != undefined){
                            $scope.userPostList = $scope.userPostList.concat(items); 
                            $scope.noPostList = false; 
                        }
                        if($scope.userPostList.length==0){
                            $scope.noPostList = true; 
                        } 
                        $scope.totalSize = data.data.count;
                    } else {
                        $scope.isLoadPost = false;
                        if ($scope.userPostList.length == 0){
                            $scope.noPostList = true; 
                        } 
                        $scope.userPostList;
                    }
                    $scope.myRes = 1;
                });
            } else {
                $scope.isLoadPost = false;
                if($scope.userPostList.length==0){
                    $scope.noPostList = true; 
                } 
                $scope.userPostList;
            }
        };

        //function to call initial loading
        $scope.showUserPostList = function(){
            $scope.isLoadPost=true;
            $scope.totalSize = 0;
            $scope.myRes = 1;
            if($routeParams.postId ? $routeParams.postId : '') {
                $scope.getUserPostDetail($routeParams.postId);
            }
            else {
                $scope.listUserPost();
            }
        };

        // function to get the post and comment of the post
        $scope.commentLoading = [];
        $scope.getComments = function(postIndx) {
            var post = $scope.userPostList[postIndx];
            $scope.userPostList[postIndx].comments = [];
            var opts = {};
            opts.post_id = post.id;
            opts.user_id = APP.currentUser.id;
            opts.limit_start = APP.dashbord_comment.start;
            opts.limit_size = APP.dashbord_comment.end;

            // This service's function returns post
            ProfileService.getDashboardComments(opts, function(data){
                if(data.code == 100)
                {
                    $scope.userPostList[postIndx].comments = data.data.comment;
                    $scope.commentLoading[postIndx] = false;
                    $scope.commentsLength[postIndx] = $scope.userPostList[postIndx].comments.length;
                    if($scope.userPostList[postIndx].comments.length  != 0 ) {
                        $scope.noComment = true;
                    }
                } else {
                    $scope.commentLoading[postIndx] = false;
                }
            });
        };
        //function to show limited comment of the post
        $scope.showLimitedComment = function(postIndx) {
            $scope.commentInProcess = true;
            var post = $scope.posts[postIndx];
            var opts = {};
            opts.post_id = post.post_id;
            opts.user_id = $scope.currentUser.id;
            $scope.getComments(opts, postIndx);
        };
        $scope.showAllComments = function(postIndx) {
            $scope.commentLoading[postIndx] = true;
            $scope.showComments[postIndx] = true;
            $scope.getComments(postIndx);
        };
        $scope.pageSize = 4;
        //function to delete the comment of a post
        //funciton to delete single comment
        $scope.delCommentErrMsg = [];
        $scope.delCommentErrCls = [];
        $scope.deleteComment = function(postIndx,comment) {
            var indx = $scope.userPostList[postIndx].comments.indexOf(comment);
            var commentData = {};
            commentData = $scope.userPostList[postIndx].comments[indx];
            $scope.deleteCommentIndx = commentData.id;
            var formData = {};
            formData.user_id = APP.currentUser.id;
            formData.comment_id = commentData.id;

            //calling the comment service to delete the selected comment 
            ProfileService.deleteDashboardComment(formData, function(data){
                if(data.code == 101) {
                    $scope.delCommentErrMsg[commentData.id] = '';
                    $scope.delCommentErrCls[commentData.id] = '';
                    $scope.userPostList[postIndx].comments.splice(indx, 1);
                    $scope.userPostList[postIndx].comment_count--;
                    $scope.deleteCommentIndx = '';
                }
                else {
                    $scope.delCommentErrMsg[commentData.id] = $scope.i18n.dashboard.postcomment.delete_comment_fail;
                    $scope.delCommentErrCls[commentData.id] = 'text-red';
                    $scope.deleteCommentIndx = '';
                    $scope.userPostList;
                }
                $timeout(function(){
                    $scope.delCommentErrCls[commentData.id] = '';
                    $scope.delCommentErrMsg[commentData.id] = '';
                }, 15000);

            });
        };
        $scope.editCommentText = [];
        $scope.activeCommentEdit = [];
        $scope.isEditComment = [];
        $scope.commentErrorMsg = [];
        $scope.commentErrorCls = [];
        $scope.commentInProcess = [];
        //funtion to open form to update comment
        $scope.updateComment = function(postIndx, comment) {
            $("#commentBoxId-"+postIndx).hide();
            $scope.commentInProcess[postIndx] = true;
            $scope.commentErrorMsg[postIndx] = '';
            $scope.commentErrorCls[postIndx]= '';
            var indx = $scope.userPostList[postIndx].comments.indexOf(comment);
            var comment = $scope.userPostList[postIndx].comments[indx];
            $scope.isEditComment[postIndx] = false;
            $scope.activeCommentEdit[postIndx] = comment.id
            $scope.editCommentText[postIndx]=comment.comment_text;
        };

        //function to edit a comment
        $scope.editComment = function(postIndx, comment) {
            var opts = {};
            $scope.commentErrorMsg[postIndx]= '';
            var indx = $scope.userPostList[postIndx].comments.indexOf(comment);
            var comment = $scope.userPostList[postIndx].comments[indx];
            var newText = $scope.editCommentText[postIndx];
            $scope.isEditComment[postIndx] = true;

            if(newText == undefined || newText == '') {
                $scope.isEditComment[postIndx]= false;
                $scope.commentErrorCls[postIndx] = 'text-red';
                $scope.commentErrorMsg[postIndx] = $scope.i18n.editprofile.no_empty_comment;
                $timeout(function(){
                    $scope.commentErrorCls[postIndx] = '';
                    $scope.commentErrorMsg[postIndx] = '';
                }, 15000);
                return false;
            } 
            opts.user_id = APP.currentUser.id;
            opts.comment_id = comment.id;
            opts.comment_text = newText;
            opts.tagging = $('.taggedObject' + postIndx).val();
            ProfileService.updateDashboardComment(opts, function(data){
                if(data.code == 101) {
                    $scope.commentInProcess[postIndx] = false;
                    $scope.activeCommentEdit[postIndx] = '';
                    $scope.commentErrorCls[postIndx] = '';
                    $scope.commentErrorMsg[postIndx] = '';
                    $scope.editCommentText[postIndx] = '';
                    $scope.userPostList[postIndx].comments[indx].comment_text = newText;
                    $scope.isEditComment[postIndx] = false;
                    $("#commentBoxId-"+postIndx).show();
                } else {
                    $scope.commentInProcess[postIndx] = false;
                    $scope.isEditComment[postIndx] = false;
                    $scope.commentErrorCls[postIndx] = 'text-red';
                    $scope.commentErrorMsg[postIndx]= $scope.i18n.editprofile.not_posted;
                    $("#commentBoxId-"+postIndx).show();
                }
                $timeout(function(){
                    $scope.commentErrorCls[postIndx] = '';
                    $scope.commentErrorMsg[postIndx] = '';
                }, 15000);
            });
        };

        //funtion to open form to update comment
        $scope.cancelEditComment = function(postIndx, indx) {
            $scope.commentInProcess[postIndx] = false;
            $scope.activeCommentEdit[postIndx] = '';
            $scope.commentErrorCls[postIndx] = '';
            $scope.commentErrorMsg[postIndx] = '';
            $scope.editCommentText[postIndx] = '';
            $scope.isEditComment[postIndx] = false;
            $("#commentBoxId-"+postIndx).show();
        };

        $scope.loadMorePost = function() {
            if($scope.totalSize > $scope.userPostList.length){
                $scope.isLoadPost = true;
                $scope.listUserPost();
            }
        };
        //calling function to load postlist
        $scope.showUserPostList();
        $scope.averageVoting = 0;
        $scope.vote_count = 0;
        $scope.waitRateResponse = false;
        $scope.ratePost = function(rating, post_id, index){
            var update = "";
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "dashboard_post";
            opts.type_id = post_id;
            opts.rate = rating;
            $scope.waitRateResponse = true;
            if($scope.userPostList[index].is_rated){
                update = "update";
            }else{
                update = "add";
            }
            ProfileService.rateThis(opts, update, function(data){
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.userPostList[index].avg_rate = data.data.avg_rate;
                    $scope.userPostList[index].no_of_votes = data.data.no_of_votes;
                    $scope.userPostList[index].is_rated = true;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    //$scope.userPostList[index].avg_rate = 0;
                    //$scope.userPostList[index].no_of_votes = 0;
                    $scope.userPostList[index].is_rated = false;
                    $scope.userPostList[index].current_user_rate = 0;
                }
                $scope.waitRateResponse = false;
            });
        };

        $scope.WaitDeleteResponse = false;
        $scope.removeRating = function(post_id, postIndx){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "dashboard_post";
            opts.type_id = post_id;
            if($scope.WaitDeleteResponse === false){
                $scope.WaitDeleteResponse = true;
                $scope.waitRateResponse = true;
            }else{
                return;
            }
            ProfileService.removeRating(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.userPostList[postIndx].current_user_rate = 0;
                    $scope.userPostList[postIndx].is_rated = false;
                    $scope.userPostList[postIndx].no_of_votes = data.data.no_of_votes;
                    $scope.userPostList[postIndx].avg_rate =  data.data.avg_rate;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    $scope.userPostList[postIndx].current_user_rate = 0;
                    $scope.userPostList[postIndx].is_rated = false;
                    //$scope.userPostList[postIndx].no_of_votes =0;
                    //$scope.userPostList[postIndx].avg_rate =  0;
                }
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
            });
        };
        /*
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
            ProfileService.rateThis(opts, update, function(data){
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.userPostList[postIndex].comments[commentIndex].avg_rate = data.data.avg_rate;
                    $scope.userPostList[postIndex].comments[commentIndex].no_of_votes = data.data.no_of_votes;
                    $scope.userPostList[postIndex].comments[commentIndex].is_rated = true;
                }
            });
        };

        $scope.removeCommentRating = function(comment_id, postIndx, indx){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "dashboard_post_comment";
            opts.type_id = comment_id;
            ProfileService.removeRating(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.userPostList[postIndx].current_user_rate = 0;
                    $scope.userPostList[postIndx].is_rated = false;
                    $scope.userPostList[postIndx].no_of_votes = data.data.no_of_votes;
                    $scope.userPostList[postIndx].avg_rate =  data.data.avg_rate;
                }
            });
        };
        */
        $scope.stars = [];

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

        $scope.rateThis = function(value, id, index){
            $scope.ratePost(value, id, index);
        };

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];

        $scope.showPeopleLoader = false;
        $scope.findPeople = function(id, type, count_Vote){
            if(count_Vote === 0 ){
                return false;
            }
            var opts = {};
            $scope.ratedUsers = {};
            $scope.showPeopleLoader = true;

            var modalInstance = $modal.open({
                //template: '<style>.modal-body.tag-frnd-modal ul li{padding:8px 130px 8px 0}.modal-content .modal-body ul.rmv-tag{position:absolute;right:0;top:10px}.modal-content .modal-body ul.rmv-tag li{padding:0;display:inline-block;vertical-align:middle;border:0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) no-repeat;display:block}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) 0 -21px no-repeat;display:block}.modal.in .modal-dialog{margin:auto;top:0;bottom:0;left:0;right:0;position:absolute; height: 400px;}.modal-body.tag-frnd-modal{height:360px;overflow-y:auto;overflow-x:hidden;padding:0 10px}.modal .modal-content{margin:auto;top:0;bottom:0;left:0;right:0;position:absolute;overflow:visible}@media screen and (max-width:479px){.modal.in .modal-dialog{margin:auto 20px}.modal-body.tag-frnd-modal ul li{padding:8px 70px 8px 0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 0/12px no-repeat}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 -11px/12px no-repeat}}</style><div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div></div><div class="modal-body tag-frnd-modal"><ul ng-hide="showPeopleLoader"><li data-ng-repeat="friend in ratedUsers"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a ng-href="#/viewfriend/{{friend.id}}">{{friend.first_name}} {{friend.last_name}}</a><span class="frnd-details"><a href>{{friend.about_me}}</a></span></span><ul class="rmv-tag"><li data-ng-repeat="avgRate in averageRating(friend.rate) track by $index"><span ng-class="friend.rate % 1 == 0 ?\'votes-avg\': ($last ? \'half-avg\':\'votes-avg\')" /></li><li ng-repeat="blank in blankStar(friend.rate) track by $index"><span class="votes-blank"/> </li></ul></li></ul> <div ng-show="showPeopleLoader"><img titile="" alt="" src="app/assets/images/proceed.gif"></div></div><div class="modal-footer"></div>',
                templateUrl: 'app/views/find_people.html',
                controller: 'ModalController',
                size: 'lg',
                scope: $scope,
            });
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

      },
      link:function ($scope){
        $(".fancybox").fancybox();
      },
      templateUrl: 'app/views/profile_post_list.html'
    }
  }).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

  //Displaying the post form for store detail
app.directive('profilePostForm', function($timeout, ProfileService, FileUploader, $sce, focus) {
    return {
      restrict: 'E',
      controller: function ($scope, $timeout){
        $scope.postErrCls = '';// add dynamic class for success and fail
        $scope.privacySet = 3;
        //function to create post for dashboard
        $scope.postErrMsg = '';
        $scope.postErrCls = '';
        $scope.postContentStart = false;
       
        $scope.imagePrvSrc = [];
        $scope.postProfileFiles = [];
        $scope.imgProgress = [];
        $scope.postImgLoader = [];
        $scope.progress = [];
        $scope.tempPostId = '';
        var uploader =  $scope.uploader = new FileUploader({
          url: APP.service.dashboardpost+"?access_token="+APP.accessToken,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'method': 'POST'
              /*'Accept': 'text/json'*/
          },
          data:{
              'user_id': APP.currentUser.id,
              'title':"Not in use on frontend", //This dummy data as currently there is no field to accept the posttitle
              'description':'',
              'youtube_url':'',
              'to_id': APP.currentUser.id,
              'link_type':"0",
              'post_type':"0",
              'privacy_setting': $scope.privacySet
          },
          dataObjName:'reqObj',
          formDataName:'postfile[]'
        });
        // FILTERS
        uploader.filters.push({
            name: 'postfile[]',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        //function to add image on user post
        $scope.isImage = false;
        $scope.imgUpload = false;
        $scope.uploadBox = false;//previously used to hide the text area in first click of photo tab 
        $scope.addImage = function() { 
            var href = $('#previewUrl_lp1').html();
            if(href != ''){
                $timeout(function(){
                    $('#closePreview_lp1').click();
                },100);
            }
            $scope.isImage = true;
            $scope.imgUpload = false;
            $scope.uploadBox = true;
            $scope.imagePrvSrc = [];
            uploader.queue = [];
            $scope.postProfileFiles = [];
        };
        $scope.addPost = function() { 
            $scope.isImage = false;
            $scope.imgUpload = false;
            $scope.uploadBox = false;
            $scope.isPost = true;
            $scope.imagePrvSrc = [];
            uploader.queue = [];
            $scope.postProfileFiles = [];
        };
            //remove iamge from preview array
        $scope.removeImage = function(index) {
            //$('#progress-'+ index).css('display','none');
            //$('#bkground-'+ index).css('display','none');
            var item = $scope.uploader.queue[index];
            item.remove();
            var tempImg = $scope.imagePrvSrc[index];
            $scope.imagePrvSrc.splice(index, 1);
            var formData = {};
            formData.user_id = APP.currentUser.id;
            formData.post_media_id = tempImg.media_id;

            //calling the service to delete the selected post 
            ProfileService.deletePostMedia(formData, function(data){
                if(data.code == 101) {
                    //$('#progress-'+ index).css('display','block');
                    //$('#bkground-'+ index).css('display','block');
                } else {
                    $scope.imagePrvSrc[index] = tempImg;
                    $scope.postErrCls = 'text-red';
                    $scope.postErrMsg = $scope.i18n.dashboard.postcomment.remove_img_fail;
                    $timeout(function(){
                        $scope.postErrCls = '';
                        $scope.postErrMsg = '';
                    }, 15000);
                    $scope.userPostList;
                }
            });
        };
        uploader.onAfterAddingFile = function(fileItem) {
            $scope.postContentStart = true;
            uploader.data.post_id=$scope.tempPostId;
            var queueLen = uploader.queue.length-1;
            if(uploader.queue.length != 0){
                $scope.uploadBox = false;
                $scope.imgUpload = true;
            }
            $scope.postImgLoader[queueLen] = true;
           // $timeout(function() {
                uploader.uploadItem(fileItem);
            //}, 5000);
        };

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            var index = uploader.getIndexOfItem(fileItem);
            if(response.code == 101){
                $scope.imagePrvSrc[index] = response.data;
                $scope.postImgLoader[index] = false;
                $scope.tempPostId = response.data.id;
                uploader.data.post_id=response.data.id;
            }
        };

        uploader.onCompleteAll = function() {
            $timeout(function(){
                $scope.postContentStart = false;
            }, 1000);
            
        }

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.postErrMsg = $scope.i18n.editprofile.no_media_valid;
            $scope.postErrCls = 'text-red';
            $timeout(function(){
                $scope.postErrCls = '';
                $scope.postErrMsg = '';
            }, 15000);
        };
        
        $scope.createPost = function() {
            $scope.noContent = false; 
            $scope.updateBody = [];
            $scope.activeEdit = [];
            $scope.editPostErrorMsg = [];
            var link_type;
            $scope.postContentStart = true;
            $scope.postContentLoader = true;
            var opts = {};
            $scope.postErrMsg = '';
            var filescount = $scope.imagePrvSrc.length;
            var description = '';
            var src = '';

            /*Link Preview feature*/
            var descval = $("#preview_lp1").html();
            var href = $('#previewUrl_lp1').html();
            var textarea = $('#text_lp1').val();
            description = textarea;
            var regex = /src="([^"]+)"/;
            src = description.split(regex)[1];
            if(src != undefined && src != ''){
                description = src;
            }

            description = escapeHtmlEntities(description);

            if(href == '') {
                link_type = "0";
            } else {
                description = "<p>"+description+"</p>";
                description += descval;
                link_type = "1";
            }
            
            if ((description == undefined || description == '') && filescount == 0) {
                $scope.postErrCls = 'text-red';
                $scope.postErrMsg = $scope.i18n.editprofile.attach_link;
                $scope.postContentStart = false;
                $scope.postContentLoader = false;
                $timeout(function(){
                    $scope.postErrCls = '';
                    $scope.postErrMsg = '';
                }, 15000);
                return false;
            }
            

            opts.user_id = APP.currentUser.id;
            opts.title = $scope.i18n.editprofile.no_use; //This dummy data as currently there is no field to accept the posttitle
            opts.description = description;
            opts.youtube_url = '';
            opts.to_id = APP.currentUser.id;
            opts.link_type = link_type;
            opts.post_id = $scope.tempPostId;
            opts.post_type = "1";
            opts.media_id = [];
            opts.privacy_setting = $scope.privacySet;
            var friendId = [];
            if($scope.storedFriend.length > 0){
                for (var i = 0; i < $scope.storedFriend.length; i++) {
                    friendId.push($scope.storedFriend[i].user_info.id);
                };

                opts.tagged_friends = friendId.join();
            }else{
                opts.tagged_friends = "";
            }
            angular.forEach($scope.imagePrvSrc, function(file) {
              opts.media_id.push(file.media_id);
            });

            ProfileService.dashboardPost(opts, function(data){
                if(data.code == 101) {
                    $scope.storedFriend = [];
                    $scope.showTagForm = false;
                    var targetObject = {};
                    targetObject = data.data;
                    $scope.userPostList.unshift(targetObject);
                    $scope.postErrMsg = '';
                    $scope.imagePrvSrc = [];
                    $scope.postProfileFiles = [];
                    $timeout(function(){
                        $scope.postErrCls = '';
                        $scope.postErrMsg = '';
                    }, 15000);
                    uploader.data.post_id={};
                    while(uploader.queue.length) {
                     uploader.queue[0].remove();
                    }
                    if ($scope.userPostList.length == 0){
                        $scope.noPostList = true; 
                    } 
                    $scope.noPostList = false; 
                    $scope.tempPostId='';
                    $scope.postContentStart = false;
                    $scope.postContentLoader = false;
                    $scope.postText = '';
                    $scope.isImage = false;
                    $scope.imgUpload = false;
                    $scope.uploadBox = false;
                    $('#text_lp1').val('');
                    $('#text_lp1').attr("style", "");
                    $timeout(function(){
                        $('#closePreview_lp1').trigger('click');
                    }, 100);
                } else {
                    $scope.postErrCls = 'text-red';
                    $scope.postErrMsg = $scope.i18n.editprofile.post_unable;
                    $timeout(function(){
                        $scope.postErrCls = '';
                        $scope.postErrMsg = '';
                    }, 15000);
                    $scope.imagePrvSrc = [];
                    $scope.postProfileFiles = [];
                    $scope.postText = undefined; 
                    $scope.postContentLoader = false;
                    $scope.isImage = false;
                    $scope.imgUpload = false;
                    $scope.uploadBox = false;
                }
            });
        };


        // Show Tag Column
        $scope.showTagForm = false;
        $scope.showTagCloumn = function(){
            if($scope.showTagForm === false){
                $scope.showTagForm = true;
                focus('searchTagFriend');
            }else{
                $scope.showTagForm = false;
            }
        };

        // focus on click
        $scope.gainFocus = function(){
            focus('searchTagFriend');
        };
        
        // Show the list of friend
        var DELAY_TIME_BEFORE_POSTING = 300;
        var currentTimeout = null;
        angular.element('#searchTagFriend').keypress(function(event) {
            var model = $scope.searchText;
            if(currentTimeout) {
            $timeout.cancel(currentTimeout);
            }
            currentTimeout = $timeout(function(){
                if(event.which != 13){ 
                    $scope.tagFriendSuggestion();
                }
            }, DELAY_TIME_BEFORE_POSTING)
        });

        $scope.friends = [];
        $scope.cancelFriendSearch = false;
        $scope.showSearchLoader = false;
        $scope.tagFriendSuggestion = function(){
            $scope.cancelFriendSearch = false;
            $scope.showFriendList = true;
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.friend_name = $scope.friendName;
            opts.session_id = APP.currentUser.id;
            opts.limit_start = 0;
            opts.limit_size =  APP.friend_list_pagination.end;
            $scope.showSearchLoader = true;
            ProfileService.searchFriends(opts,function(data){
                $scope.showSearchLoader = false;
                if($scope.cancelFriendSearch === false){
                    $scope.friends = data.data.users;
                }
            })
        };

        // Store friend 
        $scope.storedFriend = [];
        $scope.dublicate = false;
        $scope.selectFriend = function(friendInfo){
            if(friendInfo === undefined){
                return;
            }else{
                $scope.dublicate = false;
                angular.forEach($scope.storedFriend,function(index){
                    if(index.user_id === friendInfo.user_id){
                        $scope.dublicate = true;
                    }
                });

                if($scope.dublicate === false){
                    $scope.storedFriend.push(friendInfo);
                    $scope.friends = [];
                    $scope.cancelFriendSearch = true;
                    $scope.friendTaggIndex = -1;
                    angular.element('#searchTagFriend').val("");
                    $scope.showFriendList = false;
                }else{
                    $scope.friends = [];
                    $scope.cancelFriendSearch = true;
                    $scope.friendTaggIndex = -1;
                    angular.element('#searchTagFriend').val("");
                    $scope.showFriendList = false;
                }
            }
        };

        // stop the service for loading more service
        $scope.lostFormFocus = function(){
            $timeout(function(){
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#searchTagFriend').val("");
                $scope.showFriendList = false;
            },300);
        };

        // Remove selected friend
        $scope.removeTagFriend = function(friendIndex){
            //var index = $scope.storedFriend.indexOf(friendIndex);
            $scope.storedFriend.splice(friendIndex,1);
        };

        // Up down key control in search friend list
        $scope.friendTaggIndex = -1;
        $scope.keyUpDownControl = function(event){console.log($scope.friendTaggIndex);
            if(event.keyCode===40){
                event.preventDefault();
                if($scope.friendTaggIndex+1 !== $scope.friends.length){
                    $scope.friendTaggIndex++;
                }
            }else if(event.keyCode===38){
                event.preventDefault();
                if($scope.friendTaggIndex-1 !== -1){
                    $scope.friendTaggIndex--;
                }
            }else if(event.keyCode===13){
                    $scope.selectFriend($scope.friends[$scope.friendTaggIndex]);
            }
        };
     
      },
      link: function (scope, iElement, iAttrs) {
        $($('#lp1').linkPreview()).appendTo(iElement[0]);
      },
      templateUrl: 'app/views/profile_post_form.html'
      }
  });

  //Displaying the loading image form for store detail
  app.directive('showProgress', function() {
    return {
      restrict: 'E',
      template: '<img src="app/assets/images/proceed.gif" alt="processing..." />'
    }
  });

    