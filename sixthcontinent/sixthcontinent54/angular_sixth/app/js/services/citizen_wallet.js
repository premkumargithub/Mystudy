app.service('CitizenWallet', ['$http', '$q', function ($http, $q) {
    return {        
        getCitizenCredits: function(opt, callback){
            var url = APP.service.batchApplane + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCitizenDetails: function(opt, callback){
            var url = APP.service.batchApplane + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCitizenWalletCoupons: function(opt, callback){
            var url = APP.service.batchApplane + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCitizenWalletHistory: function(opt, callback){
            var url = APP.service.batchApplane + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCitizenIncome: function(opt, callback){
            var url = APP.service.getApplaneData + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);


app.service('storeHistorySelection', ['$location', function($location){
    var storage = false;
    return {
        storeTodayYouGain: function(){
            storage = true;
            $location.path('/wallets')
        },
        getStoreage: function(){
            return storage;
        },
        clearStorage : function(){
            storage = false;
        }
    } 
}]);
	

 
