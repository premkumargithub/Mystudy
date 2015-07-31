describe('SixthContinent: shopWalletController to test the function of the shop wallet controller', function(){

	beforeEach(module('SixthContinent'));
	var ctrl, $scope, httpBackend, $timeout;

	beforeEach(inject(function($controller, $rootScope, $httpBackend, _$timeout_){
		httpBackend = $httpBackend;
		$scope = $rootScope.$new();
		$timeout = _$timeout_;
		ctrl = $controller('shopWalletController',{
			$scope : $scope
		});
	}));

	it("\n\t getData function exists", function(){
		 expect(angular.isFunction($scope.getData)).toBe(true);
	});

	it("\n\t check default value of currentTab ", function(){
		console.log($scope.currentTab);
		expect($scope.currentTab).toBe(1);
	});

	it("\n\t check value of currentTab on calling getData function ", function(){
		$scope.getData(2);
		expect($scope.currentTab).toEqual(2);
	});

	// test case to check all the function of the sale tab
		it("\n\tfunction exists for tab sale", function(){
			expect($scope.pagination).toBe(false);
			expect($scope.currentPage).toBe(0);
			$scope.getData(1);
	        expect(angular.isFunction($scope.getShopWallet)).toBe(true);
	        expect(angular.isFunction($scope.shopPreniumHistory)).toBe(true);
	    });
		it("\n\tfunction exists for shopping card", function(){
			expect($scope.pagination).toBe(false);
			expect($scope.currentPage).toBe(0);
			$scope.getData(2);
	        expect(angular.isFunction($scope.getShopWalletShoppingCard)).toBe(true);
	    });
	    it("\n\tfunction exists for coupon", function(){
	    	expect($scope.pagination).toBe(false);
			expect($scope.currentPage).toBe(0);
			$scope.getData(3);
	        expect(angular.isFunction($scope.getCoupon)).toBe(true);
	    });
	    it("\n\tfunction exists for history", function(){
	    	expect($scope.pagination).toBe(false);
			expect($scope.currentPage).toBe(0);
			$scope.getData(4);
	        //expect(angular.isFunction($scope.showHistory)).toBe(true);
	    });
	    it("\n\tfunction exists for sale history", function(){
	    	expect($scope.pagination).toBe(false);
			expect($scope.currentPage).toBe(0);
			$scope.getData(5);
	        expect(angular.isFunction($scope.getSaleHistory)).toBe(true);
	    });
	    it("\n\tfunction exists for sale history", function(){
	    	expect($scope.pagination).toBe(false);
			expect($scope.currentPage).toBe(0);
			$scope.getData(6);
	        expect(angular.isFunction($scope.getSaleHistory)).toBe(true);
	    });
	    it("\n\tfunction exists for payment history", function(){
	    	expect($scope.pagination).toBe(false);
			expect($scope.currentPage).toBe(0);
			$scope.getData(7);
	        expect(angular.isFunction($scope.getCreditCard)).toBe(true);
	        expect(angular.isFunction($scope.pendingPayment)).toBe(true);
	    });

	// end of get function


	// Tab 1 function's
	it("\n\t check the getShopWallet service call on  function ", function(){
		$scope.reqObj = getWalletRequest;	
		spyOn($scope, 'getShopWallet').and.callThrough();
		$scope.getShopWallet();
		httpBackend.expect('POST', APP.service.batchApplane,$scope.getShopWallet).respond({
			code : 101
		});		
		expect($scope.getShopWallet).toHaveBeenCalled();
	});

	it("\n\t check the shopPreniumHistory service call on  function ", function(){
		$scope.reqObj = preniumRequest;	
		spyOn($scope, 'shopPreniumHistory').and.callThrough();
		$scope.shopPreniumHistory();
		httpBackend.expect('POST', APP.service.batchApplane,$scope.shopPreniumHistory).respond({
			code : 101
		});		
		expect($scope.shopPreniumHistory).toHaveBeenCalled();
	});

	it("\n\t check the shopPreniumHistory service call on  function ", function(){
		$scope.reqObj = couponReq;	
		spyOn($scope, 'getCoupon').and.callThrough();
		$scope.getCoupon();
		httpBackend.expect('POST', APP.service.batchApplane,$scope.getCoupon).respond({
			code : 101
		});		
		expect($scope.getCoupon).toHaveBeenCalled();
	});
});
