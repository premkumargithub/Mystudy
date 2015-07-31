app.controller('AllNotiFriendController',['$cookieStore', '$scope', '$rootScope', '$http', '$location', '$timeout', '$modal', '$log', 'UserService', 'ProfileService', 'GroupService', function($cookieStore, $scope, $rootScope, $http, $location, $timeout, $modal, $log, UserService, ProfileService, GroupService) {
	$scope.NotificationFound = false;
	$scope.NotificationNotFound = false;
	$rootScope.showFriendNotificationList = false;
	$rootScope.loadNotification1 = false;
	$scope.loadNotiResponse = 1;
	$scope.scopeVar2 = false;

	 $scope.showFriendNotification = function($event) {
	 	if($event != undefined){
	 		$event.stopPropagation();
	 	}
		var temp=$rootScope.toggleSearch
		$rootScope.toggleSearch=null
		setTimeout(function(){
			$rootScope.toggleSearch=temp
		},100);
		$rootScope.groupNotificationList = false;
		$rootScope.loadGroupNotification = false;
		$rootScope.showNewMessageList = false;
		$rootScope.showNotificationList = false;
		$rootScope.showFriendNotificationList = !$rootScope.showFriendNotificationList;
		$scope.scopeVar2 = !$scope.scopeVar2;
		$scope.scopeVar1 = false;
		$scope.scopeVar = false;
		if($scope.scopeVar2){
			$rootScope.getAllFriendNotification();
		}else{
        	$rootScope.getCountOfAllTypeNotificaton();
        }
	};	
    $scope.NotificationFriendOut = function(){
		$rootScope.showFriendNotificationList = false;
		$scope.scopeVar2 = false;
    }; 
	$scope.blockDivClick = function(even){
		if(even.target.nodeName!=='IMG'){
			var temp=$rootScope.toggleSearch
			$rootScope.toggleSearch=null
	        setTimeout(function(){
				$rootScope.toggleSearch=temp
			},100)
		}
	}
	$scope.FriendRequests = [];
	$rootScope.getAllFriendNotification = function() {
		$scope.FriendRequests = [];
		$rootScope.loadNotification1 = true;
		$scope.NotificationFound = false;
		$scope.NotificationNotFound = false;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = 0;
		opts.limit_size = 100;
		ProfileService.getPendingFreindReq(opts, function(data) {
			if(data.code == 101) {
			    $scope.FriendRequests = data.data.requests;
			    $rootScope.allFriendTotal = data.data.size;
				$scope.NotificationFound = true;
				$rootScope.loadNotification1 = false;
			    $scope.NotificationNotFound = true;	    
            }
			 else {
				$scope.NotificationNotFound = true;
				$rootScope.loadNotification1 = false;
			}
		});
    };
       
	$scope.AcceptRequest = function(friendInfo, id) {
		$("#notification-request-friend-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendInfo.friend_id;
		opts.action = 1;
		if(friendInfo.personal == 1){
			opts.request_type = 1; 
		}else if(friendInfo.professional == 1 ){
			opts.request_type = 2; 
		}
		ProfileService.acceptFriendRequest(opts, function(data) {
			if(data.code == 101) {
				$("#notification-request-friend-" + id).hide();
				/*$rootScope.getAllFriendNotification();*/
				$location.path('/viewfriend/'+friendInfo.friend_id);
			} else {
				$("#notification-request-friend-" + id).show();
			}
		});
	};  

	$scope.RejectRequest = function(friend, id) {
		$("#notification-request-friend-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friend.friend_id;
		opts.action = '0';
		if(friend.personal == 1){
			opts.request_type = 1; 
		}else if(friend.professional == 1 ){
			opts.request_type = 2; 
		}

		ProfileService.rejectFriendRequest(opts, function(data) {
			if(data.code == 101) {
				$("#notification-request-friend-" + id).hide();
				$rootScope.getAllFriendNotification();
			} else {
				$("#notification-request-friend-" + id).hide();
			}
		});
	};

	if(UserService.isAuthenticated()) {
		$rootScope.getAllFriendNotification();
	}

}]);