app.filter('newlines', function() {
	var text = '';
	return function(text, length, postType, seeText, postId) {
		var splitTxt = [];
		var tempStr = '';
		var tempPrev = '';
    	var tempText = text;
		if(text !== '' && text != undefined ) {
			if(postType ==1){
	    		var arr = text.split('<div id=\"previewImages_lp1\" ');
	    		var regex = /src="([^"]+)"/;
	    		var tempVal = arr[0];
	            var src = tempVal.split(regex)[1];
	            tempVal = tempVal.replace(/(<iframe[^>]+>)|(<\/iframe>)/gi,src); 
	    		var tempText = tempVal;

	    		if(arr[1] != undefined){
	    			var imgArr = text.indexOf('<div id=\"previewImages_lp1\" ');
		    		var tempPrev = '<p></p><div id=\"previewImages_lp1\" '+arr[1];
	    		}
	    	}
	    	
            tempRmLink = tempText.replace(/(<a[^>]+>)|(<\/a>)/gi,""); 
			var str = $.trim(tempRmLink.replace(/\n\n\n+/g, '\n\n'));
			splitTxt = str.split(/\n/g);
			tempStr = splitTxt.shift() + '\n';
			if(tempStr !== '' && splitTxt.length > 4 ){
				for (i = 0; i < 4; i++) {
        			tempStr += '<br />' + splitTxt.shift();
        		} 
			} else {
				tempStr = str.replace(/\n/g,'<br />');
			}
			if (isNaN(length))
            length = 10;

			
        	end = "<a class='morelink' href='javascript:void(0);' postid='"+postId+"' postType='"+postType+"'>"+seeText+"</a>";	
        	
        	if ((tempStr.length <= length || tempStr.length - end.length <= length) && splitTxt.length < 3) {
        		//URLs starting with http://, https://, file:// or ftp://
				replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
				tempStr = tempStr.replace(replacePattern1, '<a class="sitelink" href=\"$1\" target=\"_blank\">$1</a>');

				//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
				replacePattern2 = /(^|[^\/f])(www\.[\S]+(\b|$))/gim;
				tempStr = tempStr.replace(replacePattern2, '$1 <a class="sitelink" href=\"http://$2\" target=\"_blank\">$2</a>');
				return HTMLtoXML(tempStr + tempPrev) ;
	        }
	        else {
	        	//URLs starting with http://, https://, file:// or ftp://
				replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
				tempStr = tempStr.replace(replacePattern1, '<a class="sitelink" href=\"$1\" target=\"_blank\">$1</a>');

	            // //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
				replacePattern2 = /(^|[^\/f])(www\.[\S]+(\b|$))/gim;
				tempStr = tempStr.replace(replacePattern2, '$1 <a class="sitelink" href=\"http://$2\" target=\"_blank\">$2</a>');
	        	return HTMLtoXML(String(tempStr).substring(0, length-end.length) + end + tempPrev);
	        }	
		} else {
			return tempStr;
		}
	};
});

app.filter('dateFormat', function($filter)
{
	return function(datetext)
	{
		if(datetext == null){ return ""; } 
		var _date = $filter('date')(new Date(datetext.replace(/-/g, '/')), 'dd-MM-yyyy');
		return _date.toUpperCase();
	};
});

app.filter('panFormat', function()
{
	return function(panNumber)
	{
		if(panNumber == null){ return ""; } 
		return panNumber.substr(-4, 4);
	};
});

