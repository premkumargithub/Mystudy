describe('SixthContinent:  ResendLink user test', function(){  
    var ctrl, $scope, httpBackend, $window;	

	/**
	 * Load SixthContinent module before execute any test
	 */
    beforeEach(module('SixthContinent'));	
	
	/**
 	 * Inject required dependencies as $httpBackend, $controller and $rootScope
	 */
	beforeEach(inject(function($injector, $httpBackend, $controller, $rootScope, $window, $location) {
		httpBackend = $httpBackend;
		
		// Create a new scope that's a child of the $rootScope
		$scope = $rootScope.$new();
		$window= $window;

		// Create the controller
		ctrl = $controller('ResendLink', {
			$scope: $scope
		});		
	})); 

	it('Resendlink method :: should have a Resendlink function', inject(function() {
        expect(angular.isFunction($scope.Resendlink)).toBe(true);
    }));

    it('Resendlink method :: email should contaain @', inject(function() {
    	$scope.email = 'test@gmail.com';
    	expect($scope.email).toContain('@');
    }));

    it('Resendlink method :: Successful request', function(){
        $scope.email = 'test@gmail.com';
        var opts = {};
        opts.email = $scope.email;
        
        spyOn($scope, 'Resendlink').and.callThrough();
        $scope.Resendlink();
        httpBackend.expect('POST', APP.service.resendverificationmail, opts).respond({
            code : 101
        });     
        expect($scope.Resendlink).toHaveBeenCalled();
    });
});