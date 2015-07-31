app.controller('ShopTransactionHistoryController',['$timeout','$scope', '$http', 'ShopTransactionService','StoreService', '$routeParams', function ($timeout, $scope, $http, ShopTransactionService, StoreService, $routeParams) {
	$scope.step = 1;
	$scope.shopListLoader = true;
	$scope.isLoadTransaction =  false;
	$scope.transactionHistoryObjectList = [];
	$scope.transShopId = $routeParams.shopId;
	$routeParams.id = $routeParams.shopId;
	$scope.storeMainId = $routeParams.id;
	$scope.transUserId = '';
	$scope.errorMsg = '';
	$scope.totalSize = 0;
	$scope.myRes = 1;
	
	$scope.setStoreId = function(storeId){
		$scope.transShopId = storeId;
	}

	//check screen for mobile devicess to show corresponding layou
    $scope.loadMoreFunc = 'loadMoreTransaction()';
    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth = newValue.w;
        if($scope.windowWidth <= '768'){
            $scope.isSmallScreen =  true; //declare in main controller
            $scope.loadMoreFunc = '';
        } else {
            $scope.isSmallScreen =  false; //declare in main controller
            $scope.loadMoreFunc = 'loadMoreTransaction()';
        }
    }, true);

	//calling function to get customer transaction for the open shop
	$scope.transactionlist= {};
	$scope.getHistoryList = function() {
		$scope.step = 1;
		$scope.notFound = false;
		$scope.errorMsg = '';
		var limit_start = 100;
		limit_start = limit_start + 5;
		if($scope.transShopId == ''){
			$scope.errorMsg = $scope.i18n.shop_transaction.shop_not_selected;
			return false;
		}
		
		$scope.requestSending = true;
		var opts = {};
		opts.shop_id = $scope.transShopId;
		$scope.transShopId = '551e6792236f510813100730'; // dummy id as applane doesnot contain any id
		if($scope.transactionlist.searchKey != undefined  && $scope.transactionlist.searchKey != ''){
			$scope.totalSize = 0;
			opts = {"$collection":"sixc_transactions","$parameters":{},"$filter":{"$and":[{"shop_id._id":$scope.transShopId, "status":"Initiated"},{"$or":[{"citizen_id.name":$scope.transactionlist.searchKey},{"citizen_id._id":$scope.transactionlist.searchKey}]}]},"$limit":limit_start,"$skip":0}
		} else {
			opts = {"$collection":"sixc_transactions","$parameters":{},"$filter":{"shop_id._id":$scope.transShopId, "status":"Initiated"},"$limit":limit_start,"$skip":0};
		}
		if ((($scope.totalSize > limit_start ) || $scope.totalSize == 0 ) && $scope.myRes == 1) {
			ShopTransactionService.getTransactionObjects(opts, function(data) {
				$scope.requestSending = false;
				$scope.myRes = 0;
				if(data.code == 200) {
					$scope.requestSending = false;
					$scope.isLoadMore = false;
					if(data.response.result != undefined || data.response.result.length != 0){
                        $scope.transactionHistoryObjectList = data.response.result;
                        $timeout(function(){
							$('#scroll-pane').perfectScrollbar('update');  // Update
						}, 100);
                    }
					$scope.totalSize = data.response.result.length;
					$scope.myRes = 1;
					if($scope.isLoadTransaction == false){
						$timeout(function(){
						$('#scroll-pane').perfectScrollbar();  // initiate
					}, 100);
					}
				} else if(data.code == 171) {
					$scope.transactionHistoryObjectList;
		            $scope.errorMsg = $scope.i18n.shop_transaction.missed_parameter;
		            $scope.notFound = true;
		            $scope.requestSending = false;
		            $scope.isLoadMore = false;
		        } else if(data.code == 172) {
					$scope.transactionHistoryObjectList;
		            $scope.errorMsg = $scope.i18n.shop_transaction.shop_status_not_valid;
		            $scope.notFound = true;
		            $scope.requestSending = false;
		            $scope.isLoadMore = false;
		        } else if(data.code == 173) {
					$scope.transactionHistoryObjectList;
		            $scope.errorMsg = $scope.i18n.shop_transaction.citizen_status_not_valid;
		            $scope.notFound = true;
		            $scope.requestSending = false;
		            $scope.isLoadMore = false;
		        } else if(data.code == 100) {
					$scope.transactionHistoryObjectList;
					$scope.errorMsg = $scope.i18n.shop_transaction.no_store_found;
		            $scope.notFound = true;
		            $scope.requestSending = false;
		            $scope.isLoadMore = false;
		        }
			});
		}
	}
	//calling 
	$scope.getHistoryList();
	
	//back to previous
	$scope.back = function() {
		$scope.step--;
	}

	// loading more transaction list
	$scope.loadMoreTransaction = function() {
        if($scope.totalSize !=0){
            $scope.isLoadTransaction = true;
            $scope.isLoadMore = false;
            $scope.getHistoryList();
        }
    };

	//function to get the transaction detail window
	//function to get the transaction detail window
	$scope.transactionSelect = {};
	$scope.getTransactionDetail = function() {
		$scope.notFound = false;
		$scope.errorMsg = '';
		$scope.transactionObject = [];
		if($scope.transactionSelect.id == '' || $scope.transactionSelect.id == undefined){
			$scope.step = 1;
			$scope.errorMsg = $scope.i18n.shop_transaction.transaction_not_select;
			return false;
		} 
		//$scope.requestSending = true;
		$scope.requestSending = false;
		$scope.step = 2;
		var opts = {};
		opts = {"$collection":"sixc_transactions","$parameters":{},"$filter":{"_id":$scope.transactionSelect.id}}
		ShopTransactionService.getTransactionDetail(opts, function(data) {
			$scope.requestSending = false;
			if(data.code == 200) {
				$scope.requestSending = false;
				$scope.transactionObject = data.response.result[0];
				$scope.myRes = 1;
			} else if(data.code == 300) {
				$scope.requestSending = false;
				$scope.transactionObject = {};
				$scope.errorMsg = $scope.i18n.shop_transaction.missed_parameter;
				$scope.myRes = 1;
			} 
		});
	};
}]);