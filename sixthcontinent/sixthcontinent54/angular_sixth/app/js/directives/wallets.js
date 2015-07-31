app.directive('creditDetail', ['$http', 'CitizenWallet', '$rootScope', function($http, CitizenWallet, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/citizen_credit_detail.html',
    scope: true,
    link: function (scope){
      
    },
    controller: function ($scope){
      $scope.total_income_loader =true;
      $scope.total_credit_loader =true;
      $scope.total_creditAc_loader =true;
      $scope.total_creditBal_loader =true;
      $rootScope.citizenAvailableBalance = 0.00;
      var query = {
        "my_citizen_income": {
            "$collection": "sixc_bucks",
            "$filter": {
                "citizen_id": (APP.currentUser.id).toString(),
            },
            "$group": {
                "_id": null,
                "amount": {
                    "$sum": "$amount"
                },
                "debit": {
                    "$sum": "$debit"
                },
                "credit": {
                    "$sum": "$credit"
                }
            }
        },
        "my_income": {
            "$collection": "sixc_wallet",
            "$group": {
                "credit": {
                    "$sum": "$credit"
                },
                "debit": {
                    "$sum": "$debit"
                },
                "amount": {
                    "$sum": "$amount"
                },
                "_id": null,
                "$fields": false
            },
            "$filter": {
                "citizen_id": (APP.currentUser.id).toString(),
                "discount_type_id.name": {
                    "$in": [
                        //"Shot",
                        "Dp"
                    ]
                }
            }
        }
      }

      CitizenWallet.getCitizenCredits(query,function(data){
        if(data.status === 'ok' && data.code === 200){
          $scope.total_income_loader =false;
          $scope.total_credit_loader =false;
          $scope.total_creditAc_loader =false;
          $scope.total_creditBal_loader =false;
          var my_citizen_income = data.response.my_citizen_income.result[0]
          var my_income = data.response.my_income.result[0]
          if(my_citizen_income){
            $scope.total_income = my_citizen_income.amount
            $scope.total_credit = my_citizen_income.credit
            $rootScope.citizenAvailableBalance = 0.00;
            $rootScope.citizenAvailableBalance = my_citizen_income.amount;
          }else{
             $scope.total_income = 0;
            $scope.total_credit = 0;
          }if(my_income){
            $scope.credit_active = my_income.credit
            $scope.credit_balance = my_income.credit - my_income.debit
          }else{
            $scope.credit_active = 0;
            $scope.credit_balance = 0;
          }
          
        }
      })
    }
  }
}]);

