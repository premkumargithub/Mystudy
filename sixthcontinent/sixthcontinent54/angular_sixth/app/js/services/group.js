app.service('GroupService',['$http', '$timeout', function ($http, $timeout) {
//functions to call the service from the third party api
    return {
        getUserGroups : function(formData, callback) { 
            var url = APP.service.getUserGroups+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getInviteGroups : function(formData, callback) { 
            var url = APP.service.getInviteGroups+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        createGroup : function(opt, file, callback) {
            var url = APP.service.createGroup+"?access_token="+APP.accessToken;
            doPostWithFile($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        updateGroup : function(opt, file, callback) {
            var url = APP.service.updateGroup+"?access_token="+APP.accessToken;
            doPostWithFile($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        deleteGroup : function(formData, callback) {
            var url = APP.service.deleteGroup+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getGroupDetail : function(opt, callback) {
            var url = APP.service.getGroupDetail+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchGroup : function(formData, callback) {
            var url = APP.service.searchGroup+"?access_token="+APP.accessToken;
            var opt = formData;
            var response = doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getAllClubNotifications : function(opt, callback) {
            var url = APP.service.getPublicGroupNotification+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        responseClubNotification : function(opt, callback) {
            var url = APP.service.responseClubNotification+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getGroupNotifications : function(opt,callback) {
            var url = APP.service.getSpecificClubNotication+"?access_token="+APP.accessToken;
            var response = doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        responseGroupJoin : function(formData, callback) {
            var url = APP.service.responseGroupJoin+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
             });
        },
        assignRoleToGroup : function(formData, callback) {
            var url = APP.service.assignRoleToGroup+"?access_token="+APP.accessToken;
            var opt = formData;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        joinPublicGroup : function(formData, callback) {
            var url = APP.service.joinPublicGroup+"?access_token="+APP.accessToken;
            var opt = formData;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        joinPrivateGroups : function(formData, callback) {
            var url = APP.service.joinPrivateGroups+"?access_token="+APP.accessToken;
            var opt = formData;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        /** Club Album service */
        createClubAlbum: function(opt, callback) {
            var url = APP.service.createClubAlbum + "?access_token=" + APP.accessToken;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getClubAlbum: function(opt, callback) {
            var url = APP.service.getClubAlbums + "?access_token=" + APP.accessToken;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteClubAlbum: function(opt, callback) {
            var url = APP.service.deleteClubAlbum + "?access_token=" + APP.accessToken;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteClubAlbumMedia: function(opt, callback) {
            var url = APP.service.deleteClubAlbumMedia + "?access_token=" + APP.accessToken;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        viewClubAlbum: function(opt, callback) {
            var url = APP.service.viewClubAlbum + "?access_token=" + APP.accessToken;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadMediaInClubAlbumFinal: function(opt, callback) {
            var url = APP.service.uploadMediaInClubAlbum + "?access_token=" + APP.accessToken;
             doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadMediaInClubAlbum: function(opt, file, callback) {
            var url = APP.service.uploadMediaInClubAlbum + "?access_token=" + APP.accessToken;
             doPostWithClubAlbumMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
         setClubProfileImage: function(opt, callback){
            var url = APP.service.setClubProfileImage + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
         uploadClubCover: function(opt, file, callback){
            var url = APP.service.uploadClubCover + "?access_token=" + APP.accessToken;
            doPostWithFile($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        unjoinclubs : function(opt, callback) {
            var url = APP.service.unjoinclubs+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteClubMember : function(opt, callback) {
            var url = APP.service.deleteClubMember+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getUserFriendGroups : function(formData, callback) { 
            var url = APP.service.getUserFriendGroups+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        cancelGroup : function(formData, callback) { 
            var url = APP.service.cancelinvitationlink+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getClubPostDetail : function(formData, callback) { 
            var url = APP.service.getClubPostDetail+"?access_token="+APP.accessToken;
            var opt = formData;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        setClubMediaCoordinate : function(opt, callback) {
            var url = APP.service.getClubMediaCoordinate + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
    };
}]);
	
app.service('PostService',['$http', function($http) {

    return {
        createPost : function(opt, callback) {
            var url = APP.service.createGroupPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listPost : function(opt, callback) {
            var url = APP.service.listGroupPosts+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updatePost : function(opt, file, callback) {
            var url = APP.service.updateGroupPost+"?access_token="+APP.accessToken;
            doPostPostOnGroupWithFile($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        deletePost : function(opt, callback) {
            var url = APP.service.deleteGroupPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deletePostMedia : function(opt, callback) {
            var url = APP.service.deleteGroupPostMedia+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    }
}]);


app.service('CommentService',['$http', function($http) {
    //function to call the third party api
    return {
        createCommentWithImage : function(opt, file, callback) {
            var url = APP.service.createGroupComment+"?access_token="+APP.accessToken;
            doPostCommentOnGroupWithFile($http, url, opt, file, function(data){
                callback(data);
            });
        },
        createComment : function(opt, callback) {
            var url = APP.service.createGroupComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data){
                callback(data);
            });
        },
        listComment : function(opt, callback) {
            var url = APP.service.listGroupComments+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateComment : function(opt, file, callback) {
            var url = APP.service.updateGroupComment+"?access_token="+APP.accessToken;
            doPostCommentOnGroupWithFile($http, url, opt, file, function(data){
                callback(data);
            });
        },
        deleteComment : function(opt, callback) {
            var url = APP.service.deleteGroupComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
