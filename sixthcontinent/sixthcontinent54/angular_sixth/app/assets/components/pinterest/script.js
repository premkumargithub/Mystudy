$(function () {
	
	
	
	
	$('#foto-progetto').change(function(){
		$('#foto-progetto').parents("li").find("label").addClass("full");
	});
	
	
	
	
	
	filler();
	
	$(".button-modifica").click(function(){
		$(this).hide();
		$(this).parent("form").removeClass("disable");
		$(this).parent("form").addClass("active");
		$(this).parent("form").find(".mask").hide();
		$(this).parent("form").find("button").show();
		
		var a = $(this).parent("form").find(".cambia-password");
		
		if(a.length > 0) {
			$(".password").hide();
			$(a).show();
		}
	});
	
	$(".salva-form").click(function(){
		$(this).hide();
		$(this).parent("form").removeClass("active");
		$(this).parent("form").addClass("disable");
		$(this).parent("form").find(".mask").show();
		$(this).parent("form").find(".button-modifica").show();
		
		var a = $(this).parent("form").find(".cambia-password");
		
		if(a.length > 0) {
			$(".password").show();
			$(a).hide();
		}
	});
	
	$("[data-action='closeOverlay']").click(function(){
		$(".overlay").fadeOut();
		if ($(".contents.youtube").length != 0){
			$(".contents.youtube iframe").remove();
		}
	});
	
	jQuery(window).resize(function(){
		filler();
	});
	

	$("nav.main ul").click(function(){
			$(this).toggleClass("open");
			
	});
	
	$("div.table-cont table td:first-child").wrapInner( "<div class='wrap-td'></div>" );	
	$("div.table-cont table td:last-child").wrapInner( "<div class='wrap-td'></div>" );
	
	
	$('[data-action="showAnswer"]').click(function(){
		
		if($(this).hasClass("open")){
			$(this).toggleClass("open");
			$(this).find(".answer").fadeOut();
		} else {
			
			$(".answer").fadeOut();
			$(".answer-list li").removeClass("open");
			
			$(this).toggleClass("open");
			$(this).find(".answer").fadeIn();
		}
	});


	$('[data-behavior="wall"]').freetile({
		animate: true,
   		elementDelay: 0,
   		selector:'[data-role=tile]'
	});
	
});
	
	
var filler=function(){
 var cW=jQuery("[data-behavior='fill']").outerWidth();
 var iW=jQuery("[data-behavior='fill'] div").outerWidth();
 var itemsPerRow=parseInt(cW/iW);
 
 var numItems=jQuery("[data-behavior='fill'] div").not('.filler').length;

 var remainder=numItems%itemsPerRow;
 var toAdd=itemsPerRow-remainder;

jQuery("[data-behavior='fill'] div.filler").remove();
 
 for(i=0; i<toAdd; i++){
   jQuery("[data-behavior='fill']").append(" <div class='filler'>");
 }
}