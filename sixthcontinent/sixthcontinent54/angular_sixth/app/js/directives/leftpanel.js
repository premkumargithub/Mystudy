app.directive('leftPanel', function() {
  return {
    restrict: 'E',
    controller : 'ProfileImageController',
    templateUrl: './app/views/left_panel.html'
  }
});

app.directive('rightPanel', function() {
  return {
    restrict: 'E',
     templateUrl: './app/views/right_panel.html'
  }
});