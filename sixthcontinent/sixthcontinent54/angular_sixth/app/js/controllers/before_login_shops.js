app.controller('BLShopsController', ['$scope', '$http', 'BLShopService', '$timeout', function ($scope, $http, BLShopService, $timeout) {  
	$scope.storeAllList = [];
        $scope.storeListObject = [];
        $scope.storeMyList = [];
        $scope.storeAllList = [];
        $scope.myRes = 1;
        $scope.totalSize = 0;
        $scope.storeLoading = true;
        $scope.notFound = false;
        $scope.allRes = 1;
        $scope.showPublicShop = function() {
        var opts = {};
        var limit_start = $scope.storeAllList.length;
    	opts.limit_start = limit_start;
        opts.limit_size = APP.store_list_pagination.end; 
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.storeLoading = true;
            $scope.allRes = 0;
            BLShopService.getPublicShops(opts, function(data) {
                if(data.code == 101) {
                    $scope.allRes = 1;
                    $scope.totalSize = data.data.size;
                    $scope.storeListObject =  $scope.storeAllList = $scope.storeAllList.concat(data.data.stores);
                    $scope.storeLoading = false;
                    $scope.notFound = false;
                }
                else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                 }
            });
        }
    };

    $scope.showPublicShop();
    $scope.loadMore = function() {     
        $scope.showPublicShop();
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
    $scope.searchTitle ='';
    var DELAY_TIME_BEFORE_POSTING = 300;
    //var element = $('#search');
    var currentTimeout = null;

    $('#shopserchbox').keypress(function() {
      var model = $scope.searchTitle;
      if(currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
      currentTimeout = $timeout(function(){
        $scope.searchStore();
      }, DELAY_TIME_BEFORE_POSTING)
    });
    $scope.searchRes = 0;
    $scope.searchStore = function() {
        $scope.searchRes = 0;
        $scope.storeLoading = true;
        $scope.myStoreActive = '';
        var opts = {};
        if($scope.searchTitle.length >= 3 ){
            if(($scope.searchTitle === undefined || $scope.searchTitle === '') && $scope.searchRes == 1) {
                $scope.allRes = 1;
                $scope.storeMyList = [];
                $scope.storeAllList = [];
            }
            opts.business_name = ($scope.searchTitle === undefined ? '' : $scope.searchTitle); 
            opts.limit_start = APP.store_list_pagination.start;
            opts.limit_size = APP.store_list_pagination.end;
            BLShopService.getSearchStoreDetail(opts, function(data) {
                $scope.searchRes = 1;
                if(data.code == 101) {
                    $scope.storeListObject =  data.data;
                    $scope.storeLoading = false;
                    $scope.notFound = false;
                 }else {
                    $scope.storeListObject =  [];
                    $scope.notFound = true;
                    $scope.storeLoading = false;
                }
            });
        }
    };
}]);
     

