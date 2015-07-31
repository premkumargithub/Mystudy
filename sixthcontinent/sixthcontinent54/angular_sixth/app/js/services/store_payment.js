app.service('StorePaymentService',['$http', function ($http) {
    return {
    	getOneClickPaymentUrls: function(opts, callback) { 
            var url = APP.service.createOneClickPaymentUrls+"?access_token="+APP.accessToken;
            doPost($http, url, opts, function(data) {
                callback(data);
            });
        },
        sendContract: function(opts, callback) { 
            var url = APP.service.sendContract+"?access_token="+APP.accessToken;
            doPost($http, url, opts, function(data) {
                callback(data);
            });
        }
    };
}]);