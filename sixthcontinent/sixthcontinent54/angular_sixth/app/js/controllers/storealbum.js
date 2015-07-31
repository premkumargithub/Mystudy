app.controller('StoreAlbumController', ['$scope', 'StoreAlbumService', 'AlbumService', '$location', '$routeParams', 'StoreService', '$timeout', 'FileUploader', 'focus', function ($scope, StoreAlbumService, AlbumService, $location, $routeParams,StoreService, $timeout, FileUploader, focus) {    
    $scope.myValue = false;
    $scope.albloader = false;
    $scope.noAlbums = false;
    $scope.noPhotos = false;
    $scope.albumResponse = "";
    $scope.storeId = $routeParams.id;
    $scope.albumId = $routeParams.album_id;
    $scope.listload = false;
    $scope.listAlbum = [];
    $scope.totalSize = 0;
    $scope.allRes = 1
    $scope.viewalbum = [];
    $scope.totalSizeImg = 0;
    $scope.allResImg = 1;
    $scope.noResult = false;
    $scope.shopAlbumSubmitted = false;

    $scope.storeOwnerId = StoreService.getStoreOwnerId();
    $scope.uploadloader = false;
    //Create Store Album 
    $scope.createstorealbums = function(){
        $scope.shopAlbumSubmitted = true;
        if($scope.user.albumname === undefined || $scope.user.albumname === '') {
            $scope.storeAlbumForm.albumname.$dirty = true;
            $scope.storeAlbumForm.albumname.$invalid = true;
            $scope.storeAlbumForm.albumname.$error.required = true;
            focus('albumname');
            return false;
        } else if ($scope.user.albumdesc === undefined || $scope.user.albumdesc === '') {
            $scope.storeAlbumForm.albumdesc.$dirty = true;
            $scope.storeAlbumForm.albumdesc.$invalid = true;
            $scope.storeAlbumForm.albumdesc.$error.required = true;
            focus('albumdesc');
            return false; 
        } else {
            $scope.albumErrorResponse = '';
            $scope.albumErrResponse = false;
            $scope.createAlbumLoader = true;
            var opts = {};
            opts.session_id = APP.currentUser.id;
            opts.store_id = $scope.storeId; 
            opts.album_name = $scope.user.albumname; 
            opts.album_desc = $scope.user.albumdesc; 

            StoreAlbumService.createstorealbums(opts, function(data){
                $scope.createAlbumLoader = false;
                if(data.code == 101) {
                    $scope.shopAlbumSubmitted = false;
                    $scope.albumResponse = $scope.i18n.albums.album_created;;
                    $timeout(function() {
                            $scope.albumResponse = '';
                    }, 15000);
                    $scope.albloader = true;
                    $scope.listAlbum.length = 0;
                    $scope.storealbumlists('listing');
                    $scope.user = null;
                    $scope.myValue = false; 
                } else {
                    $scope.albumResponse = $scope.i18n.storealbum.album_wrong;
                    $timeout(function() {
                            $scope.albumErrorResponse = '';
                    }, 15000);
                }
            });
        }
    }

    $scope.editAlbumForm = false;
    $scope.updateUserAlbum = false;
    $scope.editAlbumData = {}
    $scope.editAlbum = function(albumName, albumDescription, albId) {
        $scope.editAlbumData.album_name = albumName;
        $scope.editAlbumData.album_description = albumDescription;
        $scope.editAlbumData.id = albId;
        $scope.editAlbumForm = !$scope.editAlbumForm;
    }

    $scope.closeEditForm = function() {
        $scope.editAlbumForm = !$scope.editAlbumForm;
        $scope.editAlbumData = {};
    }

    $scope.updateAlbum = function() {
        if($scope.editAlbumData.album_name === undefined || $scope.editAlbumData.album_name === '') {
            $scope.shopEditAlbumForm.editalbumname.$dirty = true;
            $scope.shopEditAlbumForm.editalbumname.$invalid = true;
            $scope.shopEditAlbumForm.editalbumname.$error.required = true;
            focus('editalbumname');
            return false;
        } else if ($scope.editAlbumData.album_description === undefined || $scope.editAlbumData.album_description === '') {
            $scope.shopEditAlbumForm.editalbumdesc.$dirty = true;
            $scope.shopEditAlbumForm.editalbumdesc.$invalid = true;
            $scope.shopEditAlbumForm.editalbumdesc.$error.required = true;
            focus('editalbumdesc');
            return false;
        } else {
            $scope.updateUserAlbum = true;
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.album_id = $scope.editAlbumData.id;
            opts.album_name = $scope.editAlbumData.album_name; 
            opts.album_desc = $scope.editAlbumData.album_description;
            opts.type = 'shop';
            AlbumService.updateAlbum(opts, function(data){
                $scope.updateUserAlbum = false;
                if(data.code == 101) {
                    $scope.editAlbumForm = !$scope.editAlbumForm;
                    $scope.listAlbum.length = 0;
                    $scope.storealbumlists('listing');
                    $scope.user = null;   
                    $scope.albumResponse = $scope.i18n.albums.album_updated;
                    $timeout(function() {
                            $scope.albumResponse = '';
                    }, 5000);   
                                                
                } else {
                    $scope.editAlbumForm = !$scope.editAlbumForm;
                    $scope.albumErrorResponse = $scope.i18n.albums.gone_wrong;
                    $timeout(function() {
                            $scope.albumErrorResponse = '';
                    }, 5000);
                }
            });
        } 
    }

    //Upload Store media 
    $scope.uploadstoremediaalbums = function(){
        if($scope.imagePrvSrc == undefined || $scope.imagePrvSrc.length == 0){
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = $scope.i18n.storealbum.image_first;
            $timeout(function(){
                    $scope.fileNotValidMsg = "";
                    $scope.fileNotValid = false;
            }, 15000);
            return false;
        }
        $scope.uploadloader = true;
        $('#addbutton').hide();
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.storeId;
        opts.album_id = albumId;
        opts.post_type = 1;
        var filescount = $scope.imagePrvSrc.length;
        opts.media_id = [];
          angular.forEach($scope.imagePrvSrc, function(file) {
              opts.media_id.push(file.media_id);
        });
        $scope.fileNotValidMsg = "";
        $scope.fileNotValid = false;
        StoreAlbumService.uploadstoremediaalbumsfinal(opts, function(data){ 
           if(data.code == 101) {
                $scope.uploadloader = false;
                $('#addbutton').show();
                $scope.postFiles = [];
                $scope.imagePrvSrc = [];
                $timeout(function() {
                    $scope.albumResponse = '';
                }, 15000);
                $scope.viewalbum.length = 0;
                $scope.totalSizeImg = 0;
                $scope.allResImg = 1;   
                $scope.viewstorealbums('upload');
                $("input[type='file']").val('');
                $scope.imgUpload = false;
                uploader.queue = [];
           } else {
                $scope.uploadloader = false;
                $('#addbutton').show();
                $scope.fileNotValidMsg = data.message;
                $timeout(function() {
                    $scope.fileNotValidMsg = '';
                }, 15000);
           }
        });
    }

    $scope.fileNotValid = false;
    $scope.fileNotValidMsg = '';
    $scope.tempAlbumId = '';
    $scope.albumImgLoader = [];
    $scope.imagePrvSrc = [];
    
    // one by one file uploading section start-->
    var uploader =  $scope.uploader = new FileUploader({
          url: APP.service.uploadstoremediaalbums+"?access_token="+APP.accessToken,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'method': 'POST'
              /*'Accept': 'text/json'*/
          },
          data:{
              'user_id': APP.currentUser.id,
              'album_id':$scope.albumId, 
              'store_id':$scope.storeId, 
              'post_type':"0"
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
            var queueLen = uploader.queue.length;
            if(uploader.queue.length != 0){
                $scope.uploadBox = false;
                $scope.imgUpload = true;
            }
            $scope.albumImgLoader[queueLen] = true;
            uploader.uploadItem(fileItem);
        };

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            var index = uploader.getIndexOfItem(fileItem);
            if(response.code == 101){
                $scope.imagePrvSrc[index] = response.data;
                $scope.albumImgLoader[index] = false;
            }
        };

        uploader.onCompleteAll = function() {
            $scope.postContentStart = false;
        }

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = $scope.i18n.albums.upload_media_invalid;
            $timeout(function(){
                $scope.fileNotValidMsg = '';
            }, 4000);
        };
        
    // one by one file uploading section end-->
    //remove iamge from preview array
    $scope.removeImage = function(index) {
        var tempImg = $scope.imagePrvSrc[index];
        $scope.imagePrvSrc.splice(index, 1);
        var item = $scope.uploader.queue[index];
        item.remove();
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.store_id = $scope.storeId; //todo
        opts.album_id = albumId;
        opts.media_id = tempImg.media_id;
        //calling the service to delete the selected post 
        StoreAlbumService.deletealbummedias(opts, function(data){
            if(data.code == 101) {

            } else {
                $scope.imagePrvSrc[index] = tempImg;
                $timeout(function(){
                    $scope.albumErrMsg = data.message;
                }, 4000);
            }
        });
    };

    //Album Store Listing
    $scope.storealbumlists = function(type){
        $scope.noResult = false;
        var limit_start = $scope.listAlbum.length;
        if(type == 'delete') {
            $scope.albloader = false;
        } else if(type === 'listing') {
            $scope.albloader = false;
        } else {
            $scope.albloader = true;
        }  
            
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.session_id = APP.currentUser.id;
        opts.limit_start = limit_start; 
        opts.user_id = APP.currentUser.id;
        opts.limit_size = 12;
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) { 
        $scope.listload = true;
        $scope.allRes = 0;
        StoreAlbumService.storealbumlists(opts, function(data){
            $scope.noResult = true;
            if(data.code == 101) {
                $scope.totalSize = data.data.size;
                $scope.allRes = 1;
                $scope.listAlbum = $scope.listAlbum.concat(data.data.album);   
                $scope.listload = false;
                //$scope.noAlbums = true;    
                $scope.albloader = false;  
                if(type == 'create') {
                    $scope.albumResponse = $scope.i18n.storealbum.album_response;
                } else if(type == 'delete') {
                    $scope.albumResponse = $scope.i18n.storealbum.album_del_response;
                } else {
                   //$scope.albumResponse = "";
                } 
                $timeout(function(){
                    $scope.albumResponse = "";
                },15000);
                $('.album-option').removeClass('album-blank');
                if($scope.totalSize == 0) {

                } else {
                    if(document.getElementById("albumname")){
                        $scope.user = {};     
                    }   
                } 
            }else {
                $scope.albloader = false; 
                $scope.listload = false;
            }
        });
    }
    }

    $scope.loadMore = function() {     
        $scope.storealbumlists('listing');
    };
    //Album Store Listing
    $scope.storepagealbumlists = function(){  

        $scope.albloader = true;
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.session_id = APP.currentUser.id;
        opts.limit_start = 0; 
        opts.limit_size = 20; 
        StoreAlbumService.storealbumlists(opts, function(data){

            if(data.code == 101) {
                $scope.listPageAlbum = data.data.album;
                $scope.noAlbums = true;    
                $scope.albloader = false;    
            }else {
                $scope.albloader = false; 
            }
        });
    }
    //Delete Store Album 
    $scope.deletestorealbums = function(id){  
        //$scope.albloader = true;
        $scope.albumResponse = '';
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.store_id = $scope.storeId; //todo
        opts.album_id = id;
        StoreAlbumService.deletestorealbums(opts, function(data){
               
            if(data.code == 101) {
                $scope.listAlbum.length = 0;
                $scope.totalSize = 0;
                $scope.allRes = 1;
                $scope.storealbumlists('delete');
                //$scope.albumResponse = data.message;
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 15000);
            } else {
             
            }
        });
    }
    //View Store Album 
    $scope.albumDescription = "";
    $scope.viewstorealbums = function(type){
        var limit_start = $scope.viewalbum.length;
        if(type == 'delete') {
            $scope.albloader = false;  
        } else if(type === 'listing') {
            $scope.albloader = false;
        } else if(type === 'upload') {
            $scope.albloader = false;
        } else {
            $scope.albloader = true; 
        }
        
        var albumId = $routeParams.album_id;
        $scope.albumname = $routeParams.album_name;
        var opts = {};
        opts.store_id = $scope.storeId; //todo
        opts.album_id = albumId;
        opts.user_id = APP.currentUser.id;
        opts.limit_start = limit_start; 
        opts.limit_size = 12; 
        if ((( $scope.totalSizeImg > limit_start) || $scope.totalSizeImg == 0 ) && $scope.allResImg == 1) {
        $scope.listload = true;
        $scope.allResImg = 0;
        StoreAlbumService.viewstorealbums(opts, function(data){

            if(data.code == 101) {
                $scope.albloader = false;
                $scope.totalSizeImg = data.data.size;
                $scope.allResImg = 1;
                $scope.viewalbum = $scope.viewalbum.concat(data.data.media);
                $scope.albumDescription = data.data.album.description;
                $scope.albumDetails = data.data.album;
                $scope.listload = false; 
                $scope.noPhotos = true; 
                if(type == 'upload') {
                    $scope.albumResponse = $scope.i18n.storealbum.album_upload;
                } else if(type == 'delete') {
                    $scope.albumResponse = $scope.i18n.storealbum.album_del_success;
                } else {
                   $scope.albumResponse = "";
                }
                 $('.album-option').removeClass('album-blank');
            } else {
                $scope.albloader = false;
                $scope.noPhotos = true;
                $scope.listload = false; 
            }
        }); 
        } 
    }

    $scope.loadMoreImage = function() {  
    if($scope.totalSizeImg != 0) {   
        $scope.viewstorealbums('listing');
    }
    };
    //Delete Store Images from Album
    $scope.deletealbummedias = function(m_id, index){
        //$scope.albloader = true;
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.store_id = $scope.storeId; //todo
        opts.album_id = albumId;
        opts.media_id = m_id;
        StoreAlbumService.deletealbummedias(opts, function(data){

            if(data.code == 101) {
                //$scope.albumResponse = data.message;
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 2000); 
                //$scope.viewstorealbums('delete');     
                $scope.viewalbum.splice(index, 1);   
            } else {
             
            }
        });  
    }
    //show form
    $scope.showAlbumForm = function() {
        $scope.myValue = true;
    }
    //Hide form
    $scope.closeForm = function() {
        $scope.myValue = false;
    }
    //$scope.storepagealbumlists();
    $scope.storealbumlists(); //initialization of album listing function
    $scope.storepagealbumlists(); //initialization of album listing function
    $scope.viewstorealbums('listing');
    $(".fancybox").fancybox();
    //image upload Page 
    $scope.redirectUrl = function(album_id, album_name) {
        if(album_name == '') {
           album_name = 'Untitled';
           $location.path("/album/shop/image/"+album_id+"/"+album_name+"/"+$scope.storeId);
        }
        else {
           $location.path("/album/shop/image/"+album_id+"/"+album_name+"/"+$scope.storeId); 
        }
    }

    /**
    * Function to set image as store profile image 
    */  
    $scope.setStoreProfileimage = function(id, imageId) { 
        $("#setStoreImageSubmit-"+id).hide();
        $("#setStoreImageloader-"+id).show();
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.storeId;
        opts.media_id = imageId;
        StoreService.setStoreProfileImage(opts, function(data) {
            if(data.code == 101) {
                $("#setStoreImageSubmit-"+id).show();
                $("#setStoreImageloader-"+id).hide();
                $scope.albumResponse = $scope.i18n.storealbum.album_updated;
                var imageData = data.data;
                $scope.$broadcast('updateShopProfileCover', imageData);
            } else {
                $("#setStoreImageSubmit-"+id).show();
                $("#setStoreImageloader-"+id).hide();
            }
        });
    };
    
}]);
