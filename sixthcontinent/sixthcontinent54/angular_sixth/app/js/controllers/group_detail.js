app.controller('GroupDetailController', ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$interval', '$window', 'GroupService', 'ProfileService', 'fileReader', '$timeout','$modal', '$log', 'focus', function ($scope, $http, $rootScope, $location, $routeParams, $interval, $window, GroupService, ProfileService, fileReader, $timeout ,$modal ,$log, focus) {

    $scope.friend_id = 0;
    $scope.listMember =[];
    $scope.UserName = APP.currentUser.username;
    //$rootScope.clubCoverActive = 'about';
    var str1 = $location.path().replace("/", "");
    var str = str1.split('/');
    var activeUrl = str[0]+"/"+str[1];
    switch(activeUrl) {
        case 'album/club' :  
        $rootScope.clubCoverActive = 'photos'; break;
        default : 
        $rootScope.clubCoverActive = 'about';
    }
    $scope.removeClb = true;
    $scope.rmClub = true;
    $scope.clubsection = true;

    $scope.$on('updateClubProfileCover', function(event, imgData) { 
        $scope.groupDetail.profile_img_cover = imgData.cover;
        $scope.groupDetail.profile_img_original = imgData.original;
        $scope.groupDetail.media_id = imgData.media_id;
        $scope.coverLoadHide = false;
        $scope.fileUrl = "";
        $timeout(function(){
            $scope.repositionImage();
        },50);
     });

    //remove club
    $scope.removeClub = function() {    
        $scope.clubloader = true;  
        $scope.rmClub = false;      
        var groupId = $routeParams.clubId;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.club_id = groupId;
        GroupService.unjoinclubs(opts, function(data) {
            if( data.code == 101) { 
                $scope.successClub = true;  
                $scope.clubloader = false;  
                $scope.rmClub = false;  
                $timeout(function(){
                     $scope.clubsection = false;   
                    }, 3000);
                
            } else {
                $scope.clubloader = false;  
                $scope.rmClub = false;  
            }
        });
    }

    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth = newValue.w;
        if($scope.windowWidth <= '780'){
            if($rootScope.mobileView == true){
                $timeout(function(){
                    $scope.resizeClubMediaCoordinate();
                },1000);
            }else{
                $rootScope.mobileView = true; //declare in main controller           
            }
        } else {
            $rootScope.mobileView = false; //declare in main controller
        }
    }, true);

    var img = new Image();
    $scope.mobileShopX_Cord = 0;
    $scope.mobileShopY_Cord = 0;
    $scope.resizeClubMediaCoordinate = function(){
        if($scope.groupDetail != undefined){
            img = null;
            img = new Image();
            img.src = $scope.groupDetail.profile_img_cover;
            if($scope.windowWidth <= '480'){
                img.onload = function(){
                    if(img.width <= 910){
                        if( $scope.groupDetail.y_cord != ""){
                            if( $scope.groupDetail.y_cord > 100){
                                $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 3;
                            }else{
                                $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 4;
                            }
                            $scope.mobileClubX_Cord = 0;
                        }else{
                            $scope.groupDetail.x_cord = 0;
                            $scope.groupDetail.y_cord = 0;
                            $scope.mobileClubX_Cord = 0;
                            $scope.mobileClubY_Cord = 0;
                        }
                    }else if(img.width > 910 && img.width <= 1300){
                        if( $scope.groupDetail.x_cord != ""){
                            if( $scope.groupDetail.x_cord > 100){
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 4;
                            }else{
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 5;
                            }
                            $scope.mobileClubY_Cord = 0;
                        }else{
                            $scope.groupDetail.x_cord = 0;
                            $scope.groupDetail.y_cord = 0;
                            $scope.mobileClubX_Cord = 0;
                            $scope.mobileClubY_Cord = 0;
                        }
                    }else if(img.width > 1300 ){
                        if( $scope.groupDetail.x_cord != ""){
                            if( $scope.groupDetail.x_cord > 100){
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 5;
                            }else{
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 6;
                            }
                            $scope.mobileClubY_Cord = 0;
                        }else{
                            $scope.groupDetail.x_cord = 0;
                            $scope.groupDetail.y_cord = 0;
                            $scope.mobileClubX_Cord = 0;
                            $scope.mobileClubY_Cord = 0;
                        }
                    }
                }
            }else if($scope.windowWidth > '480' && $scope.windowWidth < '650'){
                img.onload = function(){
                    if(img.width <= 910){
                        if( $scope.groupDetail.y_cord != ""){
                            if( $scope.groupDetail.y_cord > 100){
                                $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 1.8;
                            }else{
                                $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 2;
                            }
                            $scope.mobileClubX_Cord = 0;
                        }else{
                            $scope.groupDetail.x_cord = 0;
                            $scope.groupDetail.y_cord = 0;
                            $scope.mobileClubX_Cord = 0;
                            $scope.mobileClubY_Cord = 0;
                        }
                    }else if(img.width > 910 && img.width <= 1300){
                        if( $scope.groupDetail.x_cord != ""){
                            if( $scope.groupDetail.x_cord > 100){
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.00;
                            }else{
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.20;
                            }
                            $scope.mobileClubY_Cord = 0;
                        }else{
                            $scope.groupDetail.x_cord = 0;
                            $scope.groupDetail.y_cord = 0;
                            $scope.mobileClubX_Cord = 0;
                            $scope.mobileClubY_Cord = 0;
                        }
                    }else if(img.width > 1300){
                        if( $scope.groupDetail.x_cord != ""){
                            if( $scope.groupDetail.x_cord > 100){
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.80;
                            }else{
                                $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 3.00;
                            }
                            $scope.mobileClubY_Cord = 0;
                        }else{
                            $scope.groupDetail.x_cord = 0;
                            $scope.groupDetail.y_cord = 0;
                            $scope.mobileClubX_Cord = 0;
                            $scope.mobileClubY_Cord = 0;
                        }
                    }
                }
            }
        }
    };
    $scope.displayGroupDetail = function() {
		$scope.groupTypes = APP.groupTypes;
		$scope.groupDetailLoading = false;
		$scope.showAllMembers = false;
		$scope.editGroupStatus = false;
		$scope.editGroupObject = {};
		var groupId = $routeParams.clubId;
        var groupStatus = $routeParams.clubType;
        //alert("top id"+groupId + " type="+groupStatus);
		$scope.groupViewLoader = true;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.group_id = groupId; 
		opts.group_status = groupStatus;
        $scope.listMember =[];
		GroupService.getGroupDetail(opts, function(data) {
			$scope.groupViewLoader = false;
			if( data.code == 101) {
                $scope.groupDetail = data.data;
                if(data.data.owner_id !== APP.currentUser.id){
                    angular.element('#checkUser').css('display','none');
                }
                $scope.editGroupObject = $scope.groupDetail;
				$scope.groupDetailLoading = true;
                $scope.listMember = data.data.members;
                $scope.allMemberTotal = data.data.members.length;
                if($rootScope.mobileView == true){
                        img = null;
                        img = new Image();
                        img.src = $scope.groupDetail.profile_img_cover;
                        if($scope.windowWidth <= '480'){
                            img.onload = function(){
                                if(img.width <= 910){
                                    if( $scope.groupDetail.y_cord != ""){
                                        if( $scope.groupDetail.y_cord > 100){
                                            $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 3;
                                        }else{
                                            $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 4;
                                        }
                                        $scope.mobileClubX_Cord = 0;
                                    }else{
                                        $scope.groupDetail.x_cord = 0;
                                        $scope.groupDetail.y_cord = 0;
                                        $scope.mobileClubX_Cord = 0;
                                        $scope.mobileClubY_Cord = 0;
                                    }
                                }else if(img.width > 910 && img.width <= 1300){
                                    if( $scope.groupDetail.x_cord != ""){
                                        if( $scope.groupDetail.x_cord > 100){
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 4;
                                        }else{
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 5;
                                        }
                                        $scope.mobileClubY_Cord = 0;
                                    }else{
                                        $scope.groupDetail.x_cord = 0;
                                        $scope.groupDetail.y_cord = 0;
                                        $scope.mobileClubX_Cord = 0;
                                        $scope.mobileClubY_Cord = 0;
                                    }
                                }else if(img.width > 1300 ){
                                    if( $scope.groupDetail.x_cord != ""){
                                        if( $scope.groupDetail.x_cord > 100){
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 5;
                                        }else{
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 6;
                                        }
                                        $scope.mobileClubY_Cord = 0;
                                    }else{
                                        $scope.groupDetail.x_cord = 0;
                                        $scope.groupDetail.y_cord = 0;
                                        $scope.mobileClubX_Cord = 0;
                                        $scope.mobileClubY_Cord = 0;
                                    }
                                }
                            }
                        }else if($scope.windowWidth > '480' && $scope.windowWidth < '650'){
                            img.onload = function(){
                                if(img.width <= 910){
                                    if( $scope.groupDetail.y_cord != ""){
                                        if( $scope.groupDetail.y_cord > 100){
                                            $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 1.80;
                                        }else{
                                            $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 2;
                                        }
                                        $scope.mobileClubX_Cord = 0;
                                    }else{
                                        $scope.groupDetail.x_cord = 0;
                                        $scope.groupDetail.y_cord = 0;
                                        $scope.mobileClubX_Cord = 0;
                                        $scope.mobileClubY_Cord = 0;
                                    }
                                }else if(img.width > 910 && img.width <= 1300){
                                    if( $scope.groupDetail.x_cord != ""){
                                        if( $scope.groupDetail.x_cord > 100){
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.00;
                                        }else{
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.20;
                                        }
                                        $scope.mobileClubY_Cord = 0;
                                    }else{
                                        $scope.groupDetail.x_cord = 0;
                                        $scope.groupDetail.y_cord = 0;
                                        $scope.mobileClubX_Cord = 0;
                                        $scope.mobileClubY_Cord = 0;
                                    }
                                }else if(img.width > 1300 ){
                                    if( $scope.groupDetail.x_cord != ""){
                                        if( $scope.groupDetail.x_cord > 100){
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.60;
                                        }else{
                                            $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 3.00;
                                        }
                                        $scope.mobileClubY_Cord = 0;
                                    }else{
                                        $scope.groupDetail.x_cord = 0;
                                        $scope.groupDetail.y_cord = 0;
                                        $scope.mobileClubX_Cord = 0;
                                        $scope.mobileClubY_Cord = 0;
                                    }
                                }
                            }
                        }
                }
                $scope.canPost = false; 
                if(data.data.role != 21){
                   $scope.canPost = true; 
                } 
                if(data.data.owner_id == APP.currentUser.id) {
                   $scope.uploadButton = true;
                } else {
                    $scope.uploadButton = false; 
                }
 
            } else {

			}
		});
	}
    $scope.deleteMember = function(idx){ 
        var opts = {};
        var groupId = $routeParams.clubId;
        var memberData = $scope.listMember[idx];
        opts.owner_id = APP.currentUser.id;
        opts.member_id = memberData.id;
        opts.club_id = groupId;
        opts.session_id = APP.currentUser.id;
        GroupService.deleteClubMember(opts, function(data){
            if(data.code == 101) {
                $scope.memberMessage = $scope.i18n.clubs.member_success;
                $scope.msgClass = 'text-success text-center display-block-inline';
                $timeout(function(){
                    $scope.memberMessage ='';
                }, 10000);
                $scope.listMember.splice(idx, 1);
            } else if(data.code == 100) {
                $scope.memberMessage = $scope.i18n.validation.missed_param;
                $scope.msgClass = 'login-error text-red text-center display-block-inline';
                $timeout(function(){
                    $scope.memberMessage = '';
                }, 10000);
            } else if(data.code == 78) {
                $scope.memberMessage = $scope.i18n.clubs.member_club;
                $scope.msgClass = 'login-error text-red text-center display-block-inline';
                $timeout(function(){
                    $scope.memberMessage = '';
                }, 10000);
            } else if(data.code == 79) {
                $scope.memberMessage = $scope.i18n.clubs.member_owner;
                $scope.msgClass = 'login-error text-red text-center display-block-inline';
                $timeout(function(){
                    $scope.memberMessage = '';
                }, 10000);
            } else if(data.code == 85) {
                $scope.memberMessage = $scope.i18n.clubs.member_account;
                $scope.msgClass = 'login-error text-red text-center display-block-inline';
                $timeout(function(){
                    $scope.memberMessage = '';
                }, 10000);
             } else if(data.code == 80) {
                $scope.memberMessage = $scope.i18n.clubs.member_owner_delete;
                $scope.msgClass = 'login-error text-red text-center display-block-inline';
                $timeout(function(){
                    $scope.memberMessage = '';
                }, 10000);
            }
        });
    };
	$scope.displayGroupDetail();
    $scope.aboutsection = true;
    $scope.showInvite = false;
    $scope.toggleInvite = function(){
        $rootScope.clubCoverActive = 'invite';
        $scope.showInvite = !$scope.showInvite;
        $scope.showRole = false;
         $scope.aboutclub = false;
         $scope.showMember = false;
         $scope.aboutsection = true;
         $scope.albumshow = false;
        $scope.invite.userAddress = "";
    }
    // function for about of club //
     $scope.aboutclub = false;
    $scope.aboutClub = function(id){
        $rootScope.clubCoverActive = 'about';
        $scope.showRole = false;
        $scope.showInvite = false;
         $scope.showMember = false;
         $scope.aboutsection = true;
        $location.path('/club/view/'+id+'/'+$routeParams.clubType);
       // $scope.invite.userAddress = "";
    }
    $scope.showRole = false;
    $scope.toggleRole = function(){
        $rootScope.clubCoverActive = 'changerole';
        $scope.aboutclub = false;
        $scope.showRole = !$scope.showRole;
        $scope.showInvite = false;
         $scope.showMember = false;
         $scope.aboutsection = true;
         $scope.albumshow = false;
    }
         $scope.showMember = false;
         $scope.albumshow = true;
    $scope.toggleMember = function(){
        $rootScope.clubCoverActive = 'member';
        $scope.showMember = true;
        $scope.showRole = false;
         $scope.aboutclub = false;
         $scope.showInvite = false;
         $scope.aboutsection = false;
         $scope.albumshow = false;
        $scope.invite.userAddress = "";
    }

    $scope.togglePhotos = function(){
        $rootScope.clubCoverActive = 'photos';
        $scope.albumshow = true;
        $scope.showRole = false;
         $scope.aboutclub = false;
         $scope.showInvite = false;
         $scope.aboutsection = false;
         $scope.showMember = false;
        $scope.invite.userAddress = "";
    }
    $scope.hideRoleInvite = function(){
        $scope.showRole = false;
        $scope.showInvite = false;
    }

    $scope.assignRoleToGroup = function(groupId){
        var opts = {};
        $scope.ChangeRoleError = false;
        if($scope.role.member === null || $scope.role.member === undefined || $scope.role.member.id == '') {
            $scope.changeroleErrorMsg = $scope.i18n.clubs.cover.select_member;
            $scope.ChangeRoleError = true;
            $timeout(function(){
            $scope.changeroleErrorMsg = '';
                }, 5000);
            return false;
        }
        if($scope.role.selectedRole === undefined || $scope.role.selectedRole == '') {
            $scope.changeroleErrorMsg = $scope.i18n.groupcontrol.enter_role;
            $scope.ChangeRoleError = true;
            $timeout(function(){
            $scope.changeroleErrorMsg = '';
                }, 5000);
            return false;
        }
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $scope.role.member.id;
        opts.acl_access = $scope.role.selectedRole;
        opts.group_id = groupId;
        GroupService.assignRoleToGroup(opts, function(data) {
            if( data.code == 101) {
                $scope.ChangeRoleMessage = "Role changed successfully";
                $timeout(function(){
                $scope.ChangeRoleMessage = '';
                }, 10000);
            } else {
                $scope.Message = data.message;
                $timeout(function(){
                $scope.changeroleErrorMsg = '';
                }, 10000);
            }
        });
    }


    $scope.requestMessage = "";
    $scope.showMessage = true;
    $scope.joinPublicGroups =function(groupId){
        $(".join-club-request").hide();
        $("#groupjoing"+groupId).hide();
        $("#joinloader"+groupId).show();
        $scope.requestMessage = "";
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        GroupService.joinPublicGroup(opts, function(data){
            if(data.code == 101) {
                $("#requestsent"+groupId).show();
                $(".join-club-request-sent").show();
                $("#joinloader"+groupId).hide();
                //$timeout(function(){
                //$("#requestsent"+groupId).hide();
                //}, 10000);
            } else if(data.code == 118){
                $("#requestpending"+groupId).show();
                $("#joinloader"+groupId).hide();
                $timeout(function(){
                $("#requestpending"+groupId).hide();
                }, 10000);
            }else {
                $(".join-club-request-sent").hide();
                $("#groupjoing"+groupId).show();
                $("#joinloader"+groupId).hide();
                $(".join-club-request").show();
            }
        });
    }

    $scope.invite = {};
    $scope.userList = [];
    $scope.cancelRequest = 0;
    $scope.showUserList = false;
    $scope.searchUser = function() {
        $scope.cancelRequest = 0;
        $scope.albloader = true;
        var opts = {};
        
        if($scope.invite.userAddress != ""){
            $scope.showUserList = true;
            
            opts.user_id = APP.currentUser.id;
            opts.friend_name = $scope.invite.userAddress;
            opts.limit_start = APP.user_list_pagination.start;
            opts.limit_size = APP.user_list_pagination.end; 
            ProfileService.searchUser(opts, function(data) {
                if( $scope.cancelRequest == 0 ){
                    $scope.userList = [];
                    if(data.code == 101) {
                        // angular.forEach(data.data.users,function(user) {
                        //     $scope.userList.push(user);
                        // })
                    if(data.data.count != 0 && (data.data.users.length != 0)){
                                     $scope.albloader = false;    
                                     $scope.userList = $scope.userList.concat(data.data.users); 
                                }else {
                                    $scope.showUserList = false;
                                 }    
                   
                    }else{
                        $scope.albloader = false;
                        //$scope.userList = [];
                        //$scope.showUserList = false;
                    }
                }else{
                    //$scope.userList = [];
                    //$scope.showUserList = false;
                }
            });
        }else{
                $scope.userList = [];
                $scope.userList.slice();
                $scope.cancelRequest = 1;
                $scope.showUserList = false;
        }
    };

   /* $scope.clearList = function(){
        stop = $interval(function() {
        $scope.cancelRequest = 1;
        $scope.showList = false;
        $scope.showUserList = false;
        }, 1000,1);
    }*/

    $('body').click(function() {
        stop = $interval(function() {
            $scope.cancelRequest = 1;
            $scope.showList = false;
            $scope.showUserList = false;
        }, 200,1);
    });

    $scope.setUser = function(firstName, lastName, userId){
        $scope.invite.userAddress = firstName + ' ' + lastName;
        $scope.friend_id = userId;
    }


    $scope.joinPrivateGroups = function(groupId){
        var opts = {};
         $scope.InviteUserError = false;
         $scope.showinvite = true;
         if($scope.friend_id === undefined || $scope.friend_id == '') {
            $scope.inviteuserErrorMsg = $scope.i18n.groupcontrol.enter_user;
            $scope.InviteUserError = true;
            $scope.showinvite = false;
            $timeout(function(){
            $scope.inviteuserErrorMsg = '';
                }, 6000);
            return false;
        }
        if($scope.invite.role === undefined || $scope.invite.role == '') {
            $scope.inviteuserErrorMsg = $scope.i18n.groupcontrol.enter_role;
            $scope.InviteUserError = true;
            $scope.showinvite = false;
            $timeout(function(){
            $scope.inviteuserErrorMsg = '';
                }, 6000);
            return false;
        }
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        opts.friend_id = $scope.friend_id;
        opts.access_role = $scope.invite.role;
        
        GroupService.joinPrivateGroups(opts, function(data) {
            if(data.code == 101){
                $scope.Message = $scope.i18n.groupcontrol.join_group;
                $scope.showinvite = false;
                stop = $interval(function() {
                    $scope.showInvite = false;
                    $scope.Message='';
                    $scope.friend_id='';
                    $scope.invite.role='';
                }, 10000,1);
            }else if(data.code == 118){
                $scope.Message = $scope.i18n.groupcontrol.REQUEST_IS_PENDING_FOR_USER_APPROVAL;
                $scope.showinvite = false;
                stop = $interval(function() {
                    $scope.showInvite = false;
                    $scope.Message='';
                    $scope.invite.role='';
                    $scope.friend_id='';
                }, 10000,1);
            }else if(data.code == 117){
                $scope.Message = $scope.i18n.groupcontrol.Already_member;
                $scope.showinvite = false;
                stop = $interval(function() {
                    $scope.showInvite = false;
                    $scope.Message='';
                    $scope.invite.role='';
                    $scope.friend_id='';
                }, 10000,1);
            }
            else{
                $scope.Message = $scope.i18n.groupcontrol.permission_denied;
                $scope.showinvite = false;
                stop = $interval(function() {
                    $scope.Message='';
                    $scope.showInvite = false;
                }, 10000,1);
            }
        });
    }

	$scope.showGroupMembers = function() {
		$scope.showAllMembers = $scope.showAllMembers === false ? true : false;
	};

	$scope.editGroup = function() {
		$scope.editGroupObject.groupTypeID = $scope.editGroupObject.group_status;
		$scope.editGroupStatus = $scope.editGroupStatus === false ? true : false;
        $scope.files = '';
        $scope.myFile = '';
        $scope.imageSrc = '';
	};

    $scope.myFile = '';
    $scope.invalidCoverImage = false;
    /*$scope.invalidCoverImageMgs = $scope.i18n.groupcontrol.correct_file_size;*/
    $scope.getFile = function () {
        $scope.progress = 0;
        $scope.invalidCoverImageMgs = $scope.i18n.groupcontrol.correct_file_size;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.readImage($scope.myFile, function(data){
                if(data.length != 0 && data.width >= 910 && data.height >= 400){
                    $scope.uploadClubCover(); 
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
                    filedata['width'] = w;
                    filedata['height'] = h;
                    callback(filedata);
            };
            image.onerror= function() {
                callback(filedata);
            };      
        };

    };
    
    $scope.clubEditSUbmitted = false;
    $scope.updateGroup = function() {
        $scope.createGroupError = false;
        $scope.clubEditSUbmitted = true;
        var groupStatusIdx = $scope.editGroupObject.groupTypeID;
        var groupStatusData = $scope.groupTypes[groupStatusIdx];
        if($scope.editGroupObject.title === undefined || $scope.editGroupObject.title === '') {
            $scope.clubEditForm.editclubname.$dirty = true;
            $scope.clubEditForm.editclubname.$invalid = true;
            $scope.clubEditForm.editclubname.$error.required = true;
            focus('editclubname');   
            return false;
        } else if($scope.editGroupObject.groupTypeID === 0 || $scope.editGroupObject.groupTypeID === '') {
            $scope.clubEditForm.editclubstatus.$dirty = true;
            $scope.clubEditForm.editclubstatus.$invalid = true;
            $scope.clubEditForm.editclubstatus.$error.required = true;
            focus('editclubstatus');   
            return false;
        }else if($scope.editGroupObject.description === undefined || $scope.editGroupObject.description == '') {
            $scope.clubEditForm.editclubdesc.$dirty = true;
            $scope.clubEditForm.editclubdesc.$invalid = true;
            $scope.clubEditForm.editclubdesc.$error.required = true;
            focus('editclubdesc');   
            return false;
        } else {
            $scope.createGroupStart = true;
            opts.user_id = APP.currentUser.id;
            if($scope.editGroupObject.owner_id == APP.currentUser.id) {
            	opts.group_owner_id = $scope.editGroupObject.owner_id;
            }
            opts.group_id = $scope.editGroupObject.id;
            opts.group_name = $scope.editGroupObject.title;
            opts.group_status = groupStatusData.groupTypeID;
            opts.group_description = $scope.editGroupObject.description;

            if($scope.editGroupObject.title === undefined || $scope.myFile === undefined) {
                //$scope.createGroupStart = false;
                //return false;
            }

            //to make by default public group
            if(opts.group_status == 0) {
                opts.group_status = 1;
            }
            opts.group_media = '';
            GroupService.updateGroup(opts, $scope.myFile, function(data){
                if(data.code == 101) {
                    $scope.createGroupStart = false;
                    $scope.editGroupObject = {};
                    $scope.myFile = undefined;
                    $scope.editGroup();
                    $scope.displayGroupDetail();
                } else {
                    $scope.createGroupStart = false;
                    $scope.createGroupError = true;
                }
            });
        }
    };

    $scope.newImage = false;
    $scope.uploadClubCover = function() {
        $scope.showCoverOption = false; 
        $scope.coverImageUploadStart = true;
        var opts = {};
        opts.group_id = $routeParams.clubId;
        opts.session_id = APP.currentUser.id;
        //Allow some images types for uploading
        if ($scope.myFile !== undefined ) {
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
            // Checking Extension
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                $scope.createGroupErrorMsg = $scope.i18n.groupcontrol.upload_media;
                return false;
            }
        }
        $scope.fileUrl = null;
        GroupService.uploadClubCover(opts, $scope.myFile, function(data){
            if(data.code == 101) {
                $scope.newImage = true;
                $scope.groupDetail.profile_img_cover = data.data.cover_thumb_image_path;
                $scope.groupDetail.profile_img_original = data.data.profile_img_original;
                $scope.coverImageUploadStart = false;
                $scope.fileUrl = data.data.cover_thumb_image_path;
                $scope.groupDetail.media_id =  data.data.media_id;
                $scope.showCanves = true;
                $scope.coverLoadHide = true;

            } else {
                $scope.coverImageUploadStart = false;
            }
        });
    };
    $scope.imageCropResult = null;
    $scope.imageCropResult2 = null;
    $scope.imageWidth = null;
    $scope.imageHeight = null;
    $scope.showImageCropper = false;
    $scope.showImageCropper2 = false;
    $scope.imageString = "";
    $scope.file ={};
    $scope.coverLoadHide = false;
    $scope.$watch('imageCropResult2', function(newVal) {
        if (newVal) {
            console.log('imageCropResult2', newVal);
        }
    });

    $scope.imageXPosition = 0;
    $scope.imageYPosition = 0;
    $scope.setImageCordinate = function(){
        $scope.groupDetail.x_cord = $rootScope.club.x_cord * -1;
        $scope.groupDetail.y_cord = $rootScope.club.y_cord * -1;
        $scope.saveCordinate();
    };

    $rootScope.club = {};
    $scope.showCanves = false;
    $scope.repositionImage = function(){
        $scope.showCanves = true;
        $scope.fileUrl =  $scope.groupDetail.profile_img_cover;
        if($scope.groupDetail.x_cord == 'NaN'){
            $scope.imageXPosition = 0;
            $scope.imageYPosition = 0;
            $scope.coverLoadHide = true;
        }else{
            $scope.imageXPosition = $scope.groupDetail.x_cord * -1;
            $scope.imageYPosition =  $scope.groupDetail.y_cord * -1;
            $scope.coverLoadHide = true;
        }
    };

    $scope.saveCordinate = function(){
        /*$scope.groupDetail.x_cord = $scope.imageXPosition * -1;
        $scope.groupDetail.y_cord = $scope.imageYPosition * -1;*/
        //$scope.coverLoadHide = false;
        $scope.hideUpdateCoverButton = true;
        $scope.showCanves = false;
        var opts = {};
        opts.media_id = $scope.groupDetail.media_id; 
        opts.session_id = APP.currentUser.id;   
        opts.x = ""+($scope.groupDetail.x_cord )+"";
        opts.y = ""+($scope.groupDetail.y_cord)+"";
        GroupService.setClubMediaCoordinate(opts,function(data){
            if(data.code == 101 && data.message == "SUCCESS"){
                $scope.groupDetail.x_cord = data.data.x_cord ;
                $scope.groupDetail.y_cord = data.data.y_cord ;
                $scope.coverLoadHide = false;
                $scope.file = null;
                $scope.fileUrl = null;
                $scope.hideUpdateCoverButton = false;
                $scope.showCanves = false;
                if($rootScope.mobileView == true){
                    img = null;
                    img = new Image();
                    img.src = $scope.groupDetail.profile_img_cover;
                    if($scope.windowWidth <= '480'){
                        img.onload = function(){
                            if(img.width <= 910){
                                if( $scope.groupDetail.y_cord != ""){
                                    if( $scope.groupDetail.y_cord > 100){
                                        $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 3;
                                    }else{
                                        $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 4;
                                    }
                                    $scope.mobileClubX_Cord = 0;
                                }else{
                                    $scope.groupDetail.x_cord = 0;
                                    $scope.groupDetail.y_cord = 0;
                                    $scope.mobileClubX_Cord = 0;
                                    $scope.mobileClubY_Cord = 0;
                                }
                            }else if(img.width > 910 && img.width <= 1300){
                                if( $scope.groupDetail.x_cord != ""){
                                    if( $scope.groupDetail.x_cord > 100){
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 4;
                                    }else{
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 5;
                                    }
                                    $scope.mobileClubY_Cord = 0;
                                }else{
                                    $scope.groupDetail.x_cord = 0;
                                    $scope.groupDetail.y_cord = 0;
                                    $scope.mobileClubX_Cord = 0;
                                    $scope.mobileClubY_Cord = 0;
                                }
                            }else if(img.width > 1300 ){
                                if( $scope.groupDetail.x_cord != ""){
                                    if( $scope.groupDetail.x_cord > 100){
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 5;
                                    }else{
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 6;
                                    }
                                    $scope.mobileClubY_Cord = 0;
                                }else{
                                    $scope.groupDetail.x_cord = 0;
                                    $scope.groupDetail.y_cord = 0;
                                    $scope.mobileClubX_Cord = 0;
                                    $scope.mobileClubY_Cord = 0;
                                }
                            }
                        }
                    }else if($scope.windowWidth > '480' && $scope.windowWidth < '650'){
                        img.onload = function(){
                            if(img.width <= 910){
                                if( $scope.groupDetail.y_cord != ""){
                                    if( $scope.groupDetail.y_cord > 100){
                                        $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 1.80;
                                    }else{
                                        $scope.mobileClubY_Cord =  $scope.groupDetail.y_cord / 2;
                                    }
                                    $scope.mobileClubX_Cord = 0;
                                }else{
                                    $scope.groupDetail.x_cord = 0;
                                    $scope.groupDetail.y_cord = 0;
                                    $scope.mobileClubX_Cord = 0;
                                    $scope.mobileClubY_Cord = 0;
                                }
                            }else if(img.width > 910 && img.width <= 1300){
                                if( $scope.groupDetail.x_cord != ""){
                                    if( $scope.groupDetail.x_cord > 100){
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.00;
                                    }else{
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.20;
                                    }
                                    $scope.mobileClubY_Cord = 0;
                                }else{
                                    $scope.groupDetail.x_cord = 0;
                                    $scope.groupDetail.y_cord = 0;
                                    $scope.mobileClubX_Cord = 0;
                                    $scope.mobileClubY_Cord = 0;
                                }
                            }else if(img.width > 1300 ){
                                if( $scope.groupDetail.x_cord != ""){
                                    if( $scope.groupDetail.x_cord > 100){
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 2.60;
                                    }else{
                                        $scope.mobileClubX_Cord = $scope.groupDetail.x_cord / 3.00;
                                    }
                                    $scope.mobileClubY_Cord = 0;
                                }else{
                                    $scope.groupDetail.x_cord = 0;
                                    $scope.groupDetail.y_cord = 0;
                                    $scope.mobileClubX_Cord = 0;
                                    $scope.mobileClubY_Cord = 0;
                                }
                            }
                        }
                    }
                }
            }
        });
    };

    $scope.showcrossactive = true;
    $scope.showcrossactive1 = function(){
        $scope.showcrossactive = false;
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
        },100)
        
    };


    //// start code for club rating /////
     //calling function to load postlist

        $scope.averageVoting = 0;
        $scope.vote_count = 0;
        $scope.waitRateResponse = false;
        $scope.ratePost = function(rating, post_id){
            var update = "";
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club";
            opts.type_id = post_id;
            opts.rate = rating;
            $scope.waitRateResponse = true;
            if($scope.groupDetail.is_rated){
                update = "update";
            }else{
                update = "add";
            }
            waitRequest = ProfileService.rateThis(opts, update, function(data){
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.groupDetail.avg_rate = data.data.avg_rate;
                    $scope.groupDetail.no_of_votes = data.data.no_of_votes;
                    $scope.groupDetail.is_rated = true;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    //$scope.userPostList[index].avg_rate = 0;
                    //$scope.userPostList[index].no_of_votes = 0;
                    $scope.groupDetail.is_rated = false;
                    $scope.groupDetail.current_user_rate = 0;
                }
                $scope.waitRateResponse = false;
            });
        };

        $scope.WaitDeleteResponse = false;
        $scope.removeRating = function(post_id, postIndx){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.type = "club";
            opts.type_id = post_id;
            if($scope.WaitDeleteResponse === false){
                $scope.WaitDeleteResponse = true;
                $scope.waitRateResponse = true;
            }else{
                return;
            }
            ProfileService.removeRating(opts,function(data){
                if(data.code == 101 && data.message == "SUCCESS"){
                    $scope.groupDetail.current_user_rate = 0;
                    $scope.groupDetail.is_rated = false;
                    $scope.groupDetail.no_of_votes = data.data.no_of_votes;
                    $scope.groupDetail.avg_rate =  data.data.avg_rate;
                }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                    $scope.groupDetail.current_user_rate = 0;
                    $scope.groupDetail.is_rated = false;
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

        $scope.rateThis = function(value, id){
            $scope.ratePost(value, id);
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
                        templateUrl: 'app/views/find_people.html',
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
            $scope.viewFriendProile = function(friendId){
                modalInstance.dismiss('cancel');
                $location.path('/viewfriend/'+friendId);
            };
        };
    ///  end code for club rating  /////
}]);