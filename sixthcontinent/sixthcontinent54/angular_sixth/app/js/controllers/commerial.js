app.controller('PromotionController', ['$scope', '$http', '$rootScope' ,'$routeParams', '$location', '$timeout', 'CommerialService' ,'StoreService', function ($scope, $http,$rootScope, $routeParams, $location, $timeout, CommerialService ,StoreService) {
  
  $rootScope.tabActive = 'coupon';
  $scope.awards = false;
  $scope.shopping1 =false;
  $scope.shopping2 =false;
  $scope.commerce = false;
  $scope.report =false;
  $scope.coupon = true;
  $scope.tabShopping = false;
  $scope.routeId = $routeParams.id;

  $scope.ShowDetail = function(parameter){
    switch(parameter) {
      case 'coupon' : 
        $scope.coupon = true; 
        $scope.awards = false;
        $scope.shopping1 =false;
        $scope.shopping2 =false;
        $scope.commerce = false;
        $scope.report =false;
        $scope.tabShopping = false;
        $rootScope.tabActive = 'coupon'; break;
      case 'awards' : 
        $scope.awards = true;
        $scope.coupon = false; 
        $scope.shopping1 =false;
        $scope.shopping2 =false;
        $scope.commerce = false;
        $scope.report =false;
        $scope.tabShopping = false;
        $rootScope.tabActive = 'awards'; break;
      case 'card' :  
        $scope.shopping1 = true; 
        $scope.tabShopping = true;
        $scope.awards = false;
        $scope.coupon = false; 
        $scope.shopping2 =false;
        $scope.commerce = false;
        $scope.report =false;
        $rootScope.tabActive = 'card'; 
        $rootScope.tabinActive = 'shopping1'; 
        //$rootScope.tabActive = 'shopping1';
        break;
      case 'commerce' :
        $scope.commerce = true; 
        $scope.shopping1 = false; 
        $scope.awards = false;
        $scope.coupon = false; 
        $scope.shopping2 =false; 
        $scope.report =false;
        $scope.tabShopping = false;
        $rootScope.tabActive = 'commerce'; break;
      case 'report' : 
        $scope.report = true;
        $scope.commerce = false; 
        $scope.shopping1 = false; 
        $scope.awards = false;
        $scope.coupon = false; 
        $scope.shopping2 =false;  
        $scope.tabShopping = false;
        $rootScope.tabActive = 'report'; break;
      case 'shopping1' :  
        $scope.shopping1 = true;
        $scope.tabShopping = true; 
        $scope.report = false;
        $scope.commerce = false; 
        $scope.awards = false;
        $scope.coupon = false; 
        $scope.shopping2 =false;
        $rootScope.tabActive = 'card';
        $rootScope.tabinActive = 'shopping1'; break;
      case 'shopping2' :  
        $scope.shopping2 = true;
        $scope.tabShopping = true;
        $scope.report = false;
        $scope.commerce = false; 
        $scope.awards = false;
        $scope.coupon = false; 
        $scope.shopping1 =false; 
        $rootScope.tabActive = 'card'; 
        $rootScope.tabinActive = 'shopping2'; break;
      default : 
        $rootScope.tabActive = 'coupon';
        $scope.coupon = true;
    }
   };
    $scope.$on("update_parent", function(event, storeDetail){
        $scope.storeDetail = storeDetail;
        $scope.storeId = $scope.storeDetail.id;
        $scope.storeName = $scope.storeDetail.name;
        $scope.is_paypal_added = $scope.storeDetail.is_paypal_added;
        $scope.is_subscribed = $scope.storeDetail.is_subscribed;
       
    });
    $scope.success = false;
    $scope.subscribeError = false; 
    $scope.is_paypal_added = StoreService.getStoreData().is_paypal_added;
    $scope.is_subscribed = StoreService.getStoreData().is_subscribed;

    
    if($location.search().codTrans){
        $scope.codTrans = $location.search().codTrans;
        $scope.amount = $location.search().importo;
        $scope.uniform = $location.search().divisa;
        $scope.outcome = $location.search().esito;
        $scope.descrizione = $location.search().descrizione;
        $scope.pan = $location.search().pan;
        $scope.profileId = $rootScope.tempStoreId;

        if($scope.outcome == 'OK'){
            $scope.coupon = false;
            $scope.shopping1 = true; 
            $scope.tabShopping = true;
            $scope.is_subscribed = 1;
            // code for service
            $scope.tranId = $location.search().txn_id;
            var formData = {};
            formData.user_id = APP.currentUser.id;
            formData.txn_id = $scope.tranId;
            formData.status = "PENDING";
            CommerialService.returnPaymentCancel(formData, function(data) { 
            });    
            $rootScope.tabActive = 'card';
            $rootScope.tabinActive = 'shopping1';
            $scope.success = true;
            $timeout(function(){
               $scope.success = false;
               $location.search({});
            },10000);
        }else{
            $scope.coupon = false;
            $scope.is_subscribed = 2;
            $scope.shopping1 = true; 
            $scope.tabShopping = true;
            $rootScope.tabActive = 'card';
            $rootScope.tabinActive = 'shopping1';
            $scope.subscribeError = true; 
        }
    }

}]);
app.controller('DateController', ['$scope', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
    //$scope.today();
  $scope.clear = function () {
    $scope.dt = null;
  };
    // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };
  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.open = function($event ,parameter) {
    $event.preventDefault();
    $event.stopPropagation();
    if(parameter == 1){
    $scope.opened1 = true;
    $scope.opened2 = false;
  }
  if(parameter == 2){
    $scope.opened2 = true;
    $scope.opened1 = false;
  }     
  };
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate' ,'dd-MM-yyyy'];
  $scope.format = $scope.formats[4];
}]);

