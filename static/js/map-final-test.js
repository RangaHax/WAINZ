//***********************************************************************//
//                           Global Variables                            //
//***********************************************************************//

var map;
var points = [];
var styles; // map style options (roads, labels etc)
var townLabels = false; // display labels
var regions = [];
var riverLayer;
var lakeLayer;
var streamLayer;
var regionFillCol = '#FFFFFF';
var regionStrokeCol = '#2B547E';
var regionFillColShow = '#2B547E';
var regionStrokeColShow = '#2B547E';
var regionFillOpacity = 0.05;
var regionFillOpacityShow = 0.00;
var regionFillOpacityMouse = 0.32;
var regionStrokeWeight = 1;
var regionStrokeWeightShow = 3.1;
google.maps.visualRefresh = true;
   

//***********************************************************************//
//                              Functions                                //
//***********************************************************************//
function loadLayers() {
    //NZ Rivers (wide sections) and NZ Lakes provided by Land Information New Zealand via Koordinates.com
    riverLayer = new google.maps.FusionTablesLayer({
        map : map,
        heatmap : {
            enabled : false
        },
        query : {
            select : "col4",
            from : "1Cb9of1mmMn9YLrIFUlQe0wnOMZg-0zqQTRRJHT0",
            where : ""
        },
        options : {
            styleId : 2,
            templateId : 2
        }
    });

    lakeLayer = new google.maps.FusionTablesLayer({
        map : map,
        heatmap : {
            enabled : false
        },
        query : {
            select : "col10",
            from : "1_sDMfg9NEPd9WiwUe4OIxCSfO_A7Nr1p-TjTpUM",
            where : ""
        },
        options : {
            styleId : 2,
            templateId : 2

        }
    });
    streamLayer = new google.maps.FusionTablesLayer({
      map: map,
      heatmap: { enabled: false },
      query: {
        select: "col5",
        from: "10mZlNfAvUa0dS17NlwOoO-j8a-wMiUQaasduYgM",
        where: ""
      },
      options: {
        styleId: 2,
        templateId: 2
      }
    });
     
    // setTimeout(function(){ 
    //     $("img[src*='googleapis']").each(function(){ 
    //             $(this).attr("src",$(this).attr("src")+"&"+(new Date()).getTime()); 
    //     }); 
    // },3000); 
    riverLayer.setMap(null);
    streamLayer.setMap(null);
    lakeLayer.setMap(null);
}

//-----------------Display river overlay
function displayRivers() {
    if (riverLayer.getMap() == null && lakeLayer.getMap() == null) {
        riverLayer.setMap(map);
        lakeLayer.setMap(map);
        // streamLayer.setMap(map);
    } else {
        riverLayer.setMap(null);
        lakeLayer.setMap(null);
        streamLayer.setMap(null);
    }
}


function createInfoWindow(fileName, title, description, date, tags, user, id) {

    var contentString =    
    '<div class="panel panel-info" style=" display:block;max-width:258px; width:100%; margin-left: auto; margin-right: auto; word-wrap: break-word;">'+
    '<div class="panel-heading">'+
    '<h2> '+ title + '</h2>' +
    '</div>'+
    '<a href="'+'/image/'+id+''+ '"><img style="width:100%; margin-left: auto; margin-right: auto;" class="img-thumbnail" src="' +fileName +'" /></img></a>' +    
    '<div class ="panel-footer" >'+
    '<p ><b>Description:</b> '+ description +'</p>' +
    '<p><b>Uploaded:</b> '+ date +'</p>' +
    '<p><b>Tags:</b> ' + tags +'</p>' +
    '<p><b>Submitted by:</b> ' + user +'</p>' +
    '</div>'+
    '<div class="btn-group btn-group-justified">'+
    '<a type="button" class="btn btn-info" onclick="location.href='+"'"+'/image/'+id+''+"'"+'" >Details</a>'+
    // '<a type="button" class="btn btn-danger" onclick="location.href='+"'"+'/image/'+id+''+"'"+'" >Delete</a>'+
    '<a type="button" class="btn btn-default" href="#" onclick="closeAllInfoWindows()"">Close</a'+
    '</div>'+
    '</div>'+
    '</div>';
    // '<button type="button" class="btn btn-danger" onclick="location.href='+"'"+'/image/'+id+''+"'"+'" >Delete</button>';

    info = new google.maps.InfoWindow({
        content: contentString
        
    });

return info;

}

