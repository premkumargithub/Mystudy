app.service('ProfileImageService',['$http', '$q', function ($http, $q) {
    return {        
        uploaduserprofileimages: function(opt, file, callback){
            var url = APP.service.uploaduserprofileimages + "?access_token=" + APP.accessToken;
            doPostUploadProfileMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        viewmultiprofiles: function(opt, callback){
            var url = APP.service.viewmultiprofiles + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }       
    };
}]);
	

 
