app.controller('FriendController', ['$cookieStore', '$rootScope', '$scope', '$http', '$location', '$timeout', '$routeParams', 'MessageService', 'ProfileService', 'fileReader', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $routeParams, MessageService, ProfileService, fileReader) {
	$scope.frieandListObject = [];    
	$scope.friendAllList = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
    $scope.albloader = false;
	$scope.friendListLoader = false;
    $scope.resultNotFound = false;
    $scope.getAllFriend = function() {
        var opts = {};
        var limit_start = $scope.friendAllList.length;
        opts.friend_name = ($scope.friendName === undefined) ? '' : ($scope.friendName);
        opts.user_id = APP.currentUser.id;
        opts.session_id = APP.currentUser.id; 
        opts.limit_start = limit_start;
        opts.limit_size =  APP.friend_list_pagination.end;
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.friendListLoader = true;
            $scope.allRes = 0;
            MessageService.searchFriends(opts, function(data) {
                $scope.allRes = 1;
            	if(data.code == '101') {
                    $scope.totalSize = data.data.count;
            		$scope.friendListLoader = false;
                    $scope.frieandListObject =  $scope.friendAllList = $scope.friendAllList.concat(data.data.users);
                } else {
                    $scope.friendListLoader = false;
                    $scope.resultNotFound = true;
                }
            });
        }
    }

    $scope.getAllFriend();

    $scope.allList = function() {
        $scope.frieandListObject = [];
        $scope.friendAllList = [];
        $scope.friendName = '';
        $scope.getAllFriend();
    };

    $scope.loadMore = function() {
        $scope.getAllFriend();
    };

    var key_count_global = 0;
    $scope.searchFriend = function(e) {
        if(e.keyCode == 8){
            $timeout(function(){
                $scope.lookup(key_count_global);
            },500, false);
        }else{
            $scope.frieandListObject = [];
            $scope.friendAllList = [];
            $scope.getAllFriend();
        }
    };

    $scope.lookup = function(keycount){
        if(key_count_global == keycount){
            $scope.frieandListObject = [];
            $scope.friendAllList = [];
            $scope.getAllFriend();
        }
    };
    /*$scope.focusOnInput = function(){
        $('html').keyup(function(e){
            if(e.keyCode == 8 && $scope.friendName.trim() == ''){
                $scope.frieandListObject = [];
                $scope.friendAllList = [];
                $scope.getAllFriend();
            }    
        });
    };*/
}]);