// Controller for the show the detail of particular shop with out login //
app.controller('BLDetailShopsController', ['$route','$scope','$location', '$http', 'BLShopService', '$timeout','$routeParams', function ($route,$scope,$location, $http, BLShopService, $timeout,$routeParams) {  
	$scope.$route = $route;
        $scope.storeMainId = $routeParams.id;
        var latitudeMap = 0;
        var longitudeMap = 0;
        $scope.loadDetails = function() {
        $scope.storeLoading = true;
        $scope.updateStart = false;
        $scope.createStoreError = false;
        //$scope.createStoreErrorMgs = $scope.i18n.storealbum.album_createStoreErrorMgs;
        $scope.showEditForm = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $routeParams.id;
        BLShopService.getShopsDetail(opts, function(data) {
            if(data.code == 101) {
                    $scope.storeDetail = data.data;
                  // $scope.aboutStore();
                    $scope.store = $scope.storeDetail;
                    $scope.storeLoading = false;
                    latitudeMap = data.data.latitude;
                    longitudeMap = data.data.longitude;
                    if (($location.path().indexOf("/shop/edit") != -1) ||  ($location.path().indexOf("/shop/view") != -1)) {
                        $timeout(function() {
                        //  $scope.initialize();
                        },  1000); 
                       
                    } else {
                       $timeout(function() {
                         $scope.initializeMaps();
                        },  1000); 
                    }
            } else {
                $scope.storeLoading = false;
                $scope.createStoreError = true;
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
    $scope.loadDetails();
        
        
}]);
app.controller('BLDetailCoverController', ['$route','$scope','$location', '$http', 'BLShopService', '$timeout','$routeParams', function ($route,$scope,$location, $http, BLShopService, $timeout,$routeParams) {    
	$scope.$route = $route;
        $scope.storeMainId = $routeParams.id;
        var latitudeMap = 0;
        var longitudeMap = 0;
        $scope.loadDetails = function() {
        $scope.storeLoading = true;
        $scope.updateStart = false;
        $scope.createStoreError = false;
        //$scope.createStoreErrorMgs = $scope.i18n.storealbum.album_createStoreErrorMgs;
        $scope.showEditForm = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $routeParams.id;
        BLShopService.getShopsDetail(opts, function(data) {
            if(data.code == 101) {
                    $scope.storeDetail = data.data;
                  // $scope.aboutStore();
                    $scope.storeLoading = false;
                    latitudeMap = data.data.latitude;
                    longitudeMap = data.data.longitude;
            } else {
                $scope.storeLoading = false;
                $scope.createStoreError = true;
            }
        });
    };
         $scope.loadDetails();
}]);
app.controller('BLDetailAlbumShopsController', ['$routeParams','$route','$scope','$location', '$http', 'BLShopService', '$timeout', function ($routeParams ,$route,$scope,$location, $http, BLShopService, $timeout) {  
	$scope.totalSize = 0;
        $scope.allRes = 1;
        $scope.listAlbum = [];
        $scope.viewalbum = [];
        $scope.albloader = false;
        $scope.noAlbums = false;
        $scope.noPhotos = false; 
        $scope.storeMainId = $routeParams.id;
        $scope.totalSizeImg = 0;
        $scope.allResImg = 1;
        $scope.$route = $route;
        $scope.listload = false;
        $scope.redirectUrl = function(album_id, album_name) {
        if(album_name == '') {
           album_name = 'Untitled';
           $location.path("/shop/home/image/"+album_id+"/"+album_name+"/"+$scope.storeMainId);
        }
        else {
           $location.path("/shop/home/image/"+album_id+"/"+album_name+"/"+$scope.storeMainId); 
        }
    };
    //Album Store Listing
   
    $scope.storepagealbumlists = function(){  
        $scope.albloader = false;
        var opts = {};
        opts.store_id = $scope.storeMainId;
        var limit_start = $scope.listAlbum.length;
        opts.limit_start = limit_start;
        opts.limit_size = 20; 
        if ((( $scope.totalSize > limit_start) || $scope.totalSize == 0 ) && $scope.allRes == 1) {
            $scope.allRes = 0;
            $scope.listload = true;
            BLShopService.getShopAlbumDetail(opts, function(data){
            if(data.code == 101) {
                $scope.totalSize = data.data.size;
                $scope.allRes = 1;
                $scope.listAlbum = $scope.listAlbum.concat(data.data.album);
                $scope.noAlbums = true;    
                $scope.albloader = false;
                $scope.listload = false;
            }else {
                $scope.albloader = false;
                $scope.listload = false;
               
            }
         });
        }
    };
    // album shop list 
      $scope.storepagealbumlists();  
      $scope.loadMore = function() {     
        $scope.storepagealbumlists();
      };
      
          //View Store Album 
    $scope.viewdetailalbums = function(){
        var limit_start = $scope.viewalbum.length;
        var albumId = $routeParams.album_id;
        $scope.albumname = $routeParams.album_name;
        var opts = {};
        opts.store_id = $routeParams.id; //todo
        opts.album_id = albumId;
        opts.limit_start = limit_start; 
        opts.limit_size = 20; 
        if ((( $scope.totalSizeImg > limit_start) || $scope.totalSizeImg == 0 ) && $scope.allResImg == 1) {
        $scope.listload = true;
        $scope.allResImg = 0;
        BLShopService.getShopPicturesDetail(opts, function(data){
              if(data.code == 101) {
                $scope.albloader = false;
                $scope.totalSizeImg = data.data.size;
                $scope.allResImg = 1;
                $scope.viewalbum = $scope.viewalbum.concat(data.data.media);   
                $scope.listload = false; 
                $scope.noPhotos = true; 
              } else {
                $scope.albloader = false;
                $scope.listload = false; 
            }
        }); 
        } ;
    };
     $scope.viewdetailalbums();
       $scope.loadMoreImage = function() {     
        $scope.viewdetailalbums();
    };
}]);
app.controller('BLDetailPostShopsController', ['$routeParams','$route','$scope', '$http', 'BLShopService', '$timeout', function ($routeParams ,$route,$scope, $http, BLShopService, $timeout) {  
	$scope.$route = $route;
        $scope.posts = [];
        $scope.myRes = 1;
        $scope.isLoading = true;
        $scope.Size = 0;
        $scope.storeMainId = $routeParams.id;
         // function to get the post and comment of the post
    $scope.getPosts = function() {
        var limit_start = $scope.posts.length;
        var opts = {};
        opts.store_id = $scope.storeMainId;
        opts.limit_start = limit_start; 
        opts.limit_size = 20; 
        if ((($scope.Size > limit_start ) || $scope.Size == 0 ) && $scope.myRes == 1) {
        // This service's function returns post
         $scope.myRes = 0; 
            
        BLShopService.getShopPostDetail(opts, function(data){
          if(data.code == 101)
            {
                $scope.posts = $scope.posts.concat(data.data);
                $scope.isLoading = false;
                $scope.myRes = 1;
                $scope.Size = data.count;
                if($scope.posts.length == 0){
                    $scope.noContent = true;
                }
            } else {
                $scope.noContent = false;
                $scope.isLoading = false;
              //  $scope.posts = [];
            }
         });
        };
    };
    // calling get post function on controller load
      $scope.getPosts();
      $scope.loadMore = function() {     
        $scope.getPosts();
    }; 
    // show the comments on post
    $scope.allCommentLoad = [];
    $scope.showComments = [];
    $scope.showAllComments = function(postIndx) {
        $scope.allCommentLoad[postIndx] = true;
        var post = $scope.posts[postIndx];
        var opts = {};
        opts.post_id = post.post_id;
        opts.user_id = $scope.currentUser.id;
        $scope.getComments(opts, postIndx);
        $scope.showComments[postIndx] = true;
    };
    //// call the serive for show the comments of post
     $scope.comments = [];
    $scope.getComments = function(opts, postIndx) {
        $scope.comments[postIndx] = [];
        
        // This service's function returns post
        BLShopService.getCommentsStoreDetail(opts, function(data){
            if(data.code == 100)
            {
                $scope.posts[postIndx].comments = data.data.comment;
                $scope.allCommentLoad[postIndx] = false;
                    if($scope.comments[postIndx].length  != 0 ) {
                        $scope.noComment = true;
                    }
            } else {
                $scope.allCommentLoad[postIndx] = true;
            }
        });
    };

}]);   


//shop Map controller
app.controller('PublicMapStoreController', ['$scope', '$http', 'BLShopService', '$timeout', function ($scope, $http, BLShopService, $timeout) {   


var mapArray = [];
var locations = [];
$scope.maploader = false;
var i;
var m ;
var n = [];
$scope.getmapstores = function(){
    $scope.maploader = true;
        var opts = {"user_id":APP.currentUser.id}; 
        BLShopService.getMapPublicDetail(opts, function(data){
            //console.log('data'+data.data);
            if(data.code == 101) {
                $scope.detail = data.data;
                var mapArray = data.data;
                for(var i=0; i<mapArray.length; i++) {
                    n.push(mapArray[i].name);
                    var mi = new Array(mapArray[i].mapplace, mapArray[i].latitude,mapArray[i].longitude, mapArray[i].thumb_path, mapArray[i].name, mapArray[i].credit_status, mapArray[i].shot_status, mapArray[i].dp_status, mapArray[i].id);
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

/*search by store name starts*/
//var n = ["Action Comics", "Detective Comics", "Superman", "Fantastic Four", "Amazing Spider-Man", "Batman Series", "Repoman Seeks", "Love Comics", "Anime Comics"];

    var containsText = function (search) {
        var gotText = false;
        for (var i in n) {
            var re = new RegExp(search, "ig");
            var s = re.test(n[i]);
            if (s) {
                $scope.itemsArr.push(n[i]);
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

    $scope.itemSelectedData = function (str) {
        $scope.itemsDisplaPanel = false;
        $scope.searchText = str;
         $('#results').html('');
        var a = n.indexOf(str);
        $scope.markerpopup(a);

        //return (str) ? $scope.itemsSelectedArr.push(str) : false;
    };

    $scope.itemSelectedDelet = function (sel) {
        var idx = $scope.itemsSelectedArr.indexOf(sel);
        if (idx !== -1) $scope.itemsSelectedArr.splice(idx, 1);
        $scope.itemsDisplaPanel = false;
    };
/*search by store name ends*/



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

$scope.initialize = function () {
    document.getElementById("pac-input").value = '';
    var markers = [];
    var centerLatLng = new google.maps.LatLng(51.532315,-0.1544);
    map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom:3,
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
                                     radius: radius,
                                     fillOpacity: 0.35,
                                     fillColor: "#FF0000",
                                     map: map});

    var bounds = new google.maps.LatLngBounds();
    $('#results').html('');
    arrMapresult.length = 0;
    for (var i=0; i<gmarkers.length;i++) {
    if (google.maps.geometry.spherical.computeDistanceBetween(gmarkers[i].getPosition(),marker.getPosition()) < radius) {
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
          //infowindow.setContent("<div>"+locations[i][4]+"</div><div>"+locations[i][0]+"</div>");
        if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");   
        }
          infowindow.open(map, marker);
        }
        })(marker, i));
    } else {
          gmarkers[i].setMap(null);
        
    }
    }

    if(arrMapresult.length == 0) {
        bounds.extend(results[0].geometry.location);
        $('#results').html('<span>No Result Found</span>');
    } else {
        $('#results').html('<span>'+arrMapresult.length+' result found</span>');
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

  //pin
  /*  var locations = [
      ['Bondi Beach', -33.890542, 151.274856],
      ['Coogee Beach', -33.923036, 151.259052],
      ['Cronulla Beach', -34.028249, 151.157507],
      ['Manly Beach', -33.80010128657071, 151.28747820854187],
      ['Maroubra Beach', -33.950198, 151.259302]
    ];
    */
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
        }
       

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          //infowindow.setContent("<div>Name : "+locations[i][4]+"</div><div>Buisiness Name : "+locations[i][3]+"</div><div>Address : "+locations[i][0]+"</div>");
           if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");   
        }
          infowindow.open(map, marker);
        }
      })(marker, i));
       arrMarker.push(marker);
       gmarkers.push(marker);

    }
}

$scope.markerpopup = function(index) {
    document.getElementById("shotfilter").checked = false;
    document.getElementById("dpfilter").checked = false;
    $scope.setAllShotMap(null);
        $scope.setAllMap(map);
        $scope.setDpMarker(null);
        $scope.setDpShotMarker(null);
    if(circle != null) {
        circle.setMap(null);
    }
    //circle.setMap(null);
    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    var pin = {
        url: 'app/assets/images/green-pin.png'
    };

    var pin2 = {
        url: 'app/assets/images/silver-pin.png'
    };

    for (i = 0; i < locations.length; i++) {  
        if(locations[i][5] == ''){
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

        

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          //infowindow.setContent("<div>Name : "+locations[i][4]+"</div><div>Buisiness Name : "+locations[i][3]+"</div><div>Address : "+locations[i][0]+"</div>");
           if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");   
        }
          infowindow.open(map, marker);
        }
      })(marker, i));
        arrSearchStore.push(marker);
    }

    google.maps.event.trigger(arrMarker[index], 'click');
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
    var chk = document.getElementById("shotfilter").checked;
    var dpchk = document.getElementById("dpfilter").checked;
    if((chk == true) && (dpchk == false)){
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
                icon :pin
                });
            } else {
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                icon :pin2
                });
            }
            

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                //infowindow.setContent("<div>Name : "+locations[i][4]+"</div><div>Buisiness Name : "+locations[i][3]+"</div><div>Address : "+locations[i][0]+"</div>");
                 if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");   
        }
                infowindow.open(map, marker);
            }
        })(marker, i));
        arrShotMarker.push(marker);
        }      
    }
    } else if((dpchk == true) && (chk == false)){
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
            if(locations[i][6] == 1) {
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
            

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                //infowindow.setContent("<div>Name : "+locations[i][4]+"</div><div>Buisiness Name : "+locations[i][3]+"</div><div>Address : "+locations[i][0]+"</div>");
                 if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");   
        }
                infowindow.open(map, marker);
            }
        })(marker, i));
        arrDpMarker.push(marker);
        }      
    }
    } else if((chk == true) && (dpchk == true)){
        $scope.setDpShotMarker(null);
        $scope.setAllMap(null);
        $scope.setAllShotMap(null);
        var infowindow = new google.maps.InfoWindow();

    var marker, i;
    var pin = {
        url: 'app/assets/images/silver-pin.png'
    };

    for (i = 0; i < locations.length; i++) {
        if((locations[i][7] == 1) || (locations[i][6] == 1)){
          
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                icon :pin
                });           

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                //infowindow.setContent("<div>Name : "+locations[i][4]+"</div><div>Buisiness Name : "+locations[i][3]+"</div><div>Address : "+locations[i][0]+"</div>");
                 if ((locations[i][3] == '') || (locations[i][3] == undefined)) {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='app/assets/images/store-prod.jpg'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");
        } else {
            infowindow.setContent("<div class='mappopup'><div class='pic-container'><img src='"+locations[i][3]+"'></div></div><div class='description'><div><a href='#/shop/view/"+locations[i][8]+"'>"+locations[i][4]+"</a></div><div>"+locations[i][0]+"</div></div></div>");   
        }
                infowindow.open(map, marker);
            }
        })(marker, i));
        arrDpnShotMarker.push(marker);
        }      
    }
    } else {
        $scope.setAllShotMap(null);
        $scope.setAllMap(map);
        $scope.setDpMarker(null);
        $scope.setDpShotMarker(null);
        $scope.setRemoveAllMap(null);
    }
  
}

}]);