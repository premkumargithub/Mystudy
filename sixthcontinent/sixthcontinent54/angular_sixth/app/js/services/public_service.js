app.service('PublicService', ['$http', '$timeout', function ($http, $timeout) {
    return {
        getPublicPost : function(opt, callback) { 
            var url = APP.service.getPublicPost;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
}]);