//Frined cover page controller
app.controller('FriendCoverProfileController', ['$cookieStore', '$rootScope', '$scope', '$route', '$http', '$location', '$timeout', '$interval', '$routeParams', 'fileReader', 'ProfileService', 'saveFriendDate' ,'UserService', function($cookieStore, $rootScope, $scope, $route, $http, $location, $timeout, $interval, $routeParams, fileReader, ProfileService, saveFriendDate, UserService) {
    
   $scope.RespontToRequest_personal = function(){
        $("#RespontToRequest_personal").click(function(e){
            e.stopPropagation();
            $(".request-links-professional").hide();
            $(".request-links-personal").slideToggle('slow');
        });
   };

   $scope.RespontToRequest_professional = function(){
        $("#RespontToRequest_professional").click(function(e){
            e.stopPropagation();
            $(".request-links-personal").hide();
            $(".request-links-professional").slideToggle('slow');
        });
   };
   $(document).click(function(){
         $(".request-links-personal").hide();
         $(".request-links-professional").hide();
   });


    $rootScope.friendlineActive = 'about';
    var str = $location.path().replace("/", "");
    if(str.split('/', 1)[0] != 'viewfriend') {
        $scope.friendDetailId = str.split('/', 1)[0];
    }else {
        $scope.friendDetailId = str.split('/', 2)[1];
    }

    var activeUrl = str.substring(str.lastIndexOf('/')+1);
    if (str.indexOf("friend/images") != -1) { 
        activeUrl = 'pictures';
    }
    switch(activeUrl) {
        case 'friends' :  
        $rootScope.friendlineActive = 'friends'; break;
        case 'album' :  
        $rootScope.friendlineActive = 'album'; break;
        case 'clubs' :  
        $rootScope.friendlineActive = 'club'; break;
        case 'shope' :  
        $rootScope.friendlineActive = 'shope'; break;
        case 'about' :  
        $rootScope.friendlineActive = 'about'; break;
        case 'pictures' :  
        $rootScope.friendlineActive = 'pictures'; break;
        default : 
        $rootScope.friendlineActive = 'timeline';
    }

    $scope.friendViewLoader = true;
    $scope.sendFriendRequestLoader = false;
    $scope.showRequestButton = false;
    $scope.addFriend_personal    = false;
    $scope.requestSent_personal  = false;
    $scope.IsFriend_personal     = false;
    $scope.respond_personal      = false;
    $scope.addFriend_professional    = false;
    $scope.requestSent_professional  = false;
    $scope.IsFriend_professional     = false;
    $scope.respond_professional      = false;
    $scope.sendPersonalRequestLoader = false;
    $scope.sendProfessionalRequestLoader = false;
    
    $scope.RejectRequest = function(request_type) {
        if(request_type === 1){
            $scope.sendPersonalRequestLoader = true;
        }else if(request_type === 2){
            $scope.sendProfessionalRequestLoader = true;
        }
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $scope.friendDetailId;
        opts.action = '0';
        opts.request_type = request_type; 
        ProfileService.rejectFriendRequest(opts, function(data) {
            if(data.code == 101) {
                if(request_type === 2){
                    $scope.addFriend_professional   = true;
                    $scope.respond_professional = false;
                    $scope.sendProfessionalRequestLoader = false;
                }else if(request_type === 1){
                    $scope.addFriend_personal   = true;
                    $scope.respond_personal = false;
                    $scope.sendPersonalRequestLoader = false;
                }
                //$rootScope.getCountOfAllTypeNotificaton();
                $rootScope.getAllFriendNotification();
            } else {
                
            }
        });
    };
    
    $scope.AcceptRequest = function(request_type) {
        if(request_type === 1){
            $scope.sendPersonalRequestLoader = true;
        }else if(request_type === 2){
            $scope.sendProfessionalRequestLoader = true;
        }
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $scope.friendDetailId;
        opts.action = "1";
        opts.request_type = request_type; 
        ProfileService.acceptFriendRequest(opts, function(data) {
            if(data.code == 101) {
                if(request_type === 2){
                    $scope.IsFriend_professional   = true;
                    $scope.respond_professional = false;
                    $scope.sendProfessionalRequestLoader = false;
                }else if(request_type === 1){
                    $scope.IsFriend_personal   = true;
                    $scope.respond_personal = false;
                    $scope.sendPersonalRequestLoader = false;
                }
                //$rootScope.getCountOfAllTypeNotificaton();
                $rootScope.getAllFriendNotification();
            } else {
                
            }
        });
    };

    $scope.addFriend = function(type){
        var friendType;
        var opts = {};
            opts.user_id    = APP.currentUser.id;
            opts.friend_id  = $scope.friendDetailId
            opts.msg        = "Friend Request";
        
        if(type ===  1){
            opts.request_type = 1;
            $scope.sendPersonalRequestLoader = true;
        }else if(type ===  2){
            opts.request_type = 2;
            $scope.sendProfessionalRequestLoader = true;
        }
        ProfileService.sendFriendRequests(opts, function(data) {
            if(data.code == 101 || (data.code == 100 && data.message === "FRIEND_REQUEST_HAS_ALREADY_RECEIVED")){
                $scope.friendProfile.is_friend = 2;
                $scope.sendFriendRequestLoader = false;
                if(type === 2){
                    $scope.friendProfile.user_info.professional_pending = 1;
                    $scope.addFriend_professional   = false;
                    $scope.requestSent_professional   = true;
                    $scope.sendProfessionalRequestLoader = false;
                }else if(type === 1){
                    $scope.friendProfile.user_info.personal_pending = 1;
                    $scope.addFriend_personal   = false;
                    $scope.requestSent_personal   = true;
                    $scope.sendPersonalRequestLoader = false;
                }
            }else if(data.code == 109){
                $scope.friendProfile.is_friend = 2;
                $scope.sendFriendRequestLoader = false;
                $scope.friendProfile.is_sent = 1;
                $scope.sendProfessionalRequestLoader = false;
                $scope.sendPersonalRequestLoader = false;
            }
        });
    };

    $scope.removeFriend = function(friendDetail,type) { 
        $scope.sendFriendRequestLoader = true;
        var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.friend_id = friendDetail.user_id;
            opts.action = "0";
            opts.request_type = type;
        if(type === 1){
            $scope.sendPersonalRequestLoader = true;
        }else if(type === 2){
            $scope.sendProfessionalRequestLoader = true;
        }
        ProfileService.rejectFriendRequest(opts, function(data) {
            if(data.code == 101 || (data.code == 113 && data.message === "FRIEND_REQUEST_HAS_ALREADY_REMOVED")) {
                $scope.sendFriendRequestLoader = false;
                if(type === 2){
                    $scope.friendProfile.user_info.friend_type = $scope.friendProfile.user_info.friend_type - 2;
                    $scope.sendProfessionalRequestLoader = false;
                    $scope.addFriend_professional = true;
                    $scope.IsFriend_professional =false;
                }else if(type === 1){
                    $scope.friendProfile.user_info.friend_type = $scope.friendProfile.user_info.friend_type - 1;
                    $scope.sendPersonalRequestLoader = false;
                    $scope.addFriend_personal = true;
                    $scope.IsFriend_personal=false;
                }
                if($scope.friendProfile.user_info.friend_type === 0){
                    $scope.friendProfile.is_friend =  0;
                }
            } else {
                $scope.friendProfile.is_friend = 0;
                $scope.sendFriendRequestLoader = false;
            }
        });
    };
    
    $scope.friendRequestStatus = function (){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $scope.friendDetailId
        ProfileService.friendRequestStatus(opts, function(data) {
            if(data.code == 101) {
                if(data.data.personal.is_friend == 0 && data.data.personal.is_sent == 0 && data.data.personal.is_respond == 0){
                    $scope.addFriend_personal   = true;
                }
                if(data.data.professional.is_friend == 0 && data.data.professional.is_sent == 0 && data.data.professional.is_respond == 0){
                    $scope.addFriend_professional   = true;
                }
                if(data.data.personal.is_sent == 1){
                    $scope.requestSent_personal   = true;
                }
                if(data.data.professional.is_sent == 1){
                    $scope.requestSent_professional   = true;
                }
                if(data.data.personal.is_friend == 1){
                    $scope.IsFriend_personal   = true;
                }
                if(data.data.professional.is_friend == 1){
                    $scope.IsFriend_professional   = true;
                }
                if(data.data.personal.is_respond == 1){
                    $scope.respond_personal   = true;
                }
                if(data.data.professional.is_respond == 1){
                    $scope.respond_professional   = true;
                }

            }
        });    
    };
    $scope.friendRequestStatus(); 
    $scope.skillobj = [];
    $scope.viewFriendProfile = function() {
        $scope.searchFrind = '';
        $('#search').val('');
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $scope.friendDetailId
        ProfileService.friendProfileView(opts, function(data) {
            $scope.showRequestButton = true;
            if(data.code == 101) {
                $scope.getTotalIncome();
                if(data.data.user_id == APP.currentUser.id) {
                    $location.path('timeline/'+data.data.user_id);
                }
                $scope.friendProfile = data.data;
                if($rootScope.mobileView == true){
                    $scope.changeCordinatevalue();
                }
                for(var i =0; i<=11 ; i++){
                    if(data.data.user_info.date_of_birth != null) {
                        if(data.data.user_info.date_of_birth.date.substring(5,7) == i){     
                            $scope.birthmonth = $scope.months[i-1].name; 
                        }
                    }else{
                        $scope.birthmonth = '';
                        $scope.comma = '';
                    }
                }
                if(data.data.user_info.skills !== null && data.data.user_info.skills.length > 0){
                    $scope.tempskills = data.data.user_info.skills.split(',');
                }
                if(data.data.user_info.skills !== null && data.data.user_info.skills.length > 0){     
                    for(var i=0;i<$scope.tempskills.length;i++) {
                        $scope.tempobj={"name":$scope.tempskills[i] };
                        $scope.skillobj.push($scope.tempobj);
                    }
                }
                $scope.personaledu = false;
                $scope.professionedu = false;
                $scope.personaljob = false;
                $scope.professionjob = false;
                if($scope.friendProfile.user_info.educationDetail != null && $scope.friendProfile.user_info.educationDetail != "" && $scope.friendProfile.user_info.educationDetail != undefined){
                    for(var i=0; i<$scope.friendProfile.user_info.educationDetail.length; i++){
                        if($scope.friendProfile.user_info.educationDetail[i].visibility_type == 1 || $scope.friendProfile.user_info.educationDetail[i].visibility_type == 3){
                            $scope.personaledu = true;
                        }
                        if($scope.friendProfile.user_info.educationDetail[i].visibility_type == 2 || $scope.friendProfile.user_info.educationDetail[i].visibility_type == 3){
                            $scope.professionedu = true;
                        }
                    }
                }
                if($scope.friendProfile.user_info.jobDetails != null && $scope.friendProfile.user_info.jobDetails != "" && $scope.friendProfile.user_info.jobDetails != undefined){
                    for(var i=0; i<$scope.friendProfile.user_info.jobDetails.length; i++){
                        if($scope.friendProfile.user_info.jobDetails[i].visibility_type == 1 || $scope.friendProfile.user_info.jobDetails[i].visibility_type == 3){
                            $scope.personaljob = true;
                        }
                        if($scope.friendProfile.user_info.jobDetails[i].visibility_type == 2 || $scope.friendProfile.user_info.jobDetails[i].visibility_type == 3){
                            $scope.professionjob = true;
                        }
                    }
                }
                var opts1 = {};
                opts1.sender_id = APP.currentUser.id;
                opts1.to_id = $scope.friendProfile.user_id;
                opts1.session_id = APP.currentUser.id;
                ProfileService.checkfollowUser(opts1, function(data1) {
                    if(data1.code == 151 || data1.is_follow == 1) {
                        $scope.followUser = false;
                    } 
                    if(data1.code == 152 || data1.is_follow == 0) {
                        $scope.followUser = true;
                    } 
                });

                //friend profile all details 
                var copts = {};
                var connectedProfile = {};
                copts.user_id = $scope.friendDetailId;
                copts.session_id = APP.currentUser.id; 
                ProfileService.getConnectedProfil(copts, function(data) {
                    if(data.code = 101)
                        $scope.friendProfile.connectedProfile = data.data;
                    $scope.friendViewLoader = false;
                });
            }else {
                $scope.friendViewLoader = false;
            }
        });
    };
    $scope.showButton = false;
    $scope.pause = false
    $('body').click(function(){
        if($scope.showButton == true && $scope.pause == false && $rootScope.mobileView == true){
            $scope.showButton = false;
        }
    })

    $scope.toogleImage = function(){
        if($scope.showButton === false){
            $scope.showButton = true;
            $scope.pause = true;
            setTimeout(function() {$scope.pause = false}, 100);
        }else{
            $scope.showButton = false;
        }
    }

    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth = newValue.w;
        if($scope.windowWidth <= '600'){
            if($rootScope.mobileView == true){
                $timeout(function(){
                    $scope.changeCordinatevalue(); 
                },1000);
            };
            $rootScope.mobileView = true; //declare in main controller
        } else {
            $rootScope.mobileView = false; //declare in main controller
        }
        if($scope.windowWidth <= 768){
            $scope.showButton = false;
        }else{
            $scope.showButton = true;
        }
    }, true);
    var img = new Image();
    $scope.changeCordinatevalue = function(){
        if($scope.friendProfile != undefined){
            img = null;
            img = new Image();
            img.src = $scope.friendProfile.user_info.cover_image_thumb;
            img.onload = function(){
                if($scope.windowWidth <= '400'){
                    if(img.width <= 910){
                        if( $scope.friendProfile.user_info.y_cord != ""){
                            if( $scope.friendProfile.user_info.y_cord > 100){
                                $rootScope.friendMobileY_Cord = $scope.friendProfile.user_info.y_cord / 3;
                            }else{
                                $rootScope.friendMobileY_Cord = $scope.friendProfile.user_info.y_cord / 4;
                            }
                            $rootScope.friendMobileX_Cord = 0;
                        }else{
                            $scope.friendProfile.user_info.x_cord = 0;
                            $scope.friendProfile.user_info.y_cord = 0;
                            $rootScope.friendMobileX_Cord = 0;
                            $rootScope.friendMobileY_Cord = 0;
                        }
                    }else  if(img.width > 910 && img.width <= 1300){
                        if( $scope.friendProfile.user_info.cover_image_thumb.x_cord != ""){
                            if(  $scope.friendProfile.x_cord > 100){
                                $rootScope.friendMobileX_Cord =  $scope.friendProfile.user_info.x_cord / 4;
                            }else{
                                $rootScope.friendMobileX_Cord =  $scope.friendProfile.user_info.x_cord / 5;
                            }
                            $rootScope.friendMobileY_Cord = 0;
                        }else{
                            $scope.friendProfile.user_info.x_cord = 0;
                             $scope.friendProfile.user_info.y_cord = 0;
                            $rootScope.friendMobileX_Cord = 0;
                            $rootScope.friendMobileY_Cord = 0;
                        }
                    }else if(img.width > 1300 ){
                        if( $scope.friendProfile.user_info.cover_image_thumb.x_cord != ""){
                            if(  $scope.friendProfile.x_cord > 100){
                                $rootScope.friendMobileX_Cord =  $scope.friendProfile.user_info.x_cord / 5;
                            }else{
                                $rootScope.friendMobileX_Cord =  $scope.friendProfile.user_info.x_cord / 6;
                            }
                            $rootScope.friendMobileY_Cord = 0;
                        }else{
                            $scope.friendProfile.user_info.x_cord = 0;
                             $scope.friendProfile.user_info.y_cord = 0;
                            $rootScope.friendMobileX_Cord = 0;
                            $rootScope.friendMobileY_Cord = 0;
                        }
                    }
                }else if($scope.windowWidth > '400' && $scope.windowWidth <='600'){
                        if(img.width <= 910){
                        if(  $scope.friendProfile.user_info.y_cord != ""){
                            if(  $scope.friendProfile.user_info.y_cord > 100){
                                $rootScope.friendMobileY_Cord =  $scope.friendProfile.user_info.y_cord / 1.8;
                            }else{
                                $rootScope.friendMobileY_Cord =  $scope.friendProfile.user_info.y_cord / 2;
                            }
                            $rootScope.friendMobileX_Cord = 0;
                        }else{
                            $scope.friendProfile.user_info.x_cord = 0;
                            $scope.friendProfile.user_info.y_cord = 0;
                            $rootScope.friendMobileX_Cord = 0;
                            $rootScope.friendMobileY_Cord = 0;
                        }
                    }else if(img.width > 910 && img.width <= 1300){
                        if(  $scope.friendProfile.user_info.x_cord != ""){
                            if(  $scope.friendProfile.user_info.x_cord > 100){
                                $rootScope.friendMobileX_Cord = $scope.friendProfile.user_info.x_cord / 2.0;
                            }else{
                                $rootScope.friendMobileX_Cord = $scope.friendProfile.user_info.x_cord / 2.20;
                            }
                            $rootScope.friendMobileY_Cord = 0;
                        }else{
                            $scope.friendProfile.user_info.x_cord = 0;
                            $scope.friendProfile.user_info.y_cord = 0;
                            $rootScope.friendMobileX_Cord = 0;
                            $rootScope.friendMobileY_Cord = 0;
                        }
                    }else if(img.width > 1300){
                        if(  $scope.friendProfile.user_info.x_cord != ""){
                            if(  $scope.friendProfile.user_info.x_cord > 100){
                                $rootScope.friendMobileX_Cord = $scope.friendProfile.user_info.x_cord / 2.80;
                            }else{
                                $rootScope.friendMobileX_Cord = $scope.friendProfile.user_info.x_cord / 3.00;
                            }
                            $rootScope.friendMobileY_Cord = 0;
                        }else{
                            $scope.friendProfile.user_info.x_cord = 0;
                            $scope.friendProfile.user_info.y_cord = 0;
                            $rootScope.friendMobileX_Cord = 0;
                            $rootScope.friendMobileY_Cord = 0;
                        }
                    }
                }
            }
        }
    };
     $scope.getTotalIncome = function() {
        //get users credit and the total income 
            var opts4 = {};
            opts4.idcard = $scope.friendDetailId;
            UserService.getCreditAndIncome(opts4, function(data) {
                var currentCredit = {};
                if(data.code == 101) {
                    currentCredit.totalCredit = (data.data.saldoc/1000000) ;
                    currentCredit.totCreditMicro = (data.data.saldorm) + (data.data.saldorc) ;
                    currentCredit.totalIncome = data.data.tot_income;
                    currentCredit.totalIncomeShow = data.data.tot_income;
                    //currentCredit.totalIncome = ((data.data.saldorc+data.data.saldorm)/1000000);
                    $scope.creditAndIncome = currentCredit;
                }
                else{
                    $scope.creditAndIncome = data.data;
                }
            });
     };   
    $scope.followRequestLoader = false;
    $scope.followFriend = function(friendId) {
        $scope.followRequestLoader = true;
        var opts = {};
        opts.sender_id = APP.currentUser.id;
        opts.to_id = friendId;
        ProfileService.followUser(opts, function(data) {
            if(data.code == 101) {
                $scope.friendProfile.is_follow = 1;
                $scope.followUser = false;
                $scope.followRequestLoader = false;
            } 
        });
    };

    $scope.unFollowFriend = function(friendId) {
        $scope.followRequestLoader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = friendId;
        ProfileService.unFollowUser(opts, function(data) {
            if(data.code == 101) {
                $scope.friendProfile.is_follow = 0;
                $scope.followUser = true;
                $scope.followRequestLoader = false;
            }
        });
    };
    $scope.viewFriendProfile();

    $scope.storeFriendDate = function(detail){
        saveFriendDate.saveFriendObject(detail);
        $location.path('/message/'+ detail.user_info.id);
    };

}]);

