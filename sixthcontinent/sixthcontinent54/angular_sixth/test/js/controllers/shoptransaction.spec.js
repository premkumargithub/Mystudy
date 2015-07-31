describe('SixthContinent: ShopTransactionController Controller test', function(){
	var ctrl, $scope, httpBackend, $window, modalInstance;
	/**
	* Load Sixthcontinent module before execute any test
	*/
	beforeEach(module('SixthContinent'));
	/**
	* Inject required dependencies as $httpBackend, $controller and $rootscope etc
	*/
	beforeEach(inject(function($injector, $httpBackend, $controller, $rootScope, $window, $modal){
		httpBackend = $httpBackend;

		//create a new scope that's a child scope of $rootscope
		$scope = $rootScope.$new();
		
		$window = $window;

		//create contorller;
		ctrl = $controller('ShopTransactionController', {
			$scope: $scope
		});

	}));

		/**
	* test for the getTransactions method
	* @test "getTransactions" should be a method
	**/
	it('getTransactions method :: should have a getTransactions function', inject(function() {
        expect(angular.isFunction($scope.getTransactions)).toBe(true);
    }));

	/**
	 * test case for getTransactions method 
	 * @param: empty object no shop is selected by shopkeeper
	 * @test 'getTransactions' should call 
	 */
	it('getTransactions method :: transaction selection validation check', function(){	
		$scope.transactionObjReq = ""
    	$scope.i18n = { 
    		"shop_transaction":{
				"shop_not_selected":"Please select a shop",
			},
			"validation":{
				"MINIMUM_PARAMETER_REQUIRED":""
			}
		};			
		spyOn($scope, 'getTransactions').and.callThrough();
		$scope.getTransactions();		
		expect($scope.getTransactions).toHaveBeenCalled();
		expect($scope.errorMsg).toEqual($scope.i18n.shop_transaction.shop_not_selected);
	});

	it('getTransactions method :: Successful request', function(){	
    	$scope.shopTransaction = shopTransaction.transactionObjReq;		
		spyOn($scope, 'getTransactions').and.callThrough();
		$scope.getTransactions();
		httpBackend.expect('POST', APP.service.getTransaction,$scope.shopTransaction).respond({
			code : 101
		});		
		expect($scope.getTransactions).toHaveBeenCalled();
	});

	/**
	* test for the getTransactionsDetail method
	* @test "getTransactionsDetail" should be a method
	**/
	it('getTransactionDetail method :: should have a getTransactionDetail function', inject(function() {
        expect(angular.isFunction($scope.getTransactionDetail)).toBe(true);
    }));

	/**
	 * test case for getTransactionDetail method 
	 * @param: empty object no transaction is  not selected by shopkeeper
	 * @test 'getTransactionDetail' should call 
	 */
	it('getTransactionDetail method :: transaction selection validation check', function(){	
		$scope.transactionObjReq = ""
    	$scope.i18n = { 
    		"shop_transaction":{
				"transaction_not_select":"Please select a transaction",
			},
			"validation":{
				"MINIMUM_PARAMETER_REQUIRED":"",
				"USER_DOES_NOT_EXIT":"",
			}
		};			
		spyOn($scope, 'getTransactionDetail').and.callThrough();
		$scope.getTransactionDetail();		
		expect($scope.getTransactionDetail).toHaveBeenCalled();
		expect($scope.errorMsg).toEqual($scope.i18n.shop_transaction.transaction_not_select);
	});

	/**
	 * test case for getTransactionDetail method 
	 * @param: get the detail of the transaction byID
	 * @test 'getTransactionDetail' should call 
	 */
	it('getTransactionDetail method :: Successful request', function(){	
		$scope.transactionSelect.id = shopTransaction.transactionDetailReq.reqObj.transaction_id;
    	$scope.transaction = shopTransaction.transactionDetailReq;		
		spyOn($scope, 'getTransactionDetail').and.callThrough();
		$scope.getTransactionDetail();
		httpBackend.expect('POST', APP.service.getTransactionDetail,$scope.transaction).respond({
			code : 101
		});		
		expect($scope.getTransactionDetail).toHaveBeenCalled();
	});
});