app.controller('userWalletController',['$rootScope', '$scope', '$http', 'UserWalletService', '$location', '$timeout', '$interval', '$routeParams', 'storeHistorySelection', function($rootScope, $scope, $http, UserWalletService, $location, $timeout, $interval, $routeParams, storeHistorySelection) {
	$scope.oneAtATime = true;
	$scope.isLoadingWallet = true;
	$scope.isLoadPcard = false;
	$scope.isLoadMcard = false;
	$scope.isLoadShot = false;
	$scope.noPcard = false;
	$scope.noMcard = false;
	$scope.noShot = false;
	$scope.userId = APP.currentUser.id;
	$scope.status = {
	    isFirstOpen: false,
	    isFirstDisabled: false
  	};

  	if(storeHistorySelection.getStoreage() == true){
  		$scope.tabChoose = 'history';
  		storeHistorySelection.clearStorage();
  	}else{
  		$scope.tabChoose = 'credits'
  	}
  	$scope.walletDetails = {};
  	$scope.pcardRes = 1;
  	$scope.shotsRes = 1;
  	$scope.mcardRes = 1;
  	$scope.pcardTotal = 0;
  	$scope.shotTotal = 0;
  	$scope.mcardTotal = 0;
  	
  	/* function to get the citizen wallet*/
  	$scope.getCitizenWallet = function(){
  		var opts = {};
		opts.user_id = $scope.userId;
		opts.shots_needed = APP.citizenWallet.shots_needed;
		opts.purchase_card_needed = APP.citizenWallet.purchase_card_needed;
		opts.momosy_card_needed = APP.citizenWallet.momosy_card_needed;
		opts.total_credit_available_needed = APP.citizenWallet.total_credit_available_needed;
		opts.total_citizen_income_needed = APP.citizenWallet.total_citizen_income_needed;
		opts.discount_position_needed = APP.citizenWallet.discount_position_needed;
		opts.purchase_card_limit_start = APP.citizenWallet.purchase_card_limit_start;
		opts.purchase_card_limit_size = APP.citizenWallet.purchase_card_limit_size;
		opts.shots_card_limit_start = APP.citizenWallet.shots_card_limit_start;
		opts.shots_card_limit_size = APP.citizenWallet.shots_card_limit_size;
		opts.momosy_card_limit_start = APP.citizenWallet.momosy_card_limit_start;
		opts.momosy_card_limit_size = APP.citizenWallet.momosy_card_limit_size;
		
		UserWalletService.getCitizenWallet(opts, function(data) {
			$scope.isLoadingWallet = false;
			if(data.code == 101) {
				$scope.walletDetails = data.data;
				$scope.pcardTotal = data.data.purchase_cards.total;
				$scope.shotTotal = data.data.shots.total;
				$scope.mcardTotal = data.data.momosy_cards.total;
				if($scope.walletDetails.purchase_cards.purchase_card.length == 0){
					$scope.noPcard = true;
				}
				if($scope.walletDetails.shots.shot.length == 0){
					$scope.noShot = true;
				}
				if($scope.walletDetails.momosy_cards.momosy_card.length == 0){
					$scope.noMcard = true;
				}
			} else {
				$scope.walletDetails = [];
			}
		});
	}

	$scope.getCitizenWallet();

	/*function to load More PurchaseCard
	* load only PurchaseCard
	*/
	$scope.loadMorePurchaseCard = function(){
		var opts = {};
		opts.user_id = $scope.userId;
		opts.shots_needed = 0; //no need to load shot
		opts.purchase_card_needed = APP.citizenWallet.purchase_card_needed;
		opts.momosy_card_needed = 0; //no need to load momosy card
		opts.total_credit_available_needed = 0;
		opts.total_citizen_income_needed = 0;
		opts.discount_position_needed = 0;
		opts.purchase_card_limit_start = $scope.walletDetails.purchase_cards.purchase_card.length;
		opts.purchase_card_limit_size = APP.citizenWallet.purchase_card_limit_size;
		opts.shots_card_limit_start = APP.citizenWallet.shots_card_limit_start;
		opts.shots_card_limit_size = APP.citizenWallet.shots_card_limit_size;
		opts.momosy_card_limit_start = APP.citizenWallet.momosy_card_limit_start;;
		opts.momosy_card_limit_size = APP.citizenWallet.momosy_card_limit_size;

		if(($scope.pcardRes == 1 && $scope.pcardTotal > $scope.walletDetails.purchase_cards.purchase_card.length)){
			$scope.pcardRes = 0;
			$scope.isLoadPcard = true;
			UserWalletService.getCitizenWallet(opts, function(data) {
				$scope.pcardRes = 1;
				$scope.isLoadPcard = false;
				if(data.code == 101) {
					$scope.walletDetails.purchase_cards.purchase_card = $scope.walletDetails.purchase_cards.purchase_card.concat(data.data.purchase_cards.purchase_card);
					$scope.pcardTotal = data.data.purchase_cards.total;
				} 
			});
		}
	}

	/*function to load More shots
	*load only shots
	*/
	$scope.loadMoreShots = function(){
		var opts = {};
		opts.user_id = $scope.userId;
		opts.shots_needed = APP.citizenWallet.shots_needed;
		opts.purchase_card_needed = 0;
		opts.momosy_card_needed = 0;// load only shots 
		opts.total_credit_available_needed = 0;
		opts.total_citizen_income_needed = 0;
		opts.discount_position_needed = 0;
		opts.purchase_card_limit_start = APP.citizenWallet.purchase_card_limit_start;
		opts.purchase_card_limit_size = APP.citizenWallet.purchase_card_limit_size;
		opts.shots_card_limit_start = $scope.walletDetails.shots.shot.length;
		opts.shots_card_limit_size = APP.citizenWallet.shots_card_limit_size;
		opts.momosy_card_limit_start = APP.citizenWallet.momosy_card_limit_start;;
		opts.momosy_card_limit_size = APP.citizenWallet.momosy_card_limit_size;

		if(($scope.shotsRes == 1 && $scope.shotTotal > $scope.walletDetails.shots.shot.length)){
			$scope.shotsRes = 0;
			$scope.isLoadShot = true;
			UserWalletService.getCitizenWallet(opts, function(data) {
				$scope.shotsRes = 1;
				$scope.isLoadShot = false;
				if(data.code == 101) {
					$scope.walletDetails.shots.shot= $scope.walletDetails.shots.shot.concat(data.data.shots.shot);
					$scope.shotTotal = data.data.shots.total;
				} 
			});
		}
	}

	/*function to load More momosy card
	*load only momosy card
	*/
	$scope.loadMoreMomosyCard = function(){
		var opts = {};
		opts.user_id = $scope.userId;
		opts.shots_needed = 0; 
		opts.purchase_card_needed = 0;
		opts.momosy_card_needed = APP.citizenWallet.momosy_card_needed;
		opts.total_credit_available_needed = 0;
		opts.total_citizen_income_needed = 0;
		opts.discount_position_needed = 0;
		opts.purchase_card_limit_start = APP.citizenWallet.purchase_card_limit_start;
		opts.purchase_card_limit_size = APP.citizenWallet.purchase_card_limit_size;
		opts.shots_card_limit_start = APP.citizenWallet.shots_card_limit_start;
		opts.shots_card_limit_size = APP.citizenWallet.shots_card_limit_size;
		opts.momosy_card_limit_start = $scope.walletDetails.momosy_cards.momosy_card.length;
		opts.momosy_card_limit_size = APP.citizenWallet.momosy_card_limit_size;
		
		if(($scope.mcardRes == 1 && $scope.mcardTotal > $scope.walletDetails.momosy_cards.momosy_card.length)){
			$scope.mcardRes = 0;
			$scope.isLoadMcard = true;
			UserWalletService.getCitizenWallet(opts, function(data) {
				$scope.mcardRes = 1;
				$scope.isLoadMcard = false;
				if(data.code == 101) {
					$scope.walletDetails.momosy_cards.momosy_card = $scope.walletDetails.momosy_cards.momosy_card.concat(data.data.momosy_cards.momosy_card);
					$scope.mcardTotal = data.data.momosy_cards.total;
				} 
			});
		}
	}

	//for citizene income with pagination
	$scope.firstPage = APP.citizenWallet.limit_start;
    $scope.itemsPerPage = APP.citizenWallet.limit_size;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.pagevalue = '';
    $scope.changePageMore = function(pageNo) {
        $scope.currentPage = pageNo;
        $scope.citizenIncome();
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
        $scope.citizenIncome();
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 1 ? "disabled" : "";
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalItems) {
            $scope.currentPage++;
        }
       $scope.citizenIncome();
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        $scope.citizenIncome();
    };

    /* function to get the citizen wallet*/
  	$scope.citizenIncome = function(){
  		var limit_start = ($scope.currentPage-1)*$scope.itemsPerPage;
  		var opts = {};
		opts.user_id = $scope.userId;
		opts.limit_start = limit_start;
		opts.limit_size = $scope.itemsPerPage;
		
		UserWalletService.getCitizenIncomes(opts, function(data) {
			$scope.isLoadingWallet = false;
			if(data.code == 101) {
				$scope.incomeDetails = data.data.citizen_income;
				$scope.totalItems = Math.ceil(data.data.total/$scope.itemsPerPage); 
                    $scope.range = [];  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    }  
			} else {
				$scope.incomeDetails = [];
			}
		});
	}

	$scope.citizenIncome();
}]);