//-----------------Create a marker
function createMarkers(location, iconName, info) {
    var bool = false;
    if(iconName == null){
        iconName = '../static/img/brown-drop.png';
        
    }

    for ( var i = 0; i < regions.length; i++) {
        if(bool == true)
            break;
        if(google.maps.geometry.poly.containsLocation(location,
            regions[i].polygon)) {
            var temp = new google.maps.Marker({
                position : location,
                map : this.map,
                icon : iconName,
            });

        temp.info = info;
        temp.setVisible(false);
        temp.setMap(map);
        regions[i].markers.push(temp);
        bool = true;
    }
}
}

//-----------------Show/hide markers in a region
function toggleRegionMarkers(region) {

    for ( var i = 0; i < region.markers.length; i++) {

        if (region.markers[i].getVisible() == true) {
            var temp = region.markers[i];
            temp.setVisible(false);
            temp.info.close();
            region.text.setMap(map);
            region.markers[i] = temp;
        } else { 
            region.text.setMap(null);
            temp = region.markers[i];
            temp.setVisible(true);
            region.markers[i] = temp;
        }
    }
}
function closeAllInfoWindows(){
    for ( var i = 0; i < regions.length; i++) {
            for ( var j = 0; j < regions[i].markers.length; j++) {
                // if (regions[i].markers[j] != marker)
                regions[i].markers[j].info.close(); // close all other info windows
        }
    }
}
//------------------Adds an event listener to a marker to open/close its infowindow
function addMarkerListener(marker) {
    google.maps.event.addListener(marker, 'click', function() {

        closeAllInfoWindows()
    if (marker.info.getMap() == null)
        marker.info.open(map, marker);
    else
        marker.info.close();
});
}

//-----------------Region object
function region(name, polygon) {

    this.polygon = polygon;
    this.name = name;
    this.markers = [];
    this.selected = false;
    this.center = null;
    this.text = null;
}

//-----------------Construct a polygon for a region
function constructPolygon(coordinates, name) {
    //NZ Regional Councils (2008 Yearly Pattern) provided by Statistics New Zealand
    var r = new region(name, new google.maps.Polygon({
        paths : coordinates,
        strokeColor : regionStrokeCol,
        strokeOpacity : 0.8,
        strokeWeight : regionStrokeWeight,
        fillColor : regionFillCol,
        fillOpacity : regionFillOpacity
    }));
    var centerCoords = new google.maps.LatLngBounds();
    for (i = 0; i < coordinates.length; i++) {
        centerCoords.extend(coordinates[i]);
    }
    r.polygon.setMap(map);

    r.center = centerCoords.getCenter();
    regions.push(r);
}

//-----------------Add event handlers to a region
function AddEventHandlers(region) {
    google.maps.event.addListener(region.polygon, 'click', function() {
        regionSelector(region.polygon);
        toggleRegionMarkers(region);
    });

    google.maps.event.addListener(region.polygon, 'mouseover', function() {
        if (region.polygon.get('fillOpacity') == regionFillOpacity)
            region.polygon.setOptions({
                fillOpacity : regionFillOpacityMouse
            });
    });

    google.maps.event.addListener(region.polygon, 'mouseout', function() {
        if (region.polygon.get('fillOpacity') == regionFillOpacityMouse)
            region.polygon.setOptions({
                fillOpacity : regionFillOpacity
            });
    });
}

//-----------------Determine the selected region
function regionDropdown(selectedRegion) {
      DeselectRegions();

        if (selectedRegion == "All") {
            for ( var i = 0; i < regions.length; i++) {
                regions[i].text.setMap(null);
                regions[i].polygon.setOptions({
                    fillColor : regionFillColShow,
                    fillOpacity : regionFillOpacityShow,
                    strokeColor : regionStrokeColShow,
                    strokeWeight : regionStrokeWeightShow
                });
                for ( var j = 0; j < regions[i].markers.length; j++) {
                    regions[i].markers[j].setVisible(true);
                }
            }
        } else {
            for ( var i = 0; i < regions.length; i++) {
                if (selectedRegion == regions[i].name) {
                    regions[i].text.setMap(null);
                    regions[i].polygon.setOptions({
                        fillColor : regionFillColShow,
                        fillOpacity : regionFillOpacityShow,
                        strokeColor : regionStrokeColShow,
                        strokeWeight : regionStrokeWeightShow
                    });
                    toggleRegionMarkers(regions[i]);
                    break;
                }
            }
        }
    }


