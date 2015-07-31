app.controller('CitizenAffiliatedkController',['$scope', '$http', 'AffiliatedkService', function ($scope, $http, AffiliatedkService) {
	$scope.followersLoader = true;
	$scope.resultNotFound = false;
	$scope.citizenAffiliate = [];
	$scope.affilateAllList = [];
	$scope.allRes = 1;
	$scope.totalSize = 0;
	$scope.firsttime = 1;
	$scope.getCitizenAffiliate = function() {
		var limit_start = $scope.citizenAffiliate.length;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = APP.affiliation.end;
		//console.log("total= "+ $scope.totalSize + "res= "+$scope.allRes + "start = "+ limit_start + " end = "+ APP.affiliation.end)
		if ((( $scope.totalSize > limit_start) || ($scope.totalSize === 0 && $scope.firsttime === 1)) && $scope.allRes === 1) {
			$scope.allRes = 0;
			$scope.followersLoader = true;
			AffiliatedkService.getCitizenAffiliates(opts, function(data) {
				$scope.allRes = 1;
				if(data.code == 101) {
					$scope.citizenAffiliate = $.merge($scope.citizenAffiliate, data.data.affiliates);
					$scope.totalSize = data.data.count;
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
					$scope.firsttime = 0;
				} else {
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
				}
			});
		}
	}

	$scope.getCitizenAffiliate();

    $scope.loadMore = function() {
    	$scope.getCitizenAffiliate();
    };
}]);

app.controller('ShopAffiliatedkController',['$scope', '$http', 'AffiliatedkService', function ($scope, $http, AffiliatedkService) {
	$scope.followersLoader = true;
	$scope.resultNotFound = false;
	$scope.shopAffiliate = [];
	$scope.allRes = 1;
	$scope.totalSize = 0;
	$scope.incomeTax = APP.incomeTax;
	$scope.firsttime = 1;
	$scope.getShopAffiliate = function() {
		var limit_start = $scope.shopAffiliate.length;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = APP.affiliation.end;
		//console.log("total= "+ $scope.totalSize + "res= "+$scope.allRes + "start = "+ limit_start + " end = "+ APP.affiliation.end)
		if ((( $scope.totalSize > limit_start) || ($scope.totalSize === 0 && $scope.firsttime) === 1) && $scope.allRes === 1) {
			$scope.allRes = 0;
			$scope.followersLoader = true;
			AffiliatedkService.getShopAffiliates(opts, function(data) {
				$scope.allRes = 1;
				if(data.code == 101) {
					$scope.shopAffiliate = $.merge($scope.shopAffiliate, data.data.affiliates);
					$scope.totalSize = data.data.count;
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
					$scope.firsttime = 0;
				} else {
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
				}
			});
		}
	}

	$scope.getShopAffiliate();

    $scope.loadMore = function() {
    	$scope.getShopAffiliate();
    };
}]);

app.controller('ShopAffiliatedkForBroker',['$scope', '$http', 'AffiliatedkService', function ($scope, $http, AffiliatedkService) {
	$scope.followersLoader = true;
	$scope.resultNotFound = false;
	$scope.shopAffiliate = [];
	$scope.allRes = 1;
	$scope.totalSize = 0;
	$scope.incomeTax = APP.incomeTax;
	$scope.getShopAffiliate = function() {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = APP.affiliation.start;
		opts.limit_size = 50;//APP.affiliation.end;
		if ($scope.allRes == 1) {
			$scope.allRes = 0;
			$scope.followersLoader = true;
			AffiliatedkService.getShopAffiliates(opts, function(data) {
				$scope.allRes = 1;
				if(data.code == 101) {
					$scope.filterItems(data.data.affiliates, function(data) {
						$scope.shopAffiliate = data;
					});
					$scope.totalSize = data.data.count;
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
				} else {
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
				}
			});
		}
	};

	$scope.filterItems = function(orders, callback) {
		var filtered_list = [];
		var date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		for (var i = 0; i < orders.length; i++) {
			if(orders.created_at >= firstDay &&  orders.created_at <= lastDay) {
				filtered_list.push(orders[i]);
			}
		}
		callback(filtered_list);
	}

	$scope.getShopAffiliate();

}]);

app.controller('BrokerAffiliatedkController',['$scope', '$http', 'AffiliatedkService', function ($scope, $http, AffiliatedkService) {
	$scope.followersLoader = true;
	$scope.resultNotFound = false;
	$scope.brokerAffiliate = [];
	$scope.allRes = 1;
	$scope.totalSize = 0;
	$scope.getBrokerAffiliate = function() {
		var limit_start = $scope.brokerAffiliate.length;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = limit_start;
		opts.limit_size = APP.affiliation.end;
		if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
			$scope.allRes = 0;
			$scope.followersLoader = true;
			AffiliatedkService.getBrokerAffiliates(opts, function(data) {
				$scope.allRes = 1;
				if(data.code == 101) {
					$scope.brokerAffiliate = $.merge($scope.brokerAffiliate, data.data.affiliates);
					$scope.totalSize = data.data.count;
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
				} else {
					$scope.followersLoader = false;
					$scope.resultNotFound = true;
				}
			});
		}
	}
	$scope.getBrokerAffiliate();

    $scope.loadMore = function() {
    	$scope.getBrokerAffiliate();
    };
}]);