app.controller('CardController', ['$scope', 'OfferService', '$routeParams', 'StoreService', '$timeout', '$cookieStore', 'ProfileService', function($scope, OfferService, $routeParams, StoreService, $timeout, $cookieStore, ProfileService) {
    var map;
    var geocoder;
    geocoder = new google.maps.Geocoder();
    var markers          = [];
    $scope.latitute      = 41.9000;
    $scope.longitude     = 12.4833;
    $scope.Default_lat   = 41.9000;
    $scope.Default_long  = 12.4833;
    $scope.Shopid_loc    = [];
    $scope.selectedRange = 50;
    $scope.gridActive    = '';
    $scope.listActive    = 'active';
    $scope.locationSearch= false;
    $scope.filterme      = '';
    $scope.orderBy       = '';
    $scope.firstPage     = 10;
    $scope.itemsPerPage  = 10;
    $scope.currentPage   = 1;
    $scope.totalItems    = 0;
    $scope.range         = []; 
    $scope.offerlodar    = true;
    $scope.noResultFound = false;
    $scope.offerlistingObject = [];
    $scope.citizenIncome = 0;
    $scope.shop_id       = [];
    $scope.map_pins      = [];
    $scope.frcount       = [];
    $scope.friendlist    = [];
    $scope.categories    = [];
    $scope.sortby        = "_id";
    $scope.nofndlist     = false;
    $scope.currentLanguage = $cookieStore.get("activeLanguage");
    $scope.searchResult  = false;
    $scope.iscomingSoon  = false;
    $scope.collection    = "sixc_offers";
    var openedInfoWindow = null;

    $scope.format = function(n, currency) {
        n = Number(n);
        return currency + "" + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }

    $scope.getstorecredit = function(storeId) { 
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yr = today.getFullYear();
        var date = new Date(yr,mm,dd);
        var opts = {"function":"UtilityService.shopWiseCitizenIncome", "parameters":[{"shop_id":[storeId],"citizen_id":String(APP.currentUser.id),"date":String(date.toISOString())}]}
        StoreService.getstorecredit(opts, function(data){
            if(data.response === undefined || data.response === '' || data.response.length === 0){} else {
                $('.ca-html').html($scope.format(data.response[0].total_credit, '€'));
            }
        });
    };

    $scope.initializeMap = function(){
        var centerLatLng = new google.maps.LatLng($scope.latitute,$scope.longitude);
        var input = (document.getElementById('pac-input'));
        
        var mapProp = {
            center      : centerLatLng,
            zoom        : 7,
            mapTypeId   : google.maps.MapTypeId.ROADMAP
        };
             
        map = new google.maps.Map(document.getElementById('map-canvas'), mapProp);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var searchBox = new google.maps.places.SearchBox((input));
        
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            var address = document.getElementById('pac-input').value;
            geocoder.geocode({ 'address': address}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    $scope.locationSearch= true;
                    $scope.latitute      = results[0].geometry.location.lat();
                    $scope.longitude     = results[0].geometry.location.lng();
                    $scope.geolocation();
                }
            });    
        });    

        google.maps.event.addListener(map, 'click', function(e) {
            var geocoder = new google.maps.Geocoder();
             geocoder.geocode({"latLng":e.latLng}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var placeName = results[0].formatted_address;
                    document.getElementById('pac-input').value = placeName;
                }
            });         
            $scope.locationSearch= true;
            $scope.latitute      = e.latLng.lat();
            $scope.longitude     = e.latLng.lng();
            $scope.geolocation();
        });

        markers = []; 

        $scope.map_pins.forEach(function(data){
            if(data.latitude != undefined && data.longitude != undefined ){
                var markerpos = new google.maps.LatLng(data.latitude,data.longitude);
                var marker = new google.maps.Marker({
                    position:markerpos,
                    map: map
                });
                markers.push(marker);
                var votestructure = "";
                var num = parseFloat(data.vote).toFixed(1);
                for(var k = 0; k < 5; k++){
                    if((num <= (k+0.5)) && (num > (k+0.0))){
                        votestructure += "<li class='half'></li>";
                    } else if(num >= (k+0.6)){
                        votestructure += "<li class='active'></li>";
                    } else {
                        votestructure += "<li></li>";   
                    }
                }
                var pic = "<img src='app/assets/images/store-prod.jpg'>";
                if(data.pic !== ""){
                    pic = "<img src='"+ data.pic +"'>";
                }

                var mapfrndcount = "<img src='app/assets/images/group-count.png'><span class='number map-frnd-count-number'>0</span>";
                
                var infowindow = new google.maps.InfoWindow();
                var content = "<div class='offermapinfo-block'><div class='pic-container'>" + pic + "</div><div class='description'><div class='map-frnd-count'>"+mapfrndcount+"</div><div class='offer-map-heading'><a href='#/shop/view/"+data.id+"'>"+data.name+"</a></div><div><div class='vote-count'><ul>"+votestructure+"</ul></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span class='ca-html'>0€</span></div><div class='categories'>"+ data.cat +"</div></div>";
                google.maps.event.addListener(marker, 'click', (function(marker, content) {
                    return function() {
                       if (openedInfoWindow != null) openedInfoWindow.close();
                       $scope.getstorecredit(data.id);  
                       $scope.frindBoughtCount(data.id);
                       infowindow.setContent(content);
                       infowindow.open(map, marker);
                       openedInfoWindow = infowindow;
                       google.maps.event.addListener(infowindow, 'closeclick', function() {
                           openedInfoWindow = null;
                       });
                    };
                })(marker,content));  
            }
        });
    };

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.latitute      = position.coords.latitude;
            $scope.longitude     = position.coords.longitude;
            $scope.Default_lat   = position.coords.latitude;
            $scope.Default_long  = position.coords.longitude;
            $scope.initializeMap();
        },function() {
          //The Geolocation service failed.
        });
    }
    
    if($routeParams.id === "1"){
        if($scope.i18n.left_menu != undefined){
            $scope.offerDropdownVal = $scope.i18n.left_menu.offer_card;
        }else{
            $scope.offerDropdownVal = "Shopping card";
        } 
    }else{
        if($routeParams.id === "3"){
            $scope.filterme   = 'selected';
            $scope.collection = "sixc_citizen_offers";
        }
        if($scope.i18n.left_menu != undefined){
            $scope.offerDropdownVal = $scope.i18n.left_menu.offer_coupons;
        }else{
            $scope.offerDropdownVal = "Coupons";
        } 
    }    
   
    $scope.offerDropdown = ['Shopping card','Coupons','Promotions E-commerce'];
    
    $scope.ConvertCategory = function(id){
        var cat = "";
        $scope.categories.forEach( function (Item)
        {
            if(String(Item.id) === id){
                cat = Item.category_name;
            }
        });
        return cat;
    };

    $scope.fireSearch = function(event){
        if(event.which === 13) {
            $scope.getlistingData($scope.itemsPerPage);
        }    
    };

    $scope.removepins = function(){
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };

    $scope.searchCategory = function(currentLanguage){
        $scope.categories = [];
        var opts = {};
            opts.lang_code  = currentLanguage;
            opts.session_id = APP.currentUser.id;
        
        ProfileService.searchCatagory(opts,function(data){
            if(data.code === 101 && data.message === 'SUCCESS'){
                if(data.data.length > 0){
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.categories = data.data;
                        });    
                    }, 0);    
                }
            }
        });
    };
    
    // creating category drop down
    $scope.$watch('currentLanguage', function(newValue, oldValue) {
        $scope.searchCategory(newValue);
    });

    $scope.changeCat = function(){
       // $scope.collection    = "sixc_offers";
        $scope.getlistingData($scope.itemsPerPage);
    };

    $scope.OfferChange = function(){
        if($scope.offerDropdownVal === $scope.i18n.offer_shoppingcard.promotion){
            $scope.iscomingSoon = true;
            $scope.offerlistingObject = [];
            $scope.range = []; 
            $scope.noResultFound = false;
            $scope.removepins();
        }else{
            $scope.iscomingSoon = false;
            if($scope.offerDropdownVal === $scope.i18n.left_menu.offer_card){
                $scope.Offercard   = 'selected';
                $scope.Offercoupon = '';
                $scope.offer_id    = "551ce49e2aa8f00f20d93295";
                $scope.offer_type  = "Card";
            }else{
                $scope.Offercard   = '';
                $scope.Offercoupon = 'selected';
                $scope.offer_id    = "551ce49e2aa8f00f20d9328f";
                $scope.offer_type  = "Coupon";
            }
            $scope.getlistingData($scope.itemsPerPage);
        }
     };

    //Get friend count on store
    $scope.frindBoughtCount = function(id) {       
        var opts = {};
        if(id === undefined){
            opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":$scope.shop_id,"citizen_id":String(APP.currentUser.id)}]}    
        }else{
            opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":[String(id)],"citizen_id":String(APP.currentUser.id)}]}
        }
        
        StoreService.frindboughtcount(opts, function(data){
            if(data.response === undefined || data.response === ''){
                $scope.frcount = [];
            } else {
                if(id === undefined){
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.frcount = data.response;   
                        });    
                    }, 0);   
                }else{
                    $(".map-frnd-count-number").html(data.response[0].count);
                }    
            }
        });
    };

    $scope.getfrndlist = function(event, shopid){    
        $scope.friendlist = [];
        $scope.nofndlist = false;
        if($(event.target).nextAll('ul.friend-list:first').is(':visible')){
            $(event.target).nextAll('ul.friend-list:first').hide();
        }else{
            $scope.frndlistloader = true;
            $(event.target).nextAll('ul.friend-list:first').show();
            var formData = {};
                formData.user_id = APP.currentUser.id;
                formData.shop_id = shopid;
            $scope.friendlist = [];
            StoreService.getfriendboughtonstores(formData, function(data){
                $scope.frndlistloader = false;
                if(data.code === 101 && data.data.friends != undefined && data.data.friends.length > 0) {
                    $scope.nofndlist = false;
                    $scope.friendlist = data.data.friends;
                }else{
                    $scope.nofndlist = true;
                }
            });
        }
    };

    $scope.getcount = function(itemsPerPage){
        var opt = {};
            opt["$collection"] = $scope.collection;
        var filter = {};
            filter["offer_type"] = $scope.offer_id;
            filter["start_date"] = {"$lte":"$$CurrentDate"};
            filter["end_date"]   = {"$gte":"$$CurrentDate"};
        /*if($scope.filterme  === 'selected'){
            filter["citizen_id"]  = String(APP.currentUser.id);
            filter["is_my_offer"] = true;
        }*/
        
        if($scope.Shopid_loc.length > 0){
            var shopfilter = {};
                shopfilter["$in"] = $scope.Shopid_loc;
            filter["shop_id"] = shopfilter;
        }

        if($scope.searchText !== "" && $scope.searchText != undefined){
            filter["$text"] = {"$search":$scope.searchText};
        }

        if($scope.selectedcat != undefined){
            filter["shop_id.category_id"] = String($scope.selectedcat.id);
        }
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

    $scope.changePageMore = function(pageNo) {
        $scope.currentPage = pageNo;
        $scope.getlistingData($scope.itemsPerPage);
    };
    
    $scope.calculateprice = function(val, dis){
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

    $scope.getlistingData = function(itemsPerPage){
        if($scope.i18n.left_menu != undefined){
            $scope.offerDropdown = [$scope.i18n.left_menu.offer_card,$scope.i18n.left_menu.offer_coupons,$scope.i18n.offer_shoppingcard.promotion];
        }    
        var option = {};
        option["$collection"] = $scope.collection;
        $scope.range = []; 
        $scope.shop_id = [];
        $scope.noResultFound = false;
        $scope.removepins();
        $scope.offerlodar  = true;
        $scope.offerlistingObject = [];
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        var filter  = {};
            filter["offer_type"] = $scope.offer_id;
        /*if($scope.filterme  === 'selected'){
            filter["citizen_id"]  = String(APP.currentUser.id);
            filter["is_my_offer"] = true;
        }*/
        if($scope.Shopid_loc.length > 0){
            var shopfilter = {};
                shopfilter["$in"] = $scope.Shopid_loc;
            filter["shop_id"] = shopfilter;
        }
        if($scope.selectedcat != undefined){
            filter["shop_id.category_id"] = String($scope.selectedcat.id);
        }
        if($scope.searchText !== "" && $scope.searchText != undefined){
            filter["$text"] = {"$search":$scope.searchText};
        }

        filter["start_date"] = {"$lte":"$$CurrentDate"};
        filter["end_date"]   = {"$gte":"$$CurrentDate"};
        var sort = {};
            sort[$scope.sortby] = -1;
        option["$sort"]    = sort;
        option["$limit"]   = itemsPerPage;
        option["$skip"]    = limit_start;
        option["$filter"]  = filter;

        if($scope.collection === "sixc_citizen_offers"){
            var myofferopts = {};
                myofferopts = {"function" : "SixcServices.offerForMe","parameters":[{"citizen_id":String(APP.currentUser.id),"count":true,"$filter":filter,"$sort":sort,"$limit":itemsPerPage,"$skip":limit_start}]};
            OfferService.getApplaneInvoke(myofferopts, function(data){
                $scope.offerlodar  = false;
                if(data.response === undefined || data.response === ''){
                    $scope.noResultFound = true;
                    $scope.initializeMap();
                }else {
                    if(data.response.myOffer.result.length === 0){
                        $scope.noResultFound = true;
                        $scope.initializeMap();
                    }else{
                        $scope.noResultFound = false;
                        $scope.offerlistingObject = data.response.myOffer.result;
                        $scope.offerlistingObject.forEach(function(val,index){
                            $scope.shop_id.push(val.shop_id._id);
                            var pin = {};
                                pin.longitude = val.shop_id.longitude;
                                pin.latitude  = val.shop_id.latitude;
                                pin.id        = val.shop_id._id;
                                pin.name      = val.shop_id.name;
                                if(val.shop_id.average_anonymous_rating != undefined){
                                    pin.vote  = val.shop_id.average_anonymous_rating;
                                }else{
                                    pin.vote  = 0;
                                }
                                if(val.shop_id.shop_thumbnail_img != undefined){
                                    pin.pic  = val.shop_id.shop_thumbnail_img;
                                }else{
                                    pin.pic  = "";
                                }
                                if(val.shop_id.category_id != undefined){
                                    pin.cat  = $scope.ConvertCategory(val.shop_id.category_id._id);
                                }else{
                                    pin.cat  = "";
                                }
                            $scope.map_pins.push(pin);
                        });
                        $scope.initializeMap();
                        $scope.frindBoughtCount();
                        $scope.totalItems = Math.ceil(data.response.myOfferCount.result[0].count/itemsPerPage); 
                        $scope.range = [];  
                        for (var i=1; i<=$scope.totalItems; i++) {
                            $scope.range.push(i);
                        }    
                    }    
                } 
            });
        }else{
            OfferService.getApplaneData(option, function(data){
                $scope.offerlodar  = false;
                if(data.status === "ok" && data.code === 200){
                    if(data.response.result.length > 0){
                        $scope.noResultFound = false;
                        $scope.offerlistingObject = data.response.result;
                        $scope.offerlistingObject.forEach(function(val,index){
                            $scope.shop_id.push(val.shop_id._id);
                            var pin = {};
                                pin.longitude = val.shop_id.longitude;
                                pin.latitude  = val.shop_id.latitude;
                                pin.id        = val.shop_id._id;
                                pin.name      = val.shop_id.name;
                                if(val.shop_id.average_anonymous_rating != undefined){
                                    pin.vote  = val.shop_id.average_anonymous_rating;
                                }else{
                                    pin.vote  = 0;
                                }
                                if(val.shop_id.shop_thumbnail_img != undefined){
                                    pin.pic  = val.shop_id.shop_thumbnail_img;
                                }else{
                                    pin.pic  = "";
                                }
                                if(val.shop_id.category_id != undefined){
                                    pin.cat  = $scope.ConvertCategory(val.shop_id.category_id._id);
                                }else{
                                    pin.cat  = "";
                                }
                                
                            $scope.map_pins.push(pin);
                        });
                        $scope.initializeMap();
                        $scope.frindBoughtCount();
                        $scope.getcount(itemsPerPage);
                    }else{
                        $scope.initializeMap();
                        $scope.noResultFound = true;
                    }
                }else{
                    $scope.initializeMap();
                    $scope.noResultFound = true;
                }
            });
        }
    };

    $scope.geolocation = function(){
        $scope.Shopid_loc = [];
        var opts = {};
            opts.longitude  = $scope.longitude;
            opts.latitute   = $scope.latitute;
            opts.radius     = $scope.selectedRange;
            opts.session_id = APP.currentUser.id;
        OfferService.searchstoreondimensions(opts,function(data){
            if(data.code === 101 && data.message === 'SUCCESS'){
                data.data.stores.forEach(function(rsl){
                   $scope.Shopid_loc.push(rsl.id);
                });
            }
            if($scope.locationSearch === false){
               $scope.Shopid_loc = [];
            }
            $scope.OfferChange();
        });
    };
   
    $scope.search = function (search) {
        //$scope.searchResult = true;    
    };

    $scope.searchMapText = function(){
        if($scope.searchMap === ""){
            $scope.locationSearch= false;
            $scope.latitute = $scope.Default_lat ;
            $scope.longitude = $scope.Default_long;
            $scope.geolocation();
        }
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

    $scope.filterChange = function(){
        if($scope.filterme === 'selected'){
            $scope.filterme      = '';
            $scope.collection    = "sixc_offers";
        }else{
            $scope.filterme      = 'selected';
            $scope.collection    = "sixc_citizen_offers";
        }
        $scope.getlistingData($scope.itemsPerPage);
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

    $scope.paginate = function() {
       $scope.currentPage = 1; 
    }

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.$watch('selectedRange', function(value) {
        $scope.selectedRange = value;
        $scope.geolocation();
    });

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

    $scope.Sorting = function(type){
        $scope.sortby = type;
        $scope.getlistingData($scope.itemsPerPage);
    };
}]);

app.controller('CardDetailsController', ['$scope', '$timeout', '$routeParams', 'OfferService', 'StoreService', '$modal', '$location', '$window', function( $scope, $timeout, $routeParams, OfferService, StoreService, $modal, $location, $window) {
    var map;
    var IMAGE_WIDTH    = 405;
    var colorArray     = ['#0b7eba', '#cccbca', '#ffce30'];
    $scope.offer_id    = $routeParams.id;
    $scope.reviews     = [];
    $scope.totalreview = 0;
    $scope.reviewRes   = 1;
    $scope.isLoading   = true;
    $scope.textLimit   = 200;
    $scope.loadMoreFunc = 'loadMore()';
    $scope.friendsId    = [];
    $scope.frndlistshow = true;
    $scope.storeId;
    $scope.cardData;
    $scope.citizenIncome = 0;
    $scope.PieChartData = [];
    $scope.galleryData  = [];
    $scope.Imageselected ;
    $scope.price_sixth = 0;
    $scope.price_purchase = 0;
    $scope.onlyForYou = 0;
    $scope.nofndlist     = false;
    $scope.FrndArray = [];
    $scope.vote = 0;
    $scope.pic  = "";
    
    $scope.format = function(n, currency) {
        n = Number(n);
        return currency + "" + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }

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

    $scope.calculateprice = function(val, dis){
        var halfprice = val/2 ;
        var discount  = (val * dis)/100; 
        $timeout(function(){
            $scope.$apply(function(){
                $scope.price_sixth = halfprice;
                $scope.price_purchase = (val - (val * dis)/100); 
                
                if($scope.citizenIncome < halfprice){
                   $scope.price_sixth = $scope.citizenIncome; 
                }
                $scope.onlyForYou = $scope.price_purchase - $scope.price_sixth;
                $scope.onlyForYou = Math.round($scope.onlyForYou * 100) / 100;
                $scope.PieChartData = [
                    {
                        key: $scope.i18n.offer_shoppingcard.price_for_me,
                        y: Math.round($scope.onlyForYou * 100) / 100
                    },
                    {
                        key: $scope.i18n.offer_shoppingcard.price_discount,
                        y: Math.round(discount * 100) / 100
                    },
                    {
                        key: $scope.i18n.offer_shoppingcard.price_app_cont,
                        y: Math.round($scope.price_sixth * 100) / 100
                    },
                ];
            })
        }, 500);
    };

    //Get friend count on store
    $scope.frindBoughtCount = function(id) {       
        var opts = {};
        if(id === undefined){
            opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":[String($scope.storeId)],"citizen_id":String(APP.currentUser.id)}]}    
        }else{
            opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":[String(id)],"citizen_id":String(APP.currentUser.id)}]}
        }
        
        StoreService.frindboughtcount(opts, function(data){
            if(data.response === undefined || data.response === ''){
                $scope.frcount = [];
            } else {
                if(id === undefined){
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.frcount = data.response;   
                        });    
                    }, 0);   
                }else{
                    $(".map-frnd-count-number").html(data.response[0].count);
                }    
            }
        });
    };

    var option = {};
        option["$collection"] = "sixc_offers";
            
    $scope.getData = function(itemsPerPage){
        $scope.cardData = [];
        $scope.noResultFound = false;
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        var filter  = {};
            filter["_id"] = $scope.offer_id;
            
        option["$filter"]  = filter;

        OfferService.getApplaneData(option, function(data){
            $scope.offerlodar  = false;
            if(data.status === "ok" && data.code === 200){
                if(data.response.result.length > 0){
                   $scope.noResultFound = false;
                   $scope.cardData = data.response.result[0];
                    if($scope.cardData.shop_id.average_anonymous_rating != undefined){
                        $scope.vote  = $scope.cardData.shop_id.average_anonymous_rating;
                    }
                    if($scope.cardData.shop_id.shop_thumbnail_img != undefined){
                        $scope.pic  = $scope.cardData.shop_id.shop_thumbnail_img;
                    }
                   $scope.storeId  = $scope.cardData.shop_id._id;
                   $scope.storename = $scope.cardData.shop_id.name;
                   $scope.getreviews($scope.storeId);
                   $scope.frindBoughtCount();
                   $scope.searchFriend($scope.storeId);
                   $scope.calculateprice($scope.cardData.value,$scope.cardData.discount);
                   $scope.initializeMap($scope.cardData.shop_id.longitude,$scope.cardData.shop_id.latitude);
                   $scope.galleryData   = $scope.cardData.imageurl.split(",");
                   $scope.Imageselected = $scope.galleryData[0];
                }else{
                    $scope.noResultFound = true;
                }
            }else{
               $scope.noResultFound = true;
            }
        });
    };

    $scope.getData();

    $scope.showAllFriend = function(post_id, creater_info, allTagFriend){
        $scope.allTagFriends = allTagFriend;
        $scope.post_id = post_id;
        $scope.creater = creater_info;
        var modalInstance = $modal.open({
            template: '<div id="friendModal" class="modal-header"> <h3 class="modal-title">People</h3><div class="modal-popup-close" ng-click="closeModal()"></div> </div><div class="modal-body tag-frnd-modal"><ul><li data-ng-repeat="friend in allTagFriends"><span class="tag-img"><img title="" style="width:30px;height:30px" alt="No image available" data-ng-src="{{friend.profile_image_thumb}}" data-ng-if="friend.profile_image_thumb != null  && friend.profile_image_thumb != \'\'"><img title="" alt="No image available" src="app/assets/images/dummy32X32.jpg" data-ng-if="friend.profile_image_thumb == null || friend.profile_image_thumb == \'\'"></span><span class="tag-frnd-name"><a href ng-click="viewFriendProile(friend.id)">{{friend.first_name}} {{friend.last_name}}</a></span></li></ul></div><div class="modal-footer"></div>',
            controller: 'ModalController',
            size: 'lg',
            scope: $scope,
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
        $scope.viewFriendProile = function(friendId){
            modalInstance.dismiss('cancel');
            $location.path('/viewfriend/'+friendId);
        };
    };

    $scope.getreviews = function(shopid){
        var limit_start = $scope.reviews.length;
        var opts = {};
        opts.store_id = shopid;
        opts.user_id  = APP.currentUser.id;
        opts.limit_start = limit_start;
        opts.limit_size  = 5;
        if($scope.FrndArray.length > 0){
            opts.friends_ids = $scope.FrndArray;
        }
        if ((($scope.totalreview > limit_start ) || $scope.totalreview == 0 ) && $scope.reviewRes == 1) {
            $scope.reviewRes = 0;
            $scope.isLoading = true;
            // This service's function returns customers review
            StoreService.listcustomersreviews(opts, function(data){
                $scope.isLoading = false;
                if(data.code === "101")
                {
                    $scope.isLoading = false;
                    var items = data.data;
                    if(items != undefined){
                        $scope.reviews = $scope.reviews.concat(items);    
                    }
                    $scope.totalreview = data.count;
                } 

                if ($scope.reviews.length === 0){
                    $scope.noContent = true; 
                } 
                $scope.reviewRes = 1;
            });
        } 
    }; 

    $scope.frndVal = function(id) {
        $scope.FrndArray = [];
        if(id === 'all'){}else{
            $scope.FrndArray.push(String(id));
        }
        $scope.totalreview = 0;
        $scope.reviewRes == 1;
        $scope.reviews = [];
        $scope.getreviews($scope.storeId);
    };
    
    $scope.showmoredesc = function(index, event){
        $(event.target).hide();
        $('.full-desc' + index).show();
        $('.limit-desc' + index).hide();
    };

    //check screen for mobile devicess to show corresponding layou
    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth  = newValue.w;
        if($scope.windowWidth <= '768'){
            $scope.isSmallScreen =  true; //declare in main controller
            $scope.loadMoreFunc  = '';
        } else {
            $scope.isSmallScreen =  false; //declare in main controller
            $scope.loadMoreFunc  = 'loadMore()';
        }
    }, true);

    $scope.loadMore = function() {
        if($scope.reviews.length > 0){
            $scope.getreviews($scope.storeId);
        }
    };

    $scope.searchFriend = function(frndId) {  
        $scope.nofndlist = false;      
        var opt = {};
            opt.user_id = APP.currentUser.id;
            opt.shop_id = frndId;
        StoreService.getfriendboughtonstores(opt, function(data){
            if(data.code === 101 && data.data.friends != undefined && data.data.friends.length > 0) {
                $scope.friendlist = data.data.friends;
            } else {
                $scope.nofndlist = true;
            }
        });
    };
    
    // Scroll to appropriate position based on image index and width
    $scope.scrollTo = function(image, ind, element) {
        $(".thumbnailanchor").removeClass('active');
        $(element.target).parent().addClass('active');
        $scope.listposition = {left:(IMAGE_WIDTH * ind * -1) + "px"};
        $scope.Imageselected = image;
    };
    
    $scope.xFunction = function(){
        return function(d) {
            return d.key;
        };
    };

    $scope.yFunction = function(){
        return function(d) {
            return d.y;
        };
    };

    $scope.descriptionFunction = function(){
        return function(d){
            return d.key;
        };
    };

    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    };

    $scope.buycard = function(val, dis){
        $scope.buyclass = 'disabled';
        $scope.buylodar = true;
        var opts = {};
            opts.session_id = String(APP.currentUser.id);
            opts.shop_id    = String($scope.storeId);
            opts.offer_id   = String($scope.offer_id);
            opts.total_value= val;
            opts.discount   = dis;
            opts.cancel_url = APP.payment.siteDomain + "#/buycard_cancel";
            opts.return_url = APP.payment.siteDomain + "#/buycard_success";

        OfferService.buyshoppingcard(opts, function(data){
            if(data.code === 101 && data.message === "SUCCESS"){
                $window.location.href = data.data.link;
            }else{
                $scope.buyerror = true;
                $scope.buyclass = '';
                $scope.buylodar = false;
            }
            $timeout(function() {
                $scope.buyerror = false;
                $scope.buyclass = '';
                $scope.buylodar = false;  
            }, 8000); 
        });    
    };

    $scope.getstorecredit = function(storeId) { 
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yr = today.getFullYear();
        var date = new Date(yr,mm,dd);
        var opts = {"function":"UtilityService.shopWiseCitizenIncome", "parameters":[{"shop_id":[storeId],"citizen_id":String(APP.currentUser.id),"date":String(date.toISOString())}]}
        StoreService.getstorecredit(opts, function(data){
            if(data.response === undefined || data.response === '' || data.response.length === 0){} else {
                $('.ca-html').html($scope.format(data.response[0].total_credit, '€'));
            }
        });
    };

    $scope.initializeMap = function(longitude, latitude){
        var centerLatLng   = new google.maps.LatLng(latitude,longitude);
        var mapProp = {
            center      : centerLatLng,
            zoom        : 7,
            mapTypeId   : google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapProp);

        var markers = [];
        var markerpos = new google.maps.LatLng(latitude,longitude);
        var marker = new google.maps.Marker({
            position:markerpos,
            map: map
        });
        markers.push(marker);

        var votestructure = "";
        var num = parseFloat($scope.vote).toFixed(1);
        for(var k = 0; k < 5; k++){
            if((num <= (k+0.5)) && (num > (k+0.0))){
                votestructure += "<li class='half'></li>";
            } else if(num >= (k+0.6)){
                votestructure += "<li class='active'></li>";
            } else {
                votestructure += "<li></li>";   
            }
        }
        var pic = "<img src='app/assets/images/store-prod.jpg'>";
        if($scope.pic !== ""){
            pic = "<img src='"+ $scope.pic +"'>";
        }

        var mapfrndcount = "<img src='app/assets/images/group-count.png'><span class='number map-frnd-count-number'>0</span>";
        
        var infowindow = new google.maps.InfoWindow();
        var content = "<div class='offermapinfo-block'><div class='pic-container'>" + pic + "</div><div class='description'><div class='map-frnd-count'>"+mapfrndcount+"</div><div class='offer-map-heading'><a href='#/shop/view/"+$scope.storeId+"'>"+$scope.storename+"</a></div><div><div class='vote-count'><ul>"+votestructure+"</ul></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span class='ca-html'>0€</span></div></div>";

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', (function(marker, content) {
            return function() {
               $scope.getstorecredit($scope.storeId);  
               $scope.frindBoughtCount($scope.storeId);
               infowindow.setContent(content);
               infowindow.open(map,marker);
            };
        })(marker, content));  
    };

    $timeout(function(){
        $('#scroll-pane').perfectScrollbar('update');
    },2000);
    $('#scroll-pane').perfectScrollbar();
}]);

