app.controller('GroupController', ['$scope', '$http', '$location', 'GroupService', 'fileReader', '$timeout','ProfileService' ,'$modal', '$log', 'focus', function($scope, $http, $location, GroupService, fileReader, $timeout ,ProfileService ,$modal, $log, focus) {
    $scope.groupTypes = APP.groupTypes;
    $scope.createGroupData = {};
    $scope.removeImage = false;
    $scope.noContent = false; 
    $scope.groupPublicActive = 'current';
    $scope.groupMyClubActive = '';
    $scope.groupInvitActive = '';
    $scope.isLoading = true;
    $scope.reqRes = 1;
    $scope.myGrpRes = 1;
    $scope.inviteGrpRes = 1;
    $scope.inviteCLub = 0;
    $scope.userGroupList = [];
    $scope.clubAllList = [];
    $scope.inviteGroupList = [];
    $scope.inviteClubList = [];
    $scope.totalSize = 0;
    $scope.totalMyClub = 0;
    $scope.totalinviteClub = 0;
    $scope.limitCheck = 120;
    $scope.firstPage = APP.group_pagination.end;
    $scope.itemsPerPage = APP.group_pagination.end;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.hidepagi = false;

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
        $scope.searchPublicGroup($scope.tab, $scope.itemsPerPage);
    };
   
    $scope.myGroup = function(tab, itemsPerPage) {
        $scope.inviteCLub = 0;
        $scope.tab = tab;
        $scope.clubAllList = [];
        $scope.groupMyClubActive = 'current';
        $scope.groupPublicActive = '';
        $scope.groupInvitActive = '';
        var formData = {};
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        formData.user_id = APP.currentUser.id;
        formData.group_owner_id = APP.currentUser.id;
        formData.limit_start = limit_start;
        formData.limit_size = itemsPerPage;
        //calling the services to get the group list
        if((($scope.totalMyClub > limit_start)  || $scope.totalMyClub == 0 ) && $scope.myGrpRes == 1){
            $scope.myGrpRes = 0;
            $scope.isLoading = true;
            GroupService.getUserGroups(formData, function(data){
                if(data.code == 101) {
                    $scope.userGroupList = $scope.clubMyList = data.data.groups; //$scope.clubMyList.concat(data.data.groups);
                    $scope.isLoading = false;
                    $scope.myGrpRes = 1;
                    $scope.totalMyClub = data.data.size;
                    if($scope.totalMyClub != 0){ 
                        $scope.hidepagi = true;}
                        else { $scope.hidepagi = false;}
                    $scope.totalItems = data.data.size;
                    $scope.totalItems = Math.ceil(data.data.size/itemsPerPage); 
                    $scope.range = [];  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    } 
                    if($scope.userGroupList.length == 0){
                        $scope.noContent = true;
                    }
                } else {
                    $scope.myGrpRes = 1;
                    $scope.isLoading = false;
                    $scope.totalItems = 0;
                } 
            });
        }
        
    };

    $scope.clubcheck = 0;
    $scope.searchPublicGroup = function(tab, itemsPerPage) {
        $scope.inviteCLub = 0;
        $scope.tab = tab;
        $scope.clubMyList = [];
        $scope.groupPublicActive = 'current';
        $scope.groupMyClubActive = '';
        $scope.groupInvitActive = '';
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.group_name = ($scope.clubTitle === undefined ? '' :$scope.clubTitle);
        formData.limit_start = limit_start;
        formData.limit_size = itemsPerPage;
        if((($scope.totalSize > limit_start)  || $scope.totalSize == 0 ) && $scope.reqRes == 1){
            //calling the services to get the group list
            $scope.reqRes = 0;
            $scope.isLoading = true;
            GroupService.searchGroup(formData, function(data) {
                if (data.code == 101) {
                    $scope.clubcheck = data.data.my_group;
                    $scope.userGroupList = $scope.clubAllList = data.data.groups; //$scope.clubAllList.concat(data.data.groups);
                    $scope.isLoading = false
                    $scope.totalSize = data.data.size;  
                    if($scope.totalSize != 0){ $scope.hidepagi = true;}
                    else { $scope.hidepagi = false;}
                    $scope.totalItems = Math.ceil(data.data.size/itemsPerPage); 
                    $scope.range = [];  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    }              
                    $scope.reqRes = 1;
                    $scope.searchReqRes = 1;
                    if($scope.userGroupList.length == 0){
                        $scope.noContent = true;
                    }
                } else { 
                    $scope.totalItems = 0;
                    $scope.reqRes = 1;
                    $scope.searchReqRes = 1;
                    $scope.isLoading = false;
                }
            });
        }
    }
    
    $scope.searchPublicGroup('allclub', $scope.itemsPerPage);
    // code for rating in listing of club
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
    // Code end for rating in listing of club

    $scope.tabChange = function(tab) {
        $scope.currentPage = 1;
        $scope.userGroupList = [];
        $scope.clubAllList = [];
        $scope.clubMyList = [];
        $scope.inviteClubList = [];
        $scope.tab = tab;
        $scope.isLoading = false;
        if(tab == 'allclub'){
            $scope.inviteCLub = 0;
            $scope.searchPublicGroup(tab, $scope.itemsPerPage);
        } else if(tab == 'myclub'){
            $scope.inviteCLub = 0;
            $scope.myGroup(tab, $scope.itemsPerPage);
        } else if(tab == 'inviteclub'){
            $scope.inviteCLub = 1;
            $scope.InvitedClub(tab, $scope.itemsPerPage);
        }
    } 

    $scope.InvitedClub = function(tab, itemsPerPage){
        $scope.tab = tab;
        $scope.clubAllList = [];
        $scope.clubMyList = [];
        $scope.groupInvitActive = 'current';
        $scope.groupMyClubActive = '';
        $scope.groupPublicActive = '';
        var formData = {};
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        formData.user_id = APP.currentUser.id;
        formData.limit_start = limit_start;
        formData.limit_size = itemsPerPage;;
        //calling the services to get the group list inviteClubList
        if((($scope.totalinviteClub > limit_start)  || $scope.totalinviteClub == 0 ) && $scope.inviteGrpRes == 1){
            $scope.inviteGrpRes = 0;
            $scope.isLoading = true;
            GroupService.getInviteGroups(formData, function(data){
                if(data.code == 101) {
                    $scope.inviteGroupList = $scope.inviteClubList = data.data; //$scope.inviteClubList.concat(data.data);
                    $scope.isLoading = false;
                    $scope.inviteGrpRes = 1;
                    $scope.totalinviteClub = data.size;
                    $scope.hidepagi = true;
                    $scope.totalItems = Math.ceil(data.size/itemsPerPage); 
                    $scope.range = [];  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    } 
                    if($scope.inviteGroupList.length == 0){
                        $scope.noContent = true;
                    }
                } else {
                    $scope.totalItems = 0;
                    $scope.inviteGrpRes = 1;
                    $scope.isLoading = false;
                    if($scope.totalinviteClub != 0){ $scope.hidepagi = true;}
                    else { $scope.hidepagi = false;}
                    
                } 
            });
        }
    };

    /* function to cancel the service when accept new request
    * 
    */
    $scope.clubTitle ='';
    var DELAY_TIME_BEFORE_POSTING = 300;
    //var element = $('#search');
    var currentTimeout = null;

    $('#clubserchbox').keypress(function() {
    
      var model = $scope.clubTitle;
      //var poster = model($scope);
      if(currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
      currentTimeout = $timeout(function(){
        $scope.searchClub('allclub');
      }, DELAY_TIME_BEFORE_POSTING)
    });

    $scope.searchReqRes = 0;
    $scope.searchClub = function(tab) {
        $scope.searchReqRes = 0;
        if($scope.clubTitle.length >= 3){
            $scope.clubMyList = [];
            $scope.clubAllList = [];
            $scope.userGroupList = [];
            $scope.tab = tab;
            $scope.groupPublicActive = 'current';
            $scope.searchPublicGroup('allclub', $scope.itemsPerPage);
        } else {
            $scope.clubAllList = [];
            $scope.userGroupList.slice();
        }
    } 

    $scope.loadMore = function() {
        var a = $scope.itemsPerPage;
        var tempTab = $scope.tab;
        if(tempTab == 'allclub'){
            $scope.inviteCLub = 0;
            $scope.searchPublicGroup(tempTab, a);
        } else if(tempTab == 'myclub'){
            $scope.inviteCLub = 0;
            $scope.myGroup(tempTab, a);
        } else if(tempTab == 'inviteclub'){
            $scope.inviteCLub = 1;
            $scope.InvitedClub(tempTab, a);
        }
    } 
    
    $scope.createGroupToggleTag = true;
    $scope.createGroupStart = false;
    $scope.createGroupToggle = function() {
        $scope.createGroupData.groupTypeID = 0;
        $scope.createGroupToggleTag = $scope.createGroupToggleTag === false ? true : false; 
    };

    $scope.cancelCreateGroupToggle = function() {
        $scope.createGroupData = {};
        $scope.files = '';
        $scope.myFile = '';
        $scope.imageSrc = '';
        $scope.createGroupToggle();
    };

    $scope.clubFormSubmitted = false;
    $scope.createGroup = function() {
        $scope.clubFormSubmitted = true;
        var opts = {};
        $scope.createGroupError = false;
        var groupStatusIdx = $scope.createGroupData.groupTypeID;
        var groupStatusData = $scope.groupTypes[groupStatusIdx];
        opts.user_id = APP.currentUser.id;
        opts.group_name = $scope.createGroupData.name;
        opts.group_status = groupStatusData.groupTypeID;
        
        if($scope.createGroupData.name === undefined || $scope.createGroupData.name === '') {
            $scope.createClub.clubname.$dirty = true;
            $scope.createClub.clubname.$invalid = true;
            $scope.createClub.clubname.$error.required = true;
            focus('clubname');
            return false;
        }else if($scope.createGroupData.groupTypeID === 0 || $scope.createGroupData.groupTypeID === '') {
            $scope.createClub.clubstatus.$dirty = true;
            $scope.createClub.clubstatus.$invalid = true;
            $scope.createClub.clubstatus.$error.required = true;
            focus('clubstatus');
            return false;
        } else if($scope.createGroupData.description === undefined || $scope.createGroupData.description === '') {
            $scope.createGroupStart = false;
            $scope.createGroupError = true;
            $scope.createClub.clubdescription.$dirty = true;
            $scope.createClub.clubdescription.$invalid = true;
            $scope.createClub.clubdescription.$error.required = true;
            focus('clubdescription');
            return false;
        } else {
            $scope.createGroupStart = true;
            opts.group_description = $scope.createGroupData.description;
            opts.group_media = '';

            //to make by default public group
            if(opts.group_status == 0) {
                opts.group_status = 1;
            }
            
            GroupService.createGroup(opts, $scope.myFile, function(data){
                if(data.code == 101) {
                    $location.path('/club/view/' + data.data.group_id + '/' + data.data.group_status);
                    // $scope.createGroupStart = false;
                    // $scope.createGroupData = {};
                    // $scope.createGroupToggleTag = true;
                    // $scope.searchPublicGroup($scope.tab);
                    // $scope.removeImage = false;
                    // window.reload();
                    
                } else {
                    $scope.createGroupStart = false;
                    $scope.createGroupError = true;
                }
            });  
        }    
    };

    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
            $scope.removeImage = true;
        });
    };

    $scope.removeClubDp = function(){
        $scope.myFile = "";
        $scope.imageSrc = "";
        $scope.imageSrc = false;
        $scope.removeImage = false;
    }

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

    //function to cancel the  invitation in invitations in club
    $scope.cancelGroup = function(idx){ 
        var formData = {};
        $scope.isLoading = true;
        var groupData = $scope.inviteGroupList[idx];
        formData.user_id = groupData.sender_info.id;
        formData.request_id = groupData.request_id;
        // calling the services to delete the group
        GroupService.cancelGroup(formData, function(data){
            if(data.code == 101) {
                $scope.message = $scope.i18n.clubs.invitation_cancel;
                $timeout(function(){
                       $scope.message ='';
                 }, 15000);
                $timeout(function(){
                    $scope.commentErrMsg = '';
                }, 15000);
                $scope.inviteGroupList.splice(idx, 1);
                $scope.isLoading = false;
            } else {
                $scope.message = $scope.i18n.clubs.invitation_cancel_failed;
                $timeout(function(){
                    $scope.commentErrMsg = '';
                }, 15000);
                $scope.isLoading = false;
            }
        });
    }


    $scope.requestMessage = "";
    $scope.showMessage = true;
    $scope.joinPublicGroups =function(groupId){
        console.log("asadsadsadadadddadad");
        $("#groupjoing"+groupId).hide();
        $("#groupjoinglist"+groupId).hide();
        $("#joinloader"+groupId).show();
        $("#joinloaderlist"+groupId).show();
        $scope.requestMessage = "";
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = groupId;
        GroupService.joinPublicGroup(opts, function(data){
            if(data.code == 101) {
                console.log("aaaaaaaadadadddadad");
                $("#requestsent"+groupId).show();
                $("#requestsentlist"+groupId).show();
                $("#joinloader"+groupId).hide();
                $("#joinloaderlist"+groupId).hide();
            } else if(data.code == 118){
                $("#requestpending"+groupId).show();
                $("#requestpendinglist"+groupId).show();
                $("#joinloader"+groupId).hide();
                $("#joinloaderlist"+groupId).hide();
            }else {
                $("#groupjoing"+groupId).show();
                $("#groupjoinglist"+groupId).show();
                $("#joinloader"+groupId).hide();
                $("#joinloaderlist"+groupId).hide();
            }
        });
    }
    //function to delete a user group
    $scope.deleteGroup = function(idx){ 
        var formData = {};
        $scope.isLoading = true;
        var groupData = $scope.userGroupList[idx];
        formData.user_id = APP.currentUser.id;
        formData.group_owner_id = groupData.owner_id;
        formData.group_id = groupData.group_id;
        // calling the services to delete the group
        GroupService.deleteGroup(formData, function(data){
            if(data.code == 101) {
                $scope.message = $scope.i18n.clubs.delete_success;
                $scope.userGroupList.splice(idx, 1);
                $timeout(function(){
                $scope.message ='';
                 }, 15000);
                $scope.isLoading = false;
            } else {
                $scope.message = $scope.i18n.clubs.delete_fail;
                $scope.isLoading = false;
            }
        });
    }

}]);

