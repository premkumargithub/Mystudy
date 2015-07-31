describe('SixthContinent:  Offer lisiting test', function(){  
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
		var leftmenu = {
			offer_card : "Shopping card" ,
			offer_coupons : "Coupons" 
		};
		var offershoppingcard = {
			promotion : "Promotions E-commerce"
		};
	    
	    $scope.i18n = {
	    	left_menu : leftmenu,
	    	offer_shoppingcard : offershoppingcard
	    };
		$window= $window;
		$routeParams = {
			id : ["1","2","3"]
		};

		// Create the controller
		ctrl = $controller('CardController', {
			$scope: $scope
		});		
	})); 
	
	it('Offer lisiting method :: should have a initializeMap function', inject(function() {
        expect(angular.isFunction($scope.initializeMap)).toBe(true);
    }));

 	it('Offer lisiting method :: should have a ConvertCategory function', inject(function() {
        expect(angular.isFunction($scope.ConvertCategory)).toBe(true);
    }));

  	it('Offer lisiting method :: should have a fireSearch function', inject(function() {
        expect(angular.isFunction($scope.fireSearch)).toBe(true);
    }));

    it('Offer lisiting method :: should have a removepins function', inject(function() {
        expect(angular.isFunction($scope.removepins)).toBe(true);
    }));

    it('Offer lisiting method :: should have a searchCategory function', inject(function() {
        expect(angular.isFunction($scope.searchCategory)).toBe(true);
    }));

    it('Offer lisiting method :: should have a changeCat function', inject(function() {
        expect(angular.isFunction($scope.changeCat)).toBe(true);
    }));

    it('Offer lisiting method :: should have a OfferChange function', inject(function() {
        expect(angular.isFunction($scope.OfferChange)).toBe(true);
    }));

    it('Offer lisiting method :: should have a frindBoughtCount function', inject(function() {
        expect(angular.isFunction($scope.frindBoughtCount)).toBe(true);
    }));

    it('Offer lisiting method :: should have a getfrndlist function', inject(function() {
        expect(angular.isFunction($scope.getfrndlist)).toBe(true);
    }));

    it('Offer lisiting method :: should have a getcount function', inject(function() {
        expect(angular.isFunction($scope.getcount)).toBe(true);
    }));

    it('Offer lisiting method :: should have a changePageMore function', inject(function() {
        expect(angular.isFunction($scope.changePageMore)).toBe(true);
    }));

    it('Offer lisiting method :: should have a calculateprice function', inject(function() {
        expect(angular.isFunction($scope.calculateprice)).toBe(true);
    }));

    it('Offer lisiting method :: should have a getCitizenIncome function', inject(function() {
        expect(angular.isFunction($scope.getCitizenIncome)).toBe(true);
    }));

	it('Offer lisiting method :: should have a getlistingData function', inject(function() {
        expect(angular.isFunction($scope.getlistingData)).toBe(true);
    }));

    it('Offer lisiting method :: should have a geolocation function', inject(function() {
        expect(angular.isFunction($scope.geolocation)).toBe(true);
    }));

    it('Offer lisiting method :: should have a search function', inject(function() {
        expect(angular.isFunction($scope.search)).toBe(true);
    }));

    it('Offer lisiting method :: should have a searchMapText function', inject(function() {
        expect(angular.isFunction($scope.searchMapText)).toBe(true);
    }));

    it('Offer lisiting method :: should have a changeView function', inject(function() {
        expect(angular.isFunction($scope.changeView)).toBe(true);
    }));

    it('Offer lisiting method :: should have a filterChange function', inject(function() {
        expect(angular.isFunction($scope.filterChange)).toBe(true);
    }));

    it('Offer lisiting method :: should have a setPage function', inject(function() {
        expect(angular.isFunction($scope.setPage)).toBe(true);
    }));

    it('Offer lisiting method :: should have a prevPageDisabled function', inject(function() {
        expect(angular.isFunction($scope.prevPageDisabled)).toBe(true);
    }));

    it('Offer lisiting method :: should have a prevPage function', inject(function() {
        expect(angular.isFunction($scope.prevPage)).toBe(true);
    }));

    it('Offer lisiting method :: should have a nextPage function', inject(function() {
        expect(angular.isFunction($scope.nextPage)).toBe(true);
    }));

    it('Offer lisiting method :: should have a paginate function', inject(function() {
        expect(angular.isFunction($scope.paginate)).toBe(true);
    }));

   	it('Offer lisiting method :: should have a nextPageDisabled function', inject(function() {
        expect(angular.isFunction($scope.nextPageDisabled)).toBe(true);
    }));

    it('Offer lisiting method :: should have a buyCoupon function', inject(function() {
        expect(angular.isFunction($scope.buyCoupon)).toBe(true);
    }));

    it('Offer lisiting method :: should have a Sorting function', inject(function() {
        expect(angular.isFunction($scope.Sorting)).toBe(true);
    }));

    it('Offer lisiting method :: $routeParams.id must be defined', inject(function() {
        expect($routeParams.id).toBeDefined();
    }));

    it('Offer lisiting method :: should have a $routeParams.id in  1,2,3', inject(function() {
        expect($routeParams.id).toContain("1");
        expect($routeParams.id).toContain("2");
        expect($routeParams.id).toContain("3");
    }));

    it('Offer lisiting method :: Successful searchCategory request', function(){
        var opts = {};
        	opts.lang_code  = "en";
            opts.session_id = 30105;

        spyOn($scope, 'searchCategory').and.callThrough();
        $scope.searchCategory();
        httpBackend.expect('POST', APP.service.searchCatagory, opts).respond({
            code : 101
        });     
        expect($scope.searchCategory).toHaveBeenCalled();
    });

    it('Offer lisiting method :: Successful frindBoughtCount request', function(){
        var opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":"12345","citizen_id":"30105"}]}

        spyOn($scope, 'frindBoughtCount').and.callThrough();
        $scope.frindBoughtCount();
        httpBackend.expect('POST', APP.service.frindboughtcount, opts).respond({
            code : 101
        });     
        expect($scope.frindBoughtCount).toHaveBeenCalled();
    });

    it('Offer lisiting method :: Successful getcount request', function(){
    	$scope.collection    = "sixc_offers";
        var opts = {};
        	opts["$collection"] = $scope.collection;
        	opts["$filter"] = "gaurav";
        	opts["$group"] = {"count":{"$sum":1},"_id":null};

        spyOn($scope, 'getcount').and.callThrough();
        $scope.getcount();
        httpBackend.expect('POST', APP.service.getApplaneData, opts).respond({
            code : 200
        });     
        expect($scope.getcount).toHaveBeenCalled();
    });

    it('Offer lisiting method :: Successful getCitizenIncome request', function(){
    	var opts = {};
        	opts["$collection"] = "sixc_bucks";
            opts["$filter"] = {"citizen_id" : "30105"};
            opts["$group"] = {"_id":null,"amount":{"$sum":"$amount"},"debit":{"$sum":"$debit"},"credit":{"$sum":"$credit"}};

        spyOn($scope, 'getCitizenIncome').and.callThrough();
        $scope.getCitizenIncome();
        httpBackend.expect('POST', APP.service.getApplaneData, opts).respond({
            code : 200
        });     
        expect($scope.getCitizenIncome).toHaveBeenCalled();
    });

    it('Offer lisiting method :: Successful offers for me get listing data request', function(){
    	$scope.collection = "sixc_citizen_offers"
        var opts = {"function" : "SixcServices.offerForMe","parameters":[{"citizen_id":"30105","count":true,"$filter":{"shop_id":"12345"},"$sort":{"_id":1},"$limit":"10","$skip":"0"}]};
        spyOn($scope, 'getlistingData').and.callThrough();
        $scope.getlistingData();
        httpBackend.expect('POST', APP.service.getApplaneInvoke, opts).respond({
            code : 200
        });     
        expect($scope.getlistingData).toHaveBeenCalled();
    });

    it('Offer lisiting method :: Successful offers get listing data request', function(){
    	$scope.collection = "sixc_offers"
        var opts = {};
       		opts["$collection"] = $scope.collection;
	        opts["$sort"]    = {"_id":1};
	        opts["$limit"]   = "10";
	        opts["$skip"]    = "0";
	        opts["$filter"]  = {"shop_id":"12345"};
        
        spyOn($scope, 'getlistingData').and.callThrough();
        $scope.getlistingData();
        httpBackend.expect('POST', APP.service.getApplaneData, opts).respond({
            code : 200
        });     
        expect($scope.getlistingData).toHaveBeenCalled();
    });

    it('Offer lisiting method :: Successful geolocation request', function(){
    	var opts = {};
       		opts.longitude  = $scope.longitude;
            opts.latitute   = $scope.latitute;
            opts.radius     = $scope.selectedRange;
            opts.session_id = APP.currentUser.id;
        
        spyOn($scope, 'geolocation').and.callThrough();
        $scope.geolocation();
        httpBackend.expect('POST', APP.service.searchstoreondimensions, opts).respond({
            code : 101
        });     
        expect($scope.geolocation).toHaveBeenCalled();
    });

    it('Offer lisiting method :: Successful buyCoupon request', function(){
    	var opts = {"function" : "ApplyCouponBL.applyCoupon","parameters":[{"offer_id": "sd78ejkwdnwkj","citizen_id":"30185"}]};
        
        spyOn($scope, 'buyCoupon').and.callThrough();
        $scope.buyCoupon();
        httpBackend.expect('POST', APP.service.getApplaneInvoke, opts).respond({
            code : 200
        });     
        expect($scope.buyCoupon).toHaveBeenCalled();
    });

});