app.directive('shopCard', ['$http', '$rootScope', 'StoreService', 'CitizenWallet', 'focus', '$filter', 'DateToMongoDate', function($http, $rootScope, StoreService, CitizenWallet, focus, $filter, DateToMongoDate) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/citizen_shop_card.html',
    scope: true,
    link: function (scope){
      
    },
    controller: function ($scope){
      $('.dateInput').datepicker({dateFormat: 'dd-mm-yy'});
      $scope.totalCardItemss50 = 0;
      $scope.totalCardItemss100 = 0;
      $scope.totalCards50 = 0;
      $scope.totalCards100 = 0;
      $scope.range50 = [];
      $scope.range100 = [];
      $scope.firstPage50 = 6;
      $scope.firstPage100 = 6;
      $scope.itemsPerPage = 6;
      $scope.currentPage50 = 1;
      $scope.currentPage100 = 1;
      $scope.shopingCardLoad1 = true;
      $scope.shopingCardLoad2 = true;

      $scope.startDate = $scope.i18n.citizen_wallet.from;
      $scope.endDate = $scope.i18n.citizen_wallet.to;
      $scope.filterObject = {
        "citizen_id":(APP.currentUser.id).toString(),
        "balance":{
          "$gt":0
        }
      };
        
      var currentDate = new Date();
      var defaultDate = new Date(parseInt(currentDate.getFullYear())+50,9,27);

      $scope.changePageMore50 = function(pageNo) {
        $scope.shopingCardLoad2 = true;
        $scope.currentPage50 = pageNo;
        $scope.loadMore();
      };

      $scope.prevPage50 = function() {
          if ($scope.currentPage50 > 1) {
              $scope.currentPage50--;
          }
          $scope.shopingCardLoad2 = true;
          $scope.loadMore();
      };

      $scope.prevPageDisabled50 = function() {
          return $scope.currentPage50 === 1 ? "disabled" : "";
      };

      $scope.nextPage50 = function() {
          if ($scope.currentPage50 < $scope.totalCards50) {
              $scope.currentPage50++;
          }
          $scope.shopingCardLoad2 = true;
         $scope.loadMore();
      };

      $scope.nextPageDisabled50 = function() {
          return $scope.currentPage50 === $scope.totalCards50 ? "disabled" : "";
      };

      $scope.changePageMore100 = function(pageNo) {
        $scope.shopingCardLoad1 = true;
        $scope.currentPage100 = pageNo;
        $scope.loadMore();
      };

      $scope.prevPage100 = function() {
          if ($scope.currentPage100 > 1) {
              $scope.currentPage100--;
          }
          $scope.shopingCardLoad1 = true;
          $scope.loadMore();
      };

      $scope.prevPageDisabled100 = function() {
          return $scope.currentPage100 === 1 ? "disabled" : "";
      };

      $scope.nextPage100 = function() {
          if ($scope.currentPage100 < $scope.totalCards100) {
              $scope.currentPage100++;
          }
          $scope.shopingCardLoad1 = true;
         $scope.loadMore();
      };

      $scope.nextPageDisabled100 = function() {
          return $scope.currentPage100 === $scope.totalCards100 ? "disabled" : "";
      };

      $scope.loadMore = function() {
        var limit_start50 = ($scope.currentPage50-1)*$scope.itemsPerPage;
        var limit_start100 = ($scope.currentPage100-1)*$scope.itemsPerPage;
        var query = {
          "my_wallet_upto100": {
              "$collection": APP.applaneTables.citizenWalletCards,
              "$fields": {
                  "credit": 1,
                  "card_no": 1,
                  "card_code": 1,
                  "shop_id.name": 1,
                  "shop_id.address_l1": 1,
                  "shop_id.address_l2": 1,
                  "shop_id.city": 1,
                  "shop_id.country": 1,
                  "shop_id.average_anonymous_rating": 1,
                  "shop_id.latitude": 1,
                  "shop_id.longitude": 1,
                  "shop_id.mobile_no": 1,
                  "shop_id.region": 1,
                  "shop_id.province": 1,
                  "shop_id.zip": 1,
                  "shop_id.streetaddress": 1,
                  "shop_id.email_address": 1,
                  "shop_id.web_address": 1,
                  "from_date": 1,
                  "to_date": 1,
                  "balance": 1
              },
              "$filter":$scope.filterObject,
              "$sort": {
                  "to_date": 1
              },
              "$limit": $scope.itemsPerPage,
              "$skip": limit_start100
          },
          "my_wallet_upto100_count": {
              "$collection": APP.applaneTables.citizenWalletCards,
              "$group": {
                  "count": {
                      "$sum": 1
                  },
                  "_id": null,
                  "$fields": false
              },
              "$filter":$scope.filterObject
          },
          "my_wallet_upto50": {
              "$collection": APP.applaneTables.citizenWalletCards,
              "$fields": {
                  "credit": 1,
                  "card_no": 1,
                  "card_code": 1,
                  "shop_id.name": 1,
                  "shop_id.address_l1": 1,
                  "shop_id.address_l2": 1,
                  "shop_id.city": 1,
                  "shop_id.country": 1,
                  "shop_id.average_anonymous_rating": 1,
                  "shop_id.latitude": 1,
                  "shop_id.longitude": 1,
                  "shop_id.mobile_no": 1,
                  "shop_id.region": 1,
                  "shop_id.province": 1,
                  "shop_id.zip": 1,
                  "shop_id.streetaddress": 1,
                  "shop_id.email_address": 1,
                  "shop_id.web_address": 1,
                  "from_date": 1,
                  "to_date": 1,
                  "balance": 1
              },
              "$filter": $scope.filterObject,
              "$sort": {
                  "to_date": 1
              },
              "$limit": $scope.itemsPerPage,
              "$skip": limit_start50
          },
          "my_wallet_upto50_count": {
              "$collection": APP.applaneTables.citizenWalletCards,
              "$group": {
                  "count": {
                      "$sum": 1
                  },
                  "_id": null,
                  "$fields": false
              },
              "$filter": $scope.filterObject
          }
        };
        if(query.my_wallet_upto100){
          var for100obj = JSON.parse(JSON.stringify(query.my_wallet_upto100.$filter))
          for100obj.type = "551ce49e2aa8f00f20d93295";
          query.my_wallet_upto100.$filter = for100obj;

          var for100objCount = JSON.parse(JSON.stringify(query.my_wallet_upto100_count.$filter))
          for100objCount.type = "551ce49e2aa8f00f20d93295";
          query.my_wallet_upto100_count.$filter = for100objCount;
          query.my_wallet_upto100_count.$filter = for100objCount;
        }
        if(query.my_wallet_upto50){
          var for50obj = JSON.parse(JSON.stringify(query.my_wallet_upto50.$filter))
          for50obj.type = "551ce49e2aa8f00f20d93293";
          query.my_wallet_upto50.$filter = for50obj;

          var for50objCount = JSON.parse(JSON.stringify(query.my_wallet_upto50_count.$filter))
          for50objCount.type = "551ce49e2aa8f00f20d93293";
          query.my_wallet_upto50_count.$filter = for50objCount;
          query.my_wallet_upto50_count.$filter = for50objCount;
        }
        CitizenWallet.getCitizenDetails(query,function(data){
            $scope.shopingCardLoad1 = false;
            $scope.shopingCardLoad2 = false;
          if(data.status === 'ok' && data.code === 200) {
            $scope.totalCardItemss50 = data.response.my_wallet_upto50_count.result[0] ? data.response.my_wallet_upto50_count.result[0].count : 0;
            $scope.totalCardItemss100 = data.response.my_wallet_upto100_count.result[0] ? data.response.my_wallet_upto100_count.result[0].count : 0;
            $scope.totalCards50 = Math.ceil($scope.totalCardItemss50/$scope.itemsPerPage); 
            $scope.totalCards100 = Math.ceil($scope.totalCardItemss100/$scope.itemsPerPage); 
            $scope.range50 = []; 
            $scope.range100 = [];  
            for (var i=1; i<=$scope.totalCards50; i++) {
                $scope.range50.push(i);
            }
            for (var i=1; i<=$scope.totalCards100; i++) {
                $scope.range100.push(i);
            }
            $scope.shopCards100 = data.response.my_wallet_upto100.result;
            $scope.shopCards50 = data.response.my_wallet_upto50.result;
          } else {
            $scope.shopCards100 = [];
            $scope.shopCards50 = [];
            $scope.totalCardItemss50 = 0;
            $scope.totalCardItemss100 = 0;
          }
          
        });
      }

      $scope.loadMore();

      for (var i=1; i <= $scope.paging; i++) {
        $scope.range.push(i);
      }

      $scope.ratingConvert = function(rate,count){
        var rateArray = []
        if (count){
          rate = rate ? rate : 0;
          if(rate-Math.floor(rate)>0) count-=1;

          for(var i=0;i<count-Math.floor(rate);i++){
            rateArray.push(i);
          }
          return rateArray;
        }
        if(rate){
          rate = Math.floor(rate);
          for(var i=0;i<rate;i++){
            rateArray.push(i);
          }
          return rateArray;
        }
      }

      $scope.convertToInt =function(floatVal){
        return Math.floor(floatVal);
      }

      $scope.cardSearch = function() {

        if($scope.searchValue !== undefined && $scope.searchValue !== ''){
          $scope.filterObject['shop_id.name'] =  {
              "$regex": $scope.searchValue,
              "$options": "$i"
          }
        }else{
          $scope.filterObject['shop_id.name'] = undefined;
        } 
        $scope.filterObject["to_date"] = {};
        for( var i=0; i<$('.form-control').length;i++){
          if(angular.element('.form-control')[i].getAttribute('is-open') === 'opened1' && angular.element(angular.element('.form-control')[i]).val().length > 0){
            $scope.filterObject.to_date['$gte'] = DateToMongoDate.dateToIso(angular.element(angular.element('.form-control')[i]).val());
          }
          if(angular.element('.form-control')[i].getAttribute('is-open') === 'opened2' && angular.element(angular.element('.form-control')[i]).val().length > 0){
            $scope.filterObject.to_date['$lte'] = DateToMongoDate.dateToIso(angular.element(angular.element('.form-control')[i]).val());
          }
        }
        if($scope.filterObject.to_date['$gte'] === undefined && $scope.filterObject.to_date['$lte'] === undefined){
          $scope.filterObject["to_date"] = undefined;
        }
        // console.log(angular.element('.form-control'),'---',angular.element(angular.element('.form-control')[0]).val())
        // if(($scope.searchFrom !== undefined && $scope.searchFrom.length > 0) && ($scope.searchTo !== undefined && $scope.searchTo.length > 0)) {
        //   $scope.filterObject.to_date = {"$gte":DateToMongoDate.dateToIso($scope.searchFrom), "$lte":DateToMongoDate.dateToIso($scope.searchTo)};
        // } else if(($scope.searchFrom !== undefined && $scope.searchFrom.length > 0) && ($scope.searchTo === undefined || $scope.searchTo.length === 0) && $scope.searchFrom.length>0) {
        //   $scope.filterObject["to_date"] = {"$gte":DateToMongoDate.dateToIso($scope.searchFrom)};
        //   //$scope.filterObject["to_date"] = {"$lte": undefined};
        // } else if(($scope.searchFrom !== undefined && $scope.searchTo.length > 0) && ($scope.searchFrom === undefined || $scope.searchFrom.length === 0) && $scope.searchTo.length>0) {
        //   $scope.filterObject["to_date"] = {"$lte":DateToMongoDate.dateToIso($scope.searchTo)};
        //   //$scope.filterObject["to_date"] = {"$gte": undefined};
        // } else {
        //   $scope.filterObject["to_date"] = undefined;
        // }

        // if($scope.searchFrom !== undefined && $scope.searchFrom !== ''){
        //   $scope.searchFrom = ($scope.searchFrom).split("-").reverse().join("-");
        //   if($scope.filterObject['to_date']){
        //     $scope.filterObject['to_date']["$gte"] = DateToMongoDate.dateToIso($scope.searchFrom)
        //   }else{
        //     $scope.filterObject['to_date'] = {
        //       "$gte" : DateToMongoDate.dateToIso($scope.searchFrom)
        //     }
        //   }
        // }else if($scope.searchFrom === '' && $scope.filterObject['to_date'] && $scope.filterObject['to_date']["$gte"]){
        //   $scope.filterObject['to_date']["$gte"] = undefined;
        // }

        // if($scope.searchTo !== undefined && $scope.searchTo !== ''){
        //   $scope.searchTo = ($scope.searchTo).split("-").reverse().join("-");
        //   if($scope.filterObject['to_date']){
        //     $scope.filterObject['to_date']["$lte"] = DateToMongoDate.dateToIso($scope.searchTo);
        //   }else{
        //     $scope.filterObject['to_date'] = {
        //       "$lte" : DateToMongoDate.dateToIso($scope.searchTo)
        //     }
        //   }
        // }else if($scope.searchTo === '' && $scope.filterObject['to_date'] && $scope.filterObject['to_date']["$lte"]){
        //   $scope.filterObject['to_date']["$lte"] = undefined;
        // } 

        // if($scope.filterObject['to_date'] && $scope.filterObject['to_date']["$gte"] === undefined && $scope.filterObject['to_date']["$lte"] === undefined){
        //   $scope.filterObject['to_date'] = undefined
        // }

        $scope.shopingCardLoad1 = true;
        $scope.shopingCardLoad2 = true;
        $scope.totalCardItemss50 = 0;
        $scope.totalCardItemss100 = 0;
        $scope.totalCards50 = 0;
        $scope.totalCards100 = 0;
        $scope.range50 = [];
        $scope.range100 = [];
        $scope.firstPage50 = 6;
        $scope.firstPage100 = 6;
        $scope.itemsPerPage = 6;
        $scope.currentPage50 = 1;
        $scope.currentPage100 = 1;
        $scope.loadMore();
      }

      $scope.clearSearch = function() {
        $scope.searchValue = "";
        $scope.searchFrom = "";
        $scope.searchTo = "";
        angular.element('.form-control').val('')
        $scope.shopingCardLoad1 = true;
        $scope.shopingCardLoad2 = true;
        $scope.totalCardItemss50 = 0;
        $scope.totalCardItemss100 = 0;
        $scope.totalCards50 = 0;
        $scope.totalCards100 = 0;
        $scope.range50 = [];
        $scope.range100 = [];
        $scope.firstPage50 = 6;
        $scope.firstPage100 = 6;
        $scope.itemsPerPage = 6;
        $scope.currentPage50 = 1;
        $scope.currentPage100 = 1;
        $scope.filterObject = {
          "citizen_id":(APP.currentUser.id).toString(),
          "balance":{
            "$gt":0
          }
        };
        $scope.loadMore();
      }
    }
  }
}]);

