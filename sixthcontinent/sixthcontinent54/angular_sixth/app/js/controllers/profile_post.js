app.controller('ProfilePostController',['$scope', '$timeout', 'ProfileService', 'FileUploader', '$sce', function($scope, $timeout, ProfileService, FileUploader, $sce) {
//function to create post for dashboard
$scope.postErrMsg = '';
$scope.postContentStart = false;
$scope.showComments = [];
$scope.commentsShowLimit = [];
$scope.commentsLength = [];


    // function to get the post and comment of the post
    $scope.commentLoading = [];
    $scope.getComments = function(postIndx) {
        var post = $scope.userPostList[postIndx];
        $scope.userPostList[postIndx].comments = [];
        var opts = {};
        opts.post_id = post.id;
        opts.limit_start = 0;
        opts.limit_size = 20;

        // This service's function returns post
        ProfileService.getDashboardComments(opts, function(data){
            if(data.code == 100)
            {
                $scope.userPostList[postIndx].comments = data.data.comment;
                $scope.commentLoading[postIndx] = false;
                $scope.showComments[postIndx] = false;
                $scope.commentsShowLimit[postIndx] = 4;
                $scope.commentsLength[postIndx] = $scope.userPostList[postIndx].comments.length;
                if($scope.userPostList[postIndx].comments.length  != 0 ) {
                    $scope.noComment = true;
                }
            } else {
                $scope.commentLoading[postIndx] = false;
            }
        });
    };

    

    //function to delete the media file of post
    $scope.deletePostMedia = function(indx) {
        var postData = {};
        postData = $scope.userPostList[indx];
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.post_media_id = postData.media_info[0].id;

        //calling the service to delete the selected post 
        ProfileService.deletePostMedia(formData, function(data){
            if(data.code == 101) {
                $scope.userPostList[indx].media_info.splice(0, 1);
            }
            else {
                $scope.message = data.message;
                $scope.userPostList;
            }
        });
    };

$(".fancybox").fancybox();

}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});