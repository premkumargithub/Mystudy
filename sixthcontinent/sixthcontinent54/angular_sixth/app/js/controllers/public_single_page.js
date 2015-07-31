app.controller('SinglePostController', ['$scope', '$rootScope', 'ipCookie', '$http', '$routeParams', '$location', 'PublicService', function($scope, $rootScope, ipCookie, $http, $routeParams, $location, PublicService) {
	if( localStorage.getItem('loggedInUser') && localStorage.getItem('access_token')) {
		$location.path('post/'+$routeParams.postId);
	} else {
		$rootScope.isPublic = true;
		$scope.postPageLoader = true;
		$scope.postPageNotFound = false;
		var opts = {};
		opts.post_id = $routeParams.postId;
		opts.post_type = 'user';
		PublicService.getPublicPost(opts, function(data) {
			if(data.code == 101) {
				$scope.postPageLoader = false;
				$scope.posts = data.data.post;
				$rootScope.publicUser = data.data.post[0];
			} else {
				$scope.posts = [];
				$scope.postPageLoader = false;
				$scope.postPageNotFound = true;
			}
		});
	}

}]);

/**
* Open Public Shop post for unauthorized User 
*/
app.controller('ClubSinglePostController', ['$scope', '$rootScope', 'ipCookie', '$http', '$routeParams', '$location', 'PublicService', function($scope, $rootScope, ipCookie, $http, $routeParams, $location, PublicService) {
	if( localStorage.getItem('loggedInUser') && localStorage.getItem('access_token')) {
		$location.path('/club/'+$routeParams.postId+'/post/'+$routeParams.postId+'/'+$routeParams.status);
	} else {
		$rootScope.isPublic = true;
		$scope.postPageLoader = true;
		$scope.postPageNotFound = false;
		var opts = {};
		opts.post_id = $routeParams.postId;
		opts.post_type = 'club';
		PublicService.getPublicPost(opts, function(data) {
			if(data.code == 101) {
				$scope.postPageLoader = false;
				$scope.posts = data.data.post;
				$rootScope.publicUser = data.data.post[0];
			} else {
				$scope.posts = [];
				$scope.postPageLoader = false;
				$scope.postPageNotFound = true;
			}
		});
	}

}]);

/**
* Open Public Shop post for unauthorized User 
*/
app.controller('ShopSinglePostController', ['$scope', '$rootScope', 'ipCookie', '$http', '$routeParams', '$location', 'PublicService', function($scope, $rootScope, ipCookie, $http, $routeParams, $location, PublicService) {
	if( localStorage.getItem('loggedInUser') && localStorage.getItem('access_token')) {
		$location.path('/shop/'+$routeParams.shopId+'/post/'+$routeParams.postId);
	} else {
		$rootScope.isPublic = true;
		$scope.postPageLoader = true;
		$scope.postPageNotFound = false;
		var opts = {};
		opts.post_id = $routeParams.postId;
		opts.post_type = 'shop';
		PublicService.getPublicPost(opts, function(data) {
			if(data.code == 101) {
				$scope.postPageLoader = false;
				$scope.posts = data.data.post;
				$rootScope.publicUser = data.data.post[0];
			} else {
				$scope.posts = [];
				$scope.postPageLoader = false;
				$scope.postPageNotFound = true;
			}
		});
	}

}]);
