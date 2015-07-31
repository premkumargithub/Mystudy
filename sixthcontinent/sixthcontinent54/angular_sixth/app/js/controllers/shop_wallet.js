app.controller('shopWalletController', ['$rootScope', '$scope', '$http', 'StoreWalletService', '$location', '$timeout', '$interval', '$routeParams', '$sce', 'StoreCreditCard', '$route', 'StoreService', '$filter', 'StorePaymentService', 'DateToMongoDate', 'storeShopHistorySelection' ,'$window', function($rootScope, $scope, $http, StoreWalletService, $location, $timeout, $interval, $routeParams, $sce, StoreCreditCard, $route, StoreService, $filter, StorePaymentService, DateToMongoDate, storeShopHistorySelection, $window) {
    $scope.oneAtATime = true;
	isLoadingWallet = true;
	$scope.storeId = $routeParams.id;
    $scope.status = {
	    isFirstOpen: true,
	    isFirstDisabled: false
  	};
    
    $scope.walletDetails = {};
  	$scope.pcardRes = 1;
  	$scope.shotsRes = 1;
  	$scope.mcardRes = 1;
  	$scope.pcardTotal = 0;
  	$scope.shotTotal = 0;
  	$scope.mcardTotal = 0;
  	$scope.userId = APP.currentUser.id;
  	$scope.pendingPayBtn = true;
    $scope.payRecurring = false;
    $scope.isShowForm = false; //close paypal form
    $scope.firstPage = APP.sale_history.end;
    $scope.itemsSaleHistoryPerPage = APP.sale_history.end;
    $scope.itemsPaypalPerPage = APP.sale_history.end;
    $scope.itemsCardsPerPage = APP.sale_history.end;
    $scope.sucessPay = false;
    $scope.sucessPayError = false;
    if($location.search().codTrans && ($location.search().esito!='ANNULLO')){ 
        //$scope.sucessPay = false;
        $scope.codTrans = $location.search().codTrans;
        $scope.amount = $location.search().importo;
        $scope.uniform = $location.search().divisa;
        $scope.outcome = $location.search().esito;
        $scope.descrizione = $location.search().descrizione;
        $scope.messaggio = $location.search().messaggio;
        $scope.pan = $location.search().pan;
        if($scope.outcome == 'OK'){
            $scope.tranId = $location.search().txn_id;
            $scope.sucessPay = true;
            var opts ={};
            opts.shop_id = $scope.storeId;
            opts.user_id = APP.currentUser.id;
            opts.status ="SUCCESS";
            opts.message = $scope.messaggio;
            opts.txn_id = $scope.tranId;
            StoreWalletService.updatePendingPayments(opts, function(data) { 
            });
            $timeout(function(){
               $location.search({});
               $scope.sucessPay = false;
            },10000); 

        }else{
            $scope.tranId = $location.search().txn_id;
            $scope.sucessPayError = true;
            var opts ={};
            opts.shop_id = $scope.storeId;
            opts.user_id = APP.currentUser.id;
            opts.status ="FAILED";
            opts.message= $scope.messaggio;
            opts.txn_id = $scope.tranId;
            StoreWalletService.updatePendingPayments(opts, function(data) { 
            });
            $timeout(function(){
               $location.search({});
               $scope.sucessPayError = false;
            },8000);
        }   
    }
    if($location.search().codTrans && ($location.search().esito =='ANNULLO')){ 
        $scope.tranId = $location.search().txn_id;
        var opts ={};
        opts.shop_id = $scope.storeId;
        opts.user_id = APP.currentUser.id;
        opts.status ="FAILED";
        opts.message= "CANCEL";
        opts.txn_id = $scope.tranId;
        StoreWalletService.updatePendingPayments(opts, function(data) { 
        });
        $timeout(function(){
            $location.search({});
        },5000);
    }
    $scope.getmastercardurl = function(){
        var opts = {};
        opts.profile_id = $scope.storeId;
        opts.user_id    = $scope.userId;
        opts.cancel_url = APP.payment.siteDomain + '#/shop/paycancel'; 
        opts.return_url = APP.payment.siteDomain + '#/shop/paysuccess'; 
        opts.payment_type = APP.card.add_type;

        StorePaymentService.getOneClickPaymentUrls(opts, function(data) {  
            if(data.code == 101) {
                if(data.data.url != '' ) {
                    $scope.storePaymentUrl =  data.data.url;
                } else { 
                    $scope.storePaymentUrl = '';
                } 
            } else { 
                $scope.storePaymentUrl = '';
            } 
        });
    };
    $scope.getmastercardurl();
    /* adding tab for shop walletsection*/
	$scope.tabs = [
		{ id:1},
		{ id:2},
		{ id:3},
		{ id:4},
		{ id:5},
		{ id:6}
	];

	$scope.currentTab;

    //function to set the sub tab for credit cards and paypal account listing
    $scope.subtabs = [
        { id:1},
        { id:2}
    ];

    $scope.currentSubTab;


    /*function to get list of paypal account
    * accept shopid, limit size and limit start
    */

    $scope.paypalAccountList = [];
    $scope.isInProgress = false;
    $scope.selectedAccount = [];
    $scope.selectedAccountIndex = 0;
    $scope.getPaypalAccounts = function(itemsPaypalPerPage) {
        $scope.storeData = StoreService.getStoreData();
        $scope.isInProgress = true;
        $scope.isBlockReq = 0;
        $scope.pagination = false;
        var limit_start = ($scope.currentPaypalPage -1) * itemsPaypalPerPage;
        var opts = {};
        opts.shop_id = $scope.storeData.id;
        opts.session_id = APP.currentUser.id;
        opts.limit_size = itemsPaypalPerPage;
        opts.limit_start = limit_start;
        if($scope.isBlockReq == 0 || $scope.firstLoad == 0){
            $scope.isBlockReq = 1;
            $scope.firstLoad == 1;
            StoreCreditCard.getPaypalAccounts(opts, function(data) { 
                $scope.isBlockReq = 0;
                if(data.code == 101) {
                    $scope.isInProgress = false; 
                    $scope.paypalAccountList = data.data.paypal_accounts;
                    $scope.total = data.data.paypal_count;
                    $scope.totalPaypalItems = Math.ceil(data.data.paypal_count/itemsPaypalPerPage); 
                    if(data.data.paypal_count > $scope.itemsPaypalPerPage){
                        $scope.range = [];
                        for (var i=1; i <= $scope.totalPaypalItems; i++) {
                            $scope.range.push(i);
                        }
                        $scope.pagination = true;
                    }else{
                        $scope.pagination = false;
                    }
                    if($scope.paypalAccountList.length == 0){
                        $scope.noContent = true;
                    }
                    angular.forEach( $scope.paypalAccountList,function(value, index){
                        if(value.default_status == 1){
                            $scope.selectedAccount[index] = true;
                            $scope.selectedAccountIndex = index;
                        }else{
                            $scope.selectedAccount[index] = false;
                        }
                    });

                } if(data.code == 100) {
                    $scope.msgClass = 'text-red';
                    $scope.isInProgress = false; 
                    $scope.message = $scope.i18n.store_wallet.paypal.param_missed;
                    $timeout(function(){
                        $scope.msgClass = '';
                        $scope.message = '';
                    }, 10000);
                } if(data.code == 1054) {
                    $scope.msgClass = 'text-red';
                    $scope.isInProgress = false; 
                    $scope.message = $scope.i18n.store_wallet.paypal.access_voilation;
                    $timeout(function(){
                        $scope.msgClass = '';
                        $scope.message = '';
                    }, 10000);
                } else {
                    $scope.isInProgress = false;
                    $scope.paypalAccountList = $scope.paypalAccountList;
                } 
            });
        } 
    };

    /*functio for paypal account apgination start*/
    $scope.currentPaypalPage = 1;
    $scope.loadMoreAccounts = function() {
        $scope.getPaypalAccounts($scope.itemsPaypalPerPage);
    } 

    $scope.changePaypalPageMore = function(pageNo) {
        $scope.currentPaypalPage = pageNo;
        $scope.loadMoreAccounts();
    };

    $scope.prevPaypalPage = function() {
        if ($scope.currentPaypalPage > 1) {
            $scope.currentPaypalPage--;
        }
        $scope.loadMoreAccounts();
    };

    $scope.prevPaypalPageDisabled = function() {
        return $scope.currentPaypalPage === 1 ? "disabled" : "";
    };

    $scope.nextPaypalPage = function() {
        if ($scope.currentPaypalPage < $scope.totalPaypalItems) {
            $scope.currentPaypalPage++;
        }
       $scope.loadMoreAccounts();
    };

    $scope.nextPaypalPageDisabled = function() {
        return $scope.currentPaypalPage === $scope.totalPaypalItems ? "disabled" : "";
    };

    $scope.setPaypalPage = function(number) {
        $scope.currentPaypalPage = number;
        $scope.loadMoreAccounts();
    };

    /*functio for paypal account apgination end*/

    //function to open paypal subscription form
    //End of payment method tab

    $scope.isActiveSubTab = function(subTabId) {
        if($scope.currentSubTab == subTabId){
          return true;
        } else {
          return false;
        }
    };

    $scope.getSubTabData = function(tabId) {
        $scope.pagination = false;
        $scope.currentPage = 0;
        switch(tabId) {
            case 2:
                $scope.currentSubTab = tabId;
                $scope.msgClass = '';
                $scope.message = '';
                $scope.getPaypalAccounts($scope.itemsPaypalPerPage);
                $scope.pendingPayment();
                break;
            default:
                $scope.msgClass = '';
                $scope.message = '';
                $scope.getCreditCard($scope.itemsCardsPerPage);
                $scope.pendingPayment();
                $scope.currentSubTab = 1;
                break;
        }
    };
	
    /*
  	 * payment history of the user
  	 * show the previous payment
  	 *	{"reqObj":{"user_id":23604,"shop_id":"23750"}}
  	 */
  	$scope.paymentDetail = [];
	var paymentHistory = function(){
		var reqObj = {
			"user_id" : APP.currentUser.id,
			"shop_id" : $scope.storeId,
			"limit_start" : APP.store_payment_pagination.start,
			"limit_size" : APP.store_payment_pagination.end
		}

		StoreWalletService.getPaymentHistory(reqObj, function(data) {
			$scope.paymentDetail = data.data;
		});
	};

	paymentHistory();
	$scope.sideshow = function() {
		$('.pay-pending-detail').slideToggle(500);
		$('a.slidemore').hide();
	}
	$('.slidehide').click(function(){
		$('.pay-pending-detail').slideUp(500);
		$('a.slidemore').show("slow");
	});

	$scope.loadmoreHistory = false;
	$scope.loadMorePaymentHistory = function(){
		if($scope.paymentDetail.previous_payment_success.length < $scope.paymentDetail.count){
			$scope.loadmoreHistory = true;
			var reqObj = {
				"user_id" : APP.currentUser.id,
				"shop_id" : $scope.storeId,
				"limit_start" : $scope.paymentDetail.previous_payment_success.length,
				"limit_size" :  APP.store_payment_pagination.end
			};

			StoreWalletService.getPaymentHistory(reqObj, function(data) {
				$scope.loadmoreHistory = false;
				angular.forEach(data.data.previous_payment_success,function(index){
					$scope.paymentDetail.previous_payment_success.push(index);
				});
			});
		}
	};
  	
    /**
    * sale tab start
    *
  	/* function to get the shop wallet*/

    $scope.discountBalance = 0.00;
    $scope.discountCredit = 0.00;
    $scope.turnOver = 0.00;
	$scope.loadShopWallet = false;
  	$scope.getShopWallet = function(){
        var opts =  {
                    "shopOpen":{
                        "$collection": APP.applaneTables.sixc_shopdp,
                        "$filter":{
                            "balance":{"$gt":0},
                            "shop_id": $scope.storeId
                        },
                        "$group":{
                            "credit":{
                                "$sum":"$credit"
                            },
                        "_id":null,
                        "$fields":false
                        }
                    },
                    "shopbalance":{
                        "$collection": APP.applaneTables.sixc_shopdp,
                        "$filter":{
                            "balance":{"$gt":0},
                            "shop_id": $scope.storeId
                        },
                        "$group":{
                            "balance":{
                                "$sum":"$balance"
                            },
                            "_id":null,
                            "$fields":false
                        }
                    },
                    "shopRevenue":{
                        "$collection": APP.applaneTables.sixc_transactions,
                        "$filter":{
                            "shop_id": $scope.storeId
                        },
                        "$group":{
                            "_id":null,
                            "total_income":{
                                "$sum":"$total_income"
                            },
                            "payble_value":{
                                "$sum":"$payble_value"
                            },
                            "new_upto_50_value":{
                                "$sum":"$new_upto_50_value"
                            },
                            "checkout_value":{
                                "$sum":"$checkout_value"
                            },
                            "$fields":false
                        }
                    }
                };
		//$scope.walletDetails = data;
		$scope.loadShopWallet = true;
		//StoreWalletService.getStoreWallet(opts, function(data) {
        StoreWalletService.getStoreWalletApplane(opts, function(data) {
			if(data.code == 200 && data.status == 'ok'){
				$scope.loadShopWallet = false;
				$scope.walletDetails =  data.response ;
                if($scope.walletDetails.shopOpen.result.length > 0){
                    $scope.discountCredit = $scope.walletDetails.shopOpen.result[0].credit;
                }else{
                    $scope.discountCredit = 0.00;
                }
                if($scope.walletDetails.shopbalance.result.length > 0){
                    $scope.discountBalance = $scope.walletDetails.shopbalance.result[0].balance;
                }else{
                    $scope.discountBalance = 0.00;
                }
                if($scope.walletDetails.shopRevenue.result.length > 0){
                    if($scope.walletDetails.shopRevenue.result[0].total_income != null){
                        $scope.turnOver = $scope.walletDetails.shopRevenue.result[0].total_income;
                    }
                }else{
                    $scope.turnOver = 0.00;
                }
			}else{
				$scope.loadShopWallet = false;
            }
		});
	};

    $scope.positionHistory = [];
    $scope.loadShopPrenium = false;
    $scope.shopPreniumHistory = function(){
        var opts = {
                "$collection":APP.applaneTables.sixc_shopdp,
                "$fields":{"value":1,"start_date":1,"end_date":1,"credit":1,"debit":1,"balance":1,"transactions_count":1,"transaction_ids":1},
                "$filter":{
                    "shop_id": $scope.storeId  // for testing use this is "55338df122493a7a6e970eef"
                },
                "$sort":{
                    "__history.__createdOn":-1
                },
                "$skip":0
            };
        $scope.loadShopPrenium = true;
        StoreWalletService.getShopPreniumHistoryApplane(opts, function(data) {
            if(data.code == 200 && data.status == 'ok'){
                $scope.loadShopPrenium = false;
                $scope.positionHistory = $scope.positionHistory.concat(data.response.result);
                if($scope.positionHistory.length > $scope.itemsPerPage){
                    $scope.list = 0;
                    $scope.list = $scope.positionHistory.length;
                    $scope.pagination = true;
                    $scope.range = [];
                    for (var i = 0; i < $scope.list/$scope.itemsPerPage; i++) {
                        $scope.range.push(i);
                    };
                }
            }else{
                $scope.loadShopPrenium = false;
            }
        });
    };

	//get onclick url for recurring payment
    $scope.payRecurringPayment = function() {
        $scope.message = undefined;
        var opts = {};
        opts.store_id = $scope.store_id;
        
        StoreCreditCard.getOnClickRecurringPayments(opts, function(data) {  
            if(data.code == 251) {
                $scope.msgClass = 'alert-info';
                $scope.message = $scope.i18n.store.payment.less_amount;
            } else if(data.code == 252){ 
                $scope.msgClass = 'alert-warning';
                $scope.message = $scope.i18n.store.payment.no_card;
            } else if (data.code == 253) {
                $scope.msgClass = 'alert-warning';
                $scope.message = $scope.i18n.store.payment.payment_fail;
            } else if (data.code == 101) {
                $scope.msgClass = 'alert-info';
                $scope.message = $scope.i18n.store.payment.payment_success;
            }
            $timeout(function(){
                $scope.msgClass = '';
                $scope.message = '';
            }, 10000);
        });
    }

    
    //function to get the pending payment url
    $scope.getOneClickPaymentUrls = function() {
        var opts = {};
        opts.profile_id = $scope.storeId;
        opts.user_id = $scope.userId;
        opts.payment_type = APP.card.add_type;
        opts.cancel_url = APP.payment.siteDomain + '/#/shop/payment/cancel'; 
        opts.return_url = APP.payment.siteDomain + '/#/shop/payment/success'; 
        StoreCreditCard.getOneClickPaymentUrls(opts, function(data) {  
            if(data.code != 251 && data.code != 300) {
                if(data.data.url != '' ) {
                    $scope.pendingPayBtn = false;
                    $scope.payRecurring = true;
                    $scope.storePendingPaymentUrl =  data.data.url;
                } else { 
                    $scope.pendingPayBtn = true;
                    $scope.payRecurring = false;
                    $scope.storePendingPaymentUrl = '';
                } 
            } else { 
                $scope.pendingPayBtn = true;
                $scope.payRecurring = false;
                $scope.storePendingPaymentUrl = '/#/shop/payment/success';
            } 
        });
    }

    $scope.getOneClickPaymentUrls();


    /* These method are for payment method tab
    *
    */

    /*function to get the list of credit cards for a shop
    * accept shopid, limit size and limit start
    */

    $scope.cardList = [];
    $scope.getCardList = false;
    $scope.selectedCard = [];
    $scope.selectedCardIndex = 0;
    $scope.getCreditCard = function(itemsCardsPerPage) {
        $scope.getCardList = true;
        $scope.isBlockReq = 0;
        $scope.pagination = false;
        var limit_start = ($scope.currentCardPage -1) * itemsCardsPerPage;
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.session_id = APP.currentUser.id;
        opts.limit_size = itemsCardsPerPage;
        opts.limit_start = limit_start;
        if($scope.isBlockReq == 0 || $scope.firstLoad == 0){
            $scope.isBlockReq = 1;
            $scope.firstLoad == 1;
            StoreCreditCard.getCreditCardLists(opts, function(data) { 
                $scope.isBlockReq = 0;
                if(data.code == 101 && data.message == 'SUCCESS') {
                    $scope.getCardList = false;	
                    $scope.cardList = data.data;
                    $scope.total = data.data.count;
                    $scope.totalCardItems = Math.ceil(data.data.count/itemsCardsPerPage); 
                    if($scope.total > $scope.itemsCardsPerPage){
                        $scope.pagination = true;
                        $scope.range = [];
                        for (var i=1; i <= $scope.itemsCardsPerPage; i++) {
                            $scope.range.push(i);
                        };
                    }else{
                        $scope.pagination = false;
                    }
                    if($scope.cardList.length == 0){
                        $scope.noContent = true;
                    }
                    angular.forEach( $scope.cardList,function(value, index){
                        if(value.defaultflag == 1){
                        	$scope.selectedCard[index] = true;
                        	$scope.selectedCardIndex = index;
                        }else{
                        	$scope.selectedCard[index] = false;
                        }
                    });

                } else {
                    if($scope.cardList.length == 0){
                        //$scope.noContent = true;
                    }
                    $scope.getCardList = false;
                    $scope.msgClass = 'text-red';
                    $scope.cardList = $scope.cardList;
                } 
            });
        } 
    };


    /*functio for Card account apgination start*/
    $scope.currentCardPage = 1;
    $scope.loadMoreCards = function() {
        $scope.getCreditCard($scope.itemsCardsPerPage);
    } 

    $scope.changeCardPageMore = function(pageNo) {
        $scope.currentCardPage = pageNo;
        $scope.loadMoreCards();
    };

    $scope.prevCardPage = function() {
        if ($scope.currentCardPage > 1) {
            $scope.currentCardPage--;
        }
        $scope.loadMoreCards();
    };

    $scope.prevCardPageDisabled = function() {
        return $scope.currentCardPage === 1 ? "disabled" : "";
    };

    $scope.nextCardPage = function() {
        if ($scope.currentCardPage < $scope.totalCardItems) {
            $scope.currentCardPage++;
        }
       $scope.loadMoreCards();
    };

    $scope.nextCardPageDisabled = function() {
        return $scope.currentCardPage === $scope.totalCardItems ? "disabled" : "";
    };

    $scope.setCardPage = function(number) {
        $scope.currentCardPage = number;
        $scope.loadMoreCards();
    };

    /*functio for Card account apgination end*/
    
    /*function to delete the credit cards for a shop
    * accept contract id
    */
    $scope.inDelete = [];
    $scope.deleteCard = function(indx) {
        $scope.inDelete[indx] = true;
        $scope.message = '';
        var card = $scope.cardList[indx];
        var opts = {};
        opts.contract_id = card.contract_id;
        opts.session_id = APP.currentUser.id;
        StoreCreditCard.deleteCard(opts, function(data) {  
            if(data.code == 101) {
                $scope.msgClass = 'text-success';
                $scope.inDelete[indx] = false;
                $scope.cardList.splice(indx,1);
                
                if($scope.cardList.length === 0){
                    $route.reload();
                }else{
                    $scope.message = $scope.i18n.store.card.delete_success;
                    $timeout(function(){
                        $scope.msgClass = '';
                        $scope.message = '';
                    }, 10000);
                }
            } else { 
                $scope.msgClass = 'text-red';
                $scope.inDelete[indx] = false;
                $scope.message = data.message;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } 
        });
    };

    $scope.selectThisCard = function(index){
    	$scope.setDefaultCard(index,$scope.selectedCardIndex)
    };

    $scope.inProcess = [];
    $scope.setDefaultCard = function(newCardIndex, oldCardIndex) {
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.session_id = APP.currentUser.id;
        opts.contract_id = $scope.cardList[newCardIndex].contract_id;
        var newIndx = $scope.cardList[newCardIndex].contract_id;
        var oldIndx = $scope.cardList[oldCardIndex].contract_id;
        $scope.inProcess[newCardIndex] = true;
        $scope.inProcess[oldCardIndex] = false
        StoreCreditCard.setDefaultCard(opts, function(data) {  
            if(data.code == 101) {
                $scope.inProcess[newCardIndex] = false;
                $scope.selectedCardIndex = newCardIndex;
                $scope.cardList[newCardIndex].defaultflag = 1;
                if(oldIndx != -1){
                    $scope.cardList[oldCardIndex].defaultflag = 0;
                }
                $scope.msgClass = 'text-success';
                $scope.message = $scope.i18n.store.card.success;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else { 
                $scope.msgClass = 'text-red';
                $scope.inProcess[newCardIndex] = false;
                $scope.message = data.message;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } 
        });
    };


    $scope.pendingPayment = function(){
        var opts = {
            "$collection":APP.applaneTables.sixc_shop_income,
            "$filter":{
                "date":{
                    "$gte":"2015-04-15T00:00:00.000Z",
                    "$lt":"2015-04-16T00:00:00.000Z"
                },"shop_id":$scope.storeId
            }
        };
        /*StoreWalletService.getStoreWalletApplane(opts, function(data) {
            console.log(data);
        });*/
    };

    //End of payment method tab

    $scope.isActiveTab = function(tabId) {
		if($scope.currentTab == tabId){
	      return true;
	    } else {
	      return false;
	    }
    };

    /**
    *  coupon tab start
    *
    **/
    $scope.loadCoupon = false;
    $scope.couponRecord = [];
    $scope.firstLoad = true;
    /*$scope.couponLimit = $scope.itemsPerPage;*/
    $scope.skip = 0;
    $scope.getCoupon = function(startingDate, endingDate){
        $scope.couponLimit = $scope.itemsPerPage;
        $scope.filter = {
            "shop_id": $scope.storeId,
            "type":"551ce49e2aa8f00f20d9328f",
            "inactive":{
                "$in":[false,null]
            },
            "used_on":{
                "$exists":true
            },
            "balance" : {
                "$gt" : 0
            }
        };
        if($scope.firstLoad === false && $scope.dateApply === true){
            $scope.filter.to_date = {};
            if(startingDate !== null){
                $scope.filter.to_date["$gte"] = DateToMongoDate.dateToIso(startingDate);
            }
            if(endingDate !== null){
                $scope.filter.to_date["$lte"] = DateToMongoDate.dateToIso(endingDate);
            }
            $scope.dateApply = false;
        }else{
            $scope.firstLoad = false;
        }

        var couponReq = {
            "shop_wallet_upto100":{
                "$collection":APP.applaneTables.sixc_citizens_cards,
                "$fields":{
                    "credit":1,
                    "discount":1,
                    "unique_id":1,
                    "citizen_id":1,
                    "from_date":1,
                    "to_date":1,
                    "balance":1
                },
                "$filter": $scope.filter,
                "$sort":{
                    "to_date":-1
                },
                "$limit" : $scope.couponLimit,
                "$skip":$scope.skip
            },
            "shop_wallet_upto100_count":{
                "$collection":APP.applaneTables.sixc_citizens_cards,
                "$group":{
                    "count":{
                        "$sum":1
                    },
                    "_id":null,
                    "$fields":false
                },
                "$filter": $scope.filter
            }
        };

        if($scope.nameFilter === true){
            //$scope.filter.citizen_id = {};
            $scope.filter['$or'] = [{"citizen_id.name":{$regex: $scope.citizensName, $options: 'i'}},{"citizen_id._id":{$regex: $scope.citizensName, $options: 'i'}}];
        }

        if($scope.loadMoreCoupons == false){
            $scope.loadCoupon = true;
        }
        StoreWalletService.getStoreWalletCouponApplane(couponReq, function(data) {
            if(data.status === "ok" && data.code === 200){
                $scope.loadCoupon = false;
                $scope.loadMoreCoupons = false;
                $scope.couponRecord = data.response.shop_wallet_upto100.result;
                $scope.couponCount = 0;
                if(data.response.shop_wallet_upto100_count.result.length > 0){
                    $scope.couponCount = data.response.shop_wallet_upto100_count.result[0].count;
                    if(data.response.shop_wallet_upto100_count.result[0].count > $scope.itemsPerPage){
                        $scope.pagination  = true;
                        $scope.list = 0;
                        $scope.range = [];
                        $scope.list = $scope.couponCount - 1;
                        for (var i = 0; i < $scope.list/$scope.itemsPerPage; i++) {
                            $scope.range.push(i);
                        };
                    }
                }
                $scope.dateApply = false;
            }else{
                $scope.loadCoupon = false;
                $scope.loadMoreCoupons = false;
                $scope.dateApply = false;
            }
        });
    };

    $scope.loadMoreCoupons = false;
    $scope.loadMoreCoupon = function(index){
        sDate = [];
        eDate = [];
        if(index !== 0){
            $scope.skip = (index - 1) * $scope.itemsPerPage;
        }else{
            $scope.skip = 0;
        }
        $scope.couponLimit = $scope.itemsPerPage;
        if($scope.sArray != null | $scope.eArray != null){
            $scope.dateApply = true;
        }
        $scope.loadMoreCoupons = true;
        $scope.getCoupon($scope.sArray, $scope.eArray)
    };

    var sDate = [];
    var eDate = [];
    $scope.sArray = null, $scope.eArray = null;
    $scope.dateApply = false;
    $scope.applyFilter = function(dateObj, callFuntion, name){
        sDate = [];
        eDate = [];
        $scope.filter = {};
        $scope.skip = 0;
        if(dateObj.startDate !== null && dateObj.startDate !== undefined && dateObj.startDate != ''){ 
            $scope.sArray = dateObj.startDate;
            $scope.dateApply = true;
        }else{
            $scope.sArray = null;
        }
        if(dateObj.endDate !== null && dateObj.endDate !== undefined && dateObj.endDate != ''){
            $scope.eArray = dateObj.endDate;
            $scope.dateApply = true;
        }else{
            $scope.eArray = null;
        }
        $scope.citizensName = "";
        $scope.citizenName = "";

        if(name !== undefined || name !== ''){
            $scope.citizensName = name
            $scope.nameFilter = true;
        }else{
            $scope.citizensName = "";
            $scope.nameFilter = false;
        }

        $scope.pagination = false;
        $scope.list = 0;
        $scope.range = [];
        $scope.currentPage = 0;

        if(callFuntion === 'getCoupon'){
            if($scope.sArray === null && $scope.eArray === null && (name == undefined || name == "")){
                $scope.clearFilter();
                return false;
            }
            $scope.couponRecord = [];
            $scope.firstLoad = false;
            $scope.getCoupon($scope.sArray, $scope.eArray);
        } else if(callFuntion === 'getSaleHistory'){
            if($scope.sArray === null && $scope.eArray === null && (name == undefined || name == "")){
                $scope.clearFilter();
                return false;
            }
            $scope.transactionHistoryObjectList= [];
            $scope.firstLoad = false;
            $scope.getSaleHistory($scope.sArray, $scope.eArray);
        }
    };
    $scope.clearFilter = function(){
        $scope.date.startDate = null;
        $scope.date.endDate = null;
        $scope.couponName = "";
        $scope.currentPage = 0;
        $scope.range =[];
        $scope.list = 0;
        $scope.pagination =false;
        $scope.dateApply = false;
        $scope.firstLoad = true;
        $scope.citizensName = "";
        $scope.nameFilter = false;
        $scope.filter = {};
        $scope.sArray = null;
        $scope.eArray = null;
        angular.element("#cName").val("");
        $("#cName").val('');
        $("#cName").trigger('change');
        $scope.getCoupon(null, null);
        if($scope.currentTab === 5){
            $scope.getSaleHistory(null, null);
        }
    };

    DELAY_TIME_BEFORE_POSTING = 300;
    //var element = $('#search');
    currentTimeout = null;
    $scope.waitShop = function(name){
        if(currentTimeout) {
            $timeout.cancel(currentTimeout);
        }
        currentTimeout = $timeout(function(){
            $scope.searchShop(name.shopNameSearch);
        }, DELAY_TIME_BEFORE_POSTING);
        
    };
    $scope.shopNameSearch;
    $scope.searchShop = function(shopName){
        console.log(shopName);
    };

    $scope.downloadCsvFile = function(data){
        $scope.JSONToCSVConvertor(data, 'SaleHistory', true);
    };

    //Called from shop wallet sales history tab only
    $scope.downloaShopdHistorySaleCsvFile = function(JSONData){
        var finalArray = [];
        JSONData.forEach(function(data){
            var JSONobc = {};
            if(data.date != undefined){
                JSONobc["Date"] = $filter('date')(data.date, "dd-MM-yyyy");
            }else{
                JSONobc["Date"] = "";
            } 
            
            if(data.transaction_value != undefined){
                JSONobc["Total Transaction"] = data.transaction_value;
            }else{
                JSONobc["Total Transaction"] = "0";
            } 
           
            if(data.total_cardvalue_used != undefined){
                JSONobc["Shopping Card used"] = data.total_cardvalue_used;
            }else{
                JSONobc["Shopping Card used"] = "";
            }

            if(data.total_discountvalue_used != undefined){
                JSONobc["Discount"] = data.total_discountvalue_used;
            }else{
                JSONobc["Discount"] = "0";
            }

            if(data.payble_value != undefined){
                JSONobc["Cash Amount"] = data.payble_value;
            }else{
                JSONobc["Cash Amount"] = "0";
            }

            if(data.discount_details != undefined){
                var id = ""
                data.discount_details.forEach(function(details){
                    id += details.card_no + " , ";
                }); 
                JSONobc["Card Id"] = id;
            }else{
                JSONobc["Card Id"] = "";
            }

            if(data.citizen_id != undefined){
                JSONobc["Citizen Id"] = data.citizen_id._id;
            }else{
                JSONobc["Citizen Id"] = "";
            }   

            finalArray.push(JSONobc);
        });
        $scope.JSONToCSVConvertor(JSON.stringify(finalArray), 'Shop_Wallet_Sales_History_Report', true);
        /*var finalArray = [];
        for(var i = 0; i < JSONData.length; i++) {
        finalArray1 = {};
        finalArray1.SN = i+1;
        try{
            finalArray1.Citizen_ID = (JSONData[i].citizen_id)._id;
            finalArray1.Citizen_Name = (JSONData[i].citizen_id).name;
        } catch(err){
            finalArray1.Citizen_ID = '';
            finalArray1.Citizen_Name = '';
        }
        try{
            finalArray1.Transaction_Date = $filter('date')(JSONData[i].date, "dd-MM-yyyy");
        } catch(err){
            finalArray1.Transaction_Date = '';  
        }
        try{
            finalArray1.transaction_value = JSONData[i].transaction_value;
        } catch(err){
            finalArray1.transaction_value = '';
        }
        try{
            finalArray1.payble_value = JSONData[i].payble_value;
        } catch(err){
            finalArray1.payble_value = '';
        } 
        try{
            finalArray1.total_discountvalue_used = JSONData[i].total_discountvalue_used;
        } catch(err){
            finalArray1.total_discountvalue_used = '';
        }
        try{
            finalArray1.total_cardvalue_used = JSONData[i].total_cardvalue_used;
        } catch(err){
            finalArray1.total_cardvalue_used = '';
        }
        var ids = '';
        if(JSONData[i].discount_details !== undefined) {
            for(var n = 0; n < JSONData[i].discount_details.length; n++) {
                try{
                    ids += "Id= "+(JSONData[i].discount_details[n].type)._id;
                } catch(err){
                    ids += "Id= ''";  
                }
                try{
                    ids += " Type= "+JSONData[i].discount_details[n].type.name;
                } catch(err){
                    ids += " Type= ''";
                }
                try{
                    ids += " "+"Amount = "+JSONData[i].discount_details[n].amount;
                } catch(err){
                    ids += " "+"Amount = ''";
                }
                try{
                    //ids += " "+"card_id = "+JSONData[i].discount_details[n].card_id._id;
                } catch(err){
                    ids += " "+"card_id = ''";
                }
                try{
                    ids += " "+"Crad_No = "+JSONData[i].discount_details[n].card_id.card_no;
                } catch(err){
                    ids += " "+"Crad_No = ''";                
                }
                try{
                    ids += " "+"used_amount = "+JSONData[i].discount_details[n].used_amount;
                } catch(err){
                    ids += " "+"used_amount = ''"; 
                }
                try{
                    ids += " "+"balance_amount = "+JSONData[i].discount_details[n].balance_amount;
                } catch(err){
                    ids += " "+"balance_amount = ''";
                }
            }
        }
        finalArray1.IDS = ids;
        finalArray.push(finalArray1);
        }
        console.log('finalArray',finalArray);
        $scope.JSONToCSVConvertor(JSON.stringify(finalArray), 'Shop_Wallet_Sales_History_Report', true);*/
    };

    //Called from shop wallet history tab only
    $scope.downloadHistoryCsvFile = function(JSONData) {
        var finalArray = [];
        for(var i = 0; i < JSONData.length; i++) {
        finalArray1 = {};
        finalArray1.SN = i+1;
        try{
            finalArray1.Citizen_ID = (JSONData[i].citizen_id)._id;
            finalArray1.Citizen_Name = (JSONData[i].citizen_id).name;
        } catch(err){
            finalArray1.Citizen_ID = ' - ';
            finalArray1.Citizen_Name = ' - ';
        }
        try{
            finalArray1.Transaction_Date = $filter('date')(JSONData[i].date, "dd-MM-yyyy");
        } catch(err){
            finalArray1.Transaction_Date = ' - ';
        }
        try{
           finalArray1.Type = JSONData[i].discount_details.type.name; 
        }catch(err){
            finalArray1.Type = ' - ';
        }
        try{
           finalArray1.Amount = JSONData[i].discount_details.amount; 
        }catch(err){
            finalArray1.Amount = ' - ';
        }
        try{
           finalArray1.Card_No = JSONData[i].discount_details.card_id.card_no; 
        }catch(err){
            finalArray1.Card_No = ' - ';
        }
        finalArray.push(finalArray1);
        }
        $scope.JSONToCSVConvertor(JSON.stringify(finalArray), 'Shop_Wallet_History_Report', true);
    }

    /**
    *  Common meethod to download exel sheet of record
    *  This require a linear json object only
    */
    $scope.JSONToCSVConvertor = function(JSONData, ReportTitle, ShowLabel) {
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';
        CSV += ReportTitle + '\r\n\n';
        var row,index;
        if (ShowLabel) {
            row = "";
            for ( index in arrData[0]) {
                row += index + ',';
            }
            row = row.slice(0, -1);
            CSV += row + '\r\n';
        }
        for (var i = 0; i < arrData.length; i++) {
            row = "";
            for ( index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
        if (CSV === '') {
            alert("Invalid data");
            return;
        }
        var fileName = '';
        fileName += ReportTitle.replace(/ /g,"_");
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");
        link.href = uri;
        link.setAttribute("href", uri);
        link.setAttribute("download",fileName + ".csv");        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    //pagination start
    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;
    $scope.pagination = false;
    $scope.list = 0;
    $scope.range = [];

    $scope.prevPage = function(page) {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            if(page === 'coupon'){
                $scope.loadMoreCoupon($scope.currentPage);
            } else if(page === 'salehistory'){
                $scope.loadMoreSaleHistory($scope.currentPage);
            }
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.pageCount = function() {
        if ($scope.list !== undefined) {
            return Math.ceil($scope.list/$scope.itemsPerPage)-1;
        }
    };

    $scope.nextPage = function(page) {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
            if(page === 'coupon'){
                $scope.loadMoreCoupon($scope.currentPage + 1);
            } else if(page === 'salehistory'){
                $scope.loadMoreSaleHistory($scope.currentPage + 1);
            }
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function(n) {
        $scope.currentPage = n;
    };

    // Pagination nation end

    /**
    *  end of  Common meethod to download exel sheet of record
    */

    //gershoppingcard data for shop wallet
    $scope.rangeCardHundred  = [];
    $scope.currentPageCardHundred = 1;
    $scope.firstPageCardHundred = APP.store_list_pagination.end;
    $scope.itemsPerPageCardHundred = 6;
    $scope.totalItemsCardHundred = 0;
    $scope.rangeCardFifty  = [];
    $scope.currentPageCardFifty = 1;
    $scope.firstPageCardFifty = APP.store_list_pagination.end;
    $scope.itemsPerPageCardFifty = 6;
    $scope.totalItemsCardFifty = 0;
    $scope.pageloader100 = false;
    $scope.pageloader50 = false;
    $scope.changePageMoreCardHundred  = function(pageNo) {
        $scope.pageloader100 = true;
        $scope.currentPageCardHundred  = pageNo;
        $scope.getShopWalletShoppingCard();
    };
    
    $scope.prevPageCardHundred  = function() {
        $scope.pageloader100 = true;
        if ($scope.currentPageCardHundred  > 1) {
            $scope.currentPageCardHundred --;
        }
        $scope.getShopWalletShoppingCard();
    };

    $scope.prevPageDisabledCardHundred  = function() {
        return $scope.currentPageCardHundred  === 1 ? "disabled" : "";
    };
    $scope.nextPageCardHundred  = function() {
        $scope.pageloader100 = true;
        if ($scope.currentPageCardHundred  < $scope.totalItemsCardHundred ) {
            $scope.currentPageCardHundred ++;
        }
        $scope.getShopWalletShoppingCard();
    };

    $scope.nextPageDisabledCardHundred  = function() {
        return $scope.currentPageCardFifty  === $scope.totalItemsCardFifty  ? "disabled" : "";
    };
    //for 50% pagination section
    $scope.changePageMoreCardFifty  = function(pageNo) {
        $scope.pageloader50 = true;
        $scope.currentPageCardFifty  = pageNo;
        $scope.getShopWalletShoppingCard();
    };
    
    $scope.prevPageCardFifty  = function() {
        $scope.pageloader50 = true;
        if ($scope.currentPageCardFifty  > 1) {
            $scope.currentPageCardFifty --;
        }
        $scope.getShopWalletShoppingCard();
    };

    $scope.prevPageDisabledCardFifty  = function() {
        return $scope.currentPageCardFifty  === 1 ? "disabled" : "";
    };
    $scope.nextPageCardFifty  = function() {
        $scope.pageloader50 = true;
        if ($scope.currentPageCardFifty  < $scope.totalItemsCardFifty ) {
            $scope.currentPageCardFifty ++;
        }
        $scope.getShopWalletShoppingCard();
    };

    $scope.nextPageDisabledCardFifty  = function() {
        return $scope.currentPageCardFifty  === $scope.totalItemsCardFifty  ? "disabled" : "";
    };
    $scope.shopwalletupto100count = 0;
    $scope.shopwalletupto50count = 0;
    $scope.walletloader = true;
    $scope.walletcontainer = false;
    $scope.noresult = false;
    $scope.filterObject = {};
    $scope.filterObject50 = {}
    $scope.filterObject['shop_id'] = String($scope.storeId);
    $scope.filterObject['type'] = "551ce49e2aa8f00f20d93295";
    $scope.filterObject['inactive'] = {
                                        "$in":[
                                        false,
                                        null
                                        ]
                                    }
    $scope.filterObject['used_on'] = {"$exists":true};
    $scope.filterObject['balance'] = {"$gt":0};
    $scope.filterObject50['shop_id'] = String($scope.storeId);
    $scope.filterObject50['type'] = "551ce49e2aa8f00f20d93293";
    $scope.filterObject50['inactive'] = {
                                        "$in":[
                                        false,
                                        null
                                        ]
                                    }
    $scope.filterObject50['used_on'] = {"$exists":true}
    $scope.filterObject50['balance'] = {"$gt":0};
    $scope.getShopWalletShoppingCard = function(){       
        
        var limit_start = ($scope.currentPageCardHundred -1)*$scope.itemsPerPageCardHundred;
        var limit_start_fifty = ($scope.currentPageCardFifty -1)*$scope.itemsPerPageCardFifty;
        var opts =  {
                        "shop_wallet_upto100":{
                            "$collection":"sixc_citizens_cards",
                            "$fields":{
                                "credit":1,
                                "card_no":1,
                                "card_code":1,
                                "citizen_id":1,
                                "from_date":1,
                                "to_date":1,
                                "balance":1
                                //"shop_id.name":1
                                //"citizen_id.name":1
                                },
                            "$filter": $scope.filterObject,
                            "$sort":{
                                "used_on":-1
                            },
                            "$limit":$scope.itemsPerPageCardHundred,
                            "$skip":limit_start
                        },
                        "shop_wallet_upto100_count":{
                                "$collection":"sixc_citizens_cards",
                                "$group":{
                                    "count":{
                                        "$sum":1
                                    },
                                "_id":null,
                                "$fields":false
                            },
                            "$filter":$scope.filterObject
                        },
                        "shop_wallet_upto50":{
                            "$collection":"sixc_citizens_cards",
                            "$fields":{
                                "credit":1,
                                "card_no":1,
                                "card_code":1,
                                "citizen_id":1,
                                "from_date":1,
                                "to_date":1,
                                "balance":1
                            },
                            "$filter":$scope.filterObject50,
                            "$sort":{
                                "used_on":-1
                            },
                            "$limit":$scope.itemsPerPageCardFifty,
                            "$skip":limit_start_fifty
                        },
                        "shop_wallet_upto50_count":{
                            "$collection":"sixc_citizens_cards",
                            "$group":{
                                "count":{
                                "$sum":1
                                },
                            "_id":null,
                            "$fields":false
                            },
                            "$filter":$scope.filterObject50
                        }
                };
        //StoreWalletService.getStoreWallet(opts, function(data) {
        StoreWalletService.getStoreWalletShoppingCard(opts, function(data) {
            $scope.walletloader = false;
            $scope.pageloader100 = false;
            $scope.pageloader50 = false;
             if(data.status === 'ok' && data.code === 200) {
                $scope.shopwalletupto100 = data.response.shop_wallet_upto100.result;
                if(data.response.shop_wallet_upto100_count.result.length > 0) {
                    $scope.shopwalletupto100count = data.response.shop_wallet_upto100_count.result[0].count;
                } else {
                    $scope.shopwalletupto100count = 0;
                }
                $scope.shopwalletupto50 = data.response.shop_wallet_upto50.result;
                if(data.response.shop_wallet_upto50_count.result.length > 0){
                    $scope.shopwalletupto50count = data.response.shop_wallet_upto50_count.result[0].count;
                } else {
                    $scope.shopwalletupto50count = 0;
                }
                $scope.totalItemsCardHundred = Math.ceil($scope.shopwalletupto100count/$scope.itemsPerPageCardHundred ); 
                $scope.totalItemsCardFifty = Math.ceil($scope.shopwalletupto50count/$scope.itemsPerPageCardFifty ); 
                $scope.rangeCardHundred = [];  
                $scope.rangeCardFifty = [];  
                for (var i=1; i<=$scope.totalItemsCardHundred ; i++) {
                    $scope.rangeCardHundred.push(i);
                } 
                for (var j=1; j<=$scope.totalItemsCardFifty ; j++) {
                    $scope.rangeCardFifty.push(j);
                }   
                $scope.pageloader100 = false;
                $scope.pageloader50 = false;
                $scope.walletcontainer = true;
            } else {
                $scope.rangeCardHundred = [];  
                $scope.rangeCardFifty = []; 
                $scope.shopwalletupto50count = 0;
                $scope.shopwalletupto100count = 0;
                $scope.walletcontainer = true;
            }           
        });
    };

    $scope.clearSearch = function(){
         $scope.currentPageCardHundred = 1;
        $scope.currentPageCardFifty = 1;
        $scope.walletloader = true;
        $('.from input').val('');
        $('.to input').val('');
        $('#searchtext').val('');
        $scope.filterObject = {};
        $scope.filterObject50 = {};
        $scope.filterObject['shop_id'] = String($scope.storeId);
        $scope.filterObject['type'] = "551ce49e2aa8f00f20d93295";
        $scope.filterObject['inactive'] = {
                                            "$in":[
                                            false,
                                            null
                                            ]
                                        }
        $scope.filterObject['used_on'] = {"$exists":true}
        $scope.filterObject['balance'] = {"$gt":0};
        $scope.filterObject50['shop_id'] = String($scope.storeId);
        $scope.filterObject50['type'] = "551ce49e2aa8f00f20d93293";
        $scope.filterObject50['inactive'] = {
                                            "$in":[
                                            false,
                                            null
                                            ]
                                        }
        $scope.filterObject50['used_on'] = {"$exists":true};
        $scope.filterObject50['balance'] = {"$gt":0};
        $scope.getShopWalletShoppingCard();
    }

    $scope.searchCardByCti = function(){
        $scope.currentPageCardHundred = 1;
        $scope.currentPageCardFifty = 1;
        $scope.walletloader = true;
        $scope.filterObject = {};
        $scope.filterObject50 = {};
        var fromInput = $('.from input').val();
        var toinput = $('.to input').val();
        var frInp = fromInput.split("-");
        var toInp = toinput.split("-");
        console.log(DateToMongoDate.dateToIso(fromInput)+'tgtgg');
        var newfromdate = DateToMongoDate.dateToIso(fromInput);
        var newtodate = DateToMongoDate.dateToIso(toinput);
        var searchdata = $('#searchtext').val();
        if(((fromInput !== undefined && fromInput !== '' || toinput !== undefined && toinput !== '')) && searchdata === '') {
            //console.log('it has date');
            if(frInp[0] !== undefined && frInp[0] !== ''){
                if($scope.filterObject['to_date']){
                  $scope.filterObject['to_date']["$gte"] = newfromdate;
                  $scope.filterObject50['to_date']["$gte"] = newfromdate;
                }else{
                  $scope.filterObject['to_date'] = {
                    "$gte" : newfromdate
                  }
                  $scope.filterObject50['to_date'] = {
                    "$gte" : newfromdate
                  }
                }
            }

            if(toInp[0] !== undefined && toInp[0] !== ''){
                if($scope.filterObject['to_date']){
                  $scope.filterObject['to_date']["$lte"] = newtodate;
                  $scope.filterObject50['to_date']["$lte"] = newtodate;
                }else{
                  $scope.filterObject['to_date'] = {
                    "$lte" : newtodate
                  }
                  $scope.filterObject50['to_date'] = {
                    "$lte" : newtodate
                  }
                }
            }
            $scope.filterObject['shop_id'] = String($scope.storeId);
            $scope.filterObject['type'] = "551ce49e2aa8f00f20d93295";
            $scope.filterObject['balance'] = {"$gt":0};
            $scope.filterObject50['shop_id'] = String($scope.storeId);
            $scope.filterObject50['type'] = "551ce49e2aa8f00f20d93293";
            $scope.filterObject50['balance'] = {"$gt":0};
            $scope.getShopWalletShoppingCard();
        }  else if((fromInput !== undefined && fromInput !== '' || toinput !== undefined && toinput !== '') && (searchdata !== '' && searchdata !== undefined)) {
            //console.log('all');
            //$scope.filterObject['citizen_id.name'] = {"$regex":".*"+searchdata+".*", $options: 'i'};
            //$scope.filterObject['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            $scope.filterObject['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            $scope.filterObject['shop_id'] = String($scope.storeId);
            $scope.filterObject['type'] = "551ce49e2aa8f00f20d93295";
            $scope.filterObject['inactive'] = {
                                                "$in":[
                                                false,
                                                null
                                                ]
                                            }
            $scope.filterObject['used_on'] = {"$exists":true}
            $scope.filterObject['balance'] = {"$gt":0};
            //$scope.filterObject50['citizen_id.name'] = {"$regex":".*"+searchdata+".*", $options: 'i'};
            //$scope.filterObject50['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            $scope.filterObject50['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            $scope.filterObject50['shop_id'] = String($scope.storeId);
            $scope.filterObject50['type'] = "551ce49e2aa8f00f20d93293";
            $scope.filterObject50['inactive'] = {
                                                "$in":[
                                                false,
                                                null
                                                ]
                                            }
            $scope.filterObject50['used_on'] = {"$exists":true};
            $scope.filterObject50['balance'] = {"$gt":0};
            if(frInp[0] !== undefined && frInp[0] !== ''){
                if($scope.filterObject['to_date']){
                  $scope.filterObject['to_date']["$gte"] = newfromdate;
                  $scope.filterObject50['to_date']["$gte"] = newfromdate;
                }else{;
                  $scope.filterObject['to_date'] = {
                    "$gte" : newfromdate
                  }
                  $scope.filterObject50['to_date'] = {
                    "$gte" : newfromdate
                  }
                }
            }

            if(toInp[0] !== undefined && toInp[0] !== ''){
                if($scope.filterObject['to_date']){
                  $scope.filterObject['to_date']["$lte"] = newtodate;
                  $scope.filterObject50['to_date']["$lte"] = newtodate;
                }else{
                  $scope.filterObject['to_date'] = {
                    "$lte" : newtodate
                  }
                  $scope.filterObject50['to_date'] = {
                    "$lte" : newtodate
                  }
                }
            }
            $scope.getShopWalletShoppingCard();
        } else if((fromInput === '' || toinput === '' ) && (searchdata !== '' && searchdata !== undefined)) {
            //console.log('input');
            //$scope.filterObject['citizen_id.name'] = {"$regex":".*"+searchdata+".*", $options: 'i'};
            //$scope.filterObject['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            $scope.filterObject['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            $scope.filterObject['shop_id'] = String($scope.storeId);
            $scope.filterObject['type'] = "551ce49e2aa8f00f20d93295";
            $scope.filterObject['inactive'] = {
                                                "$in":[
                                                false,
                                                null
                                                ]
                                            }
            $scope.filterObject['used_on'] = {"$exists":true};
            $scope.filterObject['balance'] = {"$gt":0};
            //$scope.filterObject50['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            $scope.filterObject50['$or'] = [{"citizen_id.name":{"$regex":".*"+searchdata+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+searchdata+".*", $options: 'i'}}];
            //$scope.filterObject50['citizen_id.name'] = {"$regex":".*"+searchdata+".*", $options: 'i'};
            $scope.filterObject50['shop_id'] = String($scope.storeId);
            $scope.filterObject50['type'] = "551ce49e2aa8f00f20d93293";
            $scope.filterObject50['inactive'] = {
                                                "$in":[
                                                false,
                                                null
                                                ]
                                            }
            $scope.filterObject50['used_on'] = {"$exists":true};
            $scope.filterObject50['balance'] = {"$gt":0};
            $scope.getShopWalletShoppingCard();
        } else {
            $scope.clearSearch();
        }

    }

    /*var currentDate = new Date();
    var cDay = currentDate.getDate()
    var cMonth = currentDate.getMonth() + 1
    var cYear = currentDate.getFullYear()
    
    var endFilter = cYear + '-' + cMonth + '-' + cDay;
    var yesterdayDate = new Date('2000-01-01T00:00:00');
    var sDay = yesterdayDate.getDate()
    var sMonth = yesterdayDate.getMonth() + 1
    var sYear = yesterdayDate.getFullYear()
    
    var startFilter = sYear + '-' + sMonth + '-' + sDay;*/
    $scope.date = {"startDate": null, "endDate": null };


    //function to open paypal subscription form
    $scope.openPaypalForm = function() {
        $scope.paypalErrCls = '';
        $scope.paypalErrMsg = '';
        $scope.isShowForm = true;
    }

    //set the account as default
    $scope.selectThisAccount = function(index){
        $scope.setDefaultAccount(index,$scope.selectedAccountIndex)
    };

    $scope.inProcess = [];
    $scope.setDefaultAccount = function(newAccountIndx, oldAccountIndx) {
        $scope.storeData = StoreService.getStoreData();
        var opts = {};
        opts.shop_id = $scope.storeData.id;
        opts.session_id = APP.currentUser.id;
        opts.id = $scope.paypalAccountList[newAccountIndx].id;
        var newIndx = $scope.paypalAccountList[newAccountIndx].id;
        var oldIndx = $scope.paypalAccountList[oldAccountIndx].id;
        $scope.inProcess[newAccountIndx] = true;
        $scope.inProcess[oldAccountIndx] = false
        StoreCreditCard.setDefaultPaypalAccounts(opts, function(data) {  
            if(data.code == 101) {
                $scope.inProcess[newAccountIndx] = false;
                $scope.selectedAccountIndex = newAccountIndx;
                $scope.paypalAccountList[newAccountIndx].defaultflag = 1;
                if(oldIndx != -1){
                    $scope.paypalAccountList[oldAccountIndx].defaultflag = 0;
                }
                $scope.msgClass = 'text-success';
                $scope.message = $scope.i18n.store_wallet.paypal.set_default_success;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else { 
                $scope.msgClass = 'text-red';
                $scope.inProcess[newAccountIndx] = false;
                $scope.message = $scope.i18n.store_wallet.paypal.failure;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } 
        });
    };

    /*function to delete the paypal accounts for a shop
    * accept id
    */
    $scope.inDelete = [];
    $scope.deleteAccount = function(indx) {
        $scope.storeData = StoreService.getStoreData();
        $scope.inDelete[indx] = true;
        $scope.message = '';
        var account = $scope.paypalAccountList[indx];
        var opts = {};
        opts.id = account.id;
        opts.shop_id = $scope.storeData.id;
        opts.session_id = APP.currentUser.id;
        StoreCreditCard.deletePaypalAccounts(opts, function(data) {  
            if(data.code == 101) {
                $scope.msgClass = 'text-success';
                $scope.inDelete[indx] = false;
                $scope.paypalAccountList.splice(indx,1);
                $scope.message = $scope.i18n.store_wallet.paypal.delete_success;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else if(data.code == 100) {
                $scope.msgClass = 'text-red';
                $scope.inDelete[indx] = false;
                $scope.message = $scope.i18n.store_wallet.paypal.param_missed;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else if(data.code == 1054) {
                $scope.msgClass = 'text-red';
                $scope.inDelete[indx] = false;
                $scope.message = $scope.i18n.store_wallet.paypal.access_voilation;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else if(data.code == 1029) {
                $scope.msgClass = 'text-red';
                $scope.inDelete[indx] = false;
                $scope.message = $scope.i18n.store_wallet.paypal.failure;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else { 
                $scope.msgClass = 'text-red';
                $scope.inDelete[indx] = false;
                $scope.message = $scope.i18n.store_wallet.paypal.failure;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } 
        });
    };
      
      //shop sale history start
      $scope.itemsSaleHistoryPerPage = APP.sale_history.end;
      //calling function to get customer transaction for the open shop
      $scope.transactionlist= {};
      $scope.transactionHistoryObjectList = [];
      $scope.hasNext = true;
      $scope.myRes = 1;
      $scope.historyLimit = 0;
      $scope.isLoadMore = false;
      $scope.getSaleHistory = function(startingDate, endingDate) {
        if($scope.isLoadMore == false){
            $scope.requestSending = true;
        }
        $scope.filter = {
            "shop_id._id": $scope.storeId,
            "status":"Approved",
            "transaction_type_id":{
                "$in":["553209267dfd81072b176bba", "553209267dfd81072b176bbc"]
            }
        };
        if($scope.firstLoad === false && $scope.dateApply === true){
            $scope.filter.date = {};
            if(startingDate !== null){
                $scope.filter.date["$gte"] = DateToMongoDate.dateToIso(startingDate);
            }
            if(endingDate !== null){
                $scope.filter.date["$lt"] = DateToMongoDate.dateToIso(endingDate);
            }
            $scope.dateApply = false;
        }else{
            $scope.firstLoad = false;
        }

        var saleHistoryReq = {
            "sale_history":{
                "$collection":APP.applaneTables.transaction,
                "$fields":{
                    "date":1,
                    "total_discountvalue_used":1,
                    "total_cardvalue_used":1,
                    "transaction_value":1,
                    "payble_value":1,
                    "citizen_id":1,
                    "discount_details":1
                },
                "$filter": $scope.filter,
                "$sort":{
                    "date":-1
                },
                "$limit" : $scope.historyLimit,
                "$skip":$scope.skip
            },
            "sale_history_count":{
                "$collection":APP.applaneTables.transaction,
                "$group":{
                    "count":{
                        "$sum":1
                    },
                    "_id":null,
                    "$fields":false
                },
                "$filter": $scope.filter
            }
        };

        if($scope.nameFilter === true){
            //$scope.filter.citizen_id = {};
            //$scope.filter["citizen_id.name"] = {"$regex":".*"+$scope.citizensName+".*", $options: 'i'};
            $scope.filter["$or"] = [{"citizen_id.name":{"$regex":".*"+$scope.citizensName+".*", $options: 'i'}},{"citizen_id._id":{"$regex":".*"+$scope.citizensName+".*", $options: 'i'}}];
        }

        StoreWalletService.getStoreWalletHistoryApplane(saleHistoryReq, function(data) {
            $scope.requestSending = false;
            $scope.isLoadMore = false;
            if(data.code == 200) {
                if(data.response.sale_history.result !== undefined || data.response.sale_history.result.length !== 0){
                    if($scope.isLoadSaleHistory == false){
                    $scope.transactionHistoryObjectList = [];
                    }
                    $scope.transactionHistoryObjectList = data.response.sale_history.result;
                    $scope.totalSaleHistoryItems = false;
                }
                if(data.response.sale_history_count.result.length > 0){
                    $scope.saleHistroyCount = data.response.sale_history_count.result[0].count;
                    if(data.response.sale_history_count.result[0].count > $scope.itemsPerPage){
                        $scope.pagination  = true;
                        $scope.list = 0;
                        $scope.list = $scope.saleHistroyCount;
                        $scope.range = [];
                        $scope.totalHistoryItems = Math.ceil($scope.list/$scope.itemsPerPage); 
                        for (var i = 0; i < $scope.totalHistoryItems; i++) {
                            $scope.range.push(i);
                        };
                    }
                }
                $scope.dateApply = false;
            } else if(data.status === "error") {
              $scope.step = 1;
              $scope.errorMsg = $scope.i18n.shop_transaction.txn_server_error;
              $scope.isLoadMore = false;
              $scope.notFound = true;
              $scope.requestSending = false;
            }
          });
        }
      // loading more sale history list
    $scope.isLoadSaleHistory = false;
    $scope.historyLimit = APP.sale_history.end;;
    $scope.loadMoreSaleHistory = function(index){
        sDate = [];
        eDate = [];
        if(index !== 0){
            $scope.skip = (index - 1) * APP.sale_history.end;
        }else{
            $scope.skip = 0;
        }
        $scope.historyLimit = APP.sale_history.end;
        if($scope.sArray != null | $scope.eArray != null){
            $scope.dateApply = true;
        }
        //$scope.currentPage = 0;
        $scope.isLoadMore = true;
        $scope.getSaleHistory($scope.sArray, $scope.eArray);
    };

    //function to close pay pal form
    $scope.closeForm  = function(){
        $scope.isLoadMore = false;
        $scope.loadMoreAccounts();
        $scope.paypal = {};
        $scope.isShowForm = false;
    };

    $scope.getData = function(tabId) {
        $scope.pagination = false;
        $scope.currentPage = 0;
        $scope.range = [];
        $scope.list = 0;
        switch(tabId) {
            case 1:
                $scope.positionHistory = [];
                $scope.getShopWallet();
                $scope.shopPreniumHistory();
                $scope.currentTab = tabId;
                $scope.date = {"startDate": null, "endDate": null };
                break;
            case 2:
                $scope.getShopWalletShoppingCard();
                $scope.currentTab = tabId;
                //$scope.getShoppingCard();
                $scope.date = {"startDate": null, "endDate": null };
                break;
            case 3:
                $scope.currentTab = tabId;
                $scope.couponRecord = [];
                $scope.list = [];
                $scope.firstLoad = true;
                $scope.date.startDate = null;
                $scope.date.endDate = null;
                $scope.couponName = "";
                $scope.dateApply = false;
                $scope.firstLoad = true;
                $scope.citizensName = "";
                $scope.citizenName = "";
                $scope.nameFilter = false;
                $scope.filter = {};
                $scope.sArray = null;
                $scope.eArray = null;
                $scope.skip = 0;
                $scope.date = {"startDate": null, "endDate": null };
                $scope.getCoupon(null, null);
                break;
            case 4:
                $scope.currentTab = tabId;
                //$scope.showHistory();
                $scope.date = {"startDate": null, "endDate": null };
                break;
            case 5:
                $scope.currentTab = tabId;
                $scope.nameFilter = false;
                $scope.citizensName = "";
                $scope.citizenName = "";
                $scope.date.startDate = null;
                $scope.date.endDate = null;
                $scope.itemsPerPage = APP.sale_history.end;
                $scope.filter = {};
                $scope.range = [];
                $scope.sArray = null;
                $scope.eArray = null;
                $scope.getSaleHistory(null, null);
                $scope.date = {"startDate": null, "endDate": null };
                break;
            case 6:
                $scope.currentTab = tabId;
                $scope.getSubTabData(1);
                //$scope.getCreditCard();
                $scope.pendingPayment();
                $scope.date = {"startDate": null, "endDate": null };
                break;
            default:
                $scope.getShopWallet();
                $scope.shopPreniumHistory();
                $scope.currentTab = 1;
                break;
        }
    };

    if(storeShopHistorySelection.getPenPaymentMethod() === true) {
        storeShopHistorySelection.setPenPaymentMethod(false);
        $scope.getData(6);
    }else if(storeShopHistorySelection.getStorage() == true){
        $scope.currentTab = 5;
        storeShopHistorySelection.clearStorage();
        $scope.getData(5);
    }else{
        $scope.getData(1);
    }
    $scope.paymentAmount= function(){
        var opts ={};
        opts.shop_id = $scope.storeId;
        opts.user_id = APP.currentUser.id;
        StoreWalletService.getTotalPendingPayments(opts, function(data) {
            if(data.code == 101){
            $scope.pendingPaymentDetail = data.data;
            $scope.pendingAmount = $scope.pendingPaymentDetail.pending_amount;
           
        } else {  }
        });
    } 
    $scope.paymentAmount();
    $scope.showList = false;
    $scope.showDetailLoader = false;
    $scope.itemsPerPage  = 10;
    $scope.range         = []; 
    $scope.currentPagee =1;
    $scope.listPendingListing= function(itemsPerPage){
        $scope.range         = []; 
        $scope.showDetailLoader = true;
        $scope.showNoDetailMsg = false;
        var opts ={};
        opts.shop_id = $scope.storeId;
        opts.user_id = APP.currentUser.id;
        opts.limit_start = ($scope.currentPagee-1)*itemsPerPage;
        opts.limit_size = itemsPerPage;
        StoreWalletService.getTotalPaymentListing(opts, function(data) {
            if(data.code == 101){
                $scope.showDetailLoader = false;
                $scope.pendingPaymentlisting = data.data;
                $scope.pendingListing = $scope.pendingPaymentlisting.transactions;
                if($scope.pendingListing.length == 0){
                    $scope.showNoDetailMsg = true;
                }
                $scope.totalItems = Math.ceil(data.data.size/itemsPerPage); 
                $scope.range = [];  
                for (var i=1; i<=$scope.totalItems; i++) {
                    $scope.range.push(i);
                } 
            } else if(data.code == 1066 ){  
               $scope.showDetailLoader = false; 
               $scope.showNoDetailMsg = true;
            } else {
               $scope.showDetailLoader = false;
            }
        });
    } ;
    $scope.setPagePay = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPagee = 1;
        $scope.listPendingListing($scope.itemsPerPage);
    };

    
     $scope.prevPageDisabledPay = function() {
        return $scope.currentPagee === 1 ? "disabled" : "";
    };

    $scope.prevPagePay = function() {
        if ($scope.currentPagee > 1) {
            $scope.currentPagee--;
        }
        $scope.listPendingListing($scope.itemsPerPage);
    };

    $scope.nextPagePay = function() {
        if ($scope.currentPagee < $scope.totalItems) {
            $scope.currentPagee++;
        }
        $scope.listPendingListing($scope.itemsPerPage);
    };

    $scope.paginatePay = function() {
       $scope.currentPagee = 1; 
    }

    $scope.nextPageDisabledPay = function() {
        return $scope.currentPagee === $scope.totalItems ? "disabled" : "";
    };
    $scope.showListPay = function(){
       $scope.showList = !$scope.showList;
        if($scope.showList){
            $scope.listPendingListing($scope.itemsPerPage);
        }
    }
    $scope.changePageMorePay = function(pageNo) {
        $scope.currentPagee = pageNo;
        $scope.listPendingListing($scope.itemsPerPage);
    };
    $scope.showMoreEuro = false; 
    $scope.payPendingAmount = function(){
        var opts ={};
        opts.shop_id = $scope.storeId;
        opts.user_id = APP.currentUser.id;
        opts.cancel_url = APP.payment.siteDomain + '#/shop/wallet/'+ $scope.storeId; 
        opts.return_url = APP.payment.siteDomain + '#/shop/wallet/'+ $scope.storeId; 
        StoreWalletService.getRecurringPaymenturls(opts, function(data) { 
                if(data.code == 101) {
                    if(data.data.url != '' ) {
                        $window.location.href = data.data.url;
                    } else { 
                        $scope.getPaymentUrl = '';
                    } 
                } else if(data.code == 1072){ 
                    $scope.getPaymentUrl = '';
                    $scope.showMoreEuro = true;
                    $timeout(function(){
                       $scope.showMoreEuro = false;
                    },8000); 
                } else { 
                    $scope.getPaymentUrl = '';
                }
            });   
    }; 

      // // loading more sale history  list
      // $scope.searchSaleHistoryTransaction = function() {
      //   $scope.hasNext =  true;
      //   $scope.saleHistoryCurrentPage = 1;
      //   $scope.transactionHistoryObjectList = [];
      //   $scope.getSaleHistory($scope.itemsSaleHistoryPerPage);
      // };
}]);