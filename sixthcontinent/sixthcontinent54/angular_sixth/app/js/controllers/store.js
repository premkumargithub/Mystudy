app.controller('StoreController',['$scope', '$http', '$cookieStore', 'StoreService','ProfileService', '$timeout', function ($scope, $http, $cookieStore, StoreService,ProfileService, $timeout) {  
    $scope.storeListObject = [];
    $scope.storeMyList = [];
    $scope.storeAllList = [];
    $scope.totalSize = 0;
    $scope.myTotalSize = 0;
    $scope.storeLoading = true;
    $scope.viewAllActive = 'current';
    $scope.myStoreActive = '';
    $scope.tab = 'viewAll';
    $scope.notFound = false;
    $scope.allRes = 1;
    $scope.myRes = 1;
    $scope.firstPage = APP.store_list_pagination.end;
    $scope.itemsPerPage = APP.store_list_pagination.end;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.pagevalue = '';
    $scope.orderValue = 1;
    $scope.filterApply = 0;
    var shopRating = 0;
    $scope.affilationOn = false;
    var shopCategoryVal = '';
    var votestructure = ''; 
    var favoriteIcon = '';
    $scope.filterresult = false;
    $scope.friendtransaction = 0;
    $scope.currentLanguage = $cookieStore.get("activeLanguage");
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

    $scope.paginate = function() {
       $scope.currentPage = 1; 
    }

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        $scope.loadMore();
    };
    $scope.showStoreList = function(tab, itemsPerPage) {
        $scope.filterApply = 0;
        $scope.pagevalue = 'storeAll';
        $scope.searchText = '';
        $scope.storeMyList = [];
        $scope.tab = tab;
        $scope.viewAllActive = 'current';
        $scope.myStoreActive = '';
        var opts = {};
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        opts.user_id = APP.currentUser.id;
        opts.store_type = 1; 
        opts.limit_start = limit_start;
        opts.limit_size = itemsPerPage;
        opts.lang_code = $scope.currentLanguage;
        opts.filter_type = $scope.orderValue;
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.storeLoading = true
            $scope.allRes = 0;
            StoreService.getStore(opts, function(data) {
                //console.log(data);
                $scope.filterresult = false;
                if(data.code == 101) {
                    $scope.allRes = 1;
                    $scope.totalSize = data.data.size;
                    $scope.storeListObject = data.data.stores;
                    $scope.totalItems = Math.ceil(data.data.size/itemsPerPage); 
                    $scope.range = [];  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    }             
                    $scope.storeLoading = false;
                    $scope.notFound = false;
                } else if(data.code == 121) {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                }
                else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                }
            });
        }
    };
    $scope.myStId = [];
    $scope.locIndex = [];
    $scope.myStoreList = function(tab, itemsPerPage) {
        $scope.filterresult = true;
        $scope.locIndex = [];
        $scope.myStId = [];
        $scope.filterApply = 0;
        $scope.pagevalue = 'storeMy';
        $scope.searchText = '';
        $scope.storeAllList = [];
        $scope.tab = tab; 
        $scope.viewAllActive = '';
        $scope.myStoreActive = 'current';
        var opts = {};
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        opts.user_id = APP.currentUser.id;
        opts.store_type = 2; 
        opts.limit_start = limit_start;
        opts.limit_size = itemsPerPage;
        opts.lang_code = $scope.currentLanguage;
        opts.filter_type = $scope.orderValue;
        if ((($scope.myTotalSize > limit_start) || $scope.myTotalSize == 0 ) && $scope.myRes == 1) {
            $scope.storeLoading = true;
            $scope.myRes = 0; 
            StoreService.getStore(opts, function(data) {
                $scope.filterresult = false;
                $scope.range = []; 
                if(data.code == 101) {
                    $scope.myTotalSize = data.data.size;
                    $scope.myRes = 1; 
                    $scope.storeListObject = $scope.storeMyList = data.data.stores;
                    for (var j=0; j < data.data.stores.length; j++) {
                        $scope.myStId.push(data.data.stores[j].id); 
                    }
                    for(var k = 0; k < $scope.myStId.length; k++){
                        for (var n=0;n<locations.length; n++){
                            if(locations[n][8] == $scope.myStId[k]) {
                                 $scope.locIndex.push(n);
                            }
                            
                        }     
                    }
                    $scope.fireMyshopMarker($scope.locIndex);
                    $scope.totalItems = Math.ceil(data.data.size/itemsPerPage);  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    }  
                    $scope.notFound = false;
                    $scope.storeLoading = false;
                } else if(data.code == 121) {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                    $scope.fireMyshopMarker($scope.locIndex);
                } else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                    $scope.fireMyshopMarker($scope.locIndex);
                }
                $scope.affilationOn = true;
            });
        }
    };

    $scope.orderBy = function() {
        $scope.filterApply = 1;
        $scope.loadMore();   
    }

    $scope.addressFilter = '';
    //$scope.showStoreList($scope.tab, $scope.itemsPerPage);
    $scope.loadMore = function() {
        var textVal = $scope.searchText ;
        var addressVal = $scope.addressFilter;
        if($scope.pagevalue == '' ){
            $scope.showStoreList($scope.tab, $scope.itemsPerPage);     
        } else if($scope.pagevalue == 'storeAll'){
            $scope.showStoreList($scope.tab, $scope.itemsPerPage); 
        } else if($scope.pagevalue == 'storeMy'){
            $scope.myStoreList($scope.tab,  $scope.itemsPerPage);
        } else if($scope.pagevalue == 'storeNameSearch'){
            $scope.searchStore('viewAll',  $scope.itemsPerPage);
        } else if($scope.pagevalue == 'storeAddSearch'){
            $scope.searchAddressShop($scope.storeIdArray);
        }
    };

    //getstorecredit
    $scope.getstorecredit = function(storeId) { 
       var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yr = today.getFullYear();
        var date = new Date(yr,mm,dd);
        $scope.stId =  storeId;  
        var opts = {};
        opts = {"function":"UtilityService.shopWiseCitizenIncome", "parameters":[{"shop_id":[$scope.stId],"citizen_id":String(APP.currentUser.id),"date":String(date.toISOString())}]}
        //calling the comment service to delete the selected comment 
        StoreService.getstorecredit(opts, function(data){
            for (i = 0; i < locations.length; i++) {
                    if(locations[i][8] == storeId){
                        $scope.storeIndex = i;
                        break;
                    }
                }
            if(data.response === undefined || data.response === '' || data.response.length === 0){
                locations[$scope.storeIndex][9] = 0;
                $('.ca span').html($scope.format1(0, '€'));
            } else {
                locations[$scope.storeIndex][9] = data.response[0].total_credit;
                $('.ca span').html($scope.format1(data.response[0].total_credit, '€'));
            }
        });
    };

    //Get friend count on store
    $scope.frindBoughtCount = function(storeId) {       
        var opts = {};
        opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":[storeId],"citizen_id":String(APP.currentUser.id)}]}
        //calling the comment service to delete the selected comment 
        StoreService.frindboughtcount(opts, function(data){
            for (i = 0; i < locations.length; i++) {
                    if(locations[i][8] == storeId){
                        $scope.storeIndex = i;
                        break;
                    }
                }
            if(data.response === undefined || data.response === ''){
                 locations[$scope.storeIndex][20] = 0;
                 $('.fr-num').html(0); 
                $scope.frcount = 0;   
            } else {
                locations[$scope.storeIndex][20] = data.response[0].count;
                $('.fr-num').html(data.response[0].count); 
            }
        });
    };

    //shop favorite
    $scope.shopIndex = '';
    $scope.favouritestores = function(id,element) {
        $scope.storeLoading = true;
        $scope.shopIndex = '';
        for (i = 0; i < locations.length; i++) {
            if(locations[i][8] == id){
                $scope.shopIndex = i;
                break;
            }
        }
        if($(element.target).hasClass('active')){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_id = id;
            StoreService.unfavouritestores(opts, function(data) {
                if(data.code == 101) {
                    $(element.target).removeClass('active');
                    locations[$scope.shopIndex][19] = 0;
                    if($scope.favAvailable == 1){
                        $scope.enableFilter();
                    } else {
                        $scope.storeLoading = false;
                    }
                } else {
                    $scope.storeLoading = false;
               }
               
            });
        } else {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_id = id;
            StoreService.favouritestores(opts, function(data) {
                if(data.code == 101) {
                    $(element.target).addClass('active');
                    locations[$scope.shopIndex][19] = 1;
                    if($scope.favAvailable == 1){
                        $scope.enableFilter();
                    } else {
                        $scope.storeLoading = false;
                    }
                } else {
                    $scope.storeLoading = false;
                }
            });   
        }
        
    };

    $scope.listActive = 'active';
    $scope.changeView = function(layout) {
        if(layout == 'grid'){
            $scope.gridActive = 'active'; 
            $scope.listActive = ''; 
        } else if(layout == 'list'){
            $scope.listActive = 'active'; 
            $scope.gridActive = '';
        }
    };

    

    /*$scope.loadMore = function() {
        var chk = document.getElementById("shotfilter").checked;
        var dpchk = document.getElementById("dpfilter").checked;
        var mapAddSearch = $scope.addressFilter;
        if($scope.searchText === '' && mapAddSearch === '' && chk===false && dpchk ===false ) {         
            if($scope.tab == 'myStore') {
                $scope.storeAllList = [];
                $scope.myStoreList($scope.tab);
            } else {
                $scope.storeMyList = [];
                $scope.showStoreList($scope.tab);
            }
        } 
        if (mapAddSearch != ''){
            $scope.searchAddressShop($scope.storeIdArray);
        }
        
    };
    */
     /* function to cancel the service when accept new request
    * 
    */
    $scope.searchText ='';
    var DELAY_TIME_BEFORE_POSTING = 300;
    //var element = $('#search');
    var currentTimeout = null;

    $('#shopserchbox').keypress(function() {
    
      var model = $scope.searchText;
      //var poster = model($scope);
      if(currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
      currentTimeout = $timeout(function(){
        if($scope.searchText.length == 0) {
        $scope.searchStore();
        }
      }, DELAY_TIME_BEFORE_POSTING)
    });

    $scope.searchRes = 0;
    $scope.searchTotalSize = 0;
    $scope.searchStore = function(tab, itemsPerPage) {
        $scope.pagevalue = 'storeNameSearch';
        $scope.searchRes = 0;
        $scope.storeLoading = true;
        $scope.viewAllActive = 'current';
        $scope.myStoreActive = '';
        var opts = {};
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        opts.user_id = APP.currentUser.id;
        $scope.tab = 'viewAll';
        if($scope.searchText.length >= 3 ){
            if(($scope.searchText === undefined || $scope.searchText === '') && $scope.searchRes == 1) {
                $scope.allRes = 1;
                $scope.storeMyList = [];
                $scope.storeAllList = [];
                $scope.showStoreList($scope.tab);
            }
            opts.business_name = ($scope.searchText === undefined ? '' : $scope.searchText); 
            opts.limit_start = limit_start;
            opts.lang_code = $scope.currentLanguage;
            opts.limit_size = itemsPerPage;
            if($scope.searchTotalSize > limit_start || $scope.searchTotalSize == 0) {
                StoreService.searchStore(opts, function(data) {
                    $scope.filterresult = false;
                    $scope.catebg = '';
                    $scope.subCateBg = '';
                    $scope.searchRes = 1;
                    if(data.code == 101) {
                        $scope.storeListObject =  data.data;
                        $scope.searchTotalSize = data.size;
                        $scope.totalItems = Math.ceil(data.size/itemsPerPage); 
                        $scope.range = []; 
                        for (var i=1; i<=$scope.totalItems; i++) {
                            $scope.range.push(i);
                        } 
                        $scope.storeLoading = false;
                        $scope.notFound = false;
                    } else if(data.code == 121) {
                        $scope.storeListObject =  [];
                        $scope.notFound = true;
                        $scope.storeLoading = false;
                    }
                    else {
                        $scope.storeListObject =  [];
                        $scope.notFound = true;
                        $scope.storeLoading = false;
                    }
                });
            }
        }
    };


    $scope.deleteStore = function(id, parentId) { 
        $("#store" + id).hide();
        $("#storedelete" + id).show();
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = id;
        //opts.store_type = (parentId) ? 2 : 1; condition changed on 14 jan
        opts.store_type = 1; // store type 1 for parent store delete
        StoreService.deleteStore(opts, function(data) {
            if(data.code == 101) {
                $(".storecoverid" + id).hide();
            } else {
                $("#store" + id).show();
                $("#storedelete" + id).hide();
            }
        });
    };

    $scope.deleteStoreGrid = function(id, parentId) { 
        $("#store" + id).hide();
        $("#storedelete" + id).show();
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = id;
       //opts.store_type = (parentId) ? 2 : 1; condition changed on 14 jan
        opts.store_type = 1; // store type 1 for parent store delete
        StoreService.deleteStore(opts, function(data) {
            if(data.code == 101) {
                /*var index = 0;
                angular.forEach($scope.storeListObject, function(idx) {
                    if(idx.id != id){
                        index = index + 1;
                    }else{
                        $scope.storeListObject.splice(index, 1);
                    }
                });*/
                $(".storecoverid" + id).hide();
                //$scope.storeListObject.splice(id, 1);
            } else {
                $("#store" + id).show();
                $("#storedelete" + id).hide();
            }
        });
    };

    //format euro currency
    $scope.format1 = function(n, currency) {
         n = Number(n);
        return currency + "" + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }

    //map functionality starts
    var mapArray = [];
    var locations = [];
    $scope.maploader = false;
    var i;
    var m ;
    var n = [];
    var shopIdArr = [];
    $scope.getmapstores = function(){
        $scope.maploader = true;
            var opts = {"user_id":APP.currentUser.id, "lang_code" : $scope.currentLanguage}; 
            StoreService.getmapstores(opts, function(data){
                //console.log('data'+data.data);
                if(data.code == 101) {
                    $scope.detail = data.data;
                    var mapArray = data.data;
                    for(var i=0; i<mapArray.length; i++) {
                        n.push(mapArray[i].name);
                        shopIdArr.push(mapArray[i].id);
                        var mi = new Array(mapArray[i].mapplace, mapArray[i].latitude,mapArray[i].longitude, mapArray[i].thumb_path, mapArray[i].name, mapArray[i].credit_status, mapArray[i].shot_status, mapArray[i].dp_status, mapArray[i].id, mapArray[i].credit_available, mapArray[i].catogory_id, mapArray[i].sub_category_id, mapArray[i].momosy_status, mapArray[i].card_status, mapArray[i].shop_rating, mapArray[i].shop_category, mapArray[i].shop_sub_category, mapArray[i].shop_keyword, mapArray[i].businessname,mapArray[i].is_fav, $scope.friendtransaction);
                            locations.push(mi);
                        }
                        $('.shop-map').show();
                        $scope.toggleFilterFalse();
                        $scope.initialize();
                        $scope.maploader = false;
                } else {                
                    $scope.maploader = false;                
                }
        });
    }

    $scope.getmapstores();

    var res = 1;
    $scope.searchTot = 0;
    //call service
    $scope.searchshoponmaps = function(arrCollection, req, itemSize){        
            //var opts = {"user_id":APP.currentUser.id,"shops":arrCollection};
            var opts = req;
            if(res==1){
            StoreService.searchshoponmaps(opts, function(data){
            $scope.filterresult = false;
            res=0;
            if(data.code == 101) {
                $scope.storeLoading = false;
                $scope.storeListObject = data.data.stores; 
                if($scope.storeListObject.length < 1) {
                    $scope.notFound = true;   
                } else {
                    $scope.notFound = false;   
                }
                res=1;
                $scope.searchTot = itemSize;
                $scope.totalItems = Math.ceil(itemSize/$scope.itemsPerPage); 
                $scope.range = [];  
                for (var i=1; i<=$scope.totalItems; i++) {
                    $scope.range.push(i);
                }    
            } else {    
                $scope.storeListObject = [];            
                $scope.notFound = true;   
                $scope.storeLoading = false;           
            }
        }); 
        }
    }

    var limit_starts = 0;
    var limit_end = 12;
    var idCollection = [];
    var sortArrayCollection = [];
    var sorttedId = [];
    $scope.filterArrayChange = '';
    $scope.searchAddressShop = function(arrCollection) {
        $scope.pagevalue = 'storeAddSearch';
        $scope.arrCollection = arrCollection;
        sortArrayCollection = [];
        sorttedId = [];
        if($scope.filterApply == 1){
            $scope.arrCollection = $scope.filterArrayChange;
        } else {
            $scope.filterArrayChange = '';
            $scope.filterArrayChange = $scope.arrCollection;
        }

        for (var i = 0; i < $scope.arrCollection.length; i++){
            for(var j = 0; j < locations.length; j++) {
                if(locations[j][8] == $scope.arrCollection[i]){
                    sortArrayCollection.push({'id' :locations[j][8], 'credit':locations[j][9], 'rating': locations[j][14]});
                }
            }
        }
        sortArrayCollection.sort(function(a, b) {
            if($scope.orderValue == 1){
                return b.credit - a.credit;
            } else {
                return b.rating - a.rating;
            }
        });

        for(var k=0; k<sortArrayCollection.length; k++){
            sorttedId.push(sortArrayCollection[k].id);
        }
        $scope.arrCollection = '';
        $scope.arrCollection = sorttedId;
        limit_starts = ($scope.currentPage-1)*$scope.itemsPerPage;
        limit_end = limit_starts + $scope.itemsPerPage;
        if($scope.searchTot > limit_starts || $scope.searchTot == 0 ) {
            $scope.storeLoading = true;
            idCollection = $scope.arrCollection;
            var tempArray = idCollection.slice(limit_starts,limit_end);
            var req = {"user_id":APP.currentUser.id,"shops":tempArray,"lang_code":$scope.currentLanguage};
            $scope.searchshoponmaps(arrCollection, req, $scope.arrCollection.length); 
        } 
        $scope.filterApply = 0;
    }
    /*search by store name starts*/
    //var n = ["Action Comics", "Detective Comics", "Superman", "Fantastic Four", "Amazing Spider-Man", "Batman Series", "Repoman Seeks", "Love Comics", "Anime Comics"];

    $scope.idArrays = [];
    $scope.allArrayIndex = [];
    //search text function
    var containsText = function (search) {
        var gotText = false;
        for (var i in locations) {
            var re = new RegExp(search, "ig");
            var nameS = re.test(locations[i][4]);
            var cateS = re.test(locations[i][15]);
            var subCateS = re.test(locations[i][16]);
            var busS = re.test(locations[i][18]);
            var keyS = re.test(locations[i][17]);
            if (nameS || cateS || subCateS || busS || keyS) {            
                if($scope.itemsArr.indexOf(locations[i][4]) == -1)
                {   
                    //if ($scope.itemsArr.length === 20) { break }
                    $scope.allArrayIndex.push(i);
                    $scope.itemsArr.push(locations[i][4]);
                    $scope.idArrays.push(shopIdArr[i]);
                }
                gotText = true;
            }
        }
        return gotText;
    };
    $scope.searchText = "";
    $scope.itemsSelectedArr = [];
    $scope.itemsArr = [];
    $scope.itemsDisplaPanel = false;
    $scope.searchMe = function (search) {
        $scope.itemsArr = [];
        $scope.idArrays = [];
        $scope.allArrayIndex = [];
        $scope.itemsDisplaPanel = false;
        if (search.length > 2) {
                
            var foundText = containsText(search);
            $scope.itemsDisplaPanel = (foundText) ? true : false;
            $scope.itemsDisplaPanelNone = (foundText) ? false : true;
            //$scope.shopNameOnKey();
        }
    };

    $('#pac-input').focus(function() {
       $scope.itemsDisplaPanel = false;
    });

    $('body').click(function() {
       $scope.itemsDisplaPanel = false;
       $scope.itemsDisplaPanelNone = false;
    });

    $scope.searchKey = '';
    $scope.itemsDisplaPanelNone = false;
    $scope.shopNameMarker = [];
    $scope.shopNameOnKey = function() {
        jQuery("#mapstoresearch").keydown(function(e) {
            $scope.currentPage = 1;
            if (e.keyCode == 38) { // up
                //console.log('keyup pressed');
                var selected = jQuery('.selected');
                jQuery(".mainshop").removeClass('selected');
                if (selected.prev().length == 0) {
                    selected.siblings().last().addClass('selected');
                    jQuery('.autocompletepanel').scrollTo('.selected');
                } else {
                    selected.prev().addClass('selected');
                    jQuery('.autocompletepanel').scrollTo('.selected');
                }
                $scope.searchKey = jQuery(".selected").children().html();
                jQuery("#mapstoresearch").val($scope.searchKey);
            }
            if (e.keyCode == 40) { // down
                //console.log('keydown');
                var selected = jQuery('.selected');
                jQuery(".mainshop").removeClass('selected');
                //console.log(selected.next().length+'ln');
                if (selected.next().length == 0) {
                    //selected.siblings().first().addClass('selected');
                    jQuery(".mainshop:first-child").addClass('selected');
                    jQuery('.autocompletepanel').scrollTo('.selected');  
                } else {
                    selected.next().addClass('selected');
                    jQuery('.autocompletepanel').scrollTo('.selected');
                }
                $scope.searchKey = jQuery(".selected").children().html();
                jQuery("#mapstoresearch").val($scope.searchKey);
            }
            if (e.keyCode == 13) { // enter
                $scope.itemsDisplaPanel = false;
                var selected = jQuery('.selected');
                if(selected.length != 0) {
                    $scope.itemSelectedData($scope.searchKey); 
                } else{
                    $scope.setShopNameMarker(null);
                    $scope.shopNameMarker = [];
                    $scope.storeIdArray = $scope.idArrays;
                    $scope.searchAddressShop($scope.idArrays);
                    //pin display on map
                    $scope.subcategories = '';
                    $scope.catebg = '';
                    $scope.subCateBg = '';
                    $scope.viewAllActive = '';
                    $scope.myStoreActive = '';
                    markerClusterer.setMap(null);
                    document.getElementById("shotfilter").checked = false;
                    document.getElementById("dpfilter").checked = false;
                    $scope.addressFilter = '';
                    $scope.setMyshop(null);
                    $scope.setFilterMarker(null);
                    $scope.setAllMap(null);
                    $scope.setRemoveAllMap(null);
                    $scope.setDpMarker(null);
                    $scope.setDpShotMarker(null);
                    $scope.filterfalse = $scope.filterfalse === 0 ? 1: 0;
                    if($scope.store != undefined) {
                      $scope.store.storecategory = '';  
                      $scope.store.subcategory = '';
                    }
                    $scope.cardAvailable = 0;
                    $scope.favAvailable = 0;
                    $scope.cateval = 'blank';
                    $scope.subCateVal = 'blank';
                    if($scope.allArrayIndex.length == 0) {
                        $('#results').html('<span>'+$scope.i18n.store.result_not_found+'</span>');
                    } else {
                        $('#results').html('<span>'+$scope.allArrayIndex.length+' '+$scope.i18n.store.result_found+'</span>');
                    }
                    var infowindow = new google.maps.InfoWindow();
                    var marker, i;
                    var pin = {
                        url: 'app/assets/images/green-pin.png'
                    };

                    var pin2 = {
                        url: 'app/assets/images/silver-pin.png'
                    }; 

                    for (var i = 0; i<$scope.allArrayIndex.length;i++){
                        var stIndex = $scope.allArrayIndex[i];
                        //console.log(locations[stIndex][8]+'id'+stIndex+'name'+locations[stIndex][4]);
                        
                        if(locations[stIndex][5] == 1) {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[stIndex][1], locations[stIndex][2]),
                            map: map,
                            icon :pin2
                            });
                        } else {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[stIndex][1], locations[stIndex][2]),
                            map: map,
                            icon :pin
                            });
                        }

                        marker.set('shopId', locations[stIndex][8]);
                        //content set here
                        //shopCategoryVal = '';
                        if(locations[stIndex][15] == null || locations[stIndex][15] == ''){
                            shopCategoryVal = "<div class='category-dec blank'></div>";
                        } else {
                            shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[stIndex][15]+"</div>";
                        }

                        votestructure = ''; 
                        var num = parseFloat(locations[stIndex][14]).toFixed(1);

                        for(var k = 0; k < 5; k++){
                            if((num <= (k+0.5)) && (num > (k+0.0))){
                                votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                            } else if(num >= (k+0.6)){
                                votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                            } else {
                                votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                            }
                        }

                        if(locations[stIndex][19] == 1){
                            favoriteIcon = "<span class='active'></span>";
                        } else {
                            favoriteIcon = "<span></span>";
                        }

                        if ((locations[stIndex][3] == '') || (locations[stIndex][3] == undefined)) {
                           var content = "<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[stIndex][8]+"'>"+locations[stIndex][4]+"</a></div><div>"+locations[stIndex][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[stIndex][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[stIndex][9], '€')+"</span></div></div></div></div>";
                        } else {
                            var content = "<div class='mappopup'><div class='pic-container'><img src='"+locations[stIndex][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[stIndex][8]+"'>"+locations[stIndex][4]+"</a></div><div>"+locations[stIndex][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[stIndex][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[stIndex][9], '€')+"</span></div></div></div></div>";   
                        }
                        $scope.firecreditshop = function(shopId) {
                          $scope.getstorecredit(shopId);  
                          $scope.frindBoughtCount(shopId);
                        }

                        google.maps.event.addListener(marker, 'click', (function(marker, content) {
                            return function() {
                                var shopmapid = this.get('shopId');
                                $scope.firecreditshop(shopmapid);
                                // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                                infowindow.setContent(content);
                                infowindow.open(map, marker);
                            }
                        })(marker, content));  
                        $scope.shopNameMarker.push(marker);
                    }
                }
            }

            if($scope.itemsDisplaPanel == false) {
                $scope.itemsDisplaPanelNone = false;
            } else {
               // $scope.itemsDisplaPanelNone = true;
            }
             
        });
    }

    $scope.shopNameOnKey();

    $scope.itemSelectedData = function (str) {
        jQuery(".mainshop").removeClass('selected');
        $scope.itemsDisplaPanel = false;
        $scope.searchText = str;
         $('#results').html('');
        var a = n.indexOf(str);
        $scope.markerpopup(a);
        $scope.searchText;
        var model = $scope.searchText;
        //var poster = model($scope);
        if(currentTimeout) {
            $timeout.cancel(currentTimeout);
        }
          currentTimeout = $timeout(function(){
            $scope.searchStore('viewAll', $scope.itemsPerPage);
          }, DELAY_TIME_BEFORE_POSTING)
            //return (str) ? $scope.itemsSelectedArr.push(str) : false;
        };

    $scope.itemSelectedDelet = function (sel) {
        var idx = $scope.itemsSelectedArr.indexOf(sel);
        if (idx !== -1) $scope.itemsSelectedArr.splice(idx, 1);
        $scope.itemsDisplaPanel = false;
    };


    //get Category
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

    //get subcategory
    $scope.cateval = 'blank';
    $scope.subCateVal = 'blank';
    $scope.catebg = '';
    $scope.getSubCategory = function(){
            $scope.subCateBg = '';
            $scope.subCateVal = 'blank';
         //console.log($scope.store.storecategory.id+'cate');
            //$scope.subcategories = '';
            if($scope.store.storecategory == null ) {
                $scope.catebg = '';
                $scope.enableKeyword = true;
                $scope.enableSubcategory = true;
                $scope.cateval = 'blank';
                $scope.subCateBg = '';
                $scope.subCateVal = 'blank';
                $scope.store.subcategory = '';
                $scope.enableFilter();            
            } else if($scope.store.storecategory.id != '' && $scope.store.storecategory.id != 0){
                //enable disable keyword box
                $scope.catebg = 'active';
                $scope.enableKeyword = false;
                $scope.enableSubcategory = false;
                var opts = {};
                opts.session_id = APP.currentUser.id;
                opts.lang_code = $scope.currentLanguage;
                opts.cat_id = $scope.store.storecategory.id;
                opts.session_id = APP.currentUser.id;
                $scope.cancelCategoryRequest = false;
                StoreService.getSubCategoryList(opts,function(data){
                    if(data.code === 101 && data.message === 'SUCCESS'){
                        $scope.subcategories = data.data;
                    }
                });
                $scope.cateval = $scope.store.storecategory.id;
                $scope.enableFilter($scope.store.storecategory.id);
            } else {
                    $scope.enableKeyword = true;
                    $scope.enableSubcategory = true;
            }
        };
    $scope.searchCategory($scope.currentLanguage); 

    $scope.shopSubCatogory = function(){
        $scope.subCateBg = '';
        if($scope.store.subcategory == null){
            $scope.subCateBg = '';
            $scope.subCateVal = 'blank';
            $scope.enableFilter('main');
        } else if( $scope.store.subcategory.id != '' && $scope.store.subcategory.id != 0){
            $scope.subCateBg = 'active';
            $scope.subCateVal = $scope.store.subcategory.id;
            $scope.enableFilter('main');
        }
    }  


    /*search by store name ends*/
    var arrId = [];
    var arrMarker = [];
    var geocoder = new google.maps.Geocoder();
    var circle = null;
    var gmarkers = [];
    var map;
    var arrMapresult = [];
    var arrShotMarker = [];
    var arrDpMarker = [];
    var arrDpnShotMarker = [];
    var arrSearchStore = [];
    var markerClusterer = null;
    $scope.storeIdArray = '';
    var filtermarker = [];
    var filterAllData = [];
    var filterArray = [];
    $scope.initialize = function () {
        document.getElementById("pac-input").value = '';
        var markers = [];
        var centerLatLng = new google.maps.LatLng(41.9000,12.4833);
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom:6,
            center: centerLatLng
        });

        // Create the search box and link it to the UI element.
        var input = (document.getElementById('pac-input'));
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));
        // [START region_getplaces]
        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            // markerClusterer.clearMarkers();
            $scope.currentPage = 1;
            $scope.catebg = '';
            $scope.subCateBg = '';
            $scope.storeListObject = [];
            $scope.viewAllActive = 'current';
            $scope.myStoreActive = '';
            $scope.searchText = '';
            markerClusterer.setMap(null);
            $scope.rmFilters();
            filterAllData = [];
            document.getElementById("shotfilter").checked = false;
            document.getElementById("dpfilter").checked = false;
            var address = document.getElementById('pac-input').value;
            document.getElementById('pac-input').value = address;
            $scope.addressFilter = address;
            var radius = parseInt(50, 10)*1000;
            geocoder.geocode({ 'address': address}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    var latlng = new google.maps.LatLng(latitude, longitude);            
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                    marker.setMap(null);
                    if (circle) circle.setMap(null);
                        circle = new google.maps.Circle({center:marker.getPosition(),                                 //radius: radius,
                                             //fillOpacity: 0.35,
                                            // fillColor: "#FF0000",
                                             strokeWeight: 0,
                                             map: map});
                    var bounds = new google.maps.LatLngBounds();
                    $('#results').html('');
                    arrMapresult.length = 0;
                    var arrId = [];
                    for (var i=0; i<gmarkers.length;i++) {
                        if (google.maps.geometry.spherical.computeDistanceBetween(gmarkers[i].getPosition(),marker.getPosition()) < radius) { 
                            arrId.push(locations[i][8]);
                            bounds.extend(gmarkers[i].getPosition())
                            gmarkers[i].setMap(map);
                            arrMapresult.push(gmarkers[i].getPosition());
                            var infowindow = new google.maps.InfoWindow();
                            var marker, i;
                            var pin = {
                                url: 'app/assets/images/silver-pin.png'
                            };
                            gmarkers[i].getPosition();
                            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                                return function() {
                                    $scope.getstorecredit(locations[i][8]);
                                    $scope.frindBoughtCount(locations[i][8]);
                                    shopCategoryVal = '';
                                    favoriteIcon = '';
                                    if(locations[i][15] == null || locations[i][15] == ''){
                                        shopCategoryVal = "<div class='category-dec blank'></div>";
                                    } else {
                                        shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                                    }

                                    votestructure = ''; 
                                    var num = parseFloat(locations[i][14]).toFixed(1);

                                    for(var k = 0; k < 5; k++){
                                        if((num <= (k+0.5)) && (num > (k+0.0))){
                                            votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                        } else if(num >= (k+0.6)){
                                            votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                        } else {
                                            votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                        }
                                    }

                                    if(locations[i][19] == 1){
                                        favoriteIcon = "<span class='active'></span>";
                                    } else {
                                        favoriteIcon = "<span></span>";
                                    }


                                    if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                                    } else {
                                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                                    }
                                    infowindow.open(map, marker);
                            }
                            })(marker, i));
                        } else {
                              gmarkers[i].setMap(null);        
                        }
                    }    
                    limit_starts = 0;
                    limit_end = 12;
                    $scope.storeIdArray = arrId;
                    $scope.searchAddressShop(arrId);

                    if(arrMapresult.length == 0) {
                        bounds.extend(results[0].geometry.location);
                        $('#results').html('<span>'+$scope.i18n.store.result_not_found+'</span>');
                    } else {
                        $('#results').html('<span>'+arrMapresult.length+' '+$scope.i18n.store.result_found+'</span>');
                    }
                    map.fitBounds(bounds);
                    map.setZoom(9);
                } else {
                  alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
        // [END region_getplaces]
        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function() {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });

        if (markerClusterer) {
              markerClusterer.clearMarkers();
        }
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        var pin = {
            url: 'app/assets/images/green-pin.png'
        };
        var pin2 = {
            url: 'app/assets/images/silver-pin.png'
        };
        for (i = 0; i < locations.length; i++) {
            if(locations[i][5] == 0){
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                icon :pin
                });
            } else {
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                icon :pin2
                });
            };
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    $scope.getstorecredit(locations[i][8]);
                    $scope.frindBoughtCount(locations[i][8]);
                    shopCategoryVal = '';
                    favoriteIcon = '';
                    if(locations[i][15] == null || locations[i][15] == ''){
                        shopCategoryVal = "<div class='category-dec blank'></div>";
                    } else {
                        shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                    }

                    votestructure = ''; 
                    var num = parseFloat(locations[i][14]).toFixed(1);

                    for(var k = 0; k < 5; k++){
                        if((num <= (k+0.5)) && (num > (k+0.0))){
                            votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                        } else if(num >= (k+0.6)){
                            votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                        } else {
                            votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                        }
                    }
                    if(locations[i][19] == 1){
                        favoriteIcon = "<span class='active'></span>";
                    } else {
                        favoriteIcon = "<span></span>";
                    }

                    if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                    } else {
                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                    }              
                    infowindow.open(map, marker);
                }
            })(marker, i));
            arrMarker.push(marker);
            gmarkers.push(marker);
        }
        markerClusterer = new MarkerClusterer(map, arrMarker,{
            maxZoom : 12
        });
        
        google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoomLevel = map.getZoom();    
        if(zoomLevel < 5) {
            //document.getElementById("shotfilter").checked = false;
            //document.getElementById("dpfilter").checked = false;
            //$scope.addressFilter = '';
            //$scope.searchText = '';
            if(circle != null) {
                circle.setMap(null);
            }
            //$('#results').html('');
           // markerClusterer.setMap(null);
            //$scope.setDpShotMarker(null);
            //$scope.setDpMarker(null);
            //$scope.setAllMap(null);
            //$scope.setAllShotMap(null);
            //$scope.setAllMap(map);
           // markerClusterer.setMap(map);
        }
      });
    }

    $scope.markerpopup = function(index) {
        $scope.viewAllActive = 'current';
        $scope.myStoreActive = '';
        document.getElementById("shotfilter").checked = false;
        document.getElementById("dpfilter").checked = false;
        $scope.setShopNameMarker(null);
        markerClusterer.setMap(null);
        $scope.setMyshop(null);
        $scope.setAllShotMap(null);
        $scope.setAllMap(null);
        $scope.setFilterMarker(null);
        $scope.setAllMap(map);
        $scope.setDpMarker(null);
        $scope.setDpShotMarker(null);
        if(circle != null) {
            circle.setMap(null);
        }
        $scope.cardAvailable = 0;
        $scope.favAvailable = 0;
        $scope.cateval = 'blank';
        $scope.subCateVal = 'blank';
        $scope.addressFilter = '';
        google.maps.event.trigger(arrMarker[index], 'click');
        map.setZoom(10);
    }

    $scope.setAllMap = function(map) {
        for (var i = 0; i < arrMarker.length; i++) {
            arrMarker[i].setMap(map);
            gmarkers[i].setMap(map);
        }
    }

    $scope.setRemoveAllMap = function(map) {
        for (var i = 0; i < arrSearchStore.length; i++) {
            arrSearchStore[i].setMap(map);
        }
    }

    $scope.setMyshop = function(map) {
        for (var i = 0; i < $scope.myShopMarker.length; i++) {
            $scope.myShopMarker[i].setMap(map);
        }
    }

    $scope.setShopNameMarker = function(map) {
        for (var i = 0; i < $scope.shopNameMarker.length; i++) {
            $scope.shopNameMarker[i].setMap(map);
        }
    }

    $scope.setAllShotMap = function(map) {
        for (var i = 0; i < arrShotMarker.length; i++) {
            arrShotMarker[i].setMap(map);
        }
    }

    $scope.setDpMarker = function(map) {
        for (var i = 0; i < arrDpMarker.length; i++) {
            arrDpMarker[i].setMap(map);
        }
    }
    $scope.setDpShotMarker = function(map) {
        for (var i = 0; i < arrDpnShotMarker.length; i++) {
            arrDpnShotMarker[i].setMap(map);
        }
    }
    $scope.setFilterMarker = function(map) {
        for (var i = 0; i < filtermarker.length; i++) {
            filtermarker[i].setMap(map);
        }
    }

    $scope.cardAvailable = 0;
    $scope.toggleCardAvailable = function() {
       $scope.cardAvailable = $scope.cardAvailable === 0 ? 1: 0;
       $scope.enableFilter(); 
    }

    $scope.favAvailable = 0;
    $scope.favArray = [];
    $scope.toggleShopFav = function() {
       $scope.favAvailable = $scope.favAvailable === 0 ? 1: 0;
       $scope.enableFilter();
    }

    $scope.rmFilters = function() {
        if($scope.myShopMarker != undefined) {
            $scope.setMyshop(null);
        }
        $scope.addressFilter = '';
        $scope.searchText = '';
        document.getElementById("shotfilter").checked = false;
        document.getElementById("dpfilter").checked = false;
        if($scope.store != undefined) {
            $scope.store.storecategory = '';  
            $scope.store.subcategory = '';
        }
        $scope.setShopNameMarker(null);
        $scope.cardAvailable = 0;
        $scope.favAvailable = 0;
        $scope.cateval = 'blank';
        $scope.subCateVal = 'blank';
        $scope.setFilterMarker(null);
        $scope.setAllMap(null);
        $scope.setRemoveAllMap(null);
        $scope.setDpMarker(null);
        $scope.setDpShotMarker(null); 
    }

    $scope.toggleFilterFalse = function() {
        $scope.subcategories = '';
        $scope.catebg = '';
        $scope.subCateBg = '';
        if($scope.myShopMarker != undefined) {
            $scope.setMyshop(null);
        }
        $scope.addressFilter = '';
        $scope.searchText = '';
        document.getElementById("shotfilter").checked = false;
        document.getElementById("dpfilter").checked = false;
        $scope.filterfalse = $scope.filterfalse === 0 ? 1: 0;
        if($scope.store != undefined) {
          $scope.store.storecategory = '';  
          $scope.store.subcategory = '';
        }
        $scope.cardAvailable = 0;
        $scope.favAvailable = 0;
        $scope.cateval = 'blank';
        $scope.subCateVal = 'blank';
        $scope.enableFilter(); 
    }

    $scope.stopFilters = function() {
        $scope.showStoreList($scope.tab, $scope.itemsPerPage);
        $scope.pagevalue = '';
        $scope.setAllMap(map);
    }

    $scope.myShopMarker = [];
    $scope.fireMyshopMarker = function(indexArray){
        $scope.setShopNameMarker(null);
        $scope.subcategories = '';
        $scope.catebg = '';
        $scope.subCateBg = '';
        markerClusterer.setMap(null);
        document.getElementById("shotfilter").checked = false;
        document.getElementById("dpfilter").checked = false;
        $scope.addressFilter = '';
        $scope.searchText = '';
        $scope.setMyshop(null);
        $scope.setFilterMarker(null);
        $scope.setAllMap(null);
        $scope.setRemoveAllMap(null);
        $scope.setDpMarker(null);
        $scope.setDpShotMarker(null);
        $scope.filterfalse = $scope.filterfalse === 0 ? 1: 0;
        if($scope.store != undefined) {
          $scope.store.storecategory = '';  
          $scope.store.subcategory = '';
        }
        $scope.cardAvailable = 0;
        $scope.favAvailable = 0;
        $scope.cateval = 'blank';
        $scope.subCateVal = 'blank';
        //$('#results').html('');
        if(indexArray.length == 0) {
            $('#results').html('<span>'+$scope.i18n.store.result_not_found+'</span>');
        } else {
            $('#results').html('<span>'+indexArray.length+' '+$scope.i18n.store.result_found+'</span>');
        }
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        var pin = {
            url: 'app/assets/images/green-pin.png'
        };

        var pin2 = {
            url: 'app/assets/images/silver-pin.png'
        };  
        for (var i = 0; i<indexArray.length;i++){
            var stIndex = indexArray[i];
            //console.log(locations[stIndex][5]+'core');
            
            if(locations[stIndex][5] == 1) {
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[stIndex][1], locations[stIndex][2]),
                map: map,
                icon :pin2
                });
            } else {
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[stIndex][1], locations[stIndex][2]),
                map: map,
                icon :pin
                });
            }

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    $scope.getstorecredit(locations[stIndex][8]);
                    $scope.frindBoughtCount(locations[stindex][8]);
                    // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                    shopCategoryVal = '';
                    favoriteIcon = '';
                    if(locations[stIndex][15] == null || locations[stIndex][15] == ''){
                        shopCategoryVal = "<div class='category-dec blank'></div>";
                    } else {
                        shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[stIndex][15]+"</div>";
                    }

                    votestructure = ''; 
                    var num = parseFloat(locations[stIndex][14]).toFixed(1);

                    for(var k = 0; k < 5; k++){
                        if((num <= (k+0.5)) && (num > (k+0.0))){
                            votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                        } else if(num >= (k+0.6)){
                            votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                        } else {
                            votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                        }
                    }

                    if(locations[stIndex][19] == 1){
                        favoriteIcon = "<span class='active'></span>";
                    } else {
                        favoriteIcon = "<span></span>";
                    }

                    if ((locations[stIndex][3] == '') || (locations[stIndex][3] == undefined)) {
                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[stIndex][8]+"'>"+locations[stIndex][4]+"</a></div><div>"+locations[stIndex][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[stIndex][9], '€')+"</span></div></div></div></div>");
                    } else {
                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[stIndex][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[stIndex][8]+"'>"+locations[stIndex][4]+"</a></div><div>"+locations[stIndex][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[stIndex][9], '€')+"</span></div></div></div></div>");   
                    }


                    infowindow.open(map, marker);
                }
            })(marker, i));  
            $scope.myShopMarker.push(marker);
        }
    }

    $scope.cateval = 'blank';
    $scope.subCateVal = 'blank';
    //select box filter category
    $scope.searchAddStop = false;
    $scope.enableFilter = function() {
        $scope.filterresult = true;
        if(markerClusterer){
            markerClusterer.setMap(null);
        }
        $scope.viewAllActive = '';
        $scope.myStoreActive = '';
        document.getElementById("shotfilter").checked = false;
        document.getElementById("dpfilter").checked = false;
        $scope.addressFilter = '';
        $scope.searchText = '';
        $scope.setMyshop(null);
        $scope.setShopNameMarker(null);
        $scope.setAllMap(null);
        $scope.setFilterMarker(null);
        $scope.setAllShotMap(null);
        $scope.setDpMarker(null);
        $scope.setDpShotMarker(null);
        var infowindow = new google.maps.InfoWindow();
        filterArray = [];
        filterAllData = [];
        var marker, i;
        var pin = {
            url: 'app/assets/images/green-pin.png'
        };

        var pin2 = {
            url: 'app/assets/images/silver-pin.png'
        };  
        for (i = 0; i < locations.length; i++) {
            //filter with category (true) , subcategory(false), momosy card(fase)
            if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 0) && ($scope.favAvailable == 0)) {
                //console.log('for maincate'+locations[i][8]+'id'+locations[i][10]+','+$scope.cateval+'sub'+locations[i][11]+','+$scope.subCateVal);
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        $scope.getstorecredit(locations[i][8]);
                        $scope.frindBoughtCount(locations[i][8]);
                        // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                        shopCategoryVal = '';
                        favoriteIcon = '';
                        if(locations[i][15] == null || locations[i][15] == ''){
                            shopCategoryVal = "<div class='category-dec blank'></div>";
                        } else {
                            shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                        }

                        votestructure = ''; 
                        var num = parseFloat(locations[i][14]).toFixed(1);

                        for(var k = 0; k < 5; k++){
                            if((num <= (k+0.5)) && (num > (k+0.0))){
                                votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                            } else if(num >= (k+0.6)){
                                votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                            } else {
                                votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                            }
                        }

                        if(locations[i][19] == 1){
                        favoriteIcon = "<span class='active'></span>";
                        } else {
                            favoriteIcon = "<span></span>";
                        }
                        if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                        } else {
                            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                        }
                        infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && (locations[i][11] == $scope.subCateVal && $scope.subCateVal != 'blank') && ($scope.cardAvailable == 0) && ($scope.favAvailable == 0)){
                //filter with category (true) , subcategory(true), momosy card(fase)
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                        $scope.getstorecredit(locations[i][8]);
                        $scope.frindBoughtCount(locations[i][8]);
                       // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                        shopCategoryVal = '';
                        favoriteIcon = '';
                        if(locations[i][15] == null || locations[i][15] == ''){
                            shopCategoryVal = "<div class='category-dec blank'></div>";
                        } else {
                            shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                        }

                        votestructure = ''; 
                        var num = parseFloat(locations[i][14]).toFixed(1);

                        for(var k = 0; k < 5; k++){
                            if((num <= (k+0.5)) && (num > (k+0.0))){
                                votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                            } else if(num >= (k+0.6)){
                                votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                            } else {
                                votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                            }
                        }

                        if(locations[i][19] == 1){
                            favoriteIcon = "<span class='active'></span>";
                        } else {
                            favoriteIcon = "<span></span>";
                        }

                        if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                        } else {
                            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                        }
                        infowindow.open(map, marker);
                }
                })(marker, i));  
                filtermarker.push(marker);
            } else if(($scope.cateval == 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 1 ) && ($scope.favAvailable == 0)){
                //filter with category (false) , subcategory(false), momosy card(true)
                //console.log($scope.cateval+'ss'+$scope.subCateVal);
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                           // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = '';
                            if(locations[i][15] == null || locations[i][15] == ''){
                                shopCategoryVal = "<div class='category-dec blank'></div>";
                            } else {
                                shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                            }

                            votestructure = ''; 
                            var num = parseFloat(locations[i][14]).toFixed(1);

                            for(var k = 0; k < 5; k++){
                                if((num <= (k+0.5)) && (num > (k+0.0))){
                                    votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                } else if(num >= (k+0.6)){
                                    votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                } else {
                                    votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                }
                            }

                            if(locations[i][19] == 1){
                                favoriteIcon = "<span class='active'></span>";
                            } else {
                                favoriteIcon = "<span></span>";
                            }

                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                            }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 1 ) && ($scope.favAvailable == 0)){
                //filter with category (true) , subcategory(false), momosy card(true)
                //console.log('for cate+m card'+locations[i][8]+'id'+locations[i][10]+','+$scope.cateval+'sub'+locations[i][11]+','+$scope.subCateVal);
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                            // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = '';
                        if(locations[i][15] == null || locations[i][15] == ''){
                            shopCategoryVal = "<div class='category-dec blank'></div>";
                        } else {
                            shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                        }

                        votestructure = ''; 
                        var num = parseFloat(locations[i][14]).toFixed(1);

                        for(var k = 0; k < 5; k++){
                            if((num <= (k+0.5)) && (num > (k+0.0))){
                                votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                            } else if(num >= (k+0.6)){
                                votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                            } else {
                                votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                            }
                        }

                        if(locations[i][19] == 1){
                            favoriteIcon = "<span class='active'></span>";
                        } else {
                            favoriteIcon = "<span></span>";
                        }
                        if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                        } else {
                            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                        }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && (locations[i][11] != $scope.subCateVal && $scope.subCateVal != 'blank') && ($scope.cardAvailable == 0) && ($scope.favAvailable == 0)){
                //cate(true) subcate (true not equal) momosy (true 0) 
                $scope.searchAddStop = false;
            } else if((locations[i][10] != $scope.cateval && $scope.cateval != 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 0) && ($scope.favAvailable == 0)) {
                //cate(true not equal) subcate (true) momosy (true 0) 
                $scope.searchAddStop = false;
            } else if(($scope.cateval == 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 0 ) && ($scope.favAvailable == 0)){           
                //cate(false) subcate (false) momosy (true 0) 
                $scope.searchAddStop = false;
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 0 ) && ($scope.favAvailable == 0)){
                //filter with category (true) , subcategory(false), momosy card(true 0)
                $scope.searchAddStop = false;
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && (locations[i][11] == $scope.subCateVal && $scope.subCateVal != 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 0 ) && ($scope.favAvailable == 0)){
                //filter with category (true) , subcategory(true), momosy card(true 0)
                $scope.searchAddStop = false;
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 0 ) && ($scope.favAvailable == 1)){
                //filter with category (true) , subcategory(true), momosy card(true 0)
                $scope.searchAddStop = false;
            } else if(($scope.cateval == 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 0) && ($scope.favAvailable == 1 && locations[i][19] == 0)){           
                //cate(false) subcate (false) momosy (true 0) 
                $scope.searchAddStop = false;
            } else if(($scope.cateval == 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 0) && ($scope.favAvailable == 1 && locations[i][19] == 1)){           
                //cate(false) subcate (false) momosy (true 0) 
                $scope.searchAddStop = false;
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && (locations[i][11] == $scope.subCateVal && $scope.subCateVal != 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 1 ) && ($scope.favAvailable == 0)){
                //filter with category (true) , subcategory(true), momosy card(true 1)
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                           // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = '';
                            if(locations[i][15] == null || locations[i][15] == ''){
                                shopCategoryVal = "<div class='category-dec blank'></div>";
                            } else {
                                shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                            }

                            votestructure = ''; 
                            var num = parseFloat(locations[i][14]).toFixed(1);

                            for(var k = 0; k < 5; k++){
                                if((num <= (k+0.5)) && (num > (k+0.0))){
                                    votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                } else if(num >= (k+0.6)){
                                    votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                } else {
                                    votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                }
                            }

                            if(locations[i][19] == 1){
                                favoriteIcon = "<span class='active'></span>";
                            } else {
                                favoriteIcon = "<span></span>";
                            }

                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                            }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && (locations[i][11] == $scope.subCateVal && $scope.subCateVal != 'blank') && ($scope.cardAvailable == 1 && locations[i][12] == 1 ) && ($scope.favAvailable == 1 && locations[i][19]== 1)){
                //filter with category (true) , subcategory(true), momosy card(true 1), fav (true)
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                           // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = ''
                            if(locations[i][15] == null || locations[i][15] == ''){
                                shopCategoryVal = "<div class='category-dec blank'></div>";
                            } else {
                                shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                            }

                            votestructure = ''; 
                            var num = parseFloat(locations[i][14]).toFixed(1);

                            for(var k = 0; k < 5; k++){
                                if((num <= (k+0.5)) && (num > (k+0.0))){
                                    votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                } else if(num >= (k+0.6)){
                                    votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                } else {
                                    votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                }
                            }

                            if(locations[i][19] == 1){
                                favoriteIcon = "<span class='active'></span>";
                            } else {
                                favoriteIcon = "<span></span>";
                            }

                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                            }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && (locations[i][11] == $scope.subCateVal && $scope.subCateVal != 'blank') && ($scope.cardAvailable == 0) && ($scope.favAvailable == 1 && locations[i][19]== 1)){
                //filter with category (true) , subcategory(true), momosy card(false), fav (true)
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                           // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = '';
                            if(locations[i][15] == null || locations[i][15] == ''){
                                shopCategoryVal = "<div class='category-dec blank'></div>";
                            } else {
                                shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                            }

                            votestructure = ''; 
                            var num = parseFloat(locations[i][14]).toFixed(1);

                            for(var k = 0; k < 5; k++){
                                if((num <= (k+0.5)) && (num > (k+0.0))){
                                    votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                } else if(num >= (k+0.6)){
                                    votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                } else {
                                    votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                }
                            }

                            if(locations[i][19] == 1){
                                favoriteIcon = "<span class='active'></span>";
                            } else {
                                favoriteIcon = "<span></span>";
                            }

                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                            }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 0 ) && ($scope.favAvailable == 1 && locations[i][19]== 1)){
                //filter with category (true) , subcategory(true), momosy card(true 1), fav (true)
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                           // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = '';
                            if(locations[i][15] == null || locations[i][15] == ''){
                                shopCategoryVal = "<div class='category-dec blank'></div>";
                            } else {
                                shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                            }

                            votestructure = ''; 
                            var num = parseFloat(locations[i][14]).toFixed(1);

                            for(var k = 0; k < 5; k++){
                                if((num <= (k+0.5)) && (num > (k+0.0))){
                                    votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                } else if(num >= (k+0.6)){
                                    votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                } else {
                                    votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                }
                            }

                            if(locations[i][19] == 1){
                                favoriteIcon = "<span class='active'></span>";
                            } else {
                                favoriteIcon = "<span></span>";
                            }

                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                            }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if((locations[i][10] == $scope.cateval && $scope.cateval != 'blank') && ($scope.subCateVal == 'blank') && ($scope.cardAvailable == 1 &&  locations[i][12] == 0) && ($scope.favAvailable == 1 && locations[i][19]== 1)){
                //filter with category (true) , subcategory(true), momosy card(true 0), fav (true)
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
            
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                           // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = '';
                            if(locations[i][15] == null || locations[i][15] == ''){
                                shopCategoryVal = "<div class='category-dec blank'></div>";
                            } else {
                                shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                            }

                            votestructure = ''; 
                            var num = parseFloat(locations[i][14]).toFixed(1);

                            for(var k = 0; k < 5; k++){
                                if((num <= (k+0.5)) && (num > (k+0.0))){
                                    votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                } else if(num >= (k+0.6)){
                                    votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                } else {
                                    votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                }
                            }

                            if(locations[i][19] == 1){
                                favoriteIcon = "<span class='active'></span>";
                            } else {
                                favoriteIcon = "<span></span>";
                            }

                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                            }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if($scope.cateval == 'blank' && ($scope.favAvailable == 1 && locations[i][19]== 1)){
                //filter with category (true) , subcategory(true), momosy card(true 0), fav (true)
                if(locations[i][5] == 1) {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin2
                    });
                } else {
                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map,
                    icon :pin
                    });
                }
                
                filterArray.push(locations[i][8]);
                var arrData = new Array(locations[i][0], locations[i][1], locations[i][2], locations[i][3], locations[i][4], locations[i][5], locations[i][6], locations[i][7], locations[i][8], locations[i][9], locations[i][10],locations[i][11], locations[i][12] );
                filterAllData.push(arrData);
                $scope.searchAddStop = false;
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                            $scope.getstorecredit(locations[i][8]);
                            $scope.frindBoughtCount(locations[i][8]);
                           // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                            shopCategoryVal = '';
                            favoriteIcon = '';
                            if(locations[i][15] == null || locations[i][15] == ''){
                                shopCategoryVal = "<div class='category-dec blank'></div>";
                            } else {
                                shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                            }

                            votestructure = ''; 
                            var num = parseFloat(locations[i][14]).toFixed(1);

                            for(var k = 0; k < 5; k++){
                                if((num <= (k+0.5)) && (num > (k+0.0))){
                                    votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                } else if(num >= (k+0.6)){
                                    votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                } else {
                                    votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                }
                            }

                            if(locations[i][19] == 1){
                                favoriteIcon = "<span class='active'></span>";
                            } else {
                                favoriteIcon = "<span></span>";
                            }

                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                            }
                            infowindow.open(map, marker);
                    }
                })(marker, i));  
                filtermarker.push(marker);
            } else if($scope.cateval == 'blank' && $scope.cardAvailable == 0 && $scope.favAvailable == 0){
                //filter with category (false), subcategory(false), momosy card(false)
                $scope.catebg = '';
                $scope.subCateBg = '';
                markerClusterer = new MarkerClusterer(map, arrMarker, {
                //maxZoom: zoom,
                // gridSize: size
                // styles: styles[style]
                });
                $scope.searchAddStop = true;
                $scope.stopFilters();
                break;
            }
        }
        if($scope.searchAddStop == false) {
            //console.log(filterArray);
            if(filterArray.length == 0) {
                $('#results').html('<span>'+$scope.i18n.store.result_not_found+'</span>');
            } else {
                $('#results').html('<span>'+filterArray.length+' '+$scope.i18n.store.result_found+'</span>');
            }
            $scope.storeIdArray = filterArray;
            $scope.searchAddressShop(filterArray);
        } else {
                $('#results').html('');
        }
    }

    $scope.mapfilter = function() {
        if(markerClusterer){
            markerClusterer.setMap(null);
        }
        $scope.addressFilter = '';
        $scope.searchText = '';
        $scope.viewAllActive = '';
        $scope.myStoreActive = '';
        $scope.storeListObject = [];
        filterArray = [];
        var chk = document.getElementById("shotfilter").checked;
        var dpchk = document.getElementById("dpfilter").checked;
        $scope.setFilterMarker(null);
        if((chk == true) && (dpchk == false)){
            $scope.searchText = '';
            //markerClusterer.setMap(null);
            $scope.setShopNameMarker(null);
            $scope.setMyshop(null);
            $scope.setRemoveAllMap(null);
            $scope.setDpMarker(null);
            $scope.setAllMap(null);
            $scope.setDpShotMarker(null);
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var pin = {
                url: 'app/assets/images/green-pin.png'
            };
            var pin2 = {
                url: 'app/assets/images/silver-pin.png'
            };
            if(filterAllData.length != 0 || $scope.cardAvailable == 1 || $scope.cateval != 'blank'){
            //console.log('filter apply');
                for (i = 0; i < filterAllData.length; i++) {
                    //console.log(filterAllData[i][6]+'listofids'+filterAllData[i][8]);
                    if(filterAllData[i][6] == 1){
                        if(filterAllData[i][5] == 1) {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(filterAllData[i][1], filterAllData[i][2]),
                            map: map,
                            icon :pin2
                            });
                        } else {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(filterAllData[i][1], filterAllData[i][2]),
                            map: map,
                            icon :pin
                            });
                        }
                        filterArray.push(filterAllData[i][8]);
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                $scope.getstorecredit(locations[i][8]);
                                $scope.frindBoughtCount(locations[i][8]);
                               // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                                shopCategoryVal = '';
                                favoriteIcon = '';
                                if(locations[i][15] == null || locations[i][15] == ''){
                                    shopCategoryVal = "<div class='category-dec blank'></div>";
                                } else {
                                    shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                                }

                                votestructure = ''; 
                                var num = parseFloat(locations[i][14]).toFixed(1);

                                for(var k = 0; k < 5; k++){
                                    if((num <= (k+0.5)) && (num > (k+0.0))){
                                        votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                    } else if(num >= (k+0.6)){
                                        votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                    } else {
                                        votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                    }
                                }

                                if(locations[i][19] == 1){
                                    favoriteIcon = "<span class='active'></span>";
                                } else {
                                    favoriteIcon = "<span></span>";
                                }

                                if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                                } else {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                                }
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                        arrShotMarker.push(marker);            
                    }      
                }
            } else {
                for (i = 0; i < locations.length; i++) {
                    if(locations[i][6] == 1){
                        if(locations[i][5] == 1) {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                            icon :pin2
                            });
                        } else {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                            icon :pin
                            });
                        }
                        
                        filterArray.push(locations[i][8]);
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                $scope.getstorecredit(locations[i][8]);
                                $scope.frindBoughtCount(locations[i][8]);
                                // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                                shopCategoryVal = '';
                                favoriteIcon = '';
                                if(locations[i][15] == null || locations[i][15] == ''){
                                    shopCategoryVal = "<div class='category-dec blank'></div>";
                                } else {
                                    shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                                }

                                votestructure = ''; 
                                var num = parseFloat(locations[i][14]).toFixed(1);

                                for(var k = 0; k < 5; k++){
                                    if((num <= (k+0.5)) && (num > (k+0.0))){
                                        votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                    } else if(num >= (k+0.6)){
                                        votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                    } else {
                                        votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                    }
                                }

                                if(locations[i][19] == 1){
                                    favoriteIcon = "<span class='active'></span>";
                                } else {
                                    favoriteIcon = "<span></span>";
                                }

                                if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                                } else {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                                }
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                        arrShotMarker.push(marker);                
                    }      
                }
            }
            //$scope.searchshoponmaps(filterArray);
            limit_starts = 0;
            limit_end = 12;
            $scope.storeIdArray = filterArray;
            $scope.searchAddressShop(filterArray);
            if(filterArray.length == 0) {
                $('#results').html('<span>'+$scope.i18n.store.result_not_found+'</span>');
            } else {
                $('#results').html('<span>'+filterArray.length+' '+$scope.i18n.store.result_found+'</span>');
            }
        //markerClusterer.clearMarkers();
        /* markerClusterer = new MarkerClusterer(map, arrShotMarker, {
              //maxZoom: zoom,
             // gridSize: size
             // styles: styles[style]
            });
        */
        } else if((dpchk == true) && (chk == false)){
            //markerClusterer.setMap(null);
            $scope.setShopNameMarker(null);
            $scope.setRemoveAllMap(null);
            $scope.setDpShotMarker(null);
            $scope.setAllMap(null);
            $scope.setAllShotMap(null);
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var pin = {
                url: 'app/assets/images/green-pin.png'
            };
            var pin2 = {
                url: 'app/assets/images/silver-pin.png'
            };

            if(filterAllData.length != 0 || $scope.cardAvailable == 1 || $scope.cateval != 'blank'){
                for (i = 0; i < filterAllData.length; i++) {
                    if(filterAllData[i][7] == 1){
                        if(filterAllData[i][5] == 1) {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(filterAllData[i][1], filterAllData[i][2]),
                            map: map,
                            icon :pin2
                            });
                        } else {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(filterAllData[i][1], filterAllData[i][2]),
                            map: map,
                            icon :pin
                            });
                        }
                        
                        filterArray.push(filterAllData[i][8]);
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                $scope.getstorecredit(locations[i][8]);
                                $scope.frindBoughtCount(locations[i][8]);
                               // infowindow.setContent("<div>Name : <a href='#/shop/view/"+filterAllData[i][8]+"'>"+filterAllData[i][4]+"</a></div><div>Address : "+filterAllData[i][0]+"</div>");
                                shopCategoryVal = '';
                                favoriteIcon = '';
                                if(locations[i][15] == null || locations[i][15] == ''){
                                    shopCategoryVal = "<div class='category-dec blank'></div>";
                                } else {
                                    shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                                }

                                votestructure = ''; 
                                var num = parseFloat(locations[i][14]).toFixed(1);

                                for(var k = 0; k < 5; k++){
                                    if((num <= (k+0.5)) && (num > (k+0.0))){
                                        votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                    } else if(num >= (k+0.6)){
                                        votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                    } else {
                                        votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                    }
                                }

                                if(locations[i][19] == 1){
                                    favoriteIcon = "<span class='active'></span>";
                                } else {
                                    favoriteIcon = "<span></span>";
                                }

                                if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                                } else {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                                }
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                        arrDpMarker.push(marker);            
                    }  
                    //markerClusterer.clearMarkers();
                    /*
                    markerClusterer = new MarkerClusterer(map, arrDpMarker, {
                      //maxZoom: zoom,
                     // gridSize: size
                     // styles: styles[style]
                    }); */   
                }    
            } else {
                for (i = 0; i < locations.length; i++) {
                    if(locations[i][7] == 1){
                        if(locations[i][5] == 1) {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                            icon :pin2
                            });
                        } else {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                            icon :pin
                            });
                        }
                        
                        filterArray.push(locations[i][8]);
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                $scope.getstorecredit(locations[i][8]);
                                $scope.frindBoughtCount(locations[i][8]);
                               // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                                shopCategoryVal = '';
                                favoriteIcon = '';
                                if(locations[i][15] == null || locations[i][15] == ''){
                                    shopCategoryVal = "<div class='category-dec blank'></div>";
                                } else {
                                    shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                                }

                                votestructure = ''; 
                                var num = parseFloat(locations[i][14]).toFixed(1);

                                for(var k = 0; k < 5; k++){
                                    if((num <= (k+0.5)) && (num > (k+0.0))){
                                        votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                    } else if(num >= (k+0.6)){
                                        votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                    } else {
                                        votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                    }
                                }

                                if(locations[i][19] == 1){
                                    favoriteIcon = "<span class='active'></span>";
                                } else {
                                    favoriteIcon = "<span></span>";
                                }

                                if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                                } else {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                                }
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                        arrDpMarker.push(marker);                
                    }  
                //markerClusterer.clearMarkers();
                /*
                markerClusterer = new MarkerClusterer(map, arrDpMarker, {
                  //maxZoom: zoom,
                 // gridSize: size
                 // styles: styles[style]
                }); */   
                }
            }    
            //$scope.searchshoponmaps(filterArray);
            limit_starts = 0;
            limit_end = 12;
            $scope.storeIdArray = filterArray;
            $scope.searchAddressShop(filterArray);
            if(filterArray.length == 0) {
                $('#results').html('<span>'+$scope.i18n.store.result_not_found+'</span>');
            } else {
                $('#results').html('<span>'+filterArray.length+' '+$scope.i18n.store.result_found+'</span>');
            }
        } else if((chk == true) && (dpchk == true)){
            $scope.searchText = '';
            //markerClusterer.setMap(null);
            $scope.setShopNameMarker(null);
            $scope.setDpShotMarker(null);
            $scope.setAllMap(null);
            $scope.setAllShotMap(null);
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var pin = {
                url: 'app/assets/images/silver-pin.png'
            };
            var pin2 = {
                url: 'app/assets/images/silver-pin.png'
            };
            if(filterAllData.length != 0 || $scope.cardAvailable == 1 || $scope.cateval != 'blank') {
                //console.log('filter apply');
                for (i = 0; i < filterAllData.length; i++) {
                    if((filterAllData[i][7] == 1) || (filterAllData[i][6] == 1)){
                        if(filterAllData[i][5] == 1) {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(filterAllData[i][1], filterAllData[i][2]),
                            map: map,
                            icon :pin
                            });
                        } else {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(filterAllData[i][1], filterAllData[i][2]),
                            map: map,
                            icon :pin2
                            });
                        }
                          
                        filterArray.push(filterAllData[i][8]);
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                $scope.getstorecredit(locations[i][8]);
                                $scope.frindBoughtCount(locations[i][8]);
                                //infowindow.setContent("<div>Name : <a href='#/shop/view/"+filterAllData[i][8]+"'>"+filterAllData[i][4]+"</a></div><div>Address : "+filterAllData[i][0]+"</div>");
                                shopCategoryVal = '';
                                favoriteIcon = '';
                                if(locations[i][15] == null || locations[i][15] == ''){
                                    shopCategoryVal = "<div class='category-dec blank'></div>";
                                } else {
                                    shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                                }

                                votestructure = ''; 
                                var num = parseFloat(locations[i][14]).toFixed(1);

                                for(var k = 0; k < 5; k++){
                                    if((num <= (k+0.5)) && (num > (k+0.0))){
                                        votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                    } else if(num >= (k+0.6)){
                                        votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                    } else {
                                        votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                    }
                                }

                                if(locations[i][19] == 1){
                                    favoriteIcon = "<span class='active'></span>";
                                } else {
                                    favoriteIcon = "<span></span>";
                                }

                                if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                                } else {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                                }
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                        arrDpnShotMarker.push(marker);
                    } 
                    //markerClusterer.clearMarkers();
                    /*
                    markerClusterer = new MarkerClusterer(map, arrDpnShotMarker, {
                      //maxZoom: zoom,
                     // gridSize: size
                     // styles: styles[style]
                    }); */
                }
            } else {
                for (i = 0; i < locations.length; i++) {
                    if((locations[i][7] == 1) || (locations[i][6] == 1)){
                        if(locations[i][5] == 1) {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                            icon :pin
                            });
                        } else {
                            marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                            icon :pin2
                            });
                        }

                        filterArray.push(locations[i][8]);          
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                $scope.getstorecredit(locations[i][8]);
                                $scope.frindBoughtCount(locations[i][8]);
                                //infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
                                shopCategoryVal = '';
                                favoriteIcon = '';
                                if(locations[i][15] == null || locations[i][15] == ''){
                                    shopCategoryVal = "<div class='category-dec blank'></div>";
                                } else {
                                    shopCategoryVal = "<div class='category-dec'><strong>Category</strong> : "+locations[i][15]+"</div>";
                                }

                                votestructure = ''; 
                                var num = parseFloat(locations[i][14]).toFixed(1);

                                for(var k = 0; k < 5; k++){
                                    if((num <= (k+0.5)) && (num > (k+0.0))){
                                        votestructure += "<li class='half'><img src='app/assets/images/star-blank.png'></li>";
                                    } else if(num >= (k+0.6)){
                                        votestructure += "<li class='active'><img src='app/assets/images/star-blank.png'></li>";
                                    } else {
                                        votestructure += "<li><img src='app/assets/images/star-blank.png'></li>";   
                                    }
                                }

                                if(locations[i][19] == 1){
                                    favoriteIcon = "<span class='active'></span>";
                                } else {
                                    favoriteIcon = "<span></span>";
                                }

                                if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
                                } else {
                                    infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div>"+shopCategoryVal+"<div class='lower-cont'><div class='icon-section clearfix'><div class='favicon'>"+favoriteIcon+"</div><div class='fr-tr'><span class='img-fr'></span><span class='fr-num'>"+locations[i][20]+"</span></div></div><div class='vote-count'><ul>"+votestructure+"</ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
                                }
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                        arrDpnShotMarker.push(marker);
                    } 
                    //markerClusterer.clearMarkers();
                    /*
                    markerClusterer = new MarkerClusterer(map, arrDpnShotMarker, {
                      //maxZoom: zoom,
                     // gridSize: size
                     // styles: styles[style]
                    }); */
                }
            }  
            //$scope.searchshoponmaps(filterArray);
            limit_starts = 0;
            limit_end = 12;
            $scope.storeIdArray = filterArray;
            $scope.searchAddressShop(filterArray);
                if(filterArray.length == 0) {
                    $('#results').html('<span>'+$scope.i18n.store.result_not_found+'</span>');
                } else {
                    $('#results').html('<span>'+filterArray.length+' '+$scope.i18n.store.result_found+'</span>');
                }
        } else {
            if(circle != null) {
                circle.setMap(null);
            }
            $('#results').html('');
            $scope.addressFilter = '';
            $scope.searchText = '';
            //markerClusterer.setMap(null);
            $scope.setDpMarker(null);
            $scope.setDpShotMarker(null);
            $scope.setRemoveAllMap(null);
            $scope.setAllShotMap(null);
            $scope.enableFilter();
            //markerClusterer.clearMarkers();
            /*
            markerClusterer = new MarkerClusterer(map, arrMarker, {
              //maxZoom: zoom,
             // gridSize: size
             // styles: styles[style]
            });*/
        }  
    }
    //Map functionality ends
}]);

