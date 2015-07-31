  //Displaying the post form for store detail
app.directive('friendProfilePostList',['ProfileService', '$routeParams', '$location', 'focus', function(ProfileService,$routeParams ,$location, focus) {
    return {
      restrict: 'E',
      controller: function ($scope, $timeout, $modal, $log){
        $scope.showComments = [];
        $scope.getfriendId= $routeParams.friendId;
        $scope.commentsShowLimit = [];
        $scope.commentsLength = [];
        $scope.textLimit = APP.post_charecter_limit;

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
        //funciton to list user post on dashboard
        //TODO: infinite scoller is remaining
        $scope.listFriendPost = function() {
            var opts = {};
            var limit_start = $scope.userPostList.length;
            opts.user_id = APP.currentUser.id;
            opts.limit_start = limit_start;
            opts.limit_size = APP.dashbord_pagination.end;
            opts.friend_id = $scope.getfriendId;
            //calling the services to get the user post list
            if ((($scope.totalSize > limit_start ) || $scope.totalSize == 0 ) && $scope.myRes == 1) {
                $scope.myRes = 0;
                ProfileService.getDashboardWallFeeds(opts, function(data){
                    if(data.code == 101) {
                        var items = data.data.post;
                        for (var i = 0; i < items.length; i++) {
                            $scope.userPostList.push(items[i]);
                        }
                        $scope.totalSize = data.data.count;
                        $scope.isLoading = false;
                    } else {
                        $scope.isLoading = false;
                        $scope.userPostList;
                    }
                    if ($scope.userPostList.length == 0){
                        $scope.noContent = true; 
                    } 
                    $scope.myRes = 1;
                });
            } else {
                $scope.isLoading = false;
                if ($scope.userPostList.length == 0){
                    $scope.noContent = true; 
                } 
                $scope.userPostList;
            }
        };

        $scope.loadMore = function() {
            if($scope.totalSize > $scope.userPostList.length){
                $scope.isLoading = true;
                $scope.listFriendPost();
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
                $scope.updatePostInProcess = false;
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
            opts.to_id = $routeParams.friendId; 
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
                    $scope.editPostErrorCls[postIndx] = '';
                    $scope.editPostErrorMsg[postIndx] = '';
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


        $scope.updateBody = [];
        $scope.activeEdit = [];
        $scope.postTaggedFriend = [];
        $scope.showTagLoading = [];
        //funtion to open form to update post
        $scope.updatePost = function(postIndx) {
            $scope.editPostErrorMsg[postIndx]='';
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

        $scope.gainTextFocus = function(indx){
            focus('friendSearchField'+indx);
        };
        // close the edit form on cancel
        $scope.cancelPost = function(postIndx) {
            $('#postedit-hidden-div').remove();
            $scope.updateBody[postIndx] = '';
            $scope.activeEdit[postIndx] = false;
            $scope.editPostErrorCls[postIndx] = '';
            $scope.editPostErrorMsg[postIndx] = '';
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

                if($scope.dublicate === false){console.log(friendInfo);console.log(postIndex);
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
                }else if(event.keyCode===13){console.log($scope.friends[index][$scope.friendTagIndex[index]]);
                        $scope.taggedSelectFriend($scope.friends[index][$scope.friendTagIndex[index]], index);
                }
            };
        //function to call initial loading
        $scope.showFriendPostList = function(){
            $scope.isLoading = true;
            $scope.userPostList = [];
            $scope.totalSize = 0;
            $scope.myRes = 1;
            $scope.noContent = false; 
            $scope.listFriendPost();
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
          $scope.showComments[postIndx] = true;
          $scope.commentLoading[postIndx] = true;
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
                    $scope.delCommentErrCls[postIndx] = '';
                    $scope.delCommentErrMsg[postIndx] = '';
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
                    $scope.activeCommentEdit[postIndx] = '';
                    $scope.commentInProcess[postIndx] = false;
                    $scope.isEditComment[postIndx] = false;
                    $scope.commentErrorCls[postIndx] = 'text-red';
                    $scope.commentErrorMsg[postIndx]= $scope.i18n.editprofile.not_posted;
                    $scope.editCommentText[postIndx] = '';
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
            $scope.commentErrorMsg[postIndx] = '';
            $scope.commentErrorCls[postIndx] = '';
            $scope.editCommentText[postIndx] = '';
            $scope.isEditComment[postIndx] = false;
            $("#commentBoxId-"+postIndx).show();
        };
        $scope.showAllFriend = function(post_id, creater_info, allTagFriend){
            $scope.allTagFriends = allTagFriend;
            $scope.post_id = post_id;
            $scope.creater = creater_info
            var modalInstance = $modal.open({
                template: '<div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px"  alt="No image available"  data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a href ng-click="viewFriendProile(friend.id)">{{friend.first_name}} {{friend.last_name}}</a></span><span data-ng-if="creater.id === currentUser.id || currentUser.id === friend.id" ng-click="RemoveTagFriend(friend, creater.id)" class="rmv-tag"><a href>{{i18n.profile_post.remove_tagged_friend}}</a></span></li></ul></div><div class="modal-footer"></div>',
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
                    $scope.userPostList[postIndx].current_user_rate = 0;
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
            ProfileService.removeRating(opts,function(data){ console.log($scope.userPostList[postIndx]);
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
        $scope.showFriendPostList();
      },
      templateUrl: 'app/views/profile_friend_post_list.html'
    }
  }]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});;

  //Displaying the post form for store detail
  app.directive('friendProfilePostForm',['$timeout', 'ProfileService', 'FileUploader', '$sce', '$routeParams', 'focus' , function($timeout, ProfileService, FileUploader, $sce, $routeParams, focus) {
    return {
      restrict: 'E',
      controller: function ($scope){
        if($scope.friendProfile.user_info.friend_type == 2){
            $scope.privacySet = 3;
        } else if($scope.friendProfile.user_info.friend_type == 1){
            $scope.privacySet= 3;    
        } else {
            $scope.privacySet= 3;
        }
        //update model fo privacySet
        $scope.updatePrivacyModel = function (pindx){
            $scope.privacySet = pindx;
        }
        
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
              'to_id': $routeParams.friendId,
              'link_type':"0",
              'post_type':"0",
              'privacy_setting': $scope.privacySet
              //'post_id': $scope.tempPostId,
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
                }, 100);
            }
            $scope.isImage = true;
            $scope.imgUpload = false;
            $scope.uploadBox = true;
            $scope.imagePrvSrc = [];
            $scope.postProfileFiles = [];
        };
        $scope.addPost = function() { 
            $scope.isImage = false;
            $scope.imgUpload = false;
            $scope.uploadBox = false;
            $scope.isPost = true;
            $scope.imagePrvSrc = [];
            $scope.postProfileFiles = [];
        };
            //remove iamge from preview array
        $scope.removeImage = function(index) {
            var tempImg = $scope.imagePrvSrc[index];
            $scope.imagePrvSrc.splice(index, 1);
            var item = $scope.uploader.queue[index];
            item.remove();
            var formData = {};
            formData.user_id = APP.currentUser.id;
            formData.post_media_id = tempImg.media_id;

            //calling the service to delete the selected post 
            ProfileService.deletePostMedia(formData, function(data){
                if(data.code == 101) {
                    
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
            uploader.uploadItem(fileItem);
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
            $scope.postContentStart = false;
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
            $scope.activeEdit.length = 0;
            $scope.updateBody = [];
            $scope.activeEdit = [];
            $scope.editPostErrorCls = [];
            $scope.editPostErrorMsg = [];
            var link_type;
            $scope.postContentStart = true;
            $scope.postContentLoader = true;
            var opts = {};
            $scope.postErrMsg = '';
            var filescount = $scope.imagePrvSrc.length;
            
            /*Link Preview feature*/
            var descval = $("#preview_lp1").html();
            var href = $('#previewUrl_lp1').html();
            var textarea = $('#text_lp1').val();
            var description = '';
            description = textarea;
            var regex = /src="([^"]+)"/;
            var src = description.split(regex)[1];
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
          opts.to_id = $routeParams.friendId;
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
                  $scope.noContent = false;
                  var targetObject = {};
                  targetObject = data.data;
                  $scope.userPostList.unshift(targetObject);
                  $scope.postErrMsg = '';
                  $scope.imagePrvSrc = [];
                  $scope.postProfileFiles = [];
                  $scope.postErrCls = '';
                    
                  uploader.data.post_id={};
                  while(uploader.queue.length) {
                     uploader.queue[0].remove();
                  }
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
                            $('#closePreview_lp1').click();
                    }, 100);
                } else {
                    if($scope.userPostList.length == 0){
                        $scope.noContent = true; 
                    }
                    $scope.postErrCls = 'text-red';
                    $scope.postErrMsg = $scope.i18n.editprofile.post_unable;
                    $timeout(function(){
                        $scope.postErrCls = '';
                        $scope.postErrMsg = '';
                    }, 15000);
                  $scope.imagePrvSrc = [];
                  $scope.postContentStart = false;
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
                focus('friendSearchTagFriend');
            }else{
                $scope.showTagForm = false;
            }
        };

        $scope.focusOn = function(){
            focus('friendSearchTagFriend');
        };
    
        // Show the list of friend
        var DELAY_TIME_BEFORE_POSTING = 300;
        var currentTimeout = null;
        angular.element('#friendSearchTagFriend').keypress(function(event) {
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
                $scope.friendTagIndex = -1;
                angular.element('#friendSearchTagFriend').val("");
                $scope.showFriendList = false;
            }else{
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTagIndex = -1;
                angular.element('#friendSearchTagFriend').val("");
                $scope.showFriendList = false;
            }
        };

        // stop the service for loading more service
        $scope.lostFocus = function(){
            $timeout(function(){
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTagIndex = -1;
                angular.element('#friendSearchTagFriend').val("");
                $scope.showFriendList = false;
            },300);
        };
        // Remove selected friend
        $scope.removeTagFriend = function(friendIndex){
            var index = $scope.storedFriend.indexOf(friendIndex);
            $scope.storedFriend.splice(index,1);
        };

        // Up down key control in search friend list
        $scope.friendTagIndex = -1;
        $scope.keyUpDownControl = function(event){
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
                    $scope.selectFriend($scope.friends[$scope.friendTagIndex]);
            }
        };
     
      },
      link: function (scope, iElement, iAttrs) {
        $($('#lp1').linkPreview()).appendTo(iElement[0]);
      },
      templateUrl: 'app/views/profile_friend_post_form.html'
      }
  }]);

  