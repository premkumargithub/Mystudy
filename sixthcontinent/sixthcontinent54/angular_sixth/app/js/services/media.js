app.service('MediaService',['$http', '$q', function ($http, $q) {
    return {        
        uploadmedia: function(opt, callback){
            var url = APP.service.uploadmedia;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listmedia: function(opt, callback){
            var url = APP.service.listmedia;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deletemedia: function(opt, callback){
            var url = APP.service.deletemedia;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchmedia: function(opt, callback){
            var url = APP.service.searchmedia;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }  
        
    };
}]);
	

 