//Create Store controller here
app.controller('CreateStoreController',['$scope', '$http', '$location', '$timeout', 'StoreService', '$rootScope', '$cookieStore', function ($scope, $http, $location, $timeout, StoreService, $rootScope, $cookieStore) {
    $scope.createStoreLoader = false;
    $scope.createStoreError = false;
    $scope.createStoreErrorMgs = "";  //$scope.i18n.storealbum.album_ErrorMgs
    $scope.store = {};

    var opts1 = {};
    StoreService.getCountryList(opts1, function(data) {
        if(data.code == 101) {
            $scope.countryList = data.data;
        }
    });
    
    //function to create the Store
    $scope.createStore = function() {
        // $scope.store.business_country
        $scope.createStoreLoader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;

        if($scope.store.name == undefined || $scope.store.name == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_name;
            alert( $scope.createStoreErrorMgs );
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            return false;
        }else if($scope.store.business_name == undefined || $scope.store.business_name == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storename;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.legal_status == undefined || $scope.store.legal_status == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storestatus;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.business_type == undefined || $scope.store.business_type == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storetype;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.phone == undefined || $scope.store.phone == '' || isNaN($scope.store.phone) == true ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storenumber;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.email == undefined || $scope.store.email == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeemail;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.business_country == undefined || $scope.store.business_country == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storecountry;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.business_region == undefined || $scope.store.business_region == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeregion;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.business_city == undefined || $scope.store.business_city == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storecity;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.business_address == undefined || $scope.store.business_address == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeaddress;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.zip == '' || $scope.store.zip == undefined) {
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storezip;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.province == '' || $scope.store.province == undefined) {
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeprovince;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        } else if($scope.store.province.length < 2 || $scope.store.province.length > 2 ){
            $scope.createStoreErrorMgs = $scope.i18n.validation.province_length;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.vat_number == undefined || $scope.store.vat_number == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storevat;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.iban == undefined || $scope.store.iban == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeiban;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if($scope.store.description == undefined || $scope.store.description == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storedesc;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        // }else if($scope.store.terms == '' || $scope.store.terms == undefined || $scope.store.terms == false) {
        //     $scope.createStoreErrorMgs = $scope.i18n.store.terms_condition_agree;
        //     $scope.createGroupError = true;
        //     $scope.createStoreLoader = false;
        //     return false;
        }else if((document.getElementById("latitude").value) == undefined || (document.getElementById("latitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storelat;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if((document.getElementById("longitude").value) == undefined || (document.getElementById("longitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storelog;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
            return false;
        }else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storemap;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
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
        }    
        opts.name = $scope.store.name;
        opts.business_name = $scope.store.business_name;
        opts.legal_status = $scope.store.legal_status;
        opts.business_type = $scope.store.business_type;
        opts.phone = $scope.store.phone;
        opts.email = $scope.store.email;
        opts.business_country = $scope.store.business_country;
        opts.business_region = $scope.store.business_region;
        opts.business_city = $scope.store.business_city;
        opts.business_address = $scope.store.business_address;
        opts.zip = $scope.store.zip;
        opts.province = $scope.store.province;
        opts.vat_number = $scope.store.vat_number;
        opts.iban = $scope.store.iban;
        opts.description = $scope.store.description;
        opts.terms = $scope.store.terms;
        opts.referral_id = $scope.store.referral_id;
        opts.map_place = document.getElementById("mapplace").value;
        opts.latitude = document.getElementById("latitude").value; 
        opts.longitude = document.getElementById("longitude").value;
        opts.broker_id = $scope.store.broker_id;
        $scope.createStoreErrorMgs = '';
        StoreService.createStore(opts, function(data) {
            if(data.code == 101) {
                $scope.createStoreLoader = true;
                $rootScope.tempStoreId = data.data.store_id;
                // Put store id in cookie
                $cookieStore.put('tempStoreId',data.data.store_id);
                // now it will redirect to terms and condition $location.path("/myshops");
                $location.path("/shop/payment/2");
            } else if (data.code == 154) {
                $scope.createStoreLoader = false;
                $scope.createStoreErrorMgs = $scope.i18n.validation.citizen_not_exists;
                $scope.createStoreError = true;
            }else if (data.code == 100) {
                $scope.createStoreLoader = false;
                $scope.createStoreErrorMgs = $scope.i18n.validation.missed_param;
                $scope.createStoreError = true;
            }else if (data.code == 116) {
                $scope.createStoreLoader = false;
                $scope.createStoreErrorMgs = $scope.i18n.validation.enter_businessname;
                $scope.createStoreError = true;
            }else if (data.code == 138) {
                $scope.createStoreLoader = false;
                $scope.createStoreErrorMgs = $scope.i18n.validation.vat_exists;
                $scope.createStoreError = true;
            } else if (data.code == 85) {
                $scope.createStoreLoader = false;
                $scope.createStoreErrorMgs = $scope.i18n.validation.account_inactive;
                $scope.createStoreError = true;
            } else if (data.code == 165) {
                $scope.createStoreLoader = false;
                $scope.createStoreErrorMgs = $scope.i18n.validation.vat_valid;
                $scope.createStoreError = true;
            } else if (data.code == 166) {
                $scope.createStoreLoader = false;
                $scope.createStoreErrorMgs = $scope.i18n.validation.iban_valid;
                $scope.createStoreError = true;
            } else {
                $scope.createStoreLoader = false;
                $scope.createStoreError = true;
            }

            $timeout(function(){
                $scope.createStoreErrorMgs = '';
            }, 15000);
        });
    };

    $scope.resetStoreObject = function() {
        document.getElementById("mapplace").value = '';
        document.getElementById("latitude").value = ''; 
        document.getElementById("longitude").value = '';
        $scope.store = {};
    };

    $scope.loadMap = function() {
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
                    document.getElementById("latitude").value = marker.getPosition().lat();
                    document.getElementById("longitude").value = marker.getPosition().lng();
                    $scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }
    }

    $scope.mapLocation = function(mapLatitude, mapLogitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
        geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $('#mapplace').val(results[1].formatted_address);
            } else {
                alert($scope.i18n.storealbum.album_alert_msg);
            }
        } else {
            alert($scope.i18n.storealbum.album_alert_failed + status);
        }
        });
    };
    $scope.loadMap();

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
            document.getElementById("latitude").value = countryPlace.geometry.location.k;
            document.getElementById("longitude").value = countryPlace.geometry.location.D;
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

