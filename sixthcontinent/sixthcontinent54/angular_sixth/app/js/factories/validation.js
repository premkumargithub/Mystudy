app.factory('focus', function($timeout) {
    return function(id) {
      $timeout(function() {
        var element = document.getElementById(id);
        if(element){
          element.focus();
        }
      },400);
    };
});

//It requires dd-mm-yyyy and converts to mongoDb date with GMT format standard
// app.factory('DateToMongoDate', function() {
// 	return {
//     dateToIso: function(sourceDate) {
//     	if(!sourceDate) return '';
//     	var now = new Date();
//     	var currentData = sourceDate.split("-");
// 		var dateObj = new Date(currentData[2],currentData[1]-1,currentData[0]);
// 		return (dateObj.toISOString()); 
// 	    }
// 	};
// });

//It requires dd-mm-yyyy and converts to mongoDb date with GMT format standard
app.factory('DateToMongoDate', function() {
  return {
    dateToIso: function(sourceDate) {
      if(!sourceDate) return '';
      console.log(sourceDate);
      var now = new Date();
      var gmtOffset = -120;
      var hh = now.getUTCHours() - parseInt(gmtOffset/60);
      var mm = now.getUTCMinutes() - parseInt(gmtOffset%60);
      var ss = now.getUTCSeconds();
      var currentData = sourceDate.split("-");
        if(hh <10){hh ='0'+hh;}
        if(mm <10){mm ='0'+mm;}
        if(ss < 10){ss = '0'+ss;}
          return (currentData[2].toString() + "-" + currentData[1].toString() + "-" + currentData[0] + "T" + hh.toString() + ":" + mm.toString() + ":" + ss.toString() + ".000Z");     
    }
  };
});


//Refresh the page on same link hit 
app.factory('LandURL', ['$location', '$route', function($location, $route) {
  return {
    sendTo: function(targetUrl) {
      if($location.path() !== targetUrl){
        $location.path(targetUrl);
      } else {
        $route.reload();
      }
    }
  };
}]);