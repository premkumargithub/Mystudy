app.service('StoreWalletService',['$http', function ($http) {
    var stId = "";
    return {
    	getStoreWallet: function(opt, callback) { 
            var url = APP.service.getStoreWallet+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getPaymentHistory : function(opt, callback){
        	var url = APP.service.getPaymentHistory+"?access_token="+APP.accessToken;
        	doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreWalletApplane: function(opt, callback) { 
            var url = APP.service.batchApplane+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getPaymentHistoryApplane : function(opt, callback){
            var url = APP.service.addUpdateApplaneData+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getShopPreniumHistoryApplane : function(opt, callback){
            var url = APP.service.getApplaneData+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
         getStoreWalletShoppingCard: function(opt, callback) { 
            var url = APP.service.batchApplane+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreWalletCouponApplane: function(opt, callback) { 
            var url = APP.service.batchApplane+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getShopWalletHistory: function(opt, callback) { 
            var url = APP.service.batchApplane+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },    
        getStoreWalletHistoryApplane: function(opt, callback) { 
            var url = APP.service.batchApplane+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getTotalPendingPayments : function(opt, callback){
            var url = APP.service.getTotalPendingPayments+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getTotalPaymentListing : function(opt, callback){
            var url = APP.service.getTotalPaymentListing+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getRecurringPaymenturls : function(opt, callback){
            var url = APP.service.getRecurringPaymenturls+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updatePendingPayments : function(opt, callback){
            var url = APP.service.updatePendingPayments+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }


    };
}]);


app.service('storeShopHistorySelection', ['$location', function($location){
    var storage = false;
    var _pmtMethod = false;
    return {
        storeHistoryTab: function(shopId){
            storage = true;
            $location.path('/shop/wallet/'+shopId)
        },
        getStorage: function(){
            return storage;
        },
        clearStorage : function(){
            storage = false;
        },
        getPenPaymentMethod: function(){
            return _pmtMethod;
        },
        setPenPaymentMethod : function(opt){
            _pmtMethod = opt;
        }
    } 
}]);