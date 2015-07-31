app.controller('StorePaymentController', ['$scope', '$http', 'StorePaymentService', '$rootScope', '$location', '$routeParams', '$cookieStore', function ($scope, $http, StorePaymentService, $rootScope, $location, $routeParams, $cookieStore) {
    $scope.agree ='not_agreement'; //used in terms and contion button
    $scope.loadTerms = true;
    $scope.cardType = $routeParams.type;
    if($rootScope.tempStoreId == '' || $rootScope.tempStoreId == undefined){
        $scope.profileId = $routeParams.id;
    } else {
        $scope.profileId = $rootScope.tempStoreId;
        $cookieStore.put('tempStoreId',$rootScope.tempStoreId);
    }
        $scope.userId = APP.currentUser.id;
    if($scope.cardType == 2){
        $scope.paymentType = APP.card.add_type; //to add card in shop multiple card add
    } else if($scope.cardType == 1) {
        $scope.paymentType = APP.card.add_type; //'registration fee' for shop regirstration    
    } else {
        $scope.paymentType = APP.card.add_type;
    }
    
    var opts = {};
        opts.profile_id = $scope.profileId;
        opts.user_id    = $scope.userId;
        opts.cancel_url = APP.payment.siteDomain + '#/shop/paycancel'; 
        opts.return_url = APP.payment.siteDomain + '#/shop/paysuccess'; 
        opts.payment_type = $scope.paymentType;

    StorePaymentService.getOneClickPaymentUrls(opts, function(data) {  
        if(data.code == 101) {
            if(data.data.url != '' ) {
                $scope.loadTerms = false;
                $scope.storePaymentUrl =  data.data.url;
            } else { 
                $scope.loadTerms = false;
                $scope.storePaymentUrl = '';
            } 
        } else { 
            $scope.loadTerms = false;
            $scope.storePaymentUrl = '';
        } 
    });
}]);

app.controller('StorePaymentReturnController',['$scope','$http', 'StorePaymentService', '$rootScope', '$location',  '$routeParams', function ($scope, $http, StorePaymentService, $rootScope, $location,  $routeParams) {
    $scope.codTrans = $location.search().codTrans;
    $scope.amount = $location.search().importo;
    $scope.uniform = $location.search().divisa;
    $scope.outcome = $location.search().esito;
    $scope.descrizione = $location.search().descrizione;
    $scope.pan = $location.search().pan;
    $scope.profileId = $rootScope.tempStoreId;
    if($scope.outcome == 'OK'){
        $scope.backurl = APP.payment.siteDomain + '#/shop/view/'+$scope.profileId;
        $scope.success = true;
    }else{
        $scope.backurl = APP.payment.siteDomain + '#/';
        $scope.success = false; 
    }
}]);

app.controller('StorePaymentCancelController',['$scope','$http', 'StorePaymentService', '$rootScope', '$location',  '$routeParams',  function ($scope, $http, StorePaymentService, $rootScope, $location,  $routeParams) {
    $scope.codTrans = $location.search().codTrans;
    $scope.amount = $location.search().importo;
    $scope.uniform = $location.search().divisa;
    $scope.outcome = $location.search().esito;
    $scope.profileId = $rootScope.tempStoreId;
    $scope.backurl = APP.payment.siteDomain + '#/profiles';
}]);

app.controller('StoreRegistrationPaymentController', ['$scope','$http', 'StorePaymentService', 'UserService', 'saveUserPass', '$rootScope', '$location', 'StoreService', '$routeParams', function ($scope, $http, StorePaymentService, UserService, saveUserPass, $rootScope, $location, StoreService, $routeParams) {
    $scope.agree ='not_agreement'; //used in terms and contion button
    $scope.user.userName = saveUserPass.getUsername();
    $scope.user.password = saveUserPass.getPassword();
    $scope.loadTerms = true;
    $scope.profileId = $rootScope.tempStoreId;
    $scope.userId = $rootScope.tempUserId; 
    $scope.paymentType = APP.card.add_type; //it will add card
    
     var postData = {
        profile_id : $scope.profileId,
        user_id : $scope.userId,
        payment_type : $scope.paymentType,
        cancel_url : APP.payment.siteDomain + '#/shop/paycancel',
        return_url : APP.payment.siteDomain + '#/shop/paysuccess' 
    };
    
    StorePaymentService.getOneClickPaymentUrls(postData, function(data) {  
        if(data.code == 101) {
            if(data.data.url != '' ) {
                $scope.loadTerms = false;
                $scope.storePaymentUrl =  data.data.url;
            } else { 
                $scope.loadTerms = false;
                $scope.storePaymentUrl = '';
            } 
        } else { 
            $scope.loadTerms = false;
            $scope.storePaymentUrl = '';
        } 
    });
}]);