//Frined cover page controller
app.controller('FriendFriendController', ['$cookieStore', '$rootScope', '$scope', '$route', '$http', '$location', '$timeout', '$interval', '$routeParams', 'MessageService', function($cookieStore, $rootScope, $scope, $route, $http, $location, $timeout, $interval, $routeParams, MessageService) {
    $scope.frieandListObject = [];    
    $scope.friendAllList = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
    $scope.friendListLoader = false;
    $scope.resultNotFound = false;
    $scope.getAllFriend = function() {
        var opts = {};
        var limit_start = $scope.friendAllList.length;
        opts.friend_name = ($scope.friendName === undefined) ? '' : ($scope.friendName);
        opts.user_id = $routeParams.id;
        opts.session_id = APP.currentUser.id;
        opts.limit_start = limit_start;
        opts.limit_size =  APP.friend_list_pagination.end;
        //console.log("Total= "+ $scope.totalSize + "start= "+ limit_start + "response= "+ $scope.allRes);
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.friendListLoader = true;
            $scope.allRes = 0;
            MessageService.searchFriends(opts, function(data) {
                $scope.allRes = 1;
                if(data.code == '101') {
                    $scope.totalSize = data.data.count;
                    $scope.friendListLoader = false;
                    $scope.frieandListObject =  $scope.friendAllList = $scope.friendAllList.concat(data.data.users);
                } else {
                    $scope.friendListLoader = false;
                    $scope.resultNotFound = true;
                }
            });
        }
    }

    $scope.getAllFriend();
    

    $scope.allList = function() {
        $scope.frieandListObject = [];
        $scope.friendAllList = [];
        $scope.friendName = '';
        $scope.getAllFriend();
    };

    $scope.loadMore = function() {
        $scope.getAllFriend();
    };

    var key_count_global = 0;
    $scope.searchFriend = function(e) {
        if(e.keyCode == 8){
            $timeout(function(){
                $scope.lookup(key_count_global);
            },500, false);
        }else{
            $scope.frieandListObject = [];
            $scope.friendAllList = [];
            $scope.getAllFriend();
        }
    };

    $scope.lookup = function(keycount){
        if(key_count_global == keycount){
            $scope.frieandListObject = [];
            $scope.friendAllList = [];
            $scope.getAllFriend();
        }
    };

    /*$scope.focusOnInput = function(){
        $('html').keyup(function(e){
            if(e.keyCode == 8 && $scope.friendName.trim() == ''){
                $scope.frieandListObject = [];
                $scope.friendAllList = [];
                $scope.getAllFriend();
            }    
        });
    };*/
}]);

