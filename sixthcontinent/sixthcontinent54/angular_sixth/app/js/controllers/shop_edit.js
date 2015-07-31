//Create Store controller here
app.controller('EditShopController', ['$route', '$scope', '$http', '$sce', '$routeParams', '$location', '$timeout', 'StoreService', 'fileReader', 'ProfileService', 'focus', function($route, $scope, $http, $sce, $routeParams, $location, $timeout, StoreService, fileReader, ProfileService, focus) {
    $scope.store = {}
    $scope.store.storecategory = '';
    $scope.store.sale_subcatid = '';
    $scope.legalForms = APP.legalForms;
    $scope.countries  = APP.countries;
    $scope.regions = APP.regions;
    var latitudeMap = 0;
    var longitudeMap = 0;

    //create data of birth drop dwon start
    //creat month array
    $scope.months = $scope.i18n.profile.months;
    //create days array
    $scope.days = [];
    $scope.years = [];
    $scope.daysLimit = 31;
    $scope.getDays = function(daysLimit) {
    for (start = 1;start <= daysLimit; start++) {
        $scope.days.push({"id":start,"value":start});
    }
    }
    $scope.getYears = function() {
    var currentYear = new Date().getFullYear();
    $scope.years = [];
    for (var i = 1914; i <= currentYear ; i++){
        $scope.years.push({"id":i,"value":i});
    }
    }
    $scope.getYears();
    $scope.getDays($scope.daysLimit);
    $scope.changeShopMonth = function() {
        if($scope.store.dobMonth.value%2===1){
            $scope.days = [];
            $scope.getDays(31);
        } else if(($scope.store.dobMonth.value === 2) && ($scope.store.dobYear.value%4 === 0)){
            $scope.days = [];
            $scope.getDays(29);
        } else if($scope.store.dobMonth.value === 2){
            $scope.days = [];
            $scope.getDays(28);
        } else {
            $scope.days = [];
            $scope.getDays(30);
        }
    };

    $scope.changeShopYear = function() {
        if($scope.store.dobYear.value%4 === 0 && $scope.store.dobMonth.value === 2){
            $scope.days = [];
            $scope.getDays(29);
        } else if($scope.store.dobYear.value%4 !== 0 && $scope.store.dobMonth.value === 2) {
            $scope.days = [];
            $scope.getDays(28);
        } else if($scope.store.dobYear.value%4 !== 0 && $scope.store.dobMonth.value%2 === 1) {
            $scope.days = [];
            $scope.getDays(31);
        } else {
            $scope.days = [];
            $scope.getDays(30);
        }
    };

    //create data of birth drop dwon end
    $scope.initialize = function () {
        var myLatlng = new google.maps.LatLng(latitudeMap, longitudeMap);
        var mapOptions = {
            center: new google.maps.LatLng(latitudeMap, longitudeMap),
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
            document.getElementById("latitude").value = countryPlace.geometry.location.lat();
            document.getElementById("longitude").value = countryPlace.geometry.location.lng();
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

    $scope.loadDetails = function() {
        $scope.storeLoading = true;
        $scope.updateStart = false;
        $scope.createStoreError = false;
        $scope.createStoreErrorMgs = ''; 
        $scope.showEditForm = false;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $routeParams.id;
        StoreService.getStoreDetail(opts, function(data) {
            if(data.code == 101) {
                $scope.storeDetail = data.data;
                $scope.store = $scope.storeDetail;
                $scope.store.confirmemail = $scope.storeDetail.email;
                //seting kewyord list to show store data
                if($scope.storeDetail.shop_keyword != '' && $scope.storeDetail.shop_keyword != undefined && $scope.storeDetail.shop_keyword != null){
                    $scope.keywordList = $scope.storeDetail.shop_keyword.split(',');
                }
                //seting dropdowns to show store data
                var tempcat = $scope.storeDetail.sale_catid;
                $scope.store.storecategory = {"id":parseInt($scope.storeDetail.sale_catid)};
                //$scope.getSubCategory();
                $scope.store.subcategory = {"id":$scope.storeDetail.sale_subcatid};
                $scope.store.legal_status = {"id":$scope.storeDetail.legal_status};
                $scope.store.regOfficeCountry = {"id":$scope.storeDetail.business_country};
                $scope.store.sale_country = {"id":$scope.storeDetail.sale_country};
                $scope.store.regOfficeCountry = {"id":$scope.storeDetail.business_country};
                if($scope.store.repres_dob != '' && $scope.store.repres_dob != undefined && $scope.store.repres_dob != null) {
                    var DOB = $scope.store.repres_dob.substring(0,10);
                    var dtArray = DOB.split("-");
                    $scope.store.dobDay = {"id":parseInt(dtArray[2])};
                    $scope.store.dobMonth = {"value":parseInt(dtArray[1])};
                    $scope.store.dobYear = {"id":parseInt(dtArray[0])};
                }
                document.getElementById("latitude").value = $scope.storeDetail.latitude;
                document.getElementById("longitude").value = $scope.storeDetail.longitude;
                document.getElementById("mapplace").value = $scope.storeDetail.map_place;
                $scope.store.business_region = {"id":$scope.checkRegionExist(APP.regions, $scope.storeDetail.business_region)};
                $scope.store.sale_region = {"id":$scope.checkRegionExist(APP.regions, $scope.storeDetail.sale_region)};
                $scope.storeLoading = false;
                latitudeMap = data.data.latitude;
                longitudeMap = data.data.longitude;
                angular.element('#pac-input').val(data.data.map_place);
                $scope.initialize();
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
            } else {
                $scope.storeLoading = false;
                $scope.createStoreError = true;
            }
        });
    }
    $scope.loadDetails();

    $scope.checkRegionExist = function(p, k) {
        for(var i=0;i<p.length;i++){
            var obj = p[i];
            if (obj['id'] === k) {
                return k;
            }        
        }
        return undefined;
    }

    $scope.commonError = false;
    $scope.vatNumberInvalid = false;
    $scope.ibanNumberInvalid = false;
    $scope.updateEditStore = function() {
        $scope.updateStart = true;
        $scope.formSubmitted = true;
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_id = $scope.store.id;
        if($scope.store.name == undefined || $scope.store.name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_name;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.storename.$dirty = true;
            $scope.shopEditForm.storename.$invalid = true;
            $scope.shopEditForm.storename.$error.required = true;
            focus('storename');
            return false;
        } else if($scope.store.business_name == undefined || $scope.store.business_name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storename;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.storecompany.$dirty = true;
            $scope.shopEditForm.storecompany.$invalid = true;
            $scope.shopEditForm.storecompany.$error.required = true;
            focus('storecompany');
            return false;
        } else if($scope.store.legal_status == undefined || $scope.store.legal_status == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storestatus;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.legalstatus.$dirty = true;
            $scope.shopEditForm.legalstatus.$invalid = true;
            $scope.shopEditForm.legalstatus.$error.required = true;
            focus('legalstatus');
            return false;
        } else if($scope.store.vat_number == undefined || $scope.store.vat_number == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storevat;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.vatnumber.$dirty = true;
            $scope.shopEditForm.vatnumber.$invalid = true;
            $scope.shopEditForm.vatnumber.$error.required = true;
            focus('vatnumber');
            return false;
        } else if($scope.store.fiscal_code == undefined || $scope.store.fiscal_code == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storetax;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.fiscalcode.$dirty = true;
            $scope.shopEditForm.fiscalcode.$invalid = true;
            $scope.shopEditForm.fiscalcode.$error.required = true;
            focus('fiscalcode');
            return false;
        } else if($scope.store.email == undefined || $scope.store.email == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeemail;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.email.$dirty = true;
            $scope.shopEditForm.email.$invalid = true;
            $scope.shopEditForm.email.$error.required = true;
            focus('email');
            return false;
        } else if($scope.store.confirmemail == undefined || $scope.store.confirmemail == '' || ($scope.store.email !== $scope.store.confirmemail)){
            $scope.inputname = "confirmemail";
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeemail;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.confirmemail.$dirty = true;
            $scope.shopEditForm.confirmemail.$invalid = true;
            $scope.shopEditForm.confirmemail.$error.required = true;
            focus('confirmemail');
            return false;
        } else if($scope.store.phone == undefined || $scope.store.phone == '' || isNaN($scope.store.phone) == true){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storenumber;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.phone.$dirty = true;
            $scope.shopEditForm.phone.$invalid = true;
            $scope.shopEditForm.phone.$error.required = true;
            focus('phone');
            return false;
        } else if($scope.store.iban == undefined || $scope.store.iban == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeiban;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.iban.$dirty = true;
            $scope.shopEditForm.iban.$invalid = true;
            $scope.shopEditForm.iban.$error.required = true;
            focus('iban');
            return false;
        } else if($scope.store.storecategory == undefined || $scope.store.storecategory == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storecategory;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
            $scope.shopEditForm.iban.$dirty = true;
            $scope.shopEditForm.iban.$invalid = true;
            $scope.shopEditForm.iban.$error.required = true;
            focus('storecategory');
            return false;
        } else if($scope.store.description == undefined || $scope.store.description == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storedesc;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.description.$dirty = true;
            $scope.shopEditForm.description.$invalid = true;
            $scope.shopEditForm.description.$error.required = true;
            focus('description');
            return false;
        } else if($scope.store.regOfficeCountry == undefined || $scope.store.regOfficeCountry == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_country;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
            $scope.shopEditForm.regofficecountry.$dirty = true;
            $scope.shopEditForm.regofficecountry.$invalid = true;
            $scope.shopEditForm.regofficecountry.$error.required = true;
            focus('regofficecountry');
            return false;
        } else if($scope.store.business_region.id == undefined || $scope.store.business_region.id == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeregregion;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.businessregion.$dirty = true;
            $scope.shopEditForm.businessregion.$invalid = true;
            $scope.shopEditForm.businessregion.$error.required = true;
            focus('businessregion');
            return false;
        } else if($scope.store.business_city == undefined || $scope.store.business_city == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeregcity;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.businesscity.$dirty = true;
            $scope.shopEditForm.businesscity.$invalid = true;
            $scope.shopEditForm.businesscity.$error.required = true;
            focus('businesscity');
            return false;
        } else if($scope.store.province == undefined || $scope.store.province == '' ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeregprovince;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.province.$dirty = true;
            $scope.shopEditForm.province.$invalid = true;
            $scope.shopEditForm.province.$error.required = true;
            focus('province');
            return false;
        }  else if($scope.store.province.length < 2 || $scope.store.province.length > 2 ){
            $scope.createStoreErrorMgs = $scope.i18n.validation.province_length;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.province.$dirty = true;
            $scope.shopEditForm.province.$invalid = true;
            $scope.shopEditForm.province.$error.required = true;
            focus('province');
            return false;
        } else if($scope.store.zip == undefined || $scope.store.zip == '' || $scope.store.zip.length < 5 || $scope.store.zip.length > 5 ){
            $scope.createStoreErrorMgs = $scope.i18n.register.enter_businesszip;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.storezip.$dirty = true;
            $scope.shopEditForm.storezip.$invalid = true;
            $scope.shopEditForm.storezip.$error.required = true;
            focus('storezip');
            return false;
        } else if($scope.store.business_address == undefined || $scope.store.business_address == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_storeregaddress;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.businessaddress.$dirty = true;
            $scope.shopEditForm.businessaddress.$invalid = true;
            $scope.shopEditForm.businessaddress.$error.required = true;
            focus('businessaddress');
            return false;
        }  else if($scope.store.sale_country == undefined || $scope.store.sale_country == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstorecountry;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salecountry.$dirty = true;
            $scope.shopEditForm.salecountry.$invalid = true;
            $scope.shopEditForm.salecountry.$error.required = true;
            focus('salecountry');
            return false;
        } else if($scope.store.sale_region.id == undefined || $scope.store.sale_region.id == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstoreregion;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleregion.$dirty = true;
            $scope.shopEditForm.saleregion.$invalid = true;
            $scope.shopEditForm.saleregion.$error.required = true;
            focus('saleregion');
            return false;
        } else if($scope.store.sale_city == undefined || $scope.store.sale_city == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstorecity;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salecity.$dirty = true;
            $scope.shopEditForm.salecity.$invalid = true;
            $scope.shopEditForm.salecity.$error.required = true;
            focus('salecity');
            return false;
        } else if($scope.store.sale_province == undefined || $scope.store.sale_province == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstoreprovince;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleprovince.$dirty = true;
            $scope.shopEditForm.saleprovince.$invalid = true;
            $scope.shopEditForm.saleprovince.$error.required = true;
            focus('saleprovince');
            return false;
        } else if($scope.store.sale_province.length < 2 || $scope.store.sale_province.length > 2){
            $scope.createStoreErrorMgs = $scope.i18n.validation.hqprovincelength;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.saleprovince.$dirty = true;
            $scope.shopEditForm.saleprovince.$invalid = true;
            $scope.shopEditForm.saleprovince.$error.required = true;
            focus('saleprovince');
            return false;
        }else if($scope.store.sale_zip == undefined || $scope.store.sale_zip == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstoreprovince;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salezip.$dirty = true;
            $scope.shopEditForm.salezip.$invalid = true;
            $scope.shopEditForm.salezip.$error.required = true;
            focus('salezip');
            return false;
        } else if($scope.store.sale_zip.length < 5 || $scope.store.sale_zip.length > 5){
            $scope.createStoreErrorMgs = $scope.i18n.validation.hqprovincelength;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salezip.$dirty = true;
            $scope.shopEditForm.salezip.$invalid = true;
            $scope.shopEditForm.salezip.$error.required = true;
            focus('salezip');
            return false;
        } else if($scope.store.sale_address == undefined || $scope.store.sale_address == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstoreaddress;
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
            $scope.shopEditForm.emailaddress.$dirty = true;
            $scope.shopEditForm.emailaddress.$invalid = true;
            $scope.shopEditForm.emailaddress.$error.required = true;
            focus('emailaddress');
            return false;
        } else if($scope.store.sale_phone_number == undefined || $scope.store.sale_phone_number == '' || isNaN($scope.store.sale_phone_number) == true){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_hqstorephone;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.salephone.$dirty = true;
            $scope.shopEditForm.salephone.$invalid = true;
            $scope.shopEditForm.salephone.$error.required = true;
            focus('salephone');
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
            $scope.shopEditForm.represfirstname.$dirty = true;
            $scope.shopEditForm.represfirstname.$invalid = true;
            $scope.shopEditForm.represfirstname.$error.required = true;
            focus('represfirstname');
            return false;
        } else if($scope.store.repres_last_name == undefined || $scope.store.repres_last_name == ''){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_lastName;
            $scope.createGroupError = true;
            $scope.updateStart = false;
            $scope.shopEditForm.represlastname.$dirty = true;
            $scope.shopEditForm.represlastname.$invalid = true;
            $scope.shopEditForm.represlastname.$error.required = true;
            focus('represlastname');
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
            $scope.updateStart = false;
            $scope.shopEditForm.represprovince.$dirty = true;
            $scope.shopEditForm.represprovince.$invalid = true;
            $scope.shopEditForm.represprovince.$error.required = true;
            focus('represprovince');
            return false;
        } else if($scope.store.repres_province.length < 2 || $scope.store.repres_province.length > 2 ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntProvince;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
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
        } else if($scope.store.repres_zip.length < 5 || $scope.store.repres_zip.length > 5 ){
            $scope.createStoreErrorMgs = $scope.i18n.store.enter_permntProvince;
            $scope.createStoreError = true;
            $scope.createStoreLoader = false;
            $scope.updateStart = false;
            $scope.shopEditForm.represzip.$dirty = true;
            $scope.shopEditForm.represzip.$invalid = true;
            $scope.shopEditForm.represzip.$error.required = true;
            focus('represzip');
            return false;
        }else if($scope.store.dobYear != undefined || $scope.store.dobYear != ''){
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
        var dd = $scope.store.dobDay.id;
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
                $location.path("/shop/"+$scope.store.id+"/contract");
            } else if(data.code == 137){   
                $scope.createStoreErrorMgs = $scope.i18n.validation.broker_not_exists;
                $scope.updateStart = false;
                $scope.commonError = true;
                $scope.createStoreLoader = false;
                $timeout(function(){
                    $scope.commonError = false;
                }, 3000);
            } else if(data.code == 100){
                $scope.createStoreErrorMgs = $scope.i18n.validation.missed_param;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.updateStart = false;
                $scope.commonError = true;
                $scope.createStoreLoader = false;
                $timeout(function(){
                    $scope.commonError = false;
                }, 3000);
            } else if(data.code == 90){    
                $scope.createStoreErrorMgs = $scope.i18n.validation.account_inactive;
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.commonError = true;
                $scope.createStoreLoader = false;
                $timeout(function(){
                    $scope.commonError = false;
                }, 3000);
            } else if(data.code == 91){
                $scope.createStoreErrorMgs = $scope.i18n.validation.vat_exists;    
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.vatNumberInvalid = true;
                $timeout(function(){
                    $scope.vatNumberInvalid = false;
                }, 3000);
                focus('vatnumber');
            } else if(data.code == 126){
                $scope.createStoreErrorMgs = $scope.i18n.validation.invalid_store_forum_type;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.commonError = true;
                $scope.createStoreLoader = false;
                $timeout(function(){
                    $scope.commonError = false;
                }, 3000);
            } else if(data.code == 500){
                $scope.createStoreErrorMgs = $scope.i18n.validation.permission_denied;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.commonError = true;
                $scope.createStoreLoader = false;
                $timeout(function(){
                    $scope.commonError = false;
                }, 3000);
            } else if(data.code == 89){
                $scope.createStoreErrorMgs = $scope.i18n.validation.error_occured;    
                $scope.createGroupError = true;
                $scope.updateStart = false;
                $scope.commonError = true;
                $scope.createStoreLoader = false;
                $timeout(function(){
                    $scope.commonError = false;
                }, 3000);
            } else if(data.code == 165){
                $scope.createStoreErrorMgs = $scope.i18n.validation.vat_valid;    
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.vatNumberInvalid = true;
                $timeout(function(){
                    $scope.vatNumberInvalid = false;
                }, 3000);
                focus('vatnumber');
            } else if(data.code == 166){
                $scope.createStoreErrorMgs = $scope.i18n.validation.iban_valid;    
                $scope.createStoreError = false;
                $scope.updateStart = false;
                $scope.ibanNumberInvalid = true;
                $timeout(function(){
                    $scope.ibanNumberInvalid = false;
                }, 3000);
                focus('iban');
            } else {
                $scope.createStoreErrorMgs = data.message;  
                $scope.updateStart = false;
                $scope.createStoreLoader = false;
                $scope.commonError = true;
                $scope.createStoreLoader = false;
                $timeout(function(){
                    $scope.commonError = false;
                }, 3000);
            }
        });
    };

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
    $scope.searchCategory($scope.currentLanguage);

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
               $scope.storeKeyword($scope.categoryKeyword);
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
    $scope.categoryKeyword = "";
    $scope.keywordList = [];
    $scope.storeKeyword = function(index){
        $scope.keywords = [];
        $scope.keywordIndex = -1;
        $scope.categoryKeyword = "";
    //  $scope.categoryKeyword = index.name;
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
}]);

//Redirect user to shop edit when user loggedIn
app.controller('RedirectToShopEdit', ['$cookieStore', '$rootScope', 'ipCookie', '$scope', '$http', '$routeParams', '$location', '$timeout', 'StoreService', 'ProfileService', 'focus', function($cookieStore, $rootScope, ipCookie, $scope, $http, $routeParams, $location, $timeout, StoreService, ProfileService, focus) {
    if( localStorage.getItem('loggedInUser') && localStorage.getItem('access_token')) {
        var opts = {};
        opts.user_id = APP.currentUser.id;
        opts.store_type = 2; 
        opts.limit_start = 0;
        opts.limit_size = 1;
        opts.lang_code = $scope.currentLanguage;
        opts.filter_type = 1;
        StoreService.getStore(opts, function(data) {
            if(data.code === 101) {
                $location.path('/edit/shop/'+data.data.stores[0].id);
            } else {
                $location.path('/');   
            }
        });
    } else {
        $location.path('/');
    }
}]);

//Redirect user to shop edit when user loggedIn
app.controller('AutoLoginFromMobileApp', ['$cookieStore', '$rootScope', 'ipCookie', '$scope', '$http', '$routeParams', '$location', '$timeout', 'ProfileService', 'UserService', function($cookieStore, $rootScope, ipCookie, $scope, $http, $routeParams, $location, $timeout, ProfileService, UserService) {
    $scope.userToken = $routeParams.tokenId;
    $scope.userId = $routeParams.userId;
    $rootScope.currentUser = {};
    APP.accessToken = $routeParams.tokenId;
    var opts3 = {};
    opts3.user_id = $routeParams.userId;
    opts3.profile_type = 4;
    UserService.getBasicProfile(opts3, function(data) {
        if(data.code == 101){
            $rootScope.currentUser = {
                "id":data.data.user_id,
                "username":data.data.email,
                "email":data.data.email,
                "enabled":true,
                "date_of_birth":data.data.date_of_birth,
                "firstname":data.data.firstname,
                "lastname":data.data.lastname,
                "gender":data.data.gender,
                "country":data.data.country_code,
                "profile_img":data.data.profile_img.original,
                "profile_img_thumb":data.data.profile_img.thumb,
                "cover_img":data.data.profile_cover_img.original,
                "cover_img_thumb":data.data.profile_cover_img.thumb,
                "citizen_profile":data.data.citizen_profile,
                "broker_profile":data.data.broker_profile,
                "store_profile":data.data.store_profile,
                "broker_profile_active":0,
                "current_language":data.data.current_language
            };
            APP.currentUser = $rootScope.currentUser;
            ipCookie("loggedInUser", $rootScope.currentUser, { expires: 365 });
            ipCookie("access_token", APP.accessToken, { expires: 3000 });
            $rootScope.isLoggedIn = true;
            $scope.selectlanguage(data.data.current_language);
            $rootScope.currentUser.basicProfile = data.data;

            //get users credit and the total income 
            var opts4 = {};
            opts4.idcard = $rootScope.currentUser.basicProfile.user_id;
            UserService.getCreditAndIncome(opts4, function(data) {
                var currentCredit = {};
                if(data.code == 101) {
                    currentCredit.totalCredit = (data.data.saldoc/1000000) ;
                    currentCredit.totCreditMicro = (data.data.saldorm) + (data.data.saldorc) ;
                    currentCredit.totalIncome = data.data.tot_income;
                    currentCredit.totalIncomeShow = data.data.tot_income;
                    $rootScope.currentUser.creditAndIncome = currentCredit;
                }
                else{
                    $rootScope.currentUser.creditAndIncome = data.data;
                }
            });

            $rootScope.allFriendTotal = 0;
            $rootScope.getCountOfAllTypeNotificaton();
            $scope.$parent.loggedIn = true;
            $location.path('/offer/1');
        } else {
           $location.path('/'); 
        }
    });

}]);