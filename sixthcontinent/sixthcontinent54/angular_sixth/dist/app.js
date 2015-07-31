app = angular.module('SixthContinent', ['ngRoute', 'angularFileUpload', 'ipCookie','ngCookies', 'linkDirectives', 'google-maps', 'ui.bootstrap', 'infinite-scroll', 'perfect_scrollbar', 'pascalprecht.translate', 'ngDialog', 'djds4rce.angular-socialshare', 'ImageCropper', 'nvd3ChartDirectives']).run(function($FB){
  $FB.init(APP.fbId);
});

//Define constant for email validation 
app.constant('EMAILPATTERN', { "emailPattern": (APP.emailPattern) });
app.controller('AppController', ['$cookieStore', '$rootScope', 'ipCookie','$scope', '$location', '$translate', '$timeout', 'UserService', 'ProfileService', 'TranslationService', 'TopLinkService', '$compile', '$window', 'verifyUser',
	function ($cookieStore, $rootScope, ipCookie, $scope, $location, $translate, $timeout, UserService, ProfileService, TranslationService, TopLinkService, $compile, $window, verifyUser) {
	$scope.logoutLoader = false;
	$scope.siteTitle = APP.siteTitle;
	$scope.languageOptions = APP.languageOptions;
	$scope.baseUrl = APP.base_url;
	$rootScope.isLoggedIn = false;
	$rootScope.isPublic = false;
	$rootScope.publicUser = [];
	var tokenUrl = $location.search().token;
	$rootScope.resetToken = '';
	$rootScope.work= true; 
	$rootScope.work2= true; 
	$scope.i18n = [];
	$scope.isSmallScreen =  false;
	$rootScope.allFriendTotal = 0;

	$scope.isActive = function(route) {
        return route === $location.path();
    }

    // making dynamic meta tag for content preview to display on google plus service
    // $rootScope.metadata = {};
    // $rootScope.metadata.image = APP.logoImg;
    // $rootScope.metadata.url = APP.metaUrl;
    // $rootScope.metadata.desc = APP.metaDes;

    //check screen for mobile devicess to show corresponding layou
    var w = angular.element($window);
   	$scope.getWindowDimensions = function () {
       return {
           'h': w.height(),
           'w': w.width()
       };
   	};
    w.bind('resize', function () {
       $scope.$apply();
   	});

    $rootScope.disableLogo = 0;
    if($location.path().indexOf('citizen_affiliation_regis') != -1){
    	$rootScope.disableLogo = 1;
    }else{
    	$rootScope.disableLogo = 0;
    }
    
	$rootScope.toggleSearch = function (even) {
		$rootScope.showNotificationList = false;
		$rootScope.showNewMessageList = false;
		$rootScope.showFriendNotificationList = false;
		$scope.scopeVar = $scope.scopeVar;
		$scope.scopeVar1 = $scope.scopeVar1;
		$scope.scopeVar2 = $scope.scopeVar2;
    };
    $rootScope.mobileY_Cord = 0;
    $rootScope.mobileX_Cord = 0;
    $rootScope.mobileView = false;
    var img = new Image();
	// Add $scope variable to store the user
	$scope.loggedInUser = ipCookie("loggedInUser");
	if( !ipCookie("loggedInUser") || !ipCookie("access_token")) {
		if(localStorage.getItem('CitizenAffiliatedObject')) {
			localStorage.setItem('CitizenAffiliatedObject', localStorage.getItem('CitizenAffiliatedObject'));
		}
		if(localStorage.getItem('ShopAffiliatedObject')) {
			localStorage.setItem('ShopAffiliatedObject', localStorage.getItem('ShopAffiliatedObject'));
		}

		if(tokenUrl != '' && tokenUrl != undefined && tokenUrl != null){
			$rootScope.resetToken = tokenUrl;
			if($location.path().replace("/", "").indexOf("verify") != -1){
			}else{
				$location.path('/reset');
			}
		} else {
			$rootScope.currentUser = {};
			$scope.loggedIn = false;
            var str = $location.path().replace("/", "");

            if($location.path().replace("/", "").indexOf("mobile/offer") != -1 || $location.path().replace("/", "").indexOf("registration") != -1 || $location.path().replace("/", "").indexOf("citizen_affiliation") != -1 || $location.path().replace("/", "").indexOf("broker_affiliation") != -1 || $location.path().replace("/", "").indexOf("unouth/post/user") != -1 || $location.path().replace("/", "").indexOf("unouth/post/shop") != -1 || $location.path().replace("/", "").indexOf("unouth/post/club") != -1 || $location.path().replace("/", "").indexOf("shop_affiliation") != -1 || $location.path().replace("/", "") == 'blshops' || str.indexOf("blshop/info") != -1 || str.indexOf("shop/home/about") != -1 || str.indexOf("shop/home/album") != -1 || str.indexOf("shop/home/image") != -1 || str.indexOf("privacy") != -1 || str.indexOf("contact/us") != -1 || str.indexOf("verify") != -1 || str.indexOf("resendlink") != -1) {
			} else {
				UserService.setHitUrl($location.path());
				$location.path('/');
			}
		}
	} else {
		if(localStorage.getItem('CitizenAffiliatedObject')) {
			localStorage.setItem('CitizenAffiliatedObject', localStorage.getItem('CitizenAffiliatedObject'));
		}
		if(localStorage.getItem('ShopAffiliatedObject')) {
			localStorage.setItem('ShopAffiliatedObject', localStorage.getItem('ShopAffiliatedObject'));
		}
		$scope.loggedIn = true;
		$rootScope.isLoggedIn = true;
		APP.currentUser = ipCookie("loggedInUser");
		APP.accessToken = ipCookie("access_token"); 
		$rootScope.currentUser = ipCookie("loggedInUser");
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.profile_type = 4;
		UserService.getBasicProfile(opts, function(data) {
			if(data.code == 101) {
				$rootScope.currentUser.basicProfile = data.data;
				$scope.selectlanguage(data.data.current_language);
				//get users credit and the total income 
				var opts4 = {};
				opts4.idcard = $rootScope.currentUser.basicProfile.user_id;
				UserService.getCreditAndIncome(opts4, function(data) {
					var currentCredit = {};
					if(data.code == 101) {
						currentCredit.totalCredit = (data.data.saldoc/1000000) ;
						currentCredit.totCreditMicro = (data.data.saldorm) + (data.data.saldorc) ;
						currentCredit.totalIncome = data.data.tot_income;
						currentCredit.totalIncomeShow = data.data.tot_income;
						//currentCredit.totalIncome = ((data.data.saldorc+data.data.saldorm)/1000000);
						$rootScope.currentUser.creditAndIncome = currentCredit;
						$screenRatio = $scope.getWindowDimensions();
						if($screenRatio.w <= '480'){
							$rootScope.mobileView = true;
							img.src = $rootScope.currentUser.basicProfile.profile_cover_img.thumb;
							img.onload= function(){
								if(img.width <= 910){
									if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord != ""){
										if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord > 100){
							                $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 3;
							            }else{
							                $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 4;
							            }
			    						$rootScope.mobileX_Cord = 0;
			    					}else{
			    						$rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
			    						$rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
			    						$rootScope.mobileX_Cord = 0;
			    						$rootScope.mobileY_Cord = 0;
			    					}
		    					}else if(img.width > 910 && img.width <= 1300 ){
		    						if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
			    						if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
							                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 4;
							            }else{
							                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 5;
							            }
			    						$rootScope.mobileY_Cord = 0;
			    					}else{
			    						$rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
			    						$rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
			    						$rootScope.mobileX_Cord = 0;
			    						$rootScope.mobileY_Cord = 0;
			    					}
		    					} else if(img.width > 1300 ){
		    						if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
			    						if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
							                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 5;
							            }else{
							                $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 6;
							            }
			    						$rootScope.mobileY_Cord = 0;
			    					}else{
			    						$rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
			    						$rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
			    						$rootScope.mobileX_Cord = 0;
			    						$rootScope.mobileY_Cord = 0;
			    					}
		    					}
		    				}
						} else if($screenRatio.w  > '480' && $screenRatio.w  < '768'){
							$rootScope.mobileView = true;
							img.src = $rootScope.currentUser.basicProfile.profile_cover_img.thumb;
							img.onload = function(){
	                            if(img.width <= 910){
		                            if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord != ""){
		                                if( $rootScope.currentUser.basicProfile.profile_cover_img.y_cord > 100){
		                                    $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 1.80;
		                                }else{
		                                    $rootScope.mobileY_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.y_cord / 2;
		                                }
		                                $rootScope.mobileX_Cord = 0;
		                            }else{
		                                $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
		                                $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
		                                $rootScope.mobileX_Cord = 0;
		                                $rootScope.mobileY_Cord = 0;
		                            }
		                        }else if(img.width > 910 && img.width <= 1300){
		                            if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
		                                if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
		                                    $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.00;
		                                }else{
		                                    $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.20;
		                                }
		                                $rootScope.mobileY_Cord = 0;
		                            }else{
		                                $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
		                                $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
		                                $rootScope.mobileX_Cord = 0;
		                                $rootScope.mobileY_Cord = 0;
		                            }
	                        	}else if(img.width > 1300){
		                            if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord != ""){
		                                if( $rootScope.currentUser.basicProfile.profile_cover_img.x_cord > 100){
		                                    $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 2.80;
		                                }else{
		                                    $rootScope.mobileX_Cord = $rootScope.currentUser.basicProfile.profile_cover_img.x_cord / 3.00;
		                                }
		                                $rootScope.mobileY_Cord = 0;
		                            }else{
		                                $rootScope.currentUser.basicProfile.profile_cover_img.x_cord = 0;
		                                $rootScope.currentUser.basicProfile.profile_cover_img.y_cord = 0;
		                                $rootScope.mobileX_Cord = 0;
		                                $rootScope.mobileY_Cord = 0;
		                            }
	                        	}
	                        }
                    	}
					}
					else{
						$rootScope.currentUser.creditAndIncome = data.data;
					}
				});
			}
			else
				$scope.logout();
		});
	}

	$scope.logout = function(){
		var opts = {};		
		opts.access_token = APP.accessToken;
		opts.session_id = APP.currentUser.id;
		UserService.logout(opts, function(data){
			APP.currentUser = {};
			$rootScope.citizenAvailableBalance = null;
			ipCookie.remove("loggedInUser");
			ipCookie.remove("access_token");
			ipCookie.remove("activeLanguage");
			$cookieStore.remove("tempStoreId");
			$rootScope.currentUser = {};
			$scope.logoutLoader = false;
			//window.location.reload();
			$location.path('/');
			$rootScope.isLoggedIn = false;
	});
	}

	$scope.showCommonError = false;
	$scope.wentWrong = function() {
		$scope.showCommonError = true;
		$timeout(function(){
			$scope.showCommonError = false;
		}, 4000);
	};

	$scope.logoutWithoutService = function(){
		APP.currentUser = {};
		$scope.loggedIn = false;
		ipCookie.remove("loggedInUser");
		ipCookie.remove("access_token");
		ipCookie.remove("activeLanguage");
		$cookieStore.remove("tempStoreId");
		$rootScope.currentUser = {};
		$scope.logoutLoader = false;
		$location.path('/');
		$rootScope.isLoggedIn = false;	
	}

	$scope.checkTrialExpired = function() {
		verifyUser.check();
	};

	//open page for Unauthorized user or hacker who try invalid request 
	$scope.notAuthorisedUser = function() {
		$location.path('/unouth/request');
	}
	
	//hide menu
	$scope.hidemainmenu = false;
		$scope.hoverInit = function() {
		$('.dropdown').hover(function() {
			//$scope.hidemainmenu = true;
		});
		}
	$scope.hideMenu = function(language) {
			$scope.hidemainmenu = false;
	}
	$scope.selectlanguage = function(language) {
		$scope.changeLanguage(language);
		$scope.currentLanguage = language;
	};

	$scope.setLanguage = function(language){
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.current_language = language
		UserService.setCurrentLang(opts, function(data){
			//console.log(data)
		});
	}

	$scope.changeLanguage = function (langKey) { 
		$cookieStore.put("activeLanguage", langKey);
		$scope.activeLanguage = $cookieStore.get("activeLanguage");
		//loading italian language module for filter
		//TODO ::  will add date filter to italian currently not working for italian
		// if($scope.activeLanguage == 'it'){
		// 	$("#localeScript").append( $compile("<script src='app/js/i18n/angular-locale_it.js'>")($scope) );
		// }
        TranslationService.getTranslation($scope, langKey);
		$translate.use(langKey);
	};
	var temp=0;
	$scope.showFlag = function(even){
		var parentNodeClass=even.target.parentNode.getAttribute('class')
		var classes = parentNodeClass.split(' ')
		if(classes.length !== 1){
			parentNodeClass = classes[0]
		}
		if(temp%2===0){
			even.target.parentNode.setAttribute('style','right:0px')
			even.target.parentNode.setAttribute('class',parentNodeClass+' flagOn')
		}else{
			even.target.parentNode.setAttribute('style','right:-50px')
			even.target.parentNode.setAttribute('class',parentNodeClass+' flagOff')
		}
		temp+=1;
	}

	if($cookieStore.get("activeLanguage")) {
		$scope.currentLanguage = $cookieStore.get("activeLanguage");
		$scope.changeLanguage($cookieStore.get("activeLanguage"));
	} else {
		$scope.currentLanguage = APP.defaultLanguage;
		$scope.changeLanguage($scope.currentLanguage);
	}

	//check if the store is registred and storeid in cookies
	if($cookieStore.get("tempStoreId")) {
		$rootScope.tempStoreId = $cookieStore.get("tempStoreId");
		$rootScope.tempUserId = $cookieStore.get("tempUserId");
	}
	
	$scope.getTotalEconomyShifted = function() {
		var opts = {};
		opts.idcard = 12530; //Yiresse Account Id static added here
		UserService.getTotalEconomyShifted(opts, function(data) {
			if(data.code == 101) {
				var dollorNum = data.data.economstot*APP.currency.dollor.value;
				var number = Math.round(dollorNum),
			    output = [],
			    newNumber = 15 - number.toString().length;
			    var zeroStr = '';
			    while(newNumber > 0) {
			    	zeroStr += '0';
			    	newNumber--;
			    }
			    sNumber = zeroStr+number.toString();
				for (var i = 0, len = sNumber.length; i < len; i++) {
				    output.push(sNumber.charAt(i));
				}
				$scope.totalEconomyShifted = output;
			} else {
				$scope.totalEconomyShifted = ''; 
			}
		});
	}

	//Functions to get the top links items 
	$scope.citizenTopLinkLoader = true;
	$scope.topShopPerRevenueLoader = true;
	$scope.topCitizenPerincomeLoader = true;

	$scope.getTopCitizenTopLink = function() {
		var opts = {};
		opts.limit_start = 0;
		opts.limit_size = 9;
		TopLinkService.getTopLinkedCitizen(opts, function(data) {
			if(data.code == 101) {
				$scope.topLinkedCitizen = data.data.data;
				$scope.citizenTopLinkLoader = false;
			} else {
				$scope.topLinkedCitizen = {};
				$scope.citizenTopLinkLoader = false;
			}
		});
	}

	//get Top citizen per income 
	$scope.getTopCitizenPerIncome = function() {
		var opts = {};
		opts.limit_size = 9;
		TopLinkService.getTopCitizenPerIncome(opts, function(data) {
			if(data.code == 101) {
				$scope.topCitizenPerIncome = data.data;
				$scope.topCitizenPerincomeLoader = false;
			} else {
				$scope.topCitizenPerIncome = {};
				$scope.topCitizenPerincomeLoader = false;
			}
		});
	}

	//get Top shop per revenue 
	$scope.getTopShopPerRevenue = function() {
		var opts = {};
		opts.limit_size = 9;
		TopLinkService.getTopShopPerRevenue(opts, function(data) {
			if(data.code == 101) {
				$scope.topShopPerRevenue = data.data;
				$scope.topShopPerRevenueLoader = false;
			} else {
				$scope.topShopPerRevenue = {};
				$scope.topShopPerRevenueLoader = false;
			}
		});
	}

	$scope.getTopCitizenTopLink();
	$scope.getTopCitizenPerIncome();
	$scope.getTopShopPerRevenue();
	$scope.getTotalEconomyShifted();	

	//hide left menu for mobile version
	$scope.makeUncheck = function() {
		$("#nav-trigger").prop("checked", false);
		$('#nav-trigger').removeClass('nav-trigger-checked');
		$('.site-wrapper').removeClass('site-trigger-checked');
	};

	$scope.toggleForClass = function(){

		if($('#nav-trigger').prop('checked') === false){
			$('#nav-trigger').addClass('nav-trigger-checked');
			$('.site-wrapper').addClass('site-trigger-checked');
		};
		if($('#nav-trigger').prop('checked') === true){
			$('#nav-trigger').removeClass('nav-trigger-checked');
			$('.site-wrapper').removeClass('site-trigger-checked');
		}
	}
	$scope.addclass = function(evt,type){
		if(type === 'club'){			
			$("li.shop").children('ul').removeClass( 'append-menu' );
			$("li.shop").removeClass( 'iconChange' );
			$("li.offer").children('ul').removeClass( 'append-menu' );
			$("li.offer").removeClass( 'iconChange' );
		}

		if(type === 'shop'){
			$("li.clubs").children('ul').removeClass( 'append-menu' );
			$("li.clubs").removeClass( 'iconChange' );
			$("li.offer").children('ul').removeClass( 'append-menu' );
			$("li.offer").removeClass( 'iconChange' );
		}

		if(type === 'offer'){
			$("li.shop").children('ul').removeClass( 'append-menu' );
			$("li.shop").removeClass( 'iconChange' );
			$("li.clubs").children('ul').removeClass( 'append-menu' );
			$("li.clubs").removeClass( 'iconChange' );
		}
		
		$(evt.currentTarget).children('ul').toggleClass( 'append-menu' );
		$(evt.currentTarget).toggleClass( 'iconChange' );
	}

	$scope.setPlaceholder = function() {
		$timeout(function(){
			if($scope.i18n !== undefined){
				// add placeholder value for post link preview text area when page is refreshed and language is set
		        $('#text_lp1').attr("placeholder",$scope.i18n.dashboard.postcomment.post_placehold); 
	    	}
		}, 100);
	};

	//get Count for all type of notifications 
	$rootScope.getCountOfAllTypeNotificaton = function() {
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.notification = 1;
		opts.message = 1;
		opts.group = 1;
		$scope.homeNotificationCount = 0;
		$scope.homeGroupCount = 0;
		$scope.homeMessageCount = 0;
		ProfileService.notificationCount(opts, function(data) {
			if(data.code == 101) {
				$scope.homeNotificationCount = data.data.notificationCount;
				$scope.homeGroupCount = data.data.groupCount;
				$scope.homeMessageCount = data.data.messageCount;
			} else {
				$scope.homeNotificationCount = 0;
				$scope.homeGroupCount = 0;
				$scope.homeMessageCount = 0;
			}
		});
	};

	if(UserService.isAuthenticated()) {
		$rootScope.getCountOfAllTypeNotificaton();
	}
	
}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});


