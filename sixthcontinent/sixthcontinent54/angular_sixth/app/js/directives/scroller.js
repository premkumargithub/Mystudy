app.directive('scroller', function () {
    return {
        restrict: 'A',
        scope: {
            loadingMethod: "&"
        },
        link: function (scope, elem, attrs) {
            rawElement = elem[0];
            elem.bind('scroll', function () {
                if((rawElement.scrollTop + rawElement.offsetHeight+5) >= rawElement.scrollHeight){
                    scope.$apply(scope.loadingMethod); 
                }
            });
        }
    };
});
app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(value) {
        ele.html(value);
        $compile(ele.contents())(scope);
      });
    }
  };
});