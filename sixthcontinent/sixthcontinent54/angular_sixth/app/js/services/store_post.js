app.service('StorePostService',['$http', function ($http) {
    return {        
        createPost: function(opt, callback){
            var url = APP.service.createStorePost + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listPost: function(opt, callback){
            var url = APP.service.listStorePost + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updatePost: function(opt, file, callback){
            var url = APP.service.updateStorePost + "?access_token=" + APP.accessToken;
            doPostUploadWithStoreMedia($http, url, opt, file, function(data){
                callback(data);
            });
        },
        deletePost: function(opt, callback){
            var url = APP.service.deleteStorePost + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteMediaPost: function(opt, callback){
            var url = APP.service.deleteStoreMediasPost + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
}]);

//services for the comment of store post

app.service('StoreCommentService',['$http', function ($http) {
    return {        
        createCommentWithImage: function(opt, file, callback){
            var url = APP.service.createStoreComment + "?access_token=" + APP.accessToken;
            doPostCommentOnStoreWithFile($http, url, opt, file, function(data){
                callback(data);
            });
        },
        createComment: function(opt, callback){
            var url = APP.service.createStoreComment + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listComment: function(opt, callback){
            var url = APP.service.listStoreComment + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateComment: function(opt, callback){
            var url = APP.service.updateStoreComment + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteComment: function(opt, callback){
            var url = APP.service.deleteStoreComment + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteMediaComment: function(opt, callback){
            var url = APP.service.deleteStoreMediaComment + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
}]);
	

 
