app.service('StoreService',['$http', function ($http) {
    var stId = "";
    var _stData = "";
    return {
    	getStore: function(opt, callback) { 
            var url = APP.service.getStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getAllStoreWithChild: function(opt, callback) { 
            var url = APP.service.getStoreWithChild+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        createStore: function(opt, callback) { 
            var url = APP.service.createStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        createChildStore: function(opt, callback) { 
            var url = APP.service.createChildStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateStore: function(opt, callback) { 
            var url = APP.service.updateStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCountryList: function(opt, callback) { 
            var url = APP.service.getCountryList;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteStore: function(opt, callback) { 
            var url = APP.service.deleteStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchStore: function(opt, callback) { 
            var url = APP.service.searchStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreDetail: function(opt, callback) { 
            var url = APP.service.storeDetail+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreNotifications: function(opt, callback) { 
            var url = APP.service.getStoreNotification+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        acceptDenyToStoreNotification: function(opt, callback) { 
            var url = APP.service.responseToStoreNoti+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStoreOwnerId : function(opt) { 
           return stId;
        },
        setStoreOwnerId : function(opt) { 
            stId = opt.storeId;
        },
        setStoreProfileImage: function(opt, callback) { 
            var url = APP.service.setStoreProfileImage+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadStoreProfileimage: function(opt, file, callback) { 
            var url = APP.service.uploadStoreProfileimage+"?access_token="+APP.accessToken;
            doUploadStoreProfilePost($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        searchUser: function(opt, callback) { 
            var url = APP.service.searchUser+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        inviteUserOnStore: function(opt, callback) { 
            var url = APP.service.inviteUserOnStore+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getMobileAppUrl: function(opt, callback) { 
            var url = APP.service.linkMobileApp+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getmapstores: function(opt, callback) { 
            var url = APP.service.getmapstores+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        } ,
        getStoreHistory: function(opt, callback) { 
            var url = APP.service.getStoreHistory+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }, 
        searchshoponmaps: function(opt, callback) { 
            var url = APP.service.searchshoponmaps+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getSubCategoryList: function(opt, callback) { 
            var url = APP.service.getBusinessCategoryList+"?session_id="+APP.currentUser.id;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getLatestAlbumList: function(opt, callback) { 
            var url = APP.service.getLatestAlbumList+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getStorePostDetail : function(opt, callback) { 
            var url = APP.service.getShopPostDetail+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setStoreMediaCoordinate : function(opt, callback) {
            var url = APP.service.getStoreCoverMediaCoordinates + "?access_token=" + APP.accessToken;
                        doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getShops : function(opt, callback) { 
            var url = APP.service.getShops+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        favouritestores  : function(opt, callback) { 
            var url = APP.service.favouritestores+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        myfavouritestores : function(opt, callback) { 
            var url = APP.service.myfavouritestores+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        unfavouritestores: function(opt, callback) { 
            var url = APP.service.unfavouritestores+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listcustomersreviews: function(opt, callback) { 
            var url = APP.service.listcustomersreviews+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        removeShopTagg: function(opt, callback) { 
            var url = APP.service.removeShopTagg+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },

        followshops: function(opt, callback) { 
            var url = APP.service.followshops+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        unfollowshops: function(opt, callback) { 
            var url = APP.service.unfollowshops+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        userfollowingshops: function(opt, callback) { 
            var url = APP.service.userfollowingshops+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getfriendboughtonstores: function(opt, callback) { 
            var url = APP.service.getfriendboughtonstores+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        frindboughtcount: function(opt, callback) { 
            var url = APP.service.getApplaneInvoke+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        SetStoreData: function(opt) {
            _stData = opt;
        },
        getStoreData: function() { 
           return _stData;
        },
        getstorecredit: function(opt, callback) { 
            var url = APP.service.getApplaneInvoke+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getReportTransacation: function(opt, callback) { 
            var url = APP.service.getApplaneData+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