//To display the friends clubs 
app.controller('FriendClubController', ['$scope', '$http', 'GroupService', '$routeParams', function ($scope, $http, GroupService, $routeParams) {
    $scope.createGroupData = {};
    $scope.clubMyList = [];
    $scope.userGroupList = [];
    $scope.myFrndRes = 1;
    $scope.totalSize = 0;
    $scope.myTotalSize = 0;
    $scope.noContent = false; 
    $scope.groupPublicActive = 'current';
    $scope.groupMyClubActive = '';
    $scope.isLoading = true;
    $scope.limitCheck = 65;
    $scope.firstPage = APP.group_pagination.end;
    $scope.itemsPerPage = APP.group_pagination.end;
    $scope.currentPage = 1;
    $scope.range = [];

    $scope.changePageMore = function(pageNo) {
        $scope.currentPage = pageNo;
        $scope.loadMore();
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
        $scope.loadMore();
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 1 ? "disabled" : "";
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalItems) {
            $scope.currentPage++;
        }
       $scope.loadMore();
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        $scope.getFriendGroup($scope.tab, $scope.itemsPerPage);
    };

    $scope.clubcheck = 0;
    $scope.getFriendGroup = function(tab, itemsPerPage){
        $scope.tab = tab;
        $scope.clubMyList = [];
        $scope.groupMyClubActive = 'current';
        $scope.groupPublicActive = '';
        var opts = {};
        
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $routeParams.id;
        opts.limit_start = limit_start;
        opts.limit_size = itemsPerPage;
        //calling the services to get the group list
        if ((($scope.myTotalSize > limit_start) || $scope.myTotalSize == 0 ) && $scope.myFrndRes == 1) {
            $scope.isLoading = true;
            $scope.myFrndRes = 0;
            GroupService.getUserFriendGroups(opts, function(data){
                if(data.code == 101) {
                    $scope.totalItems = data.data.size;
                    $scope.myTotalSize = data.data.size;
                    $scope.myFrndRes = 1; 
                    $scope.userGroupList =  $scope.clubMyList = data.data.groups;
                    $scope.totalItems = Math.ceil(data.data.size/itemsPerPage);
                    $scope.range = [];  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    }              
                    $scope.isLoading = false;
                    if ($scope.userGroupList.length == 0){
                        $scope.noContent = true; 
                    } 
                }
                else {
                    $scope.totalItems = 0;
                    $scope.myFrndRes = 1; 
                    $scope.isLoading = false;
                }
                
            });
        }; 
    };

    $scope.loadMore = function() { 
        if($scope.tab == 'myclub') {
            $scope.clubMyList = [];
            $scope.getFriendGroup($scope.tab, $scope.itemsPerPage);
        } else {
            $scope.clubMyList = [];
            $scope.getFriendGroup($scope.tab, $scope.itemsPerPage);
        }
    }

     $scope.getFriendGroup('myclub',$scope.itemsPerPage);

     //function to show two layout listing for the group
    $scope.listActive = 'active';
    $scope.changeView = function(layout){
        if(layout == 'grid'){
            $scope.gridActive = 'active'; 
            $scope.listActive = ''; 
        } else if(layout == 'list'){
            $scope.listActive = 'active'; 
            $scope.gridActive = '';
        }
    };

    $scope.joinPublicGroups =function(groupId){
        $("#groupjoing"+groupId).hide();
        $("#joinloader"+groupId).show();
        $scope.requestMessage = "";
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        GroupService.joinPublicGroup(opts, function(data){
            if(data.code == 101) {
                $("#requestsent"+groupId).show();
                $("#joinloader"+groupId).hide();
            } else if(data.code == 118){
                $("#requestpending"+groupId).show();
                $("#joinloader"+groupId).hide();
            }else {
                $("#groupjoing"+groupId).show();
                $("#joinloader"+groupId).hide();
            }
        });
    }

}]);

