app.controller('ReportController', ['$scope', '$rootScope','$routeParams', '$timeout', 'StoreService' , function ($scope, $rootScope, $routeParams, $timeout, StoreService) {
    var flag = 0;
    var arrTransactionMarker = [];
    $scope.storeId = $routeParams.id;
    var locations = [];
    var geocoder = new google.maps.Geocoder();
    var circle = null;
    var gmarkers = [];
    var map;
    $scope.setAllMarker = function(map) {
        for (var i = 0; i < arrTransactionMarker.length; i++) {
            arrTransactionMarker[i].setMap(map);
        }
    }
     $scope.setgmarkersMarker = function(map) {
        for (var i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(map);
        }
    }
    var arrId = [];
    $scope.activeClassFirst = "";
    $scope.activeClassSecond = "";
    $scope.reportTransaction = function(value) {
        $scope.maploader = true;
        locations = [];
        $scope.setAllMarker(null);
        $scope.setgmarkersMarker(null);
        arrTransactionMarker = [];
        gmarkers = [];
        $scope.displayLoader = true;
        var opts = {};
        if(value === 2) {
            $scope.activeClassFirst = "";
            $scope.activeClassSecond = "active";
            opts = {"$collection":"sixc_transactions", "$fields":{"transaction_value":1,"citizen_id.name":1,"citizen_id.address_l1":1,"citizen_id.address_l2":1,"citizen_id.city":1,"citizen_id.country":1,"citizen_id.state":1,"citizen_id.user_thumbnail_image":1,"citizen_id.longitude":1,"citizen_id.latitude":1},"$filter": {"shop_id":String($scope.storeId),"status":"Approved","transaction_type_id": {"$in": ["553209267dfd81072b176bba","553209267dfd81072b176bbc"]}},"$sort":{"date":-1}}; 
        } else {
            $scope.activeClassFirst = "active";
            $scope.activeClassSecond = "";
            opts = {"$collection":"sixc_transactions", "$fields":{"transaction_value":1,"citizen_id.name":1,"citizen_id.address_l1":1,"citizen_id.address_l2":1,"citizen_id.city":1,"citizen_id.country":1,"citizen_id.state":1,"citizen_id.user_thumbnail_image":1,"citizen_id.longitude":1,"citizen_id.latitude":1},"$filter": {"shop_id":String($scope.storeId),"offer_id.start_date":{"$lte":"$$CurrentDate"},"offer_id.end_date":{"$gte":"$$CurrentDate"},"status":"Approved","transaction_type_id": {"$in": ["553209267dfd81072b176bba"]}},"$sort":{"date":-1}};  
        }
        StoreService.getReportTransacation(opts, function(data) {
            $scope.maploader = false;
            if(data.code == 200 && data.status == 'ok'){
                $scope.reportlist = data.response.result;
                $scope.reportlistsearch = data.response.result;
                if($scope.reportlist.length > $scope.itemsPerPage){
                    $scope.pagination = true;
                }
                for(var i=0; i<$scope.reportlist.length; i++) {
                        var mi = new Array($scope.reportlist[i].citizen_id.latitude, $scope.reportlist[i].citizen_id.longitude,$scope.reportlist[i].citizen_id._id, $scope.reportlist[i].citizen_id.user_thumbnail_image, $scope.reportlist[i].citizen_id.name, $scope.reportlist[i].transaction_value, $scope.reportlist[i].citizen_id.address_l2, $scope.reportlist[i]._id);
                            locations.push(mi);
                            //console.log(mi+'lllll')
                }

                $scope.initializeReportMap();

            } else {
                $scope.pagination = false;
            }
            

        });
    };

    //for tab
     $scope.reportTransactionTab = function(value) {
        if (circle) circle.setMap(null);
        $scope.maploader = true;
        locations = [];
        $scope.setAllMarker(null);
        $scope.setgmarkersMarker(null);
        arrTransactionMarker = [];
        gmarkers = [];
        $scope.displayLoader = true;
        $('#pac-input').val('');
        var opts = {};
        if(value === 2) {
            $scope.activeClassFirst = "";
            $scope.activeClassSecond = "active";
            opts = {"$collection":"sixc_transactions", "$fields":{"transaction_value":1,"citizen_id.name":1,"citizen_id.address_l1":1,"citizen_id.address_l2":1,"citizen_id.city":1,"citizen_id.country":1,"citizen_id.state":1,"citizen_id.user_thumbnail_image":1,"citizen_id.longitude":1,"citizen_id.latitude":1},"$filter": {"shop_id":String($scope.storeId),"status":"Approved","transaction_type_id": {"$in": ["553209267dfd81072b176bba","553209267dfd81072b176bbc"]}},"$sort":{"date":-1}}; 
        } else {
            $scope.activeClassFirst = "active";
            $scope.activeClassSecond = "";
            opts = {"$collection":"sixc_transactions", "$fields":{"transaction_value":1,"citizen_id.name":1,"citizen_id.address_l1":1,"citizen_id.address_l2":1,"citizen_id.city":1,"citizen_id.country":1,"citizen_id.state":1,"citizen_id.user_thumbnail_image":1,"citizen_id.longitude":1,"citizen_id.latitude":1},"$filter": {"shop_id":String($scope.storeId),"offer_id.start_date":{"$lte":"$$CurrentDate"},"offer_id.end_date":{"$gte":"$$CurrentDate"},"status":"Approved","transaction_type_id": {"$in": ["553209267dfd81072b176bba"]}},"$sort":{"date":-1}};  
        }
        StoreService.getReportTransacation(opts, function(data) {
            $scope.maploader = false;
            if(data.code == 200 && data.status == 'ok'){
                $scope.reportlist = data.response.result;
                $scope.reportlistsearch = data.response.result;
                if($scope.reportlist.length > $scope.itemsPerPage){
                    $scope.pagination = true;
                }
                for(var i=0; i<$scope.reportlist.length; i++) {
                        var mi = new Array($scope.reportlist[i].citizen_id.latitude, $scope.reportlist[i].citizen_id.longitude,$scope.reportlist[i].citizen_id._id, $scope.reportlist[i].citizen_id.user_thumbnail_image, $scope.reportlist[i].citizen_id.name, $scope.reportlist[i].transaction_value, $scope.reportlist[i].citizen_id.address_l2, $scope.reportlist[i]._id);
                            locations.push(mi);
                }

                map.setCenter(new google.maps.LatLng(41.9000,12.4833)); 
                map.setZoom(6);

                var infowindow = new google.maps.InfoWindow();
                var marker, i;
                var pin = {
                    url: 'app/assets/images/green-pin.png'
                };

                for (var i = 0; i < locations.length; i++) {
                    //if(locations[i][0] !== undefined && locations[i][1] !== undefined){
                        marker = new google.maps.Marker({
                        position: new google.maps.LatLng(locations[i][0], locations[i][1]),
                        map: map,
                        icon :pin
                        });

                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            if(locations[i][6] == undefined){
                                locations[i][6] = '';
                            }
                            if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><a href='#/viewfriend/"+locations[i][2]+"'><img src='app/assets/images/prof-pic.jpg'></a></div><div class='desc'><a href='#/viewfriend/"+locations[i][2]+"'><span class='name'>"+locations[i][4]+"</span></a><span class='add-map'>"+locations[i][6]+"</span><span class='currency'>"+locations[i][5]+" euro</span></div></div>");
                            } else {
                                infowindow.setContent("<div class='mappopup'><div class='pic-container'><a href='#/viewfriend/"+locations[i][2]+"'><img src='"+locations[i][3]+"'></a></div><div class='desc'><a href='#/viewfriend/"+locations[i][2]+"'><span class='name'>"+locations[i][4]+"</span></a><span class='add-map'>"+locations[i][6]+"</span><span class='currency'>"+locations[i][5]+" euro</span></div></div>");   
                            }              
                            infowindow.open(map, marker);
                        }
                    })(marker, i));
                    arrTransactionMarker.push(marker);
                    gmarkers.push(marker);
                   // } 
                }
            } else {
                $scope.pagination = false;
            }
            //$scope.initializeReportMap();

        });
    };
    //Display Map
    $scope.initializeReportMap = function() {
      var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(41.9000,12.4833)
      };
      map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
      var infowindow = new google.maps.InfoWindow();
        var marker, i;
        var pin = {
            url: 'app/assets/images/green-pin.png'
        };

        for (var i = 0; i < locations.length; i++) {
            //if(locations[i][0] !== undefined && locations[i][1] !== undefined){
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][0], locations[i][1]),
                map: map,
                icon :pin
                });

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    if(locations[i][6] == undefined){
                        locations[i][6] = '';
                    }
                    if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><a href='#/viewfriend/"+locations[i][2]+"'><img src='app/assets/images/prof-pic.jpg'></a></div><div class='desc'><a href='#/viewfriend/"+locations[i][2]+"'><span class='name'>"+locations[i][4]+"</span></a><span class='add-map'>"+locations[i][6]+"</span><span class='currency'>"+locations[i][5]+" euro</span></div></div>");
                    } else {
                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><a href='#/viewfriend/"+locations[i][2]+"'><img src='"+locations[i][3]+"'></a></div><div class='desc'><a href='#/viewfriend/"+locations[i][2]+"'><span class='name'>"+locations[i][4]+"</span></a><span class='add-map'>"+locations[i][6]+"</span><span class='currency'>"+locations[i][5]+" euro</span></div></div>");   
                    }              
                    infowindow.open(map, marker);
                }
            })(marker, i));
            arrTransactionMarker.push(marker);
            gmarkers.push(marker);
           // } 
        }
        var input = (document.getElementById('pac-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        //if(flag == 0) {

        var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));
        //}
        google.maps.event.addListener(searchBox, 'places_changed', function() {
            arrId = [];
            var address = document.getElementById('pac-input').value;
            document.getElementById('pac-input').value = address;
            //$scope.addressFilter = address;
            var radius = parseInt(50, 10)*1000;
            geocoder.geocode({ 'address': address}, function(results, status) {
               
                if (status == google.maps.GeocoderStatus.OK) {
                    var searchCenter = results[0].geometry.location
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    var latlng = new google.maps.LatLng(latitude, longitude);            
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                    marker.setMap(null);
                    if (circle) circle.setMap(null);
                        circle = new google.maps.Circle({center:searchCenter, 
                                             //radius: radius,
                                             //fillOpacity: 0.35,
                                             //fillColor: "#FF0000",
                                             strokeWeight: 2,
                                             map: map});
                    var bounds = new google.maps.LatLngBounds();
                    
                    for (var i=0; i<gmarkers.length;i++) {
                        if (google.maps.geometry.spherical.computeDistanceBetween(gmarkers[i].getPosition(),searchCenter) < radius) { 
                            arrId.push(locations[i][7]);
                            var infowindow = new google.maps.InfoWindow();
                            var marker, i;
                            var pin = {
                                url: 'app/assets/images/silver-pin.png'
                            };
                            gmarkers[i].getPosition();
                            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                                return function() {
                                    if(locations[i][6] == undefined){
                                        locations[i][6] = '';
                                    }
                                    if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
                                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><a href='#/viewfriend/"+locations[i][2]+"'><img src='app/assets/images/prof-pic.jpg'></a></div><div class='desc'><a href='#/viewfriend/"+locations[i][2]+"'><span class='name'>"+locations[i][4]+"</span></a><span class='add-map'>"+locations[i][6]+"</span><span class='currency'>"+locations[i][5]+" euro</span></div></div>");
                                    } else {
                                        infowindow.setContent("<div class='mappopup'><div class='pic-container'><a href='#/viewfriend/"+locations[i][2]+"'><img src='"+locations[i][3]+"'></a></div><div class='desc'><a href='#/viewfriend/"+locations[i][2]+"'><span class='name'>"+locations[i][4]+"</span></a><span class='add-map'>"+locations[i][6]+"</span><span class='currency'>"+locations[i][5]+" euro</span></div></div>");   
                                    }              
                                    infowindow.open(map, marker);
                            }
                            })(marker, i));
                            bounds.extend(gmarkers[i].getPosition())
                            gmarkers[i].setMap(map);
                        } else {            
                            gmarkers[i].setMap(null);        
                        }
                    }
                    if(arrId.length > 0){
                        map.fitBounds(bounds);
                        map.setZoom(9);
                    } else {
                         //map.fitBounds(circle.getBounds());
                         map.setCenter(new google.maps.LatLng(latitude,longitude)); 
                         map.setZoom(6);
                    }
                    $scope.newArraylist();                    
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
        var flag = 1;
    }
    $scope.reportTransaction(2);  
    var resultArray = [];
    $scope.newArraylist = function() {
        resultArray = [];
        for(var j = 0; j < arrId.length ; j++){
            for (var k = 0; k < $scope.reportlistsearch.length; k++) {
                if($scope.reportlistsearch[k]._id == arrId[j]){
                //console.log($scope.reportlist[arrayVal]._id+'id'); 
                    resultArray.push($scope.reportlistsearch[k]);
                }
            }
        }
        $scope.reportlist = resultArray;
        $scope.currentPage = 0;
        //$scope.setPage(1);
         $timeout(function(){
                $scope.range();
            }, 2000);
        
        //$scope.pageCount();
        //console.log(JSON.stringify(resultArray)+'kkkkk');
    }
    //Pagination
    $scope.currentPage = 0;
    $scope.itemsPerPage = 8;
    $scope.pagination = false;
    $scope.totalsize = [];
    $scope.range = function() {
        var rangeSize = Math.ceil($scope.reportlist.length/$scope.itemsPerPage);
       
        var ret = [];
        var start;
        start = $scope.currentPage;
        if ( start > $scope.pageCount()-rangeSize ) {
            start = $scope.pageCount()-rangeSize+1;
        }
        for (var i=start; i<start+rangeSize; i++) {
            ret.push(i);
        }
        $scope.totalsize = ret;
        return ret;
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.pageCount = function() {
        if ($scope.reportlist !== undefined) {
            return Math.ceil($scope.reportlist.length/$scope.itemsPerPage)-1;
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function(n) {
        $scope.currentPage = n;
    }; 

    $scope.pageinit = function() {
        $scope.currentPage = 0;
    }
}]);
