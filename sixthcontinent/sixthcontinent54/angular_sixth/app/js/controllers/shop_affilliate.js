//User will join the site from here when they come throught invited links
//For Landing page1 
app.controller('InvitedUserJoinSite', ['$cookieStore', '$rootScope', 'ipCookie', '$scope', '$http', 'TopLinkService', '$timeout', '$routeParams', '$location', function($cookieStore, $rootScope, ipCookie, $scope, $http, TopLinkService, $timeout, $routeParams, $location){
	$scope.coming_user_id = $routeParams.user_id;
	$scope.profile_type = $routeParams.type;
	$scope.isValid = 0;
	$scope.validInvitedUser = false;
	$scope.checkingloader = true;
	var opts = {};
	opts.user_id = $routeParams.user_id;
	opts.type = $routeParams.type;
	if(opts.type == 4) {
		$scope.validInvitedUser = true;
		$scope.checkingloader = false;
		TopLinkService.setNoAffiliated(true);
	} else if(opts.type == 5) {
		$scope.validInvitedUser = true;
		$scope.checkingloader = false;
	} else {
		TopLinkService.checkIsValidAffiliation(opts, function(data) {
			//Put the affiliated details in cookies
			var Affiliated = {};
			Affiliated.affiliator_id = opts.user_id;
			Affiliated.type = opts.type;
			if(Affiliated.type == 3) {
				localStorage.setItem('ShopAffiliatedObject', JSON.stringify(Affiliated));
			} else if(Affiliated.type == 1) {
				localStorage.setItem('CitizenAffiliatedObject', JSON.stringify(Affiliated));
			}
			TopLinkService.setAffiliationObject(opts);
			if(data.code == 101) {
				if(opts.type == 1) {
					$location.path('/citizen_affiliation_regis');
				} else {
					$scope.checkingloader = false;
				}
				$scope.validInvitedUser = true;
			} else {
				$scope.validInvitedUser = false;
				$scope.checkingloader = false;
			}
		});
	}
}]);

