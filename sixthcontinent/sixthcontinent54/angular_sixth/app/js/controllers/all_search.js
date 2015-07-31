app.controller('AllSearchProfile', ['$cookieStore', '$rootScope', '$scope', '$http', '$location', '$timeout', '$routeParams', 'ProfileService', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $routeParams, ProfileService) {
	$scope.searchType 		= 1;
	$scope.searchtext 		= $routeParams.text;
	$scope.allItems 		= [];
	$scope.itemSearching 	= false;
	$scope.activeTab 		= 'user';
	$scope.totalItems 		= 0;
	$scope.searchType 		= 1;
	$scope.res 				= 1;
	$scope.itemPerPage 		= 12;
	$scope.AllSearchloader 	= true;

	$scope.searchAllProfiles = function(type) {
		var limit_start = ($scope.allItems.length).toString();
		var opts = {};
			opts.user_id 	 = APP.currentUser.id;
			opts.search_text = $scope.searchtext;
			opts.search_type = type;
			opts.limit_start = limit_start;
			opts.limit_size  = $scope.itemPerPage;
		if ((( $scope.totalItems > limit_start) || $scope.totalItems == 0 ) && $scope.res == 1) {
			$scope.res 	= 0;
			$scope.AllSearchloader 	= true;
			ProfileService.getAllsearchProfiles(opts, function(data){
				$scope.res	= 1;
				if(data.code == 101) {
					$scope.AllSearchloader 	= false;
					$scope.allItems 		= $scope.allItems.concat(data.data.results);
					$scope.totalItems 		= data.data.total_count;
				} else {
					$scope.AllSearchloader 	= false;
				}
			});		
		}
	}

	$scope.searchAllProfiles($scope.searchType);

	$scope.changeItems = function(type) {
		$scope.allItems = [];
		$scope.totalItems = 0;
		$scope.res = 1;
		$scope.searchType = type;
		switch($scope.searchType) {
			case 1:
				$scope.activeTab = 'user'; break;
			case 2:
				$scope.activeTab = 'shop'; break;
			case 3:
				$scope.activeTab = 'club'; break;	
		}
		$scope.searchAllProfiles($scope.searchType); 
	};

	$scope.loadMore = function() {
		$scope.searchAllProfiles($scope.searchType);
	};	

}]);