//To display the friends clubs 
app.controller('FriendShopController', ['$scope', '$http', 'GroupService', '$routeParams', function ($scope, $http, GroupService, $routeParams) {
    console.log("friend shope controller")
}]);

app.controller('FriendAlbumController', ['$scope', '$http', '$modal', 'AlbumService', '$routeParams', '$location', function($scope, $http, $modal, AlbumService, $routeParams ,$location) {
    $scope.listAlbum = [];
    $scope.totalSize = 0;
    $scope.allRes = 1;
    $scope.listload = false;
    $scope.tagged_photo = [];
    //Album Listing
    $scope.albumListing = function(type){
  
        $scope.noAlbums = false;
        if(type === 'listing') {
            $scope.albloader = false;
        } else {
            $scope.albloader = true;
        }

        var limit_start = $scope.listAlbum.length;
        $scope.user_id = $routeParams.id; 
        var opts = {};
            opts.user_id = $scope.currentUser.id;
            opts.friend_id = $scope.user_id;
            opts.limit_start = limit_start; 
            opts.limit_size = 12; 
            opts.friend_id = $routeParams.id;
            //console.log("limit"+limit_start+"total"+$scope.totalSizetotalSize+"all res"+$scope.totalSizeallRes);
         if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
                 $scope.listload = true;
                 $scope.allRes = 0;
                 AlbumService.albumListing(opts, function(data){
               if(data.code == 101) {
                    $scope.noAlbums = true;
                    $scope.albloader = false;
                    $scope.allRes = 1;
                    $scope.listAlbum = $scope.listAlbum.concat(data.data.albums); 
                    $scope.tagged_photo_available = data.data.tagged_photo;
                    if ($scope.tagged_photo_available && $scope.tagged_photo_available.album_name === "Photo Of You"){
                        var opts = {}
                        opts.user_id = $routeParams.id;
                        opts.session_id = APP.currentUser.id;
                        opts.limit_start = 0; 
                        opts.limit_size = 12; 
                        AlbumService.getTaggedPhoto(opts,function(data){
                            $scope.tagged_photo = data.data;
                        })
                    }
                    $scope.totalSize = data.data.size;
                    $scope.listload = false; 
                }else {
                    $scope.albloader = false;
                    $scope.listload = false;  
                }
            });
        }
    }

    $scope.imageModal = function(index, photos){
        $scope.index = index;
        $scope.photos = photos;
        $scope.pre_visible = true;
        $scope.loader = false;
        $scope.next_visible = true;
        if(index === 0) $scope.pre_visible = false;
        if((photos.length-1)=== index) $scope.next_visible = false;
        var modalInstance = $modal.open({
            template: '<style>.modal-content img.tag-imgae{max-height: 100%;max-height: 100%;position: absolute;right: 0;left: 0;top: 0;bottom: 0;margin: auto}.modal.in .modal-dialog{max-width: 80%;margin: auto;height: 90%;left: 0;right: 0;top: 0;bottom: 0;position: absolute}.modal .modal-content{border: none;height: 100%}.modal-img-inner{background: #000;height: 100%}.modal-img-tag-desc .modal-tag-frnds-input input[type="text"]{width: auto;background: none;border: 1px solid #666;color: #aaa;padding: 5px 10px;box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;-moz-box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;-webkit-box-shadow: rgb(204, 204, 204) 0px 0px 1px 0px !important;}.modal-img-tag-desc{padding: 10px; z-index: 8042;}.modal.in .modal-dialog .fancybox-wrap{position: relative}.modal-img-tag-desc{background-color: rgba(0, 0, 0, .8);width: 100%;position:absolute;bottom: 0}.modal-img-tag-desc > span{display: inline-block;vertical-align: middle}.modal-img-tag-desc span.tag-list-block .tag-friends{display: inline-block;vertical-align: middle;margin: 0 0px 0 5px;background: rgba(255, 255, 255, .2);color: #fff;padding: 4px 6px;font-size: 12px;font-weight: 400;border-radius: 3px}.modal-img-tag-desc span.tag-list-block .tag-friends b{margin-left: 5px}.modal-content .modal-img-tag{font-weight: bold;position: absolute;top: 10px;right: 10px;background: #fff;padding: 4px 8px;-webkit-border-radius: 2px;-moz-border-radius: 2px;-ms-border-radius: 2px;-o-border-radius: 2px;border-radius: 2px;box-shadow:0px 0px 2px 1px #ddd;-moz-box-shadow:0px 0px 2px 1px #ddd;-webkit-box-shadow:0px 0px 2px 1px #ddd;z-index: 8042;}.modal-content .modal-img-tag img{width: 15px;height: auto; margin: 0 0 0 5px;}</style><div class="modal-img-inner"><img src="'+photos[index].media_path+'" class="tag-imgae"><div class="slide-contros"><a data-ng-show="pre_visible" data-ng-click="pre_image(index,photos)" class="pre slide-btn" href><span></span><a/><a data-ng-click="next_image(index,photos)" data-ng-show = "next_visible" class="next slide-btn" href><span></span><a/></div><span class="sideloader" data-ng-show="loader"><img title="" alt="" src="app/assets/images/ajax-loader.gif"></span><div data-ng-hide="loader" data-ng-if="photos[index].creater_id==='+APP.currentUser.id+'" class="modal-img-tag" ng-click="untagg()">Untag <img titile="" alt="Tag Friends" src="app/assets/images/tag-icon-remove.png" ></div></div>',
            controller: 'ModalController',
            size: 'lg',
            scope: $scope,
        });
        // $scope.tagged_Friends = []
        modalInstance.result.then(function (selectedItem) {
        }, function () {

        });

        $scope.untagg = function(){
            $scope.loader = true;
            var opts ={};
            opts.user_id = APP.currentUser.id;
            opts.untag_user_id = $routeParams.id;
            opts.media_id = $scope.photos[$scope.index].id;
            console.log('friend.js---',opts)

            AlbumService.removeTaggedPhoto(opts,function(data){
                console.log(data);
                if(data.code===101){
                    modalInstance.close();
                    var tempIndex = $scope.tagged_photo.indexOf($scope.photos[$scope.index])
                    $scope.tagged_photo.splice(tempIndex,1)
                }else{
                    $scope.loader = false;
                    // modalInstance.close();
                    // var tempIndex = $scope.tagged_photo.indexOf($scope.photos[$scope.index])
                    // $scope.tagged_photo.splice(tempIndex,1)
                }
            })
        }
        $scope.pre_image = function (index, photos){
            modalInstance.close();
            $scope.imageModal(index-1, photos);
        }

        $scope.next_image = function (index, photos, leng){
            modalInstance.close()
            $scope.imageModal(index+1, photos);
        }
    }

    $scope.albumListing('listing');
    //infinite scroll loadmore
    $scope.loadMore = function() {     
        $scope.albumListing('listing');
    };
      $scope.redirectUrl = function(album_id, album_name ,id) {
       if(album_name == '') {
           album_name = 'Untitled';
           $location.path(id +"/friend/images/"+album_id+"/"+album_name);
        }
        else {
           $location.path(id+ "/friend/images/"+ album_id+"/"+album_name); 
        }
    }
}]);

