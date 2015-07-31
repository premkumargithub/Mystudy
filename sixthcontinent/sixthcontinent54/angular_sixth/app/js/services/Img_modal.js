app.service('SingleMediaDetailService', function ($http, $timeout) {
    return {
        getMediaInfo : function(opt, callback) { 
            var url = APP.service.singlephotomediadetails+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        addImgModalComment : function(opt, callback) { 
            var url = APP.service.addComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        DeleteImgModalComment : function(opt, callback) { 
            var url = APP.service.DeleteComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        ModifyImgModalComment : function(opt, callback) { 
            var url = APP.service.ModifyComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
});