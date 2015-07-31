app.controller('TopCitizenAllController',['$scope', '$http', 'TopLinkService', 'fileReader', function ($scope, $http, TopLinkService, fileReader) {
	$scope.citizenTopLinkLoader = true;

	$scope.getTopCitizenTopLink = function() {
		var opts = {};
		opts.limit_start = 0;
		opts.limit_size = 50;
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

	$scope.getTopCitizenTopLink();
}]);

app.controller('TopCitizenPerIncomeController',['$scope', '$http', 'TopLinkService', 'fileReader', function ($scope, $http, TopLinkService, fileReader) {
	$scope.topCitizenPerincomeLoader = true;

	//get Top citizen per income 
	$scope.getTopCitizenPerIncome = function() {
		var opts = {};
		opts.limit_size = 50;
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
	$scope.getTopCitizenPerIncome();
}]);

app.controller('TopShopPerRevenueController',['$scope', '$http', 'TopLinkService', 'fileReader', function ($scope, $http, TopLinkService, fileReader) {
	$scope.topShopPerRevenueLoader = true;

	$scope.getTopShopPerRevenue = function() {
		var opts = {};
		opts.limit_size = 50;
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

	$scope.getTopShopPerRevenue();
}]);

app.controller('InviteAffiliationController',['$scope', '$http', 'TopLinkService', '$timeout', '$log', 'TranslationService', function($scope, $http, TopLinkService, $timeout, $log, TranslationService) {
	if(!$scope.i18n.invite_affiliate){
        TranslationService.getTranslationWithCallback($scope, $scope.activeLanguage, function(data){
           $scope.i18n = data; 
           $scope.invitemessage = $scope.i18n.invite_affiliate.invited;
		   $scope.errorMsg = $scope.i18n.invite_affiliate.invite_error;
		   $scope.needEmail = $scope.i18n.invite_affiliate.email_need;
        });
    }else{
        $scope.invitemessage = $scope.i18n.invite_affiliate.invited;
		$scope.errorMsg = $scope.i18n.invite_affiliate.invite_error;
		$scope.needEmail = $scope.i18n.invite_affiliate.email_need;
    }
	$scope.active = {
		basicProfile : false,
		citizen_tutorial : false,
		shop_tutorial : false,
		invite_citizen : false,
		invite_shop : false,
	}
	$scope.toggleshoplist = false;
	$scope.activeThem = function(key){
		if(key === 'basicProfile'){
			$scope.toggleshoplist = !$scope.toggleshoplist;
		}else{
			$scope.toggleshoplist = false;
		}
		angular.forEach($scope.active,function(val, currKey){
			if(currKey === key){
				$scope.active[currKey] = true;
			}else{
				$scope.active[currKey] = false;
			}
		})
	}

	$scope.openFancyBox = function(type) {
		if(type == 1)
			$scope.inviteUrl = APP.base_url + "citizen_affiliation/" +APP.currentUser.id+"/"+type;
		else if(type == 2)
			$scope.inviteUrl = APP.base_url + "broker_affiliation/" +APP.currentUser.id +"/"+type;
		else if(type == 3)
			$scope.inviteUrl = APP.base_url + "shop_affiliation/" +APP.currentUser.id +"/"+type;

		var t = '<div id="citizeninvitepopup" class="modal-container">';
		t += '<div class="form-container"><div id="inviteduser" style="display:none;" class="success">'+$scope.invitemessage+'</div>';
		t += '<div id="notinviteduser" style="display:none;" class="inviteerror">'+$scope.errorMsg+'</div>';
		t += '<div id="needEmail" style="display:none;" class="inviteerror">'+$scope.needEmail+'</div><form >';
		t += '<ul><li><textarea elastic class="form-control bg-gray" name="to_emails" id="to_emails" type="text" placeholder="'+$scope.i18n.invite_affiliate.emails_with_commas+'" onkeypress="checkEmailField()"></textarea> </li>';
		t += '<li><input class="form-control bg-gray" name="inviteUrl" id="inviteUrl" value="'+$scope.inviteUrl+'" type="text" placeholder="'+$scope.inviteUrl+'" readonly/></li>';
		t += '<li><button id="requestSending" class="btn btn-primary" type="button" onclick="return inviteCAffiliationUser()" id="Submit">'+$scope.i18n.invite_affiliate.send_buttom+'</button>';
		t += '<div id="sendingloader" style="text-align: center; display:none;"><img alt="processing..." src="app/assets/images/proceed.gif"></div></li>';
		t += '</ul></form></div></div>';
		$.fancybox.open({ content: t, type: 'html' });
	}

	//section to invite the user from broker/citizen profile
	$scope.InviteAffiliationUser = function(emails, url) {
		$scope.requestSending = true;
		var opts = {};
		opts.user_id = APP.currentUser.id;
		opts.to_emails = emails.split(',');
		opts.affiliation_type = url.slice(-1); //1=>citizen, 2=>broker, 3=> shop
		opts.url = url;
		TopLinkService.inviteAffiliation(opts, function(data) {
			$("#requestSending").show();
			$("#sendingloader").hide();
			$scope.to_emails = '';
			$scope.requestSending = false;
			if(data.code == 101) {
				$("#inviteduser").show();
				$timeout(function(){
					$("#inviteduser").hide();
                }, 4000);
			} else {
				$("#notinviteduser").show();
				$timeout(function(){
					$("#notinviteduser").hide();
                }, 4000);
			}
		});
	};

}]);

function checkEmailField() {
	if(document.getElementById('to_emails').value != '') {
		$("#needEmail").hide();
	}
}
function inviteCAffiliationUser() {
	var emails  = document.getElementById('to_emails').value;
	var url = document.getElementById('inviteUrl').value;
	if(emails == '') {
		$("#needEmail").show();
		return false;
	}
	else {
		$("#requestSending").hide();
		$("#sendingloader").show();
		angular.element(document.getElementById('InviteAffiliationController')).scope().InviteAffiliationUser(emails, url);
	}
}

app.controller('ImportContactController', ['$scope','$http', '$rootScope','$route','TopLinkService', '$timeout', '$routeParams', '$location','$modal','TranslationService', function($scope, $http, $rootScope, $route, TopLinkService, $timeout, $routeParams, $location, $modal, TranslationService){
	$scope.inviteType = $routeParams.id;
	if(!$scope.i18n.invite_affiliate){
        TranslationService.getTranslationWithCallback($scope, $scope.activeLanguage, function(data){
           $scope.i18n = data; 
           $scope.invitemessage = $scope.i18n.invite_affiliate.invited;
		   $scope.errorMsg = $scope.i18n.invite_affiliate.invite_error;
		   $scope.needEmail = $scope.i18n.invite_affiliate.email_need;
        });
    }else{
        $scope.invitemessage = $scope.i18n.invite_affiliate.invited;
		$scope.errorMsg = $scope.i18n.invite_affiliate.invite_error;
		$scope.needEmail = $scope.i18n.invite_affiliate.email_need;
    }
	$scope.requestSending = false;
	$scope.invitedScuccess = false;
	$scope.notinviteduser = false;
	$scope.needinviteduser = false;
	var type = $routeParams.id;
	if(type == 1)
		$scope.inviteUrl = APP.base_url + "citizen_affiliation/" +APP.currentUser.id+"/"+type;
	else if(type == 2)
		$scope.inviteUrl = APP.base_url + "broker_affiliation/" +APP.currentUser.id +"/"+type;
	else if(type == 3)
		$scope.inviteUrl = APP.base_url + "shop_affiliation/" +APP.currentUser.id +"/"+type;
	$("#inviteUrl").val($scope.inviteUrl);

	$scope.validateEmail = function(field) {
	    var regex=/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
	    return (regex.test(field)) ? true : false;
	}

	$scope.validateMultipleEmailsCommaSeparated = function(value) {
	    var result = value.split(",");
	    for(var i = 0;i < result.length;i++)
	    if(!$scope.validateEmail(result[i])) 
            return false;    		
	    return true;
	}

	$scope.cancelBack = function() {
		$location.path('/');
	}

	$scope.inviteBulkAffiliationUser = function() {
		$scope.requestSending = true;
		var emails = $("#to_emails").val();
		var url = $("#inviteUrl").val();
		var isValid = $scope.validateMultipleEmailsCommaSeparated(emails);

		if(emails == '') {
			$scope.needinviteduser = true;
			$scope.requestSending = false;
			$timeout(function(){
				$scope.needinviteduser = false;
            }, 4000);
		} if(!isValid) {
			$scope.needinviteduser = true;
			$scope.requestSending = false;
			$timeout(function(){
				$scope.needinviteduser = false;
            }, 4000);
		} else {
			var opts = {};
			opts.user_id = APP.currentUser.id;
			opts.to_emails = emails.split(',');
			opts.affiliation_type = url.slice(-1); //1=>citizen, 2=>broker, 3=> shop
			opts.url = url;
			TopLinkService.inviteAffiliation(opts, function(data) {
				$scope.requestSending = false;
				$("#to_emails").val("");
				if(data.code == 101) {
					$scope.invitedScuccess = true;
					$scope.requestSending = false;
					$timeout(function(){
						$scope.invitedScuccess = false;
	                }, 4000);
				} else {
					$scope.notinviteduser = true;
					$timeout(function(){
						$scope.notinviteduser = false;
	                }, 4000);
				}
			});
		}
	};

	$scope.checkFBforCloudSponge =function(){
		$scope.clodSpongeFB = false;
		$scope.FBGraphAPI = false;
		var currentDate = new Date();
		var expiryDate = new Date(2015,4,30);
		if(currentDate<expiryDate){
			$scope.clodSpongeFB = true;
		}else{
			$scope.FBGraphAPI = true;
		}
	}
	$scope.InviteFbFriends = function(){
		checkLoginForInvite(function(data){
			if(data!==null){
				getImageOfFriends(function(frndImg){
					if(frndImg!==null){
						var index=0;
						for(var i=0; i<frndImg.data.length;i++){
							var taggFrnd = frndImg.data[i];
							angular.forEach(data.data,function(appFrnd){
								if(taggFrnd.name == appFrnd.name){
									console.log(taggFrnd)
									appFrnd.imageURL = taggFrnd.picture.data.url;
									index++;
								}
							})
							if(index == data.data.length) {
									break;
							};
						}
					}
					$scope.allFriends = data.data;
					$scope.checkSlec =[];
					var modalInstance = $modal.open({
		                template: '<div id="friendModal" class="modal-header">'+
										'<h3 class="modal-title">People</h3>'+
										'<div class="modal-popup-close" ng-click="closeModal()"></div>' +
								'</div>'+
								'<div class="modal-body tag-frnd-modal">'+
									'<ul>'+
										'<li data-ng-repeat="friend in allFriends">'+
											'<span class="tag-img">'+
												'<img title="" style="width:30px;height:30px" alt="No image available" src="{{friend.imageURL}}">'+
											'</span>'+
											'<span class="tag-frnd-name">'+
													'<a href>{{friend.name}}</a>'+
											'</span>'+
											'<span class="rmv-tag">'+
													'<input type="checkbox" class="fbCheckbox" ng-init="friend.status = false" ng-click="friend.status = !friend.status">'+
											'</span>'+
										'</li>'+
									'</ul>'+
									'<button class="btn btn-primary" ng-click="getSelectedFrnd()">OK</button>'+
									// '<iframe ng-if="urlAvail" src="urlAvail"></iframe>'+
								'</div>'+
								'<div class="modal-footer">'+
								'</div>',
		                controller: 'ModalController',
		                size: 'lg',
		                scope: $scope,
		            });

		            modalInstance.result.then(function (selectedItem) {
		            }, function () {
		                // $log.info('Modal dismissed at: ' + new Date());
		            });
		            
		            $scope.getSelectedFrnd =function (){
		            	angular.forEach($scope.allFriends,function(frnd){
		            		// console.log(frnd)
		            		if(frnd.status){
		            			// $scope.urlAvail = frnd.link;
		            			var win = window.open(frnd.link); 
		            			window.location.repalce = frnd.link;
		            			setTimeout(function() {
		            				console.log(win.location.href)
		            			}, 5000);
		            			// $http({
		            			// 	method:'GET',
		            			// 	url:frnd.link,
		            			// 	headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		            			// 					'origin':'https://www.facebook.com',
		            			// 					'referer':frnd.link }
		            			// }).success(function(data){
		            			// 	console.log(data)
		            			// })
		            		}
		            	})
		            }
				})
			}
		});
	}
}]);

