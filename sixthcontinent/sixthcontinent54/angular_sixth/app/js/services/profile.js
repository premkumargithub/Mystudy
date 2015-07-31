app.service('ProfileService',['$http', function ($http) {
    return {
        getProfile: function(opt, callback) { 
            var url = APP.service.getProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchSuggestion: function(opt , callback){
            var url = APP.service.suggestionmultiprofiles+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        viewMultiProfile: function(opt, callback) { 
            var url = APP.service.viewMultiProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateProfileDetail: function(opt, idcard, ssn, callback) { 
            var url = APP.service.updatemultiprofiles+"?access_token="+APP.accessToken;
            updateProfileWithFiles($http, url, opt, idcard, ssn, function(data) {
                callback(data);
            });
        },
        deleteProfile: function(opt, callback) { 
            var url = APP.service.deleteProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchUser: function(opt, callback) { 
            var url = APP.service.searchUser+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchFriend: function(opt, callback) { 
            var url = APP.service.searchFriend+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        friendProfileView: function(opt, callback) { 
            var url = APP.service.friendProfile+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        dashboardPost: function(opt, callback) { 
            var url = APP.service.dashboardpost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getPendingFreindReq: function(opt, callback) {
            var url = APP.service.getPendingFriendRequest + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        acceptFriendRequest: function(opt, callback) {
            var url = APP.service.acceptDenyFriendReq + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        rejectFriendRequest: function(opt, callback) {
            var url = APP.service.acceptDenyFriendReq + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        sendFriendRequests : function(opt, callback) {
            var url = APP.service.sendFriendRequests + "?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listDashboardPost: function(opt, callback) { 
            var url = APP.service.listDashboardPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteDashboardPost: function(opt, callback) { 
            var url = APP.service.deleteDashboardPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateDashboardPost: function(opt, callback) {
            var url = APP.service.updateDashboardPost+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        createDashboardCommentImage: function(opt,file, callback) { 
            var url = APP.service.createDashboardComment+"?access_token="+APP.accessToken;
            doPostCommentOnDashboardWithFile($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        createDashboardCommentFinal: function(opt, callback) { 
            var url = APP.service.createDashboardComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        changePassword : function(opt,callback){
            var url = APP.service.changePassword+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteDashboardComment: function(opt, callback) { 
            var url = APP.service.deleteDashboardComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateDashboardComment: function(opt, callback) { 
            var url = APP.service.updateDashboardComment+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deletePostMedia: function(opt, callback) { 
            var url = APP.service.deletePostMedia+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteDashboardMediaComments: function(opt, callback) { 
            var url = APP.service.dashboardMediaDeleteComments+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        friendAlbumListing: function(opt, callback) { 
            var url = APP.service.albumListing+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        friendAlbumImage: function(opt, callback){
            var url = APP.service.viewAlbum + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listUnReadMessages: function(opt, callback){
            var url = APP.service.listGroupUnreadMessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getDashboardComments: function(opt, callback) { 
            var url = APP.service.getDashboardComments+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        readMessage: function(opt, callback){
            var url = APP.service.readMessage + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        uploadCoverPhoto: function(opt, file, callback){
            var url = APP.service.setUserProfileCover + "?access_token=" + APP.accessToken;
            doPostUploadProfileMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        getFollowers: function(opt, callback) {
            var url = APP.service.getFollowers + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getFollowings: function(opt, callback) {
            var url = APP.service.getFollowings + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        checkfollowUser: function(opt, callback) {
            var url = APP.service.getCheckFollows + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        followUser: function(opt, callback) {
            var url = APP.service.getFollowUser + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        unFollowUser: function(opt, callback) {
            var url = APP.service.getUnFollowUser + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getClientInformation: function(opt, callback) {
            var url = APP.service.getClientInformation + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getConnectedProfil: function(opt, callback) {
            var url = APP.service.getConnectedProfile + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getIfFriendRequestAccepted: function(opt, callback) {
            var url = APP.service.getFriendAcceptedNotification + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getIfClubRequestAccepted: function(opt, callback) {
            var url = APP.service.getClubAcceptedNotification + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getIfShopRequestAccepted: function(opt, callback) {
            var url = APP.service.getIfShopRequestAccepted + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getIfBrokerRequestAccepted: function(opt, callback) {
            var url = APP.service.getIfBrokerRequestAccepted + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        markReadNotification: function(opt, callback) {
            var url = APP.service.markReadNotification + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getShopAprovalRejectNoti: function(opt, callback) {
            var url = APP.service.getShopAprovalRejectNoti + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getAllTypeNotification: function(opt, callback) {
            var url = APP.service.getAllTypeNotification + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getDashboardWallFeeds: function(opt, callback) { 
            var url = APP.service.getDashboardWallFeeds+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchAllProfile: function(opt, callback) { 
            var url = APP.service.getAllProfiles+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        saveUserEducation: function(opt, callback) {
            var url = APP.service.saveUserEducation+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        saveUserProfession: function(opt, callback) { 
            var url = APP.service.saveUserProfession+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        saveRelative: function(opt, callback) { 
            var url = APP.service.saveRelative+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        selectFriend: function(opt, callback) { 
            var url = APP.service.selectFriend+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchCatagory: function(opt, callback) { 
            var url = APP.service.searchCatagory+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchCatagoryKeyword: function(opt, callback) { 
            var url = APP.service.searchCatagoryKeyword+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        saveCategory: function(opt, callback) { 
            var url = APP.service.saveCategory+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCategories: function(opt, callback) { 
            var url = APP.service.getCategory+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteCategory: function(opt, callback){
             var url = APP.service.deleteusercategorykeywords+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteProfession: function(opt, callback){
             var url = APP.service.deleteProfession+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteEducation: function(opt, callback){
             var url = APP.service.deleteEducation+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteRelative: function(opt, callback){
             var url = APP.service.deleteRelative+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getrelationtype: function(opt, callback){
            var url = APP.service.getrelationtype+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        addUserSkills: function(opt, callback){
            var url = APP.service.addUserSkills+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getUserSkills: function(opt, callback){
            var url = APP.service.getUserSkills+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateEducationVisibility : function(opt, callback){
            var url = APP.service.updateEducationVisibility+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateProfessionVisibility : function(opt, callback){
            var url = APP.service.updateProfessionaVisibility+"?access_token="+APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchFriends: function(opt, callback){
            var url = APP.service.searchFriends + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        removeTagedFriends : function(opt, callback){
            var url = APP.service.removeTaggedFriends + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        rateThis : function(opt, urlOption, callback){
            var url;
            if(urlOption === "add"){
                url = APP.service.rateThis + "?access_token=" + APP.accessToken;
            }else if(urlOption === "update"){
                url = APP.service.updateRating + "?access_token=" + APP.accessToken;
            }
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        removeRating : function(opt, callback){
            var url = APP.service.removeRating + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getDashboardPostDetail : function(opt, callback){
            var url = APP.service.getDashboardPostDetail + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        findPeople : function(opt, callback){
            var url = APP.service.findPeople + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        notificationCount : function(opt, callback){
            var url = APP.service.getAllTypeNotiCount + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getAllGroupNotification : function(opt, callback){
            var url = APP.service.getAllGroupNotification + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchAllFriend : function(opt, callback) {
            var url = APP.service.getTaggingFriend + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        markAsDelete : function(opt, callback) {
            var url = APP.service.markDeleteNotification + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getAllsearchProfiles : function(opt, callback) {
            var url = APP.service.searchAllProfiles + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        friendRequestStatus : function(opt, callback) {
            var url = APP.service.friendRequestStatus + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        sendMediaCoordinate : function(opt, callback) {
            var url = APP.service.getMediaCoordinates + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        addKeywords : function(opt, callback) {
            var url = APP.service.addKeywords + "?access_token=" + APP.accessToken;
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
        updatePostPrivacy: function(opt, callback) {
            var url = APP.service.updateDashboardPostACLs + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getTodayCredit: function(opts, callback) { 
            var url = APP.service.getApplaneData+"?access_token="+APP.accessToken+"&session_id="+APP.currentUser.id;
            doApplanePost($http, url, opts, function(data) {
                callback(data);
            });
        }
    };
}]);
