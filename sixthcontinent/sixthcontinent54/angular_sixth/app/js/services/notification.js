app.service('NotificationService',['$http', '$q', function ($http, $q) {
//functions to call the service from the third party api
    return {
        sendEmailNotification : function(formData, callback) { 
            var url = APP.service.sendEmailNotification+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getEmailNotification : function(formData, callback) { 
            var url = APP.service.getEmailNotification+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        readUnreadEmailNotifications : function(formData, callback) { 
            var url = APP.service.readUnreadEmailNotifications+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteEmailNotifications : function(formData, callback) { 
            var url = APP.service.deleteEmailNotifications+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchEmailNotifications : function(formData, callback) { 
            var url = APP.service.searchEmailNotifications+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
