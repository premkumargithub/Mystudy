app.controller('StoreController', function ($scope, $http, StoreService, $timeout) {  
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

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        $scope.loadMore();
    };
    $scope.showStoreList = function(tab, itemsPerPage) {
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
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.storeLoading = true
            $scope.allRes = 0;
            StoreService.getStore(opts, function(data) {
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


    $scope.myStoreList = function(tab, itemsPerPage) {
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
        if ((($scope.myTotalSize > limit_start) || $scope.myTotalSize == 0 ) && $scope.myRes == 1) {
            $scope.storeLoading = true;
            $scope.myRes = 0; 
            StoreService.getStore(opts, function(data) {
                $scope.range = []; 
                if(data.code == 101) {
                    $scope.myTotalSize = data.data.size;
                    $scope.myRes = 1; 
                    $scope.storeListObject = $scope.storeMyList = data.data.stores;
                    $scope.totalItems = Math.ceil(data.data.size/itemsPerPage);  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    }  
                    $scope.storeLoading = false;
                } else if(data.code == 121) {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                } else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                    
                }
            });
        }
    };

    $scope.addressFilter = '';
    $scope.showStoreList($scope.tab, $scope.itemsPerPage);
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
            opts.limit_size = itemsPerPage;
            if($scope.searchTotalSize > limit_start || $scope.searchTotalSize == 0) {
                StoreService.searchStore(opts, function(data) {
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
$scope.getmapstores = function(){
    $scope.maploader = true;
        var opts = {"user_id":APP.currentUser.id}; 
        StoreService.getmapstores(opts, function(data){
            //console.log('data'+data.data);
            if(data.code == 101) {
                $scope.detail = data.data;
                var mapArray = data.data;
                for(var i=0; i<mapArray.length; i++) {
                    n.push(mapArray[i].name);
                    var mi = new Array(mapArray[i].mapplace, mapArray[i].latitude,mapArray[i].longitude, mapArray[i].thumb_path, mapArray[i].name, mapArray[i].credit_status, mapArray[i].shot_status, mapArray[i].dp_status, mapArray[i].id, mapArray[i].credit_available );
                        locations.push(mi);
                    }
                    $('.shop-map').show();
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
$scope.searchAddressShop = function(arrCollection) {
    $scope.pagevalue = 'storeAddSearch';
    limit_starts = ($scope.currentPage-1)*$scope.itemsPerPage;
    limit_end = limit_starts + $scope.itemsPerPage;
    if($scope.searchTot > limit_starts || $scope.searchTot == 0 ) {
        $scope.storeLoading = true;
        idCollection = arrCollection;
        var tempArray = idCollection.slice(limit_starts,limit_end);
        var req = {"user_id":APP.currentUser.id,"shops":tempArray};
        $scope.searchshoponmaps(arrCollection, req, arrCollection.length); 
    } 
}
/*search by store name starts*/
//var n = ["Action Comics", "Detective Comics", "Superman", "Fantastic Four", "Amazing Spider-Man", "Batman Series", "Repoman Seeks", "Love Comics", "Anime Comics"];


    var containsText = function (search) {
        var gotText = false;
        for (var i in n) {
            var re = new RegExp(search, "ig");
            var s = re.test(n[i]);
            if (s) {                
                if($scope.itemsArr.indexOf(n[i]) == -1)
                {
                    $scope.itemsArr.push(n[i])
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
        $scope.itemsDisplaPanel = false;
        if (search.length > 2) {
            var foundText = containsText(search);
            $scope.itemsDisplaPanel = (foundText) ? true : false;
        }
    };

    $('#pac-input').focus(function() {
       $scope.itemsDisplaPanel = false;
    });

    $('body').click(function() {
       $scope.itemsDisplaPanel = false;
    });
    
    $scope.itemSelectedData = function (str) {
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
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
    // markerClusterer.clearMarkers();
    $scope.storeListObject = [];
    $scope.viewAllActive = 'current';
    $scope.myStoreActive = '';
    $scope.searchText = '';
    markerClusterer.setMap(null);
    document.getElementById("shotfilter").checked = false;
    document.getElementById("dpfilter").checked = false;
    var address = document.getElementById('pac-input').value;
    var radius = parseInt(50, 10)*1000;
    geocoder.geocode( { 'address': address}, function(results, status) {

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
    circle = new google.maps.Circle({center:marker.getPosition(),
                                     //radius: radius,
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
        if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
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
        if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
        }
          
          infowindow.open(map, marker);
        }
      })(marker, i));
       arrMarker.push(marker);
       gmarkers.push(marker);

    }
     markerClusterer = new MarkerClusterer(map, arrMarker, {
          //maxZoom: zoom,
         // gridSize: size
         // styles: styles[style]
    });
    google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoomLevel = map.getZoom();    
    if(zoomLevel < 5) {
        document.getElementById("shotfilter").checked = false;
        document.getElementById("dpfilter").checked = false;
        $scope.addressFilter = '';
        $scope.searchText = '';
        if(circle != null) {
            circle.setMap(null);
        }
        $('#results').html('');
        markerClusterer.setMap(null);
        $scope.setDpShotMarker(null);
        $scope.setDpMarker(null);
        $scope.setAllMap(null);
        $scope.setAllShotMap(null);
        $scope.setAllMap(map);
        markerClusterer.setMap(map);
    }
  });
}

$scope.markerpopup = function(index) {
    document.getElementById("shotfilter").checked = false;
    document.getElementById("dpfilter").checked = false;
    markerClusterer.setMap(null);
    $scope.setAllShotMap(null);
    $scope.setAllMap(null);
    $scope.setAllMap(map);
    $scope.setDpMarker(null);
    $scope.setDpShotMarker(null);
    if(circle != null) {
        circle.setMap(null);
    }
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

$scope.mapfilter = function() {
    $scope.storeListObject = [];
    var filterArray = [];
    var chk = document.getElementById("shotfilter").checked;
    var dpchk = document.getElementById("dpfilter").checked;
    if((chk == true) && (dpchk == false)){
        $scope.searchText = '';
        markerClusterer.setMap(null);
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
               // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
            } else {
                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
            }
                infowindow.open(map, marker);
            }
        })(marker, i));
        arrShotMarker.push(marker);
        
        }      
    }
    //$scope.searchshoponmaps(filterArray);
    limit_starts = 0;
    limit_end = 12;
    $scope.storeIdArray = filterArray;
    $scope.searchAddressShop(filterArray);
    //markerClusterer.clearMarkers();
   /* markerClusterer = new MarkerClusterer(map, arrShotMarker, {
          //maxZoom: zoom,
         // gridSize: size
         // styles: styles[style]
        });
*/
    } else if((dpchk == true) && (chk == false)){
        markerClusterer.setMap(null);
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
               // infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
            } else {
                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
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
    //$scope.searchshoponmaps(filterArray);
    limit_starts = 0;
    limit_end = 12;
    $scope.storeIdArray = filterArray;
    $scope.searchAddressShop(filterArray);
    } else if((chk == true) && (dpchk == true)){
        $scope.searchText = '';
        markerClusterer.setMap(null);
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
                //infowindow.setContent("<div>Name : <a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>Address : "+locations[i][0]+"</div>");
            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");
            } else {
                infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div><div class='category-dec'><strong>Category</strong> : Not Available</div><div class='lower-cont'><div class='vote-count'><ul><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li><li><img src='app/assets/images/star-blank.png'></li></ul><div class='vote-number ng-binding'>0 VOTES</div></div><div class='ca'>"+$scope.i18n.store.credit_available+" : <span>"+$scope.format1(locations[i][9], '€')+"</span></div></div></div></div>");   
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
    //$scope.searchshoponmaps(filterArray);
    limit_starts = 0;
    limit_end = 12;
    $scope.storeIdArray = filterArray;
    $scope.searchAddressShop(filterArray);

    } else {
        if(circle != null) {
            circle.setMap(null);
        }
        $('#results').html('');
        $scope.addressFilter = '';
        $scope.searchText = '';
        markerClusterer.setMap(null);
        $scope.setDpMarker(null);
        $scope.setDpShotMarker(null);
        $scope.setRemoveAllMap(null);
        $scope.setAllShotMap(null);
        $scope.setAllMap(map);
        if($scope.searchText === '' && $scope.addressFilter === '') {
            markerClusterer.setMap(map);  
        }
                
        $scope.showStoreList($scope.tab, $scope.itemsPerPage);
        $scope.notFound = false;  
        $scope.viewAllActive = 'current';
        $scope.myStoreActive = '';
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
});

//Create Store controller here
app.controller('CreateStoreController', function ($scope, $http, $location, $timeout, StoreService, $rootScope, $cookieStore) {
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
});

//Create Store controller here
app.controller('DeatilStoreController', function ($route, $scope, $http, $sce, $routeParams, $location, $timeout, StoreService, fileReader) {
    $scope.$route = $route;
    $scope.storeMainId = $routeParams.id;
    var latitudeMap = 0;
    var longitudeMap = 0;
    $scope.mobileAppUrl = '<li> Fits true to size. Take your normal size\r</li>';
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
            if(data.code == 101) {
                //if(data.data.owner_id == APP.currentUser.id && data.data.payment_status == 0) {
                //$location.path("/shop/payment/1");
                // close for future use, condition changed for currently previously reg card was mandatory
                // if(data.data.owner_id == APP.currentUser.id && data.data.credit_card_status == 0) {
                //     $location.path("/shop/card/addcard/"+data.data.id+"/2");
                // } else if(data.data.payment_status == 0 && data.data.shop_status == 0 && data.data.owner_id == APP.currentUser.id){
                //     $location.path("/shop/pending/payment/"+data.data.id);
                // } else if(data.data.shop_status == 0 && data.data.owner_id == APP.currentUser.id){
                //     $location.path("/shop/pending/payment"+data.data.id);
                // } 
                if(data.data.owner_id == APP.currentUser.id && data.data.shop_status == false && data.data.is_active == 0){
                    $location.path("/shop/pending/payment"+data.data.id);
                } else {
                    $scope.storeDetail = data.data;
                    $scope.store = $scope.storeDetail;
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
    $scope.loadDetails();
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
    $scope.updateEditStore = function() {
        $scope.updateStart = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.store.id;
        if($scope.store.name == undefined || $scope.store.name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_storename;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.business_name == undefined || $scope.store.business_name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessname;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.business_type == undefined || $scope.store.business_type == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesstype;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.legal_status == undefined || $scope.store.legal_status == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesstatus;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.phone == undefined || $scope.store.phone == '' || isNaN($scope.store.phone) == true){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessnumber;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.email == undefined || $scope.store.email == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessemail;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.business_country == undefined || $scope.store.business_country == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesscountry;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.business_region == undefined || $scope.store.business_region == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessregion;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.business_city == undefined || $scope.store.business_city == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesscity;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.business_address == undefined || $scope.store.business_address == ''){
            $scope.createStoreErrorMgs = $scope.i18n.validation.enter_businessaddress;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.zip == undefined || $scope.store.zip == '' || $scope.store.zip.length < 5 || $scope.store.zip.length > 5 ){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesszip;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.province == undefined || $scope.store.province == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessprovince;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.province.length < 2 || $scope.store.province.length > 2 ){
            $scope.createStoreErrorMgs = $scope.i18n.validation.province_length;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.vat_number == undefined || $scope.store.vat_number == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessvat;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.iban == undefined || $scope.store.iban == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessiban;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if($scope.store.description == undefined || $scope.store.description == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessdesc;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } //else if($scope.store.referral_info == '' || $scope.store.referral_info == undefined || $scope.store.referral_info.id == undefined || $scope.store.referral_info.id == ''){
            //$scope.createStoreErrorMgs = $scope.i18n.store.enter_broker_id;
         //   $scope.createGroupError = true;
         //   $scope.updateStart = false;
         //   $timeout(function(){
          //         $scope.createStoreErrorMgs = ''; 
           //     }, 4000);
         //   return false;
        //}
         else if((document.getElementById("latitude").value) == undefined || (document.getElementById("latitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesslat;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if((document.getElementById("longitude").value )== undefined || (document.getElementById("longitude").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesslog;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            return false;
        } else if((document.getElementById("mapplace").value) == undefined || (document.getElementById("mapplace").value) == ''){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businessmap;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
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
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
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
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
            } else if(data.code == 166){
                $scope.createStoreErrorMgs = $scope.i18n.validation.iban_valid;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $timeout(function(){
                   $scope.createStoreErrorMgs = ''; 
                }, 15000);
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
    $scope.invalidCoverImageMgs = $scope.i18n.storealbum.album_invalidCoverImageMgs;
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

}).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

//Create Store controller here
app.controller('CreateChildStore', function ($scope, $http, $routeParams, $location, $timeout, StoreService) {
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
});

app.controller('StoreLeftController', function ($scope, $http, StoreService) {
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
});

//Controller to handle the store notiication
app.controller('StoreNotificationController', function ($scope, $http, StoreService) {
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

});

/**
* Controller for autocomplete functionality
*
*/
app.controller('AutocompleteController', function ($scope, $http, $timeout, StoreService) {
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

});

app.controller('MyShopController', function ($scope, $http, $timeout, StoreService, $location) {
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
    $scope.listActive = 'active';
    $scope.gridActive = '';
    $scope.firstPage = APP.store_list_pagination.end;
    $scope.itemsPerPage = APP.store_list_pagination.end;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.affilateShop = false;

    $scope.changePageMore = function(pageNo) {
        $scope.currentPage = pageNo;

        if($scope.searchText === '') {
            $scope.showStoreList($scope.tab, $scope.itemsPerPage);
        } else {
            $scope.searchStore('viewAll',  $scope.itemsPerPage);
        }
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
        $('ul.pagination li.active:gt(3)').hide();
       $scope.loadMore();
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.totalItems ? "disabled" : "";
    };

    $scope.setPage = function(number) {
        $scope.itemsPerPage = number;
        $scope.currentPage = 1;
        
        if($scope.searchText === '') {
            $scope.showStoreList($scope.tab, $scope.itemsPerPage);
        } else {
                $scope.searchStore('viewAll',  $scope.itemsPerPage);
        }
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

    $scope.showStoreList = function(tab, itemsPerPage) {
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
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.storeLoading = true
            $scope.allRes = 0;
            StoreService.getStore(opts, function(data) {
                $scope.affilateShop = true;
                if(data.code == 101) {
                    $scope.allRes = 1;
                    $scope.totalSize = data.data.size;
                    $scope.storeListObject =  $scope.storeAllList = data.data.stores;
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

    

    $scope.myStoreList = function(tab, itemsPerPage) {
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
        if ((($scope.myTotalSize > limit_start) || $scope.myTotalSize == 0 ) && $scope.myRes == 1) {
            $scope.storeLoading = true;
            $scope.myRes = 0; 
            StoreService.getStore(opts, function(data) {
                $scope.affilateShop = true;
                $scope.range = []; 
                if(data.code == 101) {
                    $scope.myTotalSize = data.data.size;
                    $scope.myRes = 1; 
                    $scope.storeListObject = $scope.storeMyList = data.data.stores;
                    $scope.totalItems = Math.ceil(data.data.size/itemsPerPage);  
                    for (var i=1; i<=$scope.totalItems; i++) {
                        $scope.range.push(i);
                    }  
                    $scope.storeLoading = false;
                } else if(data.code == 121) {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                } else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                    $scope.myRes = 1; 
                    
                }
            });
        }
    };
    $scope.showStoreList($scope.tab, $scope.itemsPerPage);
    $scope.loadMore = function() {
        if($scope.searchText === '') {
            if($scope.tab == 'myStore') {
                $scope.storeAllList = [];
                $scope.myStoreList($scope.tab,  $scope.itemsPerPage);
            } 
            else {
                $scope.storeMyList = [];
                $scope.showStoreList($scope.tab, $scope.itemsPerPage);
            }
        } else {
                $scope.searchStore('viewAll',  $scope.itemsPerPage);
        }
    };

    $scope.deleteStore = function(id, parentId, index) { 
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
                $scope.storeListObject.splice(index, 1);
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
                $(".storecoverid" + id).hide();
            } else {
                $("#store" + id).show();
                $("#storedelete" + id).hide();
            }
        });
    };

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
        if(model.length >= 2) {
            $scope.searchStore('viewAll', $scope.itemsPerPage);
        }
      }, DELAY_TIME_BEFORE_POSTING)
    });

    $scope.searchRes = 0;
    $scope.searchTotalSize = 0;
    $scope.searchStore = function(tab, itemsPerPage) {
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
                $scope.storeLoading = false;
                $scope.showStoreList($scope.tab, itemsPerPage);
            }
            opts.business_name = ($scope.searchText === undefined ? '' : $scope.searchText); 
            opts.limit_start = limit_start;
            opts.limit_size = itemsPerPage;
            if($scope.searchTotalSize > limit_start || $scope.searchTotalSize == 0) {
                StoreService.searchStore(opts, function(data) {
                    $scope.searchRes = 1;
                    $scope.storeLoading = false;
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
        } else {
            $scope.storeLoading = false;
        }
    };

});

app.controller('DetailStoreCoverController', function ($route, $scope, $http, $sce, $routeParams, $location, $timeout, StoreService, fileReader,ProfileService) {
    $scope.$route = $route;
    $scope.storeMainId = $routeParams.id;
    var latitudeMap = 0;
    var longitudeMap = 0;
    $scope.mobileAppUrl = '<li> Fits true to size. Take your normal size\r</li>';

    //Broadcast from storealbum controller
    $scope.$on('updateProfileCover', function(event, imgData) { 
        $scope.storeDetail.cover_image_path = imgData.cover_image_path;
        $scope.storeDetail.profile_image_original = imgData.original_image_path;
     });

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
            if(data.code == 101) {
                    $scope.storeDetail = data.data;
                    $scope.store = $scope.storeDetail;
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
                    $scope.getShopCategory();
                    $scope.getShopSubCategory();
                    var storeData = {};
                    storeData.storeId = $scope.storeDetail.owner_id;
                    //call service to get mobile app
                    var mopts = {};
                    mopts.store_id = $scope.storeDetail.id;
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
            } else {
                $scope.storeLoading = false;
                $scope.createStoreError = true;
            }
        });
    }
    $scope.loadDetails();
    $scope.getShopCategory = function() {
        $scope.store.sale_catid = $scope.store.sale_catid;
      if($scope.store.sale_catid != '' && $scope.store.sale_catid != undefined){
        var catopts= {};
        catopts.lang_code = $scope.currentLanguage;
        catopts.cat_id = $scope.store.sale_catid;
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
    $scope.invalidCoverImageMgs = $scope.i18n.storealbum.album_invalidCoverImageMgs;
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

}).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

app.controller('HistoryStoreController', function ($scope, $http, $routeParams, $location, $timeout, StoreService) {
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
});