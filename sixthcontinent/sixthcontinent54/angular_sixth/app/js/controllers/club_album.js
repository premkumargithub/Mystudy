app.controller('ClubAlbumController', ['$scope', '$http', '$timeout', 'GroupService', 'AlbumService', '$routeParams', '$location','ProfileService' ,'$modal', '$log', 'focus', function($scope, $http, $timeout, GroupService, AlbumService, $routeParams, $location ,ProfileService,$modal, $log, focus) {
    $scope.createAlbumForm = false;
	$scope.clubAlbumLoading = true;
	$scope.clubAlbumFound = false;
	$scope.CreateAlbumStart = false;
	$scope.createSuccess = false;
	$scope.createError = false;
    $scope.clubphoto = true;
    $scope.aboutsection=false;
    $scope.listload = false;
    $scope.clubAlbumData = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
    $scope.clubAlbumSubmitted = false;
        
	$scope.groupId = $routeParams.clubId;
	$scope.groupType = $routeParams.clubType;
	//alert("club id"+$scope.groupId + " type="+$scope.groupType);
	$scope.listOfAlbums = function(type) { 
		var limit_start = $scope.clubAlbumData.length;
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.user_id =  APP.currentUser.id;
        opts.session_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = 12;
		if ((($scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
		//console.log('entered');
		$scope.listload = true;
        $scope.allRes = 0;
		GroupService.getClubAlbum(opts, function(data) {
			if(data.code == 101) {
				$scope.clubAlbumLoading = false;
				$scope.clubAlbumFound = true;
				$scope.totalSize = data.data[0].size;
                $scope.allRes = 1;
                $scope.clubAlbumData = $scope.clubAlbumData.concat(data.data[0].media);   
                $scope.listload = false;   
                $('.album-option').removeClass('album-blank');

			} else {
				$scope.clubAlbumLoading = false;
				$scope.clubAlbumFound = false;
				$scope.listload = false;   
				$('.album-option').removeClass('album-blank');

			}
		});
	}
	}

	//infinite scroll loadmore
	$scope.loadMore = function() {     
        $scope.listOfAlbums('listing');
    };

	$scope.listOfAlbums('listing');

	$scope.showAlbumForm = function() {
		$scope.errorMessage = '';
		$scope.createError = false;
		$scope.createAlbumForm = !$scope.createAlbumForm;
		$scope.CreateAlbum = {};
	}

	$scope.createClubAlbum = function() {
        $scope.clubAlbumSubmitted = true;
		var opts = {};
		opts.group_id = $routeParams.clubId;
        opts.session_id = APP.currentUser.id;
		if($scope.CreateAlbum.albumName === undefined || $scope.CreateAlbum.albumName === '') {
            focus('clubalbumname');
            return false;
		} else if($scope.CreateAlbum.description === undefined || $scope.CreateAlbum.description === '') {
            focus('clubalbumdesc');
            return false;
		} else {
            $scope.CreateAlbumStart = true;
    		opts.album_name = $scope.CreateAlbum.albumName;
    		opts.album_desc = $scope.CreateAlbum.description;
    		GroupService.createClubAlbum(opts, function(data) {
    			
    			if(data.code == 101) {
    				$scope.createSuccess = true;
                    $scope.CreateAlbumStart = false;
    				$scope.successMessage = $scope.i18n.albums.album_sucessful_created;
    				$timeout(function(){
    					$scope.createSuccess = false;
    					$scope.successMessage = '';
    					$scope.showAlbumForm();
    					$scope.clubAlbumData.length = 0;
    					$scope.listOfAlbums('listing');
    				}, 2000);
    			} else {
    				$scope.createError = true;
    				$scope.errorMessage = $scope.i18n.albums.creation_gone_wrong;
    				$scope.CreateAlbumStart = false;
    				$timeout(function(){
    					$scope.createError = false;
    					$scope.errorMessage ='';
    				}, 2000);
    			}
    		});
        }
	};

	$scope.editAlbumForm = false;
    $scope.updateUserAlbum = false;
    $scope.editAlbum = function(albumdata) {
        $scope.editAlbumData = {};
        $scope.editAlbumData.id = albumdata.id;
        $scope.editAlbumData.albumName = albumdata.album_name;
        $scope.editAlbumData.albumDescription = albumdata.album_description;
        $scope.editAlbumForm = !$scope.editAlbumForm;
    }

    $scope.closeEditForm = function() {
        $scope.editAlbumForm = !$scope.editAlbumForm;
        $scope.editAlbumData = {};
    }

    $scope.updateAlbum = function() {
        $scope.clubAlbumSubmitted = true;
        if($scope.editAlbumData.albumName === undefined || $scope.editAlbumData.albumName === '') {
            focus('editalbumname');
            return false;
        } else if ($scope.editAlbumData.albumDescription === undefined || $scope.editAlbumData.albumDescription === '') {
            focus('editalbumdesc');
            return false; 
        } else {
            $scope.updateUserAlbum = true;
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.album_id = $scope.editAlbumData.id;
            opts.album_name = $scope.editAlbumData.albumName; 
            opts.album_desc = $scope.editAlbumData.albumDescription;
            opts.type = 'club';
            AlbumService.updateAlbum(opts, function(data){
            	$scope.updateUserAlbum = false;
                $scope.clubAlbumSubmitted = false;
                if(data.code == 101) {
                	$scope.editAlbumForm = !$scope.editAlbumForm;
                    $scope.clubAlbumData = [];
                    $scope.listOfAlbums('listing');
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

	$scope.deleteClubAlbum = function(albumId, id) {
		//$("#deleteStart-"+id).hide();
		//$("#deleteStartLoader-"+id).show();
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.album_id = albumId;
        opts.session_id = APP.currentUser.id;
		GroupService.deleteClubAlbum(opts, function(data) {
			if(data.code == 101) {
				//$("#deleteStart-"+id).show();
				//$("#deleteStartLoader-"+id).hide();
				$scope.clubAlbumData.length = 0;
				$scope.listOfAlbums('listing');
			} else {

			}
		});
	};
	//// start code for club album /////
     //calling function to load postlist
        //$scope.showUserPostList();
        $scope.averageVoting = 0;
        $scope.vote_count = 0;
        $scope.waitRateResponse = false;
        $scope.ratePost = function(rating, id, index){
            var update = "";
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club_album";
            opts.type_id = id;
            opts.rate = rating;
            $scope.waitRateResponse = true;
            if($scope.clubAlbumData[index].is_rated){
                update = "update";
            }else{
                update = "add";
            }
            waitRequest = ProfileService.rateThis(opts, update, function(data){
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.clubAlbumData[index].avg_rate = data.data.avg_rate;
                    $scope.clubAlbumData[index].no_of_votes = data.data.no_of_votes;
                    $scope.clubAlbumData[index].is_rated = true;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    //$scope.userPostList[index].avg_rate = 0;
                    //$scope.userPostList[index].no_of_votes = 0;
                    $scope.clubAlbumData[index].is_rated = false;
                    $scope.clubAlbumData[index].current_user_rate = 0;
                }
                $scope.waitRateResponse = false;
            });
        };

        $scope.WaitDeleteResponse = false;
        $scope.removeRating = function(id, index){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club_album";
            opts.type_id = id;
            if($scope.WaitDeleteResponse === false){
                $scope.WaitDeleteResponse = true;
                $scope.waitRateResponse = true;
            }else{
                return;
            }
            ProfileService.removeRating(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.clubAlbumData[index].current_user_rate = 0;
                    $scope.clubAlbumData[index].is_rated = false;
                    $scope.clubAlbumData[index].no_of_votes = data.data.no_of_votes;
                    $scope.clubAlbumData[index].avg_rate =  data.data.avg_rate;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    $scope.clubAlbumData[index].current_user_rate = 0;
                    $scope.clubAlbumData[index].is_rated = false;
                    //$scope.userPostList[postIndx].no_of_votes =0;
                    //$scope.userPostList[postIndx].avg_rate =  0;
                }
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
            });
        };


        $scope.stars = [];

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
                        template: '<style>.modal-body.tag-frnd-modal ul li{padding:8px 130px 8px 0}.modal-content .modal-body ul.rmv-tag{position:absolute;right:0;top:10px}.modal-content .modal-body ul.rmv-tag li{padding:0;display:inline-block;vertical-align:middle;border:0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) no-repeat;display:block}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) 0 -21px no-repeat;display:block}.modal.in .modal-dialog{margin:auto;top:0;bottom:0;left:0;right:0;position:absolute}.modal-body.tag-frnd-modal{height:360px;overflow-y:auto;overflow-x:hidden;padding:0 10px}.modal .modal-content{margin:auto;height:400px;top:0;bottom:0;left:0;right:0;position:absolute;overflow:visible}@media screen and (max-width:479px){.modal.in .modal-dialog{margin:auto 20px}.modal-body.tag-frnd-modal ul li{padding:8px 70px 8px 0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 0/12px no-repeat}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 -11px/12px no-repeat}}</style><div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div></div><div class="modal-body tag-frnd-modal"><ul ng-hide="showPeopleLoader"><li data-ng-repeat="friend in ratedUsers"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a ng-href="#/viewfriend/{{friend.id}}">{{friend.first_name}} {{friend.last_name}}</a><span class="frnd-details"><a href>{{friend.about_me}}</a></span></span><ul class="rmv-tag"><li data-ng-repeat="avgRate in averageRating(friend.rate) track by $index"><span ng-class="friend.rate % 1 == 0 ?\'votes-avg\': ($last ? \'half-avg\':\'votes-avg\')" /></li><li ng-repeat="blank in blankStar(friend.rate) track by $index"><span class="votes-blank"/> </li></ul></li></ul> <div ng-show="showPeopleLoader"><img titile="" alt="" src="app/assets/images/proceed.gif"></div></div><div class="modal-footer"></div>',
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
        };
    ///  end code for club rating  /////

	$scope.redirectUrl = function(albumId, name) {
		$location.path("/album/club/view/"+$scope.groupId+"/"+albumId+"/"+$scope.groupType+"/"+name);
	};

}]);

/**
* Controller for Club Album all photos
*
*/
app.controller('ClubAlbumPhotoController',['$scope', '$http', '$timeout', 'GroupService', '$routeParams', 'FileUploader' ,'ProfileService' ,'$modal', '$log', function($scope, $http, $timeout, GroupService, $routeParams, FileUploader , ProfileService,$modal, $log) {
    $scope.createAlbumForm = false;
	$scope.clubAlbumLoading = true;
	$scope.imageUploadStart = false;
	$scope.uploadSuccess = false;
	$scope.uploadError = false;
	$scope.listload = false;
	$scope.deleteMediaStart = false;
	$scope.viewalbum = [];
    $scope.totalSizeImg = 0;
    $scope.allResImg = 1;
	$scope.groupId = $routeParams.clubId;
	$scope.albumId = $routeParams.albumId;
	$scope.clubType = $routeParams.clubType;
	$scope.albumName = $routeParams.name;

	$scope.viewClubAlbumPhotos = function(type) {
        
		 if(type == 'listing') {
            $scope.clubAlbumLoading = false;
        } else {
        	$scope.clubAlbumLoading = true;
        }

		var limit_start = $scope.viewalbum.length; 		
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.user_id =  APP.currentUser.id;
		opts.album_id = $scope.albumId;
        opts.session_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = 12;
		if ((( $scope.totalSizeImg > limit_start) || $scope.totalSizeImg == 0 ) && $scope.allResImg == 1) {
		$scope.listload = true;
        $scope.allResImg = 0;
		GroupService.viewClubAlbum(opts, function(data) {
			if(data.code == 101) {
                $scope.clubAlbumLoading = false;
				$scope.totalSizeImg = data.data[0].size;
                $scope.allResImg = 1;
                $scope.viewalbum = $scope.viewalbum.concat(data.data[0].media);
                $scope.albumDescription = data.data[0].album.description; 
                $scope.albumDetails = data.data[0].album;
                $scope.listload = false;
                $('.album-option').removeClass('album-blank');
			} else {
				$scope.listload = false;
				$('.album-option').removeClass('album-blank');
			}
		});
	}
	};

	$scope.loadMoreImage = function() {     
        $scope.viewClubAlbumPhotos('listing');
    };
	$scope.viewClubAlbumPhotos('listing');
	$scope.UploadMediaInAlbum = function() {
		if($scope.imagePrvSrc == undefined || $scope.imagePrvSrc.length == 0){
			$scope.uploadError = true;
			$scope.uploadErrorMsg = $scope.i18n.albums.select_first;
			$timeout(function(){
					$scope.uploadErrorMsg = "";
					$scope.uploadError = false;
			}, 4000);
			return false;
		}
		$scope.imageUploadStart = true;
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.album_id = $scope.albumId;
        opts.session_id = APP.currentUser.id;
		opts.group_media = $scope.postFiles;
		opts.post_type = 1;
        var filescount = $scope.imagePrvSrc.length;
        opts.media_id = [];
        angular.forEach($scope.imagePrvSrc, function(file) {
              opts.media_id.push(file.media_id);
        });

		GroupService.uploadMediaInClubAlbumFinal(opts, function(data) {
			$scope.postFiles = [];
			$scope.imagePrvSrc = [];
			if(data.code == 101) {
				$scope.viewalbum.length = 0;
				$scope.imageUploadStart = false;
				$scope.uploadSuccess = true;
				$scope.imgUpload = false;
				$scope.uploadSuccessMsg = $scope.i18n.albums.upload_sucess;
				$("input[type='file']").val('');
				$timeout(function(){
					$scope.uploadSuccessMsg = "";
					$scope.viewClubAlbumPhotos('listing');
				}, 5000);
				$scope.postFiles = [];
                $scope.imagePrvSrc = [];
                uploader.queue = [];
			} else {
				$("input[type='file']").val('');
				$scope.imageUploadStart = false;
				$scope.imgUpload = false;
				$scope.uploadError = true;
				$scope.uploadErrorMsg = $scope.i18n.albums.upload_error;
				$timeout(function(){
					$scope.$scope.uploadErrorMsg = "";
					$scope.viewClubAlbumPhotos();
				}, 15000);
				$("input[type='file']").val('');
			}
		});
	};

    $scope.fileNotValid = false;
    $scope.fileNotValidMsg = '';
    $scope.tempAlbumId = '';
    $scope.albumImgLoader = [];
    $scope.imagePrvSrc = [];
    
    
    var uploader =  $scope.uploader = new FileUploader({
          url: APP.service.uploadMediaInClubAlbum+"?access_token="+APP.accessToken,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'method': 'POST'
              /*'Accept': 'text/json'*/
          },
          data:{
              'user_id': APP.currentUser.id,
              'album_id':$scope.albumId, 
              'group_id':$scope.groupId, 
              'post_type':"0",
              'session_id':APP.currentUser.id
          },
          dataObjName:'reqObj',
          formDataName:'group_media[]'
        });
        // FILTERS
        uploader.filters.push({
            name: 'group_media[]',
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
        
   
    //remove iamge from preview array
    $scope.removeImage = function(index) {
    	var tempImg = $scope.imagePrvSrc[index];
        $scope.imagePrvSrc.splice(index, 1);
        var item = $scope.uploader.queue[index];
        item.remove();
        var opts = {};
        opts.group_id = $scope.groupId;
        opts.album_id = $scope.albumId;
        opts.media_id = tempImg.media_id;
        opts.session_id = APP.currentUser.id;
        //calling the service to delete the selected post 
        GroupService.deleteClubAlbumMedia(opts, function(data){
            if(data.code == 101) {

            } else {
                $scope.imagePrvSrc[index] = tempImg;
                $timeout(function(){
                    $scope.albumErrMsg = data.message;
                }, 4000);
            }
        });
    };

	$scope.deleteClubAlbumMedia = function(mediaId, id) { 
		//$scope.deleteMediaStart = true;
		var opts = {};
		opts.group_id = $scope.groupId;
		opts.album_id = $scope.albumId;
		opts.media_id = mediaId;
        opts.session_id = APP.currentUser.id;
		GroupService.deleteClubAlbumMedia(opts, function(data) {
			if(data.code == 101) {
				//$scope.deleteMediaStart = false;
				$scope.viewalbum.splice(id, 1);
			} else {
				$scope.deleteMediaStart = false;
			}
		});
	};

	//Set as profile image
    $scope.setClubProfileImage = function(m_id, id){
        $("#featuredloaderlink-"+id).hide();
        $("#featuredloader-"+id).show();
        $scope.featuredloader = true;
        var opts = {};
        opts.group_id = $scope.groupId;
        opts.session_id = APP.currentUser.id;
        opts.media_id = m_id;
        GroupService.setClubProfileImage(opts, function(data){
            if(data.code == 101) {
            	$scope.uploadSuccess = true;
                $scope.uploadSuccessMsg = $scope.i18n.albums.update_sucess;
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.uploadSuccessMsg = '';
                }, 2000);
                var imageData = data.data;
                $scope.$broadcast('updateClubProfileCover', imageData);
            } else {
            	$scope.uploadError = true;
            	$scope.uploadSuccessMsg = $scope.i18n.albums.not_success_update;
                $("#featuredloaderlink-"+id).show();
                $("#featuredloader-"+id).hide();
                $timeout(function() {
                        $scope.uploadSuccessMsg = "";
                }, 2000);
            }
        });  
    }
    //// start code for club album /////
     //calling function to load postlist
        //$scope.showUserPostList();
        $scope.averageVoting = 0;
        $scope.vote_count = 0;
        $scope.waitRateResponse = false;
        $scope.ratePost = function(rating, id, index){
            var update = "";
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club_album_photo";
            opts.type_id = id;
            opts.rate = rating;
            $scope.waitRateResponse = true;
            if($scope.viewalbum[index].is_rated){
                update = "update";
            }else{
                update = "add";
            }
            waitRequest = ProfileService.rateThis(opts, update, function(data){
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.viewalbum[index].avg_rate = data.data.avg_rate;
                    $scope.viewalbum[index].no_of_votes = data.data.no_of_votes;
                    $scope.viewalbum[index].is_rated = true;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    //$scope.userPostList[index].avg_rate = 0;
                    //$scope.userPostList[index].no_of_votes = 0;
                    $scope.viewalbum[index].is_rated = false;
                    $scope.viewalbum[index].current_user_rate = 0;
                }
                $scope.waitRateResponse = false;
            });
        };

        $scope.WaitDeleteResponse = false;
        $scope.removeRating = function(id, index){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club_album_photo";
            opts.type_id = id;
            if($scope.WaitDeleteResponse === false){
                $scope.WaitDeleteResponse = true;
                $scope.waitRateResponse = true;
            }else{
                return;
            }
            ProfileService.removeRating(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.viewalbum[index].current_user_rate = 0;
                    $scope.viewalbum[index].is_rated = false;
                    $scope.viewalbum[index].no_of_votes = data.data.no_of_votes;
                    $scope.viewalbum[index].avg_rate =  data.data.avg_rate;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    $scope.viewalbum[index].current_user_rate = 0;
                    $scope.viewalbum[index].is_rated = false;
                    //$scope.userPostList[postIndx].no_of_votes =0;
                    //$scope.userPostList[postIndx].avg_rate =  0;
                }
                $scope.WaitDeleteResponse = false;
                $scope.waitRateResponse = false;
            });
        };


        $scope.stars = [];

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
                        template: '<style>.modal-body.tag-frnd-modal ul li{padding:8px 130px 8px 0}.modal-content .modal-body ul.rmv-tag{position:absolute;right:0;top:10px}.modal-content .modal-body ul.rmv-tag li{padding:0;display:inline-block;vertical-align:middle;border:0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) no-repeat;display:block}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:23px;height:21px;margin-left:2px;background:url(app/assets/images/rating-star.png) 0 -21px no-repeat;display:block}.modal.in .modal-dialog{margin:auto;top:0;bottom:0;left:0;right:0;position:absolute}.modal-body.tag-frnd-modal{height:360px;overflow-y:auto;overflow-x:hidden;padding:0 10px}.modal .modal-content{margin:auto;height:400px;top:0;bottom:0;left:0;right:0;position:absolute;overflow:visible}@media screen and (max-width:479px){.modal.in .modal-dialog{margin:auto 20px}.modal-body.tag-frnd-modal ul li{padding:8px 70px 8px 0}.modal-content .modal-body ul.rmv-tag li span.votes-avg{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 0/12px no-repeat}.modal-content .modal-body ul.rmv-tag li span.votes-blank{width:12px;height:10px;margin-left:1px;background:url(app/assets/images/rating-star.png) 0 -11px/12px no-repeat}}</style><div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div></div><div class="modal-body tag-frnd-modal"><ul ng-hide="showPeopleLoader"><li data-ng-repeat="friend in ratedUsers"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a ng-href="#/viewfriend/{{friend.id}}">{{friend.first_name}} {{friend.last_name}}</a><span class="frnd-details"><a href>{{friend.about_me}}</a></span></span><ul class="rmv-tag"><li data-ng-repeat="avgRate in averageRating(friend.rate) track by $index"><span ng-class="friend.rate % 1 == 0 ?\'votes-avg\': ($last ? \'half-avg\':\'votes-avg\')" /></li><li ng-repeat="blank in blankStar(friend.rate) track by $index"><span class="votes-blank"/> </li></ul></li></ul> <div ng-show="showPeopleLoader"><img titile="" alt="" src="app/assets/images/proceed.gif"></div></div><div class="modal-footer"></div>',
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
        };
    ///  end code for club rating  /////


}]);