//For landing page2
app.controller('ShopLanding2Controller', ['$cookieStore', '$scope', '$rootScope', '$window', 'ipCookie', '$http', '$routeParams', '$timeout', '$location', 'AffiliatedkService', 'TopLinkService', 'UserService', 'EMAILPATTERN', 'focus', function($cookieStore, $scope, $rootScope, $window, ipCookie, $http, $routeParams, $timeout, $location, AffiliatedkService, TopLinkService, UserService, EMAILPATTERN, focus) {
	$scope.showLoading = true;
	$scope.sameAccount = false;
	$scope.newAccount = false;
	$scope.newLogin = false;
	$scope.profileType = $routeParams.profileType;
	//create data of birth drop dwon start
	//creat month array
	$scope.months = $scope.i18n.profile.months;
	$scope.countries  = $scope.i18n.countries;
	//create days array
	$scope.years = [];
	$scope.getYears = function() {
		var currentYear = new Date().getFullYear();
		$scope.years = [];
		for (var i = currentYear; i >= 1914 ; i--){
			$scope.years.push({"id":i,"value":i});
		}
  	}
  	$scope.getYears();
  	
	//create data of birth drop dwon end
	$scope.$watch('currentLanguage',function(newValue,oldValue){
		$timeout(function(){
			$scope.months = $scope.i18n.profile.months;
			$scope.countries  = $scope.i18n.countries;
		}, 400 );
	});
	
	//$scope.days = [];
	$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	$scope.$watch('user.month', function(newValue){
		if (newValue && newValue.value-7 <= 0){
			if(newValue.value%2==1) $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
			else $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
		} else {
			if(newValue && newValue.value % 2 == 1) $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
			else $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
		}
		if(newValue && newValue.value == 2) $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
	});

	$scope.$watch('user.year',function(newValue){
		if(newValue&&newValue.value % 4 == 0 && $scope.user.month.value == 2){
				$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
		}
	})

	if(TopLinkService.getAffiliationObject().hasOwnProperty("user_id")) {
		var affiliate = TopLinkService.getAffiliationObject();
		$scope.isreferralId = affiliate.user_id;
		$scope.referralId = affiliate.user_id;
		$scope.filtertypeId = affiliate.type;
	}

	if($scope.currentUser.id) {
		if($scope.currentUser.basicProfile) {
			$scope.sameAccount = true;
			$scope.oldUser = {};
			$scope.oldUser.userEmail = $scope.currentUser.basicProfile.email;
			$scope.oldUser.userPassword = 123456;
			$scope.oldUser.firstName = $scope.currentUser.basicProfile.firstname;
			$scope.oldUser.lastName = $scope.currentUser.basicProfile.lastname;
			$scope.oldUser.gender = $scope.currentUser.basicProfile.gender;
			$scope.oldUser.dob = $scope.currentUser.basicProfile.date_of_birth ? $scope.currentUser.basicProfile.date_of_birth.date :'';	
			$scope.oldUser.country = $scope.currentUser.basicProfile.country.name;
		} else {
			$location.path("/");
		}
	} else {
		$scope.newAccount = true;
	}

	$scope.changeLoginAccount = function() {
		$scope.sameAccount = false;
		$scope.newAccount = false;
		$scope.newLogin = true;
	};

	$scope.alreadyUserLogin = function() {
		var isAlreadyUser = {};
		isAlreadyUser.yes = true;
		isAlreadyUser.profileType = $scope.profileType;
		TopLinkService.setIsAlreadyUserLogin(isAlreadyUser);
		$location.path('/');
	}

	$scope.createNewAccount = function() {
		$scope.sameAccount = false;
		$scope.newAccount = true;
		$scope.newLogin = false;
	};

	$scope.back = function(){
		$scope.sameAccount = true;
		$scope.newAccount = false;
		$scope.newLogin = false;
	}

	$scope.backLocation = function() {
		$window.history.back();
	};

	$scope.changeAccountSubmitted = false;
	$scope.proceedWithNewAccount = function() {
		$scope.changeAccountSubmitted = true;
		if($scope.changeUser.userName === undefined || $scope.changeUser.userName === '' ){
			$scope.user.email.$dirty = true;
            $scope.user.email.$invalid = true;
            $scope.user.email.$error.required = true;
            focus('changeemailid');
			return false;
		} else if($scope.changeUser.password === undefined || $scope.changeUser.password === ''){
       		$scope.user.changepassword.$dirty = true;
            $scope.user.changepassword.$invalid = true;
            $scope.user.changepassword.$error.required = true;
            focus('changepassword');
       		return false;
       	} else {
       		$scope.loginStart = true;
				var	opts1 = {
					reqObj: {
						client_id : APP.keys.client_id,
						client_secret : APP.keys.client_secret,
				        grant_type : APP.keys.grant_type,
						username : $scope.changeUser.userName,
						password :  $.base64.encode($scope.changeUser.password)
					}
				};
				//call service to get access token
				UserService.getAccessToken(opts1).then(function(data) {
					console.log(data);
					if(data.code != 100){
					APP.accessToken = data.data.access_token;
					var opts2 = {};
					opts2.username = $scope.changeUser.userName;
					opts2.password =  $.base64.encode($scope.changeUser.password);
					UserService.getLoginUser(opts2, function(data){
			            	if(data.data && data.code != 100) {
								APP.currentUser = data.data;
								// ipCookie("loggedInUser", data.data, { expires: 365 });
								// ipCookie("access_token", APP.accessToken, { expires: 3000 });
								localStorage.setItem("loggedInUser", JSON.stringify(data.data));
            					localStorage.setItem("access_token", APP.accessToken);
								$rootScope.currentUser = data.data;
								$rootScope.isLoggedIn = true;
								if(APP.currentUser.country == 'IT') {
									$scope.selectlanguage('it');
								} else {
									$scope.selectlanguage('en');
								}
								var opts3 = {};
								opts3.user_id = APP.currentUser.id;
								opts3.profile_type = 4;
								UserService.getBasicProfile(opts3, function(data) {
									if(data.code == 101)
										$rootScope.currentUser.basicProfile = data.data;
									var opts4 = {};
									opts4.idcard = $rootScope.currentUser.basicProfile.user_id;
									UserService.getCreditAndIncome(opts4, function(data) {
										var currentCredit = {};
										if(data.code == 101) {
											currentCredit.totalCredit = (data.data.saldoc/1000000) ;
											currentCredit.totCreditMicro = (data.data.saldorm) + (data.data.saldorc) ;
											currentCredit.totalIncome = data.data.tot_income;
											currentCredit.totalIncomeShow = data.data.tot_income;
											$rootScope.currentUser.creditAndIncome = currentCredit;
										}
										else{
											$rootScope.currentUser.creditAndIncome = data.data;
										}
									});
								});
								$scope.$parent.loggedIn = true;
								$location.path("/shop/register/3");
							} else {
			                    $scope.loginError = true;
       							$scope.loginStart = false;
								$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
								$timeout(function(){
				                $scope.loginError = false;
				                }, 15000);
							}
					});
					} else {
						$scope.loginError = true;
       					$scope.loginStart = false;
						$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
						$timeout(function(){
		                $scope.loginError = false;
		                }, 15000);
					}
				}, function(error) {
					if(data.error === 'invalid_grant'){
						$scope.loginError = true;
       					$scope.loginStart = false;
						$scope.loginErrorMsg = $scope.i18n.home.invalid_username;
						$timeout(function(){
		                $scope.loginError = false;
		                }, 15000);
					} else {
						$scope.loginStart = false;
						$scope.loginErrorMsg = $scope.i18n.home.server_not_responding;
						$timeout(function(){
		                $scope.loginError = false;
		                }, 15000);
					}
				});
			}
	};

	$scope.invalidSelectedDob = false;
	$scope.formSubmitted = false;
	$scope.registerCitizen = function() {
		var currentDOB = new Date();
		$scope.formSubmitted = true;
       	var opts = {};
       	if($scope.user.userEmail === undefined || $scope.user.userEmail === '' ){
			$scope.user.emailCitizenReg.$dirty = true;
            $scope.user.emailCitizenReg.$invalid = true;
            $scope.user.emailCitizenReg.$error.required = true;
            focus('emailCitizenReg');
			return false;
		} else if($scope.user.userPassword === undefined || $scope.user.userPassword === '' ){
       		$scope.user.pwdCitizenReg.$dirty = true;
            $scope.user.pwdCitizenReg.$invalid = true;
            $scope.user.pwdCitizenReg.$error.required = true;
            focus('pwdCitizenReg');
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
            focus('lname');;
			return false;
		}else if($scope.user.month.value === undefined || $scope.user.month.value === '' ){
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
		}else if($scope.user.year.value === undefined || $scope.user.year.value === '' ){
			$scope.user.dobyear.$dirty = true;
            $scope.user.dobyear.$invalid = true;
            $scope.user.dobyear.$error.required = true;
            focus('dobyear')
			return false;
		}else if($scope.user.gender === undefined || $scope.user.gender === 0){
			$scope.user.genCitizenreg.$dirty = true;
            $scope.user.genCitizenreg.$invalid = true;
            $scope.user.genCitizenreg.$error.required = true;
            focus('genCitizenreg')
			return false;
		}else if($scope.user.year.value === currentDOB.getFullYear() && ($scope.user.month.value >= (currentDOB.getMonth()+1)) && ($scope.user.day > currentDOB.getDate())){
        	$scope.invalidSelectedDob = true;
			focus('dobday');
			$timeout(function(){
				$scope.invalidSelectedDob = false;
			},2000);
			return false;
        }else if($scope.user.country === undefined || $scope.user.country.id === undefined || $scope.user.country.id === '' ){
			$scope.user.countryReg.$dirty = true;
            $scope.user.countryReg.$invalid = true;
            $scope.user.countryReg.$error.required = true;
            focus('countryReg');
			return false;
		}else {
			//check if referral user going to affiliate shop 
			if(!TopLinkService.getNoAffiliated()) {
				if(localStorage.getItem('ShopAffiliatedObject')) {
					opts.referral_id = JSON.parse(localStorage.getItem('ShopAffiliatedObject')).affiliator_id;
				}
	    	}
			opts.email = $scope.user.userEmail;
			opts.firstname = $scope.user.firstName;
			opts.lastname = $scope.user.lastName;
			opts.password = $.base64.encode($scope.user.userPassword);
			opts.birthday = $scope.user.day + '-' + $scope.user.month.value + '-' + $scope.user.year.id;
			opts.gender = $scope.user.gender;
			opts.country = $scope.user.country.id;
			opts.type = 1;
			$scope.showLoading = false;

			UserService.registration(opts, function(data) {
				if(data.code == 101) {
					if(data.data.profile_type == 1){
						var	opts1 = {
							reqObj: {
								client_id : APP.keys.client_id,
								client_secret : APP.keys.client_secret,
						        grant_type : APP.keys.grant_type,
								username : $scope.user.userEmail,
								password : $.base64.encode($scope.user.userPassword)
							}
						};
						//call service to get access token
						UserService.getAccessToken(opts1).then(function(data) {
							APP.accessToken = data.data.access_token;
							var opts2 = {};
							opts2.username = $scope.user.userEmail;
							opts2.password = $.base64.encode($scope.user.userPassword);
							UserService.getLoginUser(opts2, function(data){
				            	if(data.data && data.code != 100) {
									APP.currentUser = data.data;
									// ipCookie("loggedInUser", data.data, { expires: 365 });
									// ipCookie("access_token", APP.accessToken, { expires: 3000 });
									localStorage.setItem("loggedInUser", JSON.stringify(data.data));
            						localStorage.setItem("access_token", APP.accessToken);
									$rootScope.currentUser = data.data;
									$rootScope.isLoggedIn = true;
									if(APP.currentUser.country == 'IT') {
										$scope.selectlanguage('it');
									} else {
										$scope.selectlanguage('en');
									}
									var opts3 = {};
									opts3.user_id = APP.currentUser.id;
									opts3.profile_type = 4;
									UserService.getBasicProfile(opts3, function(data) {
										if(data.code == 101)
											$rootScope.currentUser.basicProfile = data.data;
										var opts4 = {};
										opts4.idcard = $rootScope.currentUser.basicProfile.user_id;
										UserService.getCreditAndIncome(opts4, function(data) {
											var currentCredit = {};
											if(data.code == 101) {
												currentCredit.totalCredit = (data.data.saldoc/1000000) ;
												currentCredit.totCreditMicro = (data.data.saldorm) + (data.data.saldorc) ;
												currentCredit.totalIncome = data.tot_income;
												currentCredit.totalIncomeShow = data.tot_income;
												$rootScope.currentUser.creditAndIncome = currentCredit;
											}
											else{
												$rootScope.currentUser.creditAndIncome = data.data;
											}
										});
									});
									$scope.$parent.loggedIn = true;
									$location.path("/shop/register/"+$scope.profileType);
								} else {
				                    $scope.showLoading = true;
									$scope.signUpSuccessMsg = $scope.i18n.home.invalid_username;
									$timeout(function(){
					                $scope.signUpSuccessMsg = '';
					                }, 15000);
								}
							});
						}, function(error) {
							if(error.error === 'invalid_grant'){
								$scope.showLoading = true;
								$scope.signUpSuccessMsg = $scope.i18n.home.invalid_username;
								$timeout(function(){
				                $scope.signUpSuccessMsg = '';
				                }, 15000);
							} else {
								$scope.showLoading = true;
								$scope.signUpSuccessMsg = $scope.i18n.home.server_not_responding;
								$timeout(function(){
				                $scope.signUpSuccessMsg = '';
				                }, 15000);
							}
						});
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
}]);

//Shop register in the second step
app.controller('ShopRegisterController', ['$cookieStore', '$rootScope', 'ipCookie', '$scope', '$http', 'StoreService', '$timeout', '$routeParams', '$location', 'TopLinkService', 'ProfileService', 'focus', function($cookieStore, $rootScope, ipCookie, $scope, $http, StoreService, $timeout, $routeParams, $location, TopLinkService, ProfileService, focus){
	$scope.store = {};
	$scope.store.storecategory = {};
	$scope.store.storecategory.id = 0;
	var tempcat = $scope.store.storecategory.id;
	$scope.regions = APP.regions;
	$scope.enableKeyword = true;
	$scope.enableSubcategory = true;
	
	if(TopLinkService.getAffiliationObject().hasOwnProperty("user_id")) {
		var affiliate = TopLinkService.getAffiliationObject();
		$scope.isreferralId = affiliate.user_id;
		$scope.referralId = affiliate.user_id;
		$scope.filtertypeId = affiliate.type;
	}

	// creating category drop down
	$scope.$watch('currentLanguage', function(newValue, oldValue) {
		$scope.searchCategory(newValue);
		if(tempcat != '' && tempcat != 0){
			$scope.getSubCategory();
		}
	});

	$scope.backLocation = function() {
		$location.path("/citizen/register/"+$routeParams.profileType);
	};

	$scope.searchCategory = function(currentLanguage){
		var opts = {};
		opts.lang_code = currentLanguage;
		opts.session_id = APP.currentUser.id;
		$scope.cancelCategoryRequest = false;
		opts.session_id = APP.currentUser.id;
		ProfileService.searchCatagory(opts,function(data){
			if(data.code === 101 && data.message === 'SUCCESS'){
				if(data.data.length > 0){
					$scope.categories = data.data;
				}
			}
		});
	};

	//function to get the subcategory not in current use for registred shop
	$scope.getSubCategory = function(){
		if($scope.store.storecategory.id != '' && $scope.store.storecategory.id != 0){
			// enable disable keyword box
			$scope.enableKeyword = false;
			$scope.enableSubcategory = false;
			var opts = {};
			opts.lang_code = $scope.currentLanguage;
			opts.cat_id = $scope.store.storecategory.id;
			opts.session_id = APP.currentUser.id;
			$scope.cancelCategoryRequest = false;
			StoreService.getSubCategoryList(opts,function(data){
				if(data.code === 101 && data.message === 'SUCCESS'){
					$scope.subcategories = data.data;
				}
			});
		}else{
				$scope.enableKeyword = true;
				$scope.enableSubcategory = true;
		}
	};

	$scope.searchCategory($scope.currentLanguage);
	$scope.createStoreLoader = false;
	$scope.createStoreError = false;
	$scope.createStoreErrorMgs = "";  //$scope.i18n.storealbum.album_ErrorMgs
	$scope.store = {};
	$scope.legalForms = APP.legalForms;
	$scope.countries  = $scope.i18n.countries;
	$scope.createShopErrorMgs = '';
	$scope.vatNumberInvalid = false;
	$scope.ibanNumberInvalid = false;
	
	//function to validate and save the data of the Shop
	$scope.registerShop = function() {
		$scope.createStoreLoader = true;
		$scope.formSubmitted = true;
		if($scope.store.name == undefined || $scope.store.name == '' ){
			$scope.inputname = "storename";
			$scope.shopCreateForm.storename.$dirty = true;
			$scope.shopCreateForm.storename.$invalid = true;
			$scope.shopCreateForm.storename.$error.required = true;
			focus('storename');
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			return false;
		}else if($scope.store.companyName == undefined || $scope.store.companyName == '' ){
			$scope.inputname = "companyName";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.storecompany.$dirty = true;
			$scope.shopCreateForm.storecompany.$invalid = true;
			$scope.shopCreateForm.storecompany.$error.required = true;
			focus('storecompany');
			return false;
		}else if($scope.store.legalForm == undefined || $scope.store.legalForm == '' ){
			$scope.inputname = "legalForm";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.legalform.$dirty = true;
			$scope.shopCreateForm.legalform.$invalid = true;
			$scope.shopCreateForm.legalform.$error.required = true;
			focus('legalForm');
			return false;
		}else if($scope.store.vatNumber == undefined || $scope.store.vatNumber == ''){
			$scope.inputname = "vatNumber";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.vatnumber.$dirty = true;
			$scope.shopCreateForm.vatnumber.$invalid = true;
			$scope.shopCreateForm.vatnumber.$error.required = true;
			focus('vatNumber');
			return false;
		}else if($scope.store.taxNumber == undefined || $scope.store.taxNumber == ''){
			$scope.inputname = "taxNumber";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.taxnumber.$dirty = true;
			$scope.shopCreateForm.taxnumber.$invalid = true;
			$scope.shopCreateForm.taxnumber.$error.required = true;
			focus('taxNumber');
			return false;
		}else if($scope.store.email == undefined || $scope.store.email == '' ){
			$scope.inputname = "email";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.shopemail.$dirty = true;
			$scope.shopCreateForm.shopemail.$invalid = true;
			$scope.shopCreateForm.shopemail.$error.required = true;
			focus('email');
			return false;
		}else if($scope.store.confirmemail == undefined || $scope.store.confirmemail == '' || ($scope.store.email !== $scope.store.confirmemail)){
			$scope.inputname = "confirmemail";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.confirmemail.$dirty = true;
			$scope.shopCreateForm.confirmemail.$invalid = true;
			$scope.shopCreateForm.confirmemail.$error.required = true;
			focus('confirmemail');
			return false;
		}else if($scope.store.phone == undefined || $scope.store.phone == '' || isNaN($scope.store.phone) == true ){
			$scope.inputname = "phone";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.shopphone.$dirty = true;
			$scope.shopCreateForm.shopphone.$invalid = true;
			$scope.shopCreateForm.shopphone.$error.required = true;
			focus('phone');
			return false;
		}else if($scope.store.iban == undefined || $scope.store.iban == ''){
			$scope.inputname = "iban";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.iban.$dirty = true;
			$scope.shopCreateForm.iban.$invalid = true;
			$scope.shopCreateForm.iban.$error.required = true;
			focus('iban');
			return false;
		}else if($scope.store.storecategory == undefined || $scope.store.storecategory == ''){
			$scope.inputname = "storecategory";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.storecategory.$dirty = true;
			$scope.shopCreateForm.storecategory.$invalid = true;
			$scope.shopCreateForm.storecategory.$error.required = true;
			focus('storecategory');
			return false;
		}else if($scope.store.description == undefined || $scope.store.description == ''){
			$scope.inputname = "description";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.description.$dirty = true;
			$scope.shopCreateForm.description.$invalid = true;
			$scope.shopCreateForm.description.$error.required = true;
			focus('description');
			return false;
		}else if($scope.store.regOfficeCountry == undefined || $scope.store.regOfficeCountry == ''){
			$scope.inputname = "regOfficeCountry";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.regofficecountry.$dirty = true;
			$scope.shopCreateForm.regofficecountry.$invalid = true;
			$scope.shopCreateForm.regofficecountry.$error.required = true;
			focus('regOfficeCountry');
			return false;
		}else if($scope.store.regOfficeRegion == undefined || $scope.store.regOfficeRegion == ''){
			$scope.inputname = "regOfficeRegion";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.regofficeregion.$dirty = true;
			$scope.shopCreateForm.regofficeregion.$invalid = true;
			$scope.shopCreateForm.regofficeregion.$error.required = true;
			focus('regOfficeRegion');
			return false;
		}else if($scope.store.regOfficeCity == undefined || $scope.store.regOfficeCity == ''){
			$scope.inputname = "regOfficeCity";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.regofficecity.$dirty = true;
			$scope.shopCreateForm.regofficecity.$invalid = true;
			$scope.shopCreateForm.regofficecity.$error.required = true;
			focus('regOfficeCity');
			return false;
		}else if($scope.store.province == '' || $scope.store.province == undefined) {
			$scope.inputname = "province";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.province.$dirty = true;
			$scope.shopCreateForm.province.$invalid = true;
			$scope.shopCreateForm.province.$error.required = true;
			focus('province');
			return false;
		}else if($scope.store.province.length != 2 ){
			$scope.store.province = '';
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.province.$dirty = true;
			$scope.shopCreateForm.province.$invalid = true;
			$scope.shopCreateForm.province.$error.required = true;
			focus('province');
			return false;
		}else if($scope.store.regOfficezip == '' || $scope.store.regOfficezip == undefined || isNaN($scope.store.regOfficezip) == true ) {
			$scope.inputname = "regOfficezip";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.regofficezip.$dirty = true;
			$scope.shopCreateForm.regofficezip.$invalid = true;
			$scope.shopCreateForm.regofficezip.$error.required = true;
			focus('regOfficezip');
			return false;
		}else if($scope.store.regOfficezip.length !=5 ){
			$scope.store.regOfficezip = '';
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.regofficezip.$dirty = true;
			$scope.shopCreateForm.regofficezip.$invalid = true;
			$scope.shopCreateForm.regofficezip.$error.required = true;
			focus('regOfficezip');
			return false;
		}else if($scope.store.regOfficeStreet == undefined || $scope.store.regOfficeStreet == ''){
			$scope.inputname = "regOfficeStreet";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.regofficestreet.$dirty = true;
			$scope.shopCreateForm.regofficestreet.$invalid = true;
			$scope.shopCreateForm.regofficestreet.$error.required = true;
			focus('regOfficeStreet');
			return false;
		}else if($scope.store.HQCountry == undefined || $scope.store.HQCountry == '' ){
			$scope.inputname = "HQCountry";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqcountry.$dirty = true;
			$scope.shopCreateForm.hqcountry.$invalid = true;
			$scope.shopCreateForm.hqcountry.$error.required = true;
			focus('HQCountry');
			return false;
		}else if($scope.store.HQRegion == '' || $scope.store.HQRegion == undefined) {
			$scope.inputname = "HQRegion";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqregion.$dirty = true;
			$scope.shopCreateForm.hqregion.$invalid = true;
			$scope.shopCreateForm.hqregion.$error.required = true;
			focus('HQRegion');
			return false;
		}else if($scope.store.HQCity == '' || $scope.store.HQCity == undefined) {
			$scope.inputname = "HQCity";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqcity.$dirty = true;
			$scope.shopCreateForm.hqcity.$invalid = true;
			$scope.shopCreateForm.hqcity.$error.required = true;
			focus('HQCity');
			return false;
		}else if($scope.store.HQProvince == '' || $scope.store.HQProvince == undefined) {
			$scope.inputname = "HQProvince";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqprovince.$dirty = true;
			$scope.shopCreateForm.hqprovince.$invalid = true;
			$scope.shopCreateForm.hqprovince.$error.required = true;
			focus('HQProvince');
			return false;
		}else if($scope.store.HQProvince.length != 2){
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqprovince.$dirty = true;
			$scope.shopCreateForm.hqprovince.$invalid = true;
			$scope.shopCreateForm.hqprovince.$error.required = true;
			focus('HQProvince');
			return false;
		}else if($scope.store.HQCap == undefined || $scope.store.HQCap == '' || isNaN($scope.store.HQCap) == true ){
			$scope.inputname = "HQCap";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqcap.$dirty = true;
			$scope.shopCreateForm.hqcap.$invalid = true;
			$scope.shopCreateForm.hqcap.$error.required = true;
			focus('HQCap');
			return false;
		}else if($scope.store.HQCap.length !=5 ){
			$scope.store.HQCap = '';
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqcap.$dirty = true;
			$scope.shopCreateForm.hqcap.$invalid = true;
			$scope.shopCreateForm.hqcap.$error.required = true;
			focus('HQCap');
			return false;
		}else if($scope.store.HQStreet == undefined || $scope.store.HQStreet == ''){
			$scope.inputname = "HQStreet";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqstreet.$dirty = true;
			$scope.shopCreateForm.hqstreet.$invalid = true;
			$scope.shopCreateForm.hqstreet.$error.required = true;
			focus('HQStreet');
			return false;
		}else if($scope.store.HQEmail == undefined || $scope.store.HQEmail == '' ){
			$scope.inputname = "HQEmail";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqemail.$dirty = true;
			$scope.shopCreateForm.hqemail.$invalid = true;
			$scope.shopCreateForm.hqemail.$error.required = true;
			focus('HQEmail');
			return false;
		}else if($scope.store.HQPhone == undefined || $scope.store.HQPhone == '' || isNaN($scope.store.HQPhone) == true){
			$scope.inputname = "HQPhone";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.hqphone.$dirty = true;
			$scope.shopCreateForm.hqphone.$invalid = true;
			$scope.shopCreateForm.hqphone.$error.required = true;
			focus('HQPhone');
			return false;
		}else if($scope.store.legalTaxCode == undefined || $scope.store.legalTaxCode == '' ){
			$scope.inputname = "legalTaxCode";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.legaltaxcode.$dirty = true;
			$scope.shopCreateForm.legaltaxcode.$invalid = true;
			$scope.shopCreateForm.legaltaxcode.$error.required = true;
			focus('legalTaxCode');
			return false;
		}else if($scope.store.firstName == undefined || $scope.store.firstName == '' ){
			$scope.inputname = "firstName";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.firstname.$dirty = true;
			$scope.shopCreateForm.firstname.$invalid = true;
			$scope.shopCreateForm.firstname.$error.required = true;
			focus('firstName');
			return false;
		}else if($scope.store.lastName == undefined || $scope.store.lastName == '' ){
			$scope.inputname = "lastName";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.lastname.$dirty = true;
			$scope.shopCreateForm.lastname.$invalid = true;
			$scope.shopCreateForm.lastname.$error.required = true;
			focus('lastName');
			return false;
		}else if($scope.store.legalBirthPlace == undefined || $scope.store.legalBirthPlace == '' ){
			$scope.inputname = "legalBirthPlace";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.legaldobplace.$dirty = true;
			$scope.shopCreateForm.legaldobplace.$invalid = true;
			$scope.shopCreateForm.legaldobplace.$error.required = true;
			focus('legalBirthPlace');
			return false;
		}else if($scope.store.dobDay == undefined || $scope.store.dobDay == '' ){
			$scope.inputname = "dobDay";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.dobday.$dirty = true;
			$scope.shopCreateForm.dobday.$invalid = true;
			$scope.shopCreateForm.dobday.$error.required = true;
			focus('dobDay');
			return false;
		}else if($scope.store.dobMonth == undefined || $scope.store.dobMonth == '' ){
			$scope.inputname = "dobMonth";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.dobmonth.$dirty = true;
			$scope.shopCreateForm.dobmonth.$invalid = true;
			$scope.shopCreateForm.dobmonth.$error.required = true;
			focus('dobDay');
			return false;
		}else if($scope.store.dobYear == undefined || $scope.store.dobYear == '' ){
			$scope.inputname = "dobYear";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.dobyear.$dirty = true;
			$scope.shopCreateForm.dobyear.$invalid = true;
			$scope.shopCreateForm.dobyear.$error.required = true;
			focus('dobDay');
			return false;
		}else if($scope.store.legalEmail == undefined || $scope.store.legalEmail == '' ){
			$scope.inputname = "legalEmail";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.legalemail.$dirty = true;
			$scope.shopCreateForm.legalemail.$invalid = true;
			$scope.shopCreateForm.legalemail.$error.required = true;
			focus('legalEmail');
			return false;
		}else if($scope.store.legalPhone == undefined || $scope.store.legalPhone == '' || isNaN($scope.store.legalPhone) == true){
			$scope.inputname = "legalPhone";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.legalphone.$dirty = true;
			$scope.shopCreateForm.legalphone.$invalid = true;
			$scope.shopCreateForm.legalphone.$error.required = true;
			focus('legalPhone');
			return false;
		}else if($scope.store.permntAddress == undefined || $scope.store.permntAddress == '' ){
			$scope.inputname = "permntAddress";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.permntaddress.$dirty = true;
			$scope.shopCreateForm.permntaddress.$invalid = true;
			$scope.shopCreateForm.permntaddress.$error.required = true;
			focus('permntAddress');
			return false;
		}else if($scope.store.permntProvince == undefined || $scope.store.permntProvince == '' ){
			$scope.inputname = "permntProvince";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.permntprovince.$dirty = true;
			$scope.shopCreateForm.permntprovince.$invalid = true;
			$scope.shopCreateForm.permntprovince.$error.required = true;
			focus('permntProvince');
			return false;
		}else if($scope.store.permntProvince.length != 2 ){
			$scope.store.permntProvince = '';
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.permntprovince.$dirty = true;
			$scope.shopCreateForm.permntprovince.$invalid = true;
			$scope.shopCreateForm.permntprovince.$error.required = true;
			focus('permntProvince');
			return false;
		}else if($scope.store.permntCity == undefined || $scope.store.permntCity == '' ){
			$scope.inputname = "permntCity";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.permntcity.$dirty = true;
			$scope.shopCreateForm.permntcity.$invalid = true;
			$scope.shopCreateForm.permntcity.$error.required = true;
			focus('permntCity');
			return false;
		}else if($scope.store.permntZip == undefined || $scope.store.permntZip == '' || isNaN($scope.store.permntZip) == true  ){
			$scope.inputname = "permntZip";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.permntzip.$dirty = true;
			$scope.shopCreateForm.permntzip.$invalid = true;
			$scope.shopCreateForm.permntzip.$error.required = true;
			focus('permntZip');
			return false;
		}else if($scope.store.permntZip.length !=5 ){
			$scope.store.permntZip = '';
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.shopCreateForm.permntzip.$dirty = true;
			$scope.shopCreateForm.permntzip.$invalid = true;
			$scope.shopCreateForm.permntzip.$error.required = true;
			focus('permntZip');
			return false;
		}else if((document.getElementById("latitude").value) == undefined || (document.getElementById("latitude").value) == ''){
			$scope.inputname = "pac-input";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.malLocationEmpty = true;
			$timeout(function(){
				$scope.malLocationEmpty = false;
			}, 3000);
			focus('pac-input');
			return false;
		}else if((document.getElementById("longitude").value) == undefined || (document.getElementById("longitude").value) == ''){
			$scope.inputname = "pac-input";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.malLocationEmpty = true;
			$timeout(function(){
				$scope.malLocationEmpty = false;
			}, 3000);
			focus('pac-input');
			return false;
		}else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
			$scope.inputname = "pac-input";
			$scope.createStoreError = true;
			$scope.createStoreLoader = false;
			$scope.malLocationEmpty = true;
			$timeout(function(){
				$scope.malLocationEmpty = false;
			}, 3000);
			focus('pac-input');
			return false;
		} else if($scope.store.referral_id != '' && $scope.store.referral_id != undefined) {
			if(isNaN($scope.store.referral_id)){
				$scope.createStoreErrorMgs = $scope.i18n.store.valid_ref_id;
				$scope.createStoreError = true;
				$scope.createStoreLoader = false;
				$timeout(function(){
					$scope.createStoreErrorMgs = '';
				}, 15000);
				return false;
			}
		} else if($scope.store.dobYear != undefined || $scope.store.dobYear != ''){
			if($scope.store.dobDay.id > 29 && $scope.store.dobMonth.value == 2){
				$scope.inputname = "dobDay";
				$scope.createStoreError = true;
				$scope.createStoreLoader = false;
				$scope.shopCreateForm.dobday.$dirty = true;
				$scope.shopCreateForm.dobday.$invalid = true;
				focus('dobDay');
				return false;
			}
		} else if($scope.store.dobYear != undefined || $scope.store.dobYear != ''){
			var isLeap = new Date($scope.store.dobYear.id, 1, 29).getMonth() == 1;
			if(isLeap == false && $scope.store.dobDay.id >= 29 && $scope.store.dobMonth.value == 2){
				$scope.inputname = "dobYear";;
				$scope.createStoreError = true;
				$scope.createStoreLoader = false;
				$scope.shopCreateForm.dobyear.$dirty = true;
				$scope.shopCreateForm.dobyear.$invalid = true;
				focus('dobYear');
				return false;
			}
		}
		var dd = $scope.store.dobDay.id;
		var month = $scope.store.dobMonth.value +'-';
		var year = $scope.store.dobYear.id +'-';
		$scope.store.dob = year.concat(month,dd);
		var opts = {};
		
		//check if referral user going to affiliate shop 
		if(!TopLinkService.getNoAffiliated()) {
			if(localStorage.getItem('ShopAffiliatedObject')) {
				opts.referral_id = JSON.parse(localStorage.getItem('ShopAffiliatedObject')).affiliator_id;
			}
    	}
		if($scope.keywordList != undefined || $scope.keywordList.length != '0') {
			opts.shop_keyword = $scope.keywordList.join();
		} else {
			opts.shop_keyword = [];	
		}
		
		opts.user_id = APP.currentUser.id; 
		opts.name = $scope.store.name;
		opts.business_name = $scope.store.companyName;
		opts.legal_status = $scope.store.legalForm.id;
		opts.vat_number = $scope.store.vatNumber;
		opts.fiscal_code = $scope.store.taxNumber;
		opts.tax_number = $scope.store.taxNumber;
		opts.email = angular.lowercase($scope.store.email);
		opts.phone = $scope.store.phone;
		opts.iban = $scope.store.iban;
		opts.sale_catid = $scope.store.storecategory.id;
		//opts.sale_subcatid = $scope.store.subcategory.id; // not in current use
		opts.sale_subcatid = null;
		opts.description = $scope.store.description;
		opts.business_country = $scope.store.regOfficeCountry.id;
		opts.business_region = $scope.store.regOfficeRegion.id;
		opts.business_city = $scope.store.regOfficeCity;
		opts.province = $scope.store.province;
		opts.zip = $scope.store.regOfficezip;
		opts.business_address = $scope.store.regOfficeStreet;
		opts.sale_country = $scope.store.HQCountry.id;
		opts.sale_region = $scope.store.HQRegion.id;
		opts.sale_city = $scope.store.HQCity;
		opts.sale_province = $scope.store.HQProvince;
		opts.sale_zip = $scope.store.HQCap;
		opts.sale_address = $scope.store.HQStreet;
		opts.map_place = document.getElementById("mapplace").value;
		opts.latitude = document.getElementById("latitude").value; 
		opts.longitude = document.getElementById("longitude").value;
		opts.sale_email = angular.lowercase($scope.store.HQEmail);
		opts.sale_phone_number = $scope.store.HQPhone;
		opts.repres_fiscal_code = $scope.store.legalTaxCode;
		opts.repres_first_name = $scope.store.firstName;
		opts.repres_last_name = $scope.store.lastName;
		opts.repres_place_of_birth = $scope.store.legalBirthPlace;
		opts.repres_dob = $scope.store.dob;
		opts.repres_email = angular.lowercase($scope.store.legalEmail);
		opts.repres_phone_number = $scope.store.legalPhone;
		opts.repres_address = $scope.store.permntAddress;
		opts.repres_province = $scope.store.permntProvince;
		opts.repres_city = $scope.store.permntCity;
		opts.repres_zip = $scope.store.permntZip;
		//not in use extra field in service
		opts.business_type = 'not in current use';
		opts.call_type = '2'; //for shop create
		opts.sale_description = 'not in current use';
		opts.sale_map = "not in current use";
		opts.broker_id = 0;
		$scope.createStoreErrorMgs = '';

		StoreService.createStore(opts, function(data) {
			if(data.code == 101) {
				//Remove referral object from cookies
				localStorage.removeItem('ShopAffiliatedObject');
				//$scope.createStoreLoader = false;
				$rootScope.tempStoreId = data.data.store_id;
                // Put store id in cookie
                $cookieStore.put('tempStoreId',data.data.store_id);
				// now it will redirect to terms and condition 
				$location.path("/shop/"+data.data.store_id+"/contract");
			} else if (data.code == 154) {
				$scope.createStoreLoader = false;
				$scope.createStoreErrorMgs = $scope.i18n.validation.citizen_not_exists;
				$scope.commonError = true;
				$timeout(function(){
					$scope.commonError = false;
				}, 3000);
				$scope.createStoreError = true;
			}else if (data.code == 100) {
				$scope.createStoreLoader = false;
				$scope.createShopErrorMgs = $scope.i18n.validation.missed_param;
				$scope.commonError = true;
				$timeout(function(){
					$scope.commonError = false;
				}, 3000);
				$scope.createStoreError = true;
			}else if (data.code == 116) {
				$scope.createStoreLoader = false;
				$scope.createShopErrorMgs = $scope.i18n.validation.enter_businessname;
				$scope.commonError = true;
				$timeout(function(){
					$scope.commonError = false;
				}, 3000);
				$scope.createStoreError = true;
			}else if (data.code == 138) {
				$scope.createStoreLoader = false;
				$scope.createShopErrorMgs = $scope.i18n.validation.vat_exists;
				$scope.vatNumberInvalid = true;
				$scope.createStoreError = true;
				$timeout(function(){
					$scope.vatNumberInvalid = false;
				}, 3000);
				focus('vatNumber');
			} else if (data.code == 85) {
				$scope.createStoreLoader = false;
				$scope.createShopErrorMgs = $scope.i18n.validation.account_inactive;
				$scope.commonError = true;
				$timeout(function(){
					$scope.commonError = false;
				}, 3000);
				$scope.createStoreError = true;
			} else if (data.code == 165) {
				$scope.createStoreLoader = false;
				$scope.createShopErrorMgs = $scope.i18n.validation.vat_valid;
				$scope.vatNumberInvalid = true;
				$scope.createStoreError = true;
				$timeout(function(){
					$scope.vatNumberInvalid = false;
				}, 3000);
				focus('vatNumber');
			} else if (data.code == 166) {
				$scope.createStoreLoader = false;
				$scope.createShopErrorMgs = $scope.i18n.validation.iban_valid;
				$scope.ibanNumberInvalid = true;
				$scope.createStoreError = true;
				$timeout(function(){
					$scope.ibanNumberInvalid = false;
				}, 3000);
				focus('iban');
			} else {
				$scope.createStoreLoader = false;
				$scope.createStoreError = true;
			}

			$timeout(function(){
				$scope.createShopErrorMgs = '';
				$scope.vatNumberInvalid = false;
				$scope.ibanNumberInvalid = false;
				$scope.createStoreError = false;
			}, 15000);
		});
	};
	//map section start
	$scope.resetStoreObject = function() {
		document.getElementById("mapplace").value = '';
		document.getElementById("latitude").value = ''; 
		document.getElementById("longitude").value = '';
		$scope.store = {};
	};

	$scope.$on('$viewContentLoaded', function(){
			$timeout(function(){
			$scope.initialize();
		}, 1000);
	});

	// $scope.loadMap = function() {
	// 	$scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 }
	// 	$scope.options = {scrollwheel: false};
	// 	$scope.marker = {
	// 	id:0,
	// 	coords: {
	// 	latitude: 40.1451,
	// 	longitude: -99.6680
	// 	},
	// 	options: { draggable: true },
	// 	events: {
	// 	dragend: function (marker, eventName, args) {
	// 	document.getElementById("latitude").value = marker.getPosition().lat();
	// 	document.getElementById("longitude").value = marker.getPosition().lng();
	// 	$scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
	// 	}
	// 	}
	// 	}
	// }

	// $scope.mapLocation = function(mapLatitude, mapLogitude) {
	// 	var geocoder;
	// 	geocoder = new google.maps.Geocoder();
	// 	var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
	// 	geocoder.geocode({'latLng': latlng}, function(results, status) {
	// 		if (status == google.maps.GeocoderStatus.OK) {
	// 			if (results[1]) {
	// 				$('#mapplace').val(results[1].formatted_address);
	// 			} else {
	// 				alert($scope.i18n.storealbum.album_alert_msg);
	// 			}
	// 		} else {
	// 			alert($scope.i18n.storealbum.album_alert_failed + status);
	// 		}
	// 	});
	// };
	// $scope.loadMap();

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
			document.getElementById("latitude").value = countryPlace.geometry.location.lat();
			document.getElementById("longitude").value = countryPlace.geometry.location.lng();
			document.getElementById("mapplace").value = countryPlace.formatted_address;
			$scope.store.map_place = countryPlace.formatted_address;
			
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

	//create data of birth drop dwon start--->
    //creat month array
    $scope.months = $scope.i18n.profile.months;
    //create days array
    $scope.days = [];
    $scope.years = [];
    $scope.daysLimit = 31;
    $scope.getDays = function(daysLimit) {
		for (start = 1;start <= daysLimit; start++) {
			$scope.days.push({"id":start,"value":start});
		}
    }
    $scope.getYears = function() {
        var currentYear = new Date().getFullYear();
        $scope.years = [];
        for (var i = currentYear; i >= 1914 ; i--){
            $scope.years.push({"id":i,"value":i});
        }
    }
	$scope.getYears();
	$scope.getDays($scope.daysLimit);

	$scope.changeShopMonth = function() {
        if($scope.store.dobMonth.value%2==1){
            $scope.days = [];
            $scope.getDays(31);
        } else if(($scope.store.dobMonth.value == 2) && ($scope.store.dobYear.value % 4 == 0)){
            $scope.days = [];
            $scope.getDays(29);
        } else if($scope.store.dobMonth.value == 2){
            $scope.days = [];
            $scope.getDays(28);
        } else {
            $scope.days = [];
            $scope.getDays(30);
        }
    };

    $scope.changeShopYear = function() {
        if($scope.store.dobYear.value % 4 == 0 && $scope.store.dobMonth.value == 2){
            $scope.days = [];
            $scope.getDays(29);
        } else if($scope.store.dobYear.value % 4 != 0 && $scope.store.dobMonth.value == 2) {
            $scope.days = [];
            $scope.getDays(28);
        } else if($scope.store.dobYear.value % 4 != 0 && $scope.store.dobMonth.value%2 == 1) {
            $scope.days = [];
            $scope.getDays(31);
        } else {
            $scope.days = [];
            $scope.getDays(30);
        }
    };
	//create data of birth drop dwon end
 
	// Search keyword for particular catagory
	var currentTimeout = null;
	var DELAY_TIME_BEFORE_POSTING = 300;

	$('#categoryKeyword').keypress(function(event) {
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
		opts.category_id = $scope.store.storecategory.id.toString();
		opts.keyword = $scope.store.keywords;
		opts.session_id = APP.currentUser.id;
		$scope.cancelKeywordRequest = false;
		$scope.showCatKeyLoading = true;
		opts.session_id = APP.currentUser.id;
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
	//	$scope.categoryKeyword = index.name;
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
		$scope.keywordList.splice(index,1);
	};
}]);

//Shop Terms and conditions in the third step
app.controller('ShopTermsandConditions', ['$scope', '$http', '$rootScope', 'TopLinkService', '$timeout', '$routeParams', '$location', 'StoreService', 'StorePaymentService', 'ProfileService', function($scope, $http, $rootScope, TopLinkService, $timeout, $routeParams, $location, StoreService, StorePaymentService, ProfileService){
	$scope.loeadingContract = true;
	$scope.allowProceed = false;
	$scope.ShopDetail = [];
	$scope.storePaymentUrl = '';
	$scope.agree = {};
	$scope.agree.flag1 = 0;
	$scope.agree.flag1 = 0;
	$scope.agree.flag1 = 0;
	$scope.currentData = new Date();

	var opts = {};
    opts.user_id = APP.currentUser.id;
    opts.store_id = $routeParams.shopId;
	StoreService.getStoreDetail(opts, function(data){
		$scope.ShopDetail = data.data;
		var catopts= {};
        catopts.lang_code = 'it';//$scope.currentLanguage;
        catopts.cat_id = data.data.sale_catid;
        catopts.session_id = APP.currentUser.id;
        catopts.type = "show";
        catopts.session_id = APP.currentUser.id;
		ProfileService.getCategories(catopts, function(data) {
            if(data.code == 101) {
                $scope.ShopDetail.shop_category =  data.data.category_name;
            } else {
            	$scope.ShopDetail.shop_category = '';
            }
			var opts1 = {};
			opts1.profile_id = $routeParams.shopId;
			opts1.user_id = APP.currentUser.id;
			opts1.payment_type = APP.card.add_type;;
			opts1.cancel_url = APP.payment.siteDomain + '#/shop/paycancel'; 
			opts1.return_url = APP.payment.siteDomain + '#/shop/paysuccess'; 
			StorePaymentService.getOneClickPaymentUrls(opts1, function(data) {  
				if(data.code == 101) {
					if(data.data.url != '' ){
						$scope.loeadingContract = false;
						$scope.storePaymentUrl =  data.data.url;
					} else { 
						$scope.loeadingContract = false;
						$scope.storePaymentUrl = '';
					} 
				} else { 
					$scope.loeadingContract = false;
					$scope.storePaymentUrl = '';
				} 
			});
		});
	});
	
	$scope.checkFlag = function() {
		if($scope.agree.flag1 && $scope.agree.flag2 && $scope.agree.flag3 && $scope.agree.flag4) {
			if($scope.ShopDetail.credit_card_status == 1 && $scope.ShopDetail.new_contract_status == 0){
				$scope.submitForm = true;
			}else{
				$scope.allowProceed = true;
			}
		} else {
			$scope.allowProceed = false;
			$scope.submitForm = false;
		}
	};

	$scope.payNow = function(){
		var opts = {};
		opts.session_id = APP.currentUser.id;
		opts.store_id = $routeParams.shopId;
		$scope.submitForm = false;
		StorePaymentService.sendContract(opts, function(data) { 
			if(data.code == 101 && data.message == 'SUCCESS'){
				$location.path('/myshops/1');
				$scope.submitForm = true;
			}else{
				$scope.submitForm = true;
			}
		});

	};
}]);
