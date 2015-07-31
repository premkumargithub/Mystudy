app.controller('NotificationController',['$scope', 'NotificationService', function($scope, NotificationService) {

    // Function to send email notification 
    $scope.sendEmailNotification = function() {
        var formData = {};
        formData.message_type = "Friend Request";
        formData.from = "abhinav.nehra@daffodilsw.com";
        formData.to = "vidhi.srivastava@daffodilsw.com";
        formData.mail_subject = "edit by post man";
        formData.notification_type = "Email";
        formData.message = "send from vidhi daffodil to vidhi123";
        formData.sender_userid = 21;
        formData.receiver_userid =  39;
        //Calling the NotificationService for sending the  http request to send email notification
        $scope.response = NotificationService.sendEmailNotification(formData, function(data){
            if(data.code == 101) {
                console.log("success");
            }
            else {
                console.log("failure");
            }
        });
    }
    // Function to Get Email Notification 
    $scope.getEmailNotification = function() {
        var formData = {};
        formData.notification_type = "Email";
        formData.receiver_userid = 39;
        formData.limit_start = 0;
        formData.limit_size = 20;
        //Calling the NotificationService for sending the  http request to get email notification
        $scope.response = NotificationService.getEmailNotification(formData, function(data){
            if(data.code == 101) {
                console.log("success");
            }
            else {
                console.log("failure");
            }
        });
    }
    //Function to get read and unread email notification
    $scope.readUnreadEmailNotifications = function() {
        var formData = {};
        formData.notification_type = "Email";
        formData.message_id = "";
        formData.session_id = APP.currentUser.id;
        formData.read_value  = "";
        //Calling the NotificationService to get the detail of read and unread notification
        $scope.response = NotificationService.readUnreadEmailNotifications(formData, function(data){
            if(data.code == 101) {
                console.log("success");
            }
            else {
                console.log("failure");
            }
        });
    }
    //Function to delete the specific email
    $scope.deleteEmailNotifications = function() {
        var formData = {};
        formData.notification_type = "Email";
        formData.message_id = "53d8b2088fd8cd98dd8b4567";
        formData.session_id = APP.currentUser.id;
        //Calling the NotificationService to delete the specific email
        $scope.response = NotificationService.deleteEmailNotifications(formData, function(data){
            if(data.code == 101) {
                console.log("success");
            }
            else {
                console.log("failure");
            }
        });
    }
    // Function to search the email that contain the specific text 
    $scope.searchEmailNotifications = function() {
        var formData = {};
        formData.notification_type = "Email";
        formData.search_text = "send";
        formData.receiver_userid = 39;
        formData.limit_start = 0;
        formData.limit_size = 4;
        //Calling the NotificationService to get email that contain the specific text
        $scope.response = NotificationService.searchEmailNotifications(formData, function(data){
            if(data.code == 101) {
                console.log("success");
            }
            else {
                console.log("failure");
            }
        });
    }

}]);