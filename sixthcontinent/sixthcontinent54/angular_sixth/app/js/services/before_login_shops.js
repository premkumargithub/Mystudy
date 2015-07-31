app.service('BLShopService',['$http', function ($http) {
    return {
    	getPublicShops: function(opt, callback) { 
            var url = APP.service.getblShops;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } ,
         getShopsDetail: function(opt, callback) { 
            var url = APP.service.getblDetailShops;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } , 
         getShopAlbumDetail: function(opt, callback) { 
            var url = APP.service.getblAlbumDetailShops;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } ,
         getShopPostDetail: function(opt, callback) { 
            var url = APP.service.getblPostDetailShops;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }  ,     
        getShopPicturesDetail: function(opt, callback) { 
            var url = APP.service.getblPicturesList;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } ,
        getSearchStoreDetail: function(opt, callback) { 
            var url = APP.service.getSearchStoreDetail;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } ,
        getCommentsStoreDetail: function(opt, callback) { 
            var url = APP.service.getCommentsStoreDetail;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } ,
        getMapPublicDetail: function(opt, callback) { 
            var url = APP.service.getMapPublicDetail;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } 
    };
}]);