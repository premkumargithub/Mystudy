describe('SixthContinent: PromotionController Controller test', function(){
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
		ctrl = $controller('PromotionController', {
			$scope: $scope
		});

	}));

		/**
	* test for the ShowDetail method
	* @test "ShowDetail" should be a method
	**/
	it('ShowDetail method :: should have a ShowDetail function', inject(function() {
        expect(angular.isFunction($scope.ShowDetail)).toBe(true);
    }));

    // test for execute the function ShowDetail()
    it('ShowDetail method execute' , inject(function(){
       // $scope.parameter ='coupon';
        spyOn($scope, 'ShowDetail').and.callThrough();
        $scope.ShowDetail();
        expect($scope.ShowDetail).toHaveBeenCalled();
        
    }));
});