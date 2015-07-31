app.service('AffiliatedkService',['$http', '$timeout', function ($http, $timeout) {
    return {
        getCitizenAffiliates : function(opt, callback) { 
            var url = APP.service.getCitizenAffiliates+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getBrokerAffiliates : function(opt, callback) { 
            var url = APP.service.getBrokerAffiliates+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getShopAffiliates : function(opt, callback) { 
            var url = APP.service.getShopAffiliates+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCitizenAffiliateCount : function(opt, callback) {
            var url = APP.service.getCitizenAffiliateCount+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getShopAffiliateCount : function(opt, callback) {
            var url = APP.service.getShopAffiliateCount+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getBrokerAffiliateCount : function(opt, callback) {
            var url = APP.service.getBrokerAffiliateCount+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getAllcounts : function(opt, callback) {
            var url = APP.service.getAllcounts+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
}]);