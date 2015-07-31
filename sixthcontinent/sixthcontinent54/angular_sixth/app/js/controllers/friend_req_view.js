app.controller('FriendRequestView', ['$cookieStore', '$scope', '$rootScope', '$http', '$timeout', 'ProfileService', function($cookieStore, $scope, $rootScope, $http, $timeout, ProfileService) {
	$scope.friendRequestLoading = false;
	$scope.frientreqResponse = 1;
	$scope.FriendRequests = [];
	$scope.endLimit = 12;
	$scope.allTotal = 0;

	$scope.getFriendReqNotification = function() {
		var limit_start = $scope.FriendRequests.length;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = $scope.endLimit;
		if ((( $scope.allTotal > limit_start) || $scope.allTotal == 0 ) && $scope.frientreqResponse == 1) {
			$scope.friendRequestLoading = true;
			$scope.frientreqResponse = 0;
			ProfileService.getPendingFreindReq(opts, function(data) {
				$scope.frientreqResponse = 1;
				if(data.code == 101) {
					$scope.FriendRequests = $scope.FriendRequests.concat(data.data.requests);
					$scope.allTotal = data.data.size;
					$scope.friendRequestLoading = false;				    
	            }
				 else {
					$scope.friendRequestLoading = false;
				}
			});
		}
    };
       
    $scope.getFriendReqNotification();

    $scope.loadMore = function() {
    	$scope.getFriendReqNotification();
    }

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
				$rootScope.getAllFriendNotification();
				$scope.getFriendReqNotification();
			} else {
				$("#notification-request-friend-" + id).show();
				$scope.getFriendReqNotification();
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
				$scope.getFriendReqNotification();
			} else {
				$("#notification-request-friend-" + id).hide();
				$scope.getFriendReqNotification();
			}
		});
	};
}]);

