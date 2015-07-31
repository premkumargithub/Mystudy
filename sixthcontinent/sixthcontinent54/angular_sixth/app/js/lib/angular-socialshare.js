// Code goes here
'use strict';

/*
 *  * angular-socialshare v0.0.2
 *   * ♡ CopyHeart 2014 by Dayanand Prabhu http://djds4rce.github.io
 *    * Copying is an act of love. Please copy.
 *     */

angular.module('djds4rce.angular-socialshare', [])
.factory('$FB',['$window',function($window){
  return {
    init: function(fbId){
      if(fbId){
        this.fbId = fbId;
        $window.fbAsyncInit = function() {
          FB.init({
            appId: fbId,
            channelUrl: 'app/channel.html',
            status: true,
            xfbml: true
          });
        };
        (function(d){
          var js,
          id = 'facebook-jssdk',
          ref = d.getElementsByTagName('script')[0];
          if (d.getElementById(id)) {
            return;
          }

          js = d.createElement('script');
          js.id = id;
          js.async = true;
          js.src = "//connect.facebook.net/en_US/all.js";

          ref.parentNode.insertBefore(js, ref);

        }(document));
      }
      else{
        throw("FB App Id Cannot be blank");
      }
    }
  };

}]).directive('facebook', ['$timeout','$http', function($timeout,$http) {
  return {
    scope: {
      shares: '='
    },
    transclude: true,
    template: '<a href="#"><span class="share-icon"></span></a>',
    link: function(scope, element, attr) {
      if(attr.shares){
        attr.$observe('url', function(){
          $http.get('http://api.facebook.com/restserver.php?method=links.getStats?urls='+attr.url+'&format=json').success(function(res){
            var count = res[0] ? res[0].share_count.toString() : 0;
            var decimal = '';
            if(count.length > 6){
              if(count.slice(-6,-5) != "0"){
                decimal = '.'+count.slice(-6,-5);
              }
              count = count.slice(0, -6);
              count = count + decimal + 'M';
            }else if(count.length > 3){
              if(count.slice(-3,-2) != "0"){
                decimal = '.'+count.slice(-3,-2);
              }
              count = count.slice(0, -3);
              count = count + decimal + 'k';
            }
            scope.shares = count;
          }).error(function(){
            scope.shares = 0;
          });
        });
      }
      $timeout(function(){
        element.bind('click',function(e){
          FB.ui(
            {method: 'feed',
              link: attr.dataurl,
              description: attr.datades,
              picture: attr.dataimg
          });
          e.preventDefault();
        });
      });
    }
  };
}]).directive('linkedin', ['$timeout','$http', '$window',function($timeout,$http,$window) {
  return {
    scope: {
      shares: '='
    },
    transclude: true,
    template: '<div class="linkedinButton">' +
      '<div class="pluginButton">' +
        '<div class="pluginButtonContainer">' +
          '<div class="pluginButtonImage">in' +
          '</div>' +
          '<span class="pluginButtonLabel"><span>Share</span></span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="linkedinCount">' +
      '<div class="pluginCountButton">' +
        '<div class="pluginCountButtonRight">' +
          '<div class="pluginCountButtonLeft">' +
            '<span ng-transclude></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>',
    link: function(scope, element, attr) {
      if(attr.shares){
        $http.jsonp('http://www.linkedin.com/countserv/count/share?url='+attr.link+'&callback=JSON_CALLBACK&format=jsonp').success(function(res){
          scope.shares = res.count.toLocaleString();
        }).error(function(){
          scope.shares = 0;
        });
      }
      $timeout(function(){
        element.bind('click',function(){
          var url = encodeURIComponent(attr.url).replace(/'/g,"%27").replace(/"/g,"%22")
          $window.open("//www.linkedin.com/shareArticle?mini=true&url="+url+"&title="+attr.title+"&summary="+attr.summary);
        });
      });
    }
  };
}]).directive('gplus',[function(){
  return {
    link: function(scope,element,attr){
      if(typeof gapi == "undefined"){
        (function() {
          var po = document.createElement('script'); po.type = 'text/javascript'; po.async = false;
          po.src = 'https://apis.google.com/js/plusone.js';
          po.lang = 'en-US';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
      }
    }
  };
}]).directive('tumblrText',[function(){
  return {
    link: function(scope,element,attr){
      var tumblr_button = document.createElement("a");
      tumblr_button.setAttribute("href", "http://www.tumblr.com/share/link?url=" + encodeURIComponent(attr.url) + "&name=" + encodeURIComponent(attr.name) + "&description=" + encodeURIComponent(attr.description));
      tumblr_button.setAttribute("title", attr.title||"Share on Tumblr");
      tumblr_button.setAttribute("style", attr.styling||"display:inline-block; text-indent:-9999px; overflow:hidden; width:81px; height:20px; background:url('http://platform.tumblr.com/v1/share_1.png') top left no-repeat transparent;");
      element.append(tumblr_button);
    }

  }
}]).directive('tumblrQoute',[function(){
  return {
    link: function(scope,element,attr){
      var tumblr_button = document.createElement("a");
      tumblr_button.setAttribute("href", "http://www.tumblr.com/share/quote?quote=" + encodeURIComponent(attr.qoute) + "&source=" + encodeURIComponent(attr.source));
      tumblr_button.setAttribute("title", attr.title||"Share on Tumblr");
      tumblr_button.setAttribute("style", attr.styling||"display:inline-block; text-indent:-9999px; overflow:hidden; width:81px; height:20px; background:url('http://platform.tumblr.com/v1/share_1.png') top left no-repeat transparent;");
      element.append(tumblr_button);
    }
  }
}]).directive('tumblrImage',[function(){
  return {
    link: function(scope,element,attr){
      var tumblr_button = document.createElement("a");
      tumblr_button.setAttribute("href", "http://www.tumblr.com/share/photo?source=" + encodeURIComponent(attr.source) + "&caption=" + encodeURIComponent(attr.caption) + "&clickthru=" + encodeURIComponent(attr.clickthru));
      tumblr_button.setAttribute("title", attr.title||"Share on Tumblr");
      tumblr_button.setAttribute("style", attr.styling||"display:inline-block; text-indent:-9999px; overflow:hidden; width:81px; height:20px; background:url('http://platform.tumblr.com/v1/share_1.png') top left no-repeat transparent;");
      element.append(tumblr_button);
    }
  }
}]).directive('tumblrVideo',[function(){
  return {
    link: function(scope,element,attr){
      var tumblr_button = document.createElement("a");
      tumblr_button.setAttribute("href", "http://www.tumblr.com/share/video?embed=" + encodeURIComponent(attr.embedcode) + "&caption=" + encodeURIComponent(attr.caption));
      tumblr_button.setAttribute("title", attr.title||"Share on Tumblr");
      tumblr_button.setAttribute("style", attr.styling||"display:inline-block; text-indent:-9999px; overflow:hidden; width:81px; height:20px; background:url('http://platform.tumblr.com/v1/share_1.png') top left no-repeat transparent;");
      element.append(tumblr_button);
    }
  }
}]).directive('gplusCustom',[function(){
  var template = '<span class="share-icon"></span>';
  return function( scope, elem, attrs ) {
    var selector = $( template );
    elem.append(selector);
    selector.bind('click', function( event ) {
      var url = attrs.datahref;
      window.open(
        'https://plus.google.com/share?url='+url,
        'popupwindow',
        'scrollbars=yes,width=1085,height=744'
      ).focus();
      return false;
    });
  }
}]).directive('twitterCustom',[function(){
  var template = '<span class="share-icon"></span>';
  return {
  link: function( scope, elem, attrs ) {
    var selector = $( template );
    elem.append(selector);
    selector.bind('click', function( event ) {
      var url = attrs.datahref;
      var text = attrs.datades;
      window.open(
        'http://twitter.com/share?url='+url+'&text='+text,
        'popupwindow',
        'scrollbars=yes,width=1085,height=744'
      ).focus();
      return false;
    });
  }
}
}]);