//Create Store controller here
app.controller('DeatilStoreController', ['$rootScope', '$route', '$scope', '$http', '$sce', '$routeParams', '$location', '$timeout', 'StoreService', 'fileReader', 'ProfileService', 'focus', 'CommerialService', 'StoreWalletService', 'StorePaymentService', '$window', function ($rootScope, $route, $scope, $http, $sce, $routeParams, $location, $timeout, StoreService, fileReader, ProfileService, focus ,CommerialService, StoreWalletService, StorePaymentService, $window) {
    $scope.$route = $route;
    $scope.storeMainId = $routeParams.id;
    var latitudeMap = 0;
    var longitudeMap = 0;
    $scope.keywordList = [];
    $scope.mobileAppUrl = '<li> Fits true to size. Take your normal size\r</li>';
    var tempcat = '';
    $scope.store = {}
    $scope.store.storecategory = '';
    $scope.store.sale_subcatid = '';
    $scope.legalForms = APP.legalForms;
    $scope.countries  = APP.countries;
    $scope.isMyShop = APP.currentUser.store_profile;
    $scope.regions = APP.regions;
    $scope.loadDetails = function() {
        $scope.storeLoading = true;
        $scope.updateStart = false;
        $scope.createStoreError = false;
        $scope.createStoreErrorMgs = ''; //$scope.i18n.storealbum.album_createStoreErrorMgs;
        $scope.showEditForm = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $routeParams.id;
        StoreService.getStoreDetail(opts, function(data) {
            $scope.localShopId = data.data.id;
            if(data.code == 101) {
                if( data.data.owner_id == APP.currentUser.id && (data.data.new_contract_status == 0 )) {
                    $location.path("/edit/shop/"+$scope.localShopId);
                } else if( data.data.owner_id == APP.currentUser.id && (data.data.new_contract_status == 1 && ((data.data.credit_card_status == 1 && data.data.shop_status == 0) || (data.data.credit_card_status == 0 && data.data.shop_status == 0)))) {
                    //Make a payment for a shop is this case
                    var sopts = {};
                    sopts.shop_id = $scope.localShopId;
                    sopts.user_id = APP.currentUser.id;
                    sopts.cancel_url = APP.payment.siteDomain + '#/shop/wallet/'+ $scope.localShopId; 
                    sopts.return_url = APP.payment.siteDomain + '#/shop/wallet/'+ $scope.localShopId; 
                    console.log(sopts);
                    StoreWalletService.getRecurringPaymenturls(sopts, function(data) { 
                        if(data.code == 101) {
                            $window.location.href = data.data.url;
                        }else{ 
                            $location.path("shop/"+$scope.localShopId+"/contract");    
                        }
                    }); 
                } else if( data.data.owner_id == APP.currentUser.id && (data.data.new_contract_status == 1 && data.data.credit_card_status == 0 && data.data.shop_status == 1)) {
                    //get one click payment method for this case
                    var popts = {};
                    popts.profile_id = $scope.localShopId;
                    popts.user_id    = APP.currentUser.id;
                    popts.cancel_url = APP.payment.siteDomain + '#/shop/paycancel'; 
                    popts.return_url = APP.payment.siteDomain + '#/shop/paysuccess'; 
                    popts.payment_type = APP.card.add_type;

                    StorePaymentService.getOneClickPaymentUrls(popts, function(data) {  
                        if(data.code == 101) {
                            $window.location.href = data.data.url;
                        } else { 
                            $location.path("shop/"+$scope.localShopId+"/contract");
                        } 
                    });
                } else {
                    $scope.storeDetail = data.data;
                    $scope.store = $scope.storeDetail;
                    //set the shop name and shop id to get on other section of app
                    var tempopts = {};
                    tempopts.id = data.data.id;
                    tempopts.store_name = data.data.name;
                    tempopts.is_paypal_added = data.data.is_paypal_added;
                    tempopts.is_subscribed = data.data.is_subscribed;
                    StoreService.SetStoreData(tempopts);
                    $scope.store.confirmemail = $scope.storeDetail.email;
                    if($rootScope.mobileView == true){
                        img = null;
                        img = new Image();
                        img.src = $scope.storeDetail.cover_image_path;
                        if($scope.windowWidth <= '480'){
                            img.onload = function(){
                                if(img.width <= 910){
                                    if( $scope.storeDetail.y_cord != ""){
                                        if( $scope.storeDetail.y_cord > 100){
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 3;
                                        }else{
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 4;
                                        }
                                        $scope.mobileShopX_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width > 910 && img.width <= 1300){
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 4;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width > 1300 ){
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 6;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }
                            }
                        }else if($scope.windowWidth > '480' && $scope.windowWidth <= '768'){
                            img.onload = function(){
                                if(img.width <= 910){
                                    if( $scope.storeDetail.y_cord != ""){
                                        if( $scope.storeDetail.y_cord > 100){
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 1.8;
                                        }else{
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 2;
                                        }
                                        $scope.mobileShopX_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width > 910 && img.width < 1300){
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.00;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.20;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width > 1300) {
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.80;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 3.00;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }
                            }
                        }
                    }
                    
                    //seting kewyord list to show store data
                    if($scope.storeDetail.shop_keyword != '' && $scope.storeDetail.shop_keyword != undefined && $scope.storeDetail.shop_keyword != null){
                        $scope.keywordList = $scope.storeDetail.shop_keyword.split(',');
                    }
                    //seting dropdowns to show store data
                    var tempcat = $scope.storeDetail.sale_catid;
                    $scope.store.storecategory = {"id":parseInt($scope.storeDetail.sale_catid)};
                    $scope.getSubCategory();
                    $scope.store.subcategory = {"id":parseInt($scope.storeDetail.sale_subcatid)};
                    $scope.store.legal_status = {"id":$scope.storeDetail.legal_status};
                    $scope.store.regOfficeCountry = {"id":$scope.storeDetail.business_country};
                    $scope.store.sale_country = {"id":$scope.storeDetail.sale_country};
                    $scope.store.regOfficeCountry = {"id":$scope.storeDetail.business_country};
                    $scope.store.business_region = {"id":$scope.checkRegionExist(APP.regions, $scope.storeDetail.business_region)};
                    $scope.store.sale_region = {"id":$scope.checkRegionExist(APP.regions, $scope.storeDetail.sale_region)};
                    if($scope.store.repres_dob != '' && $scope.store.repres_dob != undefined && $scope.store.repres_dob != null) {
                        //console.log($scope.store.repres_dob.date.substring(0,10));
                        var DOB = $scope.store.repres_dob.substring(0,10);
                        var dtArray = DOB.split("-");
                        var dtDay = parseInt(dtArray[2]);
                        var dtMonth = parseInt(dtArray[1]);
                        var dtYear = parseInt(dtArray[0]);
                       
                        $scope.store.dobMonth = $scope.months[dtMonth-1];
                        $scope.store.dobYear = {"id":dtYear};
                        Leap(dtYear);
                        $scope.store.dobDay = dtDay;
                        //console.log(dtYear);
                    }
                    document.getElementById("latitude").value = $scope.storeDetail.latitude;
                    document.getElementById("longitude").value = $scope.storeDetail.longitude;
                    document.getElementById("mapplace").value = $scope.storeDetail.map_place;
                    $scope.aboutStore();
                    $scope.storeLoading = false;
                    latitudeMap = data.data.latitude;
                    longitudeMap = data.data.longitude;
                    angular.element('#pac-input').val(data.data.map_place);
                    if (($location.path().indexOf("/shop/edit") != -1) ||  ($location.path().indexOf("/shop/view") != -1)) {
                        $timeout(function() {
                          $scope.initialize();
                        },  1000); 
                       
                    } else {
                       $timeout(function() {
                          // $scope.initializeMaps();
                        },  1000); 
                    }
                    var storeData = {};
                    storeData.storeId = $scope.storeDetail.owner_id;
                    //call service to get mobile app
                    var mopts = {};
                    mopts.store_id = $scope.storeDetail.id;
                    mopts.session_id = APP.currentUser.id;
                    StoreService.getMobileAppUrl(mopts, function(data) {
                        if(data.code == 101) {
                            $scope.store.mobileAppUrl =  data.data.url;
                        } else {
                            $scope.store.mobileAppUrl = '';
                        }
                    });
                    //mobile app get url end here

                    StoreService.setStoreOwnerId(storeData, function(data) {            
                    });
                }
            } else {
                $scope.storeLoading = false;
                $scope.createStoreError = true;
            }
        });
    }

    $scope.checkRegionExist = function(p, k) {
        for(var i=0;i<p.length;i++){
            var obj = p[i];
            if (obj['id'] === k) {
                return k;
            }        
        }
        return undefined;
    }

    $scope.$watch('currentLanguage', function(newValue, oldValue) {
        $timeout(function(){
            $scope.months = $scope.i18n.profile.months;
        },400);
    });

    $scope.loadDetails();

    $scope.editStore = function() {
        $scope.createStoreLoader = false;
        $scope.store = $scope.storeDetail;
        //$scope.showEditForm = true;
        $scope.timelineActive = false;
        $scope.timelineActive1 = false;
        var opts = {};
        StoreService.getCountryList(opts, function(data) {
            if(data.code == 101) {
                $scope.countryList = data.data;

            }
        });
    };

    $scope.aboutStore = function() {
        $scope.store = $scope.storeDetail;
        var opts = {};
        StoreService.getCountryList(opts, function(data) {
            if(data.code == 101) {
                $scope.countryList = data.data;

            }
        });
    };
    
    $scope.vatNumberInvalid = false;
    $scope.ibanNumberInvalid = false;
    $scope.updateEditStore = function() {
        $scope.updateStart = true;
        $scope.formSubmitted = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.store.id;
        if($scope.store.name == undefined || $scope.store.name == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.storename.$dirty = true;
            $scope.shopEditForm.storename.$invalid = true;
            $scope.shopEditForm.storename.$error.required = true;
            focus('storename');
            return false;
        } else if($scope.store.business_name == undefined || $scope.store.business_name == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.business_name.$dirty = true;
            $scope.shopEditForm.business_name.$invalid = true;
            $scope.shopEditForm.business_name.$error.required = true;
            focus('business_name');
            return false;
        } else if($scope.store.legal_status == undefined || $scope.store.legal_status == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.legal_status.$dirty = true;
            $scope.shopEditForm.legal_status.$invalid = true;
            $scope.shopEditForm.legal_status.$error.required = true;
            focus('legal_status');
            return false;
        } else if($scope.store.vat_number == undefined || $scope.store.vat_number == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.vatNumber.$dirty = true;
            $scope.shopEditForm.vatNumber.$invalid = true;
            $scope.shopEditForm.vatNumber.$error.required = true;
            focus('vatNumber');
            return false;
        } else if($scope.store.fiscal_code == undefined || $scope.store.fiscal_code == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.fiscalcode.$dirty = true;
            $scope.shopEditForm.fiscalcode.$invalid = true;
            $scope.shopEditForm.fiscalcode.$error.required = true;
            focus('fiscalcode');
            return false;
        } else if($scope.store.email == undefined || $scope.store.email == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.shopemail.$dirty = true;
            $scope.shopEditForm.shopemail.$invalid = true;
            $scope.shopEditForm.shopemail.$error.required = true;
            focus('shopemail');
            return false;
        } else if($scope.store.confirmemail == undefined || $scope.store.confirmemail == '' || ($scope.store.email !== $scope.store.confirmemail)){
            $scope.inputname = "confirmemail";
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.confirmemail.$dirty = true;
            $scope.shopEditForm.confirmemail.$invalid = true;
            $scope.shopEditForm.confirmemail.$error.required = true;
            focus('confirmemail');
            return false;
        } else if($scope.store.phone == undefined || $scope.store.phone == '' || isNaN($scope.store.phone) == true){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.shopphone.$dirty = true;
            $scope.shopEditForm.shopphone.$invalid = true;
            $scope.shopEditForm.shopphone.$error.required = true;
            focus('shopphone');
            return false;
        } else if($scope.store.iban == undefined || $scope.store.iban == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.iban.$dirty = true;
            $scope.shopEditForm.iban.$invalid = true;
            $scope.shopEditForm.iban.$error.required = true;
            focus('iban');
            return false;
        } else if($scope.store.storecategory == undefined || $scope.store.storecategory == ''){
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
            $scope.shopEditForm.storecategory.$dirty = true;
            $scope.shopEditForm.storecategory.$invalid = true;
            $scope.shopEditForm.storecategory.$error.required = true;
            focus('storecategory');
            return false;
        } 
        // else if($scope.store.subcategory == undefined || $scope.store.subcategory == ''){
        //     $scope.createStoreErrorMgs = $scope.i18n.store.enter_storesubcategory;
        //     $scope.createStoreError = true;
        //     $scope.createStoreLoader = false;
        //     $timeout(function(){
        //         $scope.createStoreErrorMgs = '';
        //     }, 15000);
        //     return false;
        // } 
        else if($scope.store.description == undefined || $scope.store.description == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.description.$dirty = true;
            $scope.shopEditForm.description.$invalid = true;
            $scope.shopEditForm.description.$error.required = true;
            focus('description');
            return false;
        } else if($scope.store.regOfficeCountry == undefined || $scope.store.regOfficeCountry == ''){
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
            $scope.shopEditForm.regofficecountry.$dirty = true;
            $scope.shopEditForm.regofficecountry.$invalid = true;
            $scope.shopEditForm.regofficecountry.$error.required = true;
            focus('regofficecountry');
            return false;
        } else if($scope.store.business_region.id == undefined || $scope.store.business_region.id == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.businessregion.$dirty = true;
            $scope.shopEditForm.businessregion.$invalid = true;
            $scope.shopEditForm.businessregion.$error.required = true;
            focus('businessregion');
            return false;
        } else if($scope.store.business_city == undefined || $scope.store.business_city == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.businesscity.$dirty = true;
            $scope.shopEditForm.businesscity.$invalid = true;
            $scope.shopEditForm.businesscity.$error.required = true;
            focus('businesscity');
            return false;
        } else if($scope.store.province == undefined || $scope.store.province == '' ){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.province.$dirty = true;
            $scope.shopEditForm.province.$invalid = true;
            $scope.shopEditForm.province.$error.required = true;
            focus('province');
            return false;
        }  else if($scope.store.province.length < 2 || $scope.store.province.length > 2 ){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.province.$dirty = true;
            $scope.shopEditForm.province.$invalid = true;
            $scope.shopEditForm.province.$error.required = true;
            focus('province');
            return false;
        } else if($scope.store.zip == undefined || $scope.store.zip == '' || $scope.store.zip.length < 5 || $scope.store.zip.length > 5 ){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.regofficezip.$dirty = true;
            $scope.shopEditForm.regofficezip.$invalid = true;
            $scope.shopEditForm.regofficezip.$error.required = true;
            focus('regofficezip');
            return false;
        } else if($scope.store.business_address == undefined || $scope.store.business_address == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.businessaddress.$dirty = true;
            $scope.shopEditForm.businessaddress.$invalid = true;
            $scope.shopEditForm.businessaddress.$error.required = true;
            focus('businessaddress');
            return false;
        }  else if($scope.store.sale_country == undefined || $scope.store.sale_country == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salecountry.$dirty = true;
            $scope.shopEditForm.salecountry.$invalid = true;
            $scope.shopEditForm.salecountry.$error.required = true;
            focus('salecountry');
            return false;
        } else if($scope.store.sale_region.id == undefined || $scope.store.sale_region.id == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleregion.$dirty = true;
            $scope.shopEditForm.saleregion.$invalid = true;
            $scope.shopEditForm.saleregion.$error.required = true;
            focus('saleregion');
            return false;
        } else if($scope.store.sale_city == undefined || $scope.store.sale_city == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salecity.$dirty = true;
            $scope.shopEditForm.salecity.$invalid = true;
            $scope.shopEditForm.salecity.$error.required = true;
            focus('salecity');
            return false;
        } else if($scope.store.sale_province == undefined || $scope.store.sale_province == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleprovince.$dirty = true;
            $scope.shopEditForm.saleprovince.$invalid = true;
            $scope.shopEditForm.saleprovince.$error.required = true;
            focus('saleprovince');
            return false;
        } else if($scope.store.sale_province.length < 2 || $scope.store.sale_province.length > 2){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleprovince.$dirty = true;
            $scope.shopEditForm.saleprovince.$invalid = true;
            $scope.shopEditForm.saleprovince.$error.required = true;
            focus('saleprovince');
            return false;
        }else if($scope.store.sale_zip == undefined || $scope.store.sale_zip == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salezip.$dirty = true;
            $scope.shopEditForm.salezip.$invalid = true;
            $scope.shopEditForm.salezip.$error.required = true;
            focus('salezip');
            return false;
        } else if($scope.store.sale_zip.length < 5 || $scope.store.sale_zip.length > 5){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salezip.$dirty = true;
            $scope.shopEditForm.salezip.$invalid = true;
            $scope.shopEditForm.salezip.$error.required = true;
            focus('salezip');
            return false;
        } else if($scope.store.sale_address == undefined || $scope.store.sale_address == ''){
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleaddress.$dirty = true;
            $scope.shopEditForm.saleaddress.$invalid = true;
            $scope.shopEditForm.saleaddress.$error.required = true;
            focus('saleaddress');
            return false;
        } else if((document.getElementById("latitude").value) == undefined || (document.getElementById("latitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storelat;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if((document.getElementById("longitude").value )== undefined || (document.getElementById("longitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storelog;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storemap;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.sale_email == undefined || $scope.store.sale_email == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstoreemail;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleemail.$dirty = true;
            $scope.shopEditForm.saleemail.$invalid = true;
            $scope.shopEditForm.saleemail.$error.required = true;
            focus('saleemail');
            return false;
        } else if($scope.store.sale_phone_number == undefined || $scope.store.sale_phone_number == '' || isNaN($scope.store.sale_phone_number) == true){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstorephone;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salephonenumber.$dirty = true;
            $scope.shopEditForm.salephonenumber.$invalid = true;
            $scope.shopEditForm.salephonenumber.$error.required = true;
            focus('salephonenumber');
            return false;
        } else if($scope.store.repres_fiscal_code == undefined || $scope.store.repres_fiscal_code == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_legalTaxCode;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represfiscalcode.$dirty = true;
            $scope.shopEditForm.represfiscalcode.$invalid = true;
            $scope.shopEditForm.represfiscalcode.$error.required = true;
            focus('represfiscalcode');
            return false;
        } else if($scope.store.repres_first_name == undefined || $scope.store.repres_first_name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_firstName;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represfname.$dirty = true;
            $scope.shopEditForm.represfname.$invalid = true;
            $scope.shopEditForm.represfname.$error.required = true;
            focus('represfname'); 
            return false;
        } else if($scope.store.repres_last_name == undefined || $scope.store.repres_last_name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_lastName;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represlname.$dirty = true;
            $scope.shopEditForm.represlname.$invalid = true;
            $scope.shopEditForm.represlname.$error.required = true;
            focus('represlname'); 
            return false;
        } else if($scope.store.repres_place_of_birth == undefined || $scope.store.repres_place_of_birth == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_legalBirthPlace;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represdobplace.$dirty = true;
            $scope.shopEditForm.represdobplace.$invalid = true;
            $scope.shopEditForm.represdobplace.$error.required = true;
            focus('represdobplace'); 
            return false;
        } else if($scope.store.dobDay == undefined || $scope.store.dobDay == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntDd;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.dobday.$dirty = true;
            $scope.shopEditForm.dobday.$invalid = true;
            $scope.shopEditForm.dobday.$error.required = true;
            focus('dobday'); 
            return false;
        } else if($scope.store.dobMonth == undefined || $scope.store.dobMonth == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntMonth;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.dobmonth.$dirty = true;
            $scope.shopEditForm.dobmonth.$invalid = true;
            $scope.shopEditForm.dobmonth.$error.required = true;
            focus('dobmonth'); 
            return false;
        } else if($scope.store.dobYear == undefined || $scope.store.dobYear == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntYear;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.dobyear.$dirty = true;
            $scope.shopEditForm.dobyear.$invalid = true;
            $scope.shopEditForm.dobyear.$error.required = true;
            focus('dobyear'); 
            return false;
        } else if($scope.store.repres_email == undefined || $scope.store.repres_email == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_legalEmail;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represemail.$dirty = true;
            $scope.shopEditForm.represemail.$invalid = true;
            $scope.shopEditForm.represemail.$error.required = true;
            focus('represemail'); 
            return false;
        } else if($scope.store.repres_phone_number == undefined || $scope.store.repres_phone_number == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_legalPhone;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represphonenumber.$dirty = true;
            $scope.shopEditForm.represphonenumber.$invalid = true;
            $scope.shopEditForm.represphonenumber.$error.required = true;
            focus('represphonenumber'); 
            return false;
        } else if($scope.store.repres_address == undefined || $scope.store.repres_address == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntAddress;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represaddress.$dirty = true;
            $scope.shopEditForm.represaddress.$invalid = true;
            $scope.shopEditForm.represaddress.$error.required = true;
            focus('represaddress'); 
            return false;
        } else if($scope.store.repres_province == undefined || $scope.store.repres_province == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntProvince;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.shopEditForm.represprovince.$dirty = true;
            $scope.shopEditForm.represprovince.$invalid = true;
            $scope.shopEditForm.represprovince.$error.required = true;
            focus('represprovince'); 
            return false;
        } else if($scope.store.repres_province.length < 2 || $scope.store.repres_province.length > 2 ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntProvince;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.shopEditForm.represprovince.$dirty = true;
            $scope.shopEditForm.represprovince.$invalid = true;
            $scope.shopEditForm.represprovince.$error.required = true;
            focus('represprovince'); 
            return false;
        } else if($scope.store.repres_city == undefined || $scope.store.repres_city == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntCity;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
            $scope.shopEditForm.represcity.$dirty = true;
            $scope.shopEditForm.represcity.$invalid = true;
            $scope.shopEditForm.represcity.$error.required = true;
            focus('represcity'); 
            return false;
        } else if($scope.store.repres_zip == undefined || $scope.store.repres_zip == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntZip;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
            $scope.shopEditForm.represzip.$dirty = true;
            $scope.shopEditForm.represzip.$invalid = true;
            $scope.shopEditForm.represzip.$error.required = true;
            focus('represzip'); 
            return false;
        } else if($scope.store.dobYear != undefined || $scope.store.dobYear != ''){
            if($scope.store.dobDay.id >= 29 && $scope.store.dobMonth.id == 2){
                $scope.createStoreErrorMgs = $scope.i18n.shop_affiliation.detail.enter_correct_dob;
                $scope.createStoreError = true;
                $scope.createStoreLoader = false;
                $scope.updateStart = false;
                $scope.shopEditForm.dobmonth.$dirty = true;
                $scope.shopEditForm.dobmonth.$invalid = true;
                $scope.shopEditForm.dobmonth.$error.required = true;
                focus('dobmonth'); 
                return false;
            }
        } else if($scope.store.dobYear != undefined || $scope.store.dobYear != ''){
            var isLeap = new Date($scope.store.dobYear.id, 1, 29).getMonth() == 1;
            if(isLeap == false && $scope.store.dobDay.id >= 29 && $scope.store.dobMonth.id == 2){
                $scope.createStoreErrorMgs = $scope.i18n.shop_affiliation.detail.enter_correct_dob;
                $scope.createStoreError = true;
                $scope.createStoreLoader = false;
                $scope.updateStart = false;
                $scope.shopEditForm.dobyear.$dirty = true;
                $scope.shopEditForm.dobyear.$invalid = true;
                $scope.shopEditForm.dobyear.$error.required = true;
                focus('dobyear');
                return false;
            }
        }
        var dd = $scope.store.dobDay;
        var month = $scope.store.dobMonth.value +'-';
        var year = $scope.store.dobYear.id +'-';
        $scope.store.dob = year.concat(month,dd);
        opts.name = $scope.store.name;
        opts.business_name = $scope.store.business_name;
        opts.legal_status = $scope.store.legal_status.id;
        opts.vat_number = $scope.store.vat_number;
        opts.fiscal_code = $scope.store.fiscal_code;
        opts.email = angular.lowercase($scope.store.email);
        opts.phone = $scope.store.phone;
        opts.iban = $scope.store.iban;
        opts.sale_catid = $scope.store.storecategory.id;
        
        if($scope.store.subcategory != undefined || $scope.store.subcategory.id != '0') {
            opts.sale_subcatid = $scope.store.subcategory.id;
        } else {
            opts.sale_subcatid = null;
        }
        
        if($scope.keywordList != undefined || $scope.keywordList.length != '0') {
            opts.shop_keyword = $scope.keywordList.join();
        } else {
            opts.shop_keyword = []; 
        }
        opts.description = $scope.store.description;
        opts.business_country = $scope.store.regOfficeCountry.id;
        opts.business_region = $scope.store.business_region.id;
        opts.business_city = $scope.store.business_city;
        opts.province = $scope.store.province;
        opts.zip = $scope.store.zip;
        opts.business_address = $scope.store.business_address;
        
        opts.sale_country = $scope.store.sale_country.id;
        opts.sale_region = $scope.store.sale_region.id;
        opts.sale_city = $scope.store.sale_city;
        opts.sale_province = $scope.store.sale_province;
        opts.sale_zip = $scope.store.sale_zip;
        opts.sale_address = $scope.store.sale_address;
        opts.map_place = document.getElementById("mapplace").value;
        opts.latitude = document.getElementById("latitude").value; 
        opts.longitude = document.getElementById("longitude").value; 
        opts.sale_map = document.getElementById("mapplace").value;
        opts.sale_email = angular.lowercase($scope.store.sale_email);
        opts.sale_phone_number = $scope.store.sale_phone_number;
        opts.repres_fiscal_code = $scope.store.repres_fiscal_code;
        opts.repres_first_name = $scope.store.repres_first_name;
        opts.repres_last_name = $scope.store.repres_last_name;
        opts.repres_place_of_birth = $scope.store.repres_place_of_birth;
        opts.repres_dob = $scope.store.dob;
        opts.repres_email = angular.lowercase($scope.store.repres_email);
        opts.repres_phone_number = $scope.store.repres_phone_number;
        opts.repres_address = $scope.store.repres_address;
        opts.repres_province = $scope.store.repres_province;
        opts.repres_city = $scope.store.repres_city;
        opts.repres_zip = $scope.store.repres_zip;
        opts.referral_id = $scope.store.referral_info.id;
        opts.call_type = 3;
        opts.business_type = 'not in current use';
        opts.sale_description = 'not in current use';
        opts.allow_access = $scope.store.is_allowed;
        $scope.createStoreErrorMgs = ''; 
        StoreService.updateStore(opts, function(data) {
            if(data.code == 101) {
                $scope.updateStart = false;
                $scope.showEditForm = false;
                $scope.createStoreLoader = false;
                $scope.createGroupSuccess = true;
                $scope.createStoreSuccessMgs = $scope.i18n.albums.update_sucess;
                $timeout(function(){
                   $scope.createStoreSuccessMgs = ''; 
                }, 15000);
                $location.path("/shop/edit/"+$scope.store.id);
            } else if(data.code == 137){   
                $scope.createStoreErrorMgs = $scope.i18n.validation.broker_not_exists;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.createStoreError = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            } else if(data.code == 100){
                $scope.createStoreErrorMgs = $scope.i18n.validation.missed_param;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            } else if(data.code == 90){    
                $scope.createStoreErrorMgs = $scope.i18n.validation.account_inactive;
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            } else if(data.code == 91){
                $scope.createStoreErrorMgs = $scope.i18n.validation.vat_exists;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.vatNumberInvalid = true;
                $timeout(function(){
                    $scope.vatNumberInvalid = false;
                }, 3000);
                focus('vatNumber');
            } else if(data.code == 126){
                $scope.createStoreErrorMgs = $scope.i18n.validation.invalid_store_forum_type;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            } else if(data.code == 500){
                $scope.createStoreErrorMgs = $scope.i18n.validation.permission_denied;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            } else if(data.code == 89){
                $scope.createStoreErrorMgs = $scope.i18n.validation.error_occured;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            } else if(data.code == 165){
                $scope.createStoreErrorMgs = $scope.i18n.validation.vat_valid;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.vatNumberInvalid = true;
                $timeout(function(){
                    $scope.vatNumberInvalid = false;
                }, 3000);
                focus('vatNumber');
            } else if(data.code == 166){
                $scope.createStoreErrorMgs = $scope.i18n.validation.iban_valid;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.ibanNumberInvalid = true;
                $timeout(function(){
                    $scope.ibanNumberInvalid = false;
                }, 3000);
                focus('iban');
            } else {
                $scope.createStoreErrorMgs = data.message;  
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.createStoreError = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            }
        });
    };
    // Code for cancel payment in cartasi //
    if($location.search().txn_id){
        $scope.tranId = $location.search().txn_id;
       
        var formData = {};
        formData.user_id = APP.currentUser.id;
        formData.txn_id = $scope.tranId;
        formData.status = "CANCEL";
        CommerialService.returnPaymentCancel(formData, function(data) { 
        if(data.code == 101) {
           $location.search({});
        }else { 
          
        }
        
        });    
    };


    $scope.initializeMaps = function () {
        var myLatLng = new google.maps.LatLng(latitudeMap, longitudeMap);
        var mapOptions = {
           center: new google.maps.LatLng(latitudeMap, longitudeMap),
           zoom: 6
        };
       var map = new google.maps.Map(document.getElementById('map-canvas-second'),mapOptions);
       var marker = new google.maps.Marker({
           position: new google.maps.LatLng(latitudeMap, longitudeMap),
           map: map,
           title: $scope.store.map_place
        });
    };


    $('.member-store').click(function() {
        $(this).addClass('active');
        $('.store-invitations li').removeClass('active');
    });

    $scope.cancelEditStore = function() {
        $scope.showEditForm = false;
        $location.path("/shop/about/"+$scope.store.id);
        //$scope.store = {};
    };

    $scope.loadEditMap = function() { 
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
                    document.getElementById("latitude").value = marker.getPosition().lat();
                    document.getElementById("longitude").value = marker.getPosition().lng();
                    $scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }
    }
    $scope.loadEditMap();
    /*$scope.mapLocation = function(mapLatitude, mapLogitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
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
    };*/
    $scope.initialize = function () {
        var myLatlng = new google.maps.LatLng(latitudeMap, longitudeMap);
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
            position:myLatlng,
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
            document.getElementById("latitude").value = countryPlace.geometry.location.k;
            document.getElementById("longitude").value = countryPlace.geometry.location.D;
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
    $scope.initializeWait = function(){
        $timeout(function() {
           // $scope.initialize();
        }, 1000);
    }

    $scope.showInvite = false;
    $scope.timelineActive = false;
    $scope.toggleInvite = function(){
       
        $scope.timelineActive = !$scope.timelineActive;
        $scope.uploadProfileImage = false;
        $scope.showInvite = !$scope.showInvite;
        $scope.timelineActive1 = false;
        $scope.showEditForm=false;
        //alert(timelineActive);
        
    }

    $scope.uploadProfileImage = false;
    $scope.toggleUploadImage = function() {
        $scope.showInvite = false;
        $scope.uploadProfileImage = !$scope.uploadProfileImage;
    };

    $scope.uploadStoreProfile = false;
    $scope.uploadProfileerror = false;
    $scope.uploadStoreProfileImage = function() { 
        $scope.uploadStoreProfile = true;
        var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
        // Checking Extension
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            $scope.uploadProfileErrorMsg = $scope.i18n.storealbum.album_uploadProfileErrorMsg;
            $scope.uploadStoreProfile = false;
            $scope.uploadProfileerror = true;
        } else {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_id = $scope.storeDetail.id;
            StoreService.uploadStoreProfileimage(opts, $scope.myFile, function(data) {
                if(data.code == 101) {
                    $scope.uploadProfileImage = false;
                    $scope.uploadStoreProfile = false;
                    $scope.storeDetail.cover_image_path = data.data.cover_image_path;
                    $scope.storeDetail.profile_image_original = data.data.original_image_path;
                    //$scope.loadDetails();
                } else {
                    $scope.uploadStoreProfile = false;
                }

            });
        }

    };

    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.invalidCoverImage = false;
    if($scope.i18n.storealbum == undefined){
        $scope.invalidCoverImageMgs = "Please choose an image that is at least 910 pixels wide and at least 400 pixels tall";
    } else{
        $scope.invalidCoverImageMgs = $scope.i18n.storealbum.album_invalidCoverImageMgs;
    }
    
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                $scope.uploadProfileErrorMsg = $scope.i18n.storealbum.album_uploadProfileErrorMsg;
                $scope.uploadStoreProfile = false;
                $scope.uploadProfileerror = true;
            } else {
                $scope.uploadStoreProfile = false;
                $scope.uploadProfileerror = false;

                $scope.readImage($scope.myFile, function(data){
                if(data.length != 0 && data.width >= 910 && data.height >= 400){
                    $scope.uploadStoreProfileImage();
                }
                else { 
                    $("#invalidCoverImage").show();
                    $timeout(function(){
                        $("#invalidCoverImage").hide();
                    }, 4000);
                }
            });
            }
        });
    };

    //function to check upload image dimenstions
    $scope.readImage = function(file, callback) {
    var reader = new FileReader();
    var image  = new Image();
    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        var filedata = {};
        image.src    = _file.target.result;
        image.onload = function() {
            var w = this.width,
                h = this.height,
                t = file.type,                     
                n = file.name,
                s = ~~(file.size/1024) +'KB';
                filedata['width'] = w;
                filedata['height'] = h;
                callback(filedata);
        };
        image.onerror= function() {
            callback(filedata);
        };      
    };
    }
    $scope.timelineActive1=false;
    $scope.showAllStoreMember = false;
    $scope.showAllMembers = function() {
        $scope.showAllStoreMember = !$scope.showAllStoreMember;
        $scope.timelineActive1 = !$scope.timelineActive1;
        $scope.timelineActive = false;
        $scope.showEditForm=false;
    }; 

    // for category and subcategory of the shop edit
    // creating category drop down
    $scope.$watch('currentLanguage', function(newValue, oldValue) {
        $scope.searchCategory(newValue);
        if(tempcat != '' && tempcat != 0){
            $scope.getSubCategory();
        }
    });
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

    $scope.subcategoryLoader = false;
    $scope.getSubCategory = function(){
        $scope.subcategoryLoader = true;
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
                $scope.subcategoryLoader = false;
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

    $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    $scope.Result = 0;
    function Leap(Year){
        if ( (Year % 4) == 0){
            if ( (Year % 100) == 0) {
                $scope.Result = ( (Year % 400) == 0);
            }else{
                $scope.Result = 1;
            }
        }else{
            $scope.Result = 0;
        }
        $scope.monthChange();
    }

    $scope.$watch('store.dobYear', function(val){    
        if($scope.store.dobYear != undefined){        
            Leap(val.value);
        }
    });
      
    $scope.monthChange = function(){
        //$scope.leapYear = Leap($scope.years);
            if($scope.store.dobMonth === undefined || $scope.store.dobMonth === "" || $scope.store.dobMonth === null){
            }else{
                var normalValue = $scope.store.dobMonth.value-1;
                if(normalValue <= 6){ 
                    if(normalValue % 2 == 0){
                        $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
                    }else if(($scope.store.dobMonth.value-1) == 1){
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
            $scope.years.push({"id":i,"value":i});
        }
    }
    $scope.getyears();
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
                if($scope.store.keywords.trim() !== ''){
                   var opts = {};
                        opts.user_id = APP.currentUser.id;
                        opts.keyword = $scope.store.keywords;

                    ProfileService.addKeywords(opts,function(data){
                        // if(data.code === 101 && data.message === 'SUCCESS'){
                        // }
                    });
               }
               $scope.storeKeyword($scope.store.keywords);
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
    $scope.store.keywords = "";
    $scope.keywordList = [];
    $scope.storeKeyword = function(index){
        $scope.keywords = [];
        $scope.keywordIndex = -1;
        $scope.store.keywords = "";
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
        var keyIndex = $scope.keywordList.indexOf(index);
        $scope.keywordList.splice(index,1);
    };

}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

//Create Store controller here
app.controller('CreateChildStore',['$scope', '$http', '$routeParams', '$location', '$timeout', 'StoreService', function ($scope, $http, $routeParams, $location, $timeout, StoreService) {
    $scope.createStoreLoader = false;
    $scope.createStoreError = false;
    $scope.createStoreErrorMgs = "";
    $scope.store = {};

    var opts1 = {};
    StoreService.getCountryList(opts1, function(data) {
        if(data.code == 101) {
            $scope.countryList = data.data;
        }
    });
    $scope.createChildStore = function() { 
        var storeParentId = $routeParams.id;
        if($scope.store.phone == undefined || $scope.store.phone == ''){
            $scope.createStoreError = true;
            $scope.createStoreErrorMgs = $scope.i18n.storealbum.album_ErrorMgsphone;
            return false;
        }else if($scope.store.zip == undefined || $scope.store.zip == ''){
            $scope.createStoreError = true;
            $scope.createStoreErrorMgs = $scope.i18n.storealbum.album_ErrorMgszip;
            return false;
        }
        $scope.createStoreLoader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.business_name = $scope.store.business_name;
        opts.parent_store_id = storeParentId;
        opts.legal_status = $scope.store.legal_status;
        opts.business_type = $scope.store.business_type;
        opts.phone = $scope.store.phone;
        opts.email = $scope.store.email;
        opts.business_country = $scope.store.business_country;
        opts.business_region = $scope.store.business_region;
        opts.business_city = $scope.store.business_city;
        opts.business_address = $scope.store.business_address;
        opts.zip = $scope.store.zip;
        opts.province = $scope.store.province;
        opts.vat_number = $scope.store.vat_number;
        opts.iban = $scope.store.iban;
        opts.description = $scope.store.description;
        opts.map_place = document.getElementById("mapplace").value;
        opts.latitude = document.getElementById("latitude").value; 
        opts.longitude = document.getElementById("longitude").value;
        
        StoreService.createChildStore(opts, function(data) {
            if(data.code == 101) {
                $scope.createStoreLoader = true;
                $location.path("/shop/view/"+storeParentId);
            } else {    
                $scope.createStoreLoader = false;
                $scope.createStoreError = true;
                $scope.createStoreErrorMgs = $scope.i18n.storealbum.album_ErrorMgs;

            }
        });
    };

    $scope.resetStoreObject = function() { 
        document.getElementById("mapplace").value = '';
        document.getElementById("latitude").value = ''; 
        document.getElementById("longitude").value = '';
        $scope.store = {};
    };

    $scope.updateChildStore = function() {
        //alert("update for call")
    };

    $scope.cancelChildStore = function() {
        $scope.showEditForm = false;
        $scope.editStoreObject = {};
    };
    /*$scope.loadMap = function() {
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
                    document.getElementById("latitude").value = marker.getPosition().lat();
                    document.getElementById("longitude").value = marker.getPosition().lng();
                    $scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }
    };

    $scope.mapLocation = function(mapLatitude, mapLogitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
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
    };

    $scope.loadMap();*/

    $scope.initialize = function () {
        var mapOptions = {
            center: new google.maps.LatLng(-33.8688, 151.2195),
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
            document.getElementById("latitude").value = countryPlace.geometry.location.k;
            document.getElementById("longitude").value = countryPlace.geometry.location.D;
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
    
    if(JSON.stringify(APP.currentUser) != "{}"){
        $timeout(function(){
            $scope.initialize();
        }, 1000);
    }
}]);

app.controller('StoreLeftController',['$scope', '$http', 'StoreService', function ($scope, $http, StoreService) {
        $scope.showLeftPanel = false;
        $scope.storeNotFound = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_type = 2;
        opts.limit_start = '';
        opts.limit_size = '';
        StoreService.getAllStoreWithChild(opts, function(data) {  
            if(data.code == 101) {
                if(data.data.stores.length != 0 ) {
                    $scope.storeLeftList =  data.data.stores;
                    $scope.storeNotFound = false;
                }
                else {
                    $scope.storeNotFound = true;
                    $scope.storeLeftList =  data.data.stores; 
                }
            } else if(data.code == 100) { 
                $scope.storeNotFound = true;
            } else {
                $scope.storeNotFound = true;
            }
            $scope.showLeftPanel = true;
        });
}]);

//Controller to handle the store notiication
app.controller('StoreNotificationController',['$scope', '$http', 'StoreService', function ($scope, $http, StoreService) {
    $scope.getStoreNotification = function() {
        $scope.NotificationFound = false;
        $scope.NotificationNotFound = false;
        opts = {};
        opts.user_id = APP.currentUser.id;
        StoreService.getStoreNotifications(opts, function(data) {
            if(data.code == 101) {
                if(data.data.length != 0) {
                    $scope.storeNotification = data.data;
                    $scope.NotificationFound = true;
                } else {
                    $scope.NotificationNotFound = true;
                }
            } else {
                $scope.NotificationNotFound = true;
            }
        });
    };

    $scope.getStoreNotification();
    $scope.AcceptRequest = function(storeId, requestId, id) {
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.store_id = storeId;
        opts.response = 1;
        StoreService.acceptDenyToStoreNotification(opts, function(data) {
            if(data.code == 101) {
                $scope.getStoreNotification();
            } else {

            }
        });
    };

    $scope.rejectRequest = function(storeId, requestId, id) { 
        $("#noti-"+id).fadeOut(1000);
        opts = {};
        opts.user_id = APP.currentUser.id;
        opts.request_id = requestId;
        opts.store_id = storeId;
        opts.response = 2;
        StoreService.acceptDenyToStoreNotification(opts, function(data) {
            if(data.code == 101) {
                $scope.getStoreNotification();
            } else {

            }
        });
    }; 

}]);

/**
* Controller for autocomplete functionality
*
*/
app.controller('AutocompleteController',['$scope', '$http', '$timeout', 'StoreService', function ($scope, $http, $timeout, StoreService) {
    $scope.searchLoading = false;
    $scope.msgAfterInvite = '';
    $scope.searchedUsers = [];
    $scope.searchUsers = function() {
        $scope.msgAfterInvite = '';
        $scope.searchLoading = true;
        if($scope.selectedCountries !== '') {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.friend_name = ($scope.selectedCountries === undefined ? '' : $scope.selectedCountries);
            opts.limit_start = APP.user_list_pagination.start;
            opts.limit_size = APP.user_list_pagination.end;
            StoreService.searchUser(opts, function(data) {
                $scope.searchLoading = false;
                $scope.searchedUsers = [];
                if(data.code == 101) {
                    var response = data.data.users;
                    for(var i = 0; i < data.data.users.length; i++) {
                        var user = {};
                        user.capital = response[i].user_id;
                        user.country = response[i].user_name;
                        $scope.searchedUsers.push(user);
                    }
                } else {
                    $scope.searchedUsers = [];
                }
            });
        }
    }

    $scope.InviteSendButton = false;
    $scope.onSelectPart = function() {
        $scope.InviteSendButton = true;
    };
    $scope.onSelectPartCancel = function() {
        $scope.InviteSendButton = false;
        $scope.selectedCountries = '';
    };

    $scope.SentInviteFromStore = function() {
        $scope.searchLoading = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.storeDetail.id;
        opts.friend_id = $scope.selectedCountries.capital;
        StoreService.inviteUserOnStore(opts, function(data) {
            $scope.searchLoading = false;
            $scope.InviteSendButton = false;
            $scope.selectedCountries = '';
            if(data.code = 101) {
                $scope.msgAfterInvite = $scope.i18n.storealbum.album_msgAfterInvite;
                $timeout(function(){
                    $scope.msgAfterInvite = '';
                }, 2000);
            } else if(data.code == 118) {
                $scope.msgAfterInvite = data.message;
                $timeout(function(){
                    $scope.msgAfterInvite = '';
                }, 2000);
            } else {
                $scope.msgAfterInvite = data.message;
                $timeout(function(){
                    $scope.msgAfterInvite = '';
                }, 2000);
            }
        });
    };

}]);

app.controller('MyShopController',['$scope', '$http', '$timeout', 'StoreService', '$location', '$routeParams', function ($scope, $http, $timeout, StoreService, $location, $routeParams) {
    $scope.storeListObject  = [];
    $scope.storeMyList      = [];
    $scope.storeAllList     = [];
    $scope.totalSize        = 0;
    $scope.myTotalSize      = 0;
    $scope.storeLoading     = true;
    $scope.notFound         = false;
    $scope.Res              = 1;
    $scope.listActive       = 'active';
    $scope.gridActive       = '';
    $scope.firstPage        = APP.store_list_pagination.end;
    $scope.itemsPerPage     = APP.store_list_pagination.end;
    $scope.currentPage      = 1;
    $scope.range            = [];
    $scope.affilateShop     = false;
    $scope.searchText       = '';
    if($routeParams.type == "1"){
        $scope.viewAllActive    = '';
        $scope.myStoreActive    = 'current';
        $scope.favShopActive    = '';
        $scope.tab              = 'myStore';
    }else{
        $scope.viewAllActive    = '';
        $scope.myStoreActive    = '';
        $scope.favShopActive    = 'current';
        $scope.tab              = 'favStore';
    }

    var DELAY_TIME_BEFORE_POSTING = 300;
    var currentTimeout = null;

    $scope.changePageMore = function(pageNo) {
        $scope.currentPage = pageNo;
        $scope.getShop($scope.tab, $scope.itemsPerPage);
    };
    
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
        $scope.getShop($scope.tab,  $scope.itemsPerPage);
    };

    $scope.paginate = function() {
       $scope.currentPage = 1; 
    }

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 1 ? "disabled" : "";
    };
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalItems) {
            $scope.currentPage++;
        }
        $('ul.pagination li.active:gt(3)').hide();
        $scope.getShop($scope.tab,  $scope.itemsPerPage);
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        $scope.getShop($scope.tab,  $scope.itemsPerPage);
    };

    $scope.changeView = function(layout) {
        if(layout == 'grid'){
            $scope.gridActive = 'active'; 
            $scope.listActive = ''; 
        } else if(layout == 'list'){
            $scope.listActive = 'active'; 
            $scope.gridActive = '';
        }
    };

    $('#shopserchbox').keypress(function() {
        $scope.currentPage = 1; 
        var model = $scope.searchText;
        if(currentTimeout) {
            $timeout.cancel(currentTimeout);
        }
        currentTimeout = $timeout(function(){
            //if(model.length >= 2 || model.length == 0) {
                $scope.getShop($scope.tab,  $scope.itemsPerPage);
            //}
        }, DELAY_TIME_BEFORE_POSTING)
    });

    $scope.getShop = function(activeTab, itemsPerPage){
        $scope.viewAllActive    = '';
        $scope.myStoreActive    = '';
        $scope.favShopActive    = '';
        $scope.tab              = activeTab;
        var limit_start = ($scope.currentPage-1)*itemsPerPage;
        var opts = {};
            opts.user_id        = APP.currentUser.id;
            opts.search_text    = $scope.searchText;
            opts.lang_code      = $scope.activeLanguage;
            if(activeTab === 'myStore'){
                opts.store_type = 2;     
            }else{
                opts.store_type = 1;   
            }
            if(activeTab === 'favStore'){
                opts.only_in_favorite = 1;
            }else{
                opts.only_in_favorite = 0;
            }
            opts.limits = {};
            opts.limits.limit_start = limit_start;
            opts.limits.limit_size  = itemsPerPage; 

        if(activeTab === 'myStore'){
            $scope.myStoreActive    = 'current';
        }else if(activeTab === 'favStore'){
            $scope.favShopActive    = 'current';
        }else{
            $scope.viewAllActive    = 'current';
        }    
        
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.Res == 1) {
            $scope.storeLoading     = true
            StoreService.getShops(opts, function(data) {
                $scope.affilateShop = true;
                $scope.storeLoading = false;
                if(data.code == 101) {
                    $scope.Res = 1;
                    if(data.data.length > 0 || data.data["stores"] != undefined){
                        $scope.totalSize        = data.data.size;
                        $scope.storeListObject  =  $scope.storeAllList = data.data.stores;
                        $scope.totalItems       = Math.ceil(data.data.size/itemsPerPage); 
                        $scope.range = [];  
                        for (var i=1; i<=$scope.totalItems; i++) {
                            $scope.range.push(i);
                        }             
                        $scope.notFound  = false;
                    }else{
                        $scope.notFound  = true;
                        $scope.range     = [];
                        $scope.storeListObject = [];
                    }
                }else if(data.code == 121) {
                    $scope.storeListObject  =  [];
                    $scope.notFound         = true;
                    $scope.storeLoading     = false;
                    $scope.Res              = 1; 
                }
                else {
                    $scope.storeListObject  =  [];
                    $scope.notFound         = true;
                    $scope.storeLoading     = false;
                    $scope.Res              = 1; 
                }
            });
        }
    };


    $scope.deleteStore = function(id, parentId) { 
        $("#store" + id).hide();
        $("#storedelete" + id).show();
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = id;
        //opts.store_type = (parentId) ? 2 : 1; condition changed on 14 jan
        opts.store_type = 1; // store type 1 for parent store delete
        StoreService.deleteStore(opts, function(data) {
            if(data.code == 101) {
                $(".storecoverid" + id).hide();
            } else {
                $("#store" + id).show();
                $("#storedelete" + id).hide();
            }
        });
    };
    
    $scope.FavouriteStores = function(activeTab, storeId , element){
        var opts = {};
            opts.user_id  = APP.currentUser.id;
            opts.store_id = storeId;

            if($(element.target).hasClass('active')){
                StoreService.unfavouritestores(opts, function(data) {
                    if(data.code == 101){
                        $(element.target).removeClass('active');
                        if(activeTab == 'favStore') {
                            $scope.tab = 'favStore';
                            $scope.getShop($scope.tab, $scope.itemsPerPage);
                        }   
                    }
                });
            }else{
                StoreService.favouritestores(opts, function(data) {
                    if(data.code == 101){
                        $(element.target).addClass('active');
                        if(activeTab == 'favStore') {
                            $scope.tab = 'favStore';
                            $scope.getShop($scope.tab, $scope.itemsPerPage);
                        }
                    }
                });                    
            }
    };

    $scope.getShop($scope.tab, $scope.itemsPerPage);
}]);

