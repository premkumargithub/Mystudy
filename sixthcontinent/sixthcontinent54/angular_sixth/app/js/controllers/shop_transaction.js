app.controller('ShopTransactionController', ['$timeout','$scope', '$http', 'ShopTransactionService','StoreService', '$routeParams', 'focus', function ($timeout, $scope, $http, ShopTransactionService, StoreService, $routeParams, focus) {
	$scope.shopListLoader = true;
	$scope.isLoadTransaction =  false;
	$scope.isLoadMore = false;
	$scope.transactioStoreList = [];
	$scope.transShopId = $routeParams.shopId;
	$routeParams.id = $routeParams.shopId;
	$scope.storeMainId = $routeParams.id;
	$scope.transUserId = '';
	$scope.transAmount = '';
	$scope.errorMsg = '';
	$scope.errorCls = '';
	$scope.inValidMsg = '';
	$scope.totalSize = 0;
	$scope.myRes = 1;
	$scope.creditAmount = {};
	$scope.transactionSelect = {};
	$scope.totalSize = 0;
    $scope.firstPage = APP.store_transaction.end;
    $scope.itemsPerPage = APP.store_transaction.end;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.payRequest = false;
    $scope.approveReq = false;
        
    $scope.setStoreId = function(storeId){
		$scope.transShopId = storeId;
	}

	//calling function to get customer transaction for the open shop
	$scope.transactionlist= {};
	$scope.transactionObjectList = [];
	$scope.hasNext = true;
	$scope.getTransactions = function(itemsPerPage) {
		$scope.transactionSelect = {};
		$scope.creditAmount.amount = '';
		$scope.step = 1;
		$scope.notFound = false;
		$scope.errorMsg = '';
		$scope.errorCls = '';
		var limit_size = itemsPerPage;
		var limit_start = ($scope.currentPage-1)*itemsPerPage; 
		if($scope.transShopId == ''){
			$scope.errorMsg = $scope.i18n.shop_transaction.shop_not_selected;
			return false;
		}
		var opts = {};
		$scope.requestSending = true;
		if($scope.transactionlist.searchKey !== undefined  && $scope.transactionlist.searchKey !== ''){
			opts = {"$collection":APP.applaneTables.transaction,"$parameters":{},"$filter":{"$or":[{"citizen_id.name":{"$regex":".*"+$scope.transactionlist.searchKey+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+$scope.transactionlist.searchKey+".*", $options: 'i'}}],"status":{"$in":["Initiated","Pending"]},"shop_id._id":$scope.transShopId},"$limit":limit_size,"$skip":limit_start, "$sort":{"date":-1}};
		} else {
			opts = {"$collection":APP.applaneTables.transaction,"$parameters":{},"$filter":{"status":{"$in":["Pending","Initiated"]},"shop_id._id":$scope.transShopId},"$limit":limit_size,"$skip":limit_start, "$sort":{"date":-1}};
		}
		if ($scope.myRes === 1) {
			$scope.myRes = 0;
			ShopTransactionService.getTransactions(opts, function(data) {
				$scope.requestSending = false;
				$scope.isLoadMore = false;
				if(data.code == 200) {
					if(data.response.result !== undefined || data.response.result.length !== 0){
						if($scope.isLoadTransaction == false){
							$scope.transactionObjectList = [];
						}
						
						var tempopts = {};
	                    if($scope.transactionlist.searchKey !== undefined  && $scope.transactionlist.searchKey !== ''){
	                    	tempopts = {"$collection":APP.applaneTables.transaction,"$filter":{"$or":[{"citizen_id.name":{"$regex":".*"+$scope.transactionlist.searchKey+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+$scope.transactionlist.searchKey+".*", $options: 'i'}}],"status":{"$in":["Pending","Initiated"]},"transaction_type_id":"553209267dfd81072b176bbc","shop_id._id":$scope.transShopId},"$group":{"count":{"$sum":1},"_id":null}};
	                    } else {
	                    	tempopts = {"$collection":APP.applaneTables.transaction,"$filter":{"status":{"$in":["Pending","Initiated"]},"transaction_type_id":"553209267dfd81072b176bbc","shop_id._id":$scope.transShopId},"$group":{"count":{"$sum":1},"_id":null}};
	                    }
	                    
	                    ShopTransactionService.getTransactions(tempopts, function(data) {
	                    	if(data.code === 200) {
	                    		$scope.requestSending = false;
	                    		var count = 0;
	                    		if(data.response.result.length !== 0 && data.response.result !== undefined) {
	                    			count = data.response.result[0].count;
	                    		} 
                    			$scope.totalItems = Math.ceil(parseInt(count)/itemsPerPage); 
			                    $scope.range = [];  
			                    for (var i=1; i<=$scope.totalItems; i++) {

			                        $scope.range.push(i);
			                 	} 
	                    	}else if(data.status === "error") {
								$scope.step = 1;
					        	$scope.errorMsg = $scope.i18n.shop_transaction.txn_server_error;
								$scope.isLoadMore = false;
					            $scope.notFound = true;
					            $scope.requestSending = false;
					        }
	                    });
	                    $scope.transactionObjectList = data.response.result;
	                    $scope.isLoadTransaction = false;
					}
                    $scope.hasNext = data.response.dataInfo.hasNext;
                    $scope.myRes = 1;
				} else if(data.status === "error") {
					$scope.step = 1;
		        	$scope.errorMsg = $scope.i18n.shop_transaction.txn_server_error;
					$scope.isLoadMore = false;
		            $scope.notFound = true;
		            $scope.requestSending = false;
		        }

			});
		}
	}
	//calling 
	$scope.getTransactions($scope.itemsPerPage);
	
	//back to previous
	$scope.back = function() {
		$scope.errorMsg = '';
		$scope.errorCls = '';
		$scope.inValidMsg = '';
		$scope.step--;
	}

	// loading more transaction list
	$scope.loadMoreTransaction = function() {
	    $scope.isLoadTransaction = true;
        $scope.isLoadMore = true;
        $scope.getTransactions($scope.itemsPerPage);
         
    };

    // loading more transaction list
	$scope.searchTransaction = function() {
		$scope.hasNext =  true;
		$scope.currentPage = 1;
        $scope.transactionObjectList = [];
        $scope.getTransactions($scope.itemsPerPage);
        
    };

    // loading more transaction list
	$scope.getTransactionList = function() {
		$scope.hasNext =  true;
		$scope.currentPage = 1;
		$scope.transactionlist.searchKey = '';
		$scope.transactionObjectList = [];
        $scope.getTransactions($scope.itemsPerPage);
        
    };

    //function to get the transaction detail window
	$scope.getTransactionDetail = function() {
		$scope.notFound = false;
		$scope.errorMsg = '';
		$scope.errorCls = '';
		$scope.transactionObject = [];
		
		if($scope.transactionSelect.id === '' || $scope.transactionSelect.id === undefined){
			$scope.step = 1;
			$scope.errorMsg = $scope.i18n.shop_transaction.transaction_not_select;
			return false;
		} 
		$scope.requestSending = true;
		var opts = {};
		opts = {"$collection":APP.applaneTables.transaction,"$parameters":{},"$filter":{"_id":$scope.transactionSelect.id}}
		
		ShopTransactionService.getTransactionDetail(opts, function(data) {
			if(data.code === 200) {
				$scope.transactionObject = data.response.result[0];
				if($scope.transactionObject.status === 'Pending'){ // status pending from shop side
					$scope.step = 3;
				} else if($scope.transactionObject.status === 'Approved' || $scope.transactionObject.status === 'Rejected'){ // status Rejected or approved from shop side
					$scope.step = 6; //show only detail not any action can taken
				} else {
					$scope.step = 2;
				}
				$scope.requestSending = false;
			} else if(data.code === 300) {
				$scope.requestSending = false;
				$scope.transactionObject = {};
				$scope.errorMsg = $scope.i18n.shop_transaction.missed_parameter;
			} else if(data.status === "error") {
				$scope.step = 1;
	        	$scope.transactionObject = {};
				$scope.errorMsg = $scope.i18n.shop_transaction.txn_server_error;
				$scope.isLoadMore = false;
	            $scope.notFound = true;
	            $scope.requestSending = false;
	        }
		});
		
	};


    //function to accepte the payment amount
    $scope.paymentFormSubmitted = false;
	$scope.payAmount = function() {
		$scope.paymentFormSubmitted = true;
		$scope.payRequest = true;
		$scope.errorMsg = '';
		$scope.errorCls = '';
		$scope.inValidMsg = '';
		if($scope.creditAmount.amount === '' || $scope.creditAmount.amount === undefined){
			$scope.errorMsg = '';
			$scope.errorCls = '';
			$scope.inValidMsg = '';
			var regex = new RegExp(/^([0-9\.]+)$/);
			var tempReg =  new RegExp(/^\d{0,4}(\d\.\d?|\.\d)?\d?$/);
			if($scope.creditAmount.amount == '' || $scope.creditAmount.amount == undefined){
			$scope.step = 2;
			$scope.errorCls = 'has-error';
			$scope.inValidMsg = $scope.i18n.shop_transaction.enter_amount;
			$scope.payRequest = false;
			focus('payamount');
			return false;
			} else if (!regex.test($scope.creditAmount.amount)) {
			$scope.step = 2;
			$scope.errorCls = 'has-error';
			$scope.payRequest = false;
			focus('payamount');
			$scope.inValidMsg = $scope.i18n.shop_transaction.decimal_digit_only;
			return false;
			} else if (!tempReg.test($scope.creditAmount.amount)) {
			$scope.step = 2;
			$scope.errorCls = 'has-error';
			$scope.payRequest = false;
			focus('payamount');
			$scope.inValidMsg = $scope.i18n.shop_transaction.decimal_number_only;
			return false;
			}
		} else {
			$scope.requestSending = false;
			if($scope.transactionObject.do_transaction === "With Point") {
				opts = [{"$update":[{"_id":$scope.transactionSelect.id,"$set":{"transaction_value":$scope.creditAmount.amount,"status":"Pending"}}],"$collection":APP.applaneTables.transaction,"$fields":{"discount_details":1,"payble_value":1,"shot_value":1,"coupon_value":1,"dp_value":1,"upto_50_value":1,"new_upto_50_value":1,"upto_100_value":1}}];
			} else if($scope.transactionObject.do_transaction === "Without Point") {
				opts = [{"$update":[{"_id":$scope.transactionSelect.id,"$set":{"transaction_value":$scope.creditAmount.amount,"status":"Pending"}}],"$collection":APP.applaneTables.transaction}];
			}
			ShopTransactionService.updateTransactionObject(opts, function(data) {
				$scope.creditAmount.amount = undefined;
				if(data.code === 200) {
					$scope.payRequest = false;
					var tempopts = {};
					tempopts = {"$collection":APP.applaneTables.transaction,"$parameters":{},"$filter":{"_id":$scope.transactionSelect.id}}
					$scope.getTransactionDetail();
				} else if(data.status === "error") {
					$scope.step = 2;
		        	$scope.transactionCreditObject = {};
					$scope.errorMsg = $scope.i18n.shop_transaction.txn_server_error;
					$scope.notFound = true;
		            $scope.requestSending = false;
		            $scope.payRequest = false;
		        }
			});
		}
	};


	
	//opening transaction detal when coming from notification
	var txnObj = ShopTransactionService.getTransactionTab();
	if(txnObj.hasOwnProperty('tab')&&txnObj.hasOwnProperty('txnId')) {
		$scope.step = txnObj.tab;
		$scope.transactionSelect.id = txnObj.txnId;
		ShopTransactionService.setTransactionTab({});
		$scope.getTransactionDetail();
	} else {
		$scope.step = 1;
		$scope.transTransactionId = '';
	}

	
	/*calling approve credit service to payment in final stage
	* take response 1 for accept 2 for deny
	*/
	var userResponse = '';
	$scope.approveCredit = function(userResponse) {
		$scope.transactionApproveObject = {};
		$scope.approveReq = true;
		userResponse = userResponse;
		if(userResponse === '' || userResponse === undefined){
			$scope.step = 3;
			$scope.errorMsg = $scope.i18n.shop_transaction.no_response;
			return false;
		}
		$scope.requestSending = true;
		$scope.step = 3;
		var opts = {};
		if($scope.transactionObject.do_transaction === "With Point") {
			opts=[{"$update":[{"_id":$scope.transactionObject._id,"$set":{"status":$scope.TransResponse}}],"$collection":APP.applaneTables.transaction,"$fields":{"_id":1,"discount_details":1,"payble_value":1,"shot_value":1,"coupon_value":1,"dp_value":1,"upto_50_value":1,"new_upto_50_value":1,"upto_100_value":1}}];
		} else if($scope.transactionObject.do_transaction === "Without Point") {
			opts=[{"$update":[{"_id":$scope.transactionObject._id,"$set":{"status":$scope.TransResponse}}],"$collection":APP.applaneTables.transaction,"$fields":{"_id":1,"payble_value":1}}];
		}
		ShopTransactionService.updateTransactionObject(opts, function(data) {
			$scope.approveReq = false;
			if(data.code == 200) {
				var tempopts = {};
				tempopts = {"$collection":APP.applaneTables.transaction,"$parameters":{},"$filter":{"_id":data.response.sixc_transactions.$update[0]._id}}
			
				ShopTransactionService.getTransactionDetail(tempopts, function(data) {
					if(data.code == 200) {
						$scope.transactionApproveObject = data.response.result[0];
						if(userResponse === 1) {
							$scope.requestSending = false;
							$scope.step = 4;
						} else if(userResponse === 2){
							$scope.requestSending = false;
							$scope.step = 5;
						}	
					} else if(data.status == "error") {
						$scope.step = 1;
			        	$scope.transactionObject = {};
						$scope.errorMsg = $scope.i18n.shop_transaction.txn_server_error;
						$scope.notFound = true;
						$scope.requestSending = false;	
			        }
				});
			} else if(data.status === "error") {
				$scope.step = 3;
	        	$scope.transactionApproveObject = {};
				$scope.errorMsg = $scope.i18n.shop_transaction.txn_server_error;
				$scope.notFound = true;
				$scope.requestSending = false;	
	        }
		});
	};

	//cancel transaction in progess window
	$scope.cancelTransaction = function() {
		$scope.errorMsg = '';
		$scope.errorCls = '';
		$scope.TransResponse = "Rejected";
		$scope.approveCredit(2); //2 for cancel
	}

	//approve transaction in progess window
	$scope.confirmTransaction = function() {
		$scope.errorMsg = '';
		$scope.errorCls = '';
		$scope.TransResponse = "Approved";
		$scope.approveCredit(1); //1 for cancel
	}

    $scope.changePageMore = function(pageNo) {
        $scope.currentPage = pageNo;
        $scope.loadMoreTransaction();
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
        $scope.loadMoreTransaction();
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 1 ? "disabled" : "";
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalItems) {
            $scope.currentPage++;
        }
       $scope.loadMoreTransaction();
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        $scope.loadMoreTransaction($scope.itemsPerPage);
    };
}]);