app.controller('ProfileImageController',['$scope', '$rootScope', 'ProfileImageService', '$location', '$routeParams', '$timeout', 'fileReader', 'FileUploader', function ($scope, $rootScope, ProfileImageService, $location, $routeParams, $timeout, fileReader, FileUploader) {
    $scope.albloader = false;
    $scope.propic = false;
    $scope.picloader = false;
    $scope.successMsg = "";
    //Upload media 
    $scope.uploaduserprofileimages = function(){
        $scope.successMsg = "";
        $scope.fileNotValidMsg = "";
        $scope.fileNotValid = false;
        if($scope.myFile == undefined || $scope.myFile == ''){
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = $scope.i18n.editprofile.select_image;
            $timeout(function(){
                    $scope.fileNotValidMsg = "";
                    $scope.fileNotValid = false;
            }, 15000);
            return false;
        }
        $scope.albloader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.user_media = $scope.myFile;
        //Allow some images types for uploading
        var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
        // Checking Extension
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
            $scope.albloader = false;
            $scope.fileNotValid = true;
            //$scope.imageSrc = 'notValid';
            $scope.fileNotValidMsg = $scope.i18n.editprofile.invalid_media;
            return false;
        } else {
            $scope.fileNotValidMsg = "";
            $scope.fileNotValid = false;
            ProfileImageService.uploaduserprofileimages(opts, $scope.myFile, function(data){    
               if(data.code == 101) {
                    $scope.albloader = false;
                    $('#addPhoto').show();
                    $("input[type='file']").val('');
                    $scope.postFiles = '';
                    $scope.imageSrc = '';
                    $scope.myFile = '';
                    
                    $scope.successMsg = data.message;
                    $timeout(function() {
                        $scope.successMsg = '';
                    }, 15000);
                    $scope.viewmultiprofiles();
                    
               } else {
                    $scope.albloader = false;
                    $('#addPhoto').show();
               }
            });
        }
    }

    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.fileNotValid = false;
    $scope.fileNotValidMsg = '';
    $scope.getFile = function () {
        if($scope.file == undefined){
            $scope.$apply(function() {
                $scope.removeImage();
            });   
        }else{
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
            .then(function(result) {
                $scope.myFile = $scope.file;
                $scope.imageSrc = result;
                var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
                //Checking Extension
                if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
                    $scope.fileNotValid = true;
                    $scope.fileNotValidMsg = $scope.i18n.groupcontrol.upload_media;
                    $scope.postFiles = '';
                    $scope.imageSrc = '';
                    $scope.myFile = '';
                } else {
                     $scope.fileNotValid = false;
                }
            });
        }
    };
    
    $scope.removeImage = function() {
        $scope.postFiles = '';
        $scope.imageSrc = '';
        $scope.myFile = '';
        $("input[type='file']").val('');
    };
    

    $scope.viewmultiprofiles = function(){

        $scope.albloader = true; 
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.profile_type = 4; 
        ProfileImageService.viewmultiprofiles(opts, function(data){
            if(data.code == 101) {
                $scope.albloader = false; 
                $scope.picloader = false;
                $scope.propic = true; 
                $rootScope.currentUser.basicProfile = data.data;
            } else {                
                $scope.propic = true; 
                $scope.picloader = false;
                
            }
        });
    }
}]);

app.controller('ProfileImageUploadController',['$scope', '$rootScope', 'ProfileImageService', '$location', '$routeParams', '$timeout', 'fileReader', 'FileUploader', function ($scope, $rootScope, ProfileImageService, $location, $routeParams, $timeout, fileReader, FileUploader) {
    $scope.albloader = false;
    $scope.propic = false;
    $scope.picloader = false;
    $scope.successMsg = "";

    
    $scope.imagePrvSrc = '';
    $scope.imgProgress = '';
    $scope.postImgLoader = '';
    $scope.progress = '';
    var uploader =  $scope.uploader = new FileUploader({
        url: APP.service.uploaduserprofileimages+"?access_token="+APP.accessToken,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'method': 'POST'
            /*'Accept': 'text/json'*/
        },
        data:{
            'user_id': APP.currentUser.id,
        },
        dataObjName:'reqObj',
        formDataName:'user_media'
    });

    uploader.onAfterAddingFile = function(fileItem) {
        uploader.uploadItem(fileItem);
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        var index = uploader.getIndexOfItem(fileItem);
        if(response.code == 101){
            $scope.imagePrvSrc = response.data;
        }
    };

    uploader.onCompleteAll = function() {
        $scope.postContentStart = false;
    }

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        $timeout(function(){
            $scope.fileNotValidMsg = $scope.i18n.editprofile.no_media_valid;
        }, 4000);
    };

    // FILTERS
    // uploader.filters.push({
    //     name: 'user_media',
    //     fn: function(item /*{File|FileLikeObject}*/, options) {
    //         var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //         return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //     }
    // });

    // $scope.myFile = '';
    // $scope.imageSrc = '';
    // $scope.fileNotValid = false;
    // $scope.fileNotValidMsg = '';
    // $scope.getFile = function () {
    //     $scope.progress = 0;
    //     fileReader.readAsDataUrl($scope.file, $scope)
    //     .then(function(result) {
    //         $scope.myFile = $scope.file;
    //         $scope.imageSrc = result;
    //         var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
    //         //Checking Extension
    //         if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
    //             $scope.fileNotValid = true;
    //             $scope.fileNotValidMsg = $scope.i18n.editprofile.upload_invalid_media;
    //         } else {
    //              $scope.fileNotValid = false;
    //         }
    //     });
    // };

    $scope.removeImage = function() {
        $scope.postFiles = '';
        $scope.imageSrc = '';
        $("input[type='file']").val('');
    };
}]);