app.controller('FriendViewController', ['$scope', '$http', 'AlbumService', '$routeParams', '$location', function($scope, $http, AlbumService, $routeParams ,$location) {
    //$scope.viewalbum = [];
    $scope.totalSizeImg = 0;
    $scope.allResImg = 1;
    $scope.noPhotos = false;
    $scope.imageCount = 0
    $scope.viewalbum = [];
    $scope.friendId = $routeParams.id;
    $scope.viewAlbum = function(type){
        if(type === 'listing') {
            $scope.albloader = false;
        } else {
           $scope.albloader = true;          
        }
        var limit_start = $scope.viewalbum.length;
        var albumId = $routeParams.album_id;
        $scope.albumId = $routeParams.album_id;
        $scope.user_id = $routeParams.id;
        $scope.albumname = $routeParams.album_name;
            var opts = {};
            //opts.user_id = $scope.user_id;
            opts.user_id = APP.currentUser.id;
            opts.friend_id = $routeParams.id;
            opts.album_id = albumId;
            opts.limit_start = limit_start;
            opts.limit_size = 12;
         if ((( $scope.totalSizeImg > limit_start) || $scope.totalSizeImg == 0 ) && $scope.allResImg == 1) {
                    $scope.listload = true;
                    $scope.allResImg = 0;
                AlbumService.viewAlbum(opts, function(data){
                   if(data.code == 101) {
                        $scope.imageCount = data.data.size;
                        $scope.albloader = false;
                        $scope.noPhotos = true;
                        $scope.allResImg = 1;
                        $scope.totalSizeImg = data.data.size; 
                        $scope.viewalbum = $scope.viewalbum.concat(data.data.media);
                        $scope.albumDetails = data.data.album;
                        $scope.listload = false;   
                     }else {
                        $scope.albloader = false; 
                        $scope.noPhotos = true;
                        $scope.listload = false; 
                     }
                });
        }
    }

    $scope.loadMoreImage = function() {    
        if($scope.viewalbum.length < $scope.imageCount) $scope.viewAlbum('listing');
    };
    $scope.viewAlbum('listing');
    
}]);
