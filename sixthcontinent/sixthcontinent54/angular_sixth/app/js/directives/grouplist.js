//Displaying the comment post form for store detail
app.directive('groupCommentForm',['CommentService', function(CommentService) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/group_comment_form.html',
    scope: {
      loadComment: "&loadComment"
    },
    link : function(scope, elem, attrs){
       
        scope.addComment = function(){
        scope.postIndx = attrs.postIndx;
        scope.commentInProcess = true;
        scope.commentErrMsg = "";

        if (scope.commentText === undefined && scope.myFile === undefined) {
            scope.commentInProcess = false;
            scope.commentErrMsg = scope.i18n.groupcontrol.write_post;
            return false;
        } else if (scope.myFile !== undefined && scope.commentText === undefined) {
            scope.commentInProcess = false;
            scope.commentErrMsg = scope.i18n.groupcontrol.write_to_post;
            return false;
        } 

        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.post_id = attrs.postId;
        opts.body = scope.commentText;
        opts.youtube_url='';

        if (scope.myFile !== undefined) {
          //Allow some images types for uploading
          var imageType = scope.myFile['name'].substring(scope.myFile['name'].lastIndexOf(".") + 1);
          // Checking Extension
          if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
              scope.postErrorMsg = scope.i18n.groupcontrol.upload_media;
              scope.commentErrMsg = false;
              return false;
          }
        opts.commentfile = scope.myFile;
        }

        CommentService.createComment(opts, scope.myFile, function(data){
          if(data.code == 101) {
            scope.commentInProcess = false;
            scope.commentErrorMsg = '';
            scope.commentText = '';
            scope.loadComment(attrs.postId);
            scope.myFile = '';
          } else {
            scope.commentInProcess = false;
            scope.commentErrorMsg = scope.i18n.groupcontrol.not_posted;
            scope.myFile = '';
          }
        });
      };
    }
  };
}]);