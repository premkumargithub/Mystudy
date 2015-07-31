describe('SixthContinent: shopWalletController Controller test', function(){
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
		ctrl = $controller('shopWalletController', {
			$scope: $scope
		});
}));
	// check for function paymentAmount function
	it('paymentAmount method :: should have a paymentAmount function', inject(function() {
        expect(angular.isFunction($scope.paymentAmount)).toBe(true);
    }));
    // check for function listPendingListing function
	it('listPendingListing method :: should have a listPendingListing function', inject(function() {
        expect(angular.isFunction($scope.listPendingListing)).toBe(true);
    }));
    // check for  function payPendingAmount
    it('payPendingAmount method :: should have a payPendingAmount function', inject(function(){
        expect(angular.isFunction($scope.payPendingAmount)).toBe(true);
    }));

    // check for  function showListPay
    it('showListPay method :: should have a showListPay function', inject(function(){
        expect(angular.isFunction($scope.showListPay)).toBe(true);
    }));
   
    // check for the service of paymentAmount 

    it('paymentAmount method request :: Successful request', function(){
      var opts ={};
        opts.shop_id = 30008;
        opts.user_id = 30035;
        spyOn($scope, 'paymentAmount').and.callThrough();
        $scope.paymentAmount();
        httpBackend.expect('POST', APP.service.getTotalPendingPayments, opts).respond({
 			code : 101
	    });	     
        expect($scope.paymentAmount).toHaveBeenCalled();
    });

    // check for the service of listPendingListing 

    it('listPendingListing method request :: Successful request', function(){
        var opts ={};
        opts.shop_id = 30008;
        opts.user_id = 30035;
        opts.limit_start = 0;
        opts.limit_size = 10;
        spyOn($scope, 'listPendingListing').and.callThrough();
        $scope.listPendingListing();
        httpBackend.expect('POST', APP.service.getTotalPaymentListing, opts).respond({
 			code : 101
	    });	     
        expect($scope.listPendingListing).toHaveBeenCalled();
    });
    
    // check for the service of payPendingAmount 

    it('payPendingAmount method request :: Successful request', function(){
         var opts ={};
        opts.shop_id = 30008;
        opts.user_id = 30035;
        opts.cancel_url = 'https://www.sixthcontinent.com/#/shop/wallet/30008'; 
        opts.return_url = 'https://www.sixthcontinent.com/#/shop/wallet/30008'; 
        spyOn($scope, 'payPendingAmount').and.callThrough();
        $scope.payPendingAmount();
        httpBackend.expect('POST', APP.service.getRecurringPaymenturls, opts).respond({
 			code : 101
	    });	     
        expect($scope.payPendingAmount).toHaveBeenCalled();
    });

});
