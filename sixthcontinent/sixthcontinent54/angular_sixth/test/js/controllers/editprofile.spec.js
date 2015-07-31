describe('SixthContinent: EditUserProfileController test case for editprofile function', function(){

	beforeEach(module('SixthContinent'));
	var ctrl, $scope, httpBackend, $timeout;

	beforeEach(inject(function($controller, $rootScope, $httpBackend, _$timeout_){
		httpBackend = $httpBackend;
		$scope = $rootScope.$new();
		$timeout = _$timeout_;
		ctrl = $controller('EditUserProfileController',{
			$scope : $scope
		});
	}));

	// date function existence check
	it("\n\tfunction exists", function(){
            expect(angular.isFunction($scope.monthChange)).toBe(true);
            expect(angular.isFunction($scope.professionalMonthStart)).toBe(true);
            expect(angular.isFunction($scope.professionalMonthEnd)).toBe(true);
            expect(angular.isFunction($scope.getyears)).toBe(true);
    });

	// feb days check for leap year
    it("\n\tcheck feb days for leap year return ", function(){
        $scope.editUser = {};
		$scope.editUser.month = {name : 'feb' , value : 2};
		$scope.Result = 1;
		$scope.dayss = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
		/*$scope.dayss = ['1'',2','3','4'',5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29'];*/
		$scope.monthChange();
		expect($scope.editDays.length).toBe($scope.dayss.length);
		//console.log($scope.days);
    });

    // feb days check for not leap year
    it("\n\tcheck feb days for not  leap year return ", function(){
        $scope.editUser = {};
		$scope.editUser.month = {name : 'feb' , value : 2};
		$scope.Result = 0;
		$scope.dayss = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
		/*$scope.dayss = ['1'',2','3','4'',5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29'];*/
		$scope.monthChange();
		expect($scope.editDays.length).toBe($scope.dayss.length);
		console.log($scope.days);
    });

    // check for search user functionality existence 
    it("\n\t searchSuggestion function exists", function(){
        expect(angular.isFunction($scope.searchsuggestion)).toBe(true);
    });

    // check for search user service response
    it('searchsuggestion method :: Successful request', function(){	
    	$scope.searchObj = editProfileObj.searchReq;		
		spyOn($scope, 'searchsuggestion').and.callThrough();
		$scope.searchsuggestion();
		httpBackend.expect('POST', APP.service.getAllProfiles,$scope.searchsuggestion).respond({
			code : 101
		});		
		expect($scope.searchsuggestion).toHaveBeenCalled();
	});

    // test for hobby selection function
	it("\n\t addToSelectedTags function exists", function(){
        expect(angular.isFunction($scope.addToSelectedTags)).toBe(true);
    });

	// Test for storing the selected hobby in the array
    it('addToSelectedTags method :: Successful adding in the hobby array', function(){	
    	$scope.searchObj = editProfileObj.hobbyReq;		
		spyOn($scope, 'addToSelectedTags').and.callThrough();
		$scope.addToSelectedTags();
		httpBackend.expect('POST', APP.service.suggestionmultiprofiles,$scope.addToSelectedTags).respond({
			code : 101
		});		
		expect($scope.addToSelectedTags).toHaveBeenCalled();
	});

	// Test for checking the validation in the storing the hobby  for duplicate + manual added hobby
    it('addToSelectedTags method :: hobby selection validation check', function(){	
		$scope.selectedTags = hobbylist;
    	$scope.i18n = { 
    		"profile":{ 
    			"edit_profile" : {
    				"hobby_cannot_be_duplicate" : "Hobby cannot be duplicate"
    			}
			}
		};
		$scope.searchText = "a";
		$scope.suggestions = hobbySuggestion;			
		spyOn($scope, 'addToSelectedTags').and.callThrough();
		$scope.addToSelectedTags(0);		
		expect($scope.addToSelectedTags).toHaveBeenCalled();
		expect($scope.hobbyMessage).toEqual($scope.i18n.profile.edit_profile.hobby_cannot_be_duplicate);
	});

	// test for checkKeyDown function
	it("\n\t checkKeyDown function exists", function(){
        expect(angular.isFunction($scope.checkKeyDown)).toBe(true);
    });

    // test for clearHobbyList function
	it("\n\t clearHobbyList function exists", function(){
        expect(angular.isFunction($scope.clearHobbyList)).toBe(true);
    });

    // check for clearing of the hobby list after calling clearHobbyList
    it("\n\t clearHobbyList function : check array ", function(){
        $scope.cancelHobbiesRequest = false;
        $scope.clearHobbyList();
        $scope.suggestions = hobbySuggestion;
        /*expect($scope.cancelHobbiesRequest).toEqual(true);
        $timeout.flush();
        expect($scope.suggestions.length).toEqual(0);*/
        /*$timeout(function(){
        	expect($scope.suggestions.length).toEqual(0);
        },500);*/
    	/*$timeout(function() {
        	timerCallback();
	    }, 500);
	    expect(timerCallback).not.toHaveBeenCalled();
	    $timeout.flush(499);
	    expect(timerCallback).not.toHaveBeenCalled();
	    $timeout.flush(1);
	    expect(timerCallback).toHaveBeenCalled();*/
    });
});
