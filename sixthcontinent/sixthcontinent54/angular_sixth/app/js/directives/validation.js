app.directive('showErrors', function() {
  return {
    restrict: 'A',
    require: "ngModel",
    link: function (scope, el, attrs, formCtrl) {
      el.bind('focusout', function() {
        if(scope.$eval(attrs.ngModel) && scope.$eval(attrs.ngModel) != undefined) {
          el.removeClass('has-error');
        } else {
          el.addClass('has-error');
        }
      });
      el.bind('focusin', function() {
        if(scope.$eval(attrs.ngModel) && scope.$eval(attrs.ngModel) != undefined) {
          el.addClass('has-error');
        } else {
          el.removeClass('has-error');
        }
      });
    }
  }
});

/**
* Disable the copy, cut and paste on the html input box
*/
app.directive('stopccp', function(){
  return {
    scope: {},
    link:function(scope,element){
      element.on('cut copy paste', function (event) {
        event.preventDefault();
      });
    }
  };
});
