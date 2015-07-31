app.service('UserWalletService',['$http', function ($http) {
    var stId = "";
    return {
    	getCitizenWallet: function(opt, callback) { 
            var url = APP.service.getCitizenWallets+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCitizenIncomes: function(opt, callback) { 
            var url = APP.service.getCitizenIncomes+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);