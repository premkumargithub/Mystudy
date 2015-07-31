app.controller('StoreCreditCard', 
    ['$scope', '$http', 'StoreCreditCard', '$rootScope', '$location', '$routeParams', '$timeout',  
    function($scope, $http, StoreCreditCard, $rootScope, $location, $routeParams, $timeout) {

        $scope.storeId = $routeParams.id;
        $scope.userId = APP.currentUser.id;
        $rootScope.tempStoreId = $scope.storeId;
        //$scope.storeId = '23748';
        $scope.cardList = [];
        $scope.isLoadingCard = false;
        $scope.messsage = '';
        $scope.inProcess = [];
        $scope.inDelete = [];
        $scope.noContent = false;
        $scope.total = 0;
        $scope.firstLoad = 0;
        $scope.pendingPayBtn = true;
        $scope.payRecurring = false;
        
    /*function to get the list of credit cards for a shop
    * accept shopid, limit size and limit start
    */
    $scope.getCreditCard = function() {
        $scope.isLoadingCard = true;
        $scope.isBlockReq = 0;
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.session_id = APP.currentUser.id;
        opts.limit_size = APP.store_credit_card_pagination.end;
        opts.limit_start = $scope.cardList.length;
        if(($scope.isBlockReq == 0 && $scope.total != $scope.cardList.length) || $scope.firstLoad == 0){
            $scope.isBlockReq = 1;
            $scope.firstLoad == 1;
            StoreCreditCard.getCreditCardLists(opts, function(data) { 
                $scope.isBlockReq = 0;
                if(data.code == 101) {
                    $scope.isLoadingCard = false;
                    $scope.cardList = $scope.cardList.concat(data.data);
                    $scope.total = data.data.count;
                    if($scope.cardList.length == 0){
                        $scope.noContent = true;
                    }
                } else {
                    if($scope.cardList.length == 0){
                        $scope.noContent = true;
                    }
                    $scope.isLoadingCard = false;
                    $scope.msgClass = 'alert-warning';
                    $scope.cardList = $scope.cardList;
                } 
            });
        } 
    };

    $scope.getCreditCard();

    /*function to set the default card value in scop
    * accept card object set the value in scope if defaultflag is true
    */

    $scope.setDefault = function(card) {
        if(card.defaultflag == 1){
            $scope.cardid = card.contract_id;
        }
    };
    
    $scope.$watch(function () {
        return $scope.cardid;
    },

    function (newValue, oldValue) {
        $scope.message = '';
        if(newValue != oldValue && oldValue != undefined){
            $scope.setDefaultCard(newValue,oldValue);
        }
    }, true);

    /*function to set the credit card as defalt
    * accept shopid, contract id
    */
    $scope.setDefaultCard = function(newCard,oldCard) {
        var opts = {};
        opts.store_id = $scope.storeId;
        opts.session_id = APP.currentUser.id;
        opts.contract_id = parseInt(newCard);
        var newIndx = $scope.cardList.map(function(d) { return d['contract_id']; }).indexOf(parseInt(newCard));
        var oldIndx = $scope.cardList.map(function(d) { return d['contract_id']; }).indexOf(parseInt(oldCard));
        $scope.inProcess[newIndx] = true;

        StoreCreditCard.setDefaultCard(opts, function(data) {  
            if(data.code == 101) {
                $scope.inProcess[newIndx] = false;
                $scope.cardList[newIndx].defaultflag = 1;
                if(oldIndx != -1){
                    $scope.cardList[oldIndx].defaultflag = 0;
                }
                $scope.msgClass = 'alert-info';
                $scope.message = $scope.i18n.store.card.success;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else { 
                $scope.msgClass = 'alert-warning';
                $scope.inProcess[newIndx] = false;
                $scope.message = data.message;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } 
        });
    };

    /*function to delete the credit cards for a shop
    * accept contract id
    */
    $scope.deleteCard = function(indx) {
        $scope.inDelete[indx] = true;
        $scope.message = '';
        var card = $scope.cardList[indx];
        var opts = {};
        opts.contract_id = card.contract_id;
        opts.session_id = APP.currentUser.id;
        StoreCreditCard.deleteCard(opts, function(data) {  
            if(data.code == 101) {
                $scope.msgClass = 'alert-info';
                $scope.inDelete[indx] = false;
                $scope.cardList.splice(indx,1);
                $scope.message = $scope.i18n.store.card.delete_success;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } else { 
                $scope.msgClass = 'alert-warning';
                $scope.inDelete[indx] = false;
                $scope.message = data.message;
                $timeout(function(){
                    $scope.msgClass = '';
                    $scope.message = '';
                }, 10000);
            } 
        });
    };

    
    /*function to load more credit card
    *
    */
    $scope.loadMore = function() {
        $scope.isLoadingCard = true;
        $scope.getCreditCard();
    };

    // //get onclick url for recurring payment
    // $scope.payRecurringPayment = function() {
    //     $scope.message = undefined;
    //     var opts = {};
    //     opts.store_id = $scope.storeId;
        
    //     StoreCreditCard.getOnClickRecurringPayments(opts, function(data) {  
    //         if(data.code == 251) {
    //             $scope.msgClass = 'alert-info';
    //             $scope.message = $scope.i18n.store.payment.less_amount;
    //         } else if(data.code == 252){ 
    //             $scope.msgClass = 'alert-warning';
    //             $scope.message = $scope.i18n.store.payment.no_card;
    //         } else if (data.code == 253) {
    //             $scope.msgClass = 'alert-warning';
    //             $scope.message = $scope.i18n.store.payment.payment_fail;
    //         } else if (data.code == 101) {
    //             $scope.msgClass = 'alert-info';
    //             $scope.message = $scope.i18n.store.payment.payment_success;
    //         }
    //         $timeout(function(){
    //             $scope.msgClass = '';
    //             $scope.message = '';
    //         }, 10000);
    //     });
    // }

    
    // //function to get the pending payment url
    // $scope.getOneClickPaymentUrls = function() {
    //     var opts = {};
    //     opts.profile_id = $scope.storeId;
    //     opts.user_id = $scope.userId;
    //     opts.payment_type = APP.card.pending_type;
    //     opts.cancel_url = APP.payment.siteDomain + '/#/shop/payment/cancel'; 
    //     opts.return_url = APP.payment.siteDomain + '/#/shop/payment/success'; 

    //     StoreCreditCard.getOneClickPaymentUrls(opts, function(data) {  
    //         if(data.code != 251 && data.code != 300) {
    //             if(data.data.url != '' ) {
    //                 $scope.pendingPayBtn = false;
    //                 $scope.payRecurring = true;
    //                 $scope.storePendingPaymentUrl =  data.data.url;
    //             } else { 
    //                 $scope.pendingPayBtn = true;
    //                 $scope.payRecurring = false;
    //                 $scope.storePendingPaymentUrl = '';
    //             } 
    //         } else { 
    //             $scope.pendingPayBtn = true;
    //             $scope.payRecurring = false;
    //             $scope.storePendingPaymentUrl = '';
    //         } 
    //     });
    // }

    // $scope.getOneClickPaymentUrls();

}]);