app.controller('ClubNotificationController', ['$scope', '$http', 'GroupService', function($scope, $http, GroupService) {
    $scope.getClubNotification = function() {
        $scope.NotificationFound = false;
        $scope.NotificationNotFound = false;
        opts = {};
        opts.user_id = APP.currentUser.id;
        GroupService.getAllClubNotifications(opts, function(data) {
            if(data.code == 101) {
                if(data.data.length != 0) {
                    $scope.notifications = data.data;
                    $scope.NotificationFound = true;
                } else {
                    $scope.NotificationNotFound = true;
                }
            } else {
                $scope.NotificationNotFound = true;
            }
        });
    };
    $scope.getClubNotification();
    $scope.acceptRequest = function(senderId, requestId, groupId, groupType, id) {
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 1;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101) { 
                $scope.getClubNotification();
            } else {

            }
        });
    };

    $scope.rejectRequest = function(senderId, requestId, groupId, groupType, id) { 
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 2;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101) { 
                $scope.getClubNotification();
            } else {

            }
        });
    };
}]);

app.controller('ClubSpecificationNotification', ['$scope', '$http', '$routeParams', 'GroupService', function($scope, $http, $routeParams, GroupService) {
    $scope.getClubNotification = function() { 
        $scope.NotificationFound = false;
        $scope.NotificationNotFound = false;
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.group_id = $routeParams.clubId;
        GroupService.getGroupNotifications(opts, function(data) {
            if(data.code == 101) {
                if(data.data.length != 0) {
                    $scope.notifications = data.data;
                    $scope.NotificationFound = true;
                } else {
                    $scope.NotificationNotFound = true;
                }
            } 
            else if(data.code == 500) {
                $scope.NotificationNotFound = true;
            }
            else {
                $scope.NotificationNotFound = true;
            }
        });
    };

    $scope.getClubNotification();
    $scope.acceptRequest = function(senderId, requestId, groupId, groupType, id) {
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 1;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101) { 
                $scope.getClubNotification();
            } else {

            }
        });
    };

    $scope.rejectRequest = function(senderId, requestId, groupId, groupType, id) { 
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
        if(groupType == 1)
            opts.request_type = 'admin';
        else
            opts.request_type = 'user';
        opts.response = 2;
        GroupService.responseClubNotification(opts, function(data) {
            if(data.code == 101) { 
                $scope.getClubNotification();
            } else {

            }
        });
    };
}]);

