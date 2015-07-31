app.controller('TopPublicShopController', ['$scope', '$http', 'TopLinkService', function ($scope, $http, TopLinkService) {
	$scope.storeLoading = true;
	$scope.listActive = 'active';
	$scope.gridActive = '';
	//get Top shop per revenue 
	$scope.getTopShopPerRevenue = function() {
		var opts = {};
		opts.limit_size = 50;
		TopLinkService.getTopShopPerRevenue(opts, function(data) {
			if(data.code == 101) {
				$scope.topShopPerRevenue = data.data;
				$scope.storeLoading = false;
			} else {
				$scope.topShopPerRevenue = {};
				$scope.storeLoading = false;
			}
		});
	};

	$scope.changeView = function(type) {
		if(type === 'list') {
			$scope.listActive = 'active';
			$scope.gridActive = '';
		} else {
			$scope.listActive = '';
			$scope.gridActive = 'active';
		}

	};

	$scope.getTopShopPerRevenue();
}]);

app.controller('TopLinkedCitizenController', ['$scope', '$http', 'TopLinkService', function ($scope, $http, TopLinkService) {
	$scope.citizenTopLinkLoader = true;
	$scope.listActive = 'active';
	$scope.gridActive = ''; 
	$scope.getTopCitizenTopLink = function() {
		var opts = {};
		opts.limit_start = 0;
		opts.limit_size = 50;
		TopLinkService.getTopLinkedCitizen(opts, function(data) {
			if(data.code == 101) {
				$scope.topLinkedCitizen = data.data.data;
				$scope.citizenTopLinkLoader = false;
			} else {
				$scope.topLinkedCitizen = {};
				$scope.citizenTopLinkLoader = false;
			}
		});
	};

	$scope.changeView = function(type) {
		if(type === 'list') {
			$scope.listActive = 'active';
			$scope.gridActive = '';
		} else {
			$scope.listActive = '';
			$scope.gridActive = 'active';
		}

	};

	$scope.getTopCitizenTopLink();
}]);

app.controller('TopCitizenIncomeController', ['$scope', '$http', 'TopLinkService', function ($scope, $http, TopLinkService) {
	$scope.topCitizenPerincomeLoader = true;
	$scope.listActive = 'active';
	$scope.gridActive = '';

	//get Top citizen per income 
	$scope.getTopCitizenPerIncome = function() {
		var opts = {};
		opts.limit_size = 50;
		TopLinkService.getTopCitizenPerIncome(opts, function(data) {
			if(data.code == 101) {
				$scope.topCitizenPerIncome = data.data;
				$scope.topCitizenPerincomeLoader = false;
			} else {
				$scope.topCitizenPerIncome = {};
				$scope.topCitizenPerincomeLoader = false;
			}
		});
	}

	$scope.changeView = function(type) {
		if(type === 'list') {
			$scope.listActive = 'active';
			$scope.gridActive = '';
		} else {
			$scope.listActive = '';
			$scope.gridActive = 'active';
		}

	};

	$scope.getTopCitizenPerIncome();
}]);