app.directive('coupon', ['$http', 'CitizenWallet', 'focus', 'DateToMongoDate', function($http, CitizenWallet, focus, DateToMongoDate) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/citizen_coupon.html',
    scope : true,
    link: function (scope){
      
    },
    controller : function ($scope){
      $('.dateInput').datepicker({dateFormat: 'dd-mm-yy'});
      $scope.predicate = 'to_date';
      $scope.reverse = false;
      $scope.citizenCouponLoader = true;
      $scope.noCitizenCouponFound = true;
      $scope.firstPage = APP.walletItemPerPage.perPage;
      $scope.itemsPerPage = APP.walletItemPerPage.perPage;
      $scope.currentPage = 1;
      $scope.range = [];
      $scope.totalCoupon = 0;
      $scope.fiveStar = [1,2,3,4,5];
      $scope.loadingCitizenCouon = false;
      $scope.startDate = $scope.i18n.citizen_wallet.from;
      $scope.endDate = $scope.i18n.citizen_wallet.to;
      $scope.filterObject = {
        "credit":{
        "$gt":0
        },
        "balance":{
        "$gt":0
        },
        "citizen_id":(APP.currentUser.id).toString(),
        "type":"551ce49e2aa8f00f20d9328f" //Fixed for citizen wallet
      }

      $scope.changePageMore = function(pageNo) {
          $scope.currentPage = pageNo;
          $scope.loadMore();
      };

      $scope.prevPage = function() {
          if ($scope.currentPage > 1) {
              $scope.currentPage--;
          }
          $scope.loadMore();
      };

      $scope.prevPageDisabled = function() {
          return $scope.currentPage === 1 ? "disabled" : "";
      };

      $scope.nextPage = function() {
          if ($scope.currentPage < $scope.totalItems) {
              $scope.currentPage++;
          }
         $scope.loadMore();
      };

      $scope.nextPageDisabled = function() {
          return $scope.currentPage === $scope.totalItems ? "disabled" : "";
      };

      $scope.loadMore = function(){
        var limit_start = ($scope.currentPage-1)*$scope.itemsPerPage;
        $scope.loadingCitizenCouon = true;
        //prepare query for getting the coupons list
        var query = {
          "my_wallet_coupons":{
            "$collection":(APP.applaneTables.citizenWallet),
            "$fields":{
              "credit":1,
              "discount":1,
              "shop_id.name":1,
              "shop_id.address_l1":1,
              "shop_id.address_l2":1,
              "shop_id.city":1,
              "shop_id.country":1,
              "shop_id.average_anonymous_rating":1,
              "shop_id.latitude":1,
              "shop_id.longitude":1,
              "shop_id.mobile_no":1,
              "shop_id.region":1,
              "shop_id.province":1,
              "shop_id.zip":1,
              "shop_id.streetaddress":1,
              "shop_id.email_address":1,
              "shop_id.web_address":1,
              "from_date":1,
              "to_date":1,
              "balance":1
            },
            "$filter":$scope.filterObject,
            "$sort":{
              "to_date":1
            },
            "$limit":$scope.itemsPerPage,
            "$skip":limit_start
          },
          "my_wallet_coupons_count":{
            "$collection":(APP.applaneTables.citizenWallet),
            "$group":{
              "count":{
                "$sum":1
              },
              "_id":null,
              "$fields":false
            },
            "$filter":$scope.filterObject
          }
        };

        CitizenWallet.getCitizenWalletCoupons(query, function(data) {
          $scope.loadingCitizenCouon = false;
          $scope.citizenCouponLoader = false;
          if(data.status === 'ok' && data.code === 200) {
            if((data.response.my_wallet_coupons.result).length) {
              $scope.shopCoupons = data.response;
              $scope.totalCoupon = data.response.my_wallet_coupons_count.result[0].count;
              $scope.totalItems = Math.ceil($scope.totalCoupon/$scope.itemsPerPage); 
              $scope.range = [];  
              for (var i=1; i<=$scope.totalItems; i++) {
                  $scope.range.push(i);
              }
            } else {
              $scope.shopCoupons = [];
              $scope.totalCoupon = 0;
              $scope.totalItems = 0; 
              $scope.range = [];  
            }
            $scope.noCitizenCouponFound = false;
          } else {
            $scope.noCitizenCouponFound = true;
            $scope.shopCoupons = [];
          }
        }); 
      }; 

      $scope.loadMore();

      $scope.searchCoupons = function() {
        if($scope.searchText !== undefined && $scope.searchText.length > 0) {
          $scope.filterObject['$or'] = [{"shop_id.name":{$regex: $scope.searchText, $options: 'i'}},{"offer_id.keywords.name":{$regex: $scope.searchText, $options: 'i'}}];
        } else {
          $scope.filterObject['$or'] = undefined;
        }

        $scope.filterObject["to_date"] = {};
        for( var i=0; i<$('.form-control').length;i++){
          if(angular.element('.form-control')[i].getAttribute('is-open') === 'opened1' && angular.element(angular.element('.form-control')[i]).val().length > 0){
            $scope.filterObject.to_date['$gte'] = DateToMongoDate.dateToIso(angular.element(angular.element('.form-control')[i]).val());
          }
          if(angular.element('.form-control')[i].getAttribute('is-open') === 'opened2' && angular.element(angular.element('.form-control')[i]).val().length > 0){
            $scope.filterObject.to_date['$lte'] = DateToMongoDate.dateToIso(angular.element(angular.element('.form-control')[i]).val());
          }
        }
        if($scope.filterObject.to_date['$gte'] === undefined && $scope.filterObject.to_date['$lte'] === undefined){
          $scope.filterObject["to_date"] = undefined;
        }

        // if(($scope.fromDate !== undefined && $scope.fromDate.length > 0) && ($scope.toDate !== undefined && $scope.toDate.length > 0)) {
        //   $scope.filterObject.to_date = {"$gte":DateToMongoDate.dateToIso($scope.fromDate), "$lte":DateToMongoDate.dateToIso($scope.toDate)};
        // } else if(($scope.fromDate !== undefined && $scope.fromDate.length > 0) && ($scope.toDate === undefined || $scope.toDate.length === 0) && $scope.fromDate.length>0) {
        //   $scope.filterObject["to_date"] = {"$gte":DateToMongoDate.dateToIso($scope.fromDate)};
        //   //$scope.filterObject["to_date"] = {"$lte": undefined};
        // } else if(($scope.toDate !== undefined && $scope.toDate.length > 0) && ($scope.fromDate === undefined || $scope.fromDate.length === 0) && $scope.toDate.length>0) {
        //   $scope.filterObject["to_date"] = {"$lte":DateToMongoDate.dateToIso($scope.toDate)};
        //   //$scope.filterObject["to_date"] = {"$gte": undefined};
        // } else {
        //   $scope.filterObject["to_date"] = undefined;
        // }

        $scope.currentPage = 1;
        $scope.range = [];
        $scope.loadMore();          
      };

      $scope.clearSearch = function() {
        $scope.filterObject = {};
        $scope.searchText = undefined;
        $scope.fromDate = undefined;
        $scope.toDate = undefined;
        angular.element('.form-control').val('')
        $scope.filterObject = {
          "credit":{
          "$gt":0
          },
          "balance":{
          "$gt":0
          },
          "citizen_id":(APP.currentUser.id).toString(),
          "type":"551ce49e2aa8f00f20d9328f" //Fixed for citizen wallet
        }
        $scope.currentPage = 1;
        $scope.range = [];
        $scope.loadMore();
      };

      $scope.ratingConvert = function(rate, count){
        var rateArray = []
        if (count){
          rate = rate ? rate : 0;
          if(rate-Math.floor(rate)>0) count-=1;
          for(var i=0;i<count-Math.floor(rate);i++){
            rateArray.push(i);
          }
          return rateArray;
        }

        if(rate){
          rate = Math.floor(rate);
          for(var i=0;i<rate;i++){
            rateArray.push(i);
          }
          return rateArray;
        }
      }

      $scope.convertToInt =function(floatVal){
        return Math.floor(floatVal);
      }
    }
  }
}]);

