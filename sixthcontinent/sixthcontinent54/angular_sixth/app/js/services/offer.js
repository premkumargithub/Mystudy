app.service('OfferService', ['$http', function ($http) {
    return {
        getApplaneData: function(opt, callback) {
            var url = APP.service.getApplaneData + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        addUpdateApplaneData: function(opt, callback) {
            var url = APP.service.addUpdateApplaneData + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteShopOfferMedias: function(opt, callback) {
            var url = APP.service.deleteShopOfferMedias + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchstoreondimensions : function(opt , callback){
            var url = APP.service.searchstoreondimensions+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getApplaneInvoke: function(opt, callback) { 
            var url = APP.service.getApplaneInvoke+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        buyshoppingcard : function(opt, callback) { 
            var url = APP.service.buyshoppingcard+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        responsebuycards : function(opt, callback) { 
            var url = APP.service.responsebuycards+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);

