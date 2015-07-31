app.controller('VerifyController',['$location', '$scope', 'UserService', '$modalStack', function($location, $scope, UserService, $modalStack) {
    TrailExpiredModal   = false;
    $scope.verfiyLoader = true;
    $scope.error        = false;
    $scope.message      = '';
    $scope.resend       = false;
    
    $scope.verify = function(){
        var queryParam = $location.search();
        var opts = new Object();
            opts.verify_token = (queryParam.token === undefined ? '' : queryParam.token);
            opts.user_email   = (queryParam.email === undefined ? '' : queryParam.email);

        UserService.verifyAccount(opts, function(data){
            $scope.verfiyLoader = false;
            $scope.error        = true;
            if(data.code === 101){
                $scope.error   = false;
                $scope.message = $scope.i18n.verify_user.success1;
            }else if(data.code === 1003){
                $scope.message = $scope.i18n.verify_user.error2;
            }else if(data.code === 1035){
                $scope.message = $scope.i18n.verify_user.error1;
            }else if(data.code === 1047 || data.code == 1001){
                $scope.message = $scope.i18n.verify_user.error3;
            }else if(data.code === 1048){
                $scope.message = $scope.i18n.verify_user.error4;
                $scope.resend  = true;
            }else{
                $scope.message = $scope.i18n.verify_user.success;
                $scope.error   = false;
            }
        });
    };

    $scope.verify();
}]);

app.controller('VerifyModal',['$scope', '$modalInstance', function($scope, $modalInstance) {
        $scope.closeModal = function () {
            TrailExpiredModal = true;
            $modalInstance.dismiss('cancel');
        };
}]);

app.controller('ResendLink',['$scope', 'UserService', '$timeout', function($scope, UserService, $timeout) {
    
    $scope.Resendlink = function(){
        var formData = {};
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        
        if ($scope.email === '' || $scope.email === undefined) {
            $scope.emailmessage = $scope.i18n.store.enter_storeemail;
            $scope.hasemailerror = true;
            $timeout(function(){
                $scope.emailmessage = '';
            }, 10000);
            return false;
        }
        
        $scope.isLoading = true;
        $scope.message   = '';
        $scope.emailmessage = '';
        $scope.hasemailerror = false;
        formData.email   = $scope.email;
        
        UserService.resendverificationmail(formData, function(data){
            $scope.isLoading = false;
            $scope.hasemailerror = false;
            if (data.code == 101) {
                $scope.msgcls    = 'text-success text-center';
                $scope.message   = $scope.i18n.validation.email_sent;
            } else if (data.code == 1021) {
                $scope.message   = $scope.i18n.validation.user_not_exists;
                $scope.msgcls    = 'text-red text-center';
            } else if (data.code == 1035) {
                $scope.message   = $scope.i18n.validation.error_occured;
                $scope.msgcls    = 'text-red text-center';
            } else if (data.code == 1046) {
                $scope.message   = $scope.i18n.verify_user.success;
                $scope.msgcls    = 'text-success text-center';
            } else if (data.code == 1047) {
                $scope.message   = $scope.i18n.verify_user.error4;
                $scope.msgcls    = 'text-red text-center';
            }else{
                $scope.message   = $scope.i18n.verify_user.error1;
                $scope.msgcls    = 'text-red text-center';
            }
        });

        $timeout(function(){
            $scope.message = '';
            $scope.msgcls  = '';
            $scope.email   = '';
        }, 10000);
    };
}]);