/**
* This is for open the single page for media 
*/
app.controller('MediaSingleController', ['$cookieStore', '$scope', '$rootScope', '$http', '$timeout', '$routeParams', '$modal', '$log', 'ProfileService', 'SingleMediaDetailService', 'AlbumService', function($cookieStore, $scope, $rootScope, $http, $timeout, $routeParams, $modal, $log, ProfileService, SingleMediaDetailService, AlbumService) {
	$scope.postPageLoader = true;
	$scope.postPageNotFound = false;
	$scope.data = [];
	var opts = {};
	opts.media_id = $routeParams.mediaId;
	opts.album_type = $routeParams.albumType;
	opts.album_id = $routeParams.parentId;
	opts.user_id  = APP.currentUser.id; 
	opts.owner_id = $routeParams.supportId;

    //Intanciated some value for below uses 
    $scope.parent_id = $routeParams.parentId;
    $scope.media_id = $routeParams.mediaId;
    $scope.max          = 5;
    $scope.isReadonly   = false;
    $scope.media_index = 0;

	if($routeParams.albumType == 'user') {
		$scope.parent_type = 'user_profile_album_photo';
	} else if($routeParams.albumType == 'club') {
        $scope.parent_type = 'club_album_photo';
    }else if($routeParams.albumType == 'shop') {
        $scope.parent_type = 'store_media';
    } else {
        $scope.parent_type = 'user_profile_album_photo';
    }

	$scope.mediaType = $routeParams.albumType;
	SingleMediaDetailService.getMediaInfo(opts, function(data) {
		if(data.code == 101) {
			$scope.data = data.data;
			$scope.postPageLoader = false;
		} else {
			$scope.data = [];
			$scope.postPageLoader = false;
			$scope.postPageNotFound = true;
		}
	}); 

	$scope.UpdateTag = false;	
    $scope.Tagtoggle = function(){
        $scope.UpdateTag = !$scope.UpdateTag;
    }

    $scope.tagFriendSuggestion = function(event, friendname){
        if(event.keyCode===40){
            event.preventDefault();
            if($scope.friendTagIndex+1 !== $scope.friends.length){
                $scope.friendTagIndex++;
            }
        }else if(event.keyCode===38){
            event.preventDefault();
            if($scope.friendTagIndex-1 !== -1){
                $scope.friendTagIndex--;
            }
        }else if(event.keyCode===13){
               if($scope.friends.length > 0  && $scope.friendTagIndex!==-1) $scope.selectFriend($scope.friends[$scope.friendTagIndex]);
        }
        if($('#searchTagFriend').val().trim()==="") $scope.showFriendList = false;
        if(!(event.keyCode>=65 && event.keyCode<=95)) return;
        $scope.cancelFriendSearch = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        friendname ? opts.friend_name = friendname : opts.friend_name = "";
        opts.session_id = APP.currentUser.id;
        opts.limit_start = 0;
        opts.limit_size =  APP.friend_list_pagination.end;
        $scope.showSearchLoader = true;

        ProfileService.searchFriends(opts,function(data){
            $scope.showSearchLoader = false;
            if($scope.cancelFriendSearch === false){
                if(data.data.users.length>0) $scope.showFriendList = true;
                else $scope.showFriendList = false;
                $scope.friends = data.data.users;
            }
        })
    };

    $scope.selectFriend = function(friendInfo){
        $scope.dublicate = false;
        $scope.choose = false;  
        angular.forEach($scope.data.tagged_friends_info,function(index){
            if(index.id === friendInfo.user_id){
                $scope.dublicate = true;
            }
        });

        if($scope.dublicate === false){
            $scope.data.tagged_friends_info.push(friendInfo.user_info);
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTagIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        }else{
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTagIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        }
    };

    $scope.taggService = function(){
        var pre_visible_status  = $scope.pre_visible;
        var next_visible_status = $scope.next_visible;
        $scope.pre_visible = false;
        $scope.next_visible = false;
        var frnd_array = [];
        angular.forEach($scope.data.tagged_friends_info,function(index){
            frnd_array.push(index.id);
        });
        var opts = {};
        opts.user_id   = APP.currentUser.id;
        opts.album_id  = $scope.parent_id;
        opts.post_type = 1;
        opts.media_id  = [$scope.media_id];
        opts.tagged_friends = frnd_array.join(',')
        $scope.UpdateTag = false;
        $scope.TagLoader = true;
    
       AlbumService.photoTaging(opts,function(data){
            if(data.code === 101){
                $scope.choose = true;
                $scope.TagLoader = false;
            }
            $scope.pre_visible  = pre_visible_status;
            $scope.next_visible = next_visible_status;
        });
    };

    $scope.removeTagFriend = function(friendIndex){
        $scope.data.tagged_friends_info.splice(friendIndex,1);
    };

    $scope.lostFocus = function(){
        $timeout(function(){
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTagIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        },300);
    };

    $scope.waitRateResponse = false;
    $scope.ratePicture = function(rating, picture_id, mediaIndex){
        var update = "";
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.type_id = picture_id;
        opts.rate    = rating;
        if($scope.parent_type == 'friend_album'){
            opts.type = 'user_profile_album_photo'
        }else {
            opts.type = $scope.parent_type;
        }
        if($scope.data.is_rated){
            update = "update";
        }else{
            update = "add";
        }
        $scope.waitRateResponse = true;
        ProfileService.rateThis(opts, update, function(data){
            if(data.code === 101 && data.message === "SUCCESS"){
                $scope.data.avg_rate    = data.data.avg_rate;
                $scope.data.no_of_votes = data.data.no_of_votes;
                $scope.data.is_rated    = true;
                $scope.data.current_user_rate = data.data.current_user_rate;
            }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                $scope.data.current_user_rate   = 0;
                $scope.data.is_rated            = true;
            }
            $scope.waitRateResponse = false;
        });
    };

    $scope.removeRating = function(pictureIndex , mediaIndex){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.type_id = pictureIndex;
        if($scope.parent_type == 'friend_album'){
            opts.type = 'user_profile_album_photo'
        }else {
            opts.type = $scope.parent_type;
        }
        
        if($scope.waitRateResponse === false){
            $scope.waitRateResponse = true;
        }else{
            return;
        }
        ProfileService.removeRating(opts,function(data){
            if(data.code == 101 && data.message == "SUCCESS"){
                $scope.data.current_user_rate   = 0;
                $scope.data.avg_rate            = data.data.avg_rate;
                $scope.data.no_of_votes         = data.data.no_of_votes;
                $scope.data.is_rated            = false;
            }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                $scope.data.current_user_rate   = 0;
                $scope.data.is_rated            = false;
            }
            $scope.waitRateResponse = false;
        });
    };

    $scope.averageRating = function(rating){
        if(rating != undefined)
        return new Array(Math.ceil(rating));
    };

    $scope.blankStar = function(rating){
        if((5-Math.ceil(rating)) > 0){
            return new Array(5-Math.ceil(rating));
        }else{
            return 0;
        }
    };

    $scope.findPeopleRate = function(id, count_Vote){
        if(count_Vote === 0 ){
            return false;
        }
        var opts = {};
        $scope.ratedUsers = {};
        var modalInstance = $modal.open({
                    templateUrl: 'app/views/find_people.html',
                    controller: 'ModalController',
                    size: 'lg',
                    scope: $scope,
        });
        $scope.showPeopleLoader = true;
        if($scope.parent_type == 'friend_album'){
            opts.type = 'user_profile_album_photo'
        }else {
            opts.type = $scope.parent_type;
        }
        opts.type_id = id;
        opts.session_id = APP.currentUser.id;
        ProfileService.findPeople(opts,function(data){
            if(data.code == 101 && data.message == "SUCCESS"){
                $scope.showPeopleLoader = false;
                $scope.ratedUsers       = data.data.users_rated;
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

}]);