function regionSelector(regionPoly) {
    
    if (regionPoly == null) { // multibox control
        DeselectRegions();

        if (regionName == "All") {
            for ( var i = 0; i < regions.length; i++) {
                regions[i].text.setMap(null);
                regions[i].polygon.setOptions({
                    fillColor : regionFillColShow,
                    fillOpacity : regionFillOpacityShow,
                    strokeColor : regionStrokeColShow,
                    strokeWeight : regionStrokeWeightShow
                });
                for ( var j = 0; j < regions[i].markers.length; j++) {
                    regions[i].markers[j].setVisible(true);
                }
            }
        } else {
            for ( var i = 0; i < regions.length; i++) {
                if (regionName == regions[i].name) {
                    regions[i].text.setMap(null);
                    regions[i].polygon.setOptions({
                        fillColor : regionFillColShow,
                        fillOpacity : regionFillOpacityShow,
                        strokeColor : regionStrokeColShow,
                        strokeWeight : regionStrokeWeightShow
                    });
                    toggleRegionMarkers(regions[i]);
                    break;
                }
            }
        }
    } else { // user click control
        if (regionPoly.get('fillOpacity') == regionFillOpacityShow){
            regionPoly.setOptions({
                fillOpacity : regionFillOpacity,
                fillColor : regionFillCol,
                strokeColor : regionStrokeCol,
                strokeWeight : regionStrokeWeight
            });


            
        }
        else{

            regionPoly.setOptions({
                fillColor : regionFillColShow,
                fillOpacity : regionFillOpacityShow,
                strokeColor : regionStrokeColShow,
                strokeWeight : regionStrokeWeightShow
            });
        }
    }
}

//-----------------Deselect all regions
function DeselectRegions() {
    for ( var i = 0; i < regions.length; i++) {
        regions[i].text.setMap(map);
        regions[i].polygon.setOptions({
            fillColor : regionFillCol,
            fillOpacity : regionFillOpacity,
            strokeColor : regionStrokeCol,
            strokeWeight : regionStrokeWeight
        });
        regions[i].text.setMap(map);
        for ( var j = 0; j < regions[i].markers.length; j++) {
            regions[i].markers[j].setVisible(false);
            regions[i].markers[j].info.close();
        }
    }
}




    

