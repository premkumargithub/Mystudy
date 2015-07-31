//Displaying the post form for store detail
app.directive('userBrokerProfile',['ProfileImageService', function(ProfileImageService) {
  return {
      restrict: 'E',
      link: function (scope){
        scope.brokerProfileLoader = true; 
      	var brokerOpts = {};
        brokerOpts.user_id = APP.currentUser.id;
        brokerOpts.profile_type = APP.profileType.brokerProfile; 
        ProfileImageService.viewmultiprofiles(brokerOpts, function(data){
            if(data.code == 101) {
            	scope.brokerProfileLoader = false; 
              scope.brokerProfile = data.data;
            } else {                
              scope.brokerProfileLoader = false;
            }
        });
      },
      templateUrl: 'app/views/user_about_broker.html'
  }
}]);

//Displaying the post form for store detail
app.directive('userCitizenProfile',['ProfileImageService', function(ProfileImageService) {
  return {
      restrict: 'E',
      link: function (scope){
        },
      templateUrl: 'app/views/user_about_citizen.html'
  }
}]);
app.directive('userProfesstionalProfile',['ProfileImageService', function(ProfileImageService) {
  return {
      restrict: 'E',
      link: function (scope){
      },
      templateUrl: 'app/views/user_about_professtional.html'
  }
}]);
app.directive('friendViewProfile',['ProfileImageService', function(ProfileImageService) {
  return {
      restrict: 'E',
      link: function (scope){
      },
      templateUrl: 'app/views/friend_view_profile.html'
  }
}]);