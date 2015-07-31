app.controller('ModalController', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {

        $scope.$on('closeModal', function () {
            $modalInstance.dismiss('cancel');
        });

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.averageRating = function(rating){
            if(rating != undefined){
                return new Array(Math.ceil(rating));    
            }
        };

        $scope.blankStar = function(rating){
            if(rating != undefined){
                if((5-Math.ceil(rating)) > 0){
                    return new Array(5-Math.ceil(rating));
                }else{
                    return 0;
                }
            }
        };

    }
]);