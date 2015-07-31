//Displaying the comment post form for store detail
app.directive('groupCommentForm',['CommentService', 'fileReader','FileUploader', '$timeout', function(CommentService, fileReader, FileUploader, $timeout) {
  return {
    restrict: 'E',
      templateUrl: 'app/views/group_comment_form.html',
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
        scope.getFile = function () {
            var tempopts = {};
            tempopts.session_id = APP.currentUser.id;
            tempopts.postid = attrs.postId;
            tempopts.body = scope.i18n.editprofile.comment_image_test;
            tempopts.comment_type = '0';
            tempopts.image_id = '';
            tempopts.comment_id = '';
            var len = scope.commentFiles.length;
            CommentService.createCommentWithImage(tempopts, scope.commentFiles[0], function(data){
                if(data.code == 101) {
                    scope.comment_id = data.data.id;
                    scope.imgSrc.push(data.data);
                    scope.image_id.push(data.data.media_id);
                    tempopts.comment_id = scope.comment_id;
                    scope.selectInProgress.splice(0,1);
                    for(j=1; j < len; j++){
                        CommentService.createCommentWithImage(tempopts, scope.commentFiles[j], function(data){
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
          scope.imgSrc.splice(index, 1);
          scope.isInProgress.splice(index, 1);
          scope.image_id.splice(index, 1);
          if(scope.imgSrc.length == 0){
            scope.selectInProgress = [];
            scope.commentFiles == [];
            scope.file = [];
            scope.showImgSelect = true;
            scope.showPreview = false;
          }
          
      };
      
      scope.res = 0;
      scope.addComment = function(){
        scope.commentErrCls = '';
        scope.commentErrMsg = '';
        scope.finalCommentInProcess = true;
        scope.commentErrMsg = "";
        var filescount = scope.imgSrc.length;
        var postIndx = attrs.postIndx;

        if ((scope.commentText === undefined || scope.commentText === '') && filescount === 0) {
            scope.finalCommentInProcess = false;
            scope.commentErrMsg = scope.i18n.groupcontrol.write_post;
            scope.commentErrCls = 'text-red';
            $timeout(function(){
              scope.commentErrCls = '';
              scope.commentErrMsg = '';
            }, 15000);
            return false;
        }  

        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.postid = attrs.postId;
        opts.body = scope.commentText;
        opts.media_id = [];
        opts.youtube_url='';
        opts.comment_id = "";
        if(scope.image_id.length != 0){
          opts.media_id = scope.image_id;
        }
        if(scope.comment_id != ''){
          opts.comment_id = scope.comment_id;  
        }
        opts.comment_type = '1';
        
        opts.tagging = scope.taggedObject; // for taggedObject
        if(scope.res == 0){
          scope.res = 1;
          CommentService.createComment(opts, function(data){
            scope.res = 0;
            if(data.code == 101) {
              scope.finalCommentInProcess = false;
              scope.commentErrorMsg = '';
              scope.commentErrCls = '';
              scope.commentText = '';
              scope.posts[postIndx].comments.push(data.data);
              scope.posts[postIndx].comment_count++;
              scope.commentFiles = [];
              scope.imgSrc = [];
              scope.showPreview = false;
              scope.showImgSelect = true;
              scope.comment_id = '';
            } else {
              scope.finalCommentInProcess = false;
              scope.showImgSelect = true;
              scope.commentErrCls = 'text-red';
              scope.commentErrMsg = scope.i18n.groupcontrol.not_posted;
              scope.commentFiles = [];
              scope.imgSrc = [];
              scope.file = [];
              scope.showPreview = false;
              scope.showImgSelect = true;
              scope.comment_id = '';
            }
            $timeout(function(){
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
app.directive('groupPostList', function() {
  return {
      restrict: 'E',
      controller: function ($scope, PostService, $location, $timeout, $routeParams, CommentService, FileUploader ,ProfileService,$modal ,$log){
        $scope.editCommentText = [];
        $scope.activeCommentEdit = [];
        $scope.isEditComment = [];
        $scope.commentEditErrMsg = [];
        $scope.commentInProcess = [];
        $scope.commentEditErrCls = [];
        $scope.isSinglePostView = false;
        $scope.temp = $routeParams.postId;
        if($routeParams.postId != undefined && $routeParams.postId != ''){
          $scope.isSinglePostView = true;
        }
        //funtion to open form to update comment
        $scope.updateComment = function(postIndx, comment) {
            var indx = $scope.posts[postIndx].comments.indexOf(comment);
            $("#commentBoxId-"+postIndx).hide();
            $scope.commentInProcess[postIndx] = true;
            $scope.commentEditErrMsg[postIndx] = '';
            $scope.commentEditErrCls[postIndx] = '';
            $scope.commentInProcess = [];
            var post = $scope.posts[postIndx];
            var comment = $scope.posts[postIndx].comments[indx];
            $scope.isEditComment[postIndx] = false;
            $scope.activeCommentEdit[postIndx]= comment.id;
            $scope.editCommentText[postIndx]=comment.comment_text;
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
            //function to edit a comment
        $scope.editComment = function(postIndx, indx, comment) {
            var opts = {};
            var post = $scope.posts[postIndx];
            var indx = $scope.posts[postIndx].comments.indexOf(comment);
            var commentData = $scope.posts[postIndx].comments[indx];
            var newText = $scope.editCommentText[postIndx];
            $scope.isEditComment[postIndx] = true;
            
            //TODO:: image uploading on comment edit
            if(newText == undefined || newText == '') {
                $scope.isEditComment[postIndx]= false;
                $scope.commentEditErrCls[postIndx] = 'text-red';
                $scope.commentEditErrMsg[postIndx] = $scope.i18n.editprofile.no_empty_comment;
                $timeout(function(){
                    $scope.commentEditErrCls[postIndx] = '';
                    $scope.commentEditErrMsg[postIndx] = '';
                }, 15000);
                return false;
            } 
            
            opts.session_id = $scope.currentUser.id;
            opts.post_id = post.post_id;
            opts.comment_id = commentData.id;
            opts.comment_author = commentData.comment_user_info;
            opts.youtube_url = commentData.youtube_url;
            opts.body = newText;
            var myFile = '';
            //TODO:: image uploading on comment edit

            CommentService.updateComment(opts, myFile, function(data){
                if(data.code == 101) {
                    $scope.isEditComment[postIndx] = false;
                    $scope.commentInProcess[postIndx] = false;
                    $scope.commentEditErrMsg[postIndx] = '';
                    $scope.activeCommentEdit[postIndx] = '';
                    $scope.commentEditErrCls[postIndx] = '';
                    $scope.posts[postIndx].comments[indx].comment_text = $scope.editCommentText[postIndx];
                    $("#commentBoxId-"+postIndx).show();
                } else {
                    $scope.isEditComment[postIndx] = false;
                    $scope.commentInProcess[postIndx] = false;
                    $scope.commentEditErrMsg[postIndx]= $scope.i18n.editprofile.not_posted;
                    $scope.commentEditErrCls[postIndx] = 'text-red';
                }
            });
        };

        //funtion to close the edit form to cancel comment
        $scope.cancelEditComment = function(postIndx, indx) {
            $scope.commentInProcess = [];
            $scope.commentInProcess[postIndx] = false;
            $scope.activeCommentEdit[postIndx] = '';
            $scope.editCommentText[postIndx]='';
            $scope.commentEditErrMsg[postIndx] = '';
            $scope.commentEditErrCls[postIndx] = '';
            $scope.isEditComment[postIndx] = false;
            $("#commentBoxId-"+postIndx).show();
        };  

          //funciton to delete single comment
          $scope.delCommentErrMsg = [];
          $scope.delCommentErrCls = [];
          $scope.deleteComment = function(postIndx, comment) {
              var indx = $scope.posts[postIndx].comments.indexOf(comment);
              var commentData = {};
              commentData = $scope.posts[postIndx].comments[indx];
              $scope.deleteCommentIndx = commentData.id;
              
              var formData = {};
              formData.session_id = $scope.currentUser.id;
              formData.comment_id = commentData.id;

              //calling the comment service to delete the selected comment 
              CommentService.deleteComment(formData, function(data){
                  if(data.code == 101) {
                      $scope.delCommentErrMsg[commentData.id] = '';
                      $scope.delCommentErrCls[commentData.id] = '';
                      $scope.deleteCommentIndx = '';
                      $scope.posts[postIndx].comments.splice(indx,1);
                      $scope.posts[postIndx].comment_count--;
                  }else {
                      $scope.delCommentErrMsg[commentData.id] = $scope.i18n.dashboard.postcomment.delete_comment_fail;
                      $scope.delCommentErrCls[commentData.id] = 'text-red';
                      $scope.deleteCommentIndx = '';
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
                CommentService.deleteMediaComment(formData, function(data){
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
            //function to show all comment of the post
            $scope.showAllComments = function(postIndx) {
                $scope.commentInProcess = true;
                var post = $scope.posts[postIndx];
                var opts = {};
                opts.post_id = post.post_id;
                opts.session_id = $scope.currentUser.id;
                opts.limit_size = null;
                opts.limit_start = 0;
                $scope.getComments(opts, postIndx);
            };

            // function to get the post and comment of the post
            $scope.showComments = [];
            $scope.commentLoading = [];
            $scope.getComments = function(opts, postIndx) {
                $scope.posts[postIndx].comments = [];
                $scope.showComments[postIndx] = true;
                $scope.commentLoading[postIndx] = true;
                // This service's function returns post
                CommentService.listComment(opts, function(data){
                    if(data.code == 100)
                    {   
                        $scope.posts[postIndx].comments = data.data.comments;  
                        $scope.commentLoading[postIndx] = false;
                            if($scope.posts[postIndx].comments.length != 0 ) {
                                $scope.noComment = true;
                            }
                    } else {
                        $scope.commentLoading[postIndx] = false;
                    }
                });
            }; 
      },
      templateUrl: 'app/views/group_post_list.html'
  }
});

//Displaying the post form for store detail
app.directive('groupPostForm', function() {
  return {
      restrict: 'E',
      link: function (scope, iElement, iAttrs) {
        $($('#lp1').linkPreview()).appendTo(iElement[0]);
      },
      templateUrl: 'app/views/group_post_form.html'
  }
});