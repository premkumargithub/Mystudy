//Displaying the profile notfication
app.directive('shopWalletTab', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/shop_wallet_tab.html'
  }
});

//Displaying the profile notfication
app.directive('shopWalletPayment', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/shop_wallet_payment.html'
  }
});

//Displaying the profile notfication
app.directive('shopWalletSale', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/shop_wallet_sale.html'
  }
});

//Display the shop wallet shopping card
app.directive('shopWalletShoppingCard', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/shop_wallet_shopping_card.html'
  }
});

//Display the shop wallet coupon
app.directive('shopWalletCoupon', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/shop_wallet_coupon.html'
  }
});

//Display the shop wallet history
app.directive('shopWalletHistory', ['$http', 'StoreWalletService', '$routeParams', 'DateToMongoDate', function($http, StoreWalletService, $routeParams, DateToMongoDate) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/shop_wallet_history.html',
    controller: function ($scope) {
      $('.dateInput').datepicker({dateFormat: 'dd-mm-yy'});
      $scope.predicate = 'date';
      $scope.shopId = $routeParams.id;
      $scope.reverse = false;
      $scope.loadingShopHistory = true;
      $scope.nothingFound = false;
      $scope.searchStart = false;
      $scope.firstPage = APP.walletItemPerPage.perPage;
      $scope.itemsPerPage = APP.walletItemPerPage.perPage;
      $scope.currentPage = 1;
      $scope.range = [];
      $scope.totalHitory = 0;
      $scope.totalItems = 0;
      $scope.shopWalletHistories = [];
      $scope.filterObject = {
        "discount_details.card_no":{
          "$exists":true
        },
        "status":"Approved",
        //Fixed for applane request they managed at their end
        "transaction_type_id": {
          "$in": [
          "553209267dfd81072b176bba",
          "553209267dfd81072b176bbc",
          "553209267dfd81072b176bb6",
          "553209267dfd81072b176bb8"
          ]
        },
        "shop_id":$scope.shopId
      };

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
        $scope.searchStart = true;
        var limit_start = ($scope.currentPage-1)*$scope.itemsPerPage;
        var query = {
          "shop_wallet_history":{
            "$collection":(APP.applaneTables.sixc_transactions),
            "$fields":{
              "date":1,
              "discount_details.amount":1,
              "discount_details.type":1,
              "discount_details.card_id":1,
              "citizen_id":1
            },
            "$filter":$scope.filterObject,
            "$unwind":["discount_details"],
            "$sort":{
              "date": -1
            },
            "$limit":$scope.itemsPerPage,
            "$skip":limit_start
          },
          "shop_wallet_history_count":{
            "$collection":(APP.applaneTables.sixc_transactions),
            "$group":{
              "count":{
                "$sum":1
              },
              "_id":null,
              "$fields":false
            },
            "$filter":$scope.filterObject,
            "$unwind":["discount_details"]
          }
        };

        StoreWalletService.getShopWalletHistory(query, function(data) {
          $scope.loadingShopHistory = false;
          $scope.searchStart = false;
          if(data.status === 'ok' && data.code === 200) {
            if((data.response.shop_wallet_history.result).length) {
              $scope.shopWalletHistories = data.response.shop_wallet_history.result;
              $scope.totalHitory = data.response.shop_wallet_history_count.result[0].count;
              $scope.totalItems = Math.ceil($scope.totalHitory/$scope.itemsPerPage); 
              $scope.range = [];  
              for (var i=1; i<=$scope.totalItems; i++) {
                  $scope.range.push(i);
              }
            } else {
              $scope.shopWalletHistories = [];
              $scope.totalHitory = 0;
              $scope.totalItems = 0; 
              $scope.range = [];  
            }
          } else {
            $scope.shopWalletHistories = [];
            $scope.nothingFound = true;
          }
        });
      }  

      $scope.loadMore(); 

      $scope.searchCitizen = function() {
        if($scope.searchText !== undefined && $scope.searchText.length > 0) {
          $scope.filterObject['$or'] = [{"citizen_id.name":{$regex: $scope.searchText, $options: 'i'}},{"citizen_id._id":{$regex: $scope.searchText, $options: 'i'}}];
        } else {
          $scope.filterObject['$or'] = undefined;
        }
        if(($scope.fromDate !== undefined && $scope.fromDate.length > 0) && ($scope.toDate !== undefined && $scope.toDate.length > 0)) {
          $scope.filterObject["date"] = {"$gte":DateToMongoDate.dateToIso($scope.fromDate), "$lte":DateToMongoDate.dateToIso($scope.toDate)};
        } else if(($scope.fromDate !== undefined && $scope.fromDate.length > 0) && ($scope.toDate === undefined || $scope.toDate.length === 0) && $scope.fromDate.length>0) {
          $scope.filterObject["date"] = {"$gte":DateToMongoDate.dateToIso($scope.fromDate)};
        } else if(($scope.toDate !== undefined && $scope.toDate.length > 0) && ($scope.fromDate === undefined || $scope.fromDate.length === 0) && $scope.toDate.length>0) {
          $scope.filterObject["date"] = {"$lte":DateToMongoDate.dateToIso($scope.toDate)};
        } else {
          $scope.filterObject["date"] = undefined;
        }

        $scope.currentPage = 1;
        $scope.range = [];
        $scope.loadMore(); 
      } 

      $scope.clearSearch = function() {
        $scope.filterObject = {};
        $scope.searchText = undefined;
        $scope.fromDate = undefined;
        $scope.toDate = undefined;
        $scope.filterObject = {
          "discount_details.card_no":{
            "$exists":true
          },
          "status":"Approved",
          //Fixed for applane request they managed at their end
          "transaction_type_id": {
            "$in": [
            "553209267dfd81072b176bba",
            "553209267dfd81072b176bbc",
            "553209267dfd81072b176bb6",
            "553209267dfd81072b176bb8"
            ]
          },
          "shop_id":$scope.shopId
        };
        $scope.currentPage = 1;
        $scope.range = [];
        $scope.loadMore();
      }

    }
  }
}]);

//Display the shop wallet sale history
app.directive('shopWalletSaleHistory', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/views/shop_wallet_sale_history.html'
  }
});

//Display the shop wallet credit card listing
app.directive('shopWalletCreditCards', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/shop_wallet_credit_cards.html'
  }
});

//Display the shop wallet paypal account listing
app.directive('shopWalletPaypalAccounts', function() {
  return {
    restrict: 'E',
     templateUrl: 'app/views/shop_wallet_paypal_accounts.html'
  }
});