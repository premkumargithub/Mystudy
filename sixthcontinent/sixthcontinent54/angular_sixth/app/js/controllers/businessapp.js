app.controller('businessAppController', ['$scope', 'StoreService', '$cookieStore', function ($scope, StoreService, $cookieStore) {  
    
    $scope.currentLanguage = $cookieStore.get("activeLanguage");
    $scope.businessApp     = [];
    
    $scope.myStoreList = function() {
        var opts = {};
            opts.user_id = APP.currentUser.id;
            opts.store_type  = 2; 
            opts.limit_start = 0;
            opts.limit_size  = 50;
            opts.lang_code   = $scope.currentLanguage;
            opts.filter_type = 1;
       
            StoreService.getStore(opts, function(data) {
                if(data.code === 101) {
                    $scope.businessApp = data.data.stores;
                }
            });
        };
        $scope.myStoreList();
}]);