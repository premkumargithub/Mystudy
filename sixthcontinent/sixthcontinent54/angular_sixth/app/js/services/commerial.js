app.service('CommerialService', ['$http', '$timeout', function($http, $timeout) {
//functions to call the service from the third party api
    return {
    	launchCoupens : function(formData, callback) { 
            var url = APP.service.getUserGroups+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        varifyPaypal : function(formData, callback) { 
            var url = APP.service.verifiePaypals+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getSubscription : function(formData, callback) { 
            var url = APP.service.getSubscriptionpaymentUrl+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        unSubscribes : function(formData, callback) { 
            var url = APP.service.unSubscribes+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        returnPaymentCancel : function(formData, callback) { 
            var url = APP.service.returnPaymentCancel+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
    
}]);