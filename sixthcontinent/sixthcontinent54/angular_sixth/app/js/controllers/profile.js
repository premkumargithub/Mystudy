app.controller('ProfileController',['$cookieStore', '$rootScope', '$scope', '$http', '$location', '$timeout', '$interval', '$routeParams', '$modal', '$log', 'UserService', 'ProfileService', 'fileReader', 'threadAndPass', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $interval, $routeParams, $modal, $log, UserService, ProfileService, fileReader, threadAndPass) {
	//$('#retrieveFromDatabase').linkPreviewRetrieve();
   var latitudeMap = 0;
   var longitudeMap = 0;
   $('.nav li').removeClass('active');
   $('.home').addClass('active');

   $('.nav li').click(function() {
   		$('.nav li').removeClass('active');
   		$(this).addClass('active');
   });
   
   $('.dropdown-menu li').click(function() {
   		$('.nav li').removeClass('active');
   		
   });   

	$scope.editUser = {};
	$scope.renderProfile = false;
	$scope.friendProfile = false;
	$scope.requestSend = true;
	$scope.alreadtSend = true;
	$scope.broker = 0;
	$scope.userDetails = "";
	
	$scope.getUserProfile = function(profileType){
		var opts = {};
		$scope.editMessage = "";
		opts.user_id = APP.currentUser.id;
		opts.profile_type = profileType;
		ProfileService.getProfile(opts, function(data) {
			$scope.userDetails = data.data;
			$scope.renderProfile = true;
		});
	};

	
	$scope.deleteProfile = function() {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		ProfileService.deleteProfile(opts, function(data) {
			
		});
	};
	$scope.searchFrind ='';
	var DELAY_TIME_BEFORE_POSTING = 300;
	//var element = $('#search');
    var currentTimeout = null;

    $('#search').keydown(function() {
    
      var model = $scope.searchFrind;
      //var poster = model($scope);
      if(currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
      currentTimeout = $timeout(function(){
        $scope.searchUser();
      }, DELAY_TIME_BEFORE_POSTING)
      });
  
    
	$scope.userList = [];
	$scope.cancelRequest = 0;
	$scope.showList = false;
	$scope.searchUser = function() {
		$scope.showList = true;
		$scope.cancelRequest = 0;
            $scope.albloader = true;
		var opts = {};
        if($scope.searchFrind.length >= 3){
			opts.user_id = APP.currentUser.id;
			opts.friend_name = $scope.searchFrind;
			opts.limit_start = APP.user_list_pagination.start;
			opts.limit_size = APP.user_list_pagination.end; 
			ProfileService.searchAllProfile(opts, function(data) {
				if( $scope.cancelRequest == 0 ){
					$scope.userList = [];
            		if(data.code == 101 ) {
						if(data.data.count != 0){
			                $scope.userList = [];
			                $scope.albloader = false;
			                $scope.userList = $scope.userList.concat(data.data);  
			            }else {
			                $scope.showList = false;
			            }	
			        }else{
		               $scope.albloader = false;
					}
				}else{

				}
			});
		}else{
			$scope.showList = false;
			$scope.userList = [];
			$scope.userList.slice();
			$scope.cancelRequest = 1;
		}
	};

	$scope.clearList = function(name){
		stop = $interval(function() {
			$scope.cancelRequest = 1;
			$scope.showList = false;
			if(name !== 'blank'){
				$scope.searchFrind = name;
			}
		}, 1000,1);
	}

	//TODO: test
	$scope.searchFriend = function() {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_name = "liju"; //TODO
		opts.session_id = APP.currentUser.id;
		opts.limit_start = APP.user_list_pagination.start;
		opts.limit_size = APP.user_list_pagination.end; 
		ProfileService.searchFriend(opts, function(data) {
			
		});
	};

	$scope.showAllFriend = function(post_id, creater_info, allTagFriend){
		$scope.allTagFriends = allTagFriend;
		//$scope.currentUser = APP.currentUser;
		$scope.post_id = post_id;
		$scope.creater = creater_info;
		var modalInstance = $modal.open({
            template: '<div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a ng-href="#/viewfriend/{{friend.id}}">{{friend.first_name}} {{friend.last_name}}</a><span class="frnd-details"><a href>{{friend.about_me}}</a></span></span><span data-ng-if="creater.id === currentUser.id || currentUser.id === friend.id" ng-click="RemoveTagFriend(friend, creater.id)" class="rmv-tag"><a href>{{i18n.profile_post.remove_tagged_friend}}</a></span></li></ul></div><div class="modal-footer"></div>',
            controller: 'ModalController',
            size: 'lg',
            scope: $scope,
        });

		modalInstance.result.then(function (selectedItem) {
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
		$scope.RemoveTagFriend = function(friend, createrId){
			var opts = {};
			opts.user_id = APP.currentUser.id;
			opts.untag_user_id = friend.id;
			opts.post_id = $scope.post_id;
			ProfileService.removeTagedFriends(opts,function(data){
				if(data.code === 101){
					var index = $scope.allTagFriends.indexOf(friend)
					$scope.allTagFriends.splice(index,1);
					if(createrId != APP.currentUser.id ){
						modalInstance.close();
					}
					if($scope.allTagFriends.length === 0){
						modalInstance.close();
					}	
				} 
			});
		};
	};

	// checking tagged friend
	$scope.validate = false;
	$scope.checkTagUser = function(allTaggedFriend){
		$scope.tagInfo = allTaggedFriend;
		$scope.validate = false;
		angular.forEach($scope.tagInfo,function(index){
			if(index.id === APP.currentUser.id){
				$scope.validate = true;
			}
		});

		if($scope.validate === true){
			return true;
		}
	};

    $(".fancybox").fancybox();
}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

//Controller to handle the profile related notifications
app.controller('ProfileNotiController', ['$cookieStore', '$scope', '$http', '$location', '$timeout', 'ProfileService', '$rootScope', 'storeHistorySelection', 'OfferService', function($cookieStore, $scope, $http, $location, $timeout, ProfileService, $rootScope, storeHistorySelection, OfferService) {
	$scope.NotificationFound = false;
	$scope.NotificationNotFound = false;
	$scope.OffersForMeCount = 0;
	
	$scope.getOffersForMeCount = function(){
		myofferopts = {"function" : "SixcServices.offerForMe","parameters":[{"citizen_id":String(APP.currentUser.id),"count":true,"$filter":{"start_date" : {"$lte":"$$CurrentDate"},"end_date" : {"$gte":"$$CurrentDate"},"offer_type":{"$in":["551ce49e2aa8f00f20d9328f","551ce49e2aa8f00f20d93295"]}}}]};
		OfferService.getApplaneInvoke(myofferopts, function(data){
			if(data.response === undefined || data.response === ''){}else {
                if(data.response.myOffer.result.length === 0){}else{
                	$scope.OffersForMeCount = data.response.myOfferCount.result[0].count;
                }
            }    
		});	
	};
	$scope.getOffersForMeCount();

	$(document).click(function(){
		$scope.$apply(function() {
   			$rootScope.groupNotificationList = false;
			$rootScope.showNewMessageList = false;
			$rootScope.showNotificationList = false;
			$rootScope.showFriendNotificationList = false;
			$rootScope.loadGroupNotification = false;
	  		$scope.scopeVar2 = false;
	   		$scope.scopeVar  = false;
	     	$scope.scopeVar1 = false;
			$scope.scopeVar3 = false;
        });  
	});


	$scope.getNotification = function() {
		$scope.NotificationFound = false;
		$scope.NotificationNotFound = false;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.limit_start = 0;
		opts.limit_size = 12;
		ProfileService.getPendingFreindReq(opts, function(data) {
			if(data.code == 101) {
				if(data.data.length != 0) {
					$scope.FriendRequests = data.data;
					$scope.NotificationFound = true;
				} else {
					$scope.NotificationNotFound = true;
				}
			} else {
				$scope.NotificationNotFound = true;
			}
		});
	};

	//$scope.getNotification();
	$scope.AcceptRequest = function(friendId) {
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendId;
		opts.action = "1";
		ProfileService.acceptFriendRequest(opts, function(data) {
			if(data.code == 101) {
				$scope.getNotification();
			} else {

			}
		});
	};

	$scope.RejectRequest = function(friendId, id) { 
		$("#notii-"+id).fadeOut(1000);
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendId;
		opts.action = "0";
		ProfileService.rejectFriendRequest(opts, function(data) {
			if(data.code == 101) {
				$scope.getNotification();
			} else {

			}
		});
	};

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth();
	var yr = today.getFullYear();
	var date = new Date(yr,mm,dd);
	var newdate = new Date(date);
	newdate.setDate(newdate.getDate() + 1);
	var nd = new Date(newdate);
	//get today credit on right panel
	$scope.getTodayCredit = function() { 
		opts = {};
		//opts = {"$collection":String(APP.applaneTables.today_credit),"$group":{"credit":{"$sum":"$credit"},"_id":null,"$fields":false},"$filter":{"citizen_id":String(APP.currentUser.id),"date":{"$gte":"2015-04-24T00:00:00.000Z","$lt":"2015-04-25T00:00:00.000Z"}},"$skip":0};
		opts = {"$collection":String(APP.applaneTables.today_credit),"$group":{"credit":{"$sum":"$credit"},"_id":null,"$fields":false},"$filter":{"citizen_id":String(APP.currentUser.id),"__history.__createdOn":{"$gte":String(date.toISOString()),"$lt":String(nd.toISOString())}},"$skip":0}
		ProfileService.getTodayCredit(opts, function(data) {
			if(data.response === undefined || data.response.result === '' ||data.response.result.length < 1){
				$scope.todayCredit = 0.00;
			} else {
				$scope.todayCredit = data.response.result[0].credit;
			}
		});
	};
	$scope.getTodayCredit();

	$scope.storeSelection = function(){
		storeHistorySelection.storeTodayYouGain();
	};
}]);

app.controller('passwordChangeController',['$cookieStore', '$scope', '$http', '$location', '$timeout', '$interval', '$routeParams', 'ProfileService', function($cookieStore, $scope, $http, $location, $timeout, $interval, $routeParams, ProfileService) {
	$scope.changeLoder = true;
	$scope.changePassword = function(){
		var opts = {};
		if($scope.previousPassword == undefined || $scope.previousPassword == ''){
			$scope.changeMessage = $scope.i18n.passchange.old_password;
			$scope.msgClass = 'login-error text-red text-center display-block-inline';
			$timeout(function(){
                $scope.changeMessage = '';
            }, 8000);
			return false;
		} else if($scope.oldPassword == undefined || $scope.oldPassword == ''){
			$scope.changeMessage = $scope.i18n.passchange.new_password;
			$scope.msgClass = 'login-error text-red text-center display-block-inline';
			$timeout(function(){
                $scope.changeMessage = '';
            }, 8000);
			return false;
		} else if($scope.newPassword == undefined || $scope.newPassword == '') {
			$scope.changeMessage = $scope.i18n.passchange.retype_password;
			$scope.msgClass = 'login-error text-red text-center display-block-inline';
			$timeout(function(){
                $scope.changeMessage = '';
            }, 8000);
			return false;
		} else if($scope.newPassword  !== $scope.oldPassword){
			$scope.changeMessage = $scope.i18n.passchange.password_mismatch;
			$scope.msgClass = 'login-error text-red text-center display-block-inline';
			$timeout(function(){
                $scope.changeMessage = '';
            }, 8000);
			return false;
		}
		opts.user_id = APP.currentUser.id;
		opts.old_password = $.base64.encode($scope.previousPassword);
		opts.password1 = $.base64.encode($scope.oldPassword);
		opts.password2 = $.base64.encode($scope.newPassword);
		$scope.changeLoder = false;
		ProfileService.changePassword(opts, function(data) {
			if(data.code == 101){
				$scope.changeLoder = true;
				$scope.msgClass = 'text-success text-center display-block-inline';
				$scope.changeMessage = $scope.i18n.passchange.updated_password;
				$timeout(function(){
                $scope.changeMessage = '';
                }, 8000);
			}else if (data.code == 139) {
				$scope.changeLoder = true;
				$scope.msgClass = 'login-error text-red text-center display-block-inline';
				$scope.changeMessage = $scope.i18n.validation.password_not_blank;
				$timeout(function(){
                $scope.changeMessage = '';
                }, 8000);
			}else if (data.code == 138) {
				$scope.changeLoder = true;
				$scope.msgClass = 'login-error text-red text-center display-block-inline';
				$scope.changeMessage = $scope.i18n.validation.password_not_match;
				$timeout(function(){
                $scope.changeMessage = '';
                }, 8000);
			} else if(data.code == 174){
				$scope.changeLoder = true;
				$scope.msgClass = 'login-error text-red text-center display-block-inline';
				$scope.changeMessage = $scope.i18n.validation.password_not_match;
				$timeout(function(){
                $scope.changeMessage = '';
                }, 8000);
			}else if (data.code == 100) {
				$scope.changeLoder = true;
				$scope.msgClass = 'login-error text-red text-center display-block-inline';
				$scope.changeMessage = $scope.i18n.validation.account_inactive;
				$timeout(function(){
                $scope.changeMessage = '';
                }, 8000);
			} else if (data.code == 96) {
				$scope.changeLoder = true;
				$scope.msgClass = 'login-error text-red text-center display-block-inline';
				$scope.changeMessage = $scope.i18n.validation.error_occured;
				$timeout(function(){
                $scope.changeMessage = '';
                }, 8000);

			} else {
				$scope.changeLoder = true;
				$scope.msgClass = 'login-error text-red text-center display-block-inline';
				$scope.changeMessage = data.message;
				$timeout(function(){
                $scope.changeMessage = '';
                }, 8000);
			}
		});
	}
	$scope.go = function( path ) {
		$location.path( path );
	};
}]);

/**
* Controller to display the friends profile detail
*
*/
app.controller('FriendProfile',['$cookieStore', '$scope', '$http', '$location', '$timeout', '$interval', '$routeParams', '$modal', '$log', '$rootScope', 'ProfileService','AlbumService','AffiliatedkService', function($cookieStore, $scope, $http, $location, $timeout, $interval, $routeParams, $modal, $log, $rootScope, ProfileService,AlbumService,AffiliatedkService) {
	$scope.friendViewLoader = true;
	// $scope.sendFriendRequestLoader = false;
	$scope.months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' }
  ];
  $scope.sendFriendRequestLoader = false;
    $scope.showRequestButton = false;
    $scope.addFriend_personal    = false;
    $scope.requestSent_personal  = false;
    $scope.IsFriend_personal     = false;
    $scope.respond_personal      = false;
    $scope.addFriend_professional    = false;
    $scope.requestSent_professional  = false;
    $scope.IsFriend_professional     = false;
    $scope.respond_professional      = false;
	
	$scope.showButton = true;
	if($( window ).width() <= 768){
		$scope.showButton = false;
	}		
   /*
   $scope.RespontToRequest_personal = function(){
   		$("#RespontToRequest_personal").click(function(){
   			$(".request-links-personal").slideToggle('slow');
   		});
   };

   $scope.RespontToRequest_professional = function(){
   		$("#RespontToRequest_professional").click(function(){
   			$(".request-links-professional").slideToggle('slow');
   		});
   };
   $scope.showRequestButton = false;
   $scope.addFriend_personal   	= false;
   $scope.requestSent_personal 	= false;
   $scope.IsFriend_personal 	= false;
   $scope.respond_personal 		= false;
   $scope.addFriend_professional   	= false;
   $scope.requestSent_professional 	= false;
   $scope.IsFriend_professional 	= false;
   $scope.respond_professional 		= false;

	$scope.RejectRequest = function(request_type) {
		if(request_type === 1){
			$scope.sendPersonalRequestLoader = true;
		}else if(request_type === 2){
			$scope.sendProfessionalRequestLoader = true;
		}
   		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = $routeParams.friendId;
		opts.action = '0';
		opts.request_type = request_type; 
		ProfileService.rejectFriendRequest(opts, function(data) {
			if(data.code == 101) {
				if(request_type === 2){
					$scope.addFriend_professional   = true;
					$scope.respond_professional = false;
					$scope.sendProfessionalRequestLoader = false;
				}else if(request_type === 1){
					$scope.addFriend_personal   = true;
					$scope.respond_personal = false;
					$scope.sendPersonalRequestLoader = false;
				}
				$rootScope.getAllNotification();
				$rootScope.getAllFriendNotification();
			} else {
				
			}
		});
	};
    
    $scope.AcceptRequest = function(request_type) {
    	if(request_type === 1){
			$scope.sendPersonalRequestLoader = true;
		}else if(request_type === 2){
			$scope.sendProfessionalRequestLoader = true;
		}
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = $routeParams.friendId;
		opts.action = "1";
		opts.request_type = request_type; 
		ProfileService.acceptFriendRequest(opts, function(data) {
			if(data.code == 101) {
				if(request_type === 2){
					$scope.IsFriend_professional   = true;
					$scope.respond_professional = false;
					$scope.sendProfessionalRequestLoader = false;
				}else if(request_type === 1){
					$scope.IsFriend_personal   = true;
					$scope.respond_personal = false;
					$scope.sendPersonalRequestLoader = false;
				}
				$rootScope.getAllNotification();
				$rootScope.getAllFriendNotification();
			} else {
				
			}
		});
	};
	
$scope.viewFriendProfile = function() {
  $scope.searchFrind = '';
  $('#search').val('');
  var opts = {};
  opts.user_id = APP.currentUser.id;
  opts.friend_id = $routeParams.friendId;
  ProfileService.friendProfileView(opts, function(data) {
  	$scope.showRequestButton = true;
   if(data.code == 101) {
    if(data.data.user_id == APP.currentUser.id) {
		$location.path('timeline/'+data.data.user_id);
    }
    $scope.friendProfile = data.data;
    
    if(($scope.friendProfile.user_info.friend_type == 0 || $scope.friendProfile.user_info.friend_type == 2) &&  $scope.friendProfile.user_info.personal_pending == 0 && ($scope.friendProfile.friend_request_type == 0 || $scope.friendProfile.friend_request_type == 2)){
        $scope.addFriend_personal   = true;
	}
	if(($scope.friendProfile.user_info.friend_type == 0 || $scope.friendProfile.user_info.friend_type == 1) &&  $scope.friendProfile.user_info.professional_pending == 0 && ($scope.friendProfile.friend_request_type == 0 || $scope.friendProfile.friend_request_type == 1)){
        $scope.addFriend_professional   = true;
	}
	if($scope.friendProfile.user_info.personal_pending == 1){
        $scope.requestSent_personal   = true;
	}
	if($scope.friendProfile.user_info.professional_pending == 1){
        $scope.requestSent_professional   = true;
	}
	if($scope.friendProfile.user_info.friend_type == 1 || $scope.friendProfile.user_info.friend_type == 3){
        $scope.IsFriend_personal   = true;
	}
	if($scope.friendProfile.user_info.friend_type == 2 || $scope.friendProfile.user_info.friend_type == 3){
        $scope.IsFriend_professional   = true;
	}
	if(($scope.friendProfile.friend_request_type == 1 || $scope.friendProfile.friend_request_type == 3) && $scope.friendProfile.user_info.friend_type != 1 && $scope.friendProfile.user_info.friend_type != 3){
        $scope.respond_personal   = true;
    }
	if(($scope.friendProfile.friend_request_type == 2 || $scope.friendProfile.friend_request_type == 3) && $scope.friendProfile.user_info.friend_type != 2 && $scope.friendProfile.user_info.friend_type != 3){
        $scope.respond_professional   = true;
	}

    for(var i =0; i<=11 ; i++){
    	if(data.data.user_info.date_of_birth != null) {
		    if(data.data.user_info.date_of_birth.date.substring(5,7) == i){    	
		      $scope.birthmonth = $scope.months[i-1].name; 
		     }
	 	} else {
	 		$scope.birthmonth = '';
	 		$scope.comma = '';
	 	}
    }
    if(data.data.user_info.skills !== null && data.data.user_info.skills.length > 0){
                       $scope.tempskills = data.data.user_info.skills.split(',');
     }
    if(data.data.user_info.skills !== null && data.data.user_info.skills.length > 0){     
        for(var i=0;i<$scope.tempskills.length;i++) {
            $scope.tempobj={"name":$scope.tempskills[i] };
            $scope.skillobj.push($scope.tempobj);
      }
     }
     $scope.personaledu = false;
     $scope.professionedu = false;
     $scope.personaljob = false;
     $scope.professionjob = false;
    if($scope.friendProfile.user_info.educationDetail != null && $scope.friendProfile.user_info.educationDetail != "" && $scope.friendProfile.user_info.educationDetail != undefined){
     for(var i=0; i<$scope.friendProfile.user_info.educationDetail.length; i++){
      if($scope.friendProfile.user_info.educationDetail[i].visibility_type == 1 || $scope.friendProfile.user_info.educationDetail[i].visibility_type == 3){
       $scope.personaledu = true;
      }
      if($scope.friendProfile.user_info.educationDetail[i].visibility_type == 2 || $scope.friendProfile.user_info.educationDetail[i].visibility_type == 3){
       $scope.professionedu = true;
      }
     }
    }
    if($scope.friendProfile.user_info.jobDetails != null && $scope.friendProfile.user_info.jobDetails != "" && $scope.friendProfile.user_info.jobDetails != undefined){
     for(var i=0; i<$scope.friendProfile.user_info.jobDetails.length; i++){
      if($scope.friendProfile.user_info.jobDetails[i].visibility_type == 1 || $scope.friendProfile.user_info.jobDetails[i].visibility_type == 3){
       $scope.personaljob = true;
      }
      if($scope.friendProfile.user_info.jobDetails[i].visibility_type == 2 || $scope.friendProfile.user_info.jobDetails[i].visibility_type == 3){
       $scope.professionjob = true;
      }
     }
    }
    var opts1 = {};
    opts1.sender_id = APP.currentUser.id;
    opts1.to_id = $scope.friendProfile.user_id;
    ProfileService.checkfollowUser(opts1, function(data1) {
     if(data1.code == 151 || data1.is_follow == 1) {
      $scope.followUser = false;
     } 
     if(data1.code == 152 || data1.is_follow == 0) {
      $scope.followUser = true;
     } 
    });

    //friend profile all details 
    var copts = {};
    var connectedProfile = {};
    copts.user_id = $routeParams.friendId;
    ProfileService.getConnectedProfil(copts, function(data) {
        if(data.code = 101)
            $scope.friendProfile.connectedProfile = data.data;

        $scope.friendViewLoader = false;
    });
   } else {
    $scope.friendViewLoader = false;
   }
  });
 };
 
	$scope.viewFriendProfile();
*/
	    // Start function for the show album in profile page
        $scope.loaduseralbumimages =function(){
        $scope.noalbumimages = false;
        var opts = {};
        opts.user_id = $scope.currentUser.id;
        opts.friend_id = $routeParams.friendId;
		opts.limit_start = 0; 
		opts.limit_size = 4;

        AlbumService.albumListing(opts, function(data){
            if(data.code == 101) {
                $scope.userlatestalbum =  data.data.albums;
                if($scope.userlatestalbum.length == 0 ){
                	$scope.noalbumimages = true;
                }

            } else {
                $scope.userlatestalbum = '';
            }
            });
    };
    
      // End function for the show album in profile page
	$scope.loaduseralbumimages();
	//Get Affilicate counts
    $scope.getAffiliateCounts = function() {  
        var opts = {};
        opts.user_id = $routeParams.friendId;
        opts.session_id = APP.currentUser.id;  

        AffiliatedkService.getAllcounts(opts, function(data) {
            if(data.code == 101) {
                $scope.totalCounts = data.data;
            } 
        });
    };
        $scope.redirectUrl = function(album_id, album_name ,id) {
       if(album_name == '') {
           album_name = 'Untitled';
           $location.path(id +"/friend/images/"+album_id+"/"+album_name);
        }
        else {
           $location.path(id+ "/friend/images/"+ album_id+"/"+album_name); 
        }
    }
    $scope.getAffiliateCounts();
	$scope.pendingProfessional = false;
	$scope.pendingPersonal = false;
	$scope.sendFriendRequests = function(friendId, id) {
		var modalInstance = $modal.open({
		                        template: '<div id="friendModal"class="modal-header"> <h3 class="modal-title">{{i18n.friends.send_request}}</h3> </div><div class="modal-body"><ul><li><div class="friend-req-block"><span class="req-img"><img alt="" ng-if="friendProfile.user_info.profile_image_thumb != \'\'" src="{{friendProfile.user_info.profile_image}}"><img alt="" ng-if="friendProfile.user_info.profile_image_thumb == \'\'" src="app/assets/images/prof-pic.jpg"></span ><span class="req-frnd-content"><span class="req-frnd-name">{{(friendProfile.user_info.first_name+\' \'+friendProfile.user_info.last_name).length>19?((friendProfile.user_info.first_name+\' \'+friendProfile.user_info.last_name) | limitTo: 16)+\'...\':(friendProfile.user_info.first_name+\' \'+friendProfile.user_info.last_name)}}</span><span class="req-frnd-tagline">{{i18n.friends.add_as_friend}}</span><span class="req-view-page"><span class="viewlabel"></span><div class="register-sixth-two-half"> <div class="register-sixth-one-radio" data-ng-show="friendProfile.user_info.friend_type != 1"> <div class="shipping_input_radio"> <input type="radio" name="viewIn" value="Per" id="select_per" class="register-sixth-radio" data-ng-model="friendType"> <label for="select_per"><span>{{i18n.friends.add_as_personal}}</span></label> </div><label for="select_per">{{i18n.friends.add_as_personal}}<label> </label></label></div><div class="register-sixth-two-radio" data-ng-show="friendProfile.user_info.friend_type != 2"> <div class="shipping_input_radio"> <input type="radio" name="viewIn" value="pro" id="select_pro" class="register-sixth-radio" data-ng-model="friendType"> <label for="select_pro"><span>{{i18n.friends.add_as_professional}}</span></label> </div><label for="select_pro">{{i18n.friends.add_as_professional}}</label> </div></span></span></div></li></ul></div><div class="modal-footer"> <button class="btn btn-primary" ng-click="addFriend(friendType)" data-ng-hide="sendFriendRequestLoader">{{i18n.friends.send_button}}</button><img class="sent-requestloading" data-ng-show="sendFriendRequestLoader" src="app/assets/images/proceed.gif" alt="{{i18n.friends.loading}}..." /></div>',
		                        controller: 'ModalController',
		                        size: 'lg',
		                        scope: $scope,
		                    });

		modalInstance.result.then(function (selectedItem) {
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

		$scope.cancel = function() {
			modalInstance.close();
        };

        /*$scope.$on('$destroy', function() {
            modalInstance.remove();
        });*/
        
        $scope.addFriend = function(type){
        	if(type === undefined || type === null || type === '' ){
        		return false;
        	}
        	$scope.sendFriendRequestLoader = true;
			var opts = {};
			opts.user_id = APP.currentUser.id;
			opts.friend_id = $routeParams.friendId;
			opts.msg = "Friend Request";
			var friendType;
			if(type ===  'Per'){
				opts.request_type = 1;
			}else if(type ===  'pro'){
				opts.request_type = 2;
			}
			ProfileService.sendFriendRequests(opts, function(data) {
				if(data.code == 101){
					$scope.friendProfile.is_friend = 2;
					$scope.sendFriendRequestLoader = false;
					modalInstance.close();
					if(type === 'pro'){
						$scope.friendProfile.user_info.professional_pending = 1;
					}else if(type === 'Per'){
						$scope.friendProfile.user_info.personal_pending = 1;
					}
				}else if(data.code == 109){
					$scope.friendProfile.is_friend = 2;
					$scope.sendFriendRequestLoader = false;
					modalInstance.close();
					$scope.friendProfile.is_sent = 1;
				}
			});
        };
	};
/*
	$scope.sendPersonalRequestLoader = false;
	$scope.sendProfessionalRequestLoader = false;
	$scope.addFriend = function(type){
        	
			var opts = {};
			opts.user_id = APP.currentUser.id;
			opts.friend_id = $routeParams.friendId;
			opts.msg = "Friend Request";
			var friendType;
			if(type ===  1){
				opts.request_type = 1;
				$scope.sendPersonalRequestLoader = true;
			}else if(type ===  2){
				opts.request_type = 2;
				$scope.sendProfessionalRequestLoader = true;
			}
			ProfileService.sendFriendRequests(opts, function(data) {
				if(data.code == 101){
					$scope.friendProfile.is_friend = 2;
					$scope.sendFriendRequestLoader = false;
					if(type === 2){
						$scope.friendProfile.user_info.professional_pending = 1;
						$scope.addFriend_professional   = false;
						$scope.requestSent_professional   = true;
						$scope.sendProfessionalRequestLoader = false;
					}else if(type === 1){
						$scope.friendProfile.user_info.personal_pending = 1;
						$scope.addFriend_personal   = false;
						$scope.requestSent_personal   = true;
						$scope.sendPersonalRequestLoader = false;
					}
				}else if(data.code == 109){
					$scope.friendProfile.is_friend = 2;
					$scope.sendFriendRequestLoader = false;
					$scope.friendProfile.is_sent = 1;
					$scope.sendProfessionalRequestLoader = false;
					$scope.sendPersonalRequestLoader = false;
				}
			});
        };


	$scope.removeFriend = function(friendDetail,type) { 
		$scope.sendFriendRequestLoader = true;
		opts = {};
		opts.user_id = APP.currentUser.id;
		opts.friend_id = friendDetail.user_id;
		opts.action = "0";
		opts.request_type = type;
		if(type === 1){
			$scope.sendPersonalRequestLoader = true;
		}else if(type === 2){
			$scope.sendProfessionalRequestLoader = true;
		}
		ProfileService.rejectFriendRequest(opts, function(data) {
			if(data.code == 101) {
				
				$scope.sendFriendRequestLoader = false;
				if(type === 2){
					$scope.friendProfile.user_info.friend_type = $scope.friendProfile.user_info.friend_type - 2;
					$scope.sendProfessionalRequestLoader = false;
					$scope.addFriend_professional = true;
					$scope.IsFriend_professional =false;
				}else if(type === 1){
					$scope.friendProfile.user_info.friend_type = $scope.friendProfile.user_info.friend_type - 1;
					$scope.sendPersonalRequestLoader = false;
					$scope.addFriend_personal = true;
					$scope.IsFriend_personal=false;
				}
				if($scope.friendProfile.user_info.friend_type === 0){
					$scope.friendProfile.is_friend =  0;
				}
			} else {
				$scope.friendProfile.is_friend = 0;
				$scope.sendFriendRequestLoader = false;
			}
		});
	};*/
	// $scope.followRequestLoader = false;
	// $scope.followFriend = function(friendId) {
	// 	$scope.followRequestLoader = true;
	// 	var opts = {};
	// 	opts.sender_id = APP.currentUser.id;
	// 	opts.to_id = friendId;
	// 	ProfileService.followUser(opts, function(data) {
	// 		if(data.code == 101) {
	// 			$scope.followUser = false;
	// 			$scope.followRequestLoader = false;
	// 		} 
	// 	});
	// };

	// $scope.unFollowFriend = function(friendId) {
	// 	$scope.followRequestLoader = true;
	// 	var opts = {};
	// 	opts.user_id = APP.currentUser.id;
	// 	opts.friend_id = friendId;
	// 	ProfileService.unFollowUser(opts, function(data) {
	// 		if(data.code == 101) {
	// 			$scope.followUser = true;
	// 			$scope.followRequestLoader = false;
	// 		}
	// 	});
	// };
}]);


/**
* Controller to display the friend's album
*
*/
app.controller('friendAlbumController',['$scope', 'ProfileService', '$location', '$routeParams', '$timeout', function ($scope, ProfileService, $location, $routeParams, $timeout) {
//Album Listing
    $scope.friendAlbumListing = function(){ 
    	$scope.friendId = $routeParams.friendId;
    	$scope.userId = $routeParams.id;
        $scope.albloader = true;  
        var opts = {};
        opts.user_id = $routeParams.id;
        opts.friend_id = $scope.friendId;
        opts.limit_start = 0; 
        opts.limit_size = 20; 
        
        ProfileService.friendAlbumListing(opts, function(data){
              
            if(data.code == 101) {
                $scope.listAlbum = data.data;
                $scope.noAlbums = true;    
                $scope.albloader = false;    
            }else {
                $scope.albloader = false; 
            }
        });
    }
    $scope.friendAlbumListing();

    //View friend Album Images 
    $scope.friendAlbumImage = function(){
        $scope.albloader = true;
        var albumId = $routeParams.id;
        $scope.albumname = $routeParams.name;
        $scope.frndUserId = $routeParams.userId;
        var opts = {};
        opts.user_id = $routeParams.userId;
        opts.album_id = albumId;
        ProfileService.friendAlbumImage(opts, function(data){
            
            if(data.code == 101) {
                $scope.albloader = false;
                $scope.viewalbum = data.data;
                $scope.noPhotos = true;
            } else {
                $scope.albloader = false;
                $scope.noPhotos = true;
            }
        });  
    }
    $scope.friendAlbumImage();
    $(".fancybox").fancybox(); //Image Pop Up Plugin
    $scope.redirectUrl = function(album_id, album_name, userId) {
        $location.path("/friend/image/"+album_id+"/"+album_name+"/"+userId);
    }
}]);

app.controller('EditProfileController',['$scope', 'ProfileService', '$location', '$routeParams', '$timeout', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $interval, $routeParams, ProfileService, threadAndPass, fileReader) {
$scope.months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  	$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  	

  	


  	$scope.monthChange = function(){

  		if($scope.editUser.month.value <= 6){
  			if($scope.editUser.month.value % 2 == 0){
  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  			}else if($scope.editUser.month.value == 1){
  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
  			}else{
 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  			}
  		}else{
  			if($scope.editUser.month.value % 2 != 0){
  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  			}else {
 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  			}
  		}
  	}
  	$scope.getyears = function() {
		var currentYear = new Date().getFullYear();
		$scope.years = [];
		for (var i = 1970; i <= currentYear ; i++){
			$scope.years.push(i);
		}
  	}

  	$scope.getyears();
  	$scope.loadEditProfile = true;
	$scope.basicProfile = function(type){
		var opts = {};
		opts.user_id = APP.currentUser.id;
		if (type) {
			opts.profile_type = type;
		} else {
			opts.profile_type = 4;
	    }
		//$scope.editUser = {};
		ProfileService.viewMultiProfile(opts, function(data) {
			if(data.code == 101){
				//$scope.loadEditProfile = false;
				if (type == 1) {
					for(var i=0; i < APP.countries.length; i++){ 
					    if(data.data.region == APP.countries[i].name){
						    $scope.editUser.country = APP.countries[i];

					    }
					}

				} else {
					$scope.editUser.firstName = data.data.firstname;
				    $scope.editUser.lastName = data.data.lastname;
				    $scope.editUser.gender = data.data.gender;

				    for(var i=0; i < APP.countries.length; i++){ 
					    if(data.data.country.code == APP.countries[i].id){
						    $scope.editUser.country = APP.countries[i];
					    }
					}
					var currVal = data.data.date_of_birth.date;
					currVal = currVal.substring(0,10);
					var dtArray = currVal.split("-");
					var dtDay = parseInt(dtArray[2]);
					var dtMonth = parseInt(dtArray[1]);
					var dtYear = parseInt(dtArray[0]);
					$scope.editUser.year = dtYear;
					$scope.editUser.day = dtDay;			
					$scope.editUser.month = $scope.months[dtMonth-1];

				}
				$scope.broker = data.data.broker_profile;
				$rootScope.currentUser.basicProfile = data.data;

			}else{

			}
		});
	}

	//$scope.basicProfile();

	$scope.viewMultiProfile = function(profileType){
		var opts = {};
		$scope.editUser = {};
		$scope.editMessage = "";
		opts.user_id = APP.currentUser.id;
		opts.profile_type = profileType;
		ProfileService.viewMultiProfile(opts, function(data) {
			if(data.code == 101){
				if(profileType == 1){
					$scope.userDetails = data.data;
					$scope.renderProfile = true; 
					$scope.editUser.region = data.data.region;
					$scope.editUser.zip = parseInt(data.data.zip, 10);
					$scope.editUser.city = data.data.city;
					$scope.editUser.address = data.data.address;
					$scope.editUser.referral_id = data.data.referral_info.id;
					$scope.editUser.latitude = data.data.latitude;
					$scope.editUser.longitude = data.data.longitude;
					$scope.editUser.place = data.data.map_place;
					$scope.basicProfile();
					$scope.loadEditProfile = false;
					latitudeMap = data.data.latitude;
					longitudeMap = data.data.longitude;
					$timeout(function(){
						$scope.initialize();
					}, 1000)
				}else {
					$scope.editUser.phone = parseInt(data.data.phone, 10);
					$scope.editUser.vatnumber = data.data.vat_number;
					$scope.editUser.fiscalcode  = data.data.fiscal_code;
					$scope.editUser.iban  = data.data.iban;
					$scope.editUser.brokerplace = data.data.map_place;
					$scope.editUser.brokerreferral_id = data.data.referral_info.id;
					$scope.editUser.brokerlatitude = data.data.latitude;
					$scope.editUser.brokerlongitude = data.data.longitude;
					$scope.editUser.idcard = data.data.idcard;
					$scope.editUser.ssn = data.data.ssn;
					latitudeMap = data.data.latitude;
					longitudeMap = data.data.longitude;
					/*$timeout(function(){
						$scope.initializesecond();
					}, 1000);*/
				}
			}else{
				$scope.basicProfile();

			}
		});
	}
	//$scope.getUserProfile(1);
	if(JSON.stringify(APP.currentUser) != "{}"){
		$scope.viewMultiProfile(1);
		$scope.viewMultiProfile(2);
	};

	$scope.edit = true;
	$scope.brokerprofile = false;
	$scope.showTab = function(tab){
		if(tab === "edit1") {
			$('.profile-tab-container ul li').removeClass('active');
			$('.profile-tab-container ul li').eq( 0 ).addClass('active');
		}else if(tab === "edit") {
			$('.profile-tab-container ul li').removeClass('active');
			$('.profile-tab-container ul li').eq( 0 ).addClass('active');
			$scope.edit = true;
			$scope.brokerprofile = false;
			$timeout(function(){
				$scope.initialize();
			}, 1000);
		}else if(tab === "brokerprofile") {
			$('.profile-tab-container ul li').removeClass('active');
			$('.profile-tab-container ul li').eq( 1 ).addClass('active');
			$scope.edit = false;
			$scope.brokerprofile = true;
			$timeout(function(){
				$scope.initializesecond();
			}, 1000);
		}
	};
	
	$scope.getIdCardFile = function () {
		//Allow some images types for uploading
        var imageType = $scope.idCardFile['name'].substring($scope.idCardFile['name'].lastIndexOf(".") + 1);
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            $scope.editMessage = $scope.i18n.idcard.invalid_upload;
            $scope.idCardFile = null;
        } else {
			fileReader.readAsDataUrl($scope.idCardFile, $scope)
				.then(function(result) {
				  $scope.idCardFilePre = result;
				});
		}
    };
    $scope.getSsnFile = function () {
    	//Allow some images types for uploading
        var imageType = $scope.ssnFile['name'].substring($scope.ssnFile['name'].lastIndexOf(".") + 1);
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            $scope.editMessage = $scope.i18n.idcard.invalid_ssn;
            $scope.ssnFile = null;
        } else {
	        fileReader.readAsDataUrl($scope.ssnFile, $scope)
				.then(function(result) {
				  $scope.ssnFilePre = result;
				});
		}
    };

    $scope.removePreviewIdCard = function () {
		$scope.idCardFilePre = '';
		$scope.idCardFile = [];
    };
    
    $scope.removePreviewSSN = function () {
        $scope.ssnFilePre = '';
		$scope.ssnFile = [];
    };

	if(JSON.stringify(APP.currentUser) != "{}"){
		var type = $routeParams.type;
		$scope.showTab(type);
	};

	
	$scope.editMessage = "";
	$scope.showloading = false;
	$scope.msgClass = '';
	$scope.editProfile = function(profileType) {

		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.type = profileType;
		if($scope.editUser.gender == undefined){
			$scope.editMessage = $scope.i18n.editprofile.select_gender;
			return false;
       	}

		if(profileType == 1){
			opts.firstname = $scope.editUser.firstName ; 
			opts.lastname = $scope.editUser.lastName ;
			opts.birthday = $scope.editUser.day + '-' + $scope.editUser.month.name  +'-' +$scope.editUser.year;
			opts.gender = $scope.editUser.gender;
			opts.country = $scope.editUser.country.id;
			opts.region = $scope.editUser.country.country;
			opts.map_place = document.getElementById("mapplace").value;
			opts.zip = $scope.editUser.zip;
			opts.city = $scope.editUser.city;
			opts.address = $scope.editUser.address;
			opts.latitude = document.getElementById("lat").value;
			opts.longitude = document.getElementById("lon").value;
			opts.referral_id = $scope.editUser.referral_id;
		}else if(profileType == 2){
			opts.phone = $scope.editUser.phone;
			opts.vat_number = $scope.editUser.vatnumber;
			opts.fiscal_code = $scope.editUser.fiscalcode;
			opts.iban = $scope.editUser.iban;
			opts.referral_id = $scope.editUser.brokerreferral_id;
			opts.map_place = document.getElementById("mapplace1").value;
			opts.latitude = document.getElementById("lat1").value;
			opts.longitude = document.getElementById("lon1").value;
			if(typeof $scope.idcard == undefined){
				opts.idcard = $scope.editUser.idcard;
			}
			if(typeof $scope.ssnFile == undefined){
				opts.ssn = $scope.editUser.ssn;
			}
		}
		$scope.showloading = true;
		ProfileService.editProfileDetail(opts, $scope.idCardFile, $scope.ssnFile, function(data) {
			if(data.code == 101){
				$scope.msgClass = 'alert-success';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.save_success;
				$scope.showloading = false;
				$timeout(function() {
					$scope.msgClass = '';
					$scope.editMessage = '';
				}, 2000);
				if(profileType == 1){
					$scope.shouldBeFocus = true;
					$scope.basicProfile();
					$timeout(function() {
					   $scope.basicProfile(1);
					}, 2000);
					
				}
			} else if(data.code == 132) {
				$scope.msgClass = 'alert-danger';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.invalid_profile_type;
				$scope.showloading = false;
			} else if(data.code == 100) {
				$scope.msgClass = 'alert-info';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.account_not_active;
				$scope.showloading = false;
			} else if(data.code == 131) {
				$scope.msgClass = 'alert-danger';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.invalid_date_format;
				$scope.showloading = false;
			} else if(data.code == 137) {
				$scope.msgClass = 'alert-danger';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.invalid_user;
				$scope.showloading = false;
			} else if(data.code == 95) {
				$scope.msgClass = 'alert-danger';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.you_must_choose_iamge;
				$scope.showloading = false;
			} else{
			      // $scope.editMessage = data.message;
			    $scope.msgClass = 'alert-danger';
			    $scope.shouldBeFocus = true;
                $scope.editMessage = $scope.i18n.validation.YOU_MUST_CHOOSE_AN_IMAGE;
				$scope.showloading = false;
				
			}
			$timeout(function() {
					$scope.msgClass = '';
					$scope.editMessage = '';
				}, 2000);
		});
	};
	$scope.initialize = function () {
		var mapOptions = {
			center: new google.maps.LatLng(latitudeMap, longitudeMap),
			zoom: 8
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

		var input = (document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map);

		var infowindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			map: map,
			anchorPoint: new google.maps.Point(0, -29)
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var countryPlace = autocomplete.getPlace();
			document.getElementById("lat").value = countryPlace.geometry.location.k;
			document.getElementById("lon").value = countryPlace.geometry.location.D;
			document.getElementById("mapplace").value = countryPlace.formatted_address;

			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  
			}
			marker.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map, marker);
		});

		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);
	};
	$scope.initializesecond = function () {
		var mapOptions = {
			center: new google.maps.LatLng(latitudeMap, longitudeMap),
			zoom: 8
		};
		var map2 = new google.maps.Map(document.getElementById('map-canvas-second'),mapOptions);

		var input = (document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map2.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map2.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map2);

		var infowindow = new google.maps.InfoWindow();
		var marker2 = new google.maps.Marker({
			map2: map2,
			anchorPoint: new google.maps.Point(0, -29)
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker2.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var countryPlace = autocomplete.getPlace();
			document.getElementById("lat1").value = countryPlace.geometry.location.k;
			document.getElementById("lon1").value = countryPlace.geometry.location.D;
			document.getElementById("mapplace1").value = countryPlace.formatted_address;

			if (place.geometry.viewport) {
				map2.fitBounds(place.geometry.viewport);
			} else {
				map2.setCenter(place.geometry.location);
				map2.setZoom(17);  
			}
			marker2.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker2.setPosition(place.geometry.location);
			marker2.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map2, marker2);
		});

		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);
	}


}]);

