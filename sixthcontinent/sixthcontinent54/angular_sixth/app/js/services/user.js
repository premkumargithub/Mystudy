app.service('UserService',['$http', '$q', function ($http, $q) {
    var _hitUrl = '';
    return {
        getAccessToken: function(opts) {
            return $http({
				method: 'POST',
				url: APP.service.getAccessToken,
				data: opts,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } 
				}).then(function(response) {
                if (typeof response.data === 'object') {
                    return response.data;
                } else {
                    return $q.reject(response.data);
                }
                }, function(response) {
                    return $q.reject(response.data);
            	});
        },
        getLoginUser: function(opt, callback){
            var url = APP.service.logins + "?access_token=" + APP.accessToken;;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCurrentUser: function() {
        	return APP.currentUser;
        },
        isAuthenticated: function() {
        	return (Object.keys(APP.currentUser).length != 0 ) ? true : false;
        },
        logout: function(opt, callback){
            var url = APP.service.logout + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        forgotPassword: function(opt, callback){
            var url = APP.service.forgotPassword;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        resetPassword: function(opt, callback){
            var url = APP.service.resetPassword;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        registration: function(opt, callback){
            var url = APP.service.registration;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getFacebookRegister: function(opt, callback){
            var url = APP.service.getFacebookRegister;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        mapfacebookuser: function(opt, callback){
            var url = APP.service.mapfacebookuser;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        registerMultiProfile: function(opt, callback){
            var url = APP.service.registerMultiProfile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getBasicProfile: function(opt, callback) {
            var url = APP.service.viewMultiProfile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setCurrentLang: function(opt, callback) {
            var url = APP.service.changeCurrentLanguages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateFbAccessToken: function(opt, callback) {
            var url = APP.service.updateFbAccessToken + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getTotalEconomyShifted: function(opt, callback) {
            var url = APP.service.getTotalEconomy;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCreditAndIncome: function(opt, callback) {
            var url = APP.service.getCreditAndIncome;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setHitUrl: function(opt) {
            _hitUrl = opt;
        },
        getHitUrl: function() {
            return _hitUrl;
        },
        verifyAccount: function(opt, callback) {
            var url = APP.service.verifyAccount;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        resendverificationmail: function(opt, callback) {
            var url = APP.service.resendverificationmail;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);

app.service('CreateBrokerService',['$http', function($http) {

    //function to call the third party api
    return {
        createBroker: function(opt, callback){
            var url = APP.service.brokerMultiprofile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
	

app.service('saveUserPass', function() {
    var thisusername = "";
    var thispassword = "";
    return {
        saveUserPassword: function(username, password){
            thisusername = username;
            thispassword = password;
        },
        getUsername : function(){
            return thisusername;
        },
        getPassword : function(){
            return thispassword;
        },
        clearUserPass : function(){
            var thisusername = "";
            var thispassword = "";
        },
    };
});

app.factory('$remember', function() {
    function fetchValue(name) {
        var gCookieVal = document.cookie.split("; ");
        for (var i=0; i < gCookieVal.length; i++)
        {
            // a name/value pair (a crumb) is separated by an equal sign
            var gCrumb = gCookieVal[i].split("=");
            if (name === gCrumb[0])
            {
                var value = '';
                try {
                    value = angular.fromJson(gCrumb[1]);
                } catch(e) {
                    value = unescape(gCrumb[1]);
                }
                return value;
            }
        }
            // a cookie with the requested name does not exist
            return null;
    }
    return function(name, values) {
        if(arguments.length === 1) return fetchValue(name);
        var cookie = name + '=';
        if(typeof values === 'object') {
            var expires = '';
            cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
            if(values.expires) {
                var date = new Date();
                date.setTime( date.getTime() + (values.expires * 24 *60 * 60 * 1000));
                expires = date.toGMTString();
            }
            cookie += (!values.session) ? 'expires=' + expires + ';' : '';
            cookie += (values.path) ? 'path=' + values.path + ';' : '';
            cookie += (values.secure) ? 'secure;' : '';
        } else {
            cookie += values + ';';
        }
        document.cookie = cookie;
    }
});
