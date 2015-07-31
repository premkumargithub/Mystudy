app.controller('AllNotiController', ['$cookieStore', '$scope', '$rootScope', '$http', '$location', '$timeout', 'UserService', 'ProfileService', 'GroupService', 'SingleMediaDetailService', '$modal', '$log', 'AlbumService', 'ShopTransactionService', 'LandURL', 'storeShopHistorySelection', function($cookieStore, $scope, $rootScope, $http, $location, $timeout, UserService, ProfileService, GroupService, SingleMediaDetailService, $modal, $log, AlbumService, ShopTransactionService, LandURL, storeShopHistorySelection) {
	$scope.NotificationFound = false;
	$scope.NotificationNotFound = false;
	$rootScope.showNotificationList = false;
	$rootScope.loadNotification = false;
	$scope.loadNotiResponse = 1;
	$scope.scopeVar = false;
	$scope.friendTagIndex = 0;
    $scope.tagged_Friends = [];
    $scope.UpdateTag      = false;
    $scope.TagLoader      = false;
    $scope.friends        = [];
    $scope.cancelFriendSearch = false;
    $scope.showSearchLoader   = false;
    $scope.dublicate = false;
    $scope.toBelong = false;
    $scope.tagged_collection = []
    $scope.untagg_friend = {}
    $scope.choose = false;
    $scope.max          = 5;
    $scope.isReadonly   = false;
    var modalInstance;

	$scope.showAllNotification = function($event) {
        if($event != undefined){
            $event.stopPropagation();
        }
		var temp=$rootScope.toggleSearch
		$rootScope.toggleSearch=null
		setTimeout(function(){
			$rootScope.toggleSearch=temp
		},100);
        $rootScope.groupNotificationList = false;
		$rootScope.showNewMessageList = false;
		$rootScope.showFriendNotificationList=false;
        $rootScope.loadGroupNotification = false;
		$rootScope.showNotificationList = !$rootScope.showNotificationList;
		$scope.scopeVar = !$scope.scopeVar;
		$scope.scopeVar1 = false;
		$scope.scopeVar2 = false;
		$scope.scopeVar3 = false;
        if($scope.scopeVar){
		  $scope.getAllNotification();
        }else{
            $rootScope.getCountOfAllTypeNotificaton();
        }
	};	
	$scope.notificationOut = function(){
		$rootScope.showNotificationList = false;
		$scope.scopeVar = false;
    };
    $scope.blockDivClick = function(even){
		if(even.target.nodeName!=='IMG'){
			var temp=$rootScope.toggleSearch
			$rootScope.toggleSearch=null
	        setTimeout(function(){
				$rootScope.toggleSearch=temp
			},100)
		}
	}
	$scope.getAllNotification = function() {
		$rootScope.loadNotification = true;		
		$scope.NotificationFound = false;
		$scope.NotificationNotFound = false;
		opts = {};
		opts.user_id = APP.currentUser.id.toString();
		opts.is_view = 1;
		opts.limit_start = 0;
		opts.limit_size = 200;
		if($scope.loadNotiResponse == 1) {
			$scope.loadNotiResponse = 0;
			ProfileService.getAllTypeNotification(opts, function(data) {
				$scope.loadNotiResponse = 1;
				if(data.code == 101) {
					$scope.allNotification = data.data.requests;
					$scope.allTotal = data.data.size;
					$scope.NotificationFound = true;
					$rootScope.loadNotification = false;
					$rootScope.getCountOfAllTypeNotificaton();
				}else {
					$scope.NotificationFound = false;
		 			$scope.allNotification = [];
		 			$scope.allTotal = 0;
		 			$rootScope.loadNotification = false;
				}
			});
		}
	};

	$scope.deleteMarkNotification = function(tag, id, notificationId) {
		$("#"+tag+"-"+ id).fadeOut(1000);
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notificationId;
		ProfileService.markAsDelete(opts, function(data) {
			if(data.code == 101) {
				$("#"+tag+"-"+ id).hide();
				$rootScope.getCountOfAllTypeNotificaton();
			} else {
				$("#"+tag+"-"+ id).show();
			}
		});
	};

	$scope.markAsRead = function(tag, id, notificationId) {
		$("#"+tag+"-"+ id).removeClass("unread-noti").addClass("read-noti");
		$scope.allNotification[id].is_read = 1;
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notificationId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
		});
	};

	//TODO for service 
	$scope.markAsUnread = function(tag, id, notificationId) {
		$("#"+tag+"-"+ id).removeClass("read-noti").addClass("unread-noti");
		$scope.allNotification[id].is_read = 0;
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notificationId;
		// ProfileService.markReadNotification(opts, function(data) {
		// 	$rootScope.getCountOfAllTypeNotificaton();
		// });
	};

	$scope.viewClubDetail = function(clubId, notiId, clubType) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
            LandURL.sendTo("/club/view/"+clubId+"/"+clubType);
		});
	};
	
	$scope.viewUserAlbum = function(albumId, notiId, albumTitle) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
                LandURL.sendTo("/album/images/"+albumId+"/"+albumTitle);
			} else {
                LandURL.sendTo("/album/images/"+albumId+"/"+albumTitle);
			}
		});
	};

	$scope.getmediainfo = function(media_id, album_type, parent_id, ownerid, parent_type,ClubMember){
		$scope.modal_loader = true;
		$scope.pre_visible  = false;
        $scope.next_visible = false;
        $scope.showInLimit = true;

        $scope.album_type   = album_type;
        $scope.parent_type  = parent_type;
        $scope.parent_id    = parent_id;
        $scope.media_id  	= media_id;
        $scope.supportId    = ownerid;
        if(ClubMember != undefined){/*This is defined when modal is opening from club album*/
            $scope.is_member = ClubMember;
        } 
		
		modalInstance = $modal.open({
            templateUrl: "app/views/img_modal_new.html",
            controller: 'ModalController',
            size: 'lg',
            scope: $scope,
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            $scope.tagged_Friends = [];
            $scope.UpdateTag      = false;
        });

        $scope.showAllTaggedFriend = function (){
            $scope.showInLimit = false;
        }
        
        $scope.data = [];
        var opt = new Object();
            opt.media_id         = media_id;
            opt.album_type       = album_type;
            opt.album_id         = parent_id;
            opt.user_id          = APP.currentUser.id; 
            opt.owner_id         = ownerid; 
        
        SingleMediaDetailService.getMediaInfo(opt, function(data) {
            if(data.code == 101){
                $scope.data         = data.data;
                $scope.modal_loader = false;
            }
        });    
    };

    $scope.averageRating = function(rating){
        return new Array(Math.ceil(rating));
    };

    $scope.blankStar = function(rating){
        if((5-Math.ceil(rating)) > 0){
            return new Array(5-Math.ceil(rating));
        }else{
            return 0;
        }
    };

    $scope.viewUserProfile = function(friendId){
        if(friendId == APP.currentUser.id){
            modalInstance.dismiss('cancel');
            $location.path('profiles');
        }else{
            modalInstance.dismiss('cancel');
            $location.path('/viewfriend/'+friendId);
        }
    };

    $scope.Tagtoggle = function(){
        $scope.UpdateTag = !$scope.UpdateTag;
    }

    $scope.tagFriendSuggestion = function(event, friendname){
        if(event.keyCode===40){
            event.preventDefault();
            if($scope.friendTagIndex+1 !== $scope.friends.length){
                $scope.friendTagIndex++;
            }
        }else if(event.keyCode===38){
            event.preventDefault();
            if($scope.friendTagIndex-1 !== -1){
                $scope.friendTagIndex--;
            }
        }else if(event.keyCode===13){
               if($scope.friends.length > 0  && $scope.friendTagIndex!==-1) $scope.selectFriend($scope.friends[$scope.friendTagIndex]);
        }
        if($('#searchTagFriend').val().trim()==="") $scope.showFriendList = false;
        if(!(event.keyCode>=65 && event.keyCode<=95)) return;
        $scope.cancelFriendSearch = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        friendname ? opts.friend_name = friendname : opts.friend_name = "";
        opts.session_id = APP.currentUser.id;
        opts.limit_start = 0;
        opts.limit_size =  APP.friend_list_pagination.end;
        $scope.showSearchLoader = true;

        ProfileService.searchFriends(opts,function(data){
            $scope.showSearchLoader = false;
            if($scope.cancelFriendSearch === false){
                if(data.data.users.length>0) $scope.showFriendList = true;
                else $scope.showFriendList = false;
                $scope.friends = data.data.users;
            }
        })
    };

    $scope.selectFriend = function(friendInfo){
        $scope.dublicate = false;
        $scope.choose = false;  
        angular.forEach($scope.data.tagged_friends_info,function(index){
            if(index.id === friendInfo.user_id){
                $scope.dublicate = true;
            }
        });

        if($scope.dublicate === false){
            $scope.data.tagged_friends_info.push(friendInfo.user_info);
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTagIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        }else{
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTagIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        }
    };

    $scope.taggService = function(){
    	var pre_visible_status  = $scope.pre_visible;
        var next_visible_status = $scope.next_visible;
        $scope.pre_visible = false;
        $scope.next_visible = false;
        var frnd_array = [];
        angular.forEach($scope.data.tagged_friends_info,function(index){
            frnd_array.push(index.id);
        });
        var opts = {};
            opts.user_id   = APP.currentUser.id;
            opts.album_id  = $scope.parent_id;
            opts.post_type = 1;
            opts.media_id  = [$scope.media_id];
            opts.tagged_friends = frnd_array.join(',')
        $scope.UpdateTag = false;
        $scope.TagLoader = true;
    
       AlbumService.photoTaging(opts,function(data){
            if(data.code === 101){
                $scope.choose = true;
                $scope.TagLoader = false;
            }
            $scope.pre_visible  = pre_visible_status;
            $scope.next_visible = next_visible_status;
        });
    };

    $scope.removeTagFriend = function(friendIndex){
        $scope.data.tagged_friends_info.splice(friendIndex,1);
    };

    $scope.lostFocus = function(){
        $timeout(function(){
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTagIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        },300);
    };

    $scope.findPeopleRate = function(id, count_Vote){
        if(count_Vote === 0 ){
            return false;
        }
        var opts = {};
        $scope.ratedUsers = {};
        var modalInstance1 = $modal.open({
                    templateUrl: 'app/views/find_people.html',
                    controller: 'ModalController',
                    size: 'lg',
                    scope: $scope,
        });
        $scope.showPeopleLoader = true;
        if($scope.parent_type == 'friend_album'){
            opts.type = 'user_profile_album_photo'
        }else {
            opts.type = $scope.parent_type;
        }
        opts.type_id = id;
        opts.session_id = APP.currentUser.id;
        ProfileService.findPeople(opts,function(data){
            if(data.code == 101 && data.message == "SUCCESS"){
                $scope.showPeopleLoader = false;
                $scope.ratedUsers       = data.data.users_rated;
                if(data.data.users_rated.length == 0){
                    $scope.message = $scope.i18n.dashboard.no_vote;
                }
            }else{
                $scope.showPeopleLoader = false;
            }
        });
        modalInstance1.result.then(function (selectedItem) {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

        $scope.viewFriendProile = function(friendId){
            modalInstance1.dismiss('cancel');
            $location.path('/viewfriend/'+friendId);
        };
    };

    $scope.waitRateResponse = false;
    $scope.ratePicture = function(rating, picture_id, mediaIndex){
        var update = "";
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.type_id = picture_id;
        opts.rate    = rating;
        if($scope.parent_type == 'friend_album'){
            opts.type = 'user_profile_album_photo'
        }else {
            opts.type = $scope.parent_type;
        }
        if($scope.data.is_rated){
            update = "update";
        }else{
            update = "add";
        }
        $scope.waitRateResponse = true;
        ProfileService.rateThis(opts, update, function(data){
            if(data.code === 101 && data.message === "SUCCESS"){
                $scope.data.avg_rate    = data.data.avg_rate;
                $scope.data.no_of_votes = data.data.no_of_votes;
                $scope.data.is_rated    = true;
                $scope.data.current_user_rate = data.data.current_user_rate;
            }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                $scope.data.current_user_rate   = 0;
                $scope.data.is_rated            = true;
            }
            $scope.waitRateResponse = false;
        });
    };

    $scope.removeRating = function(pictureIndex , mediaIndex){
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.type_id = pictureIndex;
        if($scope.parent_type == 'friend_album'){
            opts.type = 'user_profile_album_photo'
        }else {
            opts.type = $scope.parent_type;
        }
        
        if($scope.waitRateResponse === false){
            $scope.waitRateResponse = true;
        }else{
            return;
        }
        ProfileService.removeRating(opts,function(data){
            if(data.code == 101 && data.message == "SUCCESS"){
                $scope.data.current_user_rate   = 0;
                $scope.data.avg_rate            = data.data.avg_rate;
                $scope.data.no_of_votes         = data.data.no_of_votes;
                $scope.data.is_rated            = false;
            }else if(data.code === 100 && data.message === "ERROR_OCCURED"){
                $scope.data.current_user_rate   = 0;
                $scope.data.is_rated            = false;
            }
            $scope.waitRateResponse = false;
        });
    };

	$scope.viewClubAlbum = function(clubId, albumName, albumId, clubType, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
                LandURL.sendTo("/album/club/view/"+clubId +"/"+albumId+"/"+clubType+"/"+albumName);
            } else {
                LandURL.sendTo("/album/club/view/"+clubId +"/"+albumId+"/"+clubType+"/"+albumName);
			}
		});
	};

	$scope.viewShopAlbum = function(shopId, albumTitle, albumId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
                LandURL.sendTo("/album/shop/image/"+albumId+"/"+albumTitle+"/"+shopId);
            } else {
                LandURL.sendTo("/album/shop/image/"+albumId+"/"+albumTitle+"/"+shopId);
            }
		});
	};

	$scope.viewPost = function(postId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
                LandURL.sendTo("/post/"+postId);
			} else {
				LandURL.sendTo("/post/"+postId);
			}
		});
	};

	$scope.viewClubPost = function(postId, clubId, notiId, clubType) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
            LandURL.sendTo('/club/'+clubId+'/post/'+postId+'/'+clubType);
		});
	};

	$scope.viewShopPost = function(postId, shopId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
            LandURL.sendTo('/shop/'+shopId+'/post/'+postId);
		});
	};

	$scope.viewTaggedMedia = function(photoId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
			} else {
			}
		});
	};

    $scope.viewTxnPage = function(txnId, shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            var shopTransationObj = {};
            shopTransationObj.tab = 2;
            shopTransationObj.txnId = txnId;
            ShopTransactionService.setTransactionTab(shopTransationObj);
            $rootScope.getCountOfAllTypeNotificaton();
            LandURL.sendTo('/shop/transaction/'+shopId);
            } 
        });
    };

    $scope.viewShopProfile = function(shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
            LandURL.sendTo('/shop/view/'+shopId);
            } 
        });
    };

    $scope.viewCitizenProfile = function(userId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
                LandURL.sendTo('/wallets');
            } else {
                LandURL.sendTo('/wallets');
            }
        });
    };

    $scope.viewShopPromotions = function(shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
            LandURL.sendTo('/shop/promotions/'+shopId);
            }else {
                LandURL.sendTo('/shop/promotions/'+shopId);
            }
        });
    };

    $scope.viewShopPendingPayment = function(shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            storeShopHistorySelection.setPenPaymentMethod(true);
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
                LandURL.sendTo('/shop/wallet/'+shopId);
            }else {
                LandURL.sendTo('/shop/wallet/'+shopId);
            }
        });
    };

}]);