//***********************************************************************//
//                            Create the Map                             //
//***********************************************************************//
function initialize() {

    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
        center : new google.maps.LatLng(-41, 172),
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
    map = new google.maps.Map(mapCanvas, mapOptions);

    //-----------------Limit the zoom level
    google.maps.event.addListener(map, 'zoom_changed', function() {
        if (map.getZoom() < 5){
            map.setZoom(5);
        }
        if(map.getZoom()>10){
        	streamLayer.setMap(map);
        }
        else{
        	streamLayer.setMap(null);
        }
    });

    //-----------------Set the map style
    styles = [ {
        featureType : "road", // turn off roads
        stylers : [ {
            visibility : "off"
        } ]
    }, {
        featureType : "poi", // hide 'points of interest'
        stylers : [ {
            visibility : "off"
        } ]
    }, {
        featureType : "transit",
        stylers : [ {
            visibility : "off"
        } ]
    }, {
        featureType : "all", // hide all labels
        elementType : "labels",
        stylers : [ {
            visibility : "off"
        } ]
    }, {
        featureType : "water", // water colour + labels
        elementType : "geometry.fill",
        stylers : [ {
            color : "#99b3cc"
        } //2B547E 3090C7
        ]
    }, {
        featureType : "water",
        elementType : "labels.text.stroke",
        stylers : [ {
            visibility : "on"
        }, {
            color : "#FF0000"
        }, ]
    }, {
        featureType : "water",
        elementType : "labels.text.fill",
        stylers : [ {
            visibility : "on"
        }, {
            color : "#FFFFFF"
        }, {
            weight : 25
        } ]
    }, {
        featureType : "landscape", // country colour
        elementType : "geometry.fill",
        stylers : [ {
            color : "#c7d9a7"
        }, //#D1D0CE
        ]
    }, {
        featureType : "administrative.province", // region borders
        elementType : "all",
        stylers : [ {
            visibility : "off"
        }, ]
    } ];
    map.setOptions({
        styles : styles
    });

    google.maps.event.addListener(map, 'maptypeid_changed',
        function() {
            if (map.getMapTypeId() == 'satellite'
             || map.getMapTypeId() == 'hybrid') {
             regionStrokeCol = '#FFFFFF';
         regionStrokeColShow = '#FFFFFF';
     } else if (map.getMapTypeId() == 'terrain') {
        regionStrokeCol = '#2B547E';
        regionStrokeColShow = '#2B547E';
    } else if (map.getMapTypeId() == 'roadmap') {
        regionStrokeCol = '#2B547E';
        regionStrokeColShow = '#2B547E';
    }
    DeselectRegions();
});

    //-----------------Construct regional overlays
    constructPolygon(loadNorthland(), "Northland");
    constructPolygon(loadAuckland(), "Auckland");
    constructPolygon(loadWaikato(), "Waikato");
    constructPolygon(loadWestcoast(), "West Coast");
    constructPolygon(loadBayofplenty(), "Bay of Plenty");
    constructPolygon(loadCanterbury(), "Canterbury");
    constructPolygon(loadGisborne(), "Gisborne");
    constructPolygon(loadOtago(), "Otago");
    constructPolygon(loadSouthland(), "Southland");
    constructPolygon(loadHawkesbay(), "Hawke's Bay");
    constructPolygon(loadTasman(), "Tasman");
    constructPolygon(loadTaranaki(), "Taranaki");
    constructPolygon(loadManawatu(), "Manawatu-Wanganui");
    constructPolygon(loadNelson(), "Nelson");
    constructPolygon(loadWellington(), "Wellington");   
    constructPolygon(loadMarlborough(), "Marlborough");


    for ( var i = 0; i < regions.length; i++)
        AddEventHandlers(regions[i]);


    // Import data from API stored as JSON using jQuery (AJAX) 
    // TO BE COMPLETED
    // var done = false;
    // $.getJSON('/api/export', function(data) {
    	
    //     $.each( data, function( key, val ) {
    //     	if(key != "status"){
    //         points.push(val);
    //         // console.log(key+" "+ val.extension +" "+ val.image_name +" "+ val.path +" "+ val.lat +" "+ val.lng +" "+ val.id); // Something like this
    //         // console.log(points.length)
    //     }
            
    //     });
        finish();
       
    // });

    function finish(){

    for ( var i = 0; i < points.length; i++){
    	       // console.log(points[i].image_name +"\t"+ points[i].path +"\t"+ points[i].extension +"\t"+  points[i].lat +"\t"+ points[i].lng +"\t"+points[i].date +"\t"+ points[i].id+"\t"+ points[i].tags+"\t"+ points[i].user);
        createMarkers(
            new google.maps.LatLng(points[i].lat, points[i].lng),
            null,
            createInfoWindow("" + points[i].path + "-thumb."
                + points[i].extension + "", points[i].image_name,
                points[i].description, points[i].date, points[i].tags, points[i].user ,points[i].id));
    }

    //Set labels
    for(var i=0; i < regions.length; i++){
     if(regions[i].name == "Wellington"){
         var mapLabel = {
         text: regions[i].markers.length,
         position: regions[i].center,
         map: map,
         fontSize: 20,
         fontColor: 'white',
         strokeColor: regionStrokeCol,
         fillOpacity: 1,
         strokeOpacity: 1,
         };
     }
     else {

         var mapLabel = {
             text: regions[i].markers.length,
             position: regions[i].center,
             map: map,
             fontColor: 'white',
             strokeColor: regionStrokeCol,
             fontSize: 20,
         };
     }

     var label = new MapLabel(mapLabel)
     regions[i].text = label;
    }




    //-----------------Add event handlers       
    for ( var i = 0; i < regions.length; i++) {
        for ( var j = 0; j < regions[i].markers.length; j++) {
            addMarkerListener(regions[i].markers[j]);
        }
    }
    //-----------------Load the river + lake overlay

    // var imgLocation =new google.maps.LatLng(-41, 172);
    // var marker = new google.maps.Marker({map:map, position: imgLocation});
    // marker.setMap(map);
    loadLayers();
}
    

}
google.maps.event.addDomListener(window, 'load', initialize);