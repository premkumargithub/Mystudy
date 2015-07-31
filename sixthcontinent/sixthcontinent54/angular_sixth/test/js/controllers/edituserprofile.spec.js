describe('SixthContinent: EditUserProfileController test', function(){  
    var ctrl, $scope, httpBackend, $window;	

	/**
	 * Load SixthContinent module before execute any test
	 */
    beforeEach(module('SixthContinent'));	
	
	/**
 	 * Inject required dependencies as $httpBackend, $controller and $rootScope
	 */
	beforeEach(inject(function($injector, $httpBackend, $controller, $rootScope, $window) {
		httpBackend = $httpBackend;
		
		// Create a new scope that's a child of the $rootScope
		$scope = $rootScope.$new();
		$window= $window;

		// Create the controller
		ctrl = $controller('EditUserProfileController', {
			$scope: $scope
		});		
	})); 

	/**	Test Case for checking Search Keyword method presence */
    it('searchKeyword method :: should have a searchKeyword function', inject(function() {
        expect(angular.isFunction($scope.searchKeyword)).toBe(true);
    }));
    /**	Test Case for checking keywordKeyDown method presence */
    it('keywordKeyDown method :: should have a keywordKeyDown function', inject(function() {
        expect(angular.isFunction($scope.keywordKeyDown)).toBe(true);
    }));
    /**	Test Case for checking focusKeyword method presence */
    it('focusKeyword method :: should have a focusKeyword function', inject(function() {
        expect(angular.isFunction($scope.focusKeyword)).toBe(true);
    }));
    /**	Test Case for checking focusKeyword method presence */
    it('storeKeyword method :: should have a storeKeyword function', inject(function() {
        expect(angular.isFunction($scope.storeKeyword)).toBe(true);
    }));
    /**	Test Case for checking removeKeyword method presence */
    it('removeKeyword method :: should have a removeKeyword function', inject(function() {
        expect(angular.isFunction($scope.removeKeyword)).toBe(true);
    }));

    /*searchKeyword method response check*/
    it('searchKeyword method :: Successful request', function(){
    	$scope.selectedCategory = {
    		id : "1"
    	};	
    	$scope.categoryKeyword = "liju whats up";
    	
    	var opts = {};
    	opts.category_id = $scope.selectedCategory.id.toString();
		opts.session_id = 30105;
		opts.keyword = $scope.categoryKeyword;

		spyOn($scope, 'searchKeyword').and.callThrough();
		$scope.searchKeyword();
		httpBackend.expect('POST', APP.service.searchCatagoryKeyword, opts).respond({
			code : 101
		});		
		expect($scope.searchKeyword).toHaveBeenCalled();
	});
});