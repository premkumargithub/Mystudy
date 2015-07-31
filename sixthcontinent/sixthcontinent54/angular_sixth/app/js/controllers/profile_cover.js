app.controller('UserCoverProfileController', ['$cookieStore', '$rootScope', '$scope', '$route', '$http', '$location', '$timeout', '$interval', '$routeParams', 'fileReader', 'ProfileService', 'AffiliatedkService','TranslationService', function($cookieStore, $rootScope, $scope, $route, $http, $location, $timeout, $interval, $routeParams, fileReader, ProfileService, AffiliatedkService, TranslationService) {
	$scope.coverImageUploadStart = false;
	$rootScope.timelineActive = 'profiles';
	var activeUrl = $location.path().replace("/", "");
    if (activeUrl.indexOf("album/images") != -1) { 
        activeUrl = 'album';
    }   
    if (activeUrl.indexOf("timeline") != -1) { 
        activeUrl = 'timeline';
    } 
    if(!$scope.i18n.storealbum){
        TranslationService.getTranslationWithCallback($scope, $scope.activeLanguage, function(data){
           $scope.i18n = data; 
           $scope.invalidCoverImageMgs = $scope.i18n.storealbum.album_invalidCoverImageMgs;
        });
    }else{
        $scope.invalidCoverImageMgs = $scope.i18n.storealbum.album_invalidCoverImageMgs;
    }

    $scope.imageCropResult = null;
    $scope.imageCropResult2 = null;
    $scope.imageWidth = null;
    $scope.imageHeight = null;
    $scope.showImageCropper = false;
    $scope.showImageCropper2 = false;
    $scope.imageString = "";
    $scope.file ={};
    $scope.coverLoadHide = false;
    
	switch(activeUrl) {
        case 'wallets' :  
        $rootScope.timelineActive = 'wallets'; break;
		case 'friends' :  
		$rootScope.timelineActive = 'friends'; break;
		case 'album' :  
		$rootScope.timelineActive = 'album'; break;
        case 'myclubs' :  
        $rootScope.timelineActive = 'club'; break; 
		case 'club' :  
		$rootScope.timelineActive = 'club'; break;
        case 'timeline' :  
		$rootScope.timelineActive = 'timeline'; break;
		case 'shope' :  
		$rootScope.timelineActive = 'shope'; break;
        case 'myshops/1' :  
        $rootScope.timelineActive = 'shope'; break;
        case 'myshops/2' :  
        $rootScope.timelineActive = 'shope'; break;
        case 'about' :  
        $rootScope.timelineActive = 'about'; break;
        case 'profiles' :  
        $rootScope.timelineActive = 'profiles'; break;
        case 'profiles/'+ APP.profileType.brokerProfile :  
        $rootScope.timelineActive = 'profiles'; break;
        case 'profiles/'+ APP.profileType.citizenProfile :  
        $rootScope.timelineActive = 'profiles'; break;
        case 'followers' :  
        $rootScope.timelineActive = 'more'; break;
        case 'citizen/affiliates' :
        $rootScope.timelineActive = 'more'; break;
        case 'broker/affiliates' :
        $rootScope.timelineActive = 'more'; break;
        case 'shop/affiliates' :
        $rootScope.timelineActive = 'more'; break;
        case 'followings' :  
        $rootScope.timelineActive = 'more'; break;
		default : 
		$rootScope.timelineActive = 'profiles';
	}

    $scope.imageXPosition = 0;
    $scope.imageYPosition = 0;
    $scope.setImageCordinate = function(){
        $scope.imageXPosition = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord; 
        $scope.imageYPosition = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord;
        $scope.saveCordinate();
    };

    $scope.showCanves = false;
    $scope.repositionImage = function(){
        $scope.showCanves = true;
        $scope.fileUrl = $rootScope.currentUser.basicProfile.profile_cover_img.thumb;
        $scope.imageXPosition = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord * -1;
        $scope.imageYPosition =  $rootScope.currentUser.basicProfile.profile_cover_img.y_cord * -1;
        $scope.coverLoadHide = true;
    };

    $scope.showcrossactive = true;
    $scope.showcrossactive1 = function(){
        $scope.showcrossactive = false;
    };

    $scope.myFile = '';
    $scope.invalidCoverImage = false;
    $scope.getFile = function () { 
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.readImage($scope.myFile, function(data){
                if(data.length != 0 && data.width >= 910 && data.height >= 400){
                    $scope.uploadProfileCover(); 
                }
                else { 
                    $("#invalidCoverImage").show();
                    $timeout(function(){
                        $("#invalidCoverImage").hide();
                    }, 2000);
                }
            });
        });
    };

    
    //function to check upload image dimenstions
    $scope.readImage = function(file, callback) {
        var reader = new FileReader();
        var image  = new Image();
        reader.readAsDataURL(file);  
        reader.onload = function(_file) {
            var filedata = {};
            image.src    = _file.target.result;
            image.onload = function() {
                var w = this.width,
                    h = this.height,
                    t = file.type,                     
                    n = file.name,
                    s = ~~(file.size/1024) +'KB';
                    $scope.imageWidth = this.width;
                    $scope.imageHeight = this.height;
                    filedata['width'] = w;
                    filedata['height'] = h;
                    callback(filedata);
            };
            image.onerror= function() {
                callback(filedata);
            };      
        };
    }

    $scope.newImage = false;
    $scope.uploadProfileCover = function() {
        $scope.showCoverOption = false; 
    	$scope.coverImageUploadStart = true;
    	var opts = {};
    	opts.user_id = APP.currentUser.id;
    	opts.user_media = $scope.myFile;
        opts.base_64_data = $scope.imageString;
        $scope.fileUrl = "";
        $scope.showCanves = true;
    	ProfileService.uploadCoverPhoto(opts, $scope.myFile, function(data) {
    		if(data.code == '101') {
                $rootScope.currentUser.basicProfile.profile_cover_img.original = data.data.user_info.cover_image;
                $rootScope.currentUser.basicProfile.profile_cover_img.thumb = data.data.user_info.cover_image_thumb;
                $scope.coverImageUploadStart = false;
                $scope.fileUrl = data.data.user_info.cover_image_thumb;
                $scope.newImage = true;
                $rootScope.currentUser.basicProfile.profile_cover_img.media_id =  data.data.user_info.media_id
                $scope.showCanves = true;
                $scope.coverLoadHide = true;
    		} else {
                $scope.coverImageUploadStart = false;
                $scope.coverLoadHide = true;
                $scope.showCanves = true;
    		}
    	});
    }

    //Get Affilicate counts
    $scope.getAffiliateCounts = function() {  
        var opts = {};
        opts.user_id = APP.currentUser.id;   
        opts.session_id = APP.currentUser.id; 
        AffiliatedkService.getAllcounts(opts, function(data) {
            if(data.code == 101) {
                $scope.totalCounts = data.data;
            } 
        });
    };
    
    $scope.getAffiliateCounts();
    var img  = new Image();
    $scope.saveCordinate = function(){
        /*$rootScope.currentUser.basicProfile.profile_cover_img.x_cord = $scope.imageXPosition * -1;
        $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = $scope.imageYPosition * -1;*/
        //$scope.coverLoadHide = false;
        $scope.hideUpdateCoverButton = true;
        $scope.showCanves = false;
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.media_id = $rootScope.currentUser.basicProfile.profile_cover_img.media_id;
        opts.session_id = APP.currentUser.id;
        opts.x = ""+($rootScope.currentUser.basicProfile.profile_cover_img.x_cord * -1)+"";
        opts.y = ""+($rootScope.currentUser.basicProfile.profile_cover_img.y_cord * -1)+"";
        ProfileService.sendMediaCoordinate(opts,function(data){
            if(data.code == 101 && data.message == "SUCCESS"){  
                $scope.coverLoadHide = false;
                $scope.file = null;
                $scope.fileUrl = null;
                $scope.hideUpdateCoverButton = false;
                $scope.showCoverOption = false;
                $scope.showCanves = false;
                $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = data.data.x_cord ;
                $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = data.data.y_cord ;
                if($rootScope.mobileView == true){
                    img = null;
                    img = new Image();
                    img.src = $rootScope.currentUser.basicProfile.profile_cover_img.thumb;
                    if($scope.windowWidth <= "480"){
                        img.onload = function(){
                            if(img.width <= 910){
                                if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord != ""){
                                    if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord > 100){
                                        $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 3;
                                    }else{
                                        $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 4;
                                    }
                                    $rootScope.mobileX_Cord = 0;
                                }else{
                                    $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                                    $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                                    $rootScope.mobileX_Cord = 0;
                                    $rootScope.mobileY_Cord = 0;
                                }
                            }else if(img.width > 910 && img.width <= 1300){
                                if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                                    if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 4;
                                    }else{
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 5;
                                    }
                                    $rootScope.mobileY_Cord = 0;
                                }else{
                                    $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                                    $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                                    $rootScope.mobileX_Cord = 0;
                                    $rootScope.mobileY_Cord = 0;
                                }
                            }else if(img.width > 1300){
                                if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                                    if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 5;
                                    }else{
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 6;
                                    }
                                    $rootScope.mobileY_Cord = 0;
                                }else{
                                    $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                                    $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                                    $rootScope.mobileX_Cord = 0;
                                    $rootScope.mobileY_Cord = 0;
                                }
                            }
                        }
                    }else if($scope.windowWidth > '480' && $scope.windowWidth <= '768'){
                        img.onload = function(){
                            if(img.width <= 910){
                                if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord != ""){
                                    if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord > 100){
                                        $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 1.80;
                                    }else{
                                        $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 2;
                                    }
                                    $rootScope.mobileX_Cord = 0;
                                }else{
                                    $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                                    $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                                    $rootScope.mobileX_Cord = 0;
                                    $rootScope.mobileY_Cord = 0;
                                }
                            }else if(img.width > 910 && img.width <= 1300){
                                if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                                    if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.00;
                                    }else{
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.20;
                                    }
                                    $rootScope.mobileY_Cord = 0;
                                }else{
                                    $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                                    $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                                    $rootScope.mobileX_Cord = 0;
                                    $rootScope.mobileY_Cord = 0;
                                }
                            }else if(img.width > 1300){
                                if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                                    if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.80;
                                    }else{
                                        $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 3.00;
                                    }
                                    $rootScope.mobileY_Cord = 0;
                                }else{
                                    $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                                    $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                                    $rootScope.mobileX_Cord = 0;
                                    $rootScope.mobileY_Cord = 0;
                                }
                            }
                        }
                    }
                }
                
            }
        });
    };

    $scope.showCoverOption = false;
    $scope.showCoverDropDown = function($event){
        $scope.showCoverOption = !$scope.showCoverOption;
        $event.stopPropagation();
    };

    window.onclick = function() {
        $timeout(function(){
            if ($scope.showCoverOption) {
                $scope.showCoverOption = false;
                $scope.$apply();
            }
        },100);
    };

    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth = newValue.w;
        if($scope.windowWidth <= '768'){
            if($rootScope.mobileView == true){
                $timeout(function(){
                    $scope.changeCordinatevalue(); 
                },1000);
            };
            $rootScope.mobileView = true; //declare in main controller
        } else {
            $rootScope.mobileView = false; //declare in main controller
        }
    }, true);
    $scope.changeCordinatevalue = function(){
        if($rootScope.currentUser !== undefined){
            img = null;
            img = new Image();
            img.src = $rootScope.currentUser.basicProfile.profile_cover_img.thumb;
            if($scope.windowWidth <= '480'){
                img.onload = function(){
                    if(img.width <= 910){
                        if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord != ""){
                            if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord > 100){
                                $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 3;
                            }else{
                                $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 4;
                            }
                            $rootScope.mobileX_Cord = 0;
                        }else{
                            $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                            $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                            $rootScope.mobileX_Cord = 0;
                            $rootScope.mobileY_Cord = 0;
                        }
                    }else if(img.width >= 910 && img.width <= 1300){
                        if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                            if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 4;
                            }else{
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 5;
                            }
                            $rootScope.mobileY_Cord = 0;
                        }else{
                            $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                            $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                            $rootScope.mobileX_Cord = 0;
                            $rootScope.mobileY_Cord = 0;
                        }
                    }else if(img.width > 1300 ){
                        if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                            if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 5;
                            }else{
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 6;
                            }
                            $rootScope.mobileY_Cord = 0;
                        }else{
                            $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                            $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                            $rootScope.mobileX_Cord = 0;
                            $rootScope.mobileY_Cord = 0;
                        }
                    }
                }
            }else if($scope.windowWidth > '480' && $scope.windowWidth <='768'){
                img.onload = function(){
                    if(img.width <= 910){
                        if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord != ""){
                            if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord > 100){
                                $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 1.80;
                            }else{
                                $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 2;
                            }
                            $rootScope.mobileX_Cord = 0;
                        }else{
                            $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                            $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                            $rootScope.mobileX_Cord = 0;
                            $rootScope.mobileY_Cord = 0;
                        }
                    }else if(img.width > 910 && img.width < 1300){
                        if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                            if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.00;
                            }else{
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.20;
                            }
                            $rootScope.mobileY_Cord = 0;
                        }else{
                            $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                            $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                            $rootScope.mobileX_Cord = 0;
                            $rootScope.mobileY_Cord = 0;
                        }
                    }else if(img.width > 1300){
                        if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
                            if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.80;
                            }else{
                                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 3.00;
                            }
                            $rootScope.mobileY_Cord = 0;
                        }else{
                            $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
                            $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
                            $rootScope.mobileX_Cord = 0;
                            $rootScope.mobileY_Cord = 0;
                        }
                    }
                }
            }
        }
    };
}]);	
	