app.service('TopLinkService',['$http', '$timeout', function ($http, $timeout) {
    var _affilate = {};
    var _noReferral = false;
    var _isAlreadyUserLogin = {};
    return {
        getTopLinkedCitizen : function(opt, callback) { 
            var url = APP.service.getTopLinkedCitizen;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getTopCitizenPerIncome : function(opt, callback) { 
            var url = APP.service.getTopCitizenPerIncome;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getTopShopPerRevenue : function(opt, callback) { 
            var url = APP.service.getTopShopPerRevenue;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        inviteAffiliation : function(opt, callback) { 
            var url = APP.service.inviteAffiliation + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setAffiliationObject : function(opt) {
            _affilate = opt;
        },
        getAffiliationObject : function() {
            return _affilate;
        },
        setNoAffiliated : function(opt) {
            _noReferral = opt;
        },
        getNoAffiliated : function() {
            return _noReferral;
        },
        setIsAlreadyUserLogin : function(opt) {
            _isAlreadyUserLogin = opt;
        },
        getIsAlreadyUserLogin : function() {
            return _isAlreadyUserLogin;
        },
        checkIsValidAffiliation : function(opt, callback) { 
            var url = APP.service.checkValidUser;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
}]);