app.controller('CouponController', ['$scope', '$http', '$rootScope', '$routeParams', '$location', '$timeout', 'focus', 'CommerialService' , 'ProfileService', 'OfferService' , 'DateToMongoDate' , function ($scope, $http,$rootScope, $routeParams, $location, $timeout, focus, CommerialService, ProfileService, OfferService ,DateToMongoDate) {
    $scope.formSubmitted = false;
    var DELAY_TIME_BEFORE_POSTING = 300;
    $scope.startDate = $scope.i18n.coupon.start_date;
    $scope.endDate = $scope.i18n.coupon.end_date;
    //$scope.man = "i18n.coupon.man";
    $scope.sex= [{
            "dbvalue": "Male",
            "value": $scope.i18n.coupon.man
        }, {
            "dbvalue": "Female",
            "value": $scope.i18n.coupon.women
        }];

    $scope.checkedSex = [];
    $scope.toggleCheck = function (dbvalue) {
        if ($scope.checkedSex.indexOf(dbvalue) === -1) {
            $scope.checkedSex.push(dbvalue);
        } else {
            $scope.checkedSex.splice($scope.checkedSex.indexOf(dbvalue), 1);
        }
    };
    
    var currentTimeout = null;
    angular.element('#searchTagFriend').keypress(function(event) {
        var model = $scope.searchText;
        if(currentTimeout) {
        $timeout.cancel(currentTimeout);
        }
        currentTimeout = $timeout(function(){
            if(event.which != 13){ 
              $scope.tagFriendSuggestion();
            }
        }, DELAY_TIME_BEFORE_POSTING)
    });
    $scope.friends = [];
    $scope.cancelFriendSearch = false;
    $scope.showSearchLoader = false;
    $scope.showFrom = false;
    $scope.tagFriendSuggestion = function(){
        $scope.cancelFriendSearch = false;
        $scope.showFriendList = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_name = $scope.friendName;
        opts.session_id = APP.currentUser.id;
        opts.limit_start = 0;
        opts.limit_size =  APP.friend_list_pagination.end;
        $scope.showSearchLoader = true;
        ProfileService.searchFriends(opts,function(data){
            $scope.showSearchLoader = false;
            if($scope.cancelFriendSearch === false){
              $scope.friends = data.data.users;
                if($scope.friends.length == 0){
                 
                }
            }
        })
    };
    // Store friend 
    $scope.storedFriend = [];
    $scope.dublicate = false;
    $scope.selectFriend = function(friendInfo){
        if(friendInfo === undefined){
            return;
        }else{
            $scope.dublicate = false;
            angular.forEach($scope.storedFriend,function(index){
                if(index.user_id === friendInfo.user_id){
                    $scope.dublicate = true;
                }
            });

            if($scope.dublicate === false){
                $scope.storedFriend.push(friendInfo);
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#searchTagFriend').val("");
                $scope.showFriendList = false;
            }else{
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#searchTagFriend').val("");
                $scope.showFriendList = false;
            }
        }
    };
    $scope.removeTagFriend = function(friendIndex){
        //var index = $scope.storedFriend.indexOf(friendIndex);
        $scope.storedFriend.splice(friendIndex,1);
    };
    // stop the service for loading more service
    $scope.lostFormFocus = function(){
        $timeout(function(){
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTaggIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        },300);
    };
    $scope.friendTaggIndex = -1;
    $scope.keyUpDownControl = function(event){
        if(event.keyCode===40){
            event.preventDefault();
            if($scope.friendTaggIndex+1 !== $scope.friends.length){
                $scope.friendTaggIndex++;
            }
        }else if(event.keyCode===38){
            event.preventDefault();
            if($scope.friendTaggIndex-1 !== -1){
                $scope.friendTaggIndex--;
            }
        }else if(event.keyCode===13){
                $scope.selectFriend($scope.friends[$scope.friendTaggIndex]);
        }
    };
    /// tagging in keywords //
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
        //opts.category_id = $scope.store.storecategory.id.toString();
        opts.keyword = $scope.tagkeywords;
        opts.session_id = APP.currentUser.id;
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
                if($scope.tagkeywords.trim() !== ''){
                   var opts = {};
                        opts.user_id = APP.currentUser.id;
                        opts.keyword = $scope.tagkeywords;

                    ProfileService.addKeywords(opts,function(data){
                         if(data.code === 101 && data.message === 'SUCCESS'){
                            $scope.keywords =  data.data.keyword;
                            $scope.storeKeyword($scope.keywords);
                        }
                    });
               }
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
    $scope.tagkeywords = "";
    $scope.keywordList = [];
    $scope.storeKeyword = function(index){
        $scope.keywords = [];
        $scope.keywordIndex = -1;
        $scope.seen = true;
        $scope.tagkeywords = "";
        if( typeof(index) === 'object'){
            /* if($scope.keywordList.indexOf(index.name) === -1){
                $scope.keywordList.push(index);
            }*/
            for (var i = 0; i<$scope.keywordList.length; i++){
                if($scope.keywordList[i].name == index.name)
                {
                   $scope.seen = false;
                }
            } 
            if($scope.seen == true)
            {   
                $scope.keywordList.push(index);
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
    $scope.removeKeyword = function(index){
        var keyIndex = $scope.keywordList.indexOf(index);
        $scope.keywordList.splice(index,1);
    };

    $scope.coupon = {};
    $scope.errorMesg = false;
    $scope.showMesge = false;
    $scope.showLoader  = false;
    $scope.dateDiff = false;
    $scope.todayDiff = false;
    var today = new Date();
    var stoday = today.toISOString();
    $scope.todayDate = stoday;
    $scope.compareDate = function() {
        /*if(($scope.dt).toISOString() < ($scope.dtt).toISOString()) 
            $scope.dateDiff = false;*/
        if(($scope.dt).toISOString() > ($scope.dtt).toISOString()) 
            {$scope.dateDiff = true;}
        else { $scope.dateDiff = false;}  
        if(($scope.dtt).toISOString() < ($scope.todayDate)) 
            {$scope.todayDiff = true;}
        else { $scope.todayDiff = false;}    
    }
    $scope.compareDateStart = function(){
        if($scope.dtt){
           if(($scope.dt).toISOString() > ($scope.dtt).toISOString()) 
            {$scope.dateDiff = true;}
        else { $scope.dateDiff = false;}   
        }
    }

    $scope.createCoupon = function(){
        
        var newSDate = $scope.dt;
        var dd = newSDate.getDate();
        var mm = newSDate.getMonth()+1; 
        var yyyy = newSDate.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var newSDate = yyyy+'-'+mm+'-'+dd;
        
        var newEDate = $scope.dtt;
        var dd = newEDate.getDate();
        var mm = newEDate.getMonth()+1; 
        var yyyy = newEDate.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var newEDate = yyyy+'-'+mm+'-'+dd;

        //console.log(":get month" + newSDate);
       // console.log(":get month" + newEDate);
        $scope.formSubmitted = true;
        $scope.showErrorDp = false;
        var startdate = $scope.dt;
        var enddate = $scope.dtt;
        if($scope.coupon.couponValue == undefined || $scope.coupon.couponValue == ''){
            focus('radio1');
            return false;
        } else if($scope.coupon.couponQuantity == undefined || $scope.coupon.couponQuantity == ''){
            focus('radio7');
            return false;
        } else if($scope.dt == undefined || $scope.dt == ''){
            focus('dt');
            return false;
        } else if($scope.dtt === undefined || $scope.dtt === ''){
            focus('dtt');
            return false;
        } else if(($scope.dt).toISOString() > ($scope.dtt).toISOString())  {
            $scope.dateDiff = true;
            focus('dtt');
            $timeout(function() {
                $scope.dateDiff = false;
            }, 15000);
            return false;
        } else if(($scope.dtt).toISOString() < ($scope.todayDate)){
            $scope.todayDiff = true;
            focus('dtt');
            $timeout(function() {
                $scope.todayDiff = false;
            }, 5000);
            return false;
        }else if($scope.coupon.discountValue == undefined || $scope.coupon.discountValue == ''){
            focus('chk1');
            return false;
        } 

        $scope.showLoader  = true;
        $scope.hideButton  = true;
        /*$scope.displayStartDate = startdate.toISOString(); 
        $scope.displayEndDate = enddate.toISOString();*/
        var url   = APP.service.addUpdateApplaneData + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
        var parameters = new Object();
        var main =[];
        $scope.offer_type = "551ce49e2aa8f00f20d9328f";
        var option = new Object();
        option["code"] = '';
        option["description"] = '';
        option["discount"] = parseInt($scope.coupon.discountValue);
       // option["end_date"] = $scope.displayEndDate;
       option["end_date"] = newEDate;
        var keywordtagged = [];
        if($scope.keywordList.length > 0){
         for (var i = 0; i < $scope.keywordList.length; i++) 
            {   
               keywordtagged.push(' ' + $scope.keywordList[i].name + ' ');
            }
        }
        var keyword = keywordtagged.join();
        option["keywords"] = keyword;
        option["name"] = '';
        var type = new Object;
        type["_id"] = $scope.offer_type;
        option["offer_type"] = type;
        var shopdetail = new Object;
        shopdetail["_id"] = $scope.storeId;
        shopdetail['name'] = $scope.storeName;
        option["shop_id"] = shopdetail;
        //option["start_date"] = $scope.displayStartDate;
        option["start_date"] = newSDate;
        var tagged = [];
        var taggfriend= {};
        if($scope.storedFriend.length > 0){
            for (var i = 0; i < $scope.storedFriend.length; i++) 
            {
                taggfriend._id = $scope.storedFriend[i].user_info.id.toString();
                taggfriend.name = $scope.storedFriend[i].user_info.first_name + $scope.storedFriend[i].user_info.last_name ;
                tagged.push(taggfriend) ;
            }
        }
        
        
        var friends = new Object;
        friends["$insert"] = tagged;
        option["tag_friends"] = friends;
        option["title"] ='';
        option["to_avail"] = parseInt($scope.coupon.couponQuantity);
        option["value"] = parseInt($scope.coupon.couponValue);
        option["sex"] = $scope.checkedSex;
        var array = [];
        array.push(option);
        parameters["$insert"] = array;
        parameters["$collection"] = "sixc_offers";
        main.push(parameters);
       

         OfferService.addUpdateApplaneData(main, function(data){
            if(data.status === "ok" && data.code === 200){
               $scope.showLoader  = false;
               $scope.hideButton  = false;
               $scope.showMesge = true;
               $scope.dt = '';
               $scope.dtt = '';
               $scope.coupon = {};
               $scope.storedFriend.length = 0;
               $scope.keywordList.length = 0;
               $scope.couponValue =' ';
               $scope.checkedSex.length =0;
                $timeout(function(){
                    $scope.showMesge = false;
                }, 15000);
               $scope.formSubmitted = false;
               $scope.getlistingData();
            } else if(data.status === "error" && data.message == 1){
                    $scope.showErrorDp = true;
                    $scope.showLoader = false;
                    $scope.ShowErrorResponse = data.response;
                    $scope.dt = '';
                    $scope.dtt = '';
                    $scope.coupon = {};
                    $scope.storedFriend.length = 0;
                    $scope.keywordList.length = 0;
                    $scope.couponValue =' ';
                    $scope.checkedSex.length =0;
                    $scope.hideButton  = false;
                    $scope.formSubmitted = false;
                    $timeout(function(){
                    $scope.showErrorDp = false;
                },110000);
            }
            else{
               $scope.showLoader  = false;
               $scope.hideButton  = false;
               $scope.errorMesg = true;
               $scope.formSubmitted = false;
               $timeout(function(){
                    $scope.errorMesg = false;
                }, 15000);
            }
        });

    };
    $scope.getlistingData = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = yyyy+'-'+mm+'-'+dd;
        //$scope.todaySDate = DateToMongoDate.dateToIso(today);
        $scope.todaySDate = today;
        $scope.offerlistingObject = [];
        $scope.noResult = false;
        $scope.showCouponListMsg = false;
        $scope.couponListingLoader = true;
        $scope.showList = false;
        $scope.offer_id    = "551ce49e2aa8f00f20d9328f";
        var option  = new Object();
            option["$collection"] = "sixc_offers";
            var getlisting = new Object();
            getlisting["value"] =1;
            getlisting["start_date"] =1;
            getlisting["end_date"] = 1;
            getlisting["discount"] =1;
            getlisting["to_avail"] =1;
            option["$fields"] = getlisting;
            var filters = new Object(); 
            var start = new Object();
            start["$lte"] = today;
            var end = new Object();
            end["$gte"] = "$$CurrentDate";
            filters["start_date"] = start;
            filters["end_date"] = end;
            filters["offer_type"] = $scope.offer_id;
            filters["shop_id"] = $scope.routeId;
            option["$filter"] = filters;
            var history = new Object();
            history["__history.__createdOn"] = -1;
            option["$sort"] = history;
            option["$limit"] = 15;
            option["$skip"] = 0;
           
            $scope.noResult = false;
            OfferService.getApplaneData(option, function(data){
                 if(data.status === "ok" && data.code === 200){
                    $scope.couponListingLoader = false;
                    $scope.showList = true;
                    $scope.offerlistingObject = data.response.result;
                    if($scope.offerlistingObject.length == 0){
                        $scope.showCouponListMsg = true;
                    }

                } else {
                    $scope.couponListingLoader = false;
                    
                 }

            });     
    };
    $scope.getlistingData();
}]);  

// dp controller
app.controller('AwardsController', ['$scope', '$http', '$rootScope', '$routeParams', '$location', '$timeout', 'focus', 'CommerialService' , 'ProfileService', 'OfferService' , function ($scope, $http,$rootScope, $routeParams, $location, $timeout, focus, CommerialService, ProfileService, OfferService) {
 
    $scope.errorMesg = false;
    $scope.showValue = false;
    var today = new Date();
    var stoday = today.toISOString();
    $scope.todayDate = stoday;
    $scope.deleteLoader = false;
    $scope.deleteDP = function(index , value){
        $scope.deleteLoader = true;
        var option  = new Object();
        var insert = new Object();
        insert["_id"] = value;
        var inner = new Object();
        inner["status"] = "Closed";
        inner["balance"] = 0;
        inner["end_date"] = $scope.todayDate;
        insert["$set"] = inner;
        var array = [];
        array.push(insert);
        option["$update"] = array;
        option["$collection"] = "sixc_shopdp";
        var param = new Object();
        param["status"] = 1;
        option["$fields"] = param;
        var main =[];
        main.push(option);
        OfferService.addUpdateApplaneData(main, function(data){
           if(data.status === "ok" && data.code === 200){
            $scope.deleteLoader = false;
            $scope.offerlistingObject.splice(index,1);
            $scope.getlistingData();
           }else {
            $scope.deleteLoader = false;
           }
        });

    }
   // $scope.deleteDP();
    $scope.showOther = function(){
      $scope.showValue = true;
      $scope.confirm = false;
    };
     $scope.showHideOther = function(){
      $scope.showValue = false;
      if($scope.confirm = true){
        $scope.confirm = false;
      }
    };
    /*$scope.sex = ['man', 'women'];
    $scope.checkedSex = [];
    $scope.toggleCheck = function (sex) {
        if ($scope.checkedSex.indexOf(sex) === -1) {
            $scope.checkedSex.push(sex);
            console.log($scope.checkedSex);
        } else {
            $scope.checkedSex.splice($scope.checkedSex.indexOf(sex), 1);
            console.log($scope.checkedSex);
        }
    };*/
    $scope.sex= [{
            "dbvalue": "Male",
            "value": $scope.i18n.coupon.man
        }, {
            "dbvalue": "Female",
            "value": $scope.i18n.coupon.women
        }];
    $scope.checkedSex = [];
    $scope.toggleCheck = function (dbvalue) {
        if ($scope.checkedSex.indexOf(dbvalue) === -1) {
            $scope.checkedSex.push(dbvalue);
        } else {
            $scope.checkedSex.splice($scope.checkedSex.indexOf(dbvalue), 1);
        }
    };
    $scope.discountSubmitted = false;
    $scope.showLoader = false;
    var DELAY_TIME_BEFORE_POSTING = 300;
    var currentTimeout = null;
    angular.element('#searchTagFriend').keypress(function(event) {
        var model = $scope.searchText;
        if(currentTimeout) {
        $timeout.cancel(currentTimeout);
        }
        currentTimeout = $timeout(function(){
            if(event.which != 13){ 
              $scope.tagFriendSuggestion();
            }
        }, DELAY_TIME_BEFORE_POSTING)
    });
    $scope.friends = [];
    $scope.cancelFriendSearch = false;
    $scope.showSearchLoader = false;
    $scope.showFrom = false;
    $scope.tagFriendSuggestion = function(){
        $scope.cancelFriendSearch = false;
        $scope.showFriendList = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_name = $scope.friendName;
        opts.session_id = APP.currentUser.id;
        opts.limit_start = 0;
        opts.limit_size =  APP.friend_list_pagination.end;
        $scope.showSearchLoader = true;
        ProfileService.searchFriends(opts,function(data){
            $scope.showSearchLoader = false;
            if($scope.cancelFriendSearch === false){
                $scope.friends = data.data.users;
                if($scope.friends.length == 0){
                }
            }
        })
    };
    // Store friend 
    $scope.storedFriend = [];
    $scope.dublicate = false;
    $scope.selectFriend = function(friendInfo){
        if(friendInfo === undefined){
            return;
        }else{
            $scope.dublicate = false;
            angular.forEach($scope.storedFriend,function(index){
                if(index.user_id === friendInfo.user_id){
                    $scope.dublicate = true;
                }
            });

            if($scope.dublicate === false){
                $scope.storedFriend.push(friendInfo);
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#searchTagFriend').val("");
                $scope.showFriendList = false;
            }else{
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#searchTagFriend').val("");
                $scope.showFriendList = false;
            }
        }
    };
    $scope.removeTagFriend = function(friendIndex){
        //var index = $scope.storedFriend.indexOf(friendIndex);
        $scope.storedFriend.splice(friendIndex,1);
    };
    // stop the service for loading more service
    $scope.lostFormFocus = function(){
        $timeout(function(){
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTaggIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        },300);
    };
    $scope.friendTaggIndex = -1;
    $scope.keyUpDownControl = function(event){
        if(event.keyCode===40){
            event.preventDefault();
            if($scope.friendTaggIndex+1 !== $scope.friends.length){
                $scope.friendTaggIndex++;
            }
        }else if(event.keyCode===38){
            event.preventDefault();
            if($scope.friendTaggIndex-1 !== -1){
                $scope.friendTaggIndex--;
            }
        }else if(event.keyCode===13){
                $scope.selectFriend($scope.friends[$scope.friendTaggIndex]);
        }
    };
    /// tagging in keywords //
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
        //opts.category_id = $scope.store.storecategory.id.toString();
        opts.keyword = $scope.tagkeywords;
        opts.session_id = APP.currentUser.id;
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
                if($scope.tagkeywords.trim() !== ''){
                   var opts = {};
                        opts.user_id = APP.currentUser.id;
                        opts.keyword = $scope.tagkeywords;

                    ProfileService.addKeywords(opts,function(data){
                         if(data.code === 101 && data.message === 'SUCCESS'){
                            $scope.keywords =  data.data.keyword;
                            $scope.storeKeyword($scope.keywords);
                        }
                    });
               }
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
    $scope.tagkeywords = "";
    $scope.keywordList = [];
    $scope.storeKeyword = function(index){
        $scope.keywords = [];
        $scope.keywordIndex = -1;
        $scope.seen = true;
        $scope.tagkeywords = "";
        if( typeof(index) === 'object'){
            /* if($scope.keywordList.indexOf(index.name) === -1){
                $scope.keywordList.push(index);
            }*/
            for (var i = 0; i<$scope.keywordList.length; i++){
                if($scope.keywordList[i].name == index.name)
                {
                   $scope.seen = false;
                }
            } 
            if($scope.seen == true)
            {   
                $scope.keywordList.push(index);
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
    $scope.removeKeyword = function(index){
        var keyIndex = $scope.keywordList.indexOf(index);
        $scope.keywordList.splice(index,1);
    }; 
    $scope.dp= {};
    $scope.confirm = false;
    var today = new Date();
    var stoday = today.toISOString();
    $scope.todayDate = stoday;
    $scope.showMesge = false;
    $scope.errorMesg = false;
    $scope.confirmAwards = function(){
        if($scope.dp.discountPosition === undefined || $scope.dp.discountPosition == ''){
            focus('radio1');
            return false;
        }
        $scope.confirm = true;
        $scope.valueDp = $scope.dp.discountPosition;
        $scope.conMsg = true;
        $timeout(function(){
            $scope.conMsg = false;
        },5000);
    };
    $scope.createDp = function(){
        $scope.discountSubmitted = true;
        if(!$scope.confirm){
           focus('radio1');
            return false;
        } else if($scope.dp.discountPosition == undefined || $scope.dp.discountPosition == ''){
            focus('radio1');
            return false;
        }
        $scope.showLoader = true;
        $scope.hideButton  = true;
        var url    = APP.service.getApplaneData + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
        var param = new Object;
        var option = new Object();
        var keywordtagged = [];
        if($scope.keywordList.length > 0){
         for (var i = 0; i < $scope.keywordList.length; i++) 
            {   
               keywordtagged.push(' ' + $scope.keywordList[i].name + ' ');
            }
        }
        var keyword = keywordtagged.join();
        option["keywords"] = keyword;
        option["sex"] = $scope.checkedSex;
        var tagged = [];
        var taggfriend= {};
        if($scope.storedFriend.length > 0){
            for (var i = 0; i < $scope.storedFriend.length; i++) 
            {
                taggfriend._id = $scope.storedFriend[i].user_info.id.toString();
                taggfriend.name = $scope.storedFriend[i].user_info.first_name + $scope.storedFriend[i].user_info.last_name ;
                tagged.push(taggfriend) ;
            }
        }
        //taggfriend._id = '551d03d348619e4e34b7f060';
        //taggfriend.name = 'kapil';
        //tagged.push(taggfriend) ;
        var friends = new Object;
        friends["$insert"] = tagged;
        option["tag_friends"] = friends;
        var shopdetail = new Object;
        shopdetail["_id"] = $scope.routeId;
        option["shop_id"] = shopdetail;
        option["credit"] = $scope.dp.discountPosition;
        option["start_date"] = $scope.todayDate;
        var array = [];
        array.push(option);
        param["$insert"] = array;
        param["$collection"] = "sixc_shopdp";
        var main =[];
        main.push(param);
        $scope.showErrorDp = false;
        OfferService.addUpdateApplaneData(main, function(data){
            if(data.status === "ok" && data.code === 200){
                $scope.showLoader = false;
                $scope.showMesge = true;
                $scope.hideButton  = false;
                $scope.dp = {};
                $scope.storedFriend.length = 0;
                $scope.keywordList.length = 0;
                $scope.checkedSex.length =0;
                $scope.valueDp = '';
                $timeout(function() {
                    $scope.showMesge =  false;
                },15000);
                $scope.discountSubmitted = false;
                $scope.getlistingData();
            } else if(data.status === "error" && data.message == 1){
                    $scope.showErrorDp = true;
                    $scope.showLoader = false;
                    $scope.ShowErrorResponse = data.response;
                    $scope.dp = {};
                    $scope.storedFriend.length = 0;
                    $scope.keywordList.length = 0;
                    $scope.checkedSex.length =0;
                    $scope.valueDp ='';
                    $scope.hideButton  = false;
                    $scope.discountSubmitted = false;
                    $timeout(function(){
                    $scope.showErrorDp = false;
                },110000);
            }else{
                $scope.showLoader = false;
                $scope.errorMesg = true;
                $scope.hideButton  = false;
                $scope.discountSubmitted = false;
                $timeout(function(){
                    $scope.errorMesg = false;
                },15000);
            }
        });
    };
    $scope.getlistingData = function(){
        $scope.offerlistingObject = [];
        $scope.showCouponListMsg = false;
        $scope.couponListingLoader = true;
        var option  = new Object();
            option["$collection"] = "sixc_shopdp";
            var getlisting = new Object();
            getlisting["value"] =1;
            getlisting["start_date"] =1;
            getlisting["end_date"] = 1;
            getlisting["credit"] =1;
            getlisting["debit"] =1;
            getlisting["balance"] = 1;
            option["$fields"] = getlisting;
            var filters = new Object(); 
            var bal = new Object();
            bal["$gt"] = 0;
            filters["shop_id"] = $scope.routeId;
            filters["balance"] = bal;
            option["$filter"] = filters;
            var history = new Object();
            history["__history.__createdOn"] = -1;
            option["$sort"] = history;
            option["$limit"] = 5;
            option["$skip"] = 0;
            $scope.noResult = false;
            OfferService.getApplaneData(option, function(data){
                 if(data.status === "ok" && data.code === 200){
                    $scope.couponListingLoader = false;
                    $scope.offerlistingObject = data.response.result;
                    $scope.dpLength = 0;
                    if($scope.offerlistingObject.length == 0){
                        $scope.showCouponListMsg = true;
                    }
                 } else {
                    $scope.couponListingLoader = false;
                    
                 }

            });     
    };
    $scope.getlistingData();

}]);
app.controller('CreateCampaignController', ['$scope', '$http', '$rootScope', '$routeParams', '$location', '$timeout', 'focus', 'CommerialService' , 'ProfileService', 'OfferService' , 'fileReader', 'FileUploader', 'DateToMongoDate', function ($scope, $http,$rootScope, $routeParams, $location, $timeout, focus, CommerialService, ProfileService, OfferService , fileReader, FileUploader, DateToMongoDate) {
    $scope.formSubmitted = false;
    $scope.showSucessMesge = false;
    $scope.startDate = $scope.i18n.coupon.start_date;
    $scope.endDate = $scope.i18n.coupon.end_date;
   $scope.sex= [{
            "dbvalue": "Male",
            "value": $scope.i18n.coupon.man
        }, {
            "dbvalue": "Female",
            "value": $scope.i18n.coupon.women
        }];
    $scope.checkedSex = [];
    $scope.toggleCheck = function (dbvalue) {
        if ($scope.checkedSex.indexOf(dbvalue) === -1) {
            $scope.checkedSex.push(dbvalue);
            
        } else {
            $scope.checkedSex.splice($scope.checkedSex.indexOf(dbvalue), 1);
            
        }
    };

    var DELAY_TIME_BEFORE_POSTING = 300;
    var currentTimeout = null;
    angular.element('#searchTagFriend').keypress(function(event) {
        var model = $scope.searchText;
        if(currentTimeout) {
        $timeout.cancel(currentTimeout);
        }
        currentTimeout = $timeout(function(){
            if(event.which != 13){ 
              $scope.tagFriendSuggestion();
            }
        }, DELAY_TIME_BEFORE_POSTING)
    });
    $scope.friends = [];
    $scope.cancelFriendSearch = false;
    $scope.showSearchLoader = false;
    $scope.showFrom = false;
    $scope.tagFriendSuggestion = function(){
        $scope.cancelFriendSearch = false;
        $scope.showFriendList = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.friend_name = $scope.friendName;
        opts.session_id = APP.currentUser.id;
        opts.limit_start = 0;
        opts.limit_size =  APP.friend_list_pagination.end;
        $scope.showSearchLoader = true;
        ProfileService.searchFriends(opts,function(data){
            $scope.showSearchLoader = false;
            if($scope.cancelFriendSearch === false){
                $scope.friends = data.data.users;
                if($scope.friends.length == 0){
                  
                }
            }
        })
    };
    // Store friend 
    $scope.storedFriend = [];
    $scope.dublicate = false;
    $scope.selectFriend = function(friendInfo){
        if(friendInfo === undefined){
            return;
        }else{
            $scope.dublicate = false;
            angular.forEach($scope.storedFriend,function(index){
                if(index.user_id === friendInfo.user_id){
                    $scope.dublicate = true;
                }
            });

            if($scope.dublicate === false){
                $scope.storedFriend.push(friendInfo);
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#searchTagFriend').val("");
                $scope.showFriendList = false;
            }else{
                $scope.friends = [];
                $scope.cancelFriendSearch = true;
                $scope.friendTaggIndex = -1;
                angular.element('#searchTagFriend').val("");
                $scope.showFriendList = false;
            }
        }
    };
    $scope.removeTagFriend = function(friendIndex){
        //var index = $scope.storedFriend.indexOf(friendIndex);
        $scope.storedFriend.splice(friendIndex,1);
    };
    // stop the service for loading more service
    $scope.lostFormFocus = function(){
        $timeout(function(){
            $scope.friends = [];
            $scope.cancelFriendSearch = true;
            $scope.friendTaggIndex = -1;
            angular.element('#searchTagFriend').val("");
            $scope.showFriendList = false;
        },300);
    };
    $scope.friendTaggIndex = -1;
    $scope.keyUpDownControl = function(event){
        if(event.keyCode===40){
            event.preventDefault();
            if($scope.friendTaggIndex+1 !== $scope.friends.length){
                $scope.friendTaggIndex++;
            }
        }else if(event.keyCode===38){
            event.preventDefault();
            if($scope.friendTaggIndex-1 !== -1){
                $scope.friendTaggIndex--;
            }
        }else if(event.keyCode===13){
                $scope.selectFriend($scope.friends[$scope.friendTaggIndex]);
        }
    };
    /// tagging in keywords //
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
        //opts.category_id = $scope.store.storecategory.id.toString();
        opts.keyword = $scope.tagkeywords;
        opts.session_id = APP.currentUser.id;
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
                if($scope.tagkeywords.trim() !== ''){
                   var opts = {};
                        opts.user_id = APP.currentUser.id;
                        opts.keyword = $scope.tagkeywords;

                    ProfileService.addKeywords(opts,function(data){
                         if(data.code === 101 && data.message === 'SUCCESS'){
                            $scope.keywords =  data.data.keyword;
                            $scope.storeKeyword($scope.keywords);
                        }
                    });
               }
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
    $scope.tagkeywords = "";
    $scope.keywordList = [];
    $scope.storeKeyword = function(index){
        $scope.keywords = [];
        $scope.keywordIndex = -1;
        $scope.seen = true;
        $scope.tagkeywords = "";
        if( typeof(index) === 'object'){
            /* if($scope.keywordList.indexOf(index.name) === -1){
                $scope.keywordList.push(index);
            }*/
            for (var i = 0; i<$scope.keywordList.length; i++){
                if($scope.keywordList[i].name == index.name)
                {
                   $scope.seen = false;
                }
            } 
            if($scope.seen == true)
            {   
                $scope.keywordList.push(index);
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
    $scope.removeKeyword = function(index){
        var keyIndex = $scope.keywordList.indexOf(index);
        $scope.keywordList.splice(index,1);
    }; 
    $scope.campaign = {};
    $scope.campaign.cardValue= 20; 
    $scope.dateDiff = false;
    $scope.errorMesg = false;
    $scope.showMesge = false;
    $scope.showLoader  = false;
    $scope.todayDiff = false;
    var today = new Date();
    var stoday = today.toISOString();
    $scope.todayDate = stoday;
    $scope.compareDate = function() {
        if(($scope.dt).toISOString() > ($scope.dtt).toISOString()) 
            {$scope.dateDiff = true;}
        else { $scope.dateDiff = false;}
        if(($scope.dtt).toISOString() < ($scope.todayDate)) 
            {$scope.todayDiff = true;}
        else { $scope.todayDiff = false;}  
    }

    $scope.compareDateStart = function(){
        if($scope.dtt){
           if(($scope.dt).toISOString() > ($scope.dtt).toISOString()) 
            {$scope.dateDiff = true;}
        else { $scope.dateDiff = false;}   
        }
    }
    $scope.createCampaign = function(){
        var newSDate = $scope.dt;
        var dd = newSDate.getDate();
        var mm = newSDate.getMonth()+1; 
        var yyyy = newSDate.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var newSDate = yyyy+'-'+mm+'-'+dd;
        
        var newEDate = $scope.dtt;
        var dd = newEDate.getDate();
        var mm = newEDate.getMonth()+1; 
        var yyyy = newEDate.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var newEDate = yyyy+'-'+mm+'-'+dd;
        $scope.fileNotValid = false;
        $scope.showErrorCard = false;
        $scope.formSubmitted = true;
        var startdate = $scope.dt;
        var enddate = $scope.dtt;
        if($scope.campaign.cardValue == undefined || $scope.campaign.cardValue == ''){
            focus('checkboxG1');
            return false;
        } else if($scope.campaign.discount == undefined || $scope.campaign.discount == ''){
            focus('radio1');
            return false;
        } else if($scope.campaign.quantity == undefined || $scope.campaign.quantity == ''){
            focus('radio4');
            return false;
        } else if($scope.dt == undefined || $scope.dt == ''){
            focus('dt');
            return false;
        } else if($scope.dtt == undefined || $scope.dtt == ''){
            focus('dtt');
            return false;
        } else if(($scope.dt).toISOString() > ($scope.dtt).toISOString()) {
            $scope.dateDiff = true;
            focus('dtt');
            $timeout(function() {
                $scope.dateDiff = false;
            }, 5000);
            return false;
        } else if(($scope.dtt).toISOString() < ($scope.todayDate)){
            $scope.todayDiff = true;
            focus('dtt');
            $timeout(function() {
                $scope.todayDiff = false;
            }, 5000);
            return false;
        }  else if(!$scope.campaign.descriptionCard || $scope.campaign.descriptionCard == ''){
            focus('description');
            return false;
        } else if(!$scope.imageToUpload  || $scope.imageToUpload.length == 0){
            focus('uploadpic');
            return false;
        }
       /* $scope.displayStartDate = startdate.toISOString(); 
        $scope.displayEndDate = enddate.toISOString();*/
        $scope.showLoader = true;
        $scope.hideButton  = true;
        
        var url    = APP.service.addUpdateApplaneData + "?access_token=" + APP.accessToken + "&session_id=" + APP.currentUser.id;
        var parameters = new Object();
        var main =[];
        $scope.offer_type = "551ce49e2aa8f00f20d93295";
        var option = new Object();
        option["code"] = '';
        option["description"] = $scope.campaign.descriptionCard;
        option["discount"] = parseInt($scope.campaign.discount);
        option["end_date"] = newEDate;
        var keywordtagged = [];
        if($scope.keywordList.length > 0){
         for (var i = 0; i < $scope.keywordList.length; i++) 
            {   
               keywordtagged.push(' ' + $scope.keywordList[i].name + ' ');
            }
        }
        var keyword = keywordtagged.join();
        option["keywords"] = keyword;
        option["name"] = '';
        var type = new Object;
        type["_id"] = $scope.offer_type;
        option["offer_type"] = type;
        var shopdetail = new Object;
        shopdetail["_id"] = $scope.storeId;
        shopdetail['name'] = $scope.storeName;
        option["shop_id"] = shopdetail;
        option["start_date"] = newSDate;
        var tagged = [];
        var taggfriend= {};
        if($scope.storedFriend.length > 0){
            for (var i = 0; i < $scope.storedFriend.length; i++) 
            {
                taggfriend._id = $scope.storedFriend[i].user_info.id.toString();
                taggfriend.name = $scope.storedFriend[i].user_info.first_name + $scope.storedFriend[i].user_info.last_name ;
                tagged.push(taggfriend) ;
            }
        }
        var friends = new Object;
        friends["$insert"] = tagged;
        option["tag_friends"] = friends;
        option["title"] ='';
        option["to_avail"] = parseInt($scope.campaign.quantity);
        option["value"] = parseInt($scope.campaign.cardValue);
        var media_link = [];
        angular.forEach($scope.imageToUpload, function(file) {
              media_link.push(file.media_link);
        });
        var imageurls = media_link.join();
        option["imageurl"] = imageurls;
        option["sex"] = $scope.checkedSex;
        var array = [];
        array.push(option);
        parameters["$insert"] = array;
        parameters["$collection"] = "sixc_offers";
        main.push(parameters);
       
         OfferService.addUpdateApplaneData(main, function(data){
            if(data.status === "ok" && data.code === 200){
                $scope.showLoader = false;
                $scope.showMesge = true;
                $scope.hideButton  = false;
                $scope.campaign = {};
                $scope.dt = '';
                $scope.dtt = '';
                $scope.storedFriend.length = 0;
                $scope.keywordList.length = 0;
                $scope.imageToUpload = [];
                uploader.queue = [];
                $scope.checkedSex.length = 0;
                $scope.campaign.cardValue= 20; 
                $timeout(function() {
                    $scope.showMesge =  false;
                },15000);
                $scope.formSubmitted = false;
                $scope.getlistingData();
            } else if(data.status === "error" && data.message == 1){
                    $scope.showErrorCard = true;
                    $scope.showLoader = false;
                    $scope.ShowErrorResponse = data.response;
                    $scope.campaign = {};
                    $scope.dt = '';
                    $scope.dtt = '';
                    $scope.storedFriend.length = 0;
                    $scope.keywordList.length = 0;
                    $scope.imageToUpload = [];
                    uploader.queue = [];
                    $scope.checkedSex.length = 0;
                    $scope.campaign.cardValue= 20; 
                    $scope.hideButton  = false;
                    $scope.formSubmitted = false;
                    $timeout(function(){
                      $scope.showErrorCard = false;
                    },30000);
            }else{
               $scope.showLoader = false;
                $scope.errorMesg = true;
                $scope.hideButton  = false;
                $scope.formSubmitted = false;
                $timeout(function(){
                    $scope.errorMesg = false;
                },15000);
            }
        });
    };
     //uploader.queue = [];
    $scope.fileNotValid = false;
    $scope.fileNotValidMsg = '';
    $scope.tempAlbumId = '';
    $scope.albumImgLoader = [];
   //uploader.queue = []; 
   $scope.imagePrvSrc = [];
    $scope.imageToUpload = [];
     var uploader =  $scope.uploader = new FileUploader({
          url: APP.service.uploadstoreofferimages+"?access_token="+APP.accessToken,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'method': 'POST'
              /*'Accept': 'text/json'*/
          },
          data:{
              'shop_id': $scope.routeId ,
              'session_id' : APP.currentUser.id
          },
          dataObjName:'reqObj',
          formDataName:'shop_offer_media[]'
        });
    // FILTERS
        uploader.filters.push({
            name: 'user_media[]',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        }); 
        uploader.onAfterAddingFile = function(fileItem) {
            $scope.postContentStart = true;
            var queueLen = uploader.queue.length;
            if(uploader.queue.length != 0){
                $scope.uploadBox = false;
                $scope.imgUpload = true;
            }
            $scope.albumImgLoader[queueLen] = true;
            uploader.uploadItem(fileItem);
        };

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            var index = uploader.getIndexOfItem(fileItem);
            if(response.code == 101){
                $scope.imageToUpload[index] = response.data;
                $scope.imagePrvSrc[index] = response.data;
                $scope.albumImgLoader[index] = false;
            }
        };
         uploader.onCompleteAll = function() {
            $scope.postContentStart = false;
        }

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileNotValid = true;
            $scope.fileNotValidMsg = $scope.i18n.albums.upload_media_invalid;
            $timeout(function(){
                $scope.fileNotValidMsg = '';
            }, 4000);
        };
            //remove iamge from preview array
            $scope.removeError = false;
        $scope.removeImage = function(index) {
            var tempImg = $scope.imagePrvSrc[index];
            $scope.imagePrvSrc.splice(index, 1);
            var item = $scope.uploader.queue[index];
            item.remove();
            var opts = {};
            opts.session_id = APP.currentUser.id; 
            opts.media_path = tempImg.media_link;
            //calling the service to delete the selected post 
            OfferService.deleteShopOfferMedias(opts, function(data){
                if(data.code == 101) {
                } else {
                    $scope.removeError = true;
                    $scope.imagePrvSrc[index] = tempImg;
                    $timeout(function(){
                        $scope.removeErrMsg = $scope.i18n.Campaign_work.remove_errormsg;
                    }, 4000);
                }
            });
        };
        $scope.getlistingData = function(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
            } 
            var today = yyyy+'-'+mm+'-'+dd;
            //$scope.todaySDate = DateToMongoDate.dateToIso(today);
            $scope.offerlistingObject = [];
            $scope.showCardListMsg = false;
            $scope.cardListingLoader = true;
            $scope.offer_id    = "551ce49e2aa8f00f20d93295";
                var option  = new Object();
                option["$collection"] = "sixc_offers";
                var getlisting = new Object();
                getlisting["value"] =1;
                getlisting["start_date"] =1;
                getlisting["end_date"] = 1;
                getlisting["discount"] =1;
                getlisting["to_avail"] =1;
                option["$fields"] = getlisting;
                var filters = new Object(); 
                var start = new Object();
                start["$lte"] = today;
                var end = new Object();
                end["$gte"] = "$$CurrentDate";
                filters["start_date"] = start;
                filters["end_date"] = end;
                filters["offer_type"] = $scope.offer_id;
                filters["shop_id"] = $scope.routeId;
                option["$filter"] = filters;
                var history = new Object();
                history["__history.__createdOn"] = -1;
                option["$sort"] = history;
                option["$limit"] = 15;
                option["$skip"] = 0;
                $scope.noResult = false;
                OfferService.getApplaneData(option, function(data){
                     if(data.status === "ok" && data.code === 200){
                        $scope.cardListingLoader = false;
                        $scope.offerlistingObject = data.response.result;
                        if($scope.offerlistingObject.length == 0){
                            $scope.showCardListMsg = true;
                        }
                        
                     } else {
                        $scope.cardListingLoader = false;
                        
                     }

                });     
    };
    $scope.getlistingData();

}]);


app.controller('WorkCampaignController', ['$scope', '$http', '$rootScope', '$routeParams', '$location', '$timeout', 'focus', 'CommerialService' , 'ProfileService', 'OfferService' ,'StoreService' ,'$window', function ($scope, $http,$rootScope, $routeParams, $location, $timeout, focus, CommerialService, ProfileService, OfferService, StoreService ,$window) {
        $scope.grid = false;
        $scope.isOpenBottomForm = false;
        $scope.isOpenTopForm = false;
        $scope.showMessage = false;
        $scope.is_paypal_added = 0;
        $scope.is_paypal_added = StoreService.getStoreData().is_paypal_added;

        $scope.showGrid  = function(){
            $scope.grid = !$scope.grid;
        }
        //function to open bottom pay pal form
        $scope.openBottomForm  = function(){
            $scope.paypalErrCls = '';
            $scope.paypalErrMsg = '';
            $scope.paypal = {};
            $scope.isOpenTopForm = false;
            $scope.isOpenBottomForm = true;
            $scope.isOpenBottomFormMsg = true;
            $scope.paypalForm.$setPristine();
            
            
        }

         //function to open top pay pal form
        $scope.openTopForm  = function(){
            $scope.paypalErrCls = '';
            $scope.paypalErrMsg = '';
            $scope.isOpenBottomForm = false;
            $scope.isOpenTopForm = true;
            $scope.isOpenBottomFormMsg = false;
            $scope.paypal = {};
            $scope.paypalForm.$setPristine();
        }

        //function to close pay pal form
        $scope.closeForm  = function(){
            $scope.paypal = {};
            $scope.paypalForm.$setPristine();
            $scope.isOpenBottomForm = false;
            $scope.isOpenTopForm = false;
        }
        
        $scope.getSubscription = function(){
           
            var formData = {};
            formData.shop_id = $scope.routeId;
            formData.user_id = APP.currentUser.id;
            formData.return_url = APP.payment.siteDomain + '#/shop/promotions/'+ $scope.routeId; 
            formData.cancel_url = APP.payment.siteDomain + '#/shop/view/' + $scope.routeId;
            
            CommerialService.getSubscription(formData, function(data) { 
                if(data.code == 101) {
                    if(data.data.url != '' ) {
                        $window.location.href = data.data.url;
                    } else { 
                        $scope.getPaymentUrl = '';
                    } 
                } else { 
                    $scope.getPaymentUrl = '';
                }
            });    
        }
        $scope.unsubscribe = function(){
            
            $scope.subLoader = true;
           // $scope.subscribeButton = true;
            var formData = {};
            formData.shop_id = $scope.routeId;
            formData.user_id = APP.currentUser.id;
            CommerialService.unSubscribes(formData, function(data) { 
                if(data.code == 101){
                    $scope.subLoader = false;
                    $scope.subButtonHide = true;
                    $scope.is_subscribed = 0;
                    $scope.subMsg = true;
                    $timeout(function(){
                        $scope.subMsg = false;
                        $location.path("/shop/view/" + $scope.routeId);
                    }, 4000);
                }else{
                    $scope.subLoader = false;
                   // $scope.subscribeButton = false;
                    $scope.subButtonHide = false;
                    $scope.subMsgError = true;
                    $timeout(function(){
                        $scope.subMsgError = false;
                    }, 8000);
                }
            });
       }
}]);
