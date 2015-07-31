app.service('MessageService',['$http', '$q', function ($http, $q) {
    
    return {        
        createMessage: function(opt, file, callback){
            var url = APP.service.createMessage + "?access_token=" + APP.accessToken;
            doPostReplyWithMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        groupMessageSends: function(opt, file, callback){
            var url = APP.service.groupMessageSends + "?access_token=" + APP.accessToken;
            doPostReplyWithMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        deleteMessage: function(opt, callback){
            var url = APP.service.deleteMessage + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        deleteGroupMessages: function(opt, callback){
            var url = APP.service.deleteGroupMessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        messageListing: function(opt, callback){
            var url = APP.service.messageListing + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listGroupMessages: function(opt, callback){
            var url = APP.service.listGroupMessages + "?access_token=" + APP.accessToken;
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
        readGroupMessages: function(opt, callback){
            var url = APP.service.readGroupMessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        replyMessage: function(opt, file, callback){
            var url = APP.service.replyMessage + "?access_token=" + APP.accessToken;
            doPostReplyWithMedia($http, url, opt, file, function(data) {
                callback(data);
            });
        },
        searchMessage: function(opt, callback){
            var url = APP.service.searchMessage + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        updateMessage: function(opt, callback){
            var url = APP.service.updateMessage + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        sendemailMessage: function(opt, callback){
            var url = APP.service.sendemailMessage + "?access_token=" + APP.accessToken;
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
        messageInbox: function(opt, callback){
            var url = APP.service.messageInbox + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listGroupInbox: function(opt, callback){
            var url = APP.service.listGroupInbox + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchUserThread: function(opt, callback){
            var url = APP.service.searchUserThread + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listusermessages: function(opt, callback){
            var url = APP.service.listusermessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listUnReadMessages: function(opt, callback){
            var url = APP.service.listunreadmessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        markReadAllMessages: function(opt, callback){
            var url = APP.service.markreadallmessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        getCurrentUserMessage: function() {
            return APP.currentUser;
        },
        listGroupUnreadMessages: function(opt, callback){
            var url = APP.service.listGroupUnreadMessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listGroups: function(opt, callback){
            var url = APP.service.listgroups + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        listGroupMessages: function(opt, callback){
            var url = APP.service.listGroupMessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        searchThreadMessages: function(opt, callback){
            var url = APP.service.searchThreadMessages + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        },
        removeGroupUsers: function(opt, callback){
            var url = APP.service.removeGroupUsers + "?access_token=" + APP.accessToken;
            doPost($http, url, opt, function(data) {
                callback(data);
            });
        }
    };
}]);
app.service('saveFriendId', function() {

    var thisFriendId = 0;
    var thisThreadList = 0;
    return {
        saveFriend : function(friendId){
            thisFriendId = friendId;

        },
        getFriendId : function(){
            return thisFriendId;
        },
        saveTreadId : function(thread){
            thisThreadList = thread;
        },
        getThreadId : function(){
            return thisThreadList;
        },
    };
});

app.service('saveFriendDate', function() {

    var friendData = {};
    return {
        saveFriendObject : function(friendObject){
            friendData = friendObject;
        },
        getFriendIdObject : function(){
            return friendData;
        },
        clearFrindObject : function(){
            friendData = {};   
        }

    };
});
app.service('threadAndPass', function() {
    var thisThreadId = 0;
    var thisFriend = 0;
    return {
        saveThreadAndFriend: function(threadId, friendId){
            thisThreadId = threadId;
            thisFriend = friendId;
        },
        getThread : function(){
            return thisThreadId;
        },
        getFriend : function(){
            return thisFriend;
        },
        clearThreadAndFriend : function(){
            thisThreadId = 0;
            thisFriend = 0;
        }
    };
});

	

 