app.filter('expirationPanFormat', function()
{
	return function(expirDate)
	{
		if(expirDate == null){ return ""; } 
		var month = expirDate.substr(-2, 2);
		var year = expirDate.substring(0, expirDate.length - 2);
		var formatPan = month + '/' + year;
		return formatPan;
	};
});
// filter is for comment anchor link
app.filter('activateLink', function () {
    return function (text) {
    	var tempText = text;
		tempText = tempText.replace(/ /g, '\u00a0');
		//URLs starting with http://, https://, file:// or ftp://
		replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		tempText = tempText.replace(replacePattern1, '<a class="sitelink" href=\"$1\" target=\"_blank\">$1</a>');

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		replacePattern2 = /(^|[^\/f])(www\.[\S]+(\b|$))/gim;
		tempText = tempText.replace(replacePattern2, '$1 <a class="sitelink" href=\"http://$2\" target=\"_blank\">$2</a>');
		return tempText ;
	};	
});


/* filter to format date of post*/
app.filter('postDateFormat', function($filter)
{
	return function(input)
	{
		if(input == null){ return ""; } 
		var date1 = input.trim().split(" ");
		var finaldate = date1[0] + "T" + date1[1];
		var _pdate = $filter('date')(finaldate,'dd MMM | HH:mm');
		return _pdate;
	};
});

app.filter('monthYearDateFormat', function(){
	return function(dateText){
		var monthName = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    	return monthName[parseInt(dateText.substring(5,7))-1] + "-" + dateText.substring(0,4);
	}
});

app.filter('reverse', function() {
	return function(items) {
		return items.slice().reverse();
	};
});
app.filter('formatNum', function() {
	return function(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	};
});
app.filter('truncateNum', function() {
	return function(trunnumber) {
		if( !trunnumber || trunnumber  === undefined ) return 0;
		var num = trunnumber.toString();
	        if(num.indexOf(".") > 0){ 
	            num = num.slice(0, (num.indexOf("."))+3);
	        }
        return  num;
	};
});
app.filter('hobbyList', function() {
  return function(text) {
  if(text != undefined && text != '') {
  return text.split(",");  
  } else {
   return text;
  }
   };
});

/* filter to format date of distory detail page*/
app.filter('historyDetailDate', function($filter)
{
	return function(input)
	{
		if(input == null){ return ""; } 
		
		var _pdate = $filter('date')(new Date(input),'dd/mm/yy:HH:mm');
		return _pdate;
	};
});

/* filter to format date of history list page and txn in progress*/
app.filter('historyListDate', function($filter)
{
	return function(input)
	{
		if(input == null){ return ""; } 
		
		var _pdate = $filter('date')(new Date(input),'dd-MM-yyyy');
		return _pdate;
	};
});

app.filter('dateFormat', function($filter){
	return function(input)
	{
		if(input == null){ return ""; } 
		var _pdate = input.substring(8,10)  + input.substring(4,7) + '-' + input.substring(0,4) ;
		return _pdate;
	};
});

app.filter('discountFilter', function($filter){
	return function(input)
	{
		if(input == null){
			return "0%"; 
		} else{
			return input + "%";
		}
	};
});

/* filter to format date of history list page and txn in progress*/
app.filter('txnPrgsDate', function($filter)
{
	return function(input)
	{
		if(input == null){ return ""; } 
		
		var _pdate = $filter('date')(new Date(input),'hh:mm a dd MMM yyyy');
		return _pdate;
	};
});

/* filter to format date of paypal account listing in shop wallet*/
app.filter('paypalDate', function($filter)
{
	return function(input)
	{
		if(input == null){ return ""; } 
		
		var _pdate = $filter('date')(new Date(input),'dd-MM-yyyy');
		return _pdate;
	};
});

app.filter('paginationFilter', function() {
  return function(input, start) {
    start = start || 0;
    input = input || '';
    start = parseInt(start, 10);
    if (start !== undefined && input !== undefined) {
        return input.slice(start);
    } else {
        return '';
    }
  };
});

app.filter('spliceChar', function() {
  return function(input, limit) {
  	var limit = 4;
    if (limit !== undefined && input !== undefined) {
        return input.substr(input.length - limit);
    } else {
        return '';
    }
  };
});

app.filter('setDecimal', function ($filter) {
    return function (input) {
        if (isNaN(input)) return input;
        else
        return input.toFixed(3);
    };
});
