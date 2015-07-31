app.controller('ShopReviewController',['$scope', '$http', '$location', '$routeParams' ,'$cookieStore', 'StoreService','StoreCommentService','ProfileService','$modal', '$timeout', function ($scope, $http, $location, $routeParams, $cookieStore, StoreService, StoreCommentService, ProfileService, $modal, $timeout) {  
	$scope.storeMainId = $routeParams.id;
    $scope.delCommentErrMsg = [];
        $scope.delCommentErrCls = [];
        $scope.editCommentText = [];
        $scope.activeCommentEdit = [];
        $scope.isEditComment = [];
        $scope.commentErrorMsg = [];
        $scope.commentErrorCls = [];
        $scope.commentInProcess = [];
        $scope.showComments = [];
        $scope.frndId = '';
        $scope.textLimit = APP.post_charecter_limit;
        $scope.storeData = '';

    // function to get the post and comment of the post
    $scope.getPosts = function() {
        var limit_start = $scope.posts.length;
        var opts = {};
        opts.store_id = $scope.storeMainId;
        opts.user_id = APP.currentUser.id;
        opts.limit_start = limit_start;
        opts.limit_size = 5;
        if($scope.frndId != ''){
            opts.friends_ids = $scope.frndId;   
        }
        if ((($scope.totalSize > limit_start ) || $scope.totalSize == 0 ) && $scope.myRes == 1) {
            $scope.myRes = 0;
            $scope.isLoading = true;
            // This service's function returns post
            StoreService.listcustomersreviews(opts, function(data){
                $scope.isLoading = false;
                if(data.code == 101)
                {
                    $scope.isLoading = false;
                    var items = data.data;
                    $scope.storeData = StoreService.getStoreData();
                    //console.log();
                    if(items != undefined){
                        $scope.posts = $scope.posts.concat(items);    
                    }
                    //alert(JSON.stringify($scope.posts));
                    $scope.totalSize = data.count;
                } 
                //alert($scope.posts.length);
                if ($scope.posts.length == 0){
                    $scope.noContent = true; 
                } 
                $scope.myRes = 1;
            });
        } 
    };
    
    //function to call initial loading
    $scope.showShopPostList = function(){
        $scope.posts = [];
        $scope.totalSize = 0;
        $scope.myRes = 1;
        $scope.noContent = false; 
        $scope.getPosts();
    };

    // calling get post function on controller load
    $scope.showShopPostList();

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

    $scope.loadMore = function() {
    if($scope.posts.length > 0){
      $scope.getPosts();
    }
    };

    //Get friend count on store
    $scope.frindBoughtCount = function() {       
        var opts = {};
        opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":[$scope.storeMainId],"citizen_id":String(APP.currentUser.id)}]}
        //calling the comment service to delete the selected comment 
        StoreService.frindboughtcount(opts, function(data){
            if(data.response === undefined || data.response === ''){
                $scope.frcount = 0;   
            } else {
                $scope.frcount = data.response[0].count;   
            }
        });
    };
    $scope.frindBoughtCount();
    //funciton to delete single comment
    $scope.friendsId = [];
    $scope.searchFriend = function() {  
         $scope.friendsId = [];         
        var formData = {};
        formData.user_id = $scope.currentUser.id;
        formData.shop_id = $scope.storeMainId;
        //calling the comment service to delete the selected comment 
        StoreService.getfriendboughtonstores(formData, function(data){
            if(data.code == 101) {
                //data.data.friends = 
                $scope.friendlist = data.data.friends;
                if($scope.friendlist !== undefined){
                    for(var i=0; i<$scope.friendlist.length; i++){
                        $scope.friendsId.push(String(data.data.friends[i].id));
                    }
                }    
                //console.log($scope.friendsId);
            } else {
                
            }
        });
    };
    $scope.singleArray = [];
    $scope.frndVal = function() {
        $scope.singleArray = [];
        if($scope.friends != null && $scope.friends != 'all'){
            $scope.singleArray.push(String($scope.friends));
            $scope.frndId = $scope.singleArray; 
        } else if($scope.friends == 'all'){
            $scope.frndId = $scope.friendsId;
        } else {
            $scope.frndId = '';
        }
       $scope.showShopPostList();
    }

    $scope.searchFriend();

      //funciton to delete single comment        
        $scope.deleteComment = function(postIndx, indx) {
            var indx = indx;
            var commentData = $scope.posts[postIndx].comments[indx];
            var comments = [];
            $scope.deleteCommentIndx = commentData.id;
            var post = $scope.posts[postIndx];

            var formData = {};
            formData.user_id = $scope.currentUser.id;
            formData.comment_id = commentData.id;

            //calling the comment service to delete the selected comment 
            StoreCommentService.deleteComment(formData, function(data){
                if(data.code == 101) {
                    $scope.delCommentErrMsg[commentData.id] = '';
                    $scope.delCommentErrCls[commentData.id] = '';
                    $scope.deleteCommentIndx = -1;
                    var opts = {};
                    opts.post_id = post.post_id;
                    opts.user_id = $scope.currentUser.id;
                    $scope.posts[postIndx].comments.splice(indx,1);
                }
                else {
                    $scope.delCommentErrMsg[commentData.id] = $scope.i18n.dashboard.postcomment.delete_comment_fail;
                    $scope.delCommentErrCls[commentData.id] = 'text-red';
                    $scope.deleteCommentIndx = -1;
                    $scope.posts;
                }
                $timeout(function(){
                    $scope.delCommentErrCls[commentData.id] = '';
                    $scope.delCommentErrMsg[commentData.id] = '';
                }, 15000);
            });
        };
        //funciton to delete single comment
        $scope.deleteMediaComment = function(comment, postIndx, mediaIndx) {
            //TODO:: media index need to be come dynamic for multiple medias
            var commentData = comment;
            var post = $scope.posts[postIndx];
            $scope.deleteCommentIndx = commentData.id;
            
            var formData = {};
            formData.user_id = $scope.currentUser.id;
            formData.comment_id = commentData.id;
            formData.comment_media_id = commentData.comment_media_info[0].id;

            //calling the comment service to delete the selected comment 
            StoreCommentService.deleteMediaComment(formData, function(data){
                if(data.code == 101) {
                    $scope.deleteCommentIndx = -1;
                    var opts = {};
                    opts.post_id = post.post_id;
                    opts.user_id = $scope.currentUser.id;
                    $scope.getComments(opts, postIndx);
                }
                else {
                    $scope.deleteCommentIndx = -1;
                    $scope.posts;
                }
            });
        };

        //funtion to open form to update comment
    $scope.updateComment = function(postIndx, indx) {
        $("#commentBoxId-"+postIndx).hide();
        $scope.commentInProcess[postIndx] = true;
        $scope.commentErrorMsg[postIndx] = '';
        $scope.commentErrorCls[postIndx]= '';
        var comment = $scope.posts[postIndx].comments[indx];
        var indx = indx;
        $scope.activeCommentEdit[postIndx]= comment.id;
        $scope.isEditComment[postIndx] = false;
        $scope.editCommentText[postIndx]=comment.comment_text;
    }

        //function to edit a comment
        $scope.editComment = function(postIndx, indx) {
            var opts = {};
            var post = $scope.posts[postIndx];
            var comment = $scope.posts[postIndx].comments[indx];
            var newText = $scope.editCommentText[postIndx];
            var indx = indx;
            $scope.isEditComment[postIndx] = true;
            $scope.commentErrorMsg[postIndx]= '';
            
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

            opts.user_id = $scope.currentUser.id;
            opts.post_id = post.post_id;
            opts.comment_id = comment.id;
            opts.comment_author = comment.comment_user_info.id;
            opts.youtube_url = comment.youtube_url;
            opts.comment_text = newText;
            
            StoreCommentService.updateComment(opts, function(data){
                if(data.code == 101) {
                    $scope.posts[postIndx].comments[indx].comment_text = newText;
                    $scope.activeCommentEdit[postIndx] = '';
                    $scope.commentErrorCls[postIndx] = '';
                    $scope.commentErrorMsg[postIndx] = '';
                    $scope.commentInProcess[postIndx] = false;
                    $scope.editCommentText[postIndx] = '';
                    $("#commentBoxId-"+postIndx).show();
                    $scope.isEditComment[postIndx] = false;
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

        //funtion to close the edit form to cancel comment
        $scope.cancelEditComment = function(postIndx, indx) {
            $scope.commentInProcess = [];
            $scope.commentInProcess[postIndx] = false;
            $scope.activeCommentEdit[postIndx] = [];
            $scope.activeCommentEdit[postIndx][indx] = -1;
            $scope.editCommentText[postIndx]='';
            $scope.commentErrorCls[postIndx] = '';
            $scope.commentErrorMsg[postIndx] = '';
            $("#commentBoxId-"+postIndx).show();
        };

        $scope.allCommentLoad = [];
        $scope.showAllComments = function(postIndx) {
            $scope.allCommentLoad[postIndx] = true;
            var post = $scope.posts[postIndx];
            var opts = {};
            opts.post_id = post.post_id;
            opts.user_id = $scope.currentUser.id;
            $scope.getComments(opts, postIndx);
            $scope.showComments[postIndx] = true;
        };
        // function to get the post and comment of the post
        $scope.comments = [];
        $scope.getComments = function(opts, postIndx) {
            $scope.comments[postIndx] = [];
            
            // This service's function returns post
            StoreCommentService.listComment(opts, function(data){
                if(data.code == 100)
                {
                    $scope.posts[postIndx].comments = data.data.comment;
                    $scope.allCommentLoad[postIndx] = false;
                        if($scope.comments[postIndx].length  != 0 ) {
                            $scope.noComment = true;
                        }
                } else {
                    $scope.allCommentLoad[postIndx] = true;
                }
            });
        };

        $scope.showAllFriend = function(post_id, creater_info, allTagFriend){
            $scope.allTagFriends = allTagFriend;
            $scope.post_id = post_id;
            $scope.creater = creater_info;
            var modalInstance = $modal.open({
                template: '<div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a href ng-click="viewFriendProile(friend.id)">{{friend.first_name}} {{friend.last_name}}</a></span></li></ul></div><div class="modal-footer"></div>',
                controller: 'ModalController',
                size: 'lg',
                scope: $scope,
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
            $scope.viewFriendProile = function(friendId){
                modalInstance.dismiss('cancel');
                $location.path('/viewfriend/'+friendId);
            };
        };


}]);