app.controller('DetailStoreCoverController', ['$rootScope', '$route', '$scope', '$http', '$sce', '$routeParams', '$location', '$timeout', 'StoreService', 'fileReader', 'ProfileService', 'storeShopHistorySelection', 'StoreWalletService', 'StorePaymentService', '$window', function ($rootScope, $route, $scope, $http, $sce, $routeParams, $location, $timeout, StoreService, fileReader ,ProfileService, storeShopHistorySelection, StoreWalletService, StorePaymentService, $window) {
    $scope.$route = $route;
    $scope.storeMainId = $routeParams.id;
    var latitudeMap = 0;
    var longitudeMap = 0;
    $scope.isMyShop = APP.currentUser.store_profile;
    $scope.mobileAppUrl = '<li> Fits true to size. Take your normal size\r</li>';

    //Broadcast from storealbum controller
    $scope.$on('updateShopProfileCover', function(event, imgData) { 
        $scope.storeDetail.cover_image_path = imgData.cover_image_path;
        $scope.storeDetail.profile_image_original = imgData.original_image_path;
        $scope.storeDetail.media_id = imgData.media_id;
        $scope.coverLoadHide = false;
        $scope.fileUrl = "";
        $timeout(function(){
            $scope.repositionImage();
        },50);
     });
    $scope.loadalbumimages =function(){
     var opts = {};
        opts.store_id = $routeParams.id; 
        opts.session_id = APP.currentUser.id;
        opts.limit_start = APP.store_latest_images.start;
        opts.limit_size =  APP.store_latest_images.end;
        StoreService.getLatestAlbumList(opts, function(data) {
            if(data.code == 101) {
                $scope.storelatest =  data.data.media;
            } else {
                $scope.storelatest = '';
            }
            });
    };
    $scope.displayLoader = false;
    //shop follow service
    $scope.followshops = function() {
        $scope.displayLoader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.shop_id = $scope.storeMainId;
        StoreService.followshops(opts, function(data) {
            $scope.displayLoader = false;
            if(data.code == 101) {
                $scope.followDisplay = 1;
            }
        });
    };

    $scope.unfollowshops = function() {
        $scope.displayLoader = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.shop_id = $scope.storeMainId;
        StoreService.unfollowshops(opts, function(data) {
            $scope.displayLoader = false;
            if(data.code == 101) {
                $scope.followDisplay = 0;
            }
        });
    };

    //Get friend count on store
    $scope.frindBoughtCount = function() {  
        var opts = {};
        opts = {"function":"UtilityService.friendsShoppingCount", "parameters":[{"asArray":true,"shop_id":[$scope.storeMainId],"citizen_id":String(APP.currentUser.id)}]}
        //calling the comment service to delete the selected comment 
        StoreService.frindboughtcount(opts, function(data){
            if(data.response === undefined || data.response === ''){
                $scope.frcount = 0;   
            } else {
                $scope.frcount = data.response[0].count;   
            }
        });
    };
    if($location.path().indexOf("/shop/view") != -1 || $location.path().indexOf("/shop/about") != -1) {
        $scope.frindBoughtCount();
    }
    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth = newValue.w;
        if($scope.windowWidth <= '780'){
            $rootScope.mobileView = true; //declare in main controller            
        } else {
            $rootScope.mobileView = false; //declare in main controller
        }
    }, true);
    var img = new Image();
    $scope.mobileShopX_Cord = 0;
    $scope.mobileShopY_Cord = 0;
    $scope.loadDetails = function() {
        $scope.storeLoading = true;
        $scope.updateStart = false;
        $scope.createStoreError = false;
        $scope.createStoreErrorMgs = ''; 
        $scope.showEditForm = false;
        $scope.countryList = APP.countries;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $routeParams.id;
        StoreService.getStoreDetail(opts, function(data) {
            $scope.localShopId = data.data.id;
            if(data.code == 101) {
                if( data.data.owner_id == APP.currentUser.id && (data.data.new_contract_status == 0 )) {
                    $location.path("/edit/shop/"+$scope.localShopId);
                } else if( data.data.owner_id == APP.currentUser.id && (data.data.new_contract_status == 1 && ((data.data.credit_card_status == 1 && data.data.shop_status == 0) || (data.data.credit_card_status == 0 && data.data.shop_status == 0)))) {
                    //Make a payment for a shop is this case
                    var sopts = {};
                    sopts.shop_id = $scope.localShopId;
                    sopts.user_id = APP.currentUser.id;
                    sopts.cancel_url = APP.payment.siteDomain + '#/shop/wallet/'+ $scope.localShopId; 
                    sopts.return_url = APP.payment.siteDomain + '#/shop/wallet/'+ $scope.localShopId; 
                    StoreWalletService.getRecurringPaymenturls(sopts, function(data) { 
                        if(data.code == 101) {
                            $window.location.href = data.data.url;
                        }else{ 
                            $location.path("shop/"+$scope.localShopId+"/contract");    
                        }
                    }); 
                } else if( data.data.owner_id == APP.currentUser.id && (data.data.new_contract_status == 1 && data.data.credit_card_status == 0 && data.data.shop_status == 1)) {
                    //get one click payment method for this case
                    var popts = {};
                    popts.profile_id = $scope.localShopId;
                    popts.user_id    = APP.currentUser.id;
                    popts.cancel_url = APP.payment.siteDomain + '#/shop/paycancel'; 
                    popts.return_url = APP.payment.siteDomain + '#/shop/paysuccess'; 
                    popts.payment_type = APP.card.add_type;

                    StorePaymentService.getOneClickPaymentUrls(popts, function(data) {  
                        if(data.code == 101) {
                            $window.location.href = data.data.url;
                        } else { 
                            $location.path("shop/"+$scope.localShopId+"/contract");
                        } 
                    });
                } else {
                    $scope.storeDetail = data.data;
                    $scope.$broadcast('update_parent', $scope.storeDetail);
                    
                    $scope.store = $scope.storeDetail;
                    var tempopts = {};
                    tempopts.id = data.data.id;
                    tempopts.store_name = data.data.name;
                    tempopts.is_subscribed = data.data.is_subscribed;
                    tempopts.is_paypal_added = data.data.is_paypal_added;
                    StoreService.SetStoreData(tempopts);
                    if($scope.storeDetail.is_following == 1){
                        $scope.followDisplay = 1;
                    } else {
                        $scope.followDisplay = 0;
                    }
                    if($rootScope.mobileView == true){
                        img = null;
                        img = new Image();
                        img.src = $scope.storeDetail.cover_image_path;
                        img.onload = function(){
                            if($scope.windowWidth <= '480'){
                                if(img.width <= 910){
                                    if( $scope.storeDetail.y_cord != ""){
                                        if( $scope.storeDetail.y_cord > 100){
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 3;
                                        }else{
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 4;
                                        }
                                        $scope.mobileShopX_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width > 910 && img.width <= 1300){
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 4;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width > 1300){
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 6;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }
                            }else if($scope.windowWidth > '480' && $scope.windowWidth <= '768'){
                                if(img.width <= 910){
                                    if( $scope.storeDetail.y_cord != ""){
                                        if( $scope.storeDetail.y_cord > 100){
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 1.8;
                                        }else{
                                            $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 2;
                                        }
                                        $scope.mobileShopX_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width >  910 && img.width <=1300){
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.00;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.20;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }else if(img.width > 1300){
                                    if( $scope.storeDetail.x_cord != ""){
                                        if( $scope.storeDetail.x_cord > 100){
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.80;
                                        }else{
                                            $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 3.00;
                                        }
                                        $scope.mobileShopY_Cord = 0;
                                    }else{
                                        $scope.storeDetail.x_cord = 0;
                                        $scope.storeDetail.y_cord = 0;
                                        $scope.mobileShopX_Cord = 0;
                                        $scope.mobileShopY_Cord = 0;
                                    }
                                }
                            }
                        }
                    }
                    $scope.aboutStore();
                    $scope.storeLoading = false;
                    latitudeMap = data.data.latitude;
                    longitudeMap = data.data.longitude;
                    if (($location.path().indexOf("/shop/edit") != -1) ||  ($location.path().indexOf("/shop/view") != -1) ) {
                        $timeout(function() {
                          // $scope.initialize();
                        },  1000); 
                       
                    } else {
                       $timeout(function() {
                          $scope.initializeMaps();
                        },  1000); 
                    }
                    //get dynamic values 
                    //get country name 
                    $scope.store.business_country = $scope.getCountryName(APP.countries, data.data.business_country);
                    $scope.store.legal_status = $scope.getLegalForm(APP.legalForms, data.data.legal_status);
                    $scope.store.sale_country = $scope.getCountryName(APP.countries, data.data.sale_country);
                    $scope.store.business_region = $scope.getRegionName(APP.regions, data.data.business_region);
                    $scope.store.sale_region = $scope.getRegionName(APP.regions, data.data.sale_region);
                    $scope.getShopCategory();
                    $scope.getShopSubCategory();
                    var storeData = {};
                    storeData.storeId = $scope.storeDetail.owner_id;
                    //call service to get mobile app
                    var mopts = {};
                    mopts.store_id = $scope.storeDetail.id;
                    mopts.session_id = APP.currentUser.id;
                    StoreService.getMobileAppUrl(mopts, function(data) {
                        if(data.code == 101) {
                            $scope.store.mobileAppUrl =  data.data.url;
                        } else {
                            $scope.store.mobileAppUrl = '';
                        }
                    });
                }
            } else {
                $scope.storeLoading = false;
                $scope.createStoreError = true;
            }
        });
    };

    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth = newValue.w;
        if($scope.windowWidth <= '768'){
            if($rootScope.mobileView == true){
                $timeout(function(){
                    $scope.resizeMediaCoordinate();
                },1000);
            }
            $rootScope.mobileView = true; //declare in main controller         
        } else {
            $rootScope.mobileView = false; //declare in main controller
        }
    }, true);
    var img = new Image();
    $scope.mobileShopX_Cord = 0;
    $scope.mobileShopY_Cord = 0;

    $scope.resizeMediaCoordinate = function(){
        if($scope.storeDetail != undefined){
            img = null;
            img = new Image();
            img.src = $scope.storeDetail.cover_image_path;
            if($scope.windowWidth <= '480'){
                img.onload = function(){
                    if(img.width <= 910){
                        if( $scope.storeDetail.y_cord != ""){
                            if( $scope.storeDetail.y_cord > 100){
                                $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 3;
                            }else{
                                $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 4;
                            }
                            $scope.mobileShopX_Cord = 0;
                        }else{
                            $scope.storeDetail.x_cord = 0;
                            $scope.storeDetail.y_cord = 0;
                            $scope.mobileShopX_Cord = 0;
                            $scope.mobileShopY_Cord = 0;
                        }
                    }else if(img.width > 910 && img.width <= 1300){
                        if( $scope.storeDetail.x_cord != ""){
                            if( $scope.storeDetail.x_cord > 100){
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 4;
                            }else{
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                            }
                            $scope.mobileShopY_Cord = 0;
                        }else{
                            $scope.storeDetail.x_cord = 0;
                            $scope.storeDetail.y_cord = 0;
                            $scope.mobileShopX_Cord = 0;
                            $scope.mobileShopY_Cord = 0;
                        }
                    }else if(img.width > 1300){
                        if( $scope.storeDetail.x_cord != ""){
                            if( $scope.storeDetail.x_cord > 100){
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                            }else{
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 6;
                            }
                            $scope.mobileShopY_Cord = 0;
                        }else{
                            $scope.storeDetail.x_cord = 0;
                            $scope.storeDetail.y_cord = 0;
                            $scope.mobileShopX_Cord = 0;
                            $scope.mobileShopY_Cord = 0;
                        }
                    } 
                }
            }else if($scope.windowWidth > '480' && $scope.windowWidth <= '768'){
                img.onload = function(){
                    if(img.width <= 910){
                        if( $scope.storeDetail.y_cord != ""){
                            if( $scope.storeDetail.y_cord > 100){
                                $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 1.8;
                            }else{
                                $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 2;
                            }
                            $scope.mobileShopX_Cord = 0;
                        }else{
                            $scope.storeDetail.x_cord = 0;
                            $scope.storeDetail.y_cord = 0;
                            $scope.mobileShopX_Cord = 0;
                            $scope.mobileShopY_Cord = 0;
                        }
                    }else if(img.width > 910 && img.width <= 1300){
                        if( $scope.storeDetail.x_cord != ""){
                            if( $scope.storeDetail.x_cord > 100){
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.00;
                            }else{
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.20;
                            }
                            $scope.mobileShopY_Cord = 0;
                        }else{
                            $scope.storeDetail.x_cord = 0;
                            $scope.storeDetail.y_cord = 0;
                            $scope.mobileShopX_Cord = 0;
                            $scope.mobileShopY_Cord = 0;
                        }
                    }else if(img.width > 1300){
                        if( $scope.storeDetail.x_cord != ""){
                            if( $scope.storeDetail.x_cord > 100){
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.80;
                            }else{
                                $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 3.00;
                            }
                            $scope.mobileShopY_Cord = 0;
                        }else{
                            $scope.storeDetail.x_cord = 0;
                            $scope.storeDetail.y_cord = 0;
                            $scope.mobileShopX_Cord = 0;
                            $scope.mobileShopY_Cord = 0;
                        }
                    }
                }
            }
        }
    };

    //Favorite shop
     $scope.favouritestores = function(id,element) {
        
        if($(element.target).hasClass('active')){
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_id = id;
            StoreService.unfavouritestores(opts, function(data) {
                if(data.code == 101) {
                    $(element.target).removeClass('active');
                } else {

                }               
            });
        } else {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_id = id;
            StoreService.favouritestores(opts, function(data) {
                if(data.code == 101) {
                    $(element.target).addClass('active');
                } else {
                    $scope.storeLoading = false;
                }
            });   
        }
        
    }

    $scope.loadDetails();
    $scope.loadalbumimages();
    $scope.getCountryName = function(p, k) {
        for(var i=0;i<p.length;i++){
            var obj = p[i];
            for(var key in obj){
                if (obj['id'] == k) {
                    return obj.country;
                }
            }
        }
    }
    $scope.getRegionName = function(p, k) {
        for(var i=0;i<p.length;i++){
            var obj = p[i];
            for(var key in obj){
                if (obj['id'] == k) {
                    return obj.region;
                }
            }
        }
        return k;
    }

    $scope.getLegalForm = function(p, k) {
        for(var i=0;i<p.length;i++){
            var obj = p[i];
            for(var key in obj){
                if (obj['id'] == k) {
                    return obj['value'];
                }
            }
        }
    }

    $scope.getShopCategory = function() {
      $scope.store.sale_catid = $scope.store.sale_catid;
      if($scope.store.sale_catid != '' && $scope.store.sale_catid != undefined){
        var catopts= {};
        catopts.lang_code = $scope.currentLanguage;
        catopts.cat_id = $scope.store.sale_catid;
        catopts.session_id = APP.currentUser.id;
        catopts.type = "show";
        catopts.session_id = APP.currentUser.id;
        ProfileService.getCategories(catopts, function(data) {
                        if(data.code == 101) {
                            $scope.store.categoryName =  data.data.category_name;
                        } else {
                            $scope.store.categoryName = '';
                        }
                    });

     } else {
        $scope.store.categoryName = '';
      }
    };
    $scope.getShopSubCategory = function() {
      $scope.store.sale_subcatid = $scope.store.sale_subcatid;
      if($scope.store.sale_subcatid != '' && $scope.store.sale_subcatid != undefined){
        var subopts= {};
        subopts.lang_code = $scope.currentLanguage;
        subopts.cat_id = $scope.store.sale_subcatid;
        subopts.session_id = APP.currentUser.id;
        subopts.type = "show";
        subopts.session_id = APP.currentUser.id;
        ProfileService.getCategories(subopts, function(data) {
                        if(data.code == 101) {
                            $scope.store.categorySubName =  data.data.category_name;
                        } else {
                            $scope.store.categorySubName = '';
                        }
                    });
      } else {
        $scope.store.categorySubName = '';
      }
    };
    $scope.editStore = function() {
        $scope.createStoreLoader = false;
        $scope.store = $scope.storeDetail;
        $scope.showEditForm = true;
        $scope.timelineActive = false;
        $scope.timelineActive1 = false;
        var opts = {};
        StoreService.getCountryList(opts, function(data) {
            if(data.code == 101) {
                $scope.countryList = data.data;

            }
        });
    };

    $scope.aboutStore = function() {
        $scope.store = $scope.storeDetail;
        var opts = {};
        StoreService.getCountryList(opts, function(data) {
            if(data.code == 101) {
                $scope.countryList = data.data;

            }
        });
    };
    $scope.updateStore = function() {
        $scope.updateStart = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.store.id;
        if($scope.store.name == undefined || $scope.store.name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_storename;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.business_name == undefined || $scope.store.business_name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessname;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.business_type == undefined || $scope.store.business_type == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesstype;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.legal_status == undefined || $scope.store.legal_status == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesstatus;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.phone == undefined || $scope.store.phone == '' || isNaN($scope.store.phone) == true){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessnumber;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.email == undefined || $scope.store.email == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessemail;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.business_country == undefined || $scope.store.business_country.id == undefined || $scope.store.business_country.id == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesscountry;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.business_region == undefined || $scope.store.business_region == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessregion;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.business_city == undefined || $scope.store.business_city == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesscity;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.business_address == undefined || $scope.store.business_address == ''){
            $scope.createStoreErrorMgs = $scope.i18n.validation.enter_businessaddress;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.zip == undefined || $scope.store.zip == '' || $scope.store.zip.length < 2 || $scope.store.zip.length > 2 ){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesszip;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.province == undefined || $scope.store.province == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessprovince;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.province.length < 2 || $scope.store.province.length > 2 ){
            $scope.createStoreErrorMgs = $scope.i18n.validation.province_length;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.vat_number == undefined || $scope.store.vat_number == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessvat;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.iban == undefined || $scope.store.iban == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessiban;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.description == undefined || $scope.store.description == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessdesc;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if($scope.store.referral_info == '' || $scope.store.referral_info == undefined || $scope.store.referral_info.id == undefined || $scope.store.referral_info.id == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_broker_id;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if((document.getElementById("latitude").value) == undefined || (document.getElementById("latitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesslat;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if((document.getElementById("longitude").value )== undefined || (document.getElementById("longitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesslog;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessmap;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            return false;
        } 
        opts.name = $scope.store.name;
        opts.business_name = $scope.store.business_name;
        opts.parent_store_id = $scope.store.parent_store_id;
        opts.legal_status = $scope.store.legal_status;
        opts.business_type = $scope.store.business_type;
        opts.phone = $scope.store.phone;
        opts.email = $scope.store.email;
        opts.business_country = $scope.store.business_country;
        opts.business_region = $scope.store.business_region;
        opts.business_city = $scope.store.business_city;
        opts.business_address = $scope.store.business_address;
        opts.zip = $scope.store.zip;
        opts.province = $scope.store.province;
        opts.vat_number = $scope.store.vat_number;
        opts.iban = $scope.store.iban;
        opts.description = $scope.store.description;
        opts.referral_id = $scope.store.referral_info.id;
        opts.map_place = document.getElementById("mapplace").value;
        opts.latitude = document.getElementById("latitude").value; 
        opts.longitude = document.getElementById("longitude").value; 
        opts.allow_access = $scope.store.is_allowed; 
        StoreService.updateStore(opts, function(data) {
            if(data.code == 101) {
                $scope.updateStart = false;
                $scope.showEditForm = false;
                $scope.createStoreLoader = false;
                $location.path("/shop/edit/"+$scope.store.id);
            } else if(data.code == 137){   
                $scope.createStoreErrorMgs = $scope.i18n.validation.broker_not_exists;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.createStoreError = false;
            } else if(data.code == 100){
                $scope.createStoreErrorMgs = $scope.i18n.validation.missed_param;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
            } else if(data.code == 90){    
                $scope.createStoreErrorMgs = $scope.i18n.validation.account_inactive;
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
            } else if(data.code == 91){
                $scope.createStoreErrorMgs = $scope.i18n.validation.vat_exists;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
            } else if(data.code == 126){
                $scope.createStoreErrorMgs = $scope.i18n.validation.invalid_store_forum_type;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
            } else if(data.code == 500){
                $scope.createStoreErrorMgs = $scope.i18n.validation.permission_denied;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
            } else if(data.code == 89){
                $scope.createStoreErrorMgs = $scope.i18n.validation.error_occured;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
            } else {
                $scope.createStoreErrorMgs = data.message;    
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.createStoreError = false;
            }
        });
    };

    $scope.initializeMaps = function () {
        if (angular.element('#map-canvas-second').length ) {
                var myLatLng = new google.maps.LatLng(latitudeMap, longitudeMap);
                var mapOptions = {
                   center: new google.maps.LatLng(latitudeMap, longitudeMap),
                   zoom: 6
                };
                var map = new google.maps.Map(document.getElementById('map-canvas-second'),mapOptions);
                var marker = new google.maps.Marker({
                   position: new google.maps.LatLng(latitudeMap, longitudeMap),
                   map: map,
                   title: $scope.store.map_place
                });   
        }
    };


    $('.member-store').click(function() {
        $(this).addClass('active');
        $('.store-invitations li').removeClass('active');
    });

    $scope.cancelEdit = function() {
        $scope.showEditForm = false;
        $scope.store = {};
    };

    $scope.loadEditMap = function() { 
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
                    document.getElementById("latitude").value = marker.getPosition().lat();
                    document.getElementById("longitude").value = marker.getPosition().lng();
                    $scope.mapLocation(marker.getPosition().lat(), marker.getPosition().lng());
                }
            }
        }
    }
    $scope.loadEditMap();
    /*$scope.mapLocation = function(mapLatitude, mapLogitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(parseFloat(mapLatitude), parseFloat(mapLogitude));
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
    };*/
    /*$scope.initialize = function () {
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
            document.getElementById("latitude").value = countryPlace.geometry.location.k;
            document.getElementById("longitude").value = countryPlace.geometry.location.B;
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
    $scope.initializeWait = function(){
        $timeout(function() {
            $scope.initialize();
        }, 1000);
    }*/

    $scope.showInvite = false;
    $scope.timelineActive = false;
    $scope.toggleInvite = function(){
       
        $scope.timelineActive = !$scope.timelineActive;
        $scope.uploadProfileImage = false;
        $scope.showInvite = !$scope.showInvite;
        $scope.timelineActive1 = false;
        $scope.showEditForm=false;
     //   alert(timelineActive);
        
    }

    $scope.uploadProfileImage = false;
    $scope.toggleUploadImage = function() {
        $scope.showInvite = false;
        $scope.uploadProfileImage = !$scope.uploadProfileImage;
    };

    $scope.uploadStoreProfile = false;
    $scope.uploadProfileerror = false;
    $scope.newImage = false;
    $scope.uploadStoreProfileImage = function() { 
        $scope.uploadStoreProfile = true;
        var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
        // Checking Extension
        if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
            $scope.uploadProfileErrorMsg = $scope.i18n.storealbum.album_uploadProfileErrorMsg;
            $scope.uploadStoreProfile = false;
            $scope.uploadProfileerror = true;
        } else {
            var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_id = $scope.storeDetail.id;
            StoreService.uploadStoreProfileimage(opts, $scope.myFile, function(data) {
                if(data.code == 101) {
                    $scope.newImage = true;
                    $scope.uploadProfileImage = false;
                    $scope.uploadStoreProfile = false;
                    $scope.storeDetail.cover_image_path = data.data.cover_image_thumb_path;
                    $scope.storeDetail.profile_image_original = data.data.original_image_path;
                    $scope.fileUrl = data.data.cover_image_thumb_path;
                    $scope.storeDetail.media_id =  data.data.media_id;
                    $scope.showCanves = true;
                    $scope.coverLoadHide = true;
                } else {
                    $scope.uploadStoreProfile = false;
                }

            });
        }

    };

    $scope.imageCropResult = null;
    $scope.imageCropResult2 = null;
    $scope.imageWidth = null;
    $scope.imageHeight = null;
    $scope.showImageCropper = false;
    $scope.showImageCropper2 = false;
    $scope.imageString = "";
    $scope.file ={};
    $scope.coverLoadHide = false;
    $scope.$watch('imageCropResult2', function(newVal) {
        if (newVal) {
            console.log('imageCropResult2', newVal);
        }
    });

    $scope.imageXPosition = 0;
    $scope.imageYPosition = 0;
    $scope.setImageCordinate = function(){
        $scope.storeDetail.x_cord = $rootScope.shop.x_cord * -1;
        $scope.storeDetail.y_cord = $rootScope.shop.y_cord * -1;
        $scope.saveCordinate();
    };

    $rootScope.shop = {};
    $scope.showCanves = false;
    $scope.repositionImage = function(){
        $scope.showCanves = true;
        $scope.fileUrl =  $scope.storeDetail.cover_image_path;
        if($scope.storeDetail.x_cord == 'NaN'){
             $scope.imageXPosition = 0;
             $scope.imageYPosition = 0;
              $scope.coverLoadHide = true;
        }else{
            $scope.imageXPosition = $scope.storeDetail.x_cord * -1;
            $scope.imageYPosition =  $scope.storeDetail.y_cord * -1;
            $scope.coverLoadHide = true;
        }
    };

    $scope.saveCordinate = function(){

        /*$scope.storeDetail.x_cord = $scope.imageXPosition * -1;
        $scope.storeDetail.y_cord = $scope.imageYPosition * -1;*/
        //$scope.coverLoadHide = false;
        $scope.hideUpdateCoverButton = true;
        $scope.showCanves = false;
        var opts = {};
        opts.session_id = APP.currentUser.id;
        opts.media_id = $scope.storeDetail.media_id
        opts.x = ""+($scope.storeDetail.x_cord)+"";
        opts.y = ""+($scope.storeDetail.y_cord)+"";
        StoreService.setStoreMediaCoordinate(opts,function(data){
            if(data.code == 101 && data.message == "SUCCESS"){
                $scope.storeDetail.x_cord = data.data.x_cord ;
                $scope.storeDetail.y_cord = data.data.y_cord ;
                $scope.coverLoadHide = false;
                $scope.file = null;
                $scope.fileUrl = null;
                $scope.hideUpdateCoverButton = false;
                $scope.showCanves = false;
                if($rootScope.mobileView == true){
                    img = null;
                    img = new Image();
                    img.src = $scope.storeDetail.cover_image_path;
                    if($scope.windowWidth <="480"){
                        if(img.width <= 910){
                            if( $scope.storeDetail.y_cord != ""){
                                if( $scope.storeDetail.y_cord > 100){
                                    $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 3;
                                }else{
                                    $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 4;
                                }
                                $scope.mobileShopX_Cord = 0;
                            }else{
                                $scope.storeDetail.x_cord = 0;
                                $scope.storeDetail.y_cord = 0;
                                $scope.mobileShopX_Cord = 0;
                                $scope.mobileShopY_Cord = 0;
                            }
                        }else if(img.width > 910 && img.width <= 1300){
                            if( $scope.storeDetail.x_cord != ""){
                                if( $scope.storeDetail.x_cord > 100){
                                    $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 4;
                                }else{
                                    $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                                }
                                $scope.mobileShopY_Cord = 0;
                            }else{
                                $scope.storeDetail.x_cord = 0;
                                $scope.storeDetail.y_cord = 0;
                                $scope.mobileShopX_Cord = 0;
                                $scope.mobileShopY_Cord = 0;
                            }
                        }else if(img.width > 1300){
                            if( $scope.storeDetail.x_cord != ""){
                                if( $scope.storeDetail.x_cord > 100){
                                    $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 5;
                                }else{
                                    $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 6;
                                }
                                $scope.mobileShopY_Cord = 0;
                            }else{
                                $scope.storeDetail.x_cord = 0;
                                $scope.storeDetail.y_cord = 0;
                                $scope.mobileShopX_Cord = 0;
                                $scope.mobileShopY_Cord = 0;
                            }
                        }
                    }else if($scope.windowWidth > '480' && $scope.windowWidth <= '768'){
                            if(img.width <= 910){
                                if( $scope.storeDetail.y_cord != ""){
                                    if( $scope.storeDetail.y_cord > 100){
                                        $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 1.8;
                                    }else{
                                        $scope.mobileShopY_Cord =  $scope.storeDetail.y_cord / 2;
                                    }
                                    $scope.mobileShopX_Cord = 0;
                                }else{
                                    $scope.storeDetail.x_cord = 0;
                                    $scope.storeDetail.y_cord = 0;
                                    $scope.mobileShopX_Cord = 0;
                                    $scope.mobileShopY_Cord = 0;
                                }
                            }else if(img.width > 910 && img.width <= 1300){
                                if( $scope.storeDetail.x_cord != ""){
                                    if( $scope.storeDetail.x_cord > 100){
                                        $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.00;
                                    }else{
                                        $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.20;
                                    }
                                    $scope.mobileShopY_Cord = 0;
                                }else{
                                    $scope.storeDetail.x_cord = 0;
                                    $scope.storeDetail.y_cord = 0;
                                    $scope.mobileShopX_Cord = 0;
                                    $scope.mobileShopY_Cord = 0;
                                }
                            }else if(img.width > 1300){
                                if( $scope.storeDetail.x_cord != ""){
                                    if( $scope.storeDetail.x_cord > 100){
                                        $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 2.80;
                                    }else{
                                        $scope.mobileShopX_Cord = $scope.storeDetail.x_cord / 3.00;
                                    }
                                    $scope.mobileShopY_Cord = 0;
                                }else{
                                    $scope.storeDetail.x_cord = 0;
                                    $scope.storeDetail.y_cord = 0;
                                    $scope.mobileShopX_Cord = 0;
                                    $scope.mobileShopY_Cord = 0;
                                }
                            }
                        }
                }
            }
        });
    };

    $scope.showcrossactive = true;
    $scope.showcrossactive1 = function(){
        $scope.showcrossactive = false;
    };

    $scope.showCoverOption = false;
    $scope.showCoverDropDown = function($event){
        $scope.showCoverOption = !$scope.showCoverOption;
        $event.stopPropagation();
    };

    window.onclick = function() {
        if ($scope.showCoverOption) {
            $scope.showCoverOption = false;
            $scope.$apply();
        }
    };



    $scope.myFile = '';
    $scope.imageSrc = '';
    $scope.invalidCoverImage = false;
    if($scope.i18n.storealbum === undefined){
        $scope.invalidCoverImageMgs = "Please choose an image that is at least 400 pixels wide and at least 200 pixels tall";
    } else {
        $scope.invalidCoverImageMgs = $scope.i18n.storealbum.album_invalidCoverImageMgs;
    }
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.myFile = $scope.file;
            $scope.imageSrc = result;
            var imageType = $scope.myFile['name'].substring($scope.myFile['name'].lastIndexOf(".") + 1);
            if (!(imageType == "gif" || imageType == "png" || imageType == "jpg" || imageType == "jpeg")) {
                $scope.uploadProfileErrorMsg = $scope.i18n.storealbum.album_uploadProfileErrorMsg;
                $scope.uploadStoreProfile = false;
                $scope.uploadProfileerror = true;
            } else {
                $scope.uploadStoreProfile = false;
                $scope.uploadProfileerror = false;

                $scope.readImage($scope.myFile, function(data){
                if(data.length != 0 && data.width >= 400 && data.height >= 200){
                    $scope.uploadStoreProfileImage();
                }
                else { 
                    $("#invalidCoverImage").show();
                    $timeout(function(){
                        $("#invalidCoverImage").hide();
                    }, 4000);
                }
            });
            }
        });
    };

    //function to check upload image dimenstions
    $scope.readImage = function(file, callback) {
    var reader = new FileReader();
    var image  = new Image();
    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        var filedata = {};
        image.src    = _file.target.result;
        image.onload = function() {
            var w = this.width,
                h = this.height,
                t = file.type,                     
                n = file.name,
                s = ~~(file.size/1024) +'KB';
                filedata['width'] = w;
                filedata['height'] = h;
                callback(filedata);
        };
        image.onerror= function() {
            callback(filedata);
        };      
    };
    }
    $scope.timelineActive1=false;
    $scope.showAllStoreMember = false;
    $scope.showAllMembers = function() {
        $scope.showAllStoreMember = !$scope.showAllStoreMember;
        $scope.timelineActive1 = !$scope.timelineActive1;
        $scope.timelineActive = false;
        $scope.showEditForm=false;
    }; 

    $scope.storeSelection = function(){
        storeShopHistorySelection.storeHistoryTab($scope.storeMainId);
    };

}]).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

