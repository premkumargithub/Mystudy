app.service('StoreAlbumService',['$http', '$q', function ($http, $q) {
    return {        
        createstorealbums: function(opt, callback){
            var url = APP.service.createstorealbums + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadstoremediaalbums: function(opt, file, callback){
            var url = APP.service.uploadstoremediaalbums + "?access_token=" + APP.accessToken;
            doPostUploadWithStoreMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        uploadstoremediaalbumsfinal: function(opt, callback){
            var url = APP.service.uploadstoremediaalbums + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        storealbumlists: function(opt, callback){
            var url = APP.service.storealbumlists + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deletestorealbums: function(opt, callback){
            var url = APP.service.deletestorealbums + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        viewstorealbums: function(opt, callback){
            var url = APP.service.viewstorealbums + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deletealbummedias: function(opt, callback){
            var url = APP.service.deletealbummedias + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
	

 
