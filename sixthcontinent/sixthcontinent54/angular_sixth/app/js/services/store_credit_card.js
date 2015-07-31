app.service('StoreCreditCard',['$http', '$q', function ($http, $q) {
    return {        
        getCreditCardLists: function(opt, callback){
            var url = APP.service.creditCardLists + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setDefaultCard: function(opt, callback){
        	var url = APP.service.markDefaultCard + "?access_token=" + APP.accessToken;
        	doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteCard: function(opt, callback){
        	var url = APP.service.digitalDeleteCard + "?access_token=" + APP.accessToken;
        	doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getOnClickRecurringPayments: function(opt, callback){
            var url = APP.service.getOnClickRecurringPayments + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getOneClickPaymentUrls: function(opts, callback) { 
            var url = APP.service.createOneClickPaymentUrls+"?access_token="+APP.accessToken;
            doPost($http, url, opts, function(data) {
                callback(data);
            });
        },
        getPaypalAccounts: function(opt, callback) { 
            var url = APP.service.getPaypalAccounts+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deletePaypalAccounts: function(opt, callback) { 
            var url = APP.service.deletePaypalAccount+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setDefaultPaypalAccounts: function(opt, callback) { 
            var url = APP.service.setDefaultPaypalAccount+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
	

 
