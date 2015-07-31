describe('SixthContinent: CouponController Controller test', function(){
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

		var leftmenu = {
            "start_date":"Promotion start date",
            "end_date":"Promotion end date"
        }; 
    	$scope.i18n = {
           coupon:leftmenu
        };
		$window = $window;

		//create contorller;
		ctrl = $controller('CouponController', {
			$scope: $scope
		});

	}));
	
    it('createCoupon method :: should have a createCoupon function', inject(function() {
    	expect(angular.isFunction($scope.createCoupon)).toBe(true);
    }));

    it('getlistingData Method :: should have a getlistingData function' , inject(function(){
        expect(angular.isFunction($scope.getlistingData)).toBe(true);
    }));
    /*it('createCoupon method request :: Successful request', function(){
        var opts = [{"$insert":[{"code":"12101","description":"Descccc","discount":10,"end_date":"2015-04-09T00:00:00.000Z","keywords":{"$insert":[{"$query":{"_id":"5520cbdff8f74b971727f2fa"}},{"$query":{"_id":"55265bb1a5bb4ecf4d5ea586"}}]},"name":"100$CuponWithDiscount","offer_type":{"_id":"551ce49e2aa8f00f20d93295"},"shop_id":{"_id":"552009d5f392327d062dd229","name":"SinghBhai"},"start_date":"2015-04-01T00:00:00.000Z","tag_friends":{"$insert":[{"_id":"551d03d348619e4e34b7f060","name":"Kapil"},{"_id":"551ea819dc8637c1139a5275","name":"Amit Singh"}]},"title":"Titale","to_avail":5,"value":100}],"$collection":"sixc_offers"}]

        spyOn($scope, 'createCoupon').and.callThrough();
        $scope.createCoupon();
        httpBackend.expect('POST', APP.service.addUpdateApplaneData, opts).respond({
            code : 200
        });     
        expect($scope.createCoupon).toHaveBeenCalled();
    });*/
});