app.service('TranslationService', function($http) {  
    this.getTranslation = function($scope, language) {
        var languageFilePath = 'app/js/i18n/' + language + '.json';
		$http.get(languageFilePath).success (function(data){
                $scope.i18n = data;
                // add placeholder value for post link preview text area
        		$('#text_lp1').attr("placeholder",$scope.i18n.dashboard.postcomment.post_placehold); 
                //creating scope for privacy setting of post
				$scope.userPrivacySetting = [
					{roleValue: 1, roleTitle: $scope.i18n.dashboard.postPrivacy.personal_friends},
					{roleValue: 2, roleTitle: $scope.i18n.dashboard.postPrivacy.professional_friends},
					{roleValue: 3, roleTitle: $scope.i18n.dashboard.postPrivacy.all_public}
				];
				$scope.professionalPrivacySetting = [
					{roleValue: 2, roleTitle: $scope.i18n.dashboard.postPrivacy.professional_friends},
					{roleValue: 3, roleTitle: $scope.i18n.dashboard.postPrivacy.all_public}
				];
				$scope.personalPrivacySetting = [
					{roleValue: 1, roleTitle: $scope.i18n.dashboard.postPrivacy.personal_friends},
					{roleValue: 3, roleTitle: $scope.i18n.dashboard.postPrivacy.all_public}
				];
		});
    };
    this.getTranslationWithCallback  = function($scope, language, callback) {
        var languageFilePath = 'app/js/i18n/' + language + '.json';
		$http.get(languageFilePath).success (function(data){
                callback(data)
		});
    };
});

