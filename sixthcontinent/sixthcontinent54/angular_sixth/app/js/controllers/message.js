app.controller('MessageController',['$scope','$rootScope', '$interval','$timeout','fileReader', 'MessageService', 'saveFriendId', 'threadAndPass','$routeParams', 'saveFriendDate', 'FileUploader', function ($scope, $rootScope, $interval, $timeout, fileReader, MessageService, saveFriendId, threadAndPass, $routeParams, saveFriendDate, FileUploader) {
    $scope.loadUserMessage = false;
    $scope.errorMessage = "";
    var oneClicklistMsg = 0;
    var oneClickReadMsg = 0;
    var oneClickMsgInb = 0;
    $scope.totalUnreadMsg = 0;
    $scope.showMsgSearch = false;
    $scope.storeReceiverObj = [];
    $scope.isNewMessage = false;
    $scope.showSetting = false;
    $scope.user_id = [];
    $scope.noMsg = true;
    $scope.isAddUser = false;
    $scope.storeThreadMembers = [];
    $scope.body = '';
    $scope.MessageUserid = $routeParams.mid; // to send message from friend profile 
    //Message Listing Inbox
    $scope.response = {};
   
    $scope.messageInbox = function(){ 
        var opts = {};
        $scope.loadUserMessage = true;
        opts.user_id = $scope.currentUser.id;
        opts.limit_start = APP.friend_list_pagination.start;
        opts.limit_size = APP.friend_list_pagination.end;  
        if(oneClickMsgInb == 0) {
            oneClickMsgInb = 1;
            MessageService.listGroupInbox(opts, function(data) {
                if(data.code == 101) {
                    oneClickMsgInb = 0;
                    $scope.loadUserMessage = false;
                    $scope.response = data.data;
                    if(data.total > 0){
                        $scope.storeThreadMembers = data.data[0].thread_members;
                        if($scope.MessageUserid == '' || $scope.MessageUserid == undefined){
                            $scope.listGroupMessages(data.data[0].thread_id, $scope.storeThreadMembers);
                            $timeout(function(){
                                $('#list-'+data.data[0].thread_id).addClass('active');
                            }, 500);
                        } else {
                            $scope.sendFriendMessage();
                        }
                    } else {
                        $scope.newMessageShow();
                        $scope.noMsg = true;
                       $scope.listmessage = []; 
                    }
                } else {
                    $scope.loadUserMessage = false;   
                }
            });
        }
    }

    /*function to clear the variable when new thread is clicked*/
    $scope.MessageHide = function() {
        if($scope.isGroupThread == true){
            $scope.showSetting = true;
        }
        $scope.custom = false;
        $scope.noMsg = false;
        $scope.emptyMessageError = false;
        $scope.createMessageerror = "";
        $scope.isNewMessage = false;
        $scope.isJoinGroup = false;
    };

    /*function to show the new message form*/
    $scope.newMessageShow = function() {
        if($scope.isGroupThread == true){
            $scope.showSetting = false;
        }
        $scope.isJoinGroup = false;
        $scope.user_id = [];
        $scope.tags = [];
        $scope.storeReceiverObj = [];
        $scope.custom = true;
        $scope.recipientAddress = "";
        $scope.createMessageerror = "";
        $scope.emptyMessageError = false;
        $scope.isNewMessage = true;
    };

    //Create Message
    $scope.createMessageshow = false; 
    $scope.createMessage = function(){
        var opts = {};
        opts.session_id = $scope.currentUser.id;
        if($scope.isNewMessage == true || $scope.isJoinGroup == true) {
            //set recipeient name
            if($scope.tags == undefined || $scope.tags.length == 0){
                $scope.emptyMessageError = true;
                $scope.createMessageerror = $scope.i18n.msg_message.message_create;
                $timeout(function() {
                        $scope.emptyMessageError = false;
                    }, 15000);
                return false;
            } 
            for (i = 0; i < $scope.tags.length; i++) { 
                $scope.user_id.push($scope.tags[i].user_id);
            }
            opts.recipient = $scope.user_id; 
            if($scope.isJoinGroup == true) {
                opts.thread_id = $scope.storeThread;
            } else {
                opts.thread_id = "0";
            }
        } else {
            opts.recipient = $scope.storeRecipient;
            opts.thread_id = $scope.storeThread;
        }
        
        if(($scope.myFile == undefined ||  $scope.myFile == '') && ($scope.body == undefined || $scope.body == '')){
            $scope.emptyMessageError = true;
            $scope.createMessageerror = $scope.i18n.msg_message.message_first;
            $timeout(function() {
                    $scope.emptyMessageError = false;
                }, 15000);
            return false;
        } 

        opts.body = $scope.body;
        $scope.myFile == ''
        $scope.createMessageshow = true;
        $scope.emptyMessageError = false;
        $scope.sendMessage = MessageService.groupMessageSends(opts, $scope.myFile, function(data){
            if(data.code == 101) {
                $scope.custom = false;
                $scope.createMessageshow = false;
                if($scope.isNewMessage == true || $scope.isAddUser == true) {
                    $scope.messageInbox();
                    $scope.isNewMessage == false;
                } else {
                    $scope.listGroupMessages($scope.storeThread, $scope.storeThreadMembers);
                    $scope.listingmsge();
                }
                $scope.imageSrc = '';
                $scope.myFile = '';
                $scope.body = "";
                $scope.user_id = [];
                $scope.tags = [];
            }
            else {
                $scope.custom = false;
                $scope.createMessageshow = false;
            }
        });
    }

    /*function to show the message Listing
    * @accept Threadid
    * @return array object of messages
    */
    $scope.listGroupMessages = function(thread_id, threadMembers){ 
        $scope.MessageHide(); 
        // $scope.MessageUserid = $routeParams.mid;
        var count = 1;
        $scope.names = [];
        $scope.storeRecipient = [];
        $scope.listmessage = [];
        $scope.storeThreadMembers = '';
        $scope.storeReceiverName = []; 
        $scope.receiverName = '';
        $scope.loadMessage =true;
        $scope.showMsgSearch =  false;
        var opts = {};
        opts.user_id = $scope.currentUser.id;
        opts.thread_id= thread_id;
        opts.limit_size = APP.message_list_pagination.end;
        opts.limit_start = APP.message_list_pagination.start;
        if(oneClicklistMsg == 0){
            oneClicklistMsg = 1;
            MessageService.listGroupMessages(opts, function(data){
                if(data.code == 101) {
                    oneClicklistMsg = 0;
                    $scope.listmessage = data.data.messages;
                    $scope.storeThread = data.data.group_id;
                    $scope.loadMessage =false;
                    $scope.expandButton = false;
                    $scope.memberName = true;
                    $scope.collapseButton = true;
                    $scope.storeReceiverObj = threadMembers;
                    $scope.storeThreadMembers = threadMembers;
                    //calling function to update notification message count
                    $rootScope.listUnReadMessages();
                    if(data.data.group_type == 'group'){
                        $scope.storeRecipient = data.data.recipient;
                        $scope.isGroupThread = true;
                        $scope.showSetting = true;
                        if($scope.storeThreadMembers.length == 1 ) {
                            $scope.storeReceiverName.push($scope.storeThreadMembers[0].first_name+' '+$scope.storeThreadMembers[0].last_name);
                            $scope.receiverName = $scope.storeThreadMembers[0].first_name+' '+$scope.storeThreadMembers[0].last_name;
                        } else if ($scope.storeThreadMembers.length == 2) {
                            $scope.storeReceiverName.push($scope.storeThreadMembers[0].first_name+' '+$scope.storeThreadMembers[0].last_name);
                            $scope.storeReceiverName.push($scope.storeThreadMembers[1].first_name+' '+$scope.storeThreadMembers[1].last_name);
                            $scope.receiverName = $scope.storeThreadMembers[0].first_name+' '+$scope.storeThreadMembers[0].last_name + ', ';
                            $scope.receiverName += $scope.storeThreadMembers[1].first_name+' '+$scope.storeThreadMembers[1].last_name;   
                        } else if ($scope.storeThreadMembers.length > 2 ) {
                            for(var i = 0; i < $scope.storeThreadMembers.length; i++){
                                $scope.storeReceiverName.push($scope.storeThreadMembers[i].first_name+' '+$scope.storeThreadMembers[i].last_name);
                                $scope.receiverName += $scope.storeThreadMembers[i].first_name+' '+$scope.storeThreadMembers[i].last_name + ', ';   
                                if(count == $scope.storeThreadMembers.length) {
                                    $scope.receiverName = $scope.receiverName.replace(/,\s*$/, "");
                                }
                                count = count+1;
                            } 
                        } 
                    } else {
                        //$scope.storeRecipient.push(data.data.recipient);
                        $scope.storeRecipient = data.data.recipient;
                        $scope.isGroupThread = false;
                        $scope.showSetting = false;
                        $scope.storeReceiverName.push($scope.storeThreadMembers[0].first_name+' '+$scope.storeThreadMembers[0].last_name);
                        $scope.receiverName = $scope.storeThreadMembers[0].first_name+' '+$scope.storeThreadMembers[0].last_name;
                    }

                    //console.log($scope.storeReceiverName);
                    $scope.readMessage(data.data.group_id);
                    $(".messages-onscroll").animate({
                            scrollTop: $(".messages-onscroll")[0].scrollHeight
                    },'fast');
                    $timeout(function(){
                        $('.scrollable-block li').removeClass('active');
                        $('#list-'+thread_id).addClass('active');
                    }, 500);
                } else {
                    $scope.loadMessage =false;
                }
            });
        }
    }

    /*function to mark the message as read on thread click
    * @ accept thread Id
    */
    //Read Message 
    $scope.readMessage = function(threadId){
        var opts = {};
        opts.session_id = $scope.currentUser.id;
        opts.thread_id = threadId;
        if(oneClickReadMsg == 0) {
            oneClickReadMsg = 1;
            $scope.read = MessageService.readGroupMessages(opts, function(data){
                if(data.code == 101) {
                    $scope.getUnreadMessage();
                  oneClickReadMsg = 0;
                  $('#list-'+threadId).removeClass('bold');
                }
                else {
                    oneClickReadMsg = 0;
                }
            });
        }
    }

    /*function to delete a message in the thread
    *@ accept threadid and messageid
    */
    //Delete Message 
    $scope.deleteMessage = function(messageId, threadId){
        var opts = {};
        var r = confirm($scope.i18n.msg_message.message_confirm);
        if (r == true) {
            opts.session_id = $scope.currentUser.id;
            opts.message_id = messageId;
            MessageService.deleteGroupMessages(opts, function(data){ 
                if(data.code == 101) {
                    $scope.listGroupMessages(threadId, $scope.storeThreadMembers);
                    $scope.listingmsge();// add for refresh the left bar
                }
            });
        }
    }


    /// call list group service
     $scope.listingmsge = function(){
        var opts = {};
        $scope.loadUserMessage = true;
        opts.user_id = $scope.currentUser.id;
        opts.limit_start = APP.friend_list_pagination.start;
        opts.limit_size = APP.friend_list_pagination.end; 
        MessageService.listGroupInbox(opts, function(data) {
           if(data.code == 101) {
                 $scope.loadUserMessage = false;
                  $scope.response = data.data;
            } else
              {
                
              }
        } );   
     };

    /// message send on enter
    $('#myTextarea').keydown(function(e) {
        if (e.ctrlKey && e.keyCode == 13) {
            $scope.createMessage();
        }
    });
    
    $scope.edit = true;
    $scope.model = {};
    $scope.model.updateBody = "";
    $scope.assignUpdate = function(data){
        $scope.model.updateBody = data;
    }

    //Update Message 
    $scope.updateMessage = function(messageId, threadId){
        var opts = {};
        opts.session_id = $scope.currentUser.id;
        opts.message_id = messageId;
        opts.body = $scope.model.updateBody;
        if($scope.model.updateBody == ""){
            $scope.deleteMessage(messageId,threadId);
        }else{
            $scope.update = MessageService.updateMessage(opts, function(data){
                if(data.code == 101) {
                    $scope.listGroupMessages(threadId, $scope.storeThreadMembers);
                    $scope.edit = true;
                    $scope.model.updateBody = "";
                }
                else {
                 
                }
            });
        }
    }

    //function to load more inbox*
    $scope.freezeRequest = 0;
    $scope.loadMessageUser = "false";
    $scope.loadMoreList = function(){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.limit_start = $scope.response.length;
        opts.limit_size = APP.friend_list_pagination.end;
        $scope.loadMessageUser = "true";
        if($scope.freezeRequest == 0){
            $scope.freezeRequest = 1;
            MessageService.messageInbox(opts, function(data) {
            if(data.code == 100) {   
                if(data.total != 0){  
                    $scope.freezeRequest = 0;
                    $scope.loadMessageUser = "false";
                    $scope.response = $scope.response.concat(data.data);
                } else {
                    $scope.loadMessageUser = "false";
                    $scope.freezeRequest = 0;
                }
            }else{
                    $scope.loadMessageUser = "false";
                    $scope.freezeRequest = 0;
                }
            });
        }
    }

    //function to load more messages of a thread
    $scope.canLoad = true;
    $scope.loadMore = function(threadId) {
        $scope.canLoad = true;
        $scope.loadMoremessages(threadId);
    };

    //List User Messages of the thread
    $scope.showImage = false;
    $scope.loadMoreMessage = false;
    $scope.listmessage = {};
    $scope.blockRequest = 0;
    $scope.loadMoremessages = function(threadid){
        $scope.loadMoreMessage = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.thread_id = threadid;
        opts.limit_start = $scope.listmessage.length;
        opts.limit_size = APP.message_list_pagination.end-4;
        if($scope.blockRequest == 0){
            $scope.blockRequest = 1;
            MessageService.listGroupMessages(opts, function(data) { //console.log(data.data)
                if(data.code == 100 && data.data.messages.length > 0) {
                    $scope.blockRequest = 0;
                    $scope.loadMoreMessage = false;
                    $scope.userid = APP.currentUser.id;
                    $scope.listmessage = $scope.listmessage.concat(data.data.messages);
                    stop = $interval(function() {
                        $(".load-more-onscroll").scrollTop(10);
                    }, 1000,2);
                } else {
                    $scope.loadMoreMessage = false;
                    $scope.blockRequest = 0;
                }
            });
        }
    }

    $scope.names = [];
    $scope.cancelRequest = 0;
    $scope.noData = false;
    $scope.WaitFriendList = false;
    //function to show the friend list when searching friend to send message
    $scope.listFriend = function(){
        $scope.cancelRequest = 0;
        $scope.WaitFriendList = true;
        $scope.names = [];
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_name = $scope.recipientAddress; 
        opts.session_id = APP.currentUser.id;
        opts.limit_size =  APP.friend_list_pagination.end;
        opts.limit_start = APP.friend_list_pagination.start;
        MessageService.searchFriends(opts, function(data){
            $scope.WaitFriendList = false;
            if( $scope.cancelRequest == 0 ){
                $scope.names.splice(0, 10)
                if(data.code == 101) {
                    angular.forEach(data.data.users,function(user) {
                        $scope.names.push(user);
                        $scope.noData = false;
                    });
                    if(data.data.count == '0'){
                        $scope.noData = true;
                    }
                }else {
                    $scope.noData = false;
                }
            }else{
                $scope.listfriend = [];
            }
        });
    }

    //search friend
    $scope.recipientAddress ='';
    var DELAY_TIME_BEFORE_POSTING = 300;
    var currentTimeout = null;
    $('#searchfrnd').keydown(function() {
      var model = $scope.recipientAddress;
      
      if(currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
      currentTimeout = $timeout(function(){
        if(model.length > 1){
            $scope.listFriend();
        } else {
            $scope.noData = false;
            $scope.names = [];
        }
        
      }, DELAY_TIME_BEFORE_POSTING)
    });
    //Search User Thread
   
    $scope.searchUserThread = function(){  
        var opts = {};
        $scope.noResult = false;
        opts.user_id = APP.currentUser.id;
        opts.firstname = $scope.nameSearch;
        $scope.loadUserMessage = true;
        opts.limit_start = APP.message_list_pagination.start;
        opts.limit_size = APP.message_list_pagination.end;
        if($scope.nameSearch == '') {
                    $scope.noResult = false;
                    $scope.messageInbox();
        } else {    
            MessageService.searchUserThread(opts, function(data) { 
                if(data.code == 100) {
                    $scope.loadUserMessage = false;
                    $scope.response = data.data;
                    $scope.noResult = false;
                    if(data.total == 0) {
                        $scope.noResult = true;
                    }
                }
            });
        }
    }

    //search user
    $scope.nameSearch ='';
    var DELAY_TIME_BEFORE_POSTING_SEARCH = 300;
    $('#searchuser').keydown(function() {

        var model = $scope.nameSearch;
        if(currentTimeout) {
            $timeout.cancel(currentTimeout);
        }
        currentTimeout = $timeout(function(){
            if(model.length > 1){
                $scope.searchUserThread();  
            }
            else {
                $scope.messageInbox();
                $scope.noResult = false;
            }

        }, DELAY_TIME_BEFORE_POSTING_SEARCH)
    });

    $scope.clearList = function(){
        stop = $interval(function() {
            $scope.cancelRequest = 1;
            $scope.names = [];
        }, 200,1);
    };

    //function to show the username to whome the message will send
    $scope.tags = [];
    $scope.selectFriend = function(name){
        $scope.names = [];
        $scope.recipientAddress = name.user_info.first_name+' '+name.user_info.last_name;
        $scope.seen = true;
        for (var i = 0; i<$scope.tags.length; i++){
            if($scope.tags[i].user_id == name.user_info.id)
            {
               $scope.seen = false;
            }
        } 
        if($scope.seen == true)
        {   
            $scope.tags.push({"recipient":$scope.recipientAddress,"user_id": name.user_id});
        }
        
        $scope.recipientAddress = '';
    };

    //function to remove the username from the group
    $scope.remove = function ( idx ) {
        var tempTag = $scope.tags[idx];
        if($scope.isJoinGroup == true){
            var opts = {};
            opts.session_id = APP.currentUser.id;
            opts.deleted_user_id = tempTag.user_id;
            opts.thread_id = $scope.storeThread;
            MessageService.removeGroupUsers(opts, function(data) { 
                if(data.code == 101) {
                    $scope.getUnreadMessage();
                    $scope.tags.splice( idx, 1 );
                } 
            });
        } else {
            $scope.tags.splice( idx, 1 );
        }
    };

    //function to show and hide the full group recipeint name
    $scope.expandButton = false;
    $scope.collapseButton = true;
    $scope.memberName = true;
    $scope.hideFirstButton = function() {
        $scope.memberName = true;
        $scope.expandButton = false;
        $scope.collapseButton = true;
    }

    $scope.hideSecondButton = function() {
        $scope.memberName = false;
        $scope.expandButton = true;
        $scope.collapseButton = false;
    }

    /*funciton to get the unread count*/
    $scope.getUnreadMessage = function(){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.limit_size =  APP.friend_list_pagination.end;
        opts.limit_start = APP.friend_list_pagination.start;
        opts.is_view = 1;
        MessageService.listGroupUnreadMessages(opts, function(data) {
            if(data.code == 101 && data.total > 0) {
                $scope.totalUnreadMsg = data.total;
            } else {
                $scope.totalUnreadMsg = 0;
            }
        });
    }
    //$scope.getUnreadMessage();

    //funciton to remove the user from the thread
    $scope.removeGroupUsers = function(threadId){
        var r = confirm($scope.i18n.msg_message.message_confirm);
        if (r == true) {
            var opts = {};
            opts.session_id = APP.currentUser.id;
            opts.deleted_user_id = APP.currentUser.id;
            opts.thread_id = threadId;
            MessageService.removeGroupUsers(opts, function(data) { 
                if(data.code == 101) {
                    $scope.getUnreadMessage();
                    $scope.receiverName = '';
                    $scope.tags = [];
                    $scope.messageInbox('');
                    $scope.storeReceiverName = [];
                } 
            });
        }
    }

    //function to add new user in the thread for group message
    $scope.addUserGroup = function(threadId){
        $scope.tags = [];
        $scope.custom = true;
        $scope.isAddUser = true;
        var recipienName = '';
        $scope.recipientAddress = "";
        $scope.createMessageerror = "";
        $scope.emptyMessageError = false;
        $scope.fileuperror = false;
        $scope.uploadfileerror = "";
        if($scope.storeReceiverObj.length != 0 && $scope.storeReceiverObj != undefined){
            for(i=0; i<$scope.storeReceiverObj.length; i++){
                recipienName = $scope.storeReceiverObj[i].first_name + " " +$scope.storeReceiverObj[i].last_name;
                $scope.tags.push({"recipient":recipienName,"user_id": $scope.storeReceiverObj[i].id});
            }
        }
        
        $scope.isJoinGroup = true;
        $scope.storeThread = threadId;
    }

    //call the service to search Message in a thread
    $scope.loadSearch = false;
    $scope.noSearch = false;
    $scope.searchMessage = function(){
        var opts = {};
        $scope.loadSearch = true;
        opts.user_id = APP.currentUser.id;
        opts.thread_id = $scope.storeThread;
        opts.keyword = $scope.resultMsg;
        
        MessageService.searchThreadMessages(opts, function(data){
            if(data.code == 100) {
                $scope.loadMessage = false;
                $scope.loadSearch = false;
                 $scope.noSearch = true;
                $scope.listmessage = data.data.messages;
                $scope.nouserSearch = data.total;
            }
        });
    }

    //function to open the message serch box
    $scope.openSearchBox = function(){
        $scope.showMsgSearch = true;
        $('#searchMsg').val('');
        $scope.noSearch = false;
    }

    //search message in a thread
    var DELAY_TIME_BEFORE_POSTING_THREAD = 300;
    
    var currentTimeout = null;
    $('#searchMsg').keydown(function() {
        //$scope.loadMessage = true;
        var model = $scope.resultMsg;
        if(currentTimeout) {
            $timeout.cancel(currentTimeout);
        }
        currentTimeout = $timeout(function(){
            if(model.length > 1){
                //$scope.loadMessage = true;
                $scope.searchMessage();
            } else {
                $scope.listGroupMessages($scope.storeThread, $scope.storeThreadMembers);  
            }
        }, DELAY_TIME_BEFORE_POSTING_THREAD)
    });

    $scope.cancelSearch = function(){
        $scope.cancelRequest = 1;
        $scope.listmessage = [];
        $scope.loadMessage = false;
        $scope.showMsgSearch = false;
        $scope.listGroupMessages($scope.storeThread, $scope.storeThreadMembers);  
    }

    /*functions to image message upload start*/
    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {

            $scope.myFile = $scope.file;
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
            // Checking Extension
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg" || imageType == "GIF" || imageType == "PNG" || imageType == "JPG" || imageType == "JPEG")) {
                $scope.uploadfileerror = $scope.i18n.msg_directive.upload_media_file;
                $scope.msgUploadError = true;
                $scope.imageSrc = '';
                $scope.myFile = "";
                $scope.fileuperror = true;
                $scope.deleteImage = false;
                $timeout(function() {
                        $scope.fileuperror = false;
                        $scope.msgUploadError = false;
                }, 2000);
            } else {
                $scope.uploadfileerror = "";
                $scope.msgUploadError = false;
                $scope.imageSrc = result;
                $scope.fileuperror = false;
                $scope.deleteImage = true;
            }
            
        });
    };

    $scope.removeImage = function(){
        $scope.imageSrc = '';
        $scope.myFile = "";
        $scope.deleteImage = false;
    }
    /*function to image message upload end*/

    /* function to set user name for new message sending from friend profile message button
    * @accept userid from the Route params
    @return set the user name on message send box
    */
    $scope.sendFriendMessage = function(){
        if($scope.MessageUserid != '' && $scope.MessageUserid != undefined){
            var frind = saveFriendDate.getFriendIdObject();
            if(frind && frind.user_id != undefined ){
                $scope.newMessageShow();
                var friendAddress = frind.user_info.first_name+' '+frind.user_info.last_name;
                $scope.tags.push({"recipient":friendAddress,"user_id": parseInt(frind.user_id)});
                $scope.MessageUserid = undefined;
            }
        }
    }
    
}]);