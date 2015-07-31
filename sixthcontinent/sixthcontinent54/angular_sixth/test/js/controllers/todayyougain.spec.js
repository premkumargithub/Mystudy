describe('SixthContinent: Profilenoticontroller', function(){

	beforeEach(module('SixthContinent'));
	var ctrl, $scope, httpBackend, $timeout;

	beforeEach(inject(function($controller, $rootScope, $httpBackend, _$timeout_){
		httpBackend = $httpBackend;
		$scope = $rootScope.$new();
		$timeout = _$timeout_;
		ctrl = $controller('ProfileNotiController',{
			$scope : $scope
		});
	}));

	// date function existence check
	it("\n\tfunction exists", function(){
            expect(angular.isFunction($scope.getTodayCredit)).toBe(true);
    });

	it('Today you gain :: Successful request', function(){
        var opts = {"$collection":"sixc_bucks","$group":{"credit":{"$sum":"$credit"},"_id":null,"$fields":false},"$filter":{"citizen_id":"30084","date":{"$gte":"2015-04-24T00:00:00.000Z","$lt":"2015-04-25T00:00:00.000Z"}},"$skip":0}

        spyOn($scope, 'getTodayCredit').and.callThrough();
        $scope.getTodayCredit();
        httpBackend.expect('POST', APP.service.getApplaneData, opts).respond({
            code : 200
        });     
        expect($scope.getTodayCredit).toHaveBeenCalled();
    });
});