//Get all club request notifications in top header
app.controller('AllGroupNotiController', function($cookieStore, $scope, $rootScope, $http, $location, $timeout, UserService, ProfileService, GroupService) {
	$scope.NotificationFound = false;
	$scope.NotificationNotFound = false;
	$rootScope.groupNotificationList = false;
	$rootScope.loadGroupNotification = false;
	$scope.groupNotiResponse = 1;
	$scope.scopeVar3 = false;

	$scope.groupNotificationOut = function(){
		$rootScope.groupNotificationList = false;
		$scope.scopeVar3 = false;
	};
	$scope.blockDivClick = function(even){
		if(even.target.nodeName!=='IMG'){
			var temp=$rootScope.toggleSearch
			$rootScope.toggleSearch=null
		    setTimeout(function(){
				$rootScope.toggleSearch=temp
			},100)
		}
	}
	
	$scope.getAllGroupNotification = function($event) {
        if($event != undefined){
            $event.stopPropagation();
        }
		$scope.scopeVar = false;
		$scope.scopeVar1 = false;
		$scope.scopeVar2 = false;
		$scope.scopeVar3 = !$scope.scopeVar3;
        $rootScope.showNewMessageList = false;
        $rootScope.showNotificationList = false;
        $rootScope.showFriendNotificationList = false;
		$rootScope.groupNotificationList = !$rootScope.groupNotificationList;
		$rootScope.loadGroupNotification = !$rootScope.loadGroupNotification;		
		$scope.NotificationFound = false;
		$scope.NotificationNotFound = false;
		var opts = {};
		opts.user_id = (APP.currentUser.id).toString();;
		opts.is_view = '1';
		opts.limit_start = 0;
		opts.limit_size = 100;
        
		if($scope.groupNotiResponse == 1 && $scope.scopeVar3) {
			$scope.groupNotiResponse = 0;
			ProfileService.getAllGroupNotification(opts, function(data) {
				$scope.groupNotiResponse = 1;
				if(data.code == 101) {
					$scope.allNotification = data.data.requests;
					$scope.allTotal = data.data.size;
					$scope.NotificationFound = true;
					$rootScope.loadGroupNotification = false;
					$rootScope.getCountOfAllTypeNotificaton();
				}else {
					$scope.NotificationFound = false;
		 			$scope.allNotification = [];
		 			$scope.allTotal = 0;
		 			$rootScope.loadGroupNotification = false;
		 			$rootScope.getCountOfAllTypeNotificaton();
				}
			});
		}

        if(!$scope.scopeVar3){
            $rootScope.getCountOfAllTypeNotificaton();
        }
    };
    $scope.AcceptClubRequest = function(senderId, requestId, groupId, groupType, id, $event) {    
		$("#Groupnotification-request-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
		if(groupType == 1)
			opts.request_type = 'admin';
		else
			opts.request_type = 'user';
        opts.response = 1;
        GroupService.responseClubNotification(opts, function(data) {
        	if(data.code == 101) {
				$("#Groupnotification-request-" + id).hide();
				$rootScope.getCountOfAllTypeNotificaton();
				$scope.getAllGroupNotification($event);
			} else {
				$("#Groupnotification-request-" + id).show();
			}
		});
	};

    $scope.RejectClubRequest = function(senderId, requestId, groupId, groupType, id, $event) {
		$("#Groupnotification-request-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
		if(groupType == 1)
			opts.request_type = 'admin';
		else
			opts.request_type = 'user';
        opts.response = 2;
		GroupService.responseClubNotification(opts, function(data) {
			if(data.code == 101) {
				$("#Groupnotification-request-" + id).hide();
				$rootScope.getCountOfAllTypeNotificaton();
				// $scope.getAllGroupNotification($event);
			} else {
				$("#Groupnotification-request-" + id).hide();
			}
		});
	};

});

//Get all public notifications on a single page 
app.controller('AllNotificationView', ['$cookieStore', '$scope', '$rootScope', '$http', '$timeout', '$location', 'ProfileService', 'ShopTransactionService', 'storeShopHistorySelection', function($cookieStore, $scope, $rootScope, $http, $timeout, $location, ProfileService, ShopTransactionService, storeShopHistorySelection) {
	$scope.loadNotificationList = false;
	$scope.loadNotificationListFound = false;
	$scope.listResponse = 1;
	$scope.allNotificationList = [];
	$scope.endLimit = 12;
	$scope.allTotal = 0;

	$scope.getAllNotificationList = function() {	
		var limit_start = $scope.allNotificationList.length;
		opts = {};
		opts.user_id = APP.currentUser.id.toString();
		opts.is_view = 1;
		opts.limit_start = limit_start;
		opts.limit_size = $scope.endLimit;
		//console.log("start = "+limit_start +" end ="+$scope.endLimit + "total = "+$scope.allTotal + "res =" + $scope.listResponse);
		if ((( $scope.allTotal > limit_start) || $scope.allTotal == 0 ) && $scope.listResponse == 1) {
			$scope.loadNotificationList = true;
			$scope.listResponse = 0;
			ProfileService.getAllTypeNotification(opts, function(data) {
				$scope.listResponse = 1;
				if(data.code == 101) {
					$scope.allNotificationList = $scope.allNotificationList.concat(data.data.requests);
					$scope.allTotal = data.data.size;
					$scope.loadNotificationList = false;
					$scope.loadNotificationListFound = true;
				}else {
		 			$scope.allNotificationList = [];
		 			$scope.allTotal = 0;
		 			$scope.loadNotificationList = false;
		 			$scope.loadNotificationListFound = true;
				}
			});
		}
	};

	$scope.getAllNotificationList();

	$scope.loadMore = function() {
		$scope.getAllNotificationList();
	}

	$scope.deleteMarkNotification = function(tag, id, notificationId) {
		$("#"+tag+"-"+ id).fadeOut(1000);
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notificationId;
		ProfileService.markAsDelete(opts, function(data) {
			if(data.code == 101) {
				$("#"+tag+"-"+ id).hide();
				$rootScope.getCountOfAllTypeNotificaton();
			} else {
				$("#"+tag+"-"+ id).show();
			}
		});
	};

	$scope.markAsRead = function(tag, id, notificationId) {
		$("#"+tag+"-"+ id).removeClass("unread-noti").addClass("read-noti");
		$scope.allNotification[id].is_read = 1;
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notificationId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
		});
	};

	//TODO for service 
	$scope.markAsUnread = function(tag, id, notificationId) {
		$("#"+tag+"-"+ id).removeClass("read-noti").addClass("unread-noti");
		$scope.allNotification[id].is_read = 0;
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notificationId;
		// ProfileService.markReadNotification(opts, function(data) {
		// 	$rootScope.getCountOfAllTypeNotificaton();
		// });
	};

	$scope.viewClubDetail = function(clubId, notiId, clubType) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
			$location.path("/club/view/"+clubId+"/"+clubType);
		});
	};

	$scope.viewUserAlbum = function(albumId, notiId, albumTitle) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
				$location.path("/album/images/"+albumId+"/"+albumTitle);
			} else {
				$location.path("/album/images/"+albumId+"/"+albumTitle);
			}
		});
	};

	$scope.viewClubAlbum = function(clubId, albumName, albumId, clubType, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
				$location.path("/album/club/view/"+clubId +"/"+albumId+"/"+clubType+"/"+albumName);
			} else {
				$location.path("/album/club/view/"+clubId +"/"+albumId+"/"+clubType+"/"+albumName);
			}
		});
	};

	$scope.viewShopAlbum = function(shopId, albumTitle, albumId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
				$location.path("/album/shop/image/"+albumId+"/"+albumTitle+"/"+shopId);
			} else {
				$location.path("/album/shop/image/"+albumId+"/"+albumTitle+"/"+shopId);
			}
		});
	};
	
	$scope.viewPost = function(postId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
				$location.path("/post/"+postId);
			} else {
				$location.path("/post/"+postId);
			}
		});
	};

	$scope.viewClubPost = function(postId, clubId, notiId, clubType) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
			$location.path('/club/'+clubId+'/post/'+postId+'/'+clubType);
		});
	};

	$scope.viewShopPost = function(postId, shopId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			$rootScope.getCountOfAllTypeNotificaton();
			$location.path('/shop/'+shopId+'/post/'+postId);
		});
	};

	$scope.viewTaggedMedia = function(photoId, notiId) {
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();
		opts.notification_id = notiId;
		ProfileService.markReadNotification(opts, function(data) {
			if(data.code == 101) {
				$rootScope.getCountOfAllTypeNotificaton();
			} else {
			}
		});
	};

    $scope.viewTxnPage = function(txnId, shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            var shopTransationObj = {};
            shopTransationObj.tab = 2;
            shopTransationObj.txnId = txnId;
            ShopTransactionService.setTransactionTab(shopTransationObj);
            $rootScope.getCountOfAllTypeNotificaton();
            $location.path('/shop/transaction/'+shopId);
            } else {
            }
        });
    };

    $scope.viewShopProfile = function(shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
            $location.path('/shop/view/'+shopId);
            } else {
            }
        });
    };

    $scope.viewCitizenProfile = function(userId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
            $location.path('/wallets');
            } else {
            }
        });
    };

    $scope.viewShopPromotions = function(shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
            $location.path('/shop/promotions/'+shopId);
            }
        });
    };

    $scope.viewShopPendingPayment = function(shopId, notiId) {
        opts = {};
        opts.user_id = (APP.currentUser.id).toString();
        opts.notification_id = notiId;
        ProfileService.markReadNotification(opts, function(data) {
            storeShopHistorySelection.setPenPaymentMethod(true);
            if(data.code == 101) {
            $rootScope.getCountOfAllTypeNotificaton();
                $location.path('/shop/wallet/'+shopId);
            }else {
                $location.path('/shop/wallet/'+shopId);
            }
        });
    };
    
}]);