app.controller('EditUserProfileController',['$cookieStore', '$rootScope', '$scope', '$location', '$http', '$timeout', '$interval', '$routeParams', 'ProfileService', 'threadAndPass', 'fileReader','focus', function($cookieStore, $rootScope, $scope, $location,$http, $timeout, $interval, $routeParams, ProfileService, threadAndPass, fileReader, focus) {
    
  	$scope.editDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  	$scope.Result = 0;
  	function Leap(Year, type){
		if ( (Year % 4) == 0){
			if ( (Year % 100) == 0)	{
				$scope.Result = ( (Year % 400) == 0);
			}else{
				$scope.Result = 1;
			}
		}else{
			$scope.Result = 0;
		}
		if(type == 0){
			$scope.monthChange();
		}else if(type == 1){
			$scope.professionalMonthStart();
		}else if(type == 2){
			$scope.professionalMonthEnd();
		}
	}

	$scope.$watch('editUser.year',function(val){
  		Leap(val, 0);
    });
    $scope.$watch('professional.yearStart',function(val){
  		Leap(val, 1);
    });
    $scope.$watch('professional.yearEnd',function(val){
  		Leap(val,2);
    });
  	$scope.monthChange = function(){
  		if($scope.editUser.month === undefined || $scope.editUser.month === "" || $scope.editUser.month === null){
    	}else{
    		var normalValue = $scope.editUser.month.value-1;
	  		if(normalValue <= 6){ 
	  			if(normalValue % 2 == 0){
	  				$scope.editDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else if(($scope.editUser.month.value-1) == 1){
	  					if($scope.Result){
		  					$scope.editDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
		  				}else{
		  					$scope.editDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
		  				}
	  			}else{
	 				$scope.editDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}else{
	  			if(normalValue % 2 != 0){
	  				$scope.editDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else {
	 				$scope.editDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}
	  	}
  	};

  	$scope.jobDaysStart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  	$scope.professionalMonthStart = function(){
  		if($scope.professional.monthStart === undefined || $scope.professional.monthStart === "" || $scope.professional.monthStart === null){
    	}else{
    		var normalValue = $scope.professional.monthStart.value-1;
	  		if(normalValue <= 6){ 
	  			if(normalValue % 2 == 0){
	  				$scope.jobDaysStart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else if(($scope.professional.monthStart.value-1) == 1){
	  					if($scope.Result || $scope.professional.yearStart == undefined){
		  					$scope.jobDaysStart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
		  				}else{
		  					$scope.jobDaysStart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
		  				}
	  			}else{
	 				$scope.jobDaysStart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}else{
	  			if(normalValue % 2 != 0){
	  				$scope.jobDaysStart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else {
	 				$scope.jobDaysStart = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}
	  	}
  	};

  	$scope.jobDaysEnd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  	$scope.professionalMonthEnd = function(){
  		if($scope.professional.monthEnd === undefined || $scope.professional.monthEnd === "" || $scope.professional.monthEnd === null){
    	}else{
    		var normalValue = $scope.professional.monthEnd.value-1;
	  		if(normalValue <= 6){ 
	  			if(normalValue % 2 == 0){
	  				$scope.jobDaysEnd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else if(($scope.professional.monthEnd.value-1) == 1){
	  					if($scope.Result || $scope.professional.yearEnd == undefined){
		  					$scope.jobDaysEnd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
		  				}else{
		  					$scope.jobDaysEnd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
		  				}
	  			}else{
	 				$scope.jobDaysEnd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}else{
	  			if(normalValue % 2 != 0){
	  				$scope.jobDaysEnd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else {
	 				$scope.jobDaysEnd = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}
	  	}
  	};
  	$scope.getyears = function() {
		var currentYear = new Date().getFullYear();
		$scope.years = [];
		for (var i = 1914; i <= currentYear ; i++){
			$scope.years.push(i);
		}
  	}
  	$scope.getyears();
  	$scope.loadEditProfile = true;
  	$scope.educationDetails = [];
  	$scope.professionalDetails = [];
  	$scope.allCatagories = [];
	$scope.allRelatives  = [];
  	$scope.relationshipstatus = APP.relationshipstatus;
  	$scope.showSync = false;
  	$scope.showLink = false;
  	
  	$scope.sync_to_fb = function(){
  		nonuserAccessToken(function(access_token,fbId){
			// if access token is null show message in sixthcontinent website that you have declined sixthcontinent 
			//acces privilage to you fb account to do successful sync please allow sixthcontinent see your public profile
			check_and_delete_fb_permissions(function(accessType){
				if(access_token && accessType === 'got_permission'){
					var opts = {}
					opts.user_id = APP.currentUser.id;
					opts.facebook_id = fbId;
					opts.facebook_accesstoken = access_token;
					ProfileService.updateFbAccessToken(opts, function(data){
						if(data.code == 101){
							$scope.showSync = false;
							$scope.showLink = false;
						}
					})
				}else{
					alert($scope.i18n.profile.fb_permission_msg)
				}
			});
		})
  	}

	$scope.basicProfile = function(type){
		var opts = {};
		opts.user_id = APP.currentUser.id;
		if (type) {
			opts.profile_type = type;
		} else {
			opts.profile_type = 4;
	    }
		//$scope.editUser = {};
		ProfileService.viewMultiProfile(opts, function(data) {
			if(data.code == 101){
				var expiryDayCount = parseInt(data.data.facebook_profile.expires)
				var publish_actions = data.data.facebook_profile.publish_actions 
				if((!isNaN(expiryDayCount) && expiryDayCount<=0) || (publish_actions === false)) $scope.showSync = true;
				if(data.data.facebook_profile.expires === '') $scope.showLink = true;
				if (type == 1) {
					for(var i=0; i < APP.countries.length; i++){ 
					    if(data.data.region == APP.countries[i].name){
						    $scope.editUser.country = APP.countries[i];
					    }					   
					}
					$rootScope.currentUser.basicProfile = data.data.baisc_profile_info;
				} else {
					$scope.editUser.firstName = data.data.firstname;
				    $scope.editUser.lastName = data.data.lastname;
				    $scope.editUser.gender = data.data.gender;

				    for(var i=0; i < APP.countries.length; i++){ 
					    if(data.data.country.code == APP.countries[i].id){
						    $scope.editUser.country = APP.countries[i];
					    }
					}
					for(var i=0; i< $scope.i18n.profile.relationshipstatus.length;i++)
					{
						if(data.data.relationship == $scope.i18n.profile.relationshipstatus[i].status){
							$scope.editUser.relationshipsts = $scope.i18n.profile.relationshipstatus[i];
						}
					}
					var currVal = data.data.date_of_birth.date;
					currVal = currVal.substring(0,10);
					var dtArray = currVal.split("-");
					var dtDay = parseInt(dtArray[2]);
					var dtMonth = parseInt(dtArray[1]);
					var dtYear = parseInt(dtArray[0]);
					$scope.editUser.year = dtYear;
					$scope.editUser.day = dtDay;

					$scope.editUser.month = $scope.months[dtMonth-1];
					$scope.editUser.brokeresists = data.data.broker_profile.broker_profile_exists;
					$scope.editUser.citizenesists = data.data.citizen_profile;
					$rootScope.currentUser.basicProfile = data.data;
					$scope.educationDetails = data.data.educationDetail;
					$scope.professionalDetails = data.data.jobDetails;
					$scope.allCatagories = data.data.categoryKeywords;
					$scope.allRelatives = data.data.userRelatives;
				}
				$scope.broker = data.data.broker_profile;
				
			}else{

			}
		});
	}
     /* AutoSuggestion for hobbies*/
	$scope.searchText ='';
	var DELAY_TIME_BEFORE_POSTING = 300;
	//var element = $('#search');
    var currentTimeout = null;

    $('#searchInput').keydown(function() {
    
      var model = $scope.searchText;
      //var poster = model($scope);
      if(currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
      currentTimeout = $timeout(function(){
        $scope.searchsuggestion();
      }, DELAY_TIME_BEFORE_POSTING)
      });

	$scope.suggestions=[];
    $scope.selectedTags=[];

    $scope.selectedIndex=-1;
    $scope.hobbyarray=[];
    $scope.removeTag=function(index){
        $scope.selectedTags.splice(index,1);
    }

    $scope.searchsuggestion=function(){
       	    var opts={};
       	    opts.session_id = APP.currentUser.id;
       	    opts.name=$scope.searchText;
       	    opts.type="hobby";
       	    $scope.cancelHobbiesRequest = false;
       	    ProfileService.searchSuggestion(opts, function(data){
       	    if(data.code === 101){
    			if($scope.cancelHobbiesRequest === false){
	       	    	if(data.data.length > 0)
	       	    	{
	                    $scope.suggestions=data.data;
	                    $scope.selectedIndex=-1;
	            	}
	            }
            }

        });
    };

    var hobbytimer ;
    $scope.addToSelectedTags=function(index){
    	if($scope.searchText != ''){
	    	var duplicate = false;
	    	if(index != -1 )
	    	{
	            if($scope.selectedTags.indexOf($scope.suggestions[index])===-1){
	            	if($scope.suggestions[index] === undefined || $scope.suggestions[index] === null){

	            	}else{
	            		for(var i=0;i<$scope.selectedTags.length;i++){
	 	           			if($scope.selectedTags[i].name == $scope.suggestions[index].name){
	                			duplicate=true;
	            			}
	            		}
	            		if(duplicate == false){
	                		$scope.selectedTags.push($scope.suggestions[index]);
	            		}else{
	            			 $scope.hobbymsgClass = 'text-red display-block-inline fr';
				 			 $scope.shouldBeFocus = true;
				   			 $scope.hobbyMessage = $scope.i18n.profile.edit_profile.hobby_cannot_be_duplicate;
				   			 hobbytimer = $timeout(function(){
				   				$scope.hobbymsgClass = "";
				   				$scope.hobbyMessage = "";
				   			 },5000);
	            		}
	              		  $scope.searchText='';
	             		  $scope.suggestions=[];
	                }                
	            }
	  	  	} else{
	  	  		for(var i=0;i<$scope.selectedTags.length;i++){
	  	  			if($scope.selectedTags[i].name.toLowerCase() == $scope.searchText.toLowerCase()){
	  	  				duplicate=true;
	  	  			}
	  	  		}
	  	  			if(duplicate == false){
	  	  				var temphobby = { "name": $scope.searchText, "type" : "hobby"};
	  	  				$scope.selectedTags.push(temphobby);
	             	  	$scope.searchText='';
	               		$scope.suggestions=[];
	            	}else{
	            		 $scope.hobbymsgClass = 'text-red display-block-inline fr';
				 		 $scope.shouldBeFocus = true;
				   		 $scope.hobbyMessage = $scope.i18n.profile.edit_profile.hobby_cannot_be_duplicate;
				   		 hobbytimer = $timeout(function(){
				   			$scope.hobbymsgClass = "";
				   			$scope.hobbyMessage = "";
				   		 },5000);
	            	}
	  	  	}
  	  	}	
    }

    $scope.checkKeyDown=function(event){
        if(event.keyCode===40){
            event.preventDefault();
            if($scope.selectedIndex+1 !== $scope.suggestions.length){
                $scope.selectedIndex++;
            }
        }
        else if(event.keyCode===38){
            event.preventDefault();
            if($scope.selectedIndex-1 !== -1){
                $scope.selectedIndex--;
            }
        }
        else if(event.keyCode===13){
            $scope.addToSelectedTags($scope.selectedIndex);
        }
    }

    $scope.$watch('selectedIndex',function(val){
        if(val!==-1) {
            $scope.searchText = $scope.suggestions[$scope.selectedIndex].name;
        }
    });

    // Clear  hobbies List
    $scope.cancelHobbiesRequest = false;
    $scope.clearHobbyList = function(){
    	$scope.cancelHobbiesRequest = true;
    	$timeout(function(){
    		$scope.suggestions = [];
    	},500);
    };
	$scope.viewMultiProfile = function(profileType){
		var opts = {};
		$scope.editUser = {};
		$scope.editMessage = "";
		opts.user_id = APP.currentUser.id;
		opts.profile_type = profileType;
		$scope.temprelobj = {};
		$scope.temphobbies = {};
		ProfileService.viewMultiProfile(opts, function(data) {
			if(data.code == 101){
				if(profileType == 1){
					$scope.tempobj={};
					$scope.userDetails = data.data;
					$scope.renderProfile = true; 
					$scope.editUser.region = data.data.region;
					$scope.editUser.state = data.data.baisc_profile_info.state;
					$scope.editUser.zip = parseInt(data.data.zip);
					$scope.editUser.city = data.data.city;
					$scope.editUser.city_born = data.data.baisc_profile_info.city_born;
					if(data.data.address !== null && data.data.address.length > 0){
						$scope.editUser.address = data.data.address.trim();				
					}
					if(data.data.baisc_profile_info.about_me !== null && data.data.baisc_profile_info.about_me.length > 0){
						$scope.editUser.about_me = data.data.baisc_profile_info.about_me.trim();
					}
					$scope.currentValue = data.data.baisc_profile_info.hobbies;
					if($scope.currentValue !== null && $scope.currentValue.length > 0){
                       $scope.currentValue=$scope.currentValue.trim();
                       $scope.temphobbies = $scope.currentValue.split(',');
					}
					$scope.tempobj={};
					if($scope.currentValue !== null && $scope.currentValue.length > 0){     
					   for(var i=0;i<$scope.temphobbies.length;i++) {
					       $scope.tempobj={"name":$scope.temphobbies[i] , "type" : "hobby"};
					       $scope.selectedTags.push($scope.tempobj);
						}
					}
					$scope.editUser.referral_id = data.data.referral_info.id;
					if (data.data.referral_info.id) {
						$scope.editUser.referral_id = data.data.referral_info.id;
					} else {
						$scope.editUser.referral_id = '';
					}
					$scope.editUser.latitude = data.data.latitude.trim();
					$scope.editUser.longitude = data.data.longitude.trim();
					$scope.editUser.place = data.data.map_place.trim();
					$scope.editUser.zip = data.data.zip;
					$scope.basicProfile();
					$scope.loadEditProfile = false;
					latitudeMap = data.data.latitude;
					longitudeMap = data.data.longitude;
					angular.element('#pac-input').val($scope.editUser.place);
					$timeout(function(){
						$scope.initialize();
					}, 1000);
					
				}else {
					$scope.basicProfile();
					$scope.editUser.phone = parseInt(data.data.phone, 10);
					$scope.editUser.vatnumber = data.data.vat_number;
					$scope.editUser.fiscalcode  = data.data.fiscal_code;
					$scope.editUser.iban  = data.data.iban;
					$scope.editUser.brokerplace = data.data.map_place;
					$scope.editUser.brokerreferral_id = data.data.referral_info.id;
					$scope.editUser.brokerlatitude = data.data.latitude;
					$scope.editUser.brokerlongitude = data.data.longitude;
					$scope.editUser.idcard = data.data.idcard;
					$scope.editUser.ssn = data.data.ssn;
					$scope.loadEditProfile = false;
					latitudeMap = data.data.latitude;
					longitudeMap = data.data.longitude;
					$timeout(function(){
						$scope.initializesecond();
					}, 1000);
				}
			}else{
				$scope.basicProfile();

			}
		});
	}
	//$scope.getUserProfile(1);
	if(JSON.stringify(APP.currentUser) != "{}"){
		var type = $routeParams.type;
		$scope.viewMultiProfile(type);
	};

	$scope.edit = true;
	$scope.brokerprofile = false;
	$scope.getIdCardFile = function () {
		//Allow some images types for uploading
        var imageType = $scope.idCardFile['name'].substring($scope.idCardFile['name'].lastIndexOf(".") + 1);
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            $scope.editMessage = $scope.i18n.idcard.invalid_upload;
            $scope.idCardFile = null;
        } else {
			fileReader.readAsDataUrl($scope.idCardFile, $scope)
				.then(function(result) {
				  $scope.idCardFilePre = result;
				});
		}
    };
    $scope.getSsnFile = function () {
    	//Allow some images types for uploading
        var imageType = $scope.ssnFile['name'].substring($scope.ssnFile['name'].lastIndexOf(".") + 1);
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            $scope.editMessage = $scope.i18n.idcard.invalid_ssn;
            $scope.ssnFile = null;
        } else {
	        fileReader.readAsDataUrl($scope.ssnFile, $scope)
				.then(function(result) {
				  $scope.ssnFilePre = result;
				});
		}
    };

    $scope.removePreviewIdCard = function () {
		$scope.idCardFilePre = '';
		$scope.idCardFile = [];
    };
    
    $scope.removePreviewSSN = function () {
        $scope.ssnFilePre = '';
		$scope.ssnFile = [];
    };

	if(JSON.stringify(APP.currentUser) != "{}"){
		var type = $routeParams.type;
		// $scope.showTab(type);
	};

	$scope.hobbyarray = [];
	$scope.editMessage = "";
	$scope.showloading = false;
	var editTimer;

	$scope.preventEnter = function(event){
		if(event.keyCode == 13  && (event.target.type != "textarea")) {
	      event.preventDefault();
	      return false;
	    }
	};
	$scope.editProfile = function(profileType ,valid, event) {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.type = profileType;
		$scope.errorIndex = null;
		$scope.errorIndex = 0;
		if(profileType == 1){
			if($scope.editUser.firstName == undefined || $scope.editUser.firstName == ''){
				$scope.errorIndex = 1;
				$scope.editUsers.firstname.$dirty = true;
			    $scope.editUsers.firstname.$invalid = true;
			    $scope.editUsers.firstname.$error.required = true;
			    focus('user_First_Name');
       	    }else if($scope.editUser.lastName == undefined || $scope.editUser.lastName == ''){
       	    	$scope.errorIndex = 1;
       	    	$scope.editUsers.lastname.$dirty = true;
			    $scope.editUsers.lastname.$invalid = true;
			    $scope.editUsers.lastname.$error.required = true;
			    focus('user_Last_Name');
       	    } else if($scope.editUser.month == undefined || $scope.editUser.month == '' || $scope.editUser.month == null){
				$scope.errorIndex = 1;
				$scope.editUsers.birthmonth.$dirty = true;
			    $scope.editUsers.birthmonth.$invalid = true;
			    $scope.editUsers.birthmonth.$error.required = true;
				focus('birthmonth');
			}else if($scope.editUser.day == undefined || $scope.editUser.day == '' ){
				$scope.errorIndex = 1;
				$scope.editUsers.birthdate.$dirty = true;
			    $scope.editUsers.birthdate.$invalid = true;
			    $scope.editUsers.birthdate.$error.required = true;
				focus('birthdate');
			}else if($scope.editUser.year == undefined || $scope.editUser.year == '' ){
				$scope.errorIndex = 1;
				$scope.editUsers.birthyear.$dirty = true;
			    $scope.editUsers.birthyear.$invalid = true;
			    $scope.editUsers.birthyear.$error.required = true;
				focus('birthyear');
			} else if($scope.editUser.gender == undefined){
       	    	$scope.errorIndex = 1;
       	    	focus('register_male');
       	    } /*else if($scope.editUser.relationshipsts == undefined || $scope.editUser.relationshipsts.status == undefined || $scope.editUser.relationshipsts.status == ''){
			    $scope.errorIndex = 1;
			    $scope.editUsers.relation.$dirty = true;
			    $scope.editUsers.relation.$invalid = true;
			    $scope.editUsers.relation.$error.required = true;
			    focus('relation');
       	    } */ else if($scope.editUser.country == undefined || $scope.editUser.country.country == undefined || $scope.editUser.country.country == ''){
			    $scope.errorIndex = 1;
			    $scope.editUsers.nation.$dirty = true;
			    $scope.editUsers.nation.$invalid = true;
			    $scope.editUsers.nation.$error.required = true;
			    focus('countryId');
       	    } else if($scope.editUser.state == undefined || $scope.editUser.state == '' || isNaN($scope.editUser.state) == false ){
				$scope.errorIndex = 1;
				$scope.editUsers.states.$dirty = true;
			    $scope.editUsers.states.$invalid = true;
			    $scope.editUsers.states.$error.required = true;
				focus('state');
			} else if($scope.editUser.zip == undefined || $scope.editUser.zip == '' || $scope.editUser.zip.length < 5 || $scope.editUser.zip.length > 5 || isNaN($scope.editUser.zip) == true){
			    $scope.errorIndex = 1;
			    $scope.editUsers.zipcode.$dirty = true;
			    $scope.editUsers.zipcode.$invalid = true;
			    $scope.editUsers.zipcode.$error.required = true;
			    focus('zipcode');
       	    } else if($scope.editUser.city == undefined || $scope.editUser.city == '' || isNaN($scope.editUser.city) == false){
				$scope.errorIndex = 1;
				$scope.editUsers.place.$dirty = true;
			    $scope.editUsers.place.$invalid = true;
			    $scope.editUsers.place.$error.required = true;
				focus('place');
			}else if($scope.editUser.city_born == undefined || $scope.editUser.city_born == '' || isNaN($scope.editUser.city_born) == false){
				$scope.errorIndex = 1;
				$scope.editUsers.cityborn.$dirty = true;
			    $scope.editUsers.cityborn.$invalid = true;
			    $scope.editUsers.cityborn.$error.required = true;
				focus('city_born');
			} 
			if( $scope.errorIndex == 1){
				return false;
				//$scope.errorIndex = 0;
			}
			//var birthDay = 
			
			var bDate =  $scope.editUser.month.value  +'-' + $scope.editUser.day + '-' + $scope.editUser.year  + " 00:00:00";
			var birthDayObject =  new Date(bDate).getTime();
			var currentDateObject = new Date().getTime();

			if(currentDateObject < birthDayObject){
				$scope.birthdateclass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.birthdateError = $scope.i18n.register.birthday_invalid;
				$scope.errorIndex = 1;
				/*$scope.editUsers.birthmonth.$dirty = true;
			    $scope.editUsers.birthmonth.$invalid = true;
			    $scope.editUsers.birthmonth.$error.required = true;
			    $scope.editUsers.birthdate.$dirty = true;
			    $scope.editUsers.birthdate.$invalid = true;
			    $scope.editUsers.birthdate.$error.required = true;
			    $scope.editUsers.birthyear.$dirty = true;
			    $scope.editUsers.birthyear.$invalid = true;
			    $scope.editUsers.birthyear.$error.required = true;*/
				focus('birthmonth');
				editTimer = $timeout(function(){
			   		$scope.birthdateclass = "";
			   		$scope.birthdateError = "";
			   	},10000);
			}

			if( $scope.errorIndex == 1){
				return false;
			}
			var temparr =[];
			if($scope.selectedTags == undefined || $scope.selectedTags == '' || $scope.selectedTags == null){
				temparr.push(" ");
			}else{
				for(var i=0;i<$scope.selectedTags.length;i++)
				{	
				 	temparr.push($scope.selectedTags[i].name);
	         	}
	         }
	        if($scope.editUser.relationshipsts == undefined || $scope.editUser.relationshipsts == ''){
				opts.relationship=" ";
			}
			else{
				opts.relationship = $scope.editUser.relationshipsts.status;
			}
			if($scope.editUser.about_me == undefined || $scope.editUser.about_me == ''){
				opts.about_me = " ";
			}else{
				opts.about_me = $scope.editUser.about_me;
			}
			if($scope.editUser.address == undefined || $scope.editUser.address == ''){
			  	opts.address = " ";
       	    }else{
       	    	opts.address = $scope.editUser.address;
       	    }
       	    if((document.getElementById("lat").value) == undefined || (document.getElementById("lat").value) == ''){
				opts.latitude = " ";
			}else{
				opts.latitude = document.getElementById("lat").value;
			}
			if((document.getElementById("lon").value )== undefined || (document.getElementById("lon").value) == ''){
				opts.longitude = " ";
			}else{
				opts.longitude = document.getElementById("lon").value;
			}
			if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
				opts.map_place = " ";
			}else{
				opts.map_place = document.getElementById("mapplace").value;
			}
         	$scope.hobbyarray=temparr;
         	$scope.hobbyarray=$scope.hobbyarray.join();
			opts.firstname = $scope.editUser.firstName ;
			opts.lastname = $scope.editUser.lastName ;
			opts.birthday = $scope.editUser.day + '-' + $scope.editUser.month.value  +'-' +$scope.editUser.year;
			opts.gender = $scope.editUser.gender;
			opts.country = $scope.editUser.country.id;
			opts.region = $scope.editUser.country.country;
			opts.state = $scope.editUser.state;
			opts.referral_id = '';
			opts.zip = $scope.editUser.zip;
			opts.city = $scope.editUser.city;
			opts.city_born = $scope.editUser.city_born;
			opts.hobbies = $scope.hobbyarray;
			$timeout.cancel(editTimer);
		}else if(profileType == 2){
			if($scope.editUser.phone == undefined || $scope.editUser.phone == '' || isNaN($scope.editUser.phone) == true){
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.brokerMsg = $scope.i18n.broker.enter_brokernumber ;
				return false;
			} else if($scope.editUser.fiscalcode == undefined || $scope.editUser.fiscalcode == ''){
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
			   $scope.editMessage = $scope.i18n.broker.enter_brokerfiscal;
			   return false;
       	    } else if($scope.editUser.iban == undefined || $scope.editUser.iban == ''){
			   $scope.msgClass = 'text-red display-block-inline fr';
			   $scope.shouldBeFocus = true;
			   $scope.editMessage = $scope.i18n.broker.enter_brokeriban;
			   return false;
       	    }  else if((document.getElementById("lat1").value) == undefined || (document.getElementById("lat1").value) == ''){
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.register.enter_businesslat;
				return false;
			} else if((document.getElementById("lon1").value )== undefined || (document.getElementById("lon1").value) == ''){
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.register.enter_businesslog;
				return false;
			} else if((document.getElementById("mapplace1").value) == undefined || (document.getElementById("mapplace1").value) == ''){
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.register.enter_businessmap;
				return false;
			} 

			opts.phone = $scope.editUser.phone;
			opts.vat_number = $scope.editUser.vatnumber;
			opts.fiscal_code = $scope.editUser.fiscalcode;
			opts.iban = $scope.editUser.iban;
			if ($scope.editUser.brokerreferral_id) {
				opts.referral_id = $scope.editUser.brokerreferral_id;
			} else {
				opts.referral_id = '';
			}
			// opts.referral_id = $scope.editUser.brokerreferral_id;
			opts.map_place = document.getElementById("mapplace1").value;
			opts.latitude = document.getElementById("lat1").value;
			opts.longitude = document.getElementById("lon1").value;
			if(typeof $scope.idcard == undefined){
				opts.idcard = $scope.editUser.idcard;
			}
			if(typeof $scope.ssnFile == undefined){
				opts.ssn = $scope.editUser.ssn;
			}
		}
	
		$scope.showloading = true;
        $scope.editloader = true;
        $scope.msgClass = "";
		$scope.editMessage = "";
		ProfileService.updateProfileDetail(opts, $scope.idCardFile, $scope.ssnFile, function(data) {
			if(data.code == 101){
				$scope.msgClass = 'text-success display-block-inline fr';
				//$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.save_success;
                $scope.editloader = false;
				$scope.showloading = false;
				editTimer = $timeout(function() {
					$scope.msgClass = '';
					$scope.editMessage = '';
				}, 15000);
				if(profileType == 1){
					$scope.basicProfile();
					editTimer = $timeout(function() {
					   //$scope.basicProfile(1);
					}, 10000);
					
				}
			} else if(data.code == 132) {
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.invalid_profile_type;
				$scope.showloading = false;
                $scope.editloader = false;
			} else if(data.code == 100) {
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.account_not_active;
				$scope.showloading = false;
                $scope.editloader = false;
			} else if(data.code == 131) {
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.invalid_date_format;
				$scope.showloading = false;
                $scope.editloader = false;
			} else if(data.code == 137) {
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.invalid_user;
				$scope.showloading = false;
                $scope.editloader = false;
			} else if(data.code == 95) {
				$scope.msgClass = 'text-red display-block-inline fr';
				$scope.shouldBeFocus = true;
				$scope.editMessage = $scope.i18n.validation.you_must_choose_iamge;
				$scope.showloading = false;
                $scope.editloader = false;
			} else{
			    $scope.msgClass = 'text-red display-block-inline fr';
			    $scope.shouldBeFocus = true;
                $scope.editMessage = $scope.i18n.validation.YOU_MUST_CHOOSE_AN_IMAGE;
				$scope.showloading = false;
                $scope.editloader = false;
				
			}
			editTimer =  $timeout(function() {
				$scope.msgClass = '';
				$scope.editMessage = '';
			}, 15000);
		});
	};

	var EducationIndex = 0;
	$scope.educations = [];
	$scope.education = {};
	
	/* show EducationForm form  */
	$scope.showEducationForm = false;
	$scope.toggleEducationForm = function(){
		$scope.education = {};
		$scope.formValid = true;
		$scope.editEducationBUtton = false;
		if($scope.showEducationForm === false){
			$scope.showEducationForm = true;
			focus('school_start');
		}else {
			$scope.educations.$setPristine();
			$timeout(function(){
				$scope.showEducationForm = false;
			},100);
			
		}
	}

	var educationTimer;
	/*Submit education form */
	$scope.saveEducation = function(type){

		$scope.educationFocus = false;
		$scope.formValid = true;
		var opts = {};
		if($scope.education.school === undefined || $scope.education.school === '' || $scope.education.school === null){
			$scope.formValid = false;
			$scope.educations.schoolName.$dirty = true;
			$scope.educations.schoolName.$invalid = true;
			$scope.educations.schoolName.$error.required = true;
			focus('schoolSuggestion');
		} else if($scope.education.yearStart == undefined || $scope.education.yearStart == '' || $scope.education.yearStart == null){
			$scope.formValid = false;
			$scope.educations.startYear.$dirty = true;
			$scope.educations.startYear.$invalid = true;
			$scope.educations.startYear.$error.required = true;
			focus('school_start');
		}else if($scope.education.currently_attending === undefined || $scope.education.currently_attending === '' || $scope.education.currently_attending === null){
			$scope.formValid = false;
			$scope.educations.ca.$dirty = true;
			$scope.educations.ca.$invalid = true;
			$scope.educations.ca.$error.required = true;
			focus('school_start')
		}else if($scope.education.currently_attending == 0 && ($scope.education.yearEnd === undefined || $scope.education.yearEnd === '' || $scope.education.yearEnd === null)){
			$scope.formValid = false;
			$scope.educations.endYear.$dirty = true;
			$scope.educations.endYear.$invalid = true;
			$scope.educations.endYear.$error.required = true;
			focus('end_year');
		}else if($scope.education.degree === undefined || $scope.education.degree === '' || $scope.education.degree === null){
			$scope.formValid = false;
			$scope.educations.degreeName.$dirty = true;
			$scope.educations.degreeName.$invalid = true;
			$scope.educations.degreeName.$error.required = true;
			focus('degree_name')
		}else if($scope.education.Field_Of_Study === undefined || $scope.education.Field_Of_Study === '' || $scope.education.Field_Of_Study === null){
			$scope.formValid = false;
			$scope.educations.studyField.$dirty = true;
			$scope.educations.studyField.$invalid = true;
			$scope.educations.studyField.$error.required = true;
			focus('studySuggestion');
		}else if($scope.education.grade === undefined || $scope.education.grade === '' || $scope.education.grade === null){
			$scope.formValid = false;
			$scope.educations.grad.$dirty = true;
			$scope.educations.grad.$invalid = true;
			$scope.educations.grad.$error.required = true;
			focus('school_grade');
		}else if($scope.education.description === undefined || $scope.education.description === '' || $scope.education.description === null){
			$scope.formValid = false;
			$scope.educations.desc.$dirty = true;
			$scope.educations.desc.$invalid = true;
			$scope.educations.desc.$error.required = true;
			focus('desc_option');
		}else if($scope.education.visibility === undefined || $scope.education.visibility === '' || $scope.education.visibility === null){
			$scope.formValid = false;
			$scope.educations.visible.$dirty = true;
			$scope.educations.visible.$invalid = true;
			$scope.educations.visible.$error.required = true;
			focus('visible_option');
		}

		if($scope.formValid == false){
			return false;
		}

		var sDate = $scope.education.yearStart;  // + '/' + $scope.education.monthStart.name  + '/' + $scope.education.dayStart;
		var eDate;
		if($scope.education.currently_attending == 1){
			eDate = ' ';  // + '/' + $scope.education.monthEnd.name  + '/' + $scope.education.dayEnd;
		}else{
			eDate = $scope.education.yearEnd;
		if(sDate > eDate){
			$scope.formValid = false;
			focus('end_year')
			}
		}

		if($scope.formValid == false){
			$scope.formValid = true;
			return false;
		}

		if (type === ''){
		opts.id = "";
		}else {
		opts.id = $scope.educationId;
		}
		opts.user_id = APP.currentUser.id;
		opts.type = 1;
		opts.school = $scope.education.school;
		opts.start_date = $scope.education.yearStart;
		if($scope.education.currently_attending == 0){
			opts.currently_attending = false;
		}else{
			opts.currently_attending = true;
		}
		//opts.currently_attending = $scope.education.currently_attending;
		opts.end_date =  eDate; 
		opts.degree = $scope.education.degree.degree;
		opts.field_of_study = $scope.education.Field_Of_Study;
		opts.grade = $scope.education.grade;
		if($scope.education.activity_society === undefined || $scope.education.activity_society === '' || $scope.education.activity_society === null){
		opts.activities = "";
		}else{
		opts.activities = $scope.education.activity_society;
		}
		opts.desc = $scope.education.description;
		opts.visibility_type = $scope.education.visibility.id;
		$scope.errorClass = "";
		$scope.educationMessage = "";
		$scope.wait = true;
		$timeout.cancel(educationTimer);
		ProfileService.saveUserEducation(opts, function(data){
			$scope.wait = false;
			if(data.code === "101" && data.message === "SUCCESS"){
				$scope.editEducationBUtton = false;
				if (type === ''){
					//$scope.educationDetails.push(data.data);
					$scope.educationDetails = data.data;
				}else{
					/*var indexNo = 0;
					//var indexNo = $scope.educationDetails.indexOf(data.data);
					for (var i = 0; i < $scope.educationDetails.length; i++) {
						if($scope.educationDetails[i].id === data.data.id){
							indexNo = i;
							break;
						}
					}*/
					//$scope.educationDetails.splice(indexNo,1);
					//$scope.educationDetails.push(data.data);
					$scope.educationDetails = data.data;
				}

				$scope.errorClass = 'text-success text-center';
				$scope.educationMessage = $scope.i18n.profile.edit_profile.education_saved;
				educationTimer =  $timeout(function(){
				    $scope.errorClass = "";
				    $scope.educationMessage = "";
				   },15000);
				$scope.toggleEducationForm();
			}else{
			$scope.errorClass = 'text-red text-center';
			$scope.educationMessage = data.message;
			educationTimer =  $timeout(function(){
			    $scope.errorClass = "";
			    $scope.educationMessage = "";
			   },15000);
			}
		});

	};

	$scope.visibleWait = [];
	// Change visiblity of education
	$scope.updateEducationVisibility = function(index, type){
		$scope.visibleWait[index.id] = true;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.id = index.id;
		opts.type = 1;
		opts.visibility_type = type;
		ProfileService.updateEducationVisibility(opts,function(data){
			$scope.visibleWait[index.id] = false;
			if(data.code === '101' && data.message === "SUCCESS"){
				for (var i = 0; i < $scope.educationDetails.length; i++) {
					if($scope.educationDetails[i].id === index.id){
						$scope.educationDetails[i].visibility_type = type;
					}
				};
			}
		});
	};


	$scope.currentFullDate = new Date().getFullYear();
	//Edit education form
	$scope.educationFocus = false;
	$scope.editEducationBUtton = false;
	$scope.editEducation = function(index, id){
		focus(id);
		$scope.editEducationBUtton = true;
		$scope.education = {};
		$scope.showEducationForm = true;
		//$scope.toggleEducationForm();
		$scope.education.school = index.school;
		$scope.education.yearStart  = parseInt(index.start_date);
		$scope.education.yearEnd = parseInt(index.end_date);
		$scope.education.grade = index.grade;
		$scope.education.activity_society = index.activities;
		$scope.education.Field_Of_Study = index.field_of_study;
		$scope.education.description = index.description;
		if(index.currently_attending === true){
			$scope.education.currently_attending = 1;
		}else{
			$scope.education.currently_attending = 0;
		}
		
		for(var i=0;i<$scope.degrees.length;i++){
			if(index.degree === $scope.degrees[i].degree){
				$scope.education.degree = $scope.degrees[i];
			}
		};
		for (var i = 0; i < $scope.visibility.length; i++) {
			if($scope.visibility[i].id === index.visibility_type){
				$scope.education.visibility = $scope.visibility[i];
			}
		};
		$scope.educationId = index.id;
		$scope.educationFocus = true;
	};
	// Delete the Education
	$scope.deleteEducation = function(index,id){
		var opts = {};
		opts.user_id = index.user_id;
		opts.type = 1;
		opts.id = index.id;
		$scope.wait = true;
		angular.element('.deleteEducation'+id).css('display','none');
		$timeout.cancel(educationTimer);
		ProfileService.deleteEducation(opts,function(data){
			$scope.wait = false;
		if(data.code == 101 && data.message == "SUCCESS"){
			$scope.showEducationForm = false;
			var indexNo = $scope.educationDetails.indexOf(index);
			$scope.educationDetails.splice(indexNo,1);
			$scope.errorClass = 'text-success text-center';
			$scope.educationMessage = $scope.i18n.profile.edit_profile.edu_deleted_success;
			educationTimer =  $timeout(function(){
		   		$scope.errorClass = "";
		   		$scope.educationMessage = "";
		   	},15000);
		}else{
			angular.element('.deleteEducation'+id).css('display','block');
			$scope.errorClass = 'text-red text-center';
			$scope.educationMessage = data.message;
			educationTimer =  $timeout(function(){
		   		$scope.errorClass = "";
		   		$scope.educationMessage = "";
		   	},15000);
		}
		});
	};

	//Delete categories
	$scope.deleteCategories = function(index){

		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.type = 1;
		opts.id = index.id;
		ProfileService.deleteCategory(opts,function(data){
			if(data.message = "SUCCESS")
			{
				console.log("category deleted");
			}
		});
	};


	// Show School name suggestion
	$scope.education.school ='';
	var DELAY_TIME_BEFORE_POSTING = 300;
	//var element = $('#search');
    var currentTimeout = null;

    $('#schoolSuggestion').keydown(function(event) {
		var model = $scope.searchText;
		if(currentTimeout) {
		$timeout.cancel(currentTimeout);
		}
		currentTimeout = $timeout(function(){
			if(event.which != 13){ 
				$scope.schoolSuggestion();
			}
		}, DELAY_TIME_BEFORE_POSTING)
    });
	$scope.schools = [];
	$scope.schoolLoader = false;
	$scope.schoolSuggestion = function(){
		var opts = {};
   	    opts.name=$scope.education.school;
   	    opts.type= "school";
   	    opts.session_id = APP.currentUser.id;
   	    $scope.cancelSchoolRequest = false;
   	    $scope.schoolLoader = true;
   	    ProfileService.searchSuggestion(opts, function(data){
   	    	if(data.code === 101 && data.message === "SUCCESS"){
   	    		if($scope.cancelSchoolRequest === false){
   	    			$scope.schools = data.data;
   	    			$scope.schoolLoader = false;
   	    		}else{
   	    			$scope.schoolLoader = false;
   	    		}
   	    	}
   	    });
	};

	// Add selected school
	$scope.education.school = "";
	$scope.addSchool = function(index){
		//$scope.education.school = "";
		$scope.education.school = index.name;
		$scope.schoolIndex = -1;
		$scope.schools = [];
	};

	$scope.schoolIndex = -1;
	$scope.schoolDropDowm = function(event){
	    if(event.keyCode===40){
	        event.preventDefault();
	        if($scope.schoolIndex+1 !== $scope.schools.length){
	            $scope.schoolIndex++;
	        }
	    }
	    else if(event.keyCode===38){
	        event.preventDefault();
	        if($scope.schoolIndex-1 !== -1){
	            $scope.schoolIndex--;
	        }
	    }
	    else if(event.keyCode===13){
	        $scope.addSchool($scope.schools[$scope.schoolIndex]);
	    }
	};

	// Clear school suggestion
	$scope.cancelSchoolRequest = false;
	$scope.clearSchoolList = function(){
		$scope.cancelSchoolRequest = true;
		$timeout(function(){
			$scope.schools = [];
		},500);
	};

	// Show Stydy name suggestion
	$('#studySuggestion').keydown(function(event) {
		var model = $scope.searchText;
		if(currentTimeout) {
		$timeout.cancel(currentTimeout);
		}
		currentTimeout = $timeout(function(){
			if(event.which != 13){ 
				$scope.studySuggestion();
			}
		}, DELAY_TIME_BEFORE_POSTING)
    });
	$scope.studies = [];
	$scope.studyLoader = false;
	$scope.studySuggestion = function(){
		var opts = {};
   	    opts.name=$scope.education.Field_Of_Study;
   	    opts.type= "study";
   	    opts.session_id = APP.currentUser.id;
   	    $scope.cancelFeildRequest = false;
   	    $scope.studyLoader = true;
   	    ProfileService.searchSuggestion(opts, function(data){
   	    	if(data.code === 101 && data.message === "SUCCESS"){
   	    		if($scope.cancelFeildRequest === false){
   	    			$scope.studies = data.data;
   	    		}
   	    		$scope.studyLoader = false;
   	    	}else{
   	    		$scope.studyLoader = false;
   	    	}
   	    });
	};

	// Add selected study
	$scope.education.Field_Of_Study = "";
	$scope.addStudy = function(index){
		//$scope.education.Field_Of_Study = "";
		$scope.education.Field_Of_Study = index.name;
		$scope.studyIndex = -1;
		$scope.studies = [];
	};

	$scope.studyIndex = -1;
	$scope.studyDropDown = function(event){
	    if(event.keyCode===40){
	        event.preventDefault();
	        if($scope.studyIndex+1 !== $scope.studies.length){
	            $scope.studyIndex++;
	        }
	    }
	    else if(event.keyCode===38){
	        event.preventDefault();
	        if($scope.studyIndex-1 !== -1){
	            $scope.studyIndex--;
	        }
	    }
	    else if(event.keyCode===13){
	        $scope.addStudy($scope.studies[$scope.studyIndex]);
	    }
	};

	//Clear Field of study
	$scope.cancelFeildRequest = false;
	$scope.clearFeildOfStudy = function(){
		$timeout(function(){
			$scope.studies = [];
		},500);
		$scope.cancelFeildRequest = true;
	};


	/*Show  profession  form */
	$scope.showProfessionForm = false;
	$scope.toggleProfessionForm = function(){
		$scope.professionFormValidate = false;
		$scope.editProfessionButton = false;
		$scope.professional = {};
		if($scope.showProfessionForm === false){
			$scope.showProfessionForm = true;
			focus('companySearch');
		}else {
			
			$scope.professionals.$setPristine();
			$timeout(function(){
				$scope.showProfessionForm = false;
			},100);
		}
	};

	/*Submit Professional form */
	$scope.professional = {};
	$scope.saveProfession = function(type){
		$scope.professionFocus = false; 
		$scope.dateError = false;
		$scope.professionFormValidate = false;
		var opts = {};
		if($scope.professional.company === undefined || $scope.professional.company === '' || $scope.professional.company === null){
			$scope.professionals.companyName.$dirty = true;
			$scope.professionals.companyName.$invalid = true;
			$scope.professionals.companyName.$error.required = true;
			$scope.professionFormValidate = true;
			focus('companySearch');
		}else if($scope.professional.title === undefined || $scope.professional.title === '' || $scope.professional.title === null){
				$scope.professionals.Role.$dirty = true;
				$scope.professionals.Role.$invalid = true;
				$scope.professionals.Role.$error.required = true;
				$scope.professionFormValidate = true;
				focus('jobTitle');
		}else if($scope.professional.monthStart === undefined || $scope.professional.monthStart === '' || $scope.professional.monthStart === null){
				$scope.professionals.job_Month_Start.$dirty = true;
				$scope.professionals.job_Month_Start.$invalid = true;
				$scope.professionals.job_Month_Start.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_month_start');
		}else if($scope.professional.dayStart === undefined || $scope.professional.dayStart === '' || $scope.professional.dayStart === null){
				$scope.professionals.job_day_start.$dirty = true;
				$scope.professionals.job_day_start.$invalid = true;
				$scope.professionals.job_day_start.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_day_start');
		}else if($scope.professional.yearStart === undefined || $scope.professional.yearStart === '' || $scope.professional.yearStart === null){
				$scope.professionals.job_year_start.$dirty = true;
				$scope.professionals.job_year_start.$invalid = true;
				$scope.professionals.job_year_start.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_year_start');
		}else if($scope.professional.currently_working === undefined || $scope.professional.currently_working === '' || $scope.professional.currently_working === null){
				$scope.professionals.cw.$dirty = true;
				$scope.professionals.cw.$invalid = true;
				$scope.professionals.cw.$error.required = true;
				$scope.professionFormValidate = true;
				focus('condition_current');
		}else if(($scope.professional.currently_working != 1 || $scope.professional.currently_working == undefined) && ($scope.professional.monthEnd === undefined || $scope.professional.monthEnd === '' || $scope.professional.monthEnd === null)){
				$scope.professionals.job_month_end.$dirty = true;
				$scope.professionals.job_month_end.$invalid = true;
				$scope.professionals.job_month_end.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_month_ends');
		}else if(($scope.professional.currently_working != 1) && ($scope.professional.dayEnd === undefined || $scope.professional.dayEnd === '' || $scope.professional.dayEnd === null)){
				$scope.professionals.job_day_end.$dirty = true;
				$scope.professionals.job_day_end.$invalid = true;
				$scope.professionals.job_day_end.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_days_ends');
		}else if(($scope.professional.currently_working != 1) && ($scope.professional.yearEnd === undefined || $scope.professional.yearEnd === '' || $scope.professional.yearEnd === null)){
				$scope.professionals.job_year_end.$dirty = true;
				$scope.professionals.job_year_end.$invalid = true;
				$scope.professionals.job_year_end.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_years_ends');
		}else if($scope.professional.description === undefined || $scope.professional.description === '' || $scope.professional.description === null){
				$scope.professionals.job_desc.$dirty = true;
				$scope.professionals.job_desc.$invalid = true;
				$scope.professionals.job_desc.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_description');
		}else if($scope.professional.visibility === undefined || $scope.professional.visibility === '' || $scope.professional.visibility === null){
				$scope.professionals.visibility_type.$dirty = true;
				$scope.professionals.visibility_type.$invalid = true;
				$scope.professionals.visibility_type.$error.required = true;
				$scope.professionFormValidate = true;
				focus('job_visibility');
		}
		
		if($scope.professionFormValidate === true){
			return false;
		}
		var sDate = $scope.professional.yearStart + '-' + $scope.professional.monthStart.value  + '-' + $scope.professional.dayStart + " 00:00:00";
		var arr1 = sDate.split(/[- :]/);
		var startingDate = new Date(arr1[0], arr1[1]-1, arr1[2], arr1[3], arr1[4], arr1[5]);
		var eDate, endingDate;
		if($scope.professional.currently_working == 0){
			eDate = $scope.professional.yearEnd + '-' + $scope.professional.monthEnd.value  + '-' + $scope.professional.dayEnd + " 00:00:00";
			var arr2 = eDate.split(/[- :]/);
			endingDate = new Date(arr2[0], arr2[1]-1, arr2[2], arr2[3], arr2[4], arr2[5]);
			if(endingDate > (new Date())){
			$scope.professionFormValidate = true;
			$scope.errorClass = 'text-red text-center';
			$scope.professionMessage = $scope.i18n.profile.edit_profile.end_date_wrong;
			timer = $timeout(function(){
		   		$scope.errorClass = "";
		   		$scope.professionMessage = "";
		   	},15000);
		}
		}else{
			endingDate = new Date();
			$scope.professional.yearEnd = endingDate.getFullYear();
			$scope.professional.monthEnd = {value: endingDate.getMonth(), name: $scope.months[parseInt(endingDate.getMonth())].name};
			$scope.professional.dayEnd = endingDate.getDate();
		}
		$scope.dateError = false;
		if(startingDate > endingDate){
			$scope.dateError = true;
			$scope.professionFormValidate = true;
			focus('job_month_ends');
		}



		if($scope.professionFormValidate === true){
			$scope.professionFormValidate = false;
			return false;
		}
		if (type === ''){
			opts.id =  '';
		}else{
			opts.id = $scope.professional.id;
		}
		opts.user_id = APP.currentUser.id;
		opts.type = 1;
		opts.company = $scope.professional.company;
		opts.title = $scope.professional.title;
		opts.start_date = $scope.professional.yearStart + '-' +($scope.professional.monthStart.value) + '-' + $scope.professional.dayStart;
		opts.end_date = $scope.professional.yearEnd + '-' +($scope.professional.monthEnd.value) + '-' + $scope.professional.dayEnd ;
		opts.currently_working = $scope.professional.currently_working;
		opts.headline = "";//$scope.professional.headline;
		opts.location = "";
		opts.description = $scope.professional.description;
		opts.visibility_type = $scope.professional.visibility.id;
		$scope.errorClass = "";
		$scope.professionMessage = "";
		$scope.wait = true;
		$timeout.cancel(timer);
		ProfileService.saveUserProfession(opts,function(data){
		$scope.wait = false;
			if(data.code === "101" && data.message === "SUCCESS"){
				$scope.editProfessionButton = false;
				if (type === ''){
					$scope.professionalDetails = data.data;
					$scope.errorClass = 'text-success text-center';
					$scope.professionMessage = $scope.i18n.profile.edit_profile.job_successfully_saved;
				}else{
					$scope.professionalDetails = data.data;
					$scope.errorClass = 'text-success text-center';
					$scope.professionMessage = $scope.i18n.profile.edit_profile.job_successfully_update;
				}
				$scope.toggleProfessionForm();
				timer = $timeout(function(){
			   		$scope.errorClass = "";
			   		$scope.professionMessage = "";
			   	},15000);
			}else{
				$scope.errorClass = 'text-red text-center';
				$scope.professionMessage = data.message;
				$scope.toggleProfessionForm();
				timer = $timeout(function(){
			   		$scope.errorClass = "";
			   		$scope.professionMessage = "";
			   	},15000);
			}
		});

	};

	// Update visibility of profession
	$scope.jobVisibleWait = [];
	// Change visiblity of education
	$scope.updateProfessionVisibility = function(index, type){
		$scope.jobVisibleWait[index.id] = true;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.id = index.id;
		opts.type = 1;
		opts.visibility_type = type;
		ProfileService.updateProfessionVisibility(opts,function(data){
			$scope.jobVisibleWait[index.id] = false;
			if(data.code === '101' && data.message === "SUCCESS"){
				for (var i = 0; i < $scope.professionalDetails.length; i++) {
					if($scope.professionalDetails[i].id === index.id){
						$scope.professionalDetails[i].visibility_type = type;
					}
				};
			}
		});
	}; 
	// Edit Profession
	$scope.professionFocus = false; 
	$scope.editProfessionButton = false;
	$scope.editProfession = function(index, focusId){
		$scope.editProfessionButton = true;
		//$scope.toggleProfessionForm();
		focus(focusId);
		$scope.professional = {};
		$scope.showProfessionForm = true;
		$scope.professional.company = index.company;
		$scope.professional.title = index.title;
		var startDate = index.start_date.date.substring(0,10);
		var dtArray = startDate.split("-");
		var dtDay = parseInt(dtArray[2]);
		var dtMonth = parseInt(dtArray[1]);
		var dtYear = parseInt(dtArray[0]);
		$scope.professional.yearStart  = dtYear;
		$scope.professional.monthStart = $scope.months[dtMonth-1];
		$scope.professional.dayStart = dtDay;
		var endDate = index.end_date.date.substring(0,10);
		var enddtArray = endDate.split("-");
		var enddtDay = parseInt(enddtArray[2]);
		var enddtMonth = parseInt(enddtArray[1]);
		var enddtYear = parseInt(enddtArray[0]);
		$scope.professional.yearEnd = enddtYear;
		$scope.professional.monthEnd = $scope.months[enddtMonth-1];
		$scope.professional.dayEnd = enddtDay;
		$scope.professional.currently_working = index.currently_working;
		$scope.professional.headline = index.headline;
		$scope.professional.location = index.location;
		$scope.professional.description = index.description;
		for (var i = 0; i < $scope.visibility.length; i++) {
			if($scope.visibility[i].id === index.visibility_type){
				$scope.professional.visibility = $scope.visibility[i];
			}
		};
		$scope.professional.id = index.id;
		$scope.professionFocus = true;
	};

	var timer;
	// Delete the job
	$scope.deleteProfession = function(index,id){
		var opts = {};
		opts.user_id = index.user_id;
		opts.type = 1;
		opts.id = index.id;
		angular.element(".deleteProfession"+id).css("display", "none");
		$scope.wait = true;
		$scope.errorClass = "";
		$scope.professionMessage = "";
		$timeout.cancel(timer);
		//$scope.toggleProfessionForm();
		$scope.showProfessionForm = false;
		ProfileService.deleteProfession(opts,function(data){
			$scope.wait = false;
			if(data.code == 101 && data.message == "SUCCESS"){
				var indexNo = $scope.professionalDetails.indexOf(index);
				$scope.professionalDetails.splice(indexNo,1);
				$scope.errorClass = "text-center text-success";
				$scope.professionMessage = $scope.i18n.profile.edit_profile.job_successfully_deleted;
				timer = $timeout(function(){
					$scope.errorClass = "";
					$scope.professionMessage = "";
				},15000);
			}else{
				angular.element("#deleteProfession"+id).css("display","block");
			}
		});
	};

	// Show Stydy name suggestion
	$('#companySearch').keydown(function(event) {
		var model = $scope.searchText;
		if(currentTimeout) {
		$timeout.cancel(currentTimeout);
		}
		currentTimeout = $timeout(function(){
			if(event.which != 13){ 
				$scope.companySuggestion();
			}
		}, DELAY_TIME_BEFORE_POSTING)
    });
	$scope.companies = [];
	$scope.companySuggestion = function(){
		var opts = {};
   	    opts.name=$scope.professional.company;
   	    opts.type= "company";
   	    opts.session_id = APP.currentUser.id;
   	    $scope.cancelCompanyRequest = false;
   	    ProfileService.searchSuggestion(opts, function(data){
   	    	if(data.code === 101 && data.message === "SUCCESS"){
   	    		if($scope.cancelCompanyRequest === false){
   	    			$scope.companies = data.data;
   	    		}
   	    	}
   	    });
	};

	// Add selected Company

	$scope.professional.company = "";
	$scope.addCompany = function(index){
		//$scope.education.Field_Of_Study = "";
		$scope.professional.company = index.name;
		$scope.companyIndex = -1;
		$scope.companies = [];
	};

	$scope.companyIndex = -1;
	$scope.companyDropDown = function(event){
	    if(event.keyCode===40){
	        event.preventDefault();
	        if($scope.companyIndex+1 !== $scope.companies.length){
	            $scope.companyIndex++;
	        }
	    }else if(event.keyCode===38){
	        event.preventDefault();
	        if($scope.companyIndex-1 !== -1){
	            $scope.companyIndex--;
	        }
	    }
	    else if(event.keyCode===13){
	        $scope.addCompany($scope.companies[$scope.companyIndex]);
	    }
	};

	//clear company list 
	$scope.cancelCompanyRequest = false;
	$scope.clearCompanyList = function(){
		$scope.cancelCompanyRequest = true;
		$timeout(function(){
			$scope.companies = [];
		},500);
	};

	// Show Title
	$('#jobTitle').keydown(function(event) {
		var model = $scope.searchText;
		if(currentTimeout) {
		$timeout.cancel(currentTimeout);
		}
		currentTimeout = $timeout(function(){
			if(event.which != 13){ 
				$scope.titleSuggestion();
			}
		}, DELAY_TIME_BEFORE_POSTING)
    });
	$scope.titles = [];
	$scope.titleSuggestion = function(){
		var opts = {};
   	    opts.name=$scope.professional.title;
   	    opts.type= "jobtitle";
   	    opts.session_id = APP.currentUser.id;
   	    $scope.cancelJobTitlerequest = false;
   	    ProfileService.searchSuggestion(opts, function(data){
   	    	if(data.code === 101 && data.message === "SUCCESS"){
   	    		if($scope.cancelJobTitlerequest === false){
   	    			$scope.titles = data.data;
   	    		}
   	    	}
   	    });
	};

	// Add selected Company

	$scope.professional.title = "";
	$scope.addTitle = function(index){
		$scope.professional.title = index.name;
		$scope.titleIndex = -1;
		$scope.titles = [];
	};

	$scope.titleIndex = -1;
	$scope.jobTitleDropDown = function(event){
	    if(event.keyCode===40){
	        event.preventDefault();
	        if($scope.titleIndex+1 !== $scope.titles.length){
	            $scope.titleIndex++;
	        }
	    }else if(event.keyCode===38){
	        event.preventDefault();
	        if($scope.titleIndex-1 !== -1){
	            $scope.titleIndex--;
	        }
	    }
	    else if(event.keyCode===13){
	        $scope.addTitle($scope.titles[$scope.titleIndex]);
	    }
	};

	// clear job Title list
	$scope.cancelJobTitlerequest = false;
	$scope.clearJobTitle = function(){
		$scope.cancelJobTitlerequest = true;
		$timeout(function(){
			$scope.titles = [];
		},500);
	};

	// Show the Catageory Form
	$scope.showCatageoryForm = false;
	$scope.toogleCatageory = function(){
		$scope.cathaserror  = false;
		$scope.catkeyerror  = false;
		$scope.catErrClsMsg = '';
		$scope.catErrCls = '';
		$scope.editCategoryButton = false;
		$scope.selectedCategory = "";
		$scope.categoryKeyword = "";
		$scope.keywordList = [];
		if($scope.showCatageoryForm === false){
			$scope.showCatageoryForm = true;
		}else {
			$scope.showCatageoryForm = false;
		}
	};

	// Search Category 
	var DELAY_TIME_BEFORE_POSTING = 300;
    var currentTimeout = null;
    $scope.searchicn = '';
    $scope.showCatLoading = false;
	$scope.categories = [];
	$scope.$watch('currentLanguage', function(newValue, oldValue) {
		$scope.searchCatagory(newValue);
		$timeout(function(){
	    	$scope.degrees = $scope.i18n.profile.degree;
	    	$scope.relationshipstatus = $scope.i18n.profile.relationshipstatus;
	    	$scope.visibility = $scope.i18n.profile.profile_visibility;
	    	$scope.relatives = $scope.i18n.profile.relationtype;
	    	$scope.months = $scope.i18n.profile.months;
		},400);
	});


	$scope.searchCatagory = function(currentLanguage){
		var opts = {};
		opts.lang_code = currentLanguage;
		opts.session_id = APP.currentUser.id;
		$scope.cancelCategoryRequest = false;
		ProfileService.searchCatagory(opts,function(data){
			if(data.code === 101 && data.message === 'SUCCESS'){
				if(data.data.length > 0){
					$scope.categories = data.data;
				}
				$scope.showCatLoading = false;
			}
		});
	};
	$scope.searchCatagory($scope.currentLanguage);

	// enable disable keyword box
	$scope.enableKeyword = true;
	$scope.focusKeyword = function(){
		if($scope.selectedCategory === undefined || $scope.selectedCategory === "" || $scope.selectedCategory === null){
			$scope.enableKeyword = true;
			$scope.editCategoryButton = false;
		}else{
			$scope.enableKeyword = false;
		}
	};


	// Search keyword for particular catagory
	$scope.showCatKeyLoading = false;
	$scope.srchkeyicn = '';
	$('#categoryKeyword').keydown(function(event) {
		if(currentTimeout) {
			$timeout.cancel(currentTimeout);
		}
		currentTimeout = $timeout(function(){
			if(event.which != 13){ 
				$scope.searchKeyword();
			}
		}, DELAY_TIME_BEFORE_POSTING)
	});

	$scope.keywords = [];
	$scope.searchKeyword = function(){
		var opts = {};
		opts.category_id = $scope.selectedCategory.id.toString();
		opts.session_id = APP.currentUser.id;
		opts.keyword = $scope.categoryKeyword;
		$scope.cancelKeywordRequest = false;
		$scope.showCatKeyLoading = true;
		ProfileService.searchCatagoryKeyword(opts,function(data){
			$scope.showCatKeyLoading = false;
			if(data.code === 101 && data.message === "SUCCESS"){
				if($scope.cancelKeywordRequest === false){
					$scope.keywords =  data.data.keyword;
				}
			}
		});
	};

	$scope.keywordIndex = -1;
	$scope.keywordKeyDown=function(event){
	    if(event.keyCode===40){
	        event.preventDefault();
	        if($scope.keywordIndex+1 !== $scope.keywords.length){
	            $scope.keywordIndex++;
	        }
	    }
	    else if(event.keyCode===38){
	        event.preventDefault();
	        if($scope.keywordIndex-1 !== -1){
	            $scope.keywordIndex--;
	        }
	    }
	    else if(event.keyCode===13){
	       if($scope.keywords[$scope.keywordIndex] === undefined ){
	       		if($scope.categoryKeyword.trim() !== ''){
                   var opts = {};
                   		opts.user_id = APP.currentUser.id;
                   		opts.keyword = $scope.categoryKeyword;

               		ProfileService.addKeywords(opts,function(data){
						// if(data.code === 101 && data.message === 'SUCCESS'){
						// }
					});
               }
		       $scope.storeKeyword($scope.categoryKeyword);
		   }else{
		       $scope.storeKeyword($scope.keywords[$scope.keywordIndex]);
		   }
	    }
	};

	// Clear keyword List
	$scope.cancelKeywordRequest = false;
	$scope.clearKeyList = function(){
		$scope.cancelKeywordRequest = true;
		$timeout(function(){
			$scope.keywords = [];
		},500);
	}

	// Store Keyword
	$scope.categoryKeyword = "";
	$scope.keywordList = [];
	$scope.storeKeyword = function(index){
		$scope.keywords = [];
		$scope.keywordIndex = -1;
		$scope.categoryKeyword = "";
		if( typeof(index) === 'object'){
			if($scope.keywordList.indexOf(index.name) === -1){
		   		$scope.keywordList.push(index.name);
		   	}
		}else{
			if(index === '' || index === undefined ){
				return false;
			}else{
				if($scope.keywordList.indexOf(index) === -1){
					$scope.keywordList.push(index);
				}
			}
  		}
	};

	//Clear keyword array List
	$scope.clearKeywordList = function(){
		$timeout(function(){
			$scope.keywords = [];
		},500);
		
	};

	//Remove keyword from the array
	$scope.removeKeyword = function(index){
		//var keyIndex = $scope.keywordList.indexOf(index);
		$scope.keywordList.splice(index,1);
	};

	// Save Category form
	$scope.saveCat = false;
	$scope.saveCategory = function(type){
		$scope.cathaserror  = false;
		$scope.catkeyerror  = false;
		$scope.catErrClsMsg = '';
		$scope.catErrCls = '';
		$scope.saveCat = true;
		var catId = $scope.selectedCategory.id;
		var catKey = $scope.keywordList;
		if (catId === undefined || catId === '') {
            $scope.catErrClsMsg = $scope.i18n.editprofile.invalidCat;
            $scope.cathaserror  = true;
            $scope.catErrCls = 'text-red text-center';
            $timeout(function(){
		   		$scope.catErrCls = "";
		   		$scope.catErrClsMsg = "";
			},15000);
            return false;
        }

		if ($scope.keywordList === undefined || $scope.keywordList.length === 0 || $scope.keywordList === '') {
            $scope.catErrClsMsg = $scope.i18n.editprofile.invalidCatKey;
            $scope.catkeyerror  = true;
            $scope.catErrCls = 'text-red text-center';
            $timeout(function(){
		   		$scope.catErrCls = "";
		   		$scope.catErrClsMsg = "";
			},15000);
            return false;
        } 
		for(var i=0;i<$scope.allCatagories.length;i++){
			if($scope.allCatagories[i].category_id != catId){
				continue;
			}else if($scope.allCatagories[i].keywords == catKey){
				if(type === ''){
					$scope.catErrClsMsg = $scope.i18n.editprofile.duplicateCatKey;
					$scope.catkeyerror  = true;
					$scope.catErrCls = 'text-red text-center';
					$timeout(function() {
						$scope.catErrCls = "";
						$scope.catErrClsMsg = "";
					}, 15000);
					return false;
				}else {
					continue;
				}
			}
		}
        var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.type = 1;
		if(type === ''){
			opts.id = '';
		}else {
			opts.id = $scope.categoryId;
		}
		opts.category_id = $scope.selectedCategory.id;
		opts.keywords = $scope.keywordList.toString();
		opts.lang_code = $scope.currentLanguage;
		$scope.wait = true;
		$timeout.cancel(timer);
		$scope.catErrCls = "";
		$scope.catErrClsMsg = "";
		ProfileService.saveCategory(opts,function(data){
			$scope.wait = false;
			if(data.code === "101" && data.message === "SUCCESS"){
				$scope.editCategoryButton = false;
				$scope.showCatageoryForm = false;
				$scope.enableKeyword = true;
				$scope.keywordList = [];
				if (type === ''){
					$scope.allCatagories.push(data.data);
				}else{
					var indexNo = 0;
					for (var i = 0; i < $scope.allCatagories.length; i++) {
						if($scope.allCatagories[i].id === data.data.id){
							indexNo = i;
							break;
						}
					}
					$scope.allCatagories.splice(indexNo,1);
					$scope.allCatagories.push(data.data);
				}
				$scope.catErrCls = "text-success text-center";
				$scope.catErrClsMsg = $scope.i18n.editprofile.category_save;
				$timeout(function(){
					$scope.catErrCls = "";
					$scope.catErrClsMsg ="";
				},15000);
				$scope.categoryKeyword = "";
				$scope.categorySearch = "";
				$scope.saveCat = false;
			}else{
				$scope.catErrCls = "text-red text-center";
				$scope.catErrClsMsg = $scope.i18n.editprofile.category_service_error;
				$timeout(function(){
					$scope.catErrCls = "";
					$scope.catErrClsMsg = "";
				}, 15000);
			}
	 	});
	 };

	// Edit selected category 
	$scope.editCategoryButton = false;
	$scope.categoryId = "";
	$scope.editCatagory = function(index){
		$scope.editCategoryButton = true;
		$scope.enableKeyword = false;
		for (var i = 0; i < $scope.categories.length; i++) {
			if(index.category_name === $scope.categories[i].category_name){
				$scope.selectedCategory = $scope.categories[i];
			}
		};
		if(index.keywords.length > 0){
			$scope.keywordList = index.keywords.split(",");
		}
		$scope.categoryId = index.id;
		$scope.showCatageoryForm = true;
		focus('selectCategoryFocus');
	};

	//Delete categories
	$scope.isDelCat = [];
	$scope.deleteCategories = function(index){
		var category =  $scope.allCatagories[index];
		$scope.isDelCat[index] = true;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.type = 1;
		opts.id = category.id;
		$scope.selectedCategory = "";
		$scope.categoryKeyword = "";
		$scope.showCatageoryForm = false;
		$scope.keywordList = [];
		ProfileService.deleteCategory(opts,function(data){
			if(data.code === "101"){
				$scope.allCatagories.splice(index,1);
				$scope.catErrClsMsg = $scope.i18n.editprofile.category_Delete;
	            $scope.catErrCls = 'text-success text-center';
	            $timeout(function(){
			   		$scope.catErrCls = "";
			   		$scope.catErrClsMsg = "";
				},15000);
				$scope.isDelCat[index] = false;
			}else{
				$scope.catErrClsMsg = $scope.i18n.editprofile.category_service_error;
	            $scope.catErrCls = 'text-red text-center';
	            $timeout(function(){
			   		$scope.catErrCls = "";
			   		$scope.catErrClsMsg = "";
				},15000);
				$scope.isDelCat[index] = false;
			}
		});
	};



	$scope.convertString = function(stringArray){
		if(stringArray.length > 0){
			return stringArray.split(',');
		}else{
			return [];
		}
	};

	/*
	*
	* Select relation to friendpe
	*
	*/
	var opt ={};	

	$scope.searchFrind ='';
	var DELAY_TIME_BEFORE_POSTING = 300;
    var currentTimeout = null;

	$('#searchrelative').keydown(function(event) {
		if(currentTimeout) {
			$timeout.cancel(currentTimeout);
		}
		currentTimeout = $timeout(function(){
			if(event.which != 13){ 
				$scope.selectFriend();
			}
		}, DELAY_TIME_BEFORE_POSTING)
	});
	$scope.relativeSuggesions = [];

	$scope.noFriend = false;
	// Search Friend for selecting relation //
	$scope.selectFriend = function(){
		$scope.noFriend = false;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.user_name = $scope.searchRelative;
		$scope.cancelRelativeRequest = false;
		$scope.relativeloader = true;
		ProfileService.selectFriend(opts,function(data){
			if(data.code === 101 && data.message === "SUCCESS"){
				if($scope.cancelRelativeRequest === false){
					$scope.relativeloader = false;
					$scope.relativeSuggesions = [];
					var temp = data.data.users.user_info;
					if(temp.length > 0 ){
						$scope.relativeSuggesions = temp;
					}else{
						$scope.noFriend = true;
					}
				}
			}
		});
	};

	//keyUpDown selection functionality 
	$scope.selectIndex = -1;
	$scope.downUpKeyPress=function(event){
		if($scope.searchRelative.length == 0){
			$scope.storeRelative = {};
			$scope.relativeSuggesions = [];
		}
	    if(event.keyCode===40){
	        event.preventDefault();
	        if($scope.selectIndex+1 !== $scope.relativeSuggesions.length){
	            $scope.selectIndex++;
	        }
	    }
	    else if(event.keyCode===38){
	        event.preventDefault();
	        if($scope.selectIndex-1 !== -1){
	            $scope.selectIndex--;
	        }
	    }
	    else if(event.keyCode===13){
	        $scope.selectedRelative($scope.relativeSuggesions[$scope.selectIndex]);
	    }
	}

	// Storing the selected friend 
	$scope.searchRelative = "";
	$scope.storeRelative = {};
	$scope.selectedRelative = function(index){
		$scope.relativeSuggesions = [];
		$scope.searchRelative = "";
		$scope.storeRelative = {};
		if(index != undefined){
			$scope.storeRelative = index;
			$scope.searchRelative = index.firstname + ' ' + index.lastname;
		}
	};

	/* save Relative */
	/*$scope.$watch('currentLanguage', function(newValue, oldValue) {
		$scope.relationshipstatus = $scope.i18n.profile.relationshipstatus;
	});*/
	
    $scope.wait = false;
	$scope.saveRelative = function(type){
		$scope.relativeRelError = false;
		$scope.relativeFrndError = false;
		$scope.relativeError = false;
		if($scope.searchRelative === undefined || $scope.searchRelative === '' || $scope.searchRelative === null){
			$scope.errorClass = 'text-red text-center';
			$scope.relativeMessage = $scope.i18n.profile.edit_profile.please_enter_friend;
			$scope.relativeFrndError = true;
			timer = $timeout(function(){
		   		$scope.errorClass = "";
		   		$scope.relativeMessage = "";
		   	},15000);
			return false;
		}else if($scope.storeRelative.user_id=== undefined || $scope.storeRelative.user_id === '' || $scope.storeRelative.user_id === null){
			$scope.errorClass = 'text-red text-center';
			$scope.relativeMessage = $scope.i18n.profile.edit_profile.please_enter_friend;
			timer =  $timeout(function(){
		   		$scope.errorClass = "";
		   		$scope.relativeMessage = "";
		   	},15000);
			return false;
		}else if($scope.releativeSearch=== undefined || $scope.releativeSearch=== '' || $scope.releativeSearch === null){
			$scope.errorClass = 'text-red text-center';
			$scope.relativeMessage = $scope.i18n.profile.edit_profile.please_enter_relation;
			$scope.relativeRelError = true;
			timer =  $timeout(function(){
		   		$scope.errorClass = "";
		   		$scope.relativeMessage = "";
		   	},15000);
			return false;
		}

		$scope.relativesavebtn=true;
		var opts = {};
		if(type === ''){
			opts.id = '';
		}else{
			opts.id = $scope.RelativeId;
		}
		opts.user_id = APP.currentUser.id;
		opts.type = 1;
		opts.relative_id = $scope.storeRelative.user_id;
		opts.relation = $scope.releativeSearch.id;
		$scope.wait = true;
	   	$scope.errorClass = "";
		$scope.relativeMessage = "";
		$timeout.cancel(timer);
		ProfileService.saveRelative(opts,function(data){
			$scope.wait = false;
			if(data.code == "101" && data.message == "SUCCESS"){
				if (type === ''){
					$scope.allRelatives.push({"id":data.data.id,"user_id":data.data.user_id,"relative_id":data.data.relative_id,"lastname":data.data.relative_detail[0].lastname,"firstname":data.data.relative_detail[0].firstname,"email":data.data.relative_detail[0].profileImg,"profileImg":data.data.relative_detail[0].profileImg,"relationName":data.data.relative_detail[0].relationName , "relationId":data.data.relation});
					$scope.relativeMessage = $scope.i18n.profile.edit_profile.realtion_saved;

				}else{
					var indexNo = 0;
					for (var i = 0; i < $scope.allRelatives.length; i++) {
						if($scope.allRelatives[i].id === data.data.id){
							indexNo = i;
							break;
						}
					}
					$scope.allRelatives.splice(indexNo,1);
					$scope.allRelatives.push({"id":data.data.id,"user_id":data.data.user_id,"relative_id":data.data.relative_id,"lastname":data.data.relative_detail[0].lastname,"firstname":data.data.relative_detail[0].firstname,"email":data.data.relative_detail[0].profileImg,"profileImg":data.data.relative_detail[0].profileImg,"relationName":data.data.relative_detail[0].relationName,  "relationId":data.data.relation});
					$scope.relativeMessage = $scope.i18n.profile.edit_profile.relation_updated;
			}
				$scope.errorClass = 'text-success text-center';
				timer = $timeout(function(){
			   		$scope.errorClass = "";
			   		$scope.relativeMessage = "";
		   		},15000);
				$scope.relativesavebtn=false;
				$scope.editRelativeButton = false;
				$scope.searchRelative= "";
				$scope.storeRelative={};
				$scope.releativeSearch={};
				$scope.toogleRelative();
			}else {
				$scope.errorClass = 'text-red text-center';
				$scope.relativeMessage = $scope.i18n.profile.edit_profile.invalid_request;
				timer = $timeout(function(){
			   		$scope.errorClass = "";
			   		$scope.relativeMessage = "";
		   		},15000);
			}
		});
	};

	// show hide relative form
	$scope.showRelativeForm = false;
	$scope.toogleRelative = function(){
		$scope.errorClass = "";
		$scope.relativeMessage = "";
		$scope.relativeRelError = false;
		$scope.relativeFrndError = false;
		$scope.searchRelative = '';
		$scope.releativeSearch  = '';
		$scope.editRelativeButton = false;
		if($scope.showRelativeForm === false){
			$scope.showRelativeForm = true;
		}else {
			$scope.showRelativeForm = false;
		}
	};

	//edit relative
	$scope.editRelativeButton = false;
	$scope.editRelative = function(index){ 
		//$scope.toogleRelative();
		$scope.showRelativeForm = true;
		$scope.editRelativeButton = true;
		$scope.searchRelative = index.firstname + ' ' + index.lastname;
		$scope.releativeSearch = $scope.relatives[index.relationId - 1];
		/*for(var i=0; i < $scope.relatives.length; i++){ 
		    if(index.relationName === $scope.relatives[i].name){
			    $scope.releativeSearch = $scope.relatives[i];
		    }
		}*/
		$scope.storeRelative = {"user_id":index.relative_id,"firstname":index.firstname,"lastname":index.lastname, "relationId":index.relationId};
		$scope.RelativeId = index.id;
		focus('searchrelative');
	};

	// Delete Relative
	$scope.deleteRelative = function(index,id){
		var opts = {};
		opts.user_id = index.user_id;
		opts.type = 1;
		opts.id = index.id;
		$scope.wait = true;
		angular.element('.deleteRelative'+id).css('display','none');
		$scope.errorClass = "";
		$scope.relativeMessage = "" ;
		$timeout.cancel(timer);
		$scope.searchRelative = '';
		$scope.releativeSearch  = '';
		$scope.editRelativeButton = false;
		$scope.showRelativeForm = false;
		ProfileService.deleteRelative(opts,function(data){
			$scope.wait = false;
			if(data.code == 101 && data.message == "SUCCESS"){
				var indexNo = $scope.allRelatives.indexOf(index);
				$scope.allRelatives.splice(indexNo,1);
				$scope.errorClass = "text-success text-center";
				$scope.relativeMessage = $scope.i18n.profile.edit_profile.relation_successfully_deleted;
				timer = $timeout(function(){
					$scope.errorClass = "";
					$scope.relativeMessage = "" ;
				},15000);

			}else{
				angular.element('.deleteRelative'+id).css('display','block');
				$scope.errorClass = "text-red text-center";
				$scope.relativeMessage = $scope.i18n.profile.edit_profile.error_in_relation_deletion;
				timer = $timeout(function(){
					$scope.errorClass = "";
					$scope.relativeMessage = "" ;
				},15000);
			}
		});
	};

	// Clear relative array list
	$scope.cancelRelativeRequest = false;
	$scope.clearRelative = function(){
		$scope.relativeloader = false;
		$scope.cancelRelativeRequest = true;
		$scope.noFriend = false;
		$timeout(function(){
			$scope.relativeSuggesions = [];
		},500);
	};

	$scope.$watch('searchRelative',function(val){
        if(val === '') {
            $scope.editRelativeButton = false;
        }
    });

	// Show skill Textbox
	$scope.addSkillBox = false;
	$scope.viewskill= true;
	$scope.temprarySkillCheck = false;
	$scope.toggleSkillForm = function(){
		$scope.skillMesError = false;
		$scope.skillMessage = "";
		$scope.skillClass ="";
		$scope.storeSkills = [];
		if($scope.storeSkillss !== undefined){
			if($scope.storeSkillss.length > 0){
				for(var i=0; i < $scope.storeSkillss.length; i++){
					$scope.storeSkills.push($scope.storeSkillss[i]);
				}
			}
		}
		if($scope.viewskill === false){
			$scope.viewskill= true;
			if($scope.storeSkillss === undefined){
    			$scope.emptyskill = true;
    		}
		}else{
			$scope.viewskill= false;
		}
		if($scope.addSkillBox === false){
			$scope.addSkillBox = true;
		}else{
			$scope.addSkillBox = false;
		}
		
	};

	$scope.closeSkillForm = function(){
		$scope.skillMesError = false;
		$scope.skillMessage = "";
		$scope.skillClass ="";
		if($scope.temprarySkillCheck == true){
			if($scope.storeTempSkill.length > 0){
				for(var i=0;i<$scope.storeTempSkill.length;i++){
					if($scope.storeSkills.indexOf($scope.storeTempSkill[i]) == -1){
						$scope.storeSkills.push($scope.storeTempSkill[i]);
					}
				}
				$scope.temprarySkillCheck = false;
			}
		}
		
		$scope.storeTempSkill = [];
		

		if($scope.viewskill === false){
			$scope.viewskill= true;
			if($scope.storeSkillss === undefined){
    			$scope.emptyskill = true;
    		}
		}else{
			$scope.viewskill= false;
		}
		if($scope.addSkillBox === false){
			$scope.addSkillBox = true;
		}else{
			$scope.addSkillBox = false;
		}
		
	};


	var DELAY_TIME_BEFORE_POSTING = 300;
	$('#searchSkill').keydown(function(event) {
    
      var model = $scope.searchFrind;
      //var poster = model($scope);
      if(currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
      currentTimeout = $timeout(function(){
      	if(event.which != 13){ 
        	$scope.searchSkills();
        }
      }, DELAY_TIME_BEFORE_POSTING)
      });

	$scope.skillLoader = false;
	$scope.searchSkills = function(){
		$scope.skillLoader = true;
		var opts = {};
		opts.type = "skill";
		opts.name = $scope.searchSkill;
		opts.session_id = APP.currentUser.id;
		$scope.cancelSkillRequest = false;
		ProfileService.searchSuggestion(opts,function(data){
			if(data.code === 101 && data.message === "SUCCESS"){
				if($scope.cancelSkillRequest === false){
					$scope.skills = data.data;
				}
				$scope.skillLoader = false;
			}else{
				$scope.skillLoader = false;
			}
		});
	};


	// Save the user skills
	$scope.addSkill = function(){
		$scope.skillMesError = false;
		var opts = {};
		if($scope.storeSkills === undefined || $scope.storeSkills == null || $scope.storeSkills.length === 0){
			$scope.skillMessage = $scope.i18n.skill.insert_msg;
			$scope.skillMesError = true;
    		$scope.skillClass = "text-red text-center";
    		timer = $timeout(function(){
    			$scope.skillMessage = "";
    			$scope.skillClass ="";
    		},15000);
    		return false;
		}
		opts.user_id = APP.currentUser.id;
		opts.skills = $scope.storeSkills.toString();
		$scope.wait = true;
		//$timeout.cancel(timer);
		$scope.skills = [];
		ProfileService.addUserSkills(opts,function(data){
			if(data.code === 101 && data.message === "SUCCESS"){
				$scope.temprarySkillCheck = false;
				$scope.storeSkillss = data.data.skills.skills.split(',');
				$scope.wait = false;
				$scope.toggleSkillForm();
				$scope.emptyskill=false;
				$scope.skillMessage = $scope.i18n.skill.save_msg;
	    		$scope.skillClass = "text-success text-center";
	    		$timeout(function(){
	    			$scope.skillMessage = "";
	    			$scope.skillClass ="";
	    		},15000);
	    		$scope.cancelSkillRequest = true;
	    		$scope.viewskill=true;
			}else{
				$scope.wait = false;
				$scope.skillMessage = data.message;
	    		$scope.skillClass = "text-red text-center";
	    		timer = $timeout(function(){
	    			$scope.skillMessage = "";
	    			$scope.skillClass ="";
	    		},15000);
			}
		});
	};

	// Select the drop down on Upper and lower key press
	$scope.skillIndex = -1;
	$scope.pressDownKey=function(event){
        if(event.keyCode===40){
            event.preventDefault();
            if($scope.skillIndex+1 !== $scope.skills.length){
                $scope.skillIndex++;
            }
        }
        else if(event.keyCode===38){
            event.preventDefault();
            if($scope.skillIndex-1 !== -1){
                $scope.skillIndex--;
            }
        }
        else if(event.keyCode===13){
        	$scope.emptyskill=false;
        	if($scope.skillIndex === -1){
        		$scope.addToSelectedSkill({name:$scope.searchSkill});
        	}else{
            	$scope.addToSelectedSkill($scope.skills[$scope.skillIndex]);
            }
        }
    };


    // Store the selected skills
    $scope.storeSkills = [];
    $scope.addToSelectedSkill = function(index){
    	$scope.skillMessage = "";
    	$scope.skillClass = "";
    	$scope.skillIndex = -1;
    	$timeout.cancel(timer);
    	if($scope.storeSkills.indexOf(index.name) === -1){
    		if(index.name === undefined || index.name === null || index.name === ''){

    		}else{
    			$scope.storeSkills.push(index.name);
    		}
    		//$scope.addSkill($scope.storeSkills);
    		$scope.searchSkill = "";
    	}else{
    		$scope.skillMessage = $scope.i18n.skill.duplicate_msg;
    		$scope.skillClass = "text-red text-center";
    		timer = $timeout(function(){
    			$scope.skillMessage = "";
    			$scope.skillClass = "";
    		},15000);
    	}

    	$timeout(function(){
    		$scope.skills = [];
    	},500);
    };

    // Clear the skill list and stop it for showing more suggestion
    $scope.cancelSkillRequest = false;
    $scope.clearSkillList = function(){
    	$scope.cancelSkillRequest = true;
    	$scope.skillIndex = -1;
    	$timeout(function(){
    		$scope.skills = [];
    	},500);
    };
    $scope.emptyskill = true;
    //get Skill of user
    $scope.skills = [];
    $scope.getSkills = function(){
    	var opts = {};
    	opts.user_id = APP.currentUser.id;
    	ProfileService.getUserSkills(opts,function(data){
    		if(data.code === 101 && data.message === "SUCCESS"){
    			if(data.data.skills.skills.length > 0){
    				$scope.storeSkillss = data.data.skills.skills.split(',');
    				//$scope.storeSkills = data.data.skills.skills.split(',');
					$scope.emptyskill=false;
				}else{
					$scope.emptyskill=true;
    			}
    		}
    	});
    };


    $scope.getSkills();

    $scope.storeTempSkill = [];
    //Remove the selceted skill
    $scope.removeSkill = function(index){
    	$scope.addSkillBox = true;
    	$scope.storeTempSkill.push($scope.storeSkills[index]);
    	$scope.temprarySkillCheck = true;
    	$scope.storeSkills.splice(index,1);
    };
	$scope.initialize = function () {
		if (latitudeMap) {
			var mapOptions = {
				center: new google.maps.LatLng(latitudeMap, longitudeMap),
				zoom: 6,
				scrollwheel: false,
				navigationControl: false,
   				mapTypeControl: false,
   				scaleControl: false,
   				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		} else {
			var mapOptions = {
				center: new google.maps.LatLng(-33.8688, 151.2195),
				zoom: 6,
				scrollwheel: false,
				navigationControl: false,
   				mapTypeControl: false,
   				scaleControl: false,
   				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		}

		var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

		var input = (document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map);

		var current =  new google.maps.LatLng(latitudeMap, longitudeMap);
		var infowindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			map: map,
			position: current,
			anchorPoint: new google.maps.Point(0, -20)
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var countryPlace = autocomplete.getPlace();
			document.getElementById("lat").value = countryPlace.geometry.location.lat();
			document.getElementById("lon").value = countryPlace.geometry.location.lng();
			document.getElementById("mapplace").value = countryPlace.formatted_address;

			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  
			}
			marker.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map, marker);
		});

		//click to swlct the place on map
		/*google.maps.event.addListener(map, "click", function(event){
            // place a marker
            console.log(event);
            marker.setVisible(false);
            //placeMarker(event.latLng);
            document.getElementById("lat").value = event.latLng.k;
			document.getElementById("lon").value = event.latLng.D;
			//document.getElementById("mapplace").value = countryPlace.formatted_address;
			marker = new google.maps.Marker({
                    position: event.latLng,
                    map: map,
                    draggable: true
            });
            //map.setCenter(marker.getPosition());
        });*/

		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);
	};
	$scope.initializesecond = function () {
		var mapOptions = {
			center: new google.maps.LatLng(latitudeMap, longitudeMap),
			zoom: 8,
			scrollwheel: false,
			navigationControl: false,
   			mapTypeControl: false,
   			scaleControl: false,
    		draggable: false
		};
		var map2 = new google.maps.Map(document.getElementById('map-canvas-second'),mapOptions);

		var input = (document.getElementById('pac-input'));

		var types = document.getElementById('type-selector');
		map2.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		map2.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map2);

		var infowindow = new google.maps.InfoWindow();
		var marker2 = new google.maps.Marker({
			map2: map2,
			anchorPoint: new google.maps.Point(0, -29)
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			infowindow.close();
			marker2.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}
			var countryPlace = autocomplete.getPlace();
			document.getElementById("lat1").value = countryPlace.geometry.location.k;
			document.getElementById("lon1").value = countryPlace.geometry.location.D;
			document.getElementById("mapplace1").value = countryPlace.formatted_address;

			if (place.geometry.viewport) {
				map2.fitBounds(place.geometry.viewport);
			} else {
				map2.setCenter(place.geometry.location);
				map2.setZoom(17);  
			}
			marker2.setIcon(({
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker2.setPosition(place.geometry.location);
			marker2.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			infowindow.open(map2, marker2);
		});

		function setupClickListener(id, types) {
			var radioButton = document.getElementById(id);
		}

		setupClickListener('changetype-all', []);
		setupClickListener('changetype-establishment', ['establishment']);
		setupClickListener('changetype-geocode', ['geocode']);
	}

}]);
