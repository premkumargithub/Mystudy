app.service('ShopTransactionService',['$http', function ($http) {
    var _shopTxnTab = {};
    return {
    	getTransactions: function(opts, callback) { 
            var url = APP.service.getApplaneData+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opts, function(data) {
                callback(data);
            });
        },
        getTransactionDetail: function(opts, callback) { 
            var url = APP.service.getApplaneData+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opts, function(data) {
                callback(data);
            });
        },
        updateTransactionObject: function(opts, callback) { 
            var url = APP.service.addUpdateApplaneData+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opts, function(data) {
                callback(data);
            });
        },
        setTransactionTab: function(opts){
            _shopTxnTab = opts;
        },
        getTransactionTab: function(){
            return _shopTxnTab;
        }
    };
}]);