app.controller('MediaController',['$scope', 'MediaService', function ($scope, MediaService) {
    
    //Upload Media 
    $scope.uploadmedia = function() { 
        var opts = {};
        opts.user_id = "";
        opts.album_id = "";
        opts.form_file = "";
        MediaService.uploadmedia(opts, function(data) {
            if(data.code == 101) {
             
            } else {
              
            }
      });
       
    }
    //listing Media 
    $scope.listmedia = function() { 
        $scope.signupStart = true;  
        var opts = {};
        opts.user_id = "";
        opts.limit_start = "";
        MediaService.listmedia(opts, function(data) {
            if(data.code == 101) {
              
            } else {
             
            }
      });
       
    }
    //Delete Media 
    $scope.deletemedia = function() { 
        $scope.signupStart = true;  
        var opts = {};
        opts.user_id = "";
        opts.album_id = "";  
        MediaService.deletemedia(opts, function(data) {
            if(data.code == 101) {
            
            } else {
              
            }
      });
       
    }
    //Search Media 
    $scope.searchmedia = function() { 
      $scope.signupStart = true;  
        var opts = {};
        opts.search_text = "";
        opts.user_id = "";
        opts.access_token = "";     
        opts.limit_size = "";  
        opts.limit_start = "";  
        MediaService.searchmedia(opts, function(data) {
            if(data.code == 101) {
             
            } else {
              
            }
      });
       
    }
   
}]);


