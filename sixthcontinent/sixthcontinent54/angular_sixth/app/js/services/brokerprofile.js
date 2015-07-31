app.service('BrokerProfileService',['$http', '$q', function ($http, $q) {
    return {        
        brokerMultiprofile: function(opt, callback){
            var url = APP.service.brokerMultiprofile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
	

 