app.controller('BuyCardController', ['$scope', 'OfferService', '$routeParams', '$location', function($scope, OfferService, $routeParams, $location) {
    // $scope.sendresponse = function(){
    //     var opts = {};
    //         opts.session_id = String(APP.currentUser.id);
    //         opts.shop_id    = String($scope.shop_id);
    //         opts.transaction_id = $scope.transaction_id;
    //         opts.type = $scope.success_type
            
    //     OfferService.responsebuycards(opts, function(data){
    //         /*This service is for sending response about transaction to back end
    //     });    
    // };*/

    $scope.isLoading = true;
    var searchObject = $location.search();
    if(searchObject.transaction_id != undefined && searchObject.shop_id != undefined){
        $scope.transaction_id = searchObject.transaction_id;
        $scope.shop_id   = searchObject.shop_id;
        //$scope.isLoading = false;
        var opts = {};
                opts.session_id = String(APP.currentUser.id);
                opts.shop_id    = String($scope.shop_id);
                opts.transaction_id = $scope.transaction_id;

        if($location.path().trim() === "/buycard_cancel"){
            $scope.message = 'error';
            $scope.isLoading = false;
            opts.type = "CANCELED";
                
            OfferService.responsebuycards(opts, function(data){
                /*This service is for sending response about transaction to back end*/
            });  
        }else{
            opts.type = "SUCCESS";
            OfferService.responsebuycards(opts, function(data){
                $scope.isLoading = false;
                if(data.code === 101 && data.message === "SUCCESS"){
                    $scope.message = 'success';
                }else{
                    $scope.message = 'pending';
                }   
            }); 
        }
    //    $scope.sendresponse();
    }else{
        $location.path("/");
    }
}]);