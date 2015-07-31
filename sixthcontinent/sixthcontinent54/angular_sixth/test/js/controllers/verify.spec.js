describe('SixthContinent:  Verify user test', function(){  
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
		ctrl = $controller('VerifyController', {
			$scope: $scope
		});		
	})); 

	/**	Test Case for checking verify method presence */
    it('verify method :: should have a verify function', inject(function() {
        expect(angular.isFunction($scope.verify)).toBe(true);
    }));

    /*verify method response check*/
    it('verify method :: Successful request', function(){
        var opts = {};
        opts.verify_token = 'Ahbhjdw9wwen';
        opts.user_email   = 'test@gmail.com'

        spyOn($scope, 'verify').and.callThrough();
        $scope.verify();
        httpBackend.expect('POST', APP.service.verifyAccount, opts).respond({
            code : 101
        });     
        expect($scope.verify).toHaveBeenCalled();
    });
});