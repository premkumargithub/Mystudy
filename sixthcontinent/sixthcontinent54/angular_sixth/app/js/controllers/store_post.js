app.controller('StorePostController',['$scope', 'StorePostService', '$location', '$timeout', '$routeParams', 'StoreService', 'StoreCommentService', 'FileUploader' ,'ProfileService','TranslationService','$modal', '$log' , 'focus', function ($scope, StorePostService, $location, $timeout, $routeParams, StoreService, StoreCommentService, FileUploader ,ProfileService,TranslationService, $modal ,$log, focus) {
    if(!$scope.i18n.storealbum){
        TranslationService.getTranslationWithCallback($scope, $scope.activeLanguage, function(data){
           $scope.i18n = data; 
           $scope.postFileErrorMsg = $scope.i18n.storealbum.album_this_no;
        });
    }else{
        $scope.postFileErrorMsg = $scope.i18n.storealbum.album_this_no;
    }

    $scope.storeId = $routeParams.id;
    $scope.currentUserObj = APP.currentUser;
    $scope.storeOwnerId = StoreService.getStoreOwnerId();
    $scope.noComment = false;
    $scope.postErrMsg = '';
    $scope.myRes = 1;
    $scope.postContentStart = false;
    $scope.commentsShowLimit = [];
    $scope.totalSize = 0;
    $scope.textLimit = APP.post_charecter_limit;
    $scope.isSinglePostView = false;
    $scope.noContent = false; 
    $scope.storeData = '';
    $scope.posts = [];
    if($routeParams.postId != undefined && $routeParams.postId != ''){
      $scope.isSinglePostView = true;
    }

    //Create Store post 
    $scope.createPost = function(){
        var link_type;
        $scope.postContentStart = true;
        $scope.postContentLoader = true;
        var description = '';
        var src = '';
        $scope.postErrMsg = '';
        var filescount = $scope.imageSrc.length;
        /*Link Preview feature*/
        var descval = $("#preview_lp1").html();
        var href = $('#previewUrl_lp1').html();
        var textarea = $('#text_lp1').val();
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
            $scope.postInProcess = false;
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

        var opts = {};
        opts.store_id = $scope.storeId; //todo
        opts.post_title = $scope.i18n.storealbum.store_post_title; 
        opts.post_desc = description; 
        opts.user_id = $scope.currentUser.id; 
        opts.post_id = $scope.tempPostId;
        opts.post_type = "1";
        opts.youtube = '';
        opts.media_id = [];
        opts.link_type = link_type;

        var friendId = [];
        if($scope.storedFriend.length > 0){
            for (var i = 0; i < $scope.storedFriend.length; i++) {
                friendId.push($scope.storedFriend[i].user_info.id);
            };

            opts.tagged_friends = friendId.join();
        }else{
            opts.tagged_friends = "";
        }

        angular.forEach($scope.imageSrc, function(file) {
            opts.media_id.push(file.media_id);
        });
        StorePostService.createPost(opts, function(data){
            if(data.code == 101) {
                var newpost = {};
                $scope.storedFriend = [];
                $scope.showTagForm = false;
                newpost = data.data;
                newpost.comments = [];
                $scope.posts.unshift(newpost);
                $scope.noContent = false; 
                $scope.postInProcess = false;
                $scope.postErrMsg = "";
                $scope.postErrCls = '';
                uploader.data.post_id={};
                while(uploader.queue.length) {
                   uploader.queue[0].remove();
                }
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $scope.uploadBox = false;
                $scope.postContentStart = false;
                $scope.postContentLoader = false;
                $scope.tempPostId = '';
                $('#text_lp1').val('');
                $('#text_lp1').attr("style", "");
                $timeout(function(){
                    $('#closePreview_lp1').trigger('click');
                }, 100);  
            } else {
                $scope.postInProcess = false;
                $scope.postErrMsg = $scope.i18n.editprofile.post_unable;
                $scope.postErrCls = 'text-red';
                $timeout(function(){
                    $scope.postErrCls = '';
                    $scope.postErrMsg = '';
                }, 15000);
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.isUpload = false;
                $scope.uploadBox = false;
                $scope.postContentStart = false;
                $scope.postContentLoader = false;
            }
        });
    };
     // Show Tag Column
    $scope.showTagForm = false;
    $scope.showTagCloumn = function(){
        if($scope.showTagForm === false){
            $scope.showTagForm = true;
            focus('shopTagFriend');
        }else{
            $scope.showTagForm = false;
        }
    };

    //focus on the tagged text box
    $scope.focusOnShopTag = function(){
        focus('shopTagFriend');
    };


    // Show the list of friend
    var DELAY_TIME_BEFORE_POSTING = 300;
    var currentTimeout = null;
    // angular.element('#searchTagFriend').keypress(function(event) {
    //     var model = $scope.searchText;
    //     if(currentTimeout) {
    //     $timeout.cancel(currentTimeout);
    //     }
    //     currentTimeout = $timeout(function(){
    //         if(event.which != 13){ 
    //             $scope.tagFriendSuggestion();
    //         }
    //     }, DELAY_TIME_BEFORE_POSTING)
    // });

    $scope.friends = [];
    // $scope.friendName ="";
    $scope.cancelFriendSearch = false;
    $scope.showSearchLoader = false;
    $scope.tagFriendSuggestion = function(friendName){
        $scope.cancelFriendSearch = false;
        $scope.showFriendList = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_name = $('#shopTagFriend').val();
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
                angular.element('#shopTagFriend').val("");
                $scope.showFriendList = false;
            }else{
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#shopTagFriend').val("");
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
            angular.element('#shopTagFriend').val("");
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
    $scope.keyUpDownControl = function(event, friendName){
        if(event.keyCode===40){
            // event.preventDefault();
            if($scope.friendTaggIndex+1 !== $scope.friends.length){
                $scope.friendTaggIndex++;
            }
        }else if(event.keyCode===38){
            // event.preventDefault();
            if($scope.friendTaggIndex-1 !== -1){
                $scope.friendTaggIndex--;
            }
        }else if(event.keyCode===13){
                $scope.selectFriend($scope.friends[$scope.friendTaggIndex]);
        }else if(!(event.keyCode>=65 && event.keyCode<=95)){
            return
        }else{
            $scope.tagFriendSuggestion(friendName);
        }
    };


    //modal for remove tag when user clicked on notifications
    $scope.showAllFriend = function(post_id, creater_info, allTagFriend){
        $scope.allTagFriends = allTagFriend;
        $scope.post_id = post_id;
        $scope.creater = creater_info;
        var modalInstance = $modal.open({
            template: '<div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a href ng-click="viewFriendProile(friend.id)">{{friend.first_name}} {{friend.last_name}}</a></span><span data-ng-if="creater.id === currentUser.id || currentUser.id === friend.id" ng-click="RemoveTagFriend(friend, creater.id)" class="rmv-tag"><a href>{{i18n.profile_post.remove_tagged_friend}}</a></span></li></ul></div><div class="modal-footer"></div>',
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
            StoreService.removeShopTagg(opts,function(data){
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
    // function to get the post and comment of the post
    $scope.getPosts = function() {
        var limit_start = $scope.posts.length;
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.user_id = $scope.currentUser.id;
        opts.limit_start = limit_start;
        opts.limit_size = APP.dashbord_pagination.end;
        if ((($scope.totalSize > limit_start ) || $scope.totalSize == 0 ) && $scope.myRes == 1) {
            $scope.myRes = 0;
            $scope.isLoading = true;
            // This service's function returns post
            StorePostService.listPost(opts, function(data){
                $scope.isLoading = false;
                if(data.code == 101)
                {
                    $scope.isLoading = false;
                    var items = data.data;
                    $scope.storeData = StoreService.getStoreData();
                    //StoreService.SetStoreData({});
                    if(items != undefined){
                        $scope.posts = $scope.posts.concat(items);    
                    }
                    $scope.totalSize = data.count;
                } 
                if ($scope.posts.length == 0){
                    $scope.noContent = true; 
                } 
                $scope.myRes = 1;
            });
        } 
    };
    
    //function to call initial loading
    // $scope.showShopPostList = function(){
        
    //     $scope.totalSize = 0;
    //     $scope.myRes = 1;
    //     $scope.noContent = false; 
    //     $scope.getPosts();
    // };

    // calling get post function on controller load
    //$scope.showShopPostList();

    $scope.loadMore = function() {
        if($scope.totalSize > $scope.posts.length){
            $scope.getPosts();
        }
    };

    
    //function to show all comment of the post
    $scope.showAllComment = function(postIndx) {
        $scope.commentInProcess = true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.user_id = $scope.currentUser.id;
        $scope.showLimitedComment(opts, postIndx);
    };

    
    //function to show limited comment of the post
    $scope.commentLoading = [];
    $scope.showLimitedComment = function(postIndx) {
        $scope.commentLoading[postIndx] =  true;
        $scope.showComments[postIndx] = true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.user_id = $scope.currentUser.id;
        $scope.getComments(opts, postIndx);
    };

    
    //funciton to delete single post
    $scope.deleteErrMsg = [];
    $scope.isDeletePost = [];
    $scope.deleteErrCls = [];
    $scope.deletePost = function(indx) {
        $scope.isDeletePost[indx] = true;
        var postData = {};
        postData = $scope.posts[indx];
        var formData = {};
        formData.user_id = $scope.currentUser.id;
        formData.post_id = postData.post_id;
        
        //calling the service to delete the selected post 
        StorePostService.deletePost(formData, function(data){
            if(data.code == 101) {
                $scope.posts.splice(indx, 1);
                if($scope.posts.length == 0){
                    $scope.noContent = true;
                }
                $scope.isDeletePost[indx] = false;
            } else {
                $scope.deleteErrCls[indx] = 'text-red';
                $scope.deleteErrMsg[indx]= $scope.i18n.dashboard.postcomment.delete_post_fail;
                $scope.isDeletePost[indx] = false;
            }
            $timeout(function(){
                $scope.deleteErrCls[indx] = '';
                $scope.deleteErrMsg[indx] = '';
                $scope.isDeletePost[indx] = false;
            }, 15000);
        });
    };

    //function to add image on user post
    $scope.isImage = false;
    $scope.isUpload = false;
    $scope.uploadBox = false; //previously used to hide the text area in first click of photo tab 
    $scope.addImage = function() {
        var href = $('#previewUrl_lp1').html();
        if(href != ''){
            $timeout(function(){
                $('#closePreview_lp1').click();
            }, 100);
        }
        $scope.isImage = true;
        $scope.imageSrc = [];
        $scope.postFiles = [];
        $scope.uploadBox = true;
        uploader.queue = [];
        $scope.isUpload = false;
    };
    $scope.addPost = function() { 
        $scope.isImage = false;
        $scope.imgUpload = false;
        $scope.uploadBox = false;
        $scope.isPost = true;
        $scope.imageSrc = [];
        $scope.postFiles = [];
    };

    

    //funciton to delete media of post 
    $scope.deleteMediaPost = function(postIndx,mediaIndx) {
        $scope.deletePostIndx = postIndx;
        var post = $scope.posts[postIndx];

        var opts = {};
        opts.user_id = $scope.currentUser.id;
        opts.session_id = APP.currentUser.id;
        opts.post_id = post.post_id;
        opts.media_id = post.media_info[mediaIndx].id;
       

        //calling the post service to delete media of the selected post 
        StorePostService.deleteMediaPost(opts, function(data){
            if(data.code == 101) {
                $scope.deletePostIndx = -1;
                $scope.posts[postIndx].media_info.splice(mediaIndx, 1);
            }
            else {
                $scope.deletePostIndx = -1;
                $scope.posts;
            }
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
        var post = $scope.posts[postIndx];
        
        if (editPostText == undefined || editPostText == '') {
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
        opts.user_id = $scope.currentUser.id;
        opts.store_id = $scope.storeId;
        opts.post_id = post.post_id;
        opts.post_title = post.store_post_title; //This dummy data as currently there is no field to accept the posttitle
        opts.post_desc = editPostText;
        opts.youtube = '';
        var myFile = '';
        var friendIdList = [];
        if($scope.postTaggedFriend[postIndx] && $scope.postTaggedFriend[postIndx].length > 0){
            angular.forEach($scope.postTaggedFriend[postIndx],function(index){
                friendIdList.push(index.id);
            });

            opts.tagged_friends = friendIdList.join();
        }else{
            opts.tagged_friends = "";
        }
        StorePostService.updatePost(opts, myFile, function(data){
            if(data.code == 101) {
                if($scope.postTaggedFriend[postIndx].length > 0){
                    post.tagged_friends_info = $scope.postTaggedFriend[postIndx];
                }else{
                    post.tagged_friends_info = "";
                }
                $scope.updatePostInProcess[postIndx] = false;
                $scope.editPostErrorCls[postIndx] = '';
                $scope.editPostErrorMsg[postIndx] = '';
                
                $scope.posts[postIndx].store_post_desc = editPostText;
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

    $scope.updateBody = [];
    $scope.activeEdit = [];
    $scope.updatePostInProcess = [];
    $scope.editPostErrorMsg = [];
    $scope.showTagLoading = [];
    $scope.postTaggedFriend = [];
    //funtion to open form to update post
    $scope.updatePost = function(postIndx) {
        $scope.editPostErrorMsg[postIndx]='';
        $scope.editPostErrorCls[postIndx]='';
        var post = $scope.posts[postIndx];
        //for resize the textarea
        autosize(document.querySelectorAll('.editpostbox'));
        var str = $.trim(post.store_post_desc.replace(/\n\n\n+/g, '\n\n'));
        var htmlstr = str.replace(/\n/g,'<br />');
        var height = $('<div style="display:block;" id="postedit-hidden-div"></div>')
        .html(htmlstr)
        .appendTo('#post_'+post.post_id)
        .height();     
        $('#editpost_'+post.post_id).css('height',height + 'px');
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
        //focus('shopPostList'+postIndx);
        //set cursor start of textarea
        $timeout(function(){
            $('#editpost_'+post.post_id).putCursorAtStart();
        },200);
    };

    $scope.postListFocusShop = function(indx){
        focus('shopPostList'+indx);
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
        if($scope.postTaggedFriend[postIndex]==undefined) $scope.postTaggedFriend[postIndex] = [];
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
        
        // $scope.friends = [];
        $timeout(function(){
            $scope.showFriendList = false;
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
        } else {
            $scope.getPosts();
        }
    };
   $scope.showUserPostList();

    $scope.imageSrc = [];
    $scope.postFiles = [];
    $scope.postImgLoader = [];
    $scope.tempPostId = '';
    var uploader = $scope.uploader = new FileUploader({
        url: APP.service.createStorePost+"?access_token="+APP.accessToken,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'method': 'POST'
            /*'Accept': 'text/json'*/
        },
        data:{
            'user_id': $scope.currentUser.id,
            'store_id': $scope.storeId,
            'post_title':"Not in use on frontend", //This dummy data as currently there is no field to accept the posttitle
            'post_desc':'',
            'youtube':'',
            'to_id': $scope.currentUser.id,
            'link_type':"0",
            'post_type':"0",
            'post_id': $scope.tempPostId
        },
        dataObjName:'reqObj',
        formDataName:'store_media[]'
    });

    // FILTERS
    uploader.filters.push({
        name: 'store_media[]',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onAfterAddingFile = function(fileItem) {
        $scope.postContentStart = true;
        uploader.data.post_id = $scope.tempPostId;
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
            $scope.imageSrc[index] = response.data;
            $scope.postImgLoader[index] = false;
            $scope.tempPostId = response.data.post_id;
            uploader.data.post_id = response.data.post_id;
        }
    };

    uploader.onCompleteAll = function() {
        $scope.postContentStart = false;
    }

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        $scope.postErrMsg = $scope.i18n.storepost.incorrect_upload;
        $scope.postErrCls = 'text-red';
        $timeout(function(){
            $scope.postErrCls = '';
            $scope.postErrMsg = '';
        }, 15000);
    };

   
   

    //remove iamge from preview array
    $scope.removeImage = function(index) {
        var tempImg = $scope.imageSrc[index];
        $scope.imageSrc.splice(index, 1);
        var item = $scope.uploader.queue[index];
        item.remove();
        var opts = {};
        opts.user_id = $scope.currentUser.id;
        opts.session_id = APP.currentUser.id;
        opts.media_id = tempImg.media_id;
        opts.post_id = $scope.tempPostId;
        
        //calling the service to delete the selected post 
        StorePostService.deleteMediaPost(opts, function(data){
            if(data.code == 101) {
            } else {
                $scope.postErrCls = 'text-red';
                $scope.postErrMsg = $scope.i18n.dashboard.postcomment.remove_img_fail;
                $scope.imageSrc[index] = tempImg;
            }
            $timeout(function(){
                $scope.postErrCls = '';
                $scope.postErrMsg = '';
            }, 15000);
        });
    };
    //end image preview section-->

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
    
    $(".fancybox").fancybox();

}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
