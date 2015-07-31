app.controller('GroupPostController',['$scope', 'PostService', '$location', '$timeout', '$routeParams', 'CommentService', 'FileUploader','ProfileService','$modal', '$log' ,function ($scope, PostService, $location, $timeout, $routeParams, CommentService, FileUploader ,ProfileService,$modal ,$log) {
    $scope.currentUser = $scope.currentUser;
    $scope.noComment = false;
    $scope.postErrMsg = '';
    var groupId = $routeParams.clubId;
    var groupStatus = $routeParams.clubType;
    $scope.postContentStart = false;
    $scope.posts = [];
    $scope.myRes = 1;
    $scope.tempPostId = '';
    $scope.postErrCls = '';// add dynamic class for success and fail
    $scope.textLimit = APP.post_charecter_limit;
    
    //Create Group post 
    $scope.createPost = function() {
        var link_type;
        var opts = {};
        $scope.postInProcess = true;
        $scope.postContentStart = true;
        $scope.postContentLoader = true;
        var filescount = $scope.imageSrc.length;
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
        description = escapeHtmlEntities(description); // converting the special charector to entities
        //URLs starting with http://, https://, file:// or ftp://
        if(href == '') {
            link_type = "0";
        } else {
            description = "<p>"+description+"</p>";
            description += descval;
            link_type = "1";
        }

        if ((description == undefined || description == '') && filescount == 0) {
            $scope.postInProcess = false;
            $scope.postErrMsg = $scope.i18n.editprofile.attach_link;
            $scope.postErrCls = 'text-red';
            $timeout(function(){
                $scope.postErrCls = '';
                $scope.postErrMsg = '';
            }, 15000);
            $scope.postContentStart = false;
            $scope.postContentLoader =  false;
            return false;
        } 
        
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        opts.post_title = "Not in use on frontend"; //This dummy data as currently there is no field to accept the posttitle
        opts.post_desc = description;
        opts.youtube = '';
        opts.post_media = '';
        opts.post_id = $scope.tempPostId;
        opts.link_type = link_type;
        opts.post_type = "1";
        opts.media_id = [];
        angular.forEach($scope.imageSrc, function(file) {
            opts.media_id.push(file.media_id);
        });
        PostService.createPost(opts, function(data){
            if(data.code == 101) {
                var newpost = {};
                newpost = data.data[0];
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
                if($scope.posts.length == 0){
                    $scope.noContent = true;
                }
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $scope.postText = undefined;
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.isUpload = false;
                $scope.uploadBox = false;
                $scope.postContentStart = false;
                $scope.postContentLoader = false;
                $scope.tempPostId = '';
                $('#text_lp1').val('');
                $('#text_lp1').attr("style", "");
                $timeout(function(){
                    $('#closePreview_lp1').click();
                }, 100);
            } else {
                if($scope.posts.length == 0){
                    $scope.noContent = true;
                }
                $scope.postInProcess = false;
                $scope.postErrCls = 'text-red';
                $scope.postErrMsg = $scope.i18n.editprofile.post_unable;
                $scope.imageSrc = [];
                $scope.postFiles = [];
                $scope.isImage = false;
                $scope.imgUpload = false;
                $scope.isUpload = false;
                $scope.uploadBox = false;
                $timeout(function(){
                    $scope.postErrCls = '';
                    $scope.postErrMsg = '';
                }, 15000);
                $scope.postContentStart = false;
                $scope.postContentLoader = false;
            }
        });
    };
   

    // function to get the post and comment of the post
    $scope.getPosts = function() {
        $scope.isLoading = true;
        $scope.noContent = false;
        var limit_start = $scope.posts.length;
        var opts = {};
        opts.user_group_id = groupId;
        opts.user_id = APP.currentUser.id;
        opts.group_type = groupStatus;
        opts.limit_start = limit_start;
        opts.limit_size = APP.group_pagination.end;
        
        // This service's function returns post
        if ((($scope.totalSize > limit_start ) || $scope.totalSize == 0 ) && $scope.myRes == 1) {
            $scope.myRes = 0;
            $scope.isLoading = false;
            PostService.listPost(opts, function(data){
                if(data.code == 101)
                {
                    var items =  data.data;
                    if(items != undefined || items.length != 0){
                        $scope.posts = $scope.posts.concat(items);
                    }
                    $scope.myRes = 1;
                    $scope.totalSize = data.total;
                    if($scope.posts.length == 0){
                        $scope.noContent = true;
                    }
                } else {
                    $scope.noContent = true;
                    $scope.isLoading = false;
                    $scope.posts;
                }
            });
        } else {
            $timeout(function(){
                $scope.isLoading = false;
            }, 1000);
        }
    };

    //function to call initial loading
    $scope.showClubPostList = function(){
        $scope.isLoading = true;
        $scope.posts = [];
        $scope.totalSize = 0;
        $scope.myRes = 1;
        $scope.noContent = false; 
        $scope.getPosts();
    };

    // calling get post function on controller load
    $scope.showClubPostList();

    $scope.loadMore = function() {
        if($scope.totalSize > $scope.posts.length){
            $scope.getPosts();
        }
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

    //function to show limited comment of the post
    $scope.showLimitedComment = function(postIndx) {
        $scope.commentInProcess = true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.session_id = $scope.currentUser.id;
        opts.limit_size = APP.group_pagination.end;
        opts.limit_start = APP.group_pagination.start;
        $scope.getComments(opts, postIndx);
    };

    
    //funciton to delete single post
    $scope.deleteErrMsg = [];
    $scope.deleteErrCls = [];
    $scope.deletePost = function(indx) {
        $scope.deletePostIndx = indx;
        var postData = {};
        postData = $scope.posts[indx];
        var formData = {};
        formData.user_id = $scope.currentUser.id;
        formData.post_id = postData.post_id;
        
        //calling the service to delete the selected post 
        PostService.deletePost(formData, function(data){
            if(data.code == 101) {
                $scope.posts.splice(indx, 1);
                if($scope.posts.length == 0){
                    $scope.noContent = true;
                }
            } else {
                $scope.deleteErrCls[indx] = 'text-red';
                $scope.deleteErrMsg[indx]= $scope.i18n.dashboard.postcomment.delete_post_fail;
                $scope.posts;
            }
            $timeout(function(){
                $scope.deleteErrCls[indx] = '';
                $scope.deleteErrMsg[indx] = '';
            }, 15000);
        });
    };

    
    $scope.imageSrc = [];
    $scope.postFiles = [];
    $scope.postImgLoader = [];
    $scope.tempPostId = '';
    var uploader = $scope.uploader = new FileUploader({
        url: APP.service.createGroupPost+"?access_token="+APP.accessToken,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'method': 'POST'
            /*'Accept': 'text/json'*/
        },
        data:{
            'user_id': APP.currentUser.id,
            'group_id': groupId,
            'title':"Not in use on frontend", //This dummy data as currently there is no field to accept the posttitle
            'description':'',
            'youtube_url':'',
            'to_id': APP.currentUser.id,
            'link_type':"0",
            'post_type':"0",
            'post_id': $scope.tempPostId,
        },
        dataObjName:'reqObj',
        formDataName:'post_media[]'
    });

    // FILTERS
    uploader.filters.push({
        name: 'post_media[]',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

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
            $scope.imageSrc[index] = response.data;
            $scope.postImgLoader[index] = false;
            $scope.tempPostId = response.data.id;
            uploader.data.post_id=response.data.id;
        }
    };

    uploader.onCompleteAll = function() {
        $scope.postContentStart = false;
    }

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        $scope.postErrMsg = $scope.i18n.groupcontrol.incorrect_upload;
        $scope.postErrCls = 'text-red';
        $timeout(function(){
            $scope.postErrCls = '';
            $scope.postErrMsg = '';
        }, 15000);
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
        uploader.queue = [];
    };

    

    //function to create post
    $scope.saveUpdatePost = function(indx) {
        $scope.editPostErrorMsg = [];
        $scope.editPostErrorCls = [];
        var opts = {};
        $scope.updatePostInProcess = true;
        var editPostText = escapeHtmlEntities($scope.updateBody[indx]); 
        var post = $scope.posts[indx];
        
        if (editPostText === undefined || editPostText === '') {
            $scope.updatePostInProcess = false;
            $scope.editPostErrorMsg[indx] = $scope.i18n.groupcontrol.write_to_post;
            $scope.editPostErrorCls[indx] = 'text-red';
            return false;
        } 
        var regex = /src="([^"]+)"/;
        var src = editPostText.split(regex)[1];
        if(src != undefined && src !='' ){
               editPostText = src; 
            }
        opts.user_id = $scope.currentUser.id;
        opts.user_group_id = groupId;
        opts.group_type = $scope.groupDetail.group_status;
        opts.post_id = post.post_id;
        opts.post_title = post.post_title; //This dummy data as currently there is no field to accept the posttitle
        opts.post_desc = editPostText;
        opts.youtube = '';
        var myFile = '';
        
        PostService.updatePost(opts, myFile, function(data){
            if(data.code == 101) {
                $scope.updatePostInProcess = false;
                $scope.editPostErrorMsg[indx] = '';
                $scope.editPostErrorCls[indx] = '';
                $scope.posts[indx].post_description = editPostText;
                $scope.editPostText = '';
                $scope.activeEdit[indx] = false;
            } else {
                $scope.updatePostInProcess = false;
                $scope.activeEdit[indx] = false;
                $scope.editPostErrorCls[indx] = 'text-red';
                $scope.editPostErrorMsg[indx] = $scope.i18n.groupcontrol.not_send_post;
            }
            $timeout(function(){
                $scope.editPostErrorCls[indx] = '';
                $scope.editPostErrorMsg[indx] = '';
            }, 15000);
        });
    };

    $scope.updateBody = [];
    $scope.activeEdit = [];
    $scope.editPostErrorCls = [];
    $scope.editPostErrorMsg = [];
    //funtion to open form to update post
    $scope.updatePost = function(indx) {
        var post = $scope.posts[indx];
        //for resize the textarea
        autosize(document.querySelectorAll('.editpostbox'));
        var str = $.trim(post.post_description.replace(/\n\n\n+/g, '\n\n'));
        var htmlstr = str.replace(/\n/g,'<br />');
        var height = $('<div style="display:block;" id="postedit-hidden-div"></div>')
        .html(htmlstr)
        .appendTo('#post_'+post.post_id)
        .height();     
        $('#editpost_'+post.post_id).css('height',height + 'px');
        str = $('#postedit-hidden-div').html(str).text();
        $('#postedit-hidden-div').remove();
        $scope.updateBody[indx] = str;
        $scope.activeEdit[indx] = true;
        //set cursor start of textarea
        $timeout(function(){
            $('#editpost_'+post.post_id).putCursorAtStart();
        },200);
    }
    // close the edit form on cancel
    $scope.cancelPost = function(indx) {
        $('#postedit-hidden-div').remove();
        $scope.updateBody[indx] = '';
        $scope.activeEdit[indx] = false;
        $scope.editPostErrorCls[indx] = '';
        $scope.editPostErrorMsg[indx] = '';
    };

    
    //remove iamge from preview array
    //remove iamge from preview array
    $scope.removeImage = function(index) {
        var tempImg = $scope.imageSrc[index];
        $scope.imageSrc.splice(index, 1);
        var item = $scope.uploader.queue[index];
        item.remove();
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.media_id = tempImg.media_id;
        formData.post_id = $scope.tempPostId;
        formData.session_id = APP.currentUser.id;
        
        //calling the service to delete the selected post 
        PostService.deletePostMedia(formData, function(data){
            if(data.code == 101) {
                
            } else {
                $scope.imageSrc[index] = tempImg;
                $scope.postErrCls = 'text-red';
                $scope.postErrMsg = $scope.i18n.dashboard.postcomment.remove_img_fail;
                $timeout(function(){
                    $scope.postErrCls = '';
                    $scope.postErrMsg = '';
                }, 15000);
            }
        });
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

    $(".fancybox").fancybox();

}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