//Get all the list for club request 
app.controller('AllClubReNotificationView', ['$cookieStore', '$scope', '$rootScope', '$http', '$location', '$timeout', 'ProfileService', 'GroupService', function($cookieStore, $scope, $rootScope, $http, $location, $timeout, ProfileService, GroupService) {
	$scope.loadGroupNotificationList = false;
	$scope.groupNotificationFound = false;
	$scope.groupNotiResponse = 1;
	$scope.allGroupNotification = [];
	$scope.allTotal = 0;
	$scope.endLimit = 12;
	
	$scope.getAllGroupNotification = function() {
		var limit_start = $scope.allGroupNotification.length;
		opts = {};
		opts.user_id = (APP.currentUser.id).toString();;
		opts.is_view = '1';
		opts.limit_start = limit_start;
		opts.limit_size = $scope.endLimit;
		if ((( $scope.allTotal > limit_start) || $scope.allTotal == 0 ) && $scope.groupNotiResponse == 1) {
			$scope.loadGroupNotificationList = true;
			$scope.groupNotiResponse = 0;
			ProfileService.getAllGroupNotification(opts, function(data) {
				$scope.groupNotiResponse = 1;
				$scope.groupNotificationFound = true;
				if(data.code == 101) {
					$scope.allGroupNotification = $scope.allGroupNotification.concat(data.data.requests);
					$scope.allTotal = data.data.size;
					$scope.loadGroupNotificationList = false;
				}else {
		 			$scope.allGroupNotification = [];
		 			$scope.allTotal = 0;
		 			$scope.loadGroupNotificationList = false;
				}
			});
		}
	};
	$scope.getAllGroupNotification();

	$scope.loadMore = function() {
		$scope.getAllGroupNotification();
	}

    $scope.AcceptClubRequest = function(senderId, requestId, groupId, groupType, id) {        
		$("#notification-request-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
		if(groupType == 1)
			opts.request_type = 'admin';
		else
			opts.request_type = 'user';
        opts.response = 1;
        GroupService.responseClubNotification(opts, function(data) {
		       if(data.code == 101) {
				$("#notification-request-" + id).hide();
				$rootScope.getCountOfAllTypeNotificaton();
			} else {
				$("#notification-request-" + id).show();
			}
		});
	};

    $scope.RejectClubRequest = function(senderId, requestId, groupId, groupType, id) {
		$("#notification-request-" + id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.sender_id = senderId;
        opts.group_id = groupId;
		if(groupType == 1)
			opts.request_type = 'admin';
		else
			opts.request_type = 'user';
        opts.response = 2;
		GroupService.responseClubNotification(opts, function(data) {
			if(data.code == 101) {
				$("#notification-request-" + id).hide();
				$rootScope.getCountOfAllTypeNotificaton();
			} else {
				$("#notification-request-" + id).hide();
			}
		});
	};
}]);

//Club request and reject
app.controller('ClubRequestAction', ['$cookieStore', '$scope', '$rootScope', '$http', '$routeParams', '$location', 'GroupService', function($cookieStore, $scope, $rootScope, $http, $routeParams, $location, GroupService) {
	$scope.requestLoader = true;
	$scope.notAccesssible = false;
	opts = {};
	opts.user_id = APP.currentUser.id;
    opts.request_id = $routeParams.notiId;
    opts.sender_id = $routeParams.senderId;
    opts.group_id = $routeParams.clubId;
	if($routeParams.clubType == 1)
		opts.request_type = 'admin';
	else
		opts.request_type = 'user';
    opts.response = $routeParams.action;
    GroupService.responseClubNotification(opts, function(data) {
    	if(data.code == 182) {
    		$scope.requestLoader = false;
    	} else {
    		if($routeParams.clubType == 2 && $routeParams.action == 2){
    			$scope.requestLoader = false;
    			$scope.notAccesssible = true;
    		} else {
    			$location.path("/club/view/"+$routeParams.clubId+"/"+$routeParams.clubType);
    		}
    	}
	});

}]);

app.controller('PendingPaymentFromNoti', ['$cookieStore', '$scope', '$rootScope', '$http', '$location', '$timeout', '$routeParams', 'LandURL', 'storeShopHistorySelection', function($cookieStore, $scope, $rootScope, $http, $location, $timeout, $routeParams, LandURL, storeShopHistorySelection) {
    storeShopHistorySelection.setPenPaymentMethod(true);
    $location.path('/shop/wallet/'+$routeParams.shopId);
}]);
