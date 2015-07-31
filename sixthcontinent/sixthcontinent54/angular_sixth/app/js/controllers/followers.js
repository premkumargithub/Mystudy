app.controller('FollowersController',['$cookieStore', '$rootScope', '$scope', '$http', '$location', '$timeout', '$routeParams', 'ProfileService', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $routeParams, ProfileService) {
	$scope.resultNotFound = false;
	$scope.followerObject = [];
	$scope.followerAllList = [];
	$scope.allRes = 1;
	$scope.totalSize = 0
	$scope.getFollowersList = function() {		
		var opts = {};
		var limit_start = $scope.followerAllList.length;
		opts.user_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = APP.friend_list_pagination.end;
		if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
			$scope.followersLoader = true;
			$scope.allRes = 0;
			ProfileService.getFollowers(opts, function(data) {
				$scope.allRes = 1;
	        	if(data.code == '101') {
	                $scope.totalSize = data.data.size;
	        		$scope.followersLoader = false;
	                $scope.followerObject =  $scope.followerAllList = $scope.followerAllList.concat(data.data.followers);
	            } else {
	                $scope.followersLoader = false;
	                $scope.resultNotFound = true;
	            }
			});
		}
    }

    $scope.getFollowersList();

    $scope.loadMore = function() {
        $scope.getFollowersList();
    };
}]);


app.controller('FollowingsController',['$cookieStore', '$rootScope', '$scope', '$http', '$location', '$timeout', '$routeParams', 'ProfileService', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $routeParams, ProfileService) {
	$scope.resultNotFound = false;
	$scope.followingsObject = [];
	$scope.followerAllList = [];
	$scope.allRes = 1;
	$scope.totalSize = 0
	$scope.getFollowingsList = function() {		
		var opts = {};
		var limit_start = $scope.followerAllList.length;
		opts.user_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = APP.friend_list_pagination.end;
		if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
			$scope.followersLoader = true;
			$scope.allRes = 0;
			ProfileService.getFollowings(opts, function(data) {
				$scope.allRes = 1;
	        	if(data.code == '101') {
	                $scope.totalSize = data.data.size;
	        		$scope.followersLoader = false;
	                $scope.followingsObject =  $scope.followerAllList = $scope.followerAllList.concat(data.data.followers);
	            } else {
	                $scope.followersLoader = false;
	                $scope.resultNotFound = true;
	            }
			});
		}
    }

    $scope.getFollowingsList();

    $scope.loadMore = function() {
        $scope.getFollowingsList();
    };
}]);

//Shop followers controllers section
app.controller('ShopFollowersController',['$scope', '$http', '$routeParams', '$location', '$timeout', 'StoreService', function ($scope, $http, $routeParams, $location, $timeout, StoreService) {
   // $scope.$route = $route;
    $scope.storeAllList = [];
    $scope.storeFollowersDetail = [];
    $scope.totalSize = 0;
    $scope.notFound = false;
    $scope.allRes = 1;
    $scope.nofollow = false;
    $scope.storeMainId = $routeParams.id;
    $scope.storeLoading = true;
    $scope.shopFollowers = function() {
        var opts = {};
        var limit_start = $scope.storeAllList.length;
        opts.limit_start = limit_start;
        opts.limit_size = APP.store_list_pagination.end;
        opts.user_id = APP.currentUser.id;
        opts.shop_id = $scope.storeMainId;
      if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
          $scope.storeLoading = true;
          $scope.allRes = 0;
         StoreService.userfollowingshops(opts, function(data) {
            if(data.code == 101) {
                $scope.allRes = 1;
                $scope.totalSize = data.data.total;
                $scope.storeLoading = false;
                $scope.storeFollowersDetail =  $scope.storeAllList = $scope.storeAllList.concat(data.data.user_info);
                $scope.notFound = false;
                $scope.nofollow = true;
            } else {
                $scope.storeFollowersDetail =  [];
                $scope.storeLoading = false;
                $scope.notFound = true;
            } 
        });
     }  
    };
    $scope.shopFollowers();
    $scope.loadMore = function() {     
        $scope.shopFollowers();
    };
}]);