//Directive to manage the citizen wallet history
app.directive('transactionHistory', ['$http', 'CitizenWallet', '$rootScope', function($http, CitizenWallet, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/citizen_transaction_history.html',
    scope : true,
    link: function (scope){
      
    },
    controller : function ($scope){
      $scope.oneAtATime = true;
      $scope.trans_history = [
        {
          date : new Date(2011,6,20).toDateString(),
          credit_recevied : 10000,
          credit_used : 100,
          credit_type :" a Credito sixth continent",
        },
         {
          date : new Date(2002,7,31).toDateString(),
          credit_recevied : 1000,
          credit_used : 200,
          credit_type :" b Credito sixth continent",
        },
         {
          date : new Date(2002,9,31).toDateString(),
          credit_recevied : 100000,
          credit_used : 10,
          credit_type :"a Credito sixth continent",
        },
         {
          date : new Date(2102,7,31).toDateString(),
          credit_recevied : 100,
          credit_used : 10000,
          credit_type :"bb Credito sixth continent",
        },
         {
          date : new Date(2002,7,6).toDateString(),
          credit_recevied : 1000000,
          credit_used : 100,
          credit_type :"cc Credito sixth continent",
        },
      ]
      //open the content of the lable 
      $scope.openContnetDetail = function() {
        $scope.detailContent = "Hello Guys";
      }

      $scope.getIncome = function(){
          var incomeReq =  {
            "$collection": "sixc_bucks",
            "$filter": {
                "citizen_id": (APP.currentUser.id).toString(),
            },
            "$group": {
                "_id": null,
                "amount": {
                    "$sum": "$amount"
                },
                "debit": {
                    "$sum": "$debit"
                },
                "credit": {
                    "$sum": "$credit"
                }
            }
          };
          CitizenWallet.getCitizenIncome(incomeReq,function(data){
              if(data.response.result.length > 0){
                $rootScope.citizenAvailableBalance = data.response.result[0].amount;
              }else{
                $rootScope.citizenAvailableBalance = 0.00;
              }
          });
      };

      if(!$rootScope.citizenAvailableBalance){
          $scope.getIncome();
      }
      
      $scope.historyLoader = false;
      $scope.historyLimit = 10;
      $scope.skip = 0;
      $scope.firstLoad = true;
      $scope.getCitizenHistory = function() {
        if($scope.firstLoad === true){
          $scope.historyLoader = true;
          $scope.firstLoad = false;
        }else{
          $scope.paginationLoader = true;
        }
        var historyReq = {
          "citizenWalletHistoryRecord":{
            "$collection":APP.applaneTables.sixc_bucks_wallet,
            "$group":{
              "_id": {
                "record_from": "$record_from",
                "group_column": "$group_column",
                 "date":{"date":{"$dayOfMonth":"$date"},
                  "month":{"$month":"$date"},
                  "year":{"$year":"$date"}},
              },
              "$filter": {
                "credit": {
                  "$gt": 0
                }
              },
              "shop_id":{
                "$first" : "$shop_id"
              },
              "record_from": {
                "$first": "$record_from"
              },
              "group_column": {
                "$first": "$group_column"
              },
              "citizen_transaction_id": {
                "$first": "$citizen_transaction_id"
              },
              "credit": {
                "$sum": "$credit"
              },
              "transaction_value": {
                "$sum": "$transaction_value"
              },
              "date": {"$first": "$date"},
              "$fields": false,
               "$sort":{
                    "date":-1
                }
            },
            "$filter":{
              "group_column":{"$nin":["Shopping Card Upto 50%",
                "Shopping Card Upto 100%","Coupon"]
              },
              "record_from":{
                "$exists":true
              },
              "citizen_id": APP.currentUser.id.toString()
            },
            "$limit" : $scope.historyLimit,
            "$skip":$scope.skip
         },
          /*
          "citizenWalletHistoryCount":{
            "$collection": APP.applaneTables.sixc_bucks_wallet,
              "$group":[
                 {
                  "_id":{
                    "record_from":"$record_from",
                    "group_column":"$group_column",
                     "date":{"date":{"$dayOfMonth":"$date"},
                  "month":{"$month":"$date"},
                  "year":{"$year":"$date"}},
                  },
                  "$filter":{
                    "credit":{
                      "$gt":0
                    }
                  },
                  "record_from":{
                    "$first":"$record_from"
                  },
                  "group_column":{
                    "$first":"$group_column"
                  },
                  "citizen_transaction_id":{
                    "$first":"$citizen_transaction_id"
                  },
                  "credit":{
                    "$sum":"$credit"
                  },
                  "transaction_value":{
                    "$sum":"$transaction_value"
                  },
                   "date": {"$first": "$date"},
                    "$fields":false
                },
                {
                  "_id":null,
                  "count":{
                    "$sum":1
                  }
                }
              ],
              "$filter":{
                "group_column":{"$nin":["Shopping Card Upto 50%25",
                  "Shopping Card Upto 100%25","Coupon"]
                },
                "record_from":{
                  "$exists":true
                },
              "citizen_id":APP.currentUser.id.toString()
              }
            }*/
            "citizenWalletHistoryCount" : {
              "$collection": APP.applaneTables.sixc_bucks_wallet,
              "$group":[{
                "_id": {
                  "record_from": "$record_from",
                  "group_column": "$group_column",
                  "date":{
                    "date":{
                      "$dayOfMonth":"$date"
                    },
                    "month":{
                      "$month":"$date"
                    },
                    "year":{
                      "$year":"$date"
                    }
                  }
                },
                "$filter": {
                  "credit": {
                    "$gt": 0
                  }
                },
                "record_from": {
                  "$first": "$record_from"
                },
                "group_column": {
                  "$first": "$group_column"
                },
                "citizen_transaction_id": {
                  "$first": "$citizen_transaction_id"
                },
                "credit": {
                  "$sum": "$credit"
                },
                "transaction_value": {
                  "$sum": "$transaction_value"
                },
                "date": {
                  "$first": "$date"
                },
                "$fields": false
              },
              {
                "_id":null,
                "count":{
                  "$sum":1
                }
              }
              ],
              "$filter":{
                "group_column":{
                  "$nin":["Shopping Card Upto 50%","Shopping Card Upto 100%","Coupon"]
                },
                "record_from":{
                  "$exists":true
                },
                "citizen_id":APP.currentUser.id.toString()
              }
            }
        };

        CitizenWallet.getCitizenWalletHistory(historyReq, function(data) {
          if(data.status === "ok" && data.code == 200){
            $scope.citizenHistory = data.response.citizenWalletHistoryRecord.result;
            $scope.historyLoader = false;
            /*if(data.response.result.length > 0){
                $scope.list = 0;
                $scope.range = [];                
            }*/
            
            if(data.response.citizenWalletHistoryCount.result.length > 0){
              if(data.response.citizenWalletHistoryCount.result[0].count > $scope.itemsPerPage){
                $scope.list = 0;
                $scope.range = [];
                $scope.pagination = true;
                $scope.paginationLoader = false;
                $scope.list = data.response.citizenWalletHistoryCount.result[0].count - 1;
                for (var i = 0; i < $scope.list/$scope.itemsPerPage; i++) {
                  $scope.range.push(i);
                };
              }
            }
          }else{
            $scope.pagination  = false;
            $scope.list = 0;
            $scope.range = [];
            $scope.historyLoader = false;
          }
        });
        
      };
      $scope.getCitizenHistory();

      $scope.currentDate = new Date();

      $scope.itemsPerPage = 10;
      $scope.currentPage = 0;
      $scope.pagination = false;
      $scope.list = 0;
      $scope.range = [];
      $scope.historyLimit = 10;
      $scope.skip = 0;
      $scope.prevPage = function(page) {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
          $scope.loadMoreHistory($scope.currentPage);
        }
      };

      $scope.loadMoreHistory = function(index){
        if(index !== 0){
          $scope.skip = (index - 1) * $scope.itemsPerPage;
        }else{
          $scope.skip = 0;
        }
        $scope.historyLimit = $scope.itemsPerPage;
        $scope.getCitizenHistory();
      };

      $scope.prevPageDisabled = function() {
          return $scope.currentPage === 0 ? "disabled" : "";
      };

      $scope.pageCount = function() {
          if ($scope.list !== undefined) {
              return Math.ceil($scope.list/$scope.itemsPerPage)-1;
          }
      };

      $scope.nextPage = function(page) {
          if ($scope.currentPage < $scope.pageCount()) {
              $scope.currentPage++;
              $scope.loadMoreHistory($scope.currentPage + 1);
          }
      };

      $scope.nextPageDisabled = function() {
          return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
      };

      $scope.setPage = function(n) {
          $scope.currentPage = n;
      };

    }
  }
}]);