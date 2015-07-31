app.service('verifyUser',['$modal', function ($modal) {
    return {
        check: function(){
            
            TrailExpiredModal = false;
        
            var modalInstance = $modal.open({
                templateUrl: "app/views/verify_modal.html",
                size: 'lg',
                controller:'VerifyModal'
            });

            modalInstance.result.then(function () {
            }, function () {
                angular.element(document.getElementById('AppController')).scope().logoutWithoutService();
            });
        }
    };
}]);
