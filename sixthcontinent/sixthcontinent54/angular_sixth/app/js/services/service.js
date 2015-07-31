//common function to call the post services
function callLogServiceOnError($http, actionUrl, resCode, reqObj, reqContentType, resObj, config){
    var opt = {};
    opt.response_code = '';
    opt.page_name = window.location.href; 
    opt.action_name = actionUrl; 
    opt.request_object = JSON.stringify(reqObj);
    opt.response_object = JSON.stringify(resObj);
    opt.request_content_type = JSON.stringify(reqContentType);
    opt.response_content_type = JSON.stringify(config.headers);
    opt.header_str = resCode;
    var url = APP.service.saveLogToServer;
    $http({
        method: "POST",
        url: url,
        data    : {reqObj: opt},
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    .success( function(data){
        //Log saved on the server side
    })
    .error(function(data, status, headers, config){
        if(status === 401) {
            //Something wnet wrong
        }
    });
}

//common function to call the post services
function doPost($http, url, opt, callback){
    $http({
        method: "POST",
        url: url,
        data    : {reqObj: opt},
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    .success( function(data, status, headers, config){      
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);   
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }    
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
};

//common function to call the post services with file object
function updateProfileWithFiles($http, url, opt, idcard, ssnfile, callback){
    var fd = new FormData();
    fd.append('idcard', idcard);
    fd.append('ssn', ssnfile);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the post services with file object
function doPostWithFile($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('group_media', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the post services with file object
function doPostUploadWithMedia($http, url, opt, files, callback) {
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('user_media[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });

}

//common function to call the post services with file object
function doPostUploadProfileMedia($http, url, opt, file, callback) {
    var fd = new FormData();
    fd.append('user_media', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });

}

//common function to call the post services with file object for store album and store post with image
function doPostUploadWithStoreMedia($http, url, opt, file, callback) {
    var fd = new FormData();
    fd.append('store_media[]', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });

}

//common function to call the post services with file object
function doPostReplyWithMedia($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('commentfile[]', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the group post services with file object
function doPostPostOnGroupWithFile($http, url, opt, files, callback){
    var fd = new FormData();
    angular.forEach(files, function(file) {
        fd.append('post_media[]', file);
    });
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//common function to call the group comment services with file object
function doPostCommentOnGroupWithFile($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('commentfile[]', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//function to call the post media file for store profile
function doUploadStoreProfilePost($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('store_media', file);
    fd.append('reqObj', angular.toJson(opt));
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//function to call the comment media
//common function to call the store comment services with file object
function doPostCommentOnStoreWithFile($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('commentfile[]', file);
    fd.append('reqObj', angular.toJson(opt));
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

function doPostWithClubAlbumMedia($http, url, opt, files, callback) {
    var fd = new FormData();
    fd.append('group_media[]', file);
    fd.append('reqObj', angular.toJson(opt));
    
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                 notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//function to call the comment media
//common function to call the store comment services with file object
function doPostCommentOnDashboardWithFile($http, url, opt, file, callback){
    var fd = new FormData();
    fd.append('commentfile[]', file);
    fd.append('reqObj', angular.toJson(opt));
    $http({
        method: "POST",
        url: url,
        data    : fd,
        headers: {'Content-Type': undefined},                 
        transformRequest: angular.identity,
    })
    .success( function(data){
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, {reqObj: opt}, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);
        if(status === 403) { // Check if the request is valid not by hacker 
            if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
                if(TrailExpiredModal){
                    angular.element(document.getElementById('AppController')).scope().checkTrialExpired();
                }
            }else{
                notAuthorizedThisRequest();
            }
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
}

//Logout User when accessToken Expired
function accessTokenExpiredLogout() {
    angular.element(document.getElementById('AppController')).scope().logoutWithoutService();
}

function checkTokenNotExpired(data) {
   if( data.hasOwnProperty('error') ) {
      angular.element(document.getElementById('AppController')).scope().wentWrong();
    } else {
        return false;
    }
   //return false;
}

function notAuthorizedThisRequest() {
    angular.element(document.getElementById('AppController')).scope().logoutWithoutService();
    //angular.element(document.getElementById('AppController')).scope().notAuthorisedUser();
};

function doApplanePost($http, url, opt, callback){
   $http({
       method: "POST",
       url: url,
       data    : JSON.stringify(opt),
       headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
   })
   .success( function(data, status, headers, config){      
       callback(data);
   })
   .error(function(data, status, headers, config){
       callLogServiceOnError($http, url, status, opt, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);  
       if(status === 403) { // Check if the request is valid not by hacker
           notAuthorizedThisRequest();
       } else if(status === 401) {
           accessTokenExpiredLogout();
       }else if(!checkTokenNotExpired(data)) {
           callback(data);
       }
   });
};

function doApplaneUpdatePost($http, url, opt, callback){
    $http({
        method: "POST",
        url: url,
        data    : JSON.stringify(opt),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    .success( function(data, status, headers, config){      
        callback(data);
    })
    .error(function(data, status, headers, config){
        callLogServiceOnError($http, url, status, opt, 'application/x-www-form-urlencoded; charset=UTF-8', data, config);   
        if(status === 403) { // Check if the request is valid not by hacker 
            notAuthorizedThisRequest();
        } else if(status === 401) {
            accessTokenExpiredLogout();
        }else if(!checkTokenNotExpired(data)) {
            callback(data);
        }
    });
};