app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
	//Reset headers to avoid OPTIONS request (aka preflight)
	$httpProvider.defaults.headers.common = {};
	$httpProvider.defaults.headers.post = {};
	$httpProvider.defaults.headers.put = {};
	$httpProvider.defaults.headers.patch = {};
	$routeProvider
		.when('/', {
			templateUrl:'app/views/login.html'
		})
		.when('/signup', {
			templateUrl:'app/views/registration.html'
		})
		.when('/profile', {
			controller: 'ProfileController',
			templateUrl:'app/views/profile.html'
		})
		.when('/timeline/:userId', {
			templateUrl:'app/views/user_timeline.html'
		})
		.when('/friends', {
			templateUrl:'app/views/friends_list.html'
		})
		.when('/edit_profile/:type', {
			controller: 'EditProfileController',
			templateUrl:'app/views/edit_profile.html'
		})
		.when('/notification', {
			controller: 'NotificationController',
			template:'<input type="button" value="sendEmailNotification" ng-click="sendEmailNotification()">'
			+'<input type="button" value="getEmailNotification" ng-click="getEmailNotification()">'
			+'<input type="button" value="readUnreadEmailNotifications" ng-click="readUnreadEmailNotifications()">'
			+'<input type="button" value="deleteEmailNotifications" ng-click="deleteEmailNotifications()">'
			+'<input type="button" value="searchEmailNotifications" ng-click="searchEmailNotifications()">'
		})
		.when('/changepassword', {
			controller: 'passwordChangeController',
			templateUrl:'app/views/change_password.html'
		})
		.when('/comment', {
			controller: 'CommentController',
			template:'<input type="button" value="createComments" ng-click="createComments()">'
			+ '<input type="button" value="commentLists" ng-click="commentLists()">'
			+ '<input type="button" value="commentUpdates" ng-click="commentUpdates()">'
			+ '<input type="button" value="commentDeletes" ng-click="commentDeletes()">'

		})
		.when('/post', {
			controller: 'PostController',
			template:'<input type="button" value="createPost" ng-click="createPost()">'
			+ '<input type="button" value="listPosts" ng-click="listPosts()">'
			+ '<input type="button" value="updatePosts" ng-click="updatePosts()">'
			+ '<input type="button" value="deletePosts" ng-click="deletePosts()">'

		})
		.when('/password/forgot', {
			controller: 'UserController',
			templateUrl:'app/views/forgot_password.html'
		})
		.when('/reset', {
			controller: 'UserController',
			templateUrl:'app/views/reset_password.html'
		})
		.when('/registration', {
			controller: 'UserController',
			templateUrl:'app/views/registration.html'
		})
		.when('/message', {
			controller: 'MessageController',
			templateUrl:'app/views/message.html'
		})
		.when('/message/:mid', {
			controller: 'MessageController',
			templateUrl:'app/views/message.html'
		})
		.when('/club', {
			templateUrl:'app/views/group.html'
		})
		.when('/club/view/:clubId/:clubType', {
			templateUrl:'app/views/group_view.html'
		})
		.when('/club/request/:action/:senderId/:clubId/:clubType/:notiId', {
			controller: 'ClubRequestAction',
			templateUrl:'app/views/load_request.html'
		})
		.when('/album', {
			controller: 'AlbumController',
			templateUrl:'app/views/album.html'
		})
		.when('/albumimgupload', {
			controller: 'AlbumController',
			templateUrl:'app/views/albumimgupload.html'
		})
		.when('/album/images/:album_id/:album_name', {
			controller: 'AlbumController',
			templateUrl:'app/views/albumimgupload.html'
		})
		.when('/:id/friend/images/:album_id/:album_name', {
			controller: 'FriendViewController',
			templateUrl:'app/views/friend_all_pictures.html'
		})
		.when('/shop', {
			controller: 'StoreController',
			templateUrl:'app/views/store.html'
		})
		.when('/shop/create', {
			controller: 'CreateStoreController',
			templateUrl:'app/views/store_create.html'
		})
		.when('/shop/view/:id', {
			templateUrl:'app/views/store_detail.html',
			activetab: 'view'
		})       
		.when('/shop/about/:id', {
			templateUrl:'app/views/store_detail_about.html',
			activetab: 'about'
		})
		.when('/shop/invite/:id', {
			templateUrl:'app/views/store_detail_invite.html',
			activetab: 'invite'
		})
		.when('/shop/edit/:id', {
			templateUrl:'app/views/store_detail_edit.html',
			//controller: 'DeatilStoreController',
			activetab: 'edit'
		})
        .when('/shop/history/:id', {
			templateUrl:'app/views/store_detail_history.html',
			controller: 'HistoryStoreController',
			activetab: 'history'
		})
		.when('/shop/promotions/:id', {
			templateUrl:'app/views/commercial.html',
			controller: 'PromotionController',
			activetab: 'promotions'
		})	
		.when('/shop/followers/:id', {
			templateUrl:'app/views/shop_follow.html',
			activetab: 'follower'
		})
		.when('/viewfriend/:friendId', {
			controller: 'FriendProfile',
			templateUrl:'app/views/friend_timeline.html'
		})
		.when('/viewfriend/:friendId/about', {
			//controller: 'FriendProfile',
			templateUrl:'app/views/friend_profile.html'
		})
		.when('/storealbum', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbum.html'
		})
		.when('/album/shop/:id', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbum.html',
			activetab: 'photo'
		})
		.when('/storealbumimgupload', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbumimgupload.html'
		})
		.when('/album/shop/image/:album_id/:album_name/:id', {
			controller: 'StoreAlbumController',
			templateUrl:'app/views/storealbumimgupload.html',
			activetab: 'photo'
		})
		.when('/register/:typeId', {
			controller: 'UserController',
			templateUrl:'app/views/registration-step-one.html'
		})
		.when('/register_no/:typeId', {
			controller: 'UserController',
			templateUrl:'app/views/registration-step-one_1.html'
		})
		.when('/brokerprofilestep/:userId/:typeId', {
			controller: 'UserController',
			templateUrl:'app/views/brokerprofilestep.html'
		})
		.when('/storeProfilestep/:userId/:typeId', {
			controller: 'UserController',
			templateUrl:'app/views/storeProfilestep.html'
		})
		.when('/createbrokerprofile', {
			controller: 'CreateBrokerController',
			templateUrl:'app/views/createbrokerprofile.html'
		})
		.when('/create/child/shop/:id', {
			templateUrl:'app/views/create_child_store.html'
		})
		.when('/profileimgupload', {
			controller: 'ProfileImageController',
			templateUrl:'app/views/profileimgupload.html'
		})
		.when('/friend/album/:id/:friendId', {
			controller: 'friendAlbumController',
			templateUrl:'app/views/friend_album.html'
		})
		.when('/friend/image/:id/:name/:userId', {
			controller: 'friendAlbumController',
			templateUrl:'app/views/friend_image.html'
		})
		.when('/album/club/:clubId/:clubType', {
			controller: 'ClubAlbumController',
			templateUrl:'app/views/club_album.html'
		})
		.when('/album/club/view/:clubId/:albumId/:clubType/:name', {
            controller: 'ClubAlbumPhotoController',
            templateUrl:'app/views/club_album_photos.html'
        })
		.when('/cos_e_e_come_funziona', {
			templateUrl:'app/views/cos_e_e_come_funziona.html'
		})
		.when('/become/broker', {
			templateUrl:'app/views/static/become_broker.html'
		})
		.when('/market', {
			templateUrl:'app/views/static/market.html'
		})
		.when('/progetti_sociali', {
			templateUrl:'app/views/progetti_sociali.html'
		})
		.when('/page/shops', {
			templateUrl:'app/views/static/shops.html'
		})
		.when('/incoming', {
			templateUrl:'app/views/static/income.html'
		})
		.when('/momosy', {
			templateUrl:'app/views/static/momosy.html'
		})
		.when('/about', {
			templateUrl:'app/views/user_about.html'
		})
		.when('/change_language', {
			templateUrl:'app/views/change_language.html'
		})
		.when('/:id/friends', {
			controller: 'FriendFriendController',
			templateUrl:'app/views/friend_friend.html'
		})
		.when('/:id/pictures', {
			controller: 'FriendAlbumController',
			templateUrl:'app/views/friend_user_album.html'
		})
		.when('/:id/shops', {
			controller: 'FriendShopController',
			templateUrl:'app/views/friend_shops.html'
		})
		.when('/:id/clubs', {
			controller: 'FriendClubController',
			templateUrl:'app/views/friend_clubs.html'
		})
		.when('/followers', {
			controller: 'FollowersController',
			templateUrl:'app/views/followers.html'
		})
		.when('/profiles', {
			templateUrl:'app/views/user_about.html'
		})
		.when('/profiles/:profileType', {
			templateUrl:'app/views/user_about.html'
		})
		.when('/myclubs', {
			controller: 'MyClubController',
			templateUrl:'app/views/group_my.html'
		})
		.when('/followings', {
			controller: 'FollowingsController',
			templateUrl:'app/views/followings.html'
		})
		.when('/myshops/:type', {
			controller: 'MyShopController',
			templateUrl:'app/views/store_my.html'
		})
		.when('/citizen/affiliates', {
			controller: 'CitizenAffiliatedkController',
			templateUrl:'app/views/citizen_affiliates.html'
		})
		.when('/shop/affiliates', {
			controller: 'ShopAffiliatedkController',
			templateUrl:'app/views/shop_affiliates.html'
		})
		.when('/broker/affiliates', {
			controller: 'BrokerAffiliatedkController',
			templateUrl:'app/views/broker_affiliates.html'
		})
		.when('/top/citizen', {
			controller: 'TopCitizenAllController',
			templateUrl:'app/views/top_citizen_all.html'
		})
		.when('/top/citizen/perincome', {
			controller: 'TopCitizenPerIncomeController',
			templateUrl:'app/views/top_citizen_perincome.html'
		})
		.when('/top/shop/perrevenue', {
			controller: 'TopShopPerRevenueController',
			templateUrl:'app/views/top_shop_per_revenue.html'
		})
		.when('/privacy', {
			templateUrl:'app/views/static/privacy.html'
		})
		.when('/contact/us', {
			templateUrl:'app/views/static/contact_us.html'
		})
		.when('/shop/payment/:type', {
			controller: 'StorePaymentController',
			templateUrl:'app/views/terms_condition.html'
		})
		.when('/shop/paysuccess', {
			controller: 'StorePaymentReturnController',
			templateUrl:'app/views/shop_payment_return.html'
		})
		.when('/shop/paycancel', {
			controller: 'StorePaymentCancelController',
			templateUrl:'app/views/shop_payment_cancel.html'
		})
		.when('/wallets', {
			controller: 'userWalletController',
			templateUrl:'app/views/user_wallet.html'
		})
		.when('/wallets/history', {
			controller: 'userWalletController',
			templateUrl:'app/views/user_wallet.html',
			activetab: 'citizen-history'
		})
		.when('/shop/payment/:id/:type', {
			controller: 'StorePaymentController',
			templateUrl:'app/views/terms_condition.html'
		})
		.when('/shop/register/payment', {
			controller: 'StoreRegistrationPaymentController',
			templateUrl:'app/views/terms_condition.html'
		})
		.when('/shop/pending/payment/:id', {
			controller: 'StoreCreditCard',
			templateUrl:'app/views/store_pending_payment.html',
		})
		.when('/edit/citizen/:type', {
			controller: 'EditUserProfileController',
			templateUrl:'app/views/edit_citizen_profile.html'
		})
		.when('/edit/broker/:type', {
			controller: 'EditUserProfileController',
			templateUrl:'app/views/edit_broker_profile.html'
		})
		.when('/invite_citizen', {
			templateUrl:'app/views/invite_citizen.html'
		})
		.when('/citizen_affiliation/:user_id/:type', {
			controller: 'InvitedUserJoinSite',
			templateUrl:'app/views/user_join.html'
		})
		.when('/citizen_affiliation_regis', {
			templateUrl:'app/views/citizen_affiliates_registeration.html'
		})
		.when('/broker_affiliation/:user_id/:type', {
			controller: 'InvitedUserJoinSite',
			templateUrl:'app/views/user_join.html'
		})
		.when('/shop_affiliation/:user_id/:type', {
			controller: 'InvitedUserJoinSite',
			templateUrl:'app/views/user_join.html'
		})
		.when('/shop/card/:id', {
			controller: 'StoreCreditCard',
			templateUrl:'app/views/store_credit_card.html',
			activetab: 'card'
		})
		.when('/blshops', {
			controller: 'BLShopsController',
			templateUrl:'app/views/bl_shops.html'
		})
        .when('/blshop/info', {
			controller: 'BLDetailShopsController',
			templateUrl:'app/views/bl_shops_info.html'
        })
        .when('/blshop/info/:id', {
			templateUrl:'app/views/bl_shops_info.html',
			activetab: 'view'
		})
        .when('/shop/home/about/:id', {
			templateUrl:'app/views/store_detail_home_about.html',
			activetab: 'about'
		})
        .when('/shop/home/album/:id', {
			controller: 'BLDetailAlbumShopsController',
			templateUrl:'app/views/store_detail_home_album.html',
			activetab: 'photo'
		})
        .when('/shop/home/image/:album_id/:album_name/:id', {
			controller: 'BLDetailAlbumShopsController',
			templateUrl:'app/views/storedetailhomepicture.html',
			activetab: 'photo'
		})
		.when('/shop/card/addcard/:id/:type', {
			controller: 'StorePaymentController',
			templateUrl:'app/views/add_card_terms_condition.html'
		})
		.when('/invite/:id', {
			controller: 'ImportContactController',
			templateUrl:'app/views/gmail_contact.html'
		})
		.when('/shop/wallet/:id', {
			controller: 'shopWalletController',
			templateUrl:'app/views/shop_wallet.html',
			activetab: 'wallet'
		})
		.when('/terms', {
			templateUrl:'app/views/register_terms_condition.html',
		})
		.when('/top/public/shops', {
			controller: 'TopPublicShopController',
			templateUrl:'app/views/top_public_shop.html',
		})
		.when('/top/linked/citizen', {
			controller: 'TopLinkedCitizenController',
			templateUrl:'app/views/top_linked_citizen.html',
		})
		.when('/top/citizen/income', {
			controller: 'TopCitizenIncomeController',
			templateUrl:'app/views/top_citizen_income.html',
		})
		.when('/shop/landing2/:profileType', {
			controller: 'ShopLanding2Controller',
			templateUrl:'app/views/static/landing/landing2.html',
		})
		.when('/citizen/register/:profileType', {
			controller: 'ShopLanding2Controller',
			templateUrl:'app/views/citizen_register.html',
		})
		.when('/shop/register/:profileType', {
			controller: 'ShopRegisterController',
			templateUrl:'app/views/shop_register.html',
		})
		.when('/shop/:shopId/contract', {
			controller: 'ShopTermsandConditions',
			templateUrl:'app/views/shop_contract.html',
		})
		.when('/edit/shop/:id', {
			templateUrl:'app/views/shop_edit.html',
			controller: 'EditShopController',
		})
		.when('/post/:postId', {
			templateUrl:'app/views/post_view.html',
			controller: 'PostTaggedDetail',
		})
		.when('/shop/:shopId/post/:postId', {
			templateUrl:'app/views/store_post_view.html',
			controller: 'ShopPostDetail',
		})
		.when('/club/:clubId/post/:postId/:status', {
			templateUrl:'app/views/club_post_view.html',
			controller: 'ClubPostDetail',
		})
		.when('/view/all/requests', {
			templateUrl:'app/views/friend_request_view.html',
			controller: 'FriendRequestView',
		})
		.when('/notifications', {
			templateUrl:'app/views/all_notification_view.html',
			controller: 'AllNotificationView',
		})
		.when('/club/requests', {
			templateUrl:'app/views/all_club_req_view.html',
			controller: 'AllClubReNotificationView',
		})
		.when('/search/:text/profiles', {
			templateUrl:'app/views/all_search_items.html',
			controller: 'AllSearchProfile',
		})
		.when('/shop/reviews/:id', {
			templateUrl:'app/views/store_reviews.html',
			activetab: 'review'
		})
		.when('/media/page/:mediaId/:albumType/:parentId/:supportId', {
			templateUrl:'app/views/album_media_single.html',
			controller: 'MediaSingleController'
		})
		.when('/unouth/post/user/:postId', {
			templateUrl:'app/views/single_post_public.html',
			controller: 'SinglePostController',
		})
		.when('/unouth/post/club/:clubId/:postId/:status', {
			templateUrl:'app/views/single_post_public.html',
			controller: 'ClubSinglePostController',
		})
		.when('/unouth/post/shop/:shopId/:postId', {
			templateUrl:'app/views/single_shop_post_public.html',
			controller: 'ShopSinglePostController',
		})
		.when('/offer/:id', {
			templateUrl:'app/views/offers.html',
			controller: 'CardController',
		})
		.when('/card/:id', {
			templateUrl:'app/views/card_details.html',
			controller: 'CardDetailsController',
		})
		.when('/shop/transaction/:shopId', {
			templateUrl:'app/views/shop_transaction.html',
			controller: 'ShopTransactionController',
			activetab: 'transaction'
		})
		.when('/shop/transaction/history/:shopId', {
			templateUrl:'app/views/shop_transaction_history.html',
			controller: 'ShopTransactionHistoryController',
			activetab: 'transactionhistory'
		})
        .when('/tutorial', {
			templateUrl:'app/views/citizen_tutorial.html'
		})
		.when('/shoptutorial', {
			templateUrl:'app/views/shop_tutorial.html'
        })
		.when('/unouth/request', {
			templateUrl:'app/views/not_authorized.html',
		})
		.when('/verify', {
			templateUrl:'app/views/verify.html',
			controller: 'VerifyController',
		})
		.when('/resendlink', {
			templateUrl:'app/views/resendlink.html',
			controller: 'ResendLink'
		})
		.when('/shop/edit', {
			templateUrl:'app/views/redirect_user.html',
			controller: 'RedirectToShopEdit'
		})	
		.when('/socialProject', {
			templateUrl:'app/views/social_project.html'
		})
		.when('/shop/offer/:id', {
			controller: 'shopOfferController',
			templateUrl:'app/views/shop_offer.html',
			activetab: 'offer'
		})
		.when('/buycard_cancel', {
			controller: 'BuyCardController',
			templateUrl:'app/views/buycard_mess.html'
		})
		.when('/buycard_success', {
			controller: 'BuyCardController',
			templateUrl:'app/views/buycard_mess.html'
		})
		.when('/shop/report/:id', {
			activetab: 'report',
			templateUrl:'app/views/report.html',
			controller: 'ReportController',

		})
		.when('/mobile/offer/:tokenId/:userId', {
			templateUrl:'app/views/redirect_user.html',
			controller: 'AutoLoginFromMobileApp'
		})
		.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true); 
}]);

app.run(function($rootScope, $location, UserService) {
   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(url){
    	$rootScope.isPublic = false;
        if(UserService.isAuthenticated() && ($rootScope.hasOwnProperty('getAllFriendNotification'))) { 
    		// if(url != '/profile') {
    		// 	$rootScope.getAllFriendNotification();
    		// 	$rootScope.getCountOfAllTypeNotificaton();
    		// }

			$rootScope.getAllFriendNotification();
			$rootScope.getCountOfAllTypeNotificaton();
		} 
		if(!UserService.isAuthenticated() && (url === '/' ) && (url === '/terms')) {
		} else if(UserService.isAuthenticated() && (url === '/' || url === '/registration' || url === '/password/forgot' || url === '/reset' || url === '/blshops' || url === '/blshop/info' || url.indexOf("shop/home/about") != -1 || url.indexOf("shop/home/image") != -1 || url.indexOf("shop/home/album") != -1)) {
			$location.path('/profile');
		}
    });
   $rootScope.$on('$routeChangeSuccess', function(){
		if($location.path().indexOf('citizen_affiliation_regis') != -1){
			$rootScope.disableLogo = 1;
		}else{
			$rootScope.disableLogo = 0;
		}
	});
});

