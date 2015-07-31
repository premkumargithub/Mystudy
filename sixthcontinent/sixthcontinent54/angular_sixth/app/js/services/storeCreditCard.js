app.service('StoreCreditCard',['$http', '$q', function ($http, $q) {
    return {        
        getCreditCardLists: function(opt, callback){
            var url = APP.service.creditCardLists + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setDefaultCard: function(opt, callback){
        	var url = App.service.markDefaultCard + "?access_token=" + APP.accessToken;
        	doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteCard: function(opt, callback){
        	var url = App.service.digitalDeleteCard + "?access_token=" + APP.accessToken;
        	doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        
    };
}]);
	

 
