// describe('SixthContinent: UserController Controller test', function(){  
//     var ctrl, $scope, httpBackend, $window;	

// 	/**
// 	 * Load SixthContinent module before execute any test
// 	 */
//     beforeEach(module('SixthContinent'));	
	
// 	/**
//  	 * Inject required dependencies as $httpBackend, $controller and $rootScope
// 	 */
// 	beforeEach(inject(function($injector, $httpBackend, $controller, $rootScope, $window) {
// 		httpBackend = $httpBackend;
		
// 		// Create a new scope that's a child of the $rootScope
// 		$scope = $rootScope.$new();
// 		$window= $window;

// 		// Create the controller
// 		ctrl = $controller('UserController', {
// 			$scope: $scope
// 		});		
// 	})); 

// 	*
// 	 * test case for registration method 
// 	 * @test 'registration' should be a function
	 
//     it('registration method :: should have a registration function', inject(function() {
//         expect(angular.isFunction($scope.registration)).toBe(true);
//     }));

//     /**
// 	 * test case for registration method 
// 	 * @param: user object
// 	 * @test 'registration' should call 
// 	 */
//     it('registration method :: Successful request', function(){	
//     	$scope.user = user;		
// 		spyOn($scope, 'registration').and.callThrough();
// 		$scope.registration();
// 		httpBackend.expect('POST', APP.service.registration,user).respond({
// 			code : 105
// 		});		
// 		expect($scope.registration).toHaveBeenCalled();
// 	});

// });