app.controller('MyClubController', ['$scope', '$http', 'GroupService', '$location', '$timeout', 'ProfileService' ,'$modal', '$log', 'focus', function($scope, $http, GroupService ,$location ,$timeout ,ProfileService ,$modal, $log, focus) {
    $scope.groupTypes = APP.groupTypes;
    $scope.createGroupData = {};
    $scope.userGroupList = [];
    $scope.noContent = false; 
    $scope.groupMyClubActive = 'current';
    $scope.groupInvitActive = '';
    $scope.isLoading = true;
    $scope.myFile = [];
    $scope.myReqRes = 1;
    $scope.totalSize = 0;
    $scope.myClubList = [];
    $scope.getMyClub = function(){
        $scope.groupMyClubActive = 'current';
        $scope.groupPublicActive = '';
        var formData = {};
        var limit_start = $scope.userGroupList.length;
        formData.user_id = APP.currentUser.id;
        formData.group_owner_id = APP.currentUser.id;
        formData.limit_start = limit_start;
        formData.limit_size = APP.group_pagination.end;
        //$scope.myClubList = [];
        //calling the services to get the group list
        if((($scope.totalSize > limit_start)  || $scope.totalSize == 0 ) && $scope.myReqRes == 1){
            $scope.myReqRes = 0;
            $scope.isLoading = true;
            GroupService.getUserGroups(formData, function(data){
                if(data.code == 101) {
                    $scope.userGroupList = $scope.myClubList = $scope.myClubList.concat(data.data.groups);
                    $scope.isLoading = false;
                    $scope.myReqRes = 1;
                    $scope.totalSize = data.data.size;
                    if($scope.userGroupList.length == 0){
                        $scope.noContent = true;
                    }
                } else {
                    $scope.myReqRes = 1;
                    $scope.isLoading = false;
                } 
            });
        }
    };

    $scope.loadMore = function() {
        $scope.getMyClub();
    } 

    $scope.clubFormSubmitted = false;
    $scope.createGroup = function() {
        $scope.clubFormSubmitted = true;
        var opts = {};
        $scope.createGroupError = false;
        $scope.createGroupStart = true;
        var groupStatusIdx = $scope.createGroupData.groupTypeID;
        var groupStatusData = $scope.groupTypes[groupStatusIdx];
        opts.user_id = APP.currentUser.id;

        if($scope.createGroupData.name === undefined || $scope.createGroupData.name === '') {
            $scope.createGroupStart = false;
            $scope.createGroupError = true;
            $scope.createClub.clubname.$dirty = true;
            $scope.createClub.clubname.$invalid = true;
            $scope.createClub.clubname.$error.required = true;
            focus('clubname');   
            return false;
        } else if(groupStatusData.groupTypeID === undefined || groupStatusData.groupTypeID == '') {
            $scope.createGroupStart = false;
            $scope.createGroupError = true;
            $scope.createClub.clubstatus.$dirty = true;
            $scope.createClub.clubstatus.$invalid = true;
            $scope.createClub.clubstatus.$error.required = true;
            focus('clubstatus'); 
            return false;
        } else if($scope.createGroupData.description === undefined || $scope.createGroupData.description === '') {
            $scope.createGroupStart = false;
            $scope.createGroupError = true;
            $scope.createClub.clubdescription.$dirty = true;
            $scope.createClub.clubdescription.$invalid = true;
            $scope.createClub.clubdescription.$error.required = true;
            focus('clubdescription'); 
            return false;
        }
        opts.group_name = $scope.createGroupData.name;
        opts.group_status = groupStatusData.groupTypeID;
        opts.group_description = $scope.createGroupData.description;
        opts.group_media = '';

        //to make by default public group
        if(opts.group_status == 0) {
            opts.group_status = 1;
        }
        
        GroupService.createGroup(opts, $scope.myFile, function(data){
            if(data.code == 101) {
                $location.path('/club/view/' + data.data.group_id + '/' + data.data.group_status);      
              //  $scope.createGroupStart = false;
              //  $scope.createGroupData = {};
              //  $scope.createGroupToggleTag = true;
              // $scope.getMyClub();
            } else {
                $scope.createGroupStart = false;
                $scope.createGroupError = true;
            }
        });      
    };

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

    //function to delete a user group
    $scope.deleteGroup = function(idx){ 
        var formData = {};
        $scope.isLoading = true;
        var groupData = $scope.userGroupList[idx];
        
        formData.user_id = APP.currentUser.id;
        formData.group_owner_id = groupData.owner_id;
        formData.group_id = groupData.group_id;
        // calling the services to delete the group
        GroupService.deleteGroup(formData, function(data){
            if(data.code == 101) {
                $scope.message = $scope.i18n.clubs.delete_success;
                $scope.userGroupList.splice(idx, 1);
                $timeout(function(){
                $scope.message ='';
                 }, 15000);
                $scope.isLoading = false;
            } else {
                $scope.message = $scope.i18n.clubs.delete_fail;
                $scope.isLoading = false;
            }
        });
    }

    $scope.createGroupToggleTag = true;
    $scope.createGroupStart = false;
    $scope.createGroupToggle = function() {
        $scope.createGroupData.groupTypeID = 0;
        $scope.createGroupToggleTag = $scope.createGroupToggleTag === false ? true : false; 
    };

    $scope.cancelCreateGroupToggle = function() {
        $scope.createGroupData = {};
        $scope.files = '';
        $scope.myFile = '';
        $scope.imageSrc = '';
        $scope.createGroupToggle();
    };
     // code for rating in listing of club
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
    // Code end for rating in listing of club

}]);