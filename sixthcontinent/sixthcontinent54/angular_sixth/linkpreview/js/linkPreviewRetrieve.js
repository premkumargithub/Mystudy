/**
 * Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 */
(function($) {
    $.fn.linkPreviewRetrieve = function(options) {
        var selector = $(this);
	
        $.get('php_view/retrieve.php', {}, function(answer) {
            for(var i =0; i < answer.length; i++){
                var item = answer[i];

                if(item.iframe != ""){
                    iframeId = item.iframe.split("id=\"");
                    iframeId = iframeId[1].split("\"");
                    iframeId = iframeId[0];

                    

                    $(".imgIframe").click(function() {
                        var oldId = $(this).attr("id");
                        var currentId = oldId.substring(4);
                        pTP = "pTP_" + currentId;
                        pDP = "pDP_" + currentId;
                        oldId = "#" + oldId;
                        currentId = "#" + currentId;
                        $(oldId).css({
                            'display' : 'none'
                        });
                        $(currentId).css({
                            'display' : 'block'
                        });
                        $('#' + pTP).css({
                            'width' : '495px'
                        });
                        $('#' + pDP).css({
                            'width' : '495px'
                        });
                    });

                }
                
                    
         }
        }, 'json');

    };
})(jQuery);
