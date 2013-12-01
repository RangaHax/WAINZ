$(document).ready(function(){
	var middle = new google.maps.LatLng(-41, 172)
    var mapOptions = {
        center : middle,
        zoom : 5,
        mapTypeId : google.maps.MapTypeId.TERRAIN, //ROADMAP SATELLITE
        panControl : false,
        streetViewControl : false,
        scaleControl : true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        disableDoubleClickZoom : true,
        zoomControlOptions : {
            style : google.maps.ZoomControlStyle.DEFAULT,
            position : google.maps.ControlPosition.RIGHT_CENTER
        }
    };
    map = new google.maps.Map(document.getElementById("maps"), mapOptions)
	 for(var i = 0; i < jsImages.length; i++) {
	 	var markerOpts = {map:map, position: jsImages[i]}
	   console.log(jsImages[i])	 	
	 	var marker = new google.maps.Marker(markerOpts);    
	 	
	 }	 
	 $("#maps").show({"effect":"explode"}, function(){google.maps.event.trigger(map, 'resize'); map.setCenter(middle)});    
});
