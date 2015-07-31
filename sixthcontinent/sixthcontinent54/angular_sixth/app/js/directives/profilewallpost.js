  //Displaying the comment post form for store detail
  app.directive('profileWallCommentForm',['ProfileService', 'fileReader', '$http', '$timeout', '$interval', function(ProfileService, fileReader, $http, $timeout, $interval) {
    return {
      restrict: 'E',
      templateUrl: 'app/views/profile_wall_comment_form.html',
      scope : true,
      link : function(scope, elem, attrs){
        scope.showPreview = false;
        scope.comment_id = '';
        scope.image_id = [];
        scope.imgSrc = [];
        scope.isInProgress = [];
        scope.selectInProgress = [];
        scope.commentFiles = [];
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
                setTimeout(function(){
                    scope.commentErrCls = '';
                    scope.commentErrMsg = '';
                }, 15000);
            });
        }
      };
    }
  };
}]);
//Displaying the post form for store detail
app.directive('wallProfilePostList', function(ProfileService) {
    return {
        restrict: 'E',
        controller: function ($scope, $timeout, $modal, $log, $location, focus){
            $scope.showComments = [];
            $scope.commentsLength = [];
            $scope.userPostList = [];
            $scope.myRes = 1;
            $scope.showComments = [];
            $scope.commentsLength = [];
            $scope.textLimit = APP.post_charecter_limit;
            $scope.noContent = false;

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
            $scope.loadMoreFunc = 'loadMore()';
            $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
                $scope.windowHeight = newValue.h;
                $scope.windowWidth = newValue.w;
                if($scope.windowWidth <= '768'){
                    $scope.isSmallScreen =  true; //declare in main controller
                    $scope.loadMoreFunc = '';
                } else {
                    $scope.isSmallScreen =  false; //declare in main controller
                    $scope.loadMoreFunc = 'loadMore()';  
                }
            }, true);
            //funciton to list user post on dashboard
            //TODO: infinite scoller is remaining
            $scope.listUserWallPost = function() {
                var opts = {};
                var limit_start = $scope.userPostList.length;
                opts.user_id = APP.currentUser.id;
                opts.limit_start = limit_start;
                opts.limit_size = APP.dashbord_pagination.end;
                opts.friend_id = APP.currentUser.id;
                $scope.isLoading = true;

                //calling the services to get the user post list
                if ((($scope.totalSize > limit_start ) || $scope.totalSize == 0 ) && $scope.myRes == 1) {
                    $scope.myRes = 0;
                    ProfileService.getDashboardWallFeeds(opts, function(data){
                        if(data.code == 101) {
                                var items = data.data.post;
                                if(items != undefined){
                                    $scope.userPostList = $scope.userPostList.concat(items);    
                                }
                                $scope.totalSize = data.data.count;
                                if ($scope.userPostList.length == 0){
                                    $scope.noContent = true; 
                                }
                                $timeout(function(){
                                    $scope.isLoading = false;
                                },400)
                                $scope.myRes = 1;
                        } else {
                            $timeout(function(){
                                $scope.isLoading = false;
                                $scope.userPostList;
                                if ($scope.userPostList.length == 0){
                                    $scope.noContent = true; 
                                }
                            },400)
                        }
                    });
                } else {
                    $timeout(function(){
                        $scope.isLoading = false;
                    },5000)
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
                            $scope.noContent = true; 
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
                    }
                    $timeout(function(){
                        $scope.editPrivacyCls[postIndx] = '';
                        $scope.editPrivacyMsg[postIndx] = '';
                    }, 15000);
                });
            };

            //
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
                $scope.activeEdit[postIndx] = true;
               //$scope.postTaggedFriend[postIndx] = post.tagged_friends_info;
                $scope.postTaggedFriend[postIndx] = [];
                angular.forEach(post.tagged_friends_info, function(val,indx){
                    $scope.postTaggedFriend[postIndx].push(val);
                });
                $scope.showTagLoading[postIndx] = true;
                //set cursor start of textarea
                $timeout(function(){
                    $('#editpost_'+post.id).putCursorAtStart();
                },200);
            };

            //Focus on input field
            $scope.focusWallTag = function(indx){
                focus('wallPostListTag'+indx);
            };

            // close the edit form on cancel
            $scope.cancelPost = function(postIndx) {
                $('#postedit-hidden-div').remove();
                $scope.updateBody[postIndx] = '';
                $scope.activeEdit[postIndx] = false;
                $scope.editPostErrorMsg[postIndx] = '';
                $scope.editPostErrorCls[postIndx]='';
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
                $scope.friendTagIndex[postIndx] = -1;
                $scope.cancelFriendSearch = false;
                $scope.showSearchFriendList[postIndx] = true;
                var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.friend_name = $scope.searchFriend;
                opts.session_id = APP.currentUser.id;
                opts.limit_start = 0;
                opts.limit_size =  APP.friend_list_pagination.end;
                $scope.showSearchFriendLoader[postIndx] = true;
                $scope.showTagLoading[postIndx] = true
                ProfileService.searchFriends(opts,function(data){
                    $scope.showSearchFriendLoader[postIndx] = false;
                    if($scope.cancelFriendSearch === false){
                        $scope.friends[postIndx] = data.data.users;
                    }
                });
            };

            // Store friend 
            $scope.postTaggedFriend = [];
            $scope.dublicate = false;
            $scope.taggedSelectFriend = function(friendInfo, postIndex){
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
            //function to call initial loading
            $scope.showUserWallPostList = function(){
                $scope.userPostList = [];
                $scope.totalSize = 0;
                $scope.myRes = 1;
                $scope.noContent = false; 
                $scope.listUserWallPost();
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
                        scope.post.comment_count--;
                        $scope.deleteCommentIndx = '';
                    }
                    else {
                        $scope.delCommentErrMsg[commentData.id] = $scope.i18n.dashboard.postcomment.delete_comment_fail;
                        $scope.delCommentErrCls[commentData.id] = 'text-red';
                        $scope.deleteCommentIndx = '';
                        $scope.userPostList;
                    }
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
                    $scope.commentErrorCls[postIndx] = 'text-red';
                    $scope.isEditComment[postIndx]= false;
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

            $scope.loadMore = function() {
                if($scope.totalSize > $scope.userPostList.length){
                    $scope.listUserWallPost();
                }
            };
            $scope.showAllFriend = function(post_id, creater_info, allTagFriend){
            $scope.allTagFriends = allTagFriend;
            $scope.post_id = post_id;
            $scope.creater = creater_info;
            var modalInstance = $modal.open({
                template: '<style>.modal-open .modal.in .modal-dialog{width:620px; height:400px;}</style><div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a href ng-click="viewFriendProile(friend.id)">{{friend.first_name}} {{friend.last_name}}</a></span><span data-ng-if="creater.id === currentUser.id || currentUser.id === friend.id" ng-click="RemoveTagFriend(friend, creater.id)" class="rmv-tag"><a href>{{i18n.profile_post.remove_tagged_friend}}</a></span></li></ul></div><div class="modal-footer"></div><style type="text/css">.modal.in .modal-dialog{height:100%;margin:0 auto}.modal.in .modal-dialog .modal-content{position:absolute;width:100%;top:0;bottom:0;left:0;right:0;max-height:80%;margin:auto}.modal-body.tag-frnd-modal{padding:0 10px;overflow:auto;height:86%}</style>',
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

    
        // checking tagged friend
        $scope.validate = false;
        $scope.checkTagUser = function(allTaggedFriend){
            $scope.tagInfo = allTaggedFriend;
            $scope.validate = false;
            angular.forEach($scope.tagInfo,function(index){
                if(index.id === APP.currentUser.id){
                    $scope.validate = true;
                }
            });

            if($scope.validate === true){
                return true;
            }
        };

        $scope.rateSetData = function(data,update,index){
            if(data.code === 101 && data.message === "SUCCESS"){
                $scope.userPostList[index].avg_rate    = data.data.avg_rate;
                $scope.userPostList[index].no_of_votes = data.data.no_of_votes;
                if(update){
                    $scope.userPostList[index].current_user_rate = data.data.current_user_rate;
                    $scope.userPostList[index].is_rated = true;
                } else{
                    $scope.userPostList[index].current_user_rate = 0;
                    $scope.userPostList[index].is_rated = false;
                } 
            }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                //$scope.userPostList[index].avg_rate = 0;
                //$scope.userPostList[index].no_of_votes = 0;
                $scope.userPostList[index].is_rated = false;
                $scope.userPostList[index].current_user_rate = 0;
            }
        };

        $scope.waitRateResponse = false;
        $scope.ratePost = function(rating, post_id, index){
            var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type    = "dashboard_post";
                opts.type_id = post_id;
                opts.rate    = rating;
            $scope.waitRateResponse = true;
            var update;    
            if($scope.userPostList[index].is_rated){
                update = "update";
            }else{
                update = "add";
            } 
            ProfileService.rateThis(opts,update,function(data){
                $scope.waitRateResponse = false;
                $scope.rateSetData(data,true,index);
            });
        };

        $scope.WaitDeleteResponse = false;
        $scope.removeRating = function(post_id, postIndex){
            var opts = {};
                opts.user_id = APP.currentUser.id;
                opts.type    = "dashboard_post";
                opts.type_id = post_id;
                if($scope.WaitDeleteResponse === false){
                    $scope.WaitDeleteResponse = true;
                    $scope.waitRateResponse = true;
                }else{
                    return;
                }
            ProfileService.removeRating(opts,function(data){
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
                $scope.rateSetData(data,false,postIndex);
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
                        //template: '<style>.modal-body.tag-frnd-modal ul li{padding:8px 130px 8px 0}.modal-content .modal-body ul.rmv-tag{position:absolute;right:0;top:10px}.modal-content .modal-body ul.rmv-tag li{padding:0;display:inline-block;vertical-align:middle;border:0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) no-repeat;display:block}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) 0 -21px no-repeat;display:block}.modal.in .modal-dialog{margin:auto;top:0;bottom:0;left:0;right:0;position:absolute}.modal-body.tag-frnd-modal{height:360px;overflow-y:auto;overflow-x:hidden;padding:0 10px}.modal .modal-content{margin:auto;height:400px;top:0;bottom:0;left:0;right:0;position:absolute;overflow:visible}@media screen and (max-width:479px){.modal.in .modal-dialog{margin:auto 20px}.modal-body.tag-frnd-modal ul li{padding:8px 70px 8px 0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 0/12px no-repeat}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 -11px/12px no-repeat}}</style><div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div></div><div class="modal-body tag-frnd-modal"><ul ng-hide="showPeopleLoader"><li data-ng-repeat="friend in ratedUsers"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a ng-href="#/viewfriend/{{friend.id}}">{{friend.first_name}} {{friend.last_name}}</a><span class="frnd-details"><a href>{{friend.about_me}}</a></span></span><ul class="rmv-tag"><li data-ng-repeat="avgRate in averageRating(friend.rate) track by $index"><span ng-class="friend.rate % 1 == 0 ?\'votes-avg\': ($last ? \'half-avg\':\'votes-avg\')" /></li><li ng-repeat="blank in blankStar(friend.rate) track by $index"><span class="votes-blank"/> </li></ul></li></ul> <div ng-show="showPeopleLoader"><img titile="" alt="" src="app/assets/images/proceed.gif"></div></div><div class="modal-footer"></div>',
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
            $scope.showUserWallPostList();
        },
        templateUrl: 'app/views/profile_wall_post_list.html'
        }
    }).filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
    };
});