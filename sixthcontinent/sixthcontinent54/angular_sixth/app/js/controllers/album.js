app.controller('AlbumController', ['$scope', '$rootScope', '$modal', '$log', 'AlbumService', '$location', '$routeParams', '$timeout', 'ProfileImageService', 'fileReader', 'FileUploader', 'ProfileService','TranslationService', 'focus', function ($scope, $rootScope, $modal, $log, AlbumService, $location, $routeParams, $timeout, ProfileImageService, fileReader, FileUploader, ProfileService, TranslationService, focus) {

    $scope.myValue = false;
    $scope.albloader = false;
    $scope.noAlbums = false;
    $scope.noPhotos = false;
    $scope.uploadloader = false;
    $scope.albumResponse = "";
    $scope.listload = false;
    $scope.listAlbum = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
    $scope.viewalbum = [];
    $scope.imagecount = 0;
    $scope.totalSizeImg = 0;
    $scope.allResImg = 1;
    $scope.albumId = $routeParams.album_id;
    $scope.albumErrResponse = false;
    $scope.storedFriend =[];
    $scope.tagged_Friends = [];
    $scope.tag = false;
    $scope.tagged_photo = [];
    $scope.Name = APP.currentUser.firstname + " " + APP.currentUser.lastname;
    $scope.albmPrivacySet = 3;
    $scope.userAlbumSubmitted = false;
    $scope.createAlbumLoader = false;
    //Create Album 
    $scope.createAlbum = function(){
        $scope.userAlbumSubmitted = true;
        if($scope.user.albumname === undefined || $scope.user.albumname === '') {
            $scope.userAlbumForm.albumname.$dirty = true;
            $scope.userAlbumForm.albumname.$invalid = true;
            $scope.userAlbumForm.albumname.$error.required = true;
            focus('albumname');
            return false;
        } else if ($scope.user.albumdesc === undefined || $scope.user.albumdesc === '') {
            $scope.userAlbumForm.albumdesc.$dirty = true;
            $scope.userAlbumForm.albumdesc.$invalid = true;
            $scope.userAlbumForm.albumdesc.$error.required = true;
            focus('albumdesc');
            return false;
        } else if ($scope.albmPrivacySet === undefined || $scope.albmPrivacySet === '') {
            $scope.userAlbumForm.albumprivacy.$dirty = true;
            $scope.userAlbumForm.albumprivacy.$invalid = true;
            $scope.userAlbumForm.albumprivacy.$error.required = true;
            focus('albumprivacy');
            return false;
        } else {
            $scope.createAlbumLoader = true;
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.album_name = $scope.user.albumname; 
            opts.album_desc = $scope.user.albumdesc;
            opts.privacy_setting = $scope.albmPrivacySet;

            AlbumService.createAlbum(opts, function(data){   
                $scope.createAlbumLoader = false; 
                $scope.userAlbumSubmitted = false;         
                if(data.code == 101) {
                    $scope.listAlbum.length = 0;
                    $scope.albloader = true; 
                    $scope.albumListing('listing');
                    $scope.user = null; 
                    $scope.myValue = !$scope.myValue;  
                    $scope.albumResponse = $scope.i18n.albums.album_created;
                    $timeout(function() {
                        $scope.albumResponse = '';
                    }, 5000);                                  
                } else {
                    $scope.albumErrorResponse = $scope.i18n.albums.gone_wrong;
                    $timeout(function() {
                        $scope.albumErrorResponse = '';
                    }, 5000);
                }
            });
        }  
    }

    $scope.editAlbumForm = false;
    $scope.updateUserAlbum = false;
    $scope.editAlbum = function(temp) {
        $scope.editAlbumData = {};
        $scope.editAlbumData.id = temp.id;
        $scope.editAlbumData.album_name = temp.album_name;
        $scope.editAlbumData.album_description = temp.album_description;
        $scope.editAlbumData.album_privacy = temp.album_privacy;
        $scope.editAlbumForm = !$scope.editAlbumForm;
    }

    $scope.closeEditForm = function() {
        $scope.editAlbumForm = !$scope.editAlbumForm;
        $scope.editAlbumData = {};
    }

    $scope.updateAlbum = function() {
        $scope.userAlbumSubmitted = true;
        if($scope.editAlbumData.album_name === undefined || $scope.editAlbumData.album_name === '') {
            $scope.albumEditForm.editalbumname.$dirty = true;
            $scope.albumEditForm.editalbumname.$invalid = true;
            $scope.albumEditForm.editalbumname.$error.required = true;
            focus('editalbumname'); 
        } else if ($scope.editAlbumData.album_description === undefined || $scope.editAlbumData.album_description === '') {
            $scope.albumEditForm.editalbumdesc.$dirty = true;
            $scope.albumEditForm.editalbumdesc.$invalid = true;
            $scope.albumEditForm.editalbumdesc.$error.required = true;
            focus('editalbumdesc');
        } else {
            $scope.updateUserAlbum = true;
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.album_id = $scope.editAlbumData.id;
            opts.album_name = $scope.editAlbumData.album_name; 
            opts.album_desc = $scope.editAlbumData.album_description;
            opts.privacy_setting = $scope.editAlbumData.album_privacy;
            opts.type = 'user';
            AlbumService.updateAlbum(opts, function(data){
                $scope.updateUserAlbum = false;
                $scope.userAlbumSubmitted = false;
                if(data.code == 101) {
                    $scope.editAlbumForm = !$scope.editAlbumForm;
                    $scope.listAlbum.length = 0;
                    $scope.albumListing('listing');
                    $scope.user = null;   
                    $scope.albumResponse = $scope.i18n.albums.album_updated;
                    $timeout(function() {
                            $scope.albumResponse = '';
                    }, 15000);   
                                                
                } else {
                    $scope.editAlbumForm = !$scope.editAlbumForm;
                    $scope.albumErrorResponse = $scope.i18n.albums.gone_wrong;
                    $timeout(function() {
                            $scope.albumErrorResponse = '';
                    }, 15000);
                }
            });
        } 
    }

    //Upload media 
    $scope.uploadmediaAlbum = function(){
        if($scope.imageToUpload == undefined || $scope.imageToUpload.length == 0){
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = $scope.i18n.albums.select_image_first;
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
        opts.album_id = $scope.albumId;
        opts.post_type = 1;
        var filescount = $scope.imageToUpload.length;
        opts.media_id = [];
        angular.forEach($scope.imageToUpload, function(file) {
              opts.media_id.push(file.media_id);
        });
        angular.forEach($scope.imageToUpload, function(index,file) {
              // opts.media_id.push(file.media_id);
              //$scope.imagePrvSrc[index].desc = $('#text'+file.media_id).val()
        });
        $scope.fileNotValidMsg = "";
        $scope.fileNotValid = false;
        AlbumService.finalMediaAlbum(opts, function(data){ 
           if(data.code == 101) {
                $scope.uploadloader = false;
                $('#addbutton').show();
                $scope.viewalbum.length = 0;
                $scope.totalSizeImg = 0;
                $scope.allResImg = 1;
                $scope.viewAlbum('upload');
                $timeout(function() {
                    $scope.albumResponse = '';
                }, 15000);
                $("input[type='file']").val('');
                $scope.postFiles = [];
                $scope.imageToUpload = [];
                $scope.imgUpload = false;
                uploader.queue = [];
           } else {
                $scope.uploadloader = false;
                $('#addbutton').show();
                $scope.albumResponse = data.message;
                $timeout(function() {
                    $scope.albumResponse = '';
                }, 15000);
           }
        });
    }

    $scope.fileNotValid = false;
    $scope.fileNotValidMsg = '';
    $scope.tempAlbumId = '';
    $scope.albumImgLoader = [];
    $scope.imagePrvSrc = $scope.viewalbum;
    $scope.imageToUpload = [];
    
    // one by one file uploading section start
    var uploader =  $scope.uploader = new FileUploader({
          url: APP.service.uploadmediaAlbum+"?access_token="+APP.accessToken,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'method': 'POST'
              /*'Accept': 'text/json'*/
          },
          data:{
              'user_id': APP.currentUser.id,
              'album_id':$scope.albumId, 
              'post_type':"0"
          },
          dataObjName:'reqObj',
          formDataName:'user_media[]'
        });
        // FILTERS
        uploader.filters.push({
            name: 'user_media[]',
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
                $scope.imageToUpload.push(response.data);
                // $scope.imagePrvSrc[index] = response.data;
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
    

    //remove iamge from preview arra
    $scope.removeImage = function(index,type) {
        var tempImg = type==2 ? $scope.imagePrvSrc[index] : $scope.imageToUpload[index];
        type==2 ? $scope.imagePrvSrc.splice(index, 1) : $scope.imageToUpload.splice(index, 1);
        if($scope.uploader.queue[index]){
            var item = $scope.uploader.queue[index];
            item.remove();
        }
        //calling the service to delete the selected post 
        if(tempImg){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.album_id = $scope.albumId;
            opts.media_id = tempImg.media_id ? tempImg.media_id : tempImg.id;
            AlbumService.deleteMediaAlbum(opts, function(data){
                if(data.code == 101) {
                    if(!tempImg.media_id) $scope.viewalbum.splice(index, 1);
                } else {
                    type==2 ? $scope.imagePrvSrc[index] = tempImg :  $scope.imageToUpload[index] = tempImg;
                    $timeout(function(){
                        $scope.albumErrMsg = data.message;
                    }, 4000);
                }
            });
        }
    };
    
    // $scope.imageModal = function(index, photos){
    //     $scope.index = index;
    //     $scope.photos = photos;
    //     $scope.pre_visible = true;
    //     $scope.loader = false;
    //     $scope.next_visible = true;
    //     if(index === 0) $scope.pre_visible = false;
    //     if((photos.length-1)=== index) $scope.next_visible = false;
    //     var modalInstance = $modal.open({

    //         template: '<style>.modal-content img.tag-imgae{max-height: 100%;max-height: 100%;position: absolute;right: 0;left: 0;top: 0;bottom: 0;margin: auto}.modal.in .modal-dialog{max-width: 80%;margin: auto;height: 90%;left: 0;right: 0;top: 0;bottom: 0;position: absolute}.modal .modal-content{border: 5px solid #fff;height: 100%}.modal-img-inner{background: #000;height: 100%}.modal-img-tag-desc .modal-tag-frnds-input input[type="text"]{width: auto;background: none;border: 1px solid #666;color: #aaa;padding: 5px 10px;box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;-moz-box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;-webkit-box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;}.modal-img-tag-desc{padding: 10px; z-index: 8042;}.modal.in .modal-dialog .fancybox-wrap{position: relative}.modal-img-tag-desc{background-color: rgba(0, 0, 0, .8);width: 100%;position:absolute;bottom: 0}.modal-img-tag-desc > span{display: inline-block;vertical-align: middle}.modal-img-tag-desc span.tag-list-block .tag-friends{display: inline-block;vertical-align: middle;margin: 0 0px 0 5px;background: rgba(255, 255, 255, .2);color: #fff;padding: 4px 6px;font-size: 12px;font-weight: 400;border-radius: 3px}.modal-img-tag-desc span.tag-list-block .tag-friends b{margin-left: 5px}.modal-content .modal-img-tag{font-weight: bold;position: absolute;top: 10px;right: 10px;background: #fff;padding: 4px 8px;-webkit-border-radius: 2px;-moz-border-radius: 2px;-ms-border-radius: 2px;-o-border-radius: 2px;border-radius: 2px;box-shadow:0px 0px 2px 1px #ddd;-moz-box-shadow:0px 0px 2px 1px #ddd;-webkit-box-shadow:0px 0px 2px 1px #ddd;z-index: 8042;}.modal-content .modal-img-tag img{width: 15px;height: auto; margin: 0 0 0 4px;}</style><div class="modal-img-inner"><img src="'+photos[index].media_path+'" class="tag-imgae"><div class="slide-contros"><a data-ng-show="pre_visible" data-ng-click="pre_image(index,photos)" class="pre slide-btn" href><span></span><a/><a data-ng-click="next_image(index,photos)" data-ng-show = "next_visible" class="next slide-btn" href><span></span><a/></div><span class="sideloader" data-ng-show="loader"><img title="" alt="" src="app/assets/images/proceed.gif"></span><div data-ng-hide="loader" class="modal-img-tag" ng-click="untagg()">Untag <img title="Remove Tag" alt="Tag Friends" src="app/assets/images/tag-icon-remove.png" ></div></div>',

    //         controller: 'ModalController',
    //         size: 'lg',
    //         scope: $scope,
    //     });
    //     // $scope.tagged_Friends = []
    //     modalInstance.result.then(function (selectedItem) {
    //     }, function () {
    //         $log.info('Modal dismissed at: ' + new Date());
    //     });

    //     $scope.untagg = function(){
    //         $scope.loader = true;
    //         var opts ={};
    //         opts.user_id = APP.currentUser.id;
    //         opts.untag_user_id = APP.currentUser.id;
    //         opts.media_id = $scope.photos[$scope.index].id;

    //         AlbumService.removeTaggedPhoto(opts,function(data){
    //             if(data.code===101){
    //                 modalInstance.close();
    //                 var tempIndex = $scope.tagged_photo.indexOf($scope.photos[$scope.index])
    //                 $scope.tagged_photo.splice(tempIndex,1)
    //             }else{
    //                 $scope.loader = false;
    //             }
    //         })
    //     }
    //     $scope.pre_image = function (index, photos){
    //         modalInstance.close();
    //         $scope.imageModal(index-1, photos);
    //     }

    //     $scope.next_image = function (index, photos, leng){
    //         modalInstance.close()
    //         $scope.imageModal(index+1, photos);
    //     }
    // }

    // $scope.createModal = function(index, viewalbum, leng){
    //     $scope.index = index;
    //     $scope.viewalbum = viewalbum;
    //     $scope.leng = leng
    //     $scope.item_id = viewalbum[index].id;
    //     $scope.pre_visible = true;
    //     $scope.next_visible = true;
    //     $scope.friendTagIndex = 0;
    //     if(index === 0) $scope.pre_visible = false;
    //     if((leng-1)=== index) $scope.next_visible = false;
    //     // $scope.tagged_Friends = tagged_friends;
    //     $scope.tagged_Friends = [];
    //     angular.forEach(viewalbum[index].tagged_friends_info, function(obj){
    //         obj.user_id = obj.id;
    //         obj.user_info = {};
    //         obj.user_info.first_name = obj.first_name;
    //         obj.user_info.last_name = obj.last_name;
    //         $scope.tagged_Friends.push(obj)
    //     });
    //     $scope.storedFriend = [];

    //     angular.forEach($scope.tagged_Friends,function(obj){
    //         $scope.storedFriend.push(obj)
    //     });
    //     $scope.loader = false;
    //     var modalInstance = $modal.open({
    //         template: '<style>.modal-content img.tag-imgae{max-height: 100%;max-height: 100%;position: absolute;right: 0;left: 0;top: 0;bottom: 0;margin: auto}.modal.in .modal-dialog{max-width: 80%;margin: auto;height: 90%;left: 0;right: 0;top: 0;bottom: 0;position: absolute}.modal .modal-content{border: border: 5px solid #fff;height: 100%}.modal-img-inner{background: #000;height: 100%}.modal-img-tag-desc .modal-tag-frnds-input input[type="text"]{width: auto;background: none;border: 1px solid #666;color: #aaa;padding: 5px 10px;box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;-moz-box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;-webkit-box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;}.modal-img-tag-desc{padding: 10px; z-index: 8042;}.modal.in .modal-dialog .fancybox-wrap{position: relative}.modal-img-tag-desc{background-color: rgba(0, 0, 0, .8);width: 100%;position:absolute;bottom: 0}.modal-img-tag-desc > span{display: inline-block;vertical-align: middle}.modal-img-tag-desc span.tag-list-block .tag-friends{display: inline-block;vertical-align: middle;margin: 0 0px 0 5px;background: rgba(255, 255, 255, .2);color: #fff;padding: 4px 6px;font-size: 12px;font-weight: 400;border-radius: 3px}.modal-img-tag-desc span.tag-list-block .tag-friends b{margin-left: 5px}.modal-content .modal-img-tag{font-weight: bold;position: absolute;top: 10px;right: 10px;background: #fff;padding: 4px 8px;-webkit-border-radius: 2px;-moz-border-radius: 2px;-ms-border-radius: 2px;-o-border-radius: 2px;border-radius: 2px;box-shadow:0px 0px 2px 1px #ddd;-moz-box-shadow:0px 0px 2px 1px #ddd;-webkit-box-shadow:0px 0px 2px 1px #ddd;z-index: 8042;}.modal-content .modal-img-tag img{width: 15px;height: auto; margin: 0 0 0 4px;}</style><div class="modal-img-inner"><img src="'+viewalbum[index].media_path+'" class="tag-imgae"><div class="slide-contros"><a data-ng-show="pre_visible && !tag" data-ng-click="pre_image(index,viewalbum,leng)" class="pre slide-btn" href><span></span><a/><a data-ng-click="next_image(index,viewalbum,leng)" data-ng-show = "next_visible && !tag" class="next slide-btn" href><span></span><a/></div><div class="modal-img-tag" ng-click="toggle()"><a href>Tag <img title="Tag Friends" alt="Tag Friends" src="app/assets/images/tag-icon.png" ></a></div><div class="modal-img-tag-desc"><span class="modal-tag-frnds-input"><input id="searchTagFriend" data-ng-if="tag===true" type="text" data-ng-model="friendName" placeholder="Tag Your friends" ng-keyup="tagFriendSuggestion($event, friendName)" data-ng-blur="lostFocus()"/><div class="post-tag-friend-list" data-ng-show="showFriendList"><ul><li data-ng-repeat="friend in friends" data-ng-click="selectFriend(friend)" ng-mouseover="$parent.friendTagIndex=$index" ng-class="{active : friendTagIndex===$index}"><a href><img alt="" data-ng-if=friend.user_info.profile_image_thumb src={{friend.user_info.profile_image_thumb}} width="" height=""/><img alt="" data-ng-if=!friend.user_info.profile_image_thumb src= "app/assets/images/dummy32X32.jpg" width="" height=""/><span>{{friend.user_info.first_name}} {{friend.user_info.last_name}}</span></a></li></ul><span ng-show="showSearchLoader" class="ng-hide loading-icon"><img titile="" alt="" src="app/assets/images/proceed.gif"></span></div></span><span class="tag-list-block"><span class="tag-friends" data-ng-repeat="tags in storedFriend">{{tags.user_info.first_name}} {{tags.user_info.last_name}}<span data-ng-if="tag===true" class="remove-tag-btn" data-ng-click="removeTagFriend($index)"><b class="fa fa-times cross"></b></span></span><span class="sideloader" data-ng-show="loader"><img title="" alt="" src="app/assets/images/proceed.gif"></span><span class="modal-img-tag" data-ng-if="tag===true"><a href data-ng-click="taggService()">Update</a></span></span></div></div>',
    //         controller: 'ModalController',
    //         size: 'lg',
    //         scope: $scope,
    //     });
    //     // $scope.tagged_Friends = []
    //     modalInstance.result.then(function (selectedItem) {
    //     }, function () {
    //         $log.info('Modal dismissed at: ' + new Date());
    //         $scope.storedFriend = [];
    //         $scope.tagged_Friends = [];
    //         $scope.tag = false;
    //     });

    //     $scope.pre_image = function (index, viewablum, leng){
    //         modalInstance.close();
    //         $scope.createModal(index-1, viewablum, leng);
    //     }

    //     $scope.next_image = function (index, viewablum, leng){
    //         modalInstance.close()
    //         $scope.createModal(index+1, viewablum, leng);
    //     }

    //     var DELAY_TIME_BEFORE_POSTING = 300;
    //     var currentTimeout = null;
    //     $scope.friends = [];
    //     $scope.cancelFriendSearch = false;
    //     $scope.showSearchLoader = false;

    //     $scope.tagFriendSuggestion = function(event, friendname){
    //         if(event.keyCode===40){
    //             event.preventDefault();
    //             if($scope.friendTagIndex+1 !== $scope.friends.length){
    //                 $scope.friendTagIndex++;
    //             }
    //         }else if(event.keyCode===38){
    //             event.preventDefault();
    //             if($scope.friendTagIndex-1 !== -1){
    //                 $scope.friendTagIndex--;
    //             }
    //         }else if(event.keyCode===13){
    //                 $scope.selectFriend($scope.friends[$scope.friendTagIndex]);
    //         }
    //         if($('#searchTagFriend').val().trim()==="") $scope.showFriendList = false;
    //         if(!(event.keyCode>=65 && event.keyCode<=95)) return;
    //         $scope.cancelFriendSearch = false;
    //         var opts = {};
    //         opts.user_id = APP.currentUser.id;
    //         friendname ? opts.friend_name = friendname : opts.friend_name = "";
    //         opts.limit_start = 0;
    //         opts.limit_size =  APP.friend_list_pagination.end;
    //         $scope.showSearchLoader = true;

    //         ProfileService.searchFriends(opts,function(data){
    //             $scope.showSearchLoader = false;
    //             if($scope.cancelFriendSearch === false){
    //                 if(data.data.users.length>0) $scope.showFriendList = true;
    //                 else $scope.showFriendList = false;
    //                 $scope.friends = data.data.users;
    //             }
    //         })
    //     };
    //     $scope.toggle = function(){
    //         $scope.tag = !$scope.tag;
    //     }

    //     $scope.taggService = function(){
    //         var opts = {};
    //         opts.user_id = APP.currentUser.id;
    //         opts.album_id = $scope.albumId;
    //         opts.post_type = 1;
    //         opts.media_id = [$scope.item_id];
    //         var frnd_array = []
    //         angular.forEach($scope.storedFriend,function(index){
    //             frnd_array.push(index.user_id);
    //         });
    //         opts.tagged_friends = frnd_array.join(',')
    //         $scope.tag = false;
    //         $scope.loader = true;
    //         AlbumService.photoTaging(opts,function(data){
    //             if(data.code === 101){
    //                 $scope.item_id="";
    //                 // $scope.storedFriend = [];
    //                 $scope.tagged_Friends = [];
    //                 $scope.tag = false;
    //                 $scope.loader = false;
    //                 angular.forEach($scope.storedFriend,function(obj){
    //                     if(!obj.first_name) obj.first_name = obj.user_info.first_name;
    //                     if(!obj.last_name) obj.last_name = obj.user_info.last_name;
    //                 });
    //                 $scope.viewalbum[$scope.index].tagged_friends_info = $scope.storedFriend
                    
    //             }
    //         })
    //     }
    //     // Store friend 
    //     $scope.dublicate = false;

    //     $scope.selectFriend = function(friendInfo){
        
    //         $scope.dublicate = false;
    //         angular.forEach($scope.storedFriend,function(index){
    //             if(index.user_id === friendInfo.user_id){
    //                 $scope.dublicate = true;
    //             }
    //         });

    //         if($scope.dublicate === false){
    //             $scope.storedFriend.push(friendInfo);
    //             $scope.friends = [];
    //             $scope.cancelFriendSearch = true;
    //             $scope.friendTagIndex = -1;
    //             angular.element('#searchTagFriend').val("");
    //             $scope.showFriendList = false;
    //         }else{
    //             $scope.friends = [];
    //             $scope.cancelFriendSearch = true;
    //             $scope.friendTagIndex = -1;
    //             angular.element('#searchTagFriend').val("");
    //             $scope.showFriendList = false;
    //         }
    //     };

    //     // stop the service for loading more service
    //     $scope.lostFocus = function(){
    //         $timeout(function(){
    //             $scope.friends = [];
    //             $scope.cancelFriendSearch = true;
    //             $scope.friendTagIndex = -1;
    //             angular.element('#searchTagFriend').val("");
    //             $scope.showFriendList = false;
    //         },300);
    //     };
    //     // Remove selected friend
    //     $scope.removeTagFriend = function(friendIndex){
    //         //var index = $scope.storedFriend.indexOf(friendIndex);
    //         $scope.storedFriend.splice(friendIndex,1);
    //         //$scope.tagged_Friends = [];
    //     };
    // }

    //Album Listing
    $scope.albumListing = function(type){
        var limit_start = $scope.listAlbum.length;
        if(type == 'delete') {
            $scope.albloader = false;      
        } else if(type === 'listing') {
            $scope.albloader = false;
        } else {
            $scope.albloader = true;
        }
        var limit_start = $scope.listAlbum.length;         
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = APP.currentUser.id; // for login user album
        opts.limit_start = limit_start; 
        opts.limit_size = 12;
        opts.friend_id = APP.currentUser.id; 
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.listload = true;
            $scope.allRes = 0;
            AlbumService.albumListing(opts, function(data){
/*<<<<<<< HEAD
            if(data.code == 101) {
                if(type == 'create') {
                    $scope.albumResponse = $scope.i18n.albums.album_created;
                } else if(type == 'delete') {
                    $scope.albumResponse = $scope.i18n.albums.album_deleted;
                } else {
                   //$scope.albumResponse = "";
                }
                $timeout(function(){
                    $scope.albumResponse = "";
                },15000);

                $('.album-option').removeClass('album-blank');
                $scope.noAlbums = true;    
                $scope.albloader = false;  
                $scope.totalSize = data.data.size;
                $scope.allRes = 1;
                $scope.listAlbum = $scope.listAlbum.concat(data.data.albums);   
                $scope.tagged_photo_available = data.data.tagged_photo;
                if ($scope.tagged_photo_available && $scope.tagged_photo_available.album_name === "Photo Of You"){
                    var opts = {}
                    opts.user_id = APP.currentUser.id;
                    opts.limit_start = 0; 
                    opts.limit_size = 12; 
                    
                    AlbumService.getTaggedPhoto(opts,function(data){
                        $scope.tagged_photo = data.data;
                    })
=======*/
                if(data.code == 101) {
                    if(type == 'create') {
                        $scope.albumResponse = $scope.i18n.albums.album_created;
                    } else if(type == 'delete') {
                        $scope.albumResponse = $scope.i18n.albums.album_deleted;
                    } else {
                       //$scope.albumResponse = "";
                    }
                    $timeout(function(){
                        $scope.albumResponse = "";
                    },15000);

                    $('.album-option').removeClass('album-blank');
                    $scope.noAlbums = true;    
                    $scope.albloader = false;  
                    $scope.totalSize = data.data.size;
                    $scope.allRes = 1;
                    $scope.listAlbum = $scope.listAlbum.concat(data.data.albums);   
                    $scope.tagged_photo_available = data.data.tagged_photo;
                    if ($scope.tagged_photo_available && $scope.tagged_photo_available.album_name === "Photo Of You"){
                        var opts = {}
                        opts.user_id = APP.currentUser.id;
                        opts.session_id = APP.currentUser.id;
                        opts.limit_start = 0; 
                        opts.limit_size = 12; 
                        AlbumService.getTaggedPhoto(opts,function(data){
                            $scope.tagged_photo = data.data;
                        })
                    }
                    $scope.listload = false; 
                    if($scope.totalSize == 0) {

                    } else {
                        if(document.getElementById("albumname")){
                            $scope.user = {};     
                        }   
                    }
                }else {
                    $scope.albloader = false; 
                    $scope.listload = false; 
//>>>>>>> 22e8b7b0469595f15e224c6608040ebe6a6a684d
                }
            });
        }
    };

    //infinite scroll loadmore
    $scope.loadMore = function() {     
        $scope.albumListing('listing');
    };
    $scope.loadMoreImage = function() {
        if($scope.viewalbum.length < $scope.imagecount) {
            $scope.viewAlbum('listing');
        } else {
            $scope.listload = false;
        }
    };

    //Delete Album 
    $scope.delAlbmLoader = [];
    $scope.deleteAlbum = function(indx){  
        $scope.delAlbmLoader[indx] = true;
        var tempItem = $scope.listAlbum[indx];
        var opts = {};
        opts.user_id = $scope.currentUser.id;
        opts.album_id = tempItem.id;
        AlbumService.deleteAlbum(opts, function(data){
           if(data.code == 101) {
                $scope.delAlbmLoader[indx] = true;
                $scope.listAlbum.splice(indx,1);
                $timeout(function() {
                        $scope.delAlbmLoader[indx] = '';
                }, 15000);
            }
        });
    }
    //View Album 
    $scope.albumDescription = '';
    $scope.viewAlbum = function(type){
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
        opts.user_id = APP.currentUser.id;
        opts.friend_id = APP.currentUser.id;
        opts.album_id = albumId;
        opts.limit_start = limit_start;
        opts.limit_size = 12;
        if ((( $scope.totalSizeImg > limit_start) || $scope.totalSizeImg == 0 ) && $scope.allResImg == 1) {
            $scope.listload = true;
            $scope.allResImg = 0;
        AlbumService.viewAlbum(opts, function(data){

            if(data.code == 101) {
                $scope.imagecount = data.data.size;
                $('.album-option').removeClass('album-blank');
                $scope.albloader = false;
                $scope.noPhotos = true;
                if(type == 'upload') {
                    $scope.albumResponse = $scope.i18n.albums.successful_upload;
                } else if(type == 'delete') {
                    $scope.albumResponse = $scope.i18n.albums.sucessful_delete;
                } else {
                   $scope.albumResponse = "";
                }

                $scope.totalSizeImg = data.data.size;
                $scope.allResImg = 1;
                $scope.viewalbum = $scope.viewalbum.concat(data.data.media);
                $scope.albumDescription =  data.data.album.description;
                $scope.albumDetails = data.data.album;
                $scope.listload = false; 
                // $scope.imagePrvSrc = $scope.imagePrvSrc.concat(data.data.media);
                var str_imagePrvSrc = JSON.stringify($scope.imagePrvSrc)
                angular.forEach(data.data.media,function(data_img){
                    if(str_imagePrvSrc.indexOf(data_img.id) === -1){
                        $scope.imagePrvSrc.push(data_img);
                    }
                })
            } else {
                $scope.albloader = false;
                $scope.noPhotos = true;
                $scope.listload = false; 
            }
        });  
    }
    }
    //Count Number of images 
    $scope.countPhoto = function(){
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_id = Album_id;
        AlbumService.countPhoto(opts, function(data){
            if(data.code == 101) {
           
            } else {
             
            }
        });  
    }
    //Delete Images from Album
    $scope.deleteMediaAlbum = function(m_id, index){
        //$scope.albloader = true;
        var albumId = $routeParams.album_id;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.album_id = albumId;
        opts.media_id = m_id;
        
        
        AlbumService.deleteMediaAlbum(opts, function(data){
            if(data.code == 101) {
                //$scope.albumResponse = data.message;
                $scope.viewalbum.splice(index, 1);
                //$scope.viewAlbum('delete');
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 15000);
            } else {
             
            }
        }); 
        
    }

    //Set as profile image
    $scope.setuserprofileimages = function(m_id, id){
        $("#featuredloaderlink-"+id).hide();
        $("#featuredloader-"+id).show();
        $scope.featuredloader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.media_id = m_id;
        AlbumService.setuserprofileimages(opts, function(data){
            if(data.code == 101) {
                
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 4000);
                $scope.viewmultiprofiles();
            } else {
                $scope.albumResponse = data.message;
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.albumResponse = '';
                }, 4000);
            }
        });  
    }

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
                $scope.albumResponse = $scope.i18n.albums.profile_pic_update;
            } else {                
                $scope.propic = true; 
                $scope.picloader = false;
                
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

    $scope.albumListing('all'); //initialization of album listing function
    $scope.viewAlbum(); //initialization of Images listing function
    // $(".fancybox").fancybox(); 
    //Image Pop Up Plugin
    //image upload Page 
    $scope.redirectUrl = function(album_id, album_name) {
        $location.path("/album/images/"+album_id+"/"+album_name);
    }

    /*function to change privacy of album
    */
    $scope.editPrivacyMsg = [];
    $scope.editPrivacyCls = [];
    $scope.updateAlbumPrivacy = [];
    $scope.changePrivacy = function(item, indx){
        var opts = {};
            opts.user_id = $scope.currentUser.id;
            opts.album_id = item.id;
            opts.album_name = item.album_name; 
            opts.album_desc = item.album_description;
            opts.privacy_setting = item.album_privacy;
            opts.type = 'user';
            AlbumService.updateAlbum(opts, function(data){
                $scope.updateAlbumPrivacy[indx] = false;
                if(data.code == 101) {
                    $scope.listAlbum[indx] = data.data;
                    $scope.user = null;  
                    $scope.editPrivacyMsg[indx] = '';
                } else {
                    $scope.editPrivacyMsg[indx] = $scope.i18n.albums.gone_wrong;
                    $timeout(function() {
                            $scope.editPrivacyMsg[indx] = '';
                    }, 15000);
                }
            });
    }

     $scope.setPrivacy = function(item, value){
        var indx = $scope.listAlbum.indexOf(item);
        var opts = {};
            opts.user_id = $scope.currentUser.id;
            opts.album_id = item.id;
            opts.album_name = item.album_name; 
            opts.album_desc = item.album_description;
            opts.privacy_setting = value;
            opts.type = 'user';
            AlbumService.updateAlbum(opts, function(data){
                $scope.updateAlbumPrivacy[indx] = false;
                if(data.code == 101) {
                    data.data.media_in_album = item.media_in_album;
                    data.data.featured_media_path = item.featured_media_path;
                    $scope.listAlbum[indx].album_privacy = data.data.album_privacy;
                    $scope.user = null;  
                    $scope.editPrivacyMsg[indx] = '';
                } else {
                    $scope.editPrivacyMsg[indx] = $scope.i18n.albums.gone_wrong;
                    $timeout(function() {
                            $scope.editPrivacyMsg[indx] = '';
                    }, 15000);
                }
            });
    }    
}]);
