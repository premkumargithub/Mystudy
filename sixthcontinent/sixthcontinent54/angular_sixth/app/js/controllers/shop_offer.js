app.controller('shopOfferController', ['$scope', '$routeParams', 'OfferService', 'StoreService', '$timeout', function($scope, $routeParams, OfferService, StoreService, $timeout) {
	$scope.isLoadingwallet = false;
	$scope.storeId = $routeParams.id;
	$scope.citizenIncome = 0;
	$scope.gridActive 	 = '';
  	$scope.listActive 	 = 'active';
  	$scope.offer_type	 = 'card';
  	$scope.firstPage  	 = 10;
    $scope.itemsPerPage  = 10;
    $scope.range = []; 
    $scope.shop_id = [];

	$scope.getCitizenIncome = function(){
        var opts = {};
            opts["$collection"] = "sixc_bucks";
            opts["$filter"] = {"citizen_id" : String(APP.currentUser.id)};
            opts["$group"] = {"_id":null,"amount":{"$sum":"$amount"},"debit":{"$sum":"$debit"},"credit":{"$sum":"$credit"}};

        OfferService.getApplaneData(opts, function(data){
            if(data.status === "ok" && data.code === 200){
                if(data.response.result.length > 0){
                    if(data.response.result[0].amount != null){
                        $scope.citizenIncome = data.response.result[0].amount;
                    }
                }
            }
        });
    };
    $scope.getCitizenIncome();

    $scope.getcount = function(itemsPerPage){
        var opt = {};
            opt["$collection"] = "sixc_offers";
            var filter = {};
                filter["offer_type"] = $scope.offer_id;
                filter["shop_id"] = $scope.storeId;
            opt["$filter"] = filter;
            opt["$group"] = {"count":{"$sum":1},"_id":null};
            OfferService.getApplaneData(opt, function(data){
                if(data.status === "ok" && data.code === 200){
                    if(data.response.result.length > 0){
                        $scope.totalItems = Math.ceil(data.response.result[0].count/itemsPerPage); 
                        $scope.range = [];  
                        for (var i=1; i<=$scope.totalItems; i++) {
                            $scope.range.push(i);
                        }             
                    }
                }
            });
    };

    $scope.frindBoughtCount = function() {       
        var opts = {};
        opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":$scope.shop_id,"citizen_id":String(APP.currentUser.id)}]}
        //calling the comment service to delete the selected comment 
        StoreService.frindboughtcount(opts, function(data){
            if(data.response === undefined || data.response === ''){
                $scope.frcount = [];
            } else {
                $timeout(function() {
                    $scope.$apply(function(){
                        $scope.frcount = data.response;   
                    });    
                }, 0);   
            }
        });
    };

    var option = {};
        option["$collection"] = "sixc_offers";
    
    $scope.getlistingData = function(itemsPerPage){
        $scope.range = []; 
        $scope.shop_id = [];
        $scope.noResultFound = false;
        $scope.offerlodar  = true;
        $scope.offerlistingObject = [];
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        var filter  = {};
            filter["offer_type"] = $scope.offer_id;
            filter["shop_id"] = $scope.storeId;
            filter["start_date"] = {"$lte":"$$CurrentDate"};
            filter["end_date"]   = {"$gte":"$$CurrentDate"};
        option["$limit"]   = itemsPerPage;
        option["$skip"]    = limit_start;
        option["$filter"]  = filter;

        OfferService.getApplaneData(option, function(data){
            $scope.offerlodar  = false;
            if(data.status === "ok" && data.code === 200){
                if(data.response.result.length > 0){
                    $scope.noResultFound = false;
                    $scope.offerlistingObject = data.response.result;
                    $scope.offerlistingObject.forEach(function(val,index){
                        $scope.shop_id.push(val.shop_id._id);
                    });
                    $scope.frindBoughtCount();
                    $scope.getcount(itemsPerPage);
                }else{
                    $scope.noResultFound = true;
                }
            }else{
               $scope.noResultFound = true;
            }
        });
    };

    $scope.OfferChange = function(type){
    	$scope.offer_type = type;
        if(type === 'card'){
            $scope.offer_id  = "551ce49e2aa8f00f20d93295";
        }else{
           $scope.offer_id   = "551ce49e2aa8f00f20d9328f";
        }
        $scope.getlistingData($scope.itemsPerPage);
    };

    $scope.OfferChange($scope.offer_type);
	
    $scope.getfrndlist = function(event,shopid){    
        $scope.friendlist = [];
        $scope.nofndlist = false;
        if( $(event.target).nextAll('ul.friend-list:first').is(':visible')){
             $(event.target).nextAll('ul.friend-list:first').hide();
        }else{
            $scope.frndlistloader = true;
            $(event.target).nextAll('ul.friend-list:first').show();
            var formData = {};
                formData.user_id = APP.currentUser.id;
                formData.shop_id = shopid;
            $scope.friendlist = [];
            //calling the comment service to delete the selected comment 
            StoreService.getfriendboughtonstores(formData, function(data){
                $scope.frndlistloader = false;
                if(data.code === 101 && data.data.friends.length > 0) {
                    $scope.nofndlist = false;
                    $scope.friendlist = data.data.friends;
                }else{
                    $scope.nofndlist = true;
                }
            });
        }
    };

    $scope.changePageMore = function(pageNo) {
        $scope.currentPage = pageNo;
        $scope.getlistingData($scope.itemsPerPage);
    };
    
    $scope.calculateprice = function(val,dis){
        var halfprice = val/2 ;
        var obc = {};
           obc.price_purchase = (val - (val * dis)/100); 
           obc.price_sixth    = halfprice;
        if($scope.citizenIncome < halfprice){
           obc.price_sixth    = $scope.citizenIncome; 
        }
           obc.onlyForYou    = obc.price_purchase - obc.price_sixth;
        return obc;
    };

    $scope.changeView = function(layout) {
        if(layout == 'grid'){
            $scope.gridActive = 'active'; 
            $scope.listActive = ''; 
        }else if(layout == 'list'){
            $scope.listActive = 'active'; 
            $scope.gridActive = '';
        }
    };

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        $scope.getlistingData($scope.itemsPerPage);
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 1 ? "disabled" : "";
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
        $scope.getlistingData($scope.itemsPerPage);
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalItems) {
            $scope.currentPage++;
        }
        $scope.getlistingData($scope.itemsPerPage);
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.paginate = function() {
       $scope.currentPage = 1; 
    }

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.buyCoupon = function(index, id){
        $scope['buyCouponbtn' + index]   = 1;
        $scope['buyCouponloder' + index] = true;

        var opts = {};
           opts = {"function" : "ApplyCouponBL.applyCoupon","parameters":[{"offer_id": String(id),"citizen_id":String(APP.currentUser.id)}]};
      
        OfferService.getApplaneInvoke(opts, function(data){
            if(data.response === undefined || data.response === ''){
                $scope['buyCouponErr' + index] = true;
            }else{
                if(data.status === "ok" && data.code === 200){
                    $scope['buyCouponSuccess' + index] = true;
                }else if (data.response === "Coupon is already purchased"){
                    $scope['buyCouponalready' + index] = true;
                }else{
                    $scope['buyCouponErr' + index] = true;
                }
            }
            $scope['buyCouponloder' + index] = false;
            $timeout(function() {
                $scope['buyCouponbtn' + index]     = 0;
                $scope['buyCouponloder' + index]   = false;
                $scope['buyCouponSuccess' + index] = false;
                $scope['buyCouponErr' + index]     = false;
                $scope['buyCouponalready' + index] = false;    
            }, 8000); 
        });
    };


}]);