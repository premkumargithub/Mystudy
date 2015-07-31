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
		
		$window = $window;

		//create contorller;
		ctrl = $controller('CouponController', {
			$scope: $scope
		});
}));
	// check for function createcoupon function
	/*it('createCoupon method :: should have a createCoupon function', inject(function() {
        expect(angular.isFunction($scope.createCoupon)).toBe(true);
    }));*/
	
});
