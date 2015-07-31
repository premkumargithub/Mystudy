app.controller('GroupDetailController', function ($scope, $http, $routeParams, $interval, GroupService, ProfileService, fileReader, $timeout) {
    $scope.friend_id = 0;
    $scope.listMember =[];
    $scope.UserName = APP.currentUser.username;
    $scope.displayGroupDetail = function() {
		$scope.groupTypes = APP.groupTypes;
		$scope.groupDetailLoading = false;
		$scope.showAllMembers = false;
		$scope.editGroupStatus = false;
		$scope.editGroupObject = {};
		var groupId = $routeParams.id;
	    var groupStatus = $routeParams.status;
		$scope.groupViewLoader = true;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.group_id = groupId; 
		opts.group_status = groupStatus;
        $scope.listMember =[];
		GroupService.getGroupDetail(opts, function(data) {
			$scope.groupViewLoader = false;
			if( data.code == 101 && data.message === 'success' ) {
				$scope.groupDetail = data.data;
				$scope.editGroupObject = $scope.groupDetail;
				$scope.groupDetailLoading = true;
                $scope.listMember = data.data.members;
                $scope.canPost = false; 
                if(data.data.role != 21){
                   $scope.canPost = true; 
                } 
            } else {

			}
		});
	}

	$scope.displayGroupDetail();

    $scope.showInvite = false;
    $scope.toggleInvite = function(){
        $scope.showInvite = !$scope.showInvite;
        $scope.showRole = false;
        $scope.invite.userAddress = "";
    }

    $scope.showRole = false;
    $scope.toggleRole = function(){
        $scope.showRole = !$scope.showRole;
        $scope.showInvite = false;
    }

    $scope.hideRoleInvite = function(){
        $scope.showRole = false;
        $scope.showInvite = false;
    }

    $scope.assignRoleToGroup = function(groupId){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_id = $scope.role.member.id;
        opts.acl_access = $scope.role.selectedRole;
        opts.group_id = groupId;
        GroupService.assignRoleToGroup(opts, function(data) {
            if( data.code == 101 && data.message === 'success' ) {
                $scope.Message = "role changed";
                stop = $interval(function() {
                    $scope.showRole = false;
                }, 2000,1);
            } else {
                $scope.Message = data.message;
                stop = $interval(function() {
                    $scope.showRole = false;
                }, 2000,1);
            }
        });
    }


    $scope.requestMessage = "";
    $scope.showMessage = true;
    $scope.joinPublicGroups =function(groupId){
        $("#groupjoing"+groupId).hide();
        $("#joinloader"+groupId).show();
        $scope.requestMessage = "";
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        GroupService.joinPublicGroup(opts, function(data){
            if(data.code == 101 && data.message === "Success") {
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

    $scope.invite = {};
    $scope.userList = [];
    $scope.cancelRequest = 0;
    $scope.showUserList = false;
    $scope.searchUser = function() {
        $scope.cancelRequest = 0;
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
                    if(data.code == 101 && data.message === 'success' && data.data.count != 0) {
                        // angular.forEach(data.data.users,function(user) {
                        //     $scope.userList.push(user);
                        // })
                    $scope.userList = $scope.userList.concat(data.data.users);
                    }else{
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

    $scope.clearList = function(){
        stop = $interval(function() {
        $scope.cancelRequest = 1;
        $scope.showList = false;
        //$scope.searchFrind = "";
        //$scope.userList = [];
        //$scope.stopTimer();
        $scope.showUserList = false;
        }, 200,1);
    }

    $scope.setUser = function(userName, userId){
        $scope.invite.userAddress = userName;
        $scope.friend_id = userId;
    }


    $scope.joinPrivateGroups = function(groupId){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        opts.friend_id = $scope.friend_id;
        opts.access_role = $scope.invite.role;
        GroupService.joinPrivateGroups(opts, function(data) {
            if(data.code == 101 && data.message === 'Success'){
                $scope.Message = "Join Group request sent";
                stop = $interval(function() {
                    $scope.showInvite = false;
                }, 2000,1);
            }else if(data.code == 117 || data.code == 118){
                $scope.Message = data.message;
                stop = $interval(function() {
                    $scope.showInvite = false;
                }, 2000,1);
            }else{
                $scope.Message = "Permission denied";
                stop = $interval(function() {
                    $scope.showInvite = false;
                }, 2000,1);
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
    $scope.imageSrc = '';
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
        });
    };

	$scope.updateGroup = function() {
        var opts = {};
        $scope.createGroupError = false;
        $scope.createGroupErrorMsg = 'Club can updated due to server error';
        $scope.createGroupStart = true;
        var groupStatusIdx = $scope.editGroupObject.groupTypeID;
        var groupStatusData = $scope.groupTypes[groupStatusIdx];

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
        //Allow some images types for uploading
        if ($scope.myFile !== undefined ) {
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
            // Checking Extension
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                $scope.createGroupErrorMsg = 'Upload media file is not valid';
                $scope.createGroupStart = false;
                $scope.createGroupError = true;
                return false;
            }
        }
        //to make by default public group
        if(opts.group_status == 0) {
            opts.group_status = 1;
        }
        opts.group_media = $scope.myFile;
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
    };
});