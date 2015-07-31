app.controller('UserController', ['$cookieStore', '$rootScope', 'ipCookie', '$scope', '$http', '$location', '$timeout', '$routeParams', 'UserService', 'saveUserPass', 'TopLinkService', '$remember', 'AffiliatedkService', 'AlbumService', 'verifyUser', 'EMAILPATTERN', 'focus', function($cookieStore, $rootScope, ipCookie, $scope, $http, $location, $timeout, $routeParams, UserService, saveUserPass, TopLinkService, $remember,AffiliatedkService ,AlbumService, verifyUser, EMAILPATTERN, focus) {
	$scope.emailPattern = EMAILPATTERN.emailPattern;
	$scope.fb_expire = false;
	$scope.loginStart = false;
	$scope.loginError = false;
	$scope.loginErrorMsg = '';
	$scope.signupStart = false;  
	$scope.sucessMessage = false;
	$scope.signUpSuccessMsg = "sucess";
	$scope.class = "sucess";
	$scope.isLoading = false;
	$scope.message = '';
	$scope.brokerloader = false;
	$scope.brokerMsg = '';
	$scope.brokerMsgerror = '';
	$scope.isreferralId = '';
	$scope.user = {};
	$scope.user.month = '';
	$scope.user.remember = false;
	$scope.months = $scope.i18n.Register_months;
    $scope.$watch('currentLanguage',function(newValue,oldValue){
        $timeout(function(){
            $scope.months = $scope.i18n.Register_months;
        }, 400 );
    });
	var fbdata;
	$scope.profileType = $routeParams.profileType;
    $scope.filtertypeId=$routeParams.typeId;
	$scope.brokerProfile = APP.profileType.brokerProfile;
	$scope.citizenProfile = APP.profileType.citizenProfile;
	if(TopLinkService.getAffiliationObject().hasOwnProperty("user_id")) {
		var affiliate = TopLinkService.getAffiliationObject();
		$scope.isreferralId = affiliate.user_id;
		$scope.referralId = affiliate.user_id;
		$scope.filtertypeId = affiliate.type;
		if($location.path().indexOf('registration') != -1){
			TopLinkService.setAffiliationObject({});
		}
	}
	$scope.getProfile = $location.path();
	
	if($scope.getProfile.indexOf('/profiles') !== -1){
		$scope.citizenProfileLoader = true; 
        var citizenOpts = {};
        citizenOpts.user_id = APP.currentUser.id;
        citizenOpts.profile_type = APP.profileType.citizenProfile; 
        UserService.getBasicProfile(citizenOpts, function(data){
            if(data.code == 101) {
              if(data.data.facebook_profile.expires <= 0) $scope.fb_expire = true;
              $scope.citizenProfileLoader = false;
              $scope.currentFullDate = new Date().getFullYear();
              $scope.fullCitizenProfile = data.data;
              $scope.showPersonalJobs = data.data.baisc_profile_info.jobDetails;
              var monthNum = parseInt($scope.fullCitizenProfile.baisc_profile_info.date_of_birth.date.substring(5,7));
			  $scope.birthmonth = $scope.months[monthNum - 1].name;
              $scope.emptyPersonalJobs = false;
              angular.forEach($scope.showPersonalJobs,function(index){
                if(index.visibility_type === 1 || index.visibility_type === 3){
                  $scope.emptyPersonalJobs = true;
                }
              });
              $scope.showPersonalEducation = data.data.baisc_profile_info.educationDetail;
              $scope.emptyPersonalEducation = false;
              angular.forEach($scope.showPersonalEducation,function(index){
                if(index.visibility_type === 1 || index.visibility_type === 3){
                  $scope.emptyPersonalEducation = true;
                }
              });

				if($scope.profileType == 1){
					$scope.emptyProfessionalJobs = false;
					angular.forEach($scope.showPersonalJobs,function(index){
						if(index.visibility_type === 2 || index.visibility_type === 3){
						  $scope.emptyProfessionalJobs = true;
						}
					});
					$scope.emptyProfessionalEducation = false;
					angular.forEach($scope.showPersonalEducation,function(index){
						if(index.visibility_type === 2 || index.visibility_type === 3){
						  $scope.emptyProfessionalEducation = true;
						}
					});
				}
            } else {                
              $scope.citizenProfileLoader = false;
            }
        });
     //Get Affilicate counts
    $scope.getAffiliateCounts = function() {  
        var opts = {};
        opts.user_id = APP.currentUser.id;  
        opts.session_id = APP.currentUser.id; 
        AffiliatedkService.getAllcounts(opts, function(data) {
            if(data.code == 101) {
                $scope.totalCounts = data.data;
            } 
        });
    };
    // Start function for the show album in profile page
        $scope.loaduseralbumimages =function(){
        $scope.noalbumimages = false;
        var opts = {};
        opts.user_id = APP.currentUser.id; 
        opts.friend_id = APP.currentUser.id; 
		opts.limit_start = 0; 
		opts.limit_size = 4;

        AlbumService.albumListing(opts, function(data){
            if(data.code == 101) {
                $scope.userlatestalbum =  data.data.albums;
                if($scope.userlatestalbum.length == 0  ){
                	$scope.noalbumimages = true;
                }
            }else {
                $scope.userlatestalbum = '';
            }
            });
    };
    
      // End function for the show album in profile page
	$scope.loaduseralbumimages();
    
    $scope.getAffiliateCounts();
   
	}

	//login video pop up
	$(".video-fancybox").fancybox();
	//Blank facebook reg
	$scope.facebookReg = function() {
		$('.button-section').hide();
		$('.fbmsg').hide();
		document.getElementById("emailReg").value = "";
		document.getElementById("fname").value = "";
		document.getElementById("lname").value = "";
  		document.getElementById("fbId").value = "";
  		$scope.user.fbId = "";
		$scope.user.firstName = "";
		$scope.user.lastName = "";
		$scope.user.userEmail = "";
	}

	$scope.convertString = function(stringAyyar){
		if(stringAyyar.length > 0){
			return stringAyyar.split(',');
		}else{
			return [];
		}
	};

	//yes option
	$scope.fbyes = function() {
		var postData = $scope.facebookdata;
		var opts = {
				
					facebook_id: postData.facebook_id, 
					user_id: postData.user_id,
					facebook_accesstoken: postData.facebook_accesstoken,
			};
			console.log('opts-',opts)
		UserService.mapfacebookuser(opts, function(data) {
			if(data.code == 101) {
				var fbId = data.data.facebook_id;
				var email = data.data.email;
				var fname = data.data.first_name;
				var lname = data.data.last_name;
				$scope.facebookLoginChk(fbId,email,fname,lname);
			} else {
				$scope.signUpSuccessMsg  = data.message;
			}		
		});
	}
	$scope.fbno = function() {
		$('.fbmsg').hide();
		$scope.fbloginmessage ="";
		$scope.signUpSuccessMsg = "";
		$('.button-section').hide();
	}
	//facebook login check
	$scope.facebookLoginChk = function(fbId,email,fname,lname,fb_access_token) {
		//$('.facebook-button').hide();
		$scope.fbloader = true;
		var postData = {
				reqObj: {
					facebook_id: fbId, 
					email: email,
					firstname: fname,
					lastname : lname
				}
			};

		var method = 'POST';
	            $http({
				method : "POST",
				url : APP.service.getFacebookLogin,
				data : postData,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
			}).success( function(data, header){
				if(data.code == 99){
					$scope.fbloader = false;
					document.getElementById("emailReg").value = data.data.email;
					document.getElementById("fname").value = data.data.firstname;
					document.getElementById("lname").value = data.data.lastname;
					document.getElementById("fbId").value = "fb";
					document.getElementById("fbUserId").value = data.data.facebook_id;
					$scope.user.fbId = "fb";
					$scope.user.firstName = data.data.firstname;
					$scope.user.lastName = data.data.lastname;
					$scope.user.userEmail = data.data.email;
					$scope.user.fbUserId = data.data.facebook_id;
					$scope.user.access_token = fb_access_token;
					$scope.fbloginmessage = $scope.i18n.home.fbregistration_msg;
					$('.fbmsg').show();
				} else if(data.code == 101) {

					$scope.user.userName = data.data.username;
					$scope.user.password = "123456";
					fbdata = data.data;
					$scope.getFacebookLogin(fb_access_token);

				}
			}).error(function(data, status, header){
				
			});
	}
	
	//Facebook Login
	//login form submit: function service to get access_token and login success
	$scope.getFacebookLogin = function(fb_access_token) {
		if($scope.user.userName == undefined || $scope.user.userName == ''){
			$scope.loginError = true;
			$scope.loginErrorMsg = $scope.i18n.home.enter_your_email;
			return false;
		}else if($scope.user.password == undefined || $scope.user.password == ''){
			$scope.loginError = true;
			$scope.loginErrorMsg = $scope.i18n.home.six_digit_password;
			return false;
		}
		$scope.loginStart = true;
		$scope.loginError = false;
		var opts = {};
		opts = {
			reqObj: {
				client_id : APP.keys.client_id,
				client_secret : APP.keys.client_secret,
		        grant_type : APP.keys.grant_type,
				username : $scope.user.userName,
				fb_login : "true",
				password : $scope.user.password
			}
		};
		//call service to get access token
		UserService.getAccessToken(opts)
		.then(function(data) {
			APP.accessToken = data.data.access_token;
			APP.currentUser = fbdata;	
			localStorage.setItem("loggedInUser", JSON.stringify(fbdata));
    		localStorage.setItem("access_token", APP.accessToken);				
			$rootScope.currentUser = fbdata;
			$scope.selectlanguage(APP.currentUser.current_language);
			$rootScope.isLoggedIn = true;
			var opts3 = {};
			opts3.user_id = APP.currentUser.id;
			opts3.profile_type = 4;
			UserService.getBasicProfile(opts3, function(data) {
				if(data.code == 101){
					$rootScope.currentUser.basicProfile = data.data;
				}	
				if(fb_access_token && (data.data.facebook_profile.expires <=0 || data.data.facebook_profile.publish_actions === false)){
					$scope.fb_expire = true
					//if accesstoken exist and and expire timepassed on call update access token 
					var opts = {}
					opts.user_id = APP.currentUser.id;
					opts.facebook_id = data.data.facebook_profile.id;
					opts.facebook_accesstoken = fb_access_token;
					UserService.updateFbAccessToken(opts, function(data){
						if(data.code == 101){
							$scope.fb_expire = false;
						}
					})
				}
				
				//get users credit and the total income 
				var opts4 = {};
				opts4.idcard = $rootScope.currentUser.basicProfile.user_id; 
				UserService.getCreditAndIncome(opts4, function(data){
					var currentCredit = {};
					if(data.code == 101) {
						currentCredit.totalCredit = (data.data.saldoc/1000000) ;
						currentCredit.totCreditMicro = (data.data.saldorm) + (data.data.saldorc) ;
						currentCredit.totalIncome = data.data.tot_income;
						currentCredit.totalIncomeShow = data.data.tot_income;
						$rootScope.currentUser.creditAndIncome = currentCredit;
					}else{
						$rootScope.currentUser.creditAndIncome = data.data;
					}
				});
				$rootScope.allFriendTotal = 0;
				$rootScope.getCountOfAllTypeNotificaton();
				$scope.$parent.loggedIn = true;
				var currentHitUrl = UserService.getHitUrl();
				if((TopLinkService.getIsAlreadyUserLogin()).yes) {
					var alreadyUserType = (TopLinkService.getIsAlreadyUserLogin()).profileType;
					TopLinkService.setIsAlreadyUserLogin({});
					$location.path("/shop/register/"+alreadyUserType);
				} else if($rootScope.currentUser.basicProfile.new_conract_status === 0) {
					$location.path("/edit/shop/"+$rootScope.currentUser.basicProfile.shop_id);
				} else if( currentHitUrl.length > 2 ) {
					UserService.setHitUrl('');
					$location.path(currentHitUrl);
				} else {
					$location.path("/profile");
				}
			});
			$scope.fbloader = false;

		}, function(error) {
			if(error.error === 'invalid_grant'){
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
			} else {
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = $scope.i18n.home.server_not_responding;
			}
		});
	};
	
	//login form submit: function service to get access_token and login success
	$scope.loginFormSubmitted = false;
	$scope.getLogin = function() {
	$scope.loginFormSubmitted = true;
		if($scope.user.userName == undefined || $scope.user.userName == ''){
			$scope.loginError = true;
			$scope.user.email.$dirty = true;
            $scope.user.email.$invalid = true;
            $scope.user.email.$error.required = true;
            focus('loginEmail');
			return false;
		}else if($scope.user.password == undefined || $scope.user.password == ''){
			$scope.loginError = true;
			$scope.user.loginPassword.$dirty = true;
            $scope.user.loginPassword.$invalid = true;
            $scope.user.loginPassword.$error.required = true;
            focus('loginPassword');
			return false;
		}
		// set data for remember me
		if ($scope.user.remember) {
        	$remember('username', $scope.user.userName);
            $remember('password', $scope.user.password);
        } else {
            $remember('username', '');
            $remember('password', '');
            $scope.user.remember = false;

        }
		$scope.loginStart = true;
		$scope.loginError = false;
		var opts = {};
		opts = {
			reqObj: {
				client_id : APP.keys.client_id,
				client_secret : APP.keys.client_secret,
		        grant_type : APP.keys.grant_type,
				username : $scope.user.userName,
				password : $.base64.encode($scope.user.password)
			}
		};
		//call service to get access token
		UserService.getAccessToken(opts)
		.then(function(data) {
			APP.accessToken = data.data.access_token;
			var postData = {
				reqObj: {
					username: $scope.user.userName, 
					password: $.base64.encode($scope.user.password)
				}
			};
            var method = 'POST';
	            $http({
				method : "POST",
				url : APP.service.logins+"?access_token="+data.data.access_token,
				data : postData,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
			})
            .success( function(data, header){
            	if(data.data && data.code != 100) {
            		APP.currentUser = data.data;
            		localStorage.setItem("loggedInUser", JSON.stringify(data.data));
            		localStorage.setItem("access_token", APP.accessToken);
					//ipCookie("access_token", APP.accessToken);
					//ipCookie("access_token", APP.accessToken, { expires: 3000 });
					$rootScope.currentUser = data.data;
					$rootScope.isLoggedIn = true;
					$scope.selectlanguage(APP.currentUser.current_language);
					var opts3 = {};
					opts3.user_id = APP.currentUser.id;
					opts3.profile_type = 4;
					UserService.getBasicProfile(opts3, function(data) {
						if(data.code == 101){
							$rootScope.currentUser.basicProfile = data.data;
						}	
						if(data.data.facebook_profile.expires <= 0) $scope.fb_expire = true;
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
							}
							else{
								$rootScope.currentUser.creditAndIncome = data.data;
							}
						});
						$rootScope.allFriendTotal = 0;
						$rootScope.getCountOfAllTypeNotificaton();
						$scope.$parent.loggedIn = true;
						var currentHitUrl = UserService.getHitUrl();
						if((TopLinkService.getIsAlreadyUserLogin()).yes) {
							var alreadyUserType = (TopLinkService.getIsAlreadyUserLogin()).profileType;
							TopLinkService.setIsAlreadyUserLogin({});
							$location.path("/shop/register/"+alreadyUserType);
						} else if($rootScope.currentUser.basicProfile.new_conract_status === 0) {
							$location.path("/edit/shop/"+$rootScope.currentUser.basicProfile.shop_id);
						} else if( currentHitUrl.length > 2 ) {
							UserService.setHitUrl('');
							$location.path(currentHitUrl);
						} else {
							$location.path("/profile");
						}
					});
				} else {
					$scope.loginError = true;
					$scope.loginStart = false;
					$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
					$timeout(function(){
                    $scope.loginErrorMsg = '';
                    }, 15000);
				}
			})
			.error(function(data, status, header){
				if(status == 403){
					if(data.code == 1045 && data.message == "TRIAL_EXPIRED"){
						verifyUser.check();
						$scope.loginStart = false;					
		            }
				}else{
					$scope.loginError = true;
					$scope.loginStart = false;
					$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
					$timeout(function(){
	                $scope.loginErrorMsg = '';
	                }, 15000);
				}
			});
		}, function(error) {
			if(error.error === 'invalid_grant'){
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
				$timeout(function(){
                $scope.loginErrorMsg = '';
                }, 15000);
			} else {
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = $scope.i18n.home.server_not_responding;
				$timeout(function(){
                $scope.loginErrorMsg = '';
                }, 15000);
			}
		});
	};

	$scope.go = function( path ) {
		$location.path( path );
	};
	
	//Registration User
	$scope.months = $scope.i18n.Register_months;
    $scope.$watch('currentLanguage',function(newValue,oldValue){
        $timeout(function(){
            $scope.months = $scope.i18n.Register_months;
            $scope.user.month = '';
        }, 400 );
    });
  $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];	
  	
  	$scope.Result = 0;
  	function Leap(Year){
		if ( (Year % 4) == 0){
			if ( (Year % 100) == 0)	{
				$scope.Result = ( (Year % 400) == 0);
			}else{
				$scope.Result = 1;
			}
		}else{
			$scope.Result = 0;
		}
		$scope.monthChange();
	}

	$scope.$watch('user.year',function(val){
  		Leap(val);
    });

  	$scope.monthChange = function(){
  		if($scope.user.month === undefined || $scope.user.month === "" || $scope.user.month === null){
    	}else{
    		var normalValue = $scope.user.month.value - 1;
	  		if(normalValue <= 6){ 
	  			if(normalValue % 2 == 0){
	  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else if(normalValue == 1){
  					if($scope.Result){
	  					$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
	  				}else{
	  					$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
	  				}
	  			}else{
	 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
	  			}
	  		}else{
	  			if(normalValue % 2 != 0){
	  				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	  			}else {
	 				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
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
  	};
  	
  	$scope.getyears();
  	$scope.countries = APP.countries;
	$scope.signUpSuccessMsg = "";
	$scope.showLoading = true;
	$scope.genderShow = false;
	// $scope.today = function() {
	// 	$scope.user.dob = new Date();
	// };
	//$scope.today();
	$scope.clear = function () {
		$scope.user.dob = null;
	};
	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};
	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.formats = ['dd-MM-yyyy', 'dd-MM-yyyy', 'dd-MM-yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.user.gender = 0;
	$scope.formSubmitted =  false;
	$scope.invalidSelectedDob = false;

  	$scope.registration = function(type) {
  		var currentDOB = new Date();
  		$scope.formSubmitted =  true;
       	var opts = {};
       	if($scope.user.userEmail === undefined || $scope.user.userEmail === '' ){
			$scope.user.emailReg.$dirty = true;
            $scope.user.emailReg.$invalid = true;
            $scope.user.emailReg.$error.required = true;
            focus('emailReg');
			return false;
		} else if($scope.user.userPassword === undefined || $scope.user.userPassword === ''){
       		$scope.user.pwdReg.$dirty = true;
            $scope.user.pwdReg.$invalid = true;
            $scope.user.pwdReg.$error.required = true;
            focus('pwdReg');
       		return false;
       	} else if($scope.user.firstName === undefined || $scope.user.firstName === '' ){
			$scope.user.fname.$dirty = true;
            $scope.user.fname.$invalid = true;
            $scope.user.fname.$error.required = true;
            focus('fname');
			return false;
		}else if($scope.user.lastName === undefined || $scope.user.lastName === '' ){
			$scope.user.lname.$dirty = true;
            $scope.user.lname.$invalid = true;
            $scope.user.lname.$error.required = true;
            focus('lname');
			return false;
		}else if($scope.user.month === undefined || $scope.user.month === '' ){
			$scope.user.dobmonth.$dirty = true;
            $scope.user.dobmonth.$invalid = true;
            $scope.user.dobmonth.$error.required = true;
            focus('dobmonth');
			return false;
		}else if($scope.user.day === undefined || $scope.user.day === '' ){
			$scope.user.dobday.$dirty = true;
            $scope.user.dobday.$invalid = true;
            $scope.user.dobday.$error.required = true;
            focus('dobday');
			return false;
		}else if($scope.user.year === undefined || $scope.user.year === '' ){
			$scope.user.dobyear.$dirty = true;
            $scope.user.dobyear.$invalid = true;
            $scope.user.dobyear.$error.required = true;
            focus('dobyear');
			return false;
		}else if($scope.user.year === currentDOB.getFullYear() && ($scope.user.month.value >= (currentDOB.getMonth()+1)) && ($scope.user.day > currentDOB.getDate())){
			$scope.invalidSelectedDob = true;
			focus('dobday');
			$timeout(function(){
				$scope.invalidSelectedDob = false;
			},2000);
        }else if($scope.user.gender === undefined || $scope.user.gender === 0){
			$scope.user.genreg.$dirty = true;
            $scope.user.genreg.$invalid = true;
            $scope.user.genreg.$error.required = true;
            focus('genreg');
			return false;
		}else if($scope.user.country === undefined || $scope.user.country.id === undefined || $scope.user.country.id === '' ){
			$scope.user.countryReg.$dirty = true;
            $scope.user.countryReg.$invalid = true;
            $scope.user.countryReg.$error.required = true;
            focus('countryReg');
			return false;
		}else if(type == 1 && ($scope.user.terms === 'false' || $scope.user.terms === undefined || $scope.user.terms === false || $scope.user.terms === '')) {
			$scope.user.termReg.$dirty = true;
            $scope.user.termReg.$invalid = true;
			$scope.user.termReg.$error.required = true;
			focus('termReg');
			return false;
		} 

		if($scope.user.fbId == 'fb' ){ 
		if(localStorage.getItem('CitizenAffiliatedObject')) {
			opts.referral_id = JSON.parse(localStorage.getItem('CitizenAffiliatedObject')).affiliator_id;
		}

		//opts.referral_id = $scope.referralId;
		opts.facebook_id = $scope.user.fbUserId;
       	opts.firstname = $scope.user.firstName;
       	opts.email = $scope.user.userEmail;
		opts.password = $.base64.encode($scope.user.userPassword);
		opts.lastname = $scope.user.lastName;
		//opts.birthday = $("#userdob").val(); 
        opts.birthday = $scope.user.day + '-' + $scope.user.month.value + '-' + $scope.user.year;
		opts.gender = $scope.user.gender;
		opts.country = $scope.user.country.id;
		opts.facebook_accesstoken = $scope.user.access_token;
		if( type != '')  
			opts.type = type;
		else
			opts.type = $routeParams.typeId;
		$scope.signupStart = true;
		$scope.showLoading = false;
		$scope.signUpSuccessMsg = "";
		UserService.getFacebookRegister(opts, function(data) {

			//alert(JSON.stringify(data));
			if(data.code == 101) {
				//Remove referral object from cookies
				localStorage.removeItem('CitizenAffiliatedObject');
				fbdata = data.data;
				$scope.sucessMessage = true;
				$scope.signupStart = false;
				$scope.user.userName = $scope.user.userEmail;
				$scope.user.password = "123456";
				$scope.getFacebookLogin();
			} else if(data.code == 98) {
				console.log(data.data)
				$scope.facebookdata = data.data;
				$scope.signUpSuccessMsg  = $scope.i18n.validation.user_exits;
				$('.button-section').show();
				$scope.showLoading = true;
			} else if(data.code == 154){
				$scope.signUpSuccessMsg  = $scope.i18n.validation.citizen_not_exists;
				$scope.showLoading = true;
			} else {
				$scope.signUpSuccessMsg  = data.message;
				$scope.showLoading = true;
			}
			$timeout(function(){
				$scope.signUpSuccessMsg = '';
			},15000);
		});

		} else {
		if(localStorage.getItem('CitizenAffiliatedObject')) {
			opts.referral_id = JSON.parse(localStorage.getItem('CitizenAffiliatedObject')).affiliator_id;
		}
       	opts.firstname = $scope.user.firstName;
       	opts.email 	  = $scope.user.userEmail;
		opts.password = $.base64.encode($scope.user.userPassword);
		opts.lastname = $scope.user.lastName;
		opts.birthday = $scope.user.day + '-' + $scope.user.month.value + '-' + $scope.user.year;
        opts.gender   = $scope.user.gender;
		opts.country  = $scope.user.country.id;
		if( type != '')  
			opts.type = type;
		else
			opts.type = $routeParams.typeId;
		$scope.signupStart = true;
		$scope.showLoading = false;
		$scope.signUpSuccessMsg = "";

		UserService.registration(opts, function(data) {
			if(data.code == 101) {
				//Remove referral object from cookies
				localStorage.removeItem('CitizenAffiliatedObject');
				if(data.data.profile_type == 1){
					$scope.sucessMessage = true;
					$scope.signupStart = false;
					$scope.user.userName = $scope.user.userEmail;
					$scope.user.password = $scope.user.userPassword;
					$scope.getLogin();
				}else if(data.data.profile_type == 3){
					var userId = data.data.user_id;
					saveUserPass.saveUserPassword($scope.user.userEmail,$scope.user.userPassword)
					$scope.showLoading = true;
					$rootScope.referral_id = $scope.referralId;
					$location.path( '/storeProfilestep/'+userId+'/3' );
				}else if(data.data.profile_type == 2){
					var userId = data.data.user_id;
					saveUserPass.saveUserPassword($scope.user.userEmail,$scope.user.userPassword)
					$scope.showLoading = true;
					$rootScope.referral_id = $scope.referralId;
					$location.path( '/brokerprofilestep/'+userId+'/2' );
				}
			} else if (data.code == 136) {
				$scope.signUpSuccessMsg = $scope.i18n.validation.user_exists;
			    $scope.showLoading = true;
			} else if(data.code == 154) {
				$scope.signUpSuccessMsg = $scope.i18n.validation.citizen_not_exists;
			    $scope.showLoading = true;
			} else if (data.code == 137) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.broker_not_exists;
				$scope.showLoading = true;
			} else if (data.code == 131) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.date_format_incorrect;
				$scope.showLoading = true;
			} else if (data.code == 100) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.missed_param;
				$scope.showLoading = true;
			} else if (data.code == 129) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.invalid_country_code;
				$scope.showLoading = true;
			} else if (data.code == 130) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.invalid_gender_type;
				$scope.showLoading = true;
			} else if (data.code == 133) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.invalid_profile_setting;
				$scope.showLoading = true;
			} else if (data.code == 143) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.referral_id_needed;
				$scope.showLoading = true;
			} else if (data.code == 135) {
				$scope.signUpSuccessMsg  = $scope.i18n.validation.email_invalid;
				$scope.showLoading = true;
			} else {
				$scope.signUpSuccessMsg  = data.message;
				$scope.showLoading = true;
			}

			$timeout(function(){
				$scope.signUpSuccessMsg = '';
			},15000);
		});
	}
	}

	//function to send token request for forget password
	$scope.msgcls = '';
	$scope.forgotPassword = function () {
		
		var formData = {};
		if ($scope.email == '' || $scope.email == undefined) {
			$scope.message = $scope.i18n.home.invalid_mail;
			$timeout(function(){
				$scope.message = '';
			}, 15000);
			$scope.msgcls = 'text-red text-center';
			return false;
		}

		$scope.isLoading = true;
		$scope.message = '';
		formData.username = $scope.email;
		//calling the services to sent forget password token
        UserService.forgotPassword(formData, function(data){
        	if (data.code == 105) {
        		$scope.msgcls = 'text-success text-center';
            	$scope.message = $scope.i18n.validation.email_sent;
            	$scope.isLoading = false;
            } else if (data.code == 107) {
            	$scope.message = $scope.i18n.validation.password_requested;
            	$scope.isLoading = false;
            	$scope.msgcls = 'text-success text-center';
            } else {
                $scope.isLoading = false;
                $scope.message = $scope.i18n.home.invalid_mail;
                // $scope.message = data.message;
                $scope.msgcls = 'text-red text-center';
            }
        });

        $timeout(function(){
			$scope.message = '';
			$scope.msgcls = '';
			$scope.email == '';
		}, 15000);
	};

	//function to reset the password from the token
	$scope.reset = {};
	$scope.reset.token = $rootScope.resetToken;
	$scope.requestPwdMessage = '';
	$scope.resetPassword = function () {
		$rootScope.requestPwdMessage = '';
		var formData = {};
		$scope.isLoading = true;
        $scope.reseterror = false;
		$scope.message = {};
		if ($scope.reset.token == '' || $scope.reset.token == undefined ) {
			$scope.message = $scope.i18n.passchange.enter_token;
			$scope.reseterror = true;
            $scope.isLoading = false;
            $timeout(function(){
				$scope.message = '';
			}, 15000);
            return false;
		}
		if ($scope.reset.password == '' || $scope.reset.password == undefined || $scope.reset.password.length <6) {
			$scope.message = $scope.i18n.validation.reset_password_invalid;
			$scope.reseterror = true;
            $scope.isLoading = false;
            $timeout(function(){
				$scope.message = '';
			}, 15000);
            return false;
		}
		if ($scope.reset.repassword == '' || $scope.reset.repassword == undefined || $scope.reset.repassword.length <6) {
			$scope.message = $scope.i18n.validation.password_match;
			$scope.reseterror = true;
            $scope.isLoading = false;
             $timeout(function(){
				$scope.message = '';
			}, 15000);
            return false;
		} else if($scope.reset.repassword != $scope.reset.password) {
			$scope.message = $scope.i18n.validation.password_match;
			$scope.reseterror = true;
            $scope.isLoading = false;
             $timeout(function(){
				$scope.message = '';
			}, 15000);
            return false;
		}
		formData.token = $scope.reset.token;
		formData.password = $scope.reset.password;
		$scope.message = "";
		//calling the services to sent forget password token
        UserService.resetPassword(formData, function(data){
        	$rootScope.requestPwdMessage = '';
        	if(data.code == 101) {
            	$scope.requestPwdMessage = $scope.i18n.home.reset_password_sucess;
            	$scope.reset = {};
            	$scope.isLoading = false;  	
            } else if(data.code == 113) {
                $scope.isLoading = false;
                $scope.reseterror = true;
                $scope.reset = {};
                $scope.message = $scope.i18n.validation.invalid_password;   
            } else if(data.code == 112) {
                $scope.message = $scope.i18n.validation.invalid_token;
                $scope.reseterror = true;
				$scope.isLoading = false;
                $scope.reset = {};
            } else if(data.code == 100) {
                $scope.isLoading = false;
                $scope.reset = {};
                $scope.message = $scope.i18n.validation.account_inactive;
                $scope.reseterror = true;     
            } else if(data.code == 108) {
                $scope.isLoading = false;
                $scope.reset = {};
                $scope.reseterror = true;
                $scope.message = $scope.i18n.validation.not_reset_password;      
            } else {
                $scope.isLoading = false;
                $scope.reset = {};
                $scope.reseterror = true;
                $scope.message = $scope.i18n.home.not_reset_password;  
            }
            $timeout(function(){
        		$scope.message = '';
        		$scope.requestPwdMessage = '';
        		$scope.reseterror = false;
            }, 15000);

        });
	};

	//<!--login user for payment of shop start-->

	//login form submit: function service to get access_token and login success
	$scope.getShopPaymentLogin = function() {

		if($scope.user.userName == undefined || $scope.user.userName == ''){
			$scope.loginError = true;
			$scope.loginErrorMsg = $scope.i18n.home.enter_your_email;
			return false;
		}else if($scope.user.password == undefined || $scope.user.password == ''){
			$scope.loginError = true;
			$scope.loginErrorMsg = $scope.i18n.home.six_digit_password;
			return false;
		}
		$scope.loginStart = true;
		$scope.loginError = false;
		var opts = {};
		opts = {
			reqObj: {
				client_id : APP.keys.client_id,
				client_secret : APP.keys.client_secret,
		        grant_type : APP.keys.grant_type,
				username : $scope.user.userName,
				password : $scope.user.password
			}
		};
		//call service to get access token
		UserService.getAccessToken(opts)
		.then(function(data) {
			APP.accessToken = data.data.access_token;
			var postData = {
				reqObj: {
					username: $scope.user.userName, 
					password: $scope.user.password
				}
			};
            var method = 'POST';
	            $http({
				method : "POST",
				url : APP.service.logins+"?access_token="+data.data.access_token,
				data : postData,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
			})
            .success( function(data, header){
            	if(data.data && data.code != 100) {
					APP.currentUser = data.data;
					localStorage.setItem("loggedInUser", JSON.stringify(data.data));
            		localStorage.setItem("access_token", APP.accessToken);
					$rootScope.currentUser = data.data;
					$rootScope.isLoggedIn = true;
					$scope.selectlanguage(APP.currentUser.current_language);
					var opts3 = {};
					opts3.user_id = APP.currentUser.id;
					opts3.profile_type = 4;
					UserService.getBasicProfile(opts3, function(data) {
						if(data.code == 101)
							$rootScope.currentUser.basicProfile = data.data;

						//get users credit and the total income 
						var opts4 = {};
						opts4.idcard = $rootScope.currentUser.basicProfile.user_id;
						UserService.getCreditAndIncome(opts4, function(data) {
							if(data.code == 101) {
								var currentCredit = {};
								currentCredit.totalCredit = (data.data.saldoc/1000000);
								currentCredit.totCreditMicro = (data.data.saldorm) + (data.data.saldorc);
								currentCredit.totalIncome = data.data.tot_income ;
                                currentCredit.totalIncomeShow = (data.data.saldorm) + (data.data.saldorc) ;
								$rootScope.currentUser.creditAndIncome = currentCredit;
							}
						});
					});
					$scope.$parent.loggedIn = true;
					$location.path('/shop/register/payment');
				} else {
					$scope.loginError = true;
					$scope.loginStart = false;
					$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
				}
			})
			.error(function(data, status, header){
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
			});
		}, function(error) {
			if(error.error === 'invalid_grant'){
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
			} else {
				$scope.loginError = true;
				$scope.loginStart = false;
				$scope.loginErrorMsg = $scope.i18n.home.server_not_responding;
			}
		});
	};

	//Registration Broker Multiprofile
	$scope.brokerloader = false;
	$scope.regisMessageClass = '';
    $scope.registerMultiProfile = function(){
    	//$scope.brokerloader = true;
        var opts = {};
        opts.user_id = $routeParams.userId;
        opts.phone = $scope.user.phone; 
        opts.iban = $scope.user.iban; 
		opts.type = $routeParams.typeId;
		opts.referral_id = $rootScope.referral_id;
		if(opts.type == 3){
			if($scope.user.name == undefined || $scope.user.name == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_storename;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.business_name == undefined || $scope.user.business_name == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessname;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.business_type == undefined || $scope.user.business_type == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesstype;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.legal_status == undefined || $scope.user.legal_status == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesstatus;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.phone == undefined || $scope.user.phone == '' || isNaN($scope.user.phone) == true){
				$scope.brokerMsg = $scope.i18n.register.enter_businessnumber ;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.email == undefined || $scope.user.email == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessemail;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.country == undefined || $scope.user.country.id == undefined || $scope.user.country.id == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesscountry;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.business_region == undefined || $scope.user.business_region == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessregion;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.business_city == undefined || $scope.user.business_city == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesscity;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.business_address == undefined || $scope.user.business_address == ''){
				$scope.brokerMsg = $scope.i18n.validation.enter_businessaddress;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.zip == undefined || $scope.user.zip == '' || $scope.user.zip.length < 5 || $scope.user.zip.length > 5 ){
				$scope.brokerMsg = $scope.i18n.register.enter_businesszip;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.province == undefined || $scope.user.province == '' ){
				$scope.brokerMsg = $scope.i18n.register.enter_businessprovince;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.province.length < 2 || $scope.user.province.length > 2 ){
				$scope.brokerMsg = $scope.i18n.validation.province_length;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.vat_number == undefined || $scope.user.vat_number == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessvat;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.iban == undefined || $scope.user.iban == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessiban;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.description == undefined || $scope.user.description == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessdesc;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if((document.getElementById("lat").value) == undefined || (document.getElementById("lat").value) == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesslat;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if((document.getElementById("lon").value )== undefined || (document.getElementById("lon").value) == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesslog;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessmap;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} 
			/*else if($scope.user.terms == 'false' || $scope.user.terms == undefined || $scope.user.terms == false || $scope.user.terms == '') {
			    $scope.brokerMsg = $scope.i18n.register.terms_condition_agree;
			    return false;
			}*/
			opts.email = $scope.user.email;
			opts.description = $scope.user.description;
			opts.name = $scope.user.name;
			opts.business_name = $scope.user.business_name;
			opts.legal_status = $scope.user.legal_status;
			opts.business_type = $scope.user.business_type;
			opts.business_country = $scope.user.country.id;
			opts.business_region = $scope.user.business_region;
			opts.business_city = $scope.user.business_city;
			opts.business_address = $scope.user.business_address;
			opts.zip = $scope.user.zip;
			opts.province = $scope.user.province;
			opts.vat_number = $scope.user.vat_number;
                        opts.call_type = 1; 
		}else{

			if($scope.user.phone == undefined || $scope.user.phone == '' || isNaN($scope.user.phone) == true){
				$scope.brokerMsg = $scope.i18n.broker.enter_brokernumber ;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.fiscal == undefined || $scope.user.fiscal == ''){
				$scope.brokerMsg = $scope.i18n.broker.enter_brokerfiscal;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.iban == undefined || $scope.user.iban == ''){
				$scope.brokerMsg = $scope.i18n.broker.enter_brokeriban;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if((document.getElementById("lat").value) == undefined || (document.getElementById("lat").value) == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesslat;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if((document.getElementById("lon").value )== undefined || (document.getElementById("lon").value) == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businesslog;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
				$scope.brokerMsg = $scope.i18n.register.enter_businessmap;
				$scope.regisMessageClass = "text-red fl";
				$timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
				return false;
			} else if($scope.user.terms == '' || $scope.user.terms == undefined || $scope.user.terms == false || $scope.user.terms == '') {
			    $scope.brokerMsg = $scope.i18n.register.terms_condition_agree;
			    $scope.regisMessageClass = "text-red fl";
			    $timeout(function(){
	        		$scope.brokerMsg = "";
		        	$scope.regisMessageClass = '';
		        },15000);
			    return false;
			}

			opts.vat_number = $scope.user.vat; 
			opts.fiscal_code = $scope.user.fiscal;
            opts.call_type = 1; 
		}
			opts.latitude = document.getElementById("lat").value;
			opts.longitude = document.getElementById("lon").value;
			opts.map_place = document.getElementById("mapplace").value;
			$scope.brokerloader = true;
            $scope.brokerMsg = "";
        	UserService.registerMultiProfile(opts, function(data){
	        	if(data.code == 101) {
		        	//$scope.brokerloader = false;
		        	$scope.brokerMsg = data.message;
		        	$scope.regisMessageClass = "text-success fl";
		        	$rootScope.tempStoreId = data.data.store_id;
		        	$rootScope.tempUserId = $routeParams.userId;
		        	//set the value in cookie
		        	$cookieStore.put('tempStoreId',data.data.store_id);
		        	$cookieStore.put('tempUserId',$routeParams.userId);

		        	$scope.user.userName = saveUserPass.getUsername();
		        	$scope.user.password = saveUserPass.getPassword();
		        	saveUserPass.clearUserPass();
		        	if(opts.type == 3){
		        		$scope.getShopPaymentLogin();
		        	} else {
						$scope.getLogin();	        		
		        	}
		        } else if (data.code == 137) {
		        	$scope.brokerMsg = $scope.i18n.validation.broker_not_exists;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else if (data.code == 111) {
		        	$scope.brokerMsg = $scope.i18n.validation.user_id_required;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else if (data.code == 132) {
		        	$scope.brokerMsg = $scope.i18n.validation.invalid_profile_type;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else if (data.code == 133) {
		        	$scope.brokerMsg = $scope.i18n.validation.user_not_exists;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else if (data.code == 143) {
		        	$scope.brokerMsg = $scope.i18n.validation.referral_id_needed;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else if (data.code == 165) {
		        	$scope.brokerMsg = $scope.i18n.validation.vat_valid;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else if (data.code == 166) {
		        	$scope.brokerMsg = $scope.i18n.validation.iban_valid;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else if (data.code == 138) {
		        	$scope.brokerMsg = $scope.i18n.validation.vat_exists;
		        	$scope.brokerloader = false;
		        	$scope.regisMessageClass = "text-red fl";
		        } else {
	                $scope.brokerloader = false;
	                // $scope.brokerMsg = data.message;
	                $scope.brokerMsg = data.message;
	                $scope.regisMessageClass = "text-red fl";
	            }
	        $timeout(function(){
	        	$scope.brokerMsg = "";
	        	$scope.regisMessageClass = '';
	        },15000);
        });
    }
    

	//function to cancel from forgot password and redirecting to login page
	$scope.cancelForgotPassword = function () {
		$location.path('/');
	};
	//Displaying Map with lat long feature
	/*	$scope.mapsection = function() {
			var mapLatitude;
			var mapLogitude;
	        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 }
	        $scope.options = {scrollwheel: false};
	        $scope.marker = {
	            id:0,
	            coords: {
	                latitude: 40.1451,
	                longitude: -99.6680
	            },
	            options: { draggable: true },
	            events: {
	                dragend: function (marker, eventName, args) {
	                	document.getElementById("lat").value = marker.getPosition().lat();
	                	document.getElementById("lon").value = marker.getPosition().lng();
	                	mapLatitude = marker.getPosition().lat();
	                	mapLogitude = marker.getPosition().lng();
	                	$scope.maplocation(mapLatitude, mapLogitude);
	                }
	            }
	        }
	    }

	    $scope.maplocation = function(mapLatitude, mapLogitude) {
	    	var geocoder;
			geocoder = new google.maps.Geocoder();
	  		var lat = parseFloat(mapLatitude);
	  		var lng = parseFloat(mapLogitude);
	  		var latlng = new google.maps.LatLng(lat, lng);
	  		geocoder.geocode({'latLng': latlng}, function(results, status) {
	    	if (status == google.maps.GeocoderStatus.OK) {
	      		if (results[1]) {
	       			$('#mapplace').val(results[1].formatted_address);
	      		} else {
	        	alert('No results found');
	      		}
	    	} else {
	      	alert('Geocoder failed due to: ' + status);
	    	}
	  		});
	    }

	    $scope.mapsection();*/

    $scope.initialize = function () {
		var mapOptions = {
			center: new google.maps.LatLng(-33.8688, 151.2195),
			zoom: 13
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
			document.getElementById("mapplace").value = countryPlace.formatted_address; //address_components[0].long_name;

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
	}

	angular.element('#map-canvas').ready(function() {
		if (($location.path().indexOf("/storeProfilestep") != -1)) {
		    $timeout(function() {
		      $scope.initialize();
		    },  2000);
		}
	});

	// set the value for login and password for remember me
	$scope.rememberMe = function() {
		if (($remember('username') !== null && $remember('password') !== null) && ($remember('username') !== '' && $remember('password') !== '')) {
			$scope.user.remember = true;
	        $scope.user.userName = $remember('username');
	        $scope.user.password = $remember('password');
	    }
	}
}]);


// Controller for handing the comment related operation
app.controller('CreateBrokerController',['$scope', '$location', '$timeout', 'CreateBrokerService', 'ProfileImageService', function($scope, $location, $timeout, CreateBrokerService, ProfileImageService) {

    ///Creater Broker in citizen Multiprofile 
    $scope.createBroker = function() {
    	if($scope.user.phone == undefined || $scope.user.phone == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokernumber;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else if($scope.user.vat == undefined || $scope.user.vat == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokervat;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else if($scope.user.fiscal == undefined || $scope.user.fiscal == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokerfiscal;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else if($scope.user.iban == undefined || $scope.user.iban == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokeriban;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else if($scope.user.referral_id == undefined || $scope.user.referral_id == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokerrefferal;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else if(document.getElementById('mapplace').value == undefined || document.getElementById('mapplace').value == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokermapplace;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else if(document.getElementById('lon').value == undefined || document.getElementById('lon').value == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokerlog;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else if(document.getElementById('lat').value == undefined || document.getElementById('lat').value == ''){
    		$scope.brokerMsg = $scope.i18n.broker.enter_brokerlat;
    		$timeout(function(){
				$scope.brokerMsg = "";
			}, 4000);
    		return false;
    	} else 

    	$scope.brokerloader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.phone = $scope.user.phone; 
        opts.vat_number = $scope.user.vat; 
        opts.fiscal_code = $scope.user.fiscal;
        opts.iban = $scope.user.iban;
        opts.referral_id = $scope.user.referral_id; 
        opts.map_place = document.getElementById('mapplace').value;
        opts.latitude = document.getElementById('lat').value; 
        opts.longitude = document.getElementById('lon').value; 
        opts.type = 2; 
        opts.call_type = 2; 
        CreateBrokerService.createBroker(opts, function(data){
        	//$location.path('/profile');
            if(data.code == 101) {
            	$scope.brokerloader = false;
        		$scope.brokerMsg = $scope.i18n.broker.broker_success;  
        		 $scope.viewmultiprofiles();
        		$timeout(function() {
        			$scope.brokerMsg = "";   
        			$location.path('/profile');
        		}, 2000);
            } else if(data.code == 137) {
            	$scope.brokerloader = false;
        		$scope.brokerMsgerror = $scope.i18n.validation.broker_not_exists;; 
        		$timeout(function(){
				$scope.brokerMsgerror = "";
				}, 4000);
            } else {
                $scope.brokerloader = false;
        		$scope.brokerMsgerror = data.message; 
        		$timeout(function(){
				$scope.brokerMsgerror = "";
				}, 4000);
            }
        });
    }


    $scope.viewmultiprofiles = function(){

        $scope.albloader = true; 
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.profile_type = 4; 
        ProfileImageService.viewmultiprofiles(opts, function(data){
            if(data.code == 101) {
                $scope.albloader = false; 
                $scope.picloader = false;
                $scope.propic = true; 
                $rootScope.currentUser.basicProfile = data.data;
            } else {                
                $scope.propic = true; 
                $scope.picloader = false;
                
            }
        });
    }


    $scope.initialize = function () {
		var mapOptions = {
			center: new google.maps.LatLng(-33.8688, 151.2195),
			zoom: 13
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
	}
	$timeout(function(){
		$scope.initialize();
	}, 1000);

}]);

app.controller('MessageNotifiController',['$cookieStore', '$rootScope', '$scope', '$http', '$location', '$timeout', '$interval', 'ProfileService', 'UserService', 'threadAndPass', function($cookieStore, $rootScope, $scope, $http, $location, $timeout, $interval, ProfileService, UserService, threadAndPass) {
	$rootScope.showNewMessageList = false;
    $scope.newMessageShow = false;
	$scope.messageNoti = [];
	$scope.cancelUnreadRequest = 0;
	$scope.loadingUnreadMssage = false;
	$scope.count = 0;
	$scope.noMesasge = true;
	$scope.scopeVar1 = false;
	$rootScope.listUnReadMessages = function(){
		$scope.newMessageShow = false;
		$scope.loadingUnreadMssage = true;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.is_view = "1";
		opts.limit_start = "0";
		opts.limit_size = "10";
		ProfileService.listUnReadMessages(opts, function(data){
            if(data.code == 101) {
        		$scope.cancelUnreadRequest = 1;
            	$scope.messageNoti = data.data;
            	$scope.newMessageShow = true;
            	$scope.loadingUnreadMssage = false;
            	var count = $scope.messageNoti.length;
            	if(count > 0){
            		$scope.count = count;
            	}else {
            	//	$scope.messageNoti = {No message}
            		$scope.noMesasge = false;
            	}
            }else {
            	$scope.newMessageShow = true;
            	$scope.loadingUnreadMssage = false;
            }
            $rootScope.getCountOfAllTypeNotificaton();
        });
	}
	$scope.blockUiClick = function(even){
		if(even.target.nodeName!=='IMG'){
			var temp=$rootScope.toggleSearch
			$rootScope.toggleSearch=null
	        setTimeout(function(){
				$rootScope.toggleSearch=temp
			},100)
	    }
	}
	$scope.showAllMessage = function($event) {
		if($event != undefined){
			$event.stopPropagation();
		}
		var temp=$rootScope.toggleSearch
		$rootScope.toggleSearch=null
		setTimeout(function(){
			$rootScope.toggleSearch=temp
		},100);
		$rootScope.groupNotificationList = false;
		$rootScope.showNotificationList = false;
		$rootScope.showFriendNotificationList=false;
		$rootScope.loadGroupNotification = false;
		$rootScope.showNewMessageList = !$rootScope.showNewMessageList;
		$scope.scopeVar1 = !$scope.scopeVar1;
        $scope.scopeVar2 = false;
        $scope.scopeVar = false;
        $scope.scopeVar3 = false;
        if($scope.scopeVar1){
			$rootScope.listUnReadMessages();
        }else{
        	$rootScope.getCountOfAllTypeNotificaton();
        }
	};

    $scope.NotificationMessageOut = function(){
     $rootScope.showNewMessageList = false;
     $scope.scopeVar1 = false;
    }; 
	$scope.closeDrop = function(){
		$rootScope.showNewMessageList = !$rootScope.showNewMessageList;
	}

	$scope.markReadAllMessages = function(){
		var opts = {};
		opts.user_id = APP.currentUser.id;
		MessageService.markReadAllMessages(opts, function(data){
            if(data.code == 100) {
  				$scope.newMessageShow = false;
            } else {
            
            }
        });
	}

	$scope.readMessage = function(threadId){   
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.thread_id = threadId;
        ProfileService.readMessage(opts, function(data){
            if(data.code == 101) {
            }
            else {
            }
        });
    }

	$scope.storeThreadAndFriendId = function(threadId, friendId){
		//var opts = {};
		//if(threadId != 0){
			threadAndPass.saveThreadAndFriend(threadId, friendId);
		/*} else {
			 threadAndPass.saveThreadAndFriend(messageId, friendId);
		}*/
	}
}]);

app.controller('SkillController',['$cookieStore', '$rootScope', 'ipCookie', '$scope', 'ProfileService', function($cookieStore, $rootScope, ipCookie, $scope,ProfileService ) {
	$scope.loadSkill = true;
	$scope.getSkills = function(){
    	var opts = {};
    	opts.user_id = APP.currentUser.id;
    	ProfileService.getUserSkills(opts,function(data){
    		$scope.loadSkill = false;
    		if(data.code === 101 && data.message === "SUCCESS"){
    			if(data.data.skills.skills.length > 0){
    				$scope.storeSkills = data.data.skills.skills.split(',');
    			}
    		}
    	});
    };
    $scope.getSkills();
}]);