app.controller('HistoryStoreController',['$scope', '$http', '$routeParams', '$location', '$timeout', 'StoreService', function ($scope, $http, $routeParams, $location, $timeout, StoreService) {
   // $scope.$route = $route;
    $scope.storeAllList = [];
    $scope.storeHistoryDetail = [];
    $scope.totalSize = 0;
    $scope.notFound = false;
    $scope.allRes = 1;
    $scope.noHistory = false;
    $scope.storeMainId = $routeParams.id;
    $scope.storeLoading = true;
    $scope.showHistory = function() {
        var opts = {};
        var limit_start = $scope.storeAllList.length;
        opts.limit_start = limit_start;
        opts.limit_size = APP.store_list_pagination.end;
        opts.user_id = APP.currentUser.id;
        opts.shop_id = $scope.storeMainId;
      if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
          $scope.storeLoading = true;
          $scope.allRes = 0;
         StoreService.getStoreHistory(opts, function(data) {
            if(data.code == 101) {
                $scope.allRes = 1;
                $scope.totalSize = data.data.total;
                $scope.storeLoading = false;
                $scope.storeHistoryDetail =  $scope.storeAllList = $scope.storeAllList.concat(data.data.transactions);
                $scope.notFound = false;
                $scope.noHistory = true;
            } else {
                $scope.storeHistoryDetail =  [];
                $scope.storeLoading = false;
                $scope.notFound = true;
            } 
        });
     }  
    };
    $scope.showHistory();
    $scope.loadMore = function() {     
        $scope.showHistory();
      };
}]);