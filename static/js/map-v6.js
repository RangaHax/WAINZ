		//***********************************************************************
		//					         Global Variables
		//***********************************************************************
		
		var map;
		var styles; // map style options (roads, labels etc)
		var townLabels = false; // display labels
				
				
		var regions = [];
		var coords = [];
		
		/*var regionFillCol = '#FF0000';
		var regionStrokeCol = '#FF0000';
		var regionFillColShow = '#FFFFFF';
		var regionStrokeColShow = '#FFFFFF';
		var regionFillOpacity = 0.14;
		var regionFillOpacityShow = 0.08;
		var regionFillOpacityMouse = 0.3;*/
		
		/*var regionFillCol = '#FFFFFF';
		var regionStrokeCol = '#FFFFFF';
		var regionFillColShow = '#FF0000';
		var regionStrokeColShow = '#FF0000';
		var regionFillOpacity = 0.15;
		var regionFillOpacityShow = 0.05;
		var regionFillOpacityMouse = 0.35;*/
		
		var regionFillCol = '#FFFFFF';
		var regionStrokeCol = '#FFFFFF';
		var regionFillColShow = '#FFFFFF';
		var regionStrokeColShow = '#FFFFFF';
		var regionFillOpacity = 0.01;
		var regionFillOpacityShow = 0.00;
		var regionFillOpacityMouse = 0.35;
		/*var regionStrokeOpacity = 0.00;     -----need to implement
		var regionStrokeOpacityShow = 0.00;
		var regionStrokeOpacityMouse = 0.35;*/
		
		//***********************************************************************
		//					          Initialisation
		//***********************************************************************
		
		google.maps.visualRefresh = true;
		function initialize() {
		
			//-----------------Create the map
			var mapCanvas = document.getElementById('map_canvas')
			var mapOptions = {
				center: new google.maps.LatLng(-41, 172),
				zoom: 5,
				mapTypeId: google.maps.MapTypeId.SATELLITE, //ROADMAP
				panControl: false,
				//mapTypeControl: false,
				streetViewControl: false,
				scaleControl: true,
				disableDoubleClickZoom: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.DEFAULT,
					position: google.maps.ControlPosition.RIGHT_CENTER
				}
			};
			map = new google.maps.Map(mapCanvas, mapOptions);
			
			//-----------------Limit the zoom level
			google.maps.event.addListener(map, 'zoom_changed', function() {
				if (map.getZoom() < 5) map.setZoom(5);
			});
		
			//-----------------Load the river overlay
			riverLayer = new google.maps.FusionTablesLayer({
			 map: map,
			 heatmap: { enabled: false },
			 query: {
			   select: "col4",
			   from: "1Cb9of1mmMn9YLrIFUlQe0wnOMZg-0zqQTRRJHT0",
			   where: ""
			 },
			 options: {
			   styleId: 2,
			   templateId: 2
			 }
			 });
			 riverLayer.setMap(null);

			 lakeLayer = new google.maps.FusionTablesLayer({
			      map: map,
			      heatmap: { enabled: false },
			      query: {
			        select: "col10",
			        from: "1_sDMfg9NEPd9WiwUe4OIxCSfO_A7Nr1p-TjTpUM",
			        where: ""
			      },
			      options: {
			        styleId: 2,
			        templateId: 2
			      }
			    });
			  
  			lakeLayer.setMap(null);

			//-----------------Set the map style
			styles = [
			  {
				featureType: "road", // turn off roads
				stylers: [
				  { visibility: "off" }
				]
			  },{
				featureType: "poi", // hide 'points of interest'
				stylers: [
				  { visibility: "off" }
				]
			  },{
				featureType: "transit",
				stylers: [
				  { visibility: "off" }
				]
			  },{
				featureType: "all", // hide all labels
				elementType: "labels",
				stylers: [
				  { visibility: "off" }
				]
			  },{
				featureType: "water", // water colour + labels
				elementType: "geometry.fill",
				stylers: [
					{ color: "#2B547E" } //2B547E 3090C7
				]
			  },{
				featureType: "water",
				elementType: "labels.text.stroke",
				stylers: [
					{ visibility: "on" },
					{ color: "#FF0000" },  
				]
			  },{
				featureType: "water",
				elementType: "labels.text.fill",
				stylers: [
					{ visibility: "on" },
					{ color: "#FFFFFF" },  
					{ weight: 25 }
				]
			  },{
			  featureType: "landscape", // country colour
				elementType: "geometry.fill",
				stylers: [
					{ color: "#D1D0CE" },
				]	
			  },{
				featureType: "administrative.province", // region borders
				elementType: "all",
				stylers: [
					{ visibility: "off" },
				]
			  }
			];
			map.setOptions({styles: styles});

			//-----------------Construct regional overlays
			loadNorthland(); constructPolygon(coords,"Northland");
			loadAuckland(); constructPolygon(coords,"Auckland");
			loadWaikato(); constructPolygon(coords,"Waikato");
			loadWestcoast(); constructPolygon(coords,"West Coast");
			loadBayofplenty(); constructPolygon(coords,"Bay of Plenty");
			loadCanterbury(); constructPolygon(coords,"Canterbury");
			loadGisborne(); constructPolygon(coords,"Gisborne");
			loadOtago(); constructPolygon(coords,"Otago");		
			loadSouthland(); constructPolygon(coords,"Southland");		
			loadHawkesbay(); constructPolygon(coords,"Hawke's Bay");			
			loadTasman(); constructPolygon(coords,"Tasman");		
			loadTaranaki(); constructPolygon(coords,"Taranaki");			
			loadManawatu(); constructPolygon(coords,"Manawatu-Wanganui");			
			loadNelson(); constructPolygon(coords,"Nelson");			
			loadWellington(); constructPolygon(coords,"Wellington");
			loadMarlborough(); constructPolygon(coords,"Marlborough");
			coords=null;
			for(var i=0;i<regions.length;i++) AddEventHandlers(regions[i]);

	
			//-----------------Add markers
			var markerCoords = [
			new google.maps.LatLng(-39.9602803543,176.6546630859),
			new google.maps.LatLng(-39.9771200984,176.5118408203),
			new google.maps.LatLng(-41.2834905869,175.6608375907),
			new google.maps.LatLng(-41.0221930018,175.5607570540),
			new google.maps.LatLng(-41.2900997149,174.7681526604),
			new google.maps.LatLng(-36.9798380399,174.7628266609),
			new google.maps.LatLng(-38.3341631737,175.1677943993),
			new google.maps.LatLng(-38.8910997149,175.2628266609)
			];
			for (var i=0; i < markerCoords.length; i++) createMarkers(markerCoords[i]);
			createMarkers(new google.maps.LatLng(-39.1910997149,174.4681526604), './images/green-dot.png');
			createMarkers(new google.maps.LatLng(-41.1798380399,175.2628266609), './images/green-dot.png');
		
			//-----------------Add event handlers
			//for(var i=0;i<regions.length;i++) AddEventHandlers(regions[i]);	
			
			for(var i=0;i<regions.length;i++){
			    for(var j=0; j<regions[i].markers.length; j++){
				addMarkerListener(regions[i].markers[j]);
			    //console.log(regions[i].markers[j]);
			    }
			}
			
		}
		
		
		//***********************************************************************
		//					       Other Functions
		//***********************************************************************
		
		//-----------------Display river overlay
		function DisplayRivers(){
				if(riverLayer.getMap()==null && lakeLayer.getMap()==null){
					riverLayer.setMap(map);
					lakeLayer.setMap(map);
				}
				else{
					riverLayer.setMap(null);	
					lakeLayer.setMap(null);
				} 
		}
		
		
		//-----------------Create a marker
		function createMarkers(location, iconColour) {
			var bool = false;
			if (iconColour==null) iconColour = './images/red-dot.png';
			
			for (var i=0;i<regions.length;i++)
			{ 
				if (bool==true) break;
				if(google.maps.geometry.poly.containsLocation(location,regions[i].polygon)){
					temp = new google.maps.Marker({
						position: location,
						map: this.map,
						icon: iconColour,
					});		
					
					var contentString = '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading" class="firstHeading">Map Heading</h1>'+
					'<div id="bodyContent">'+
					'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
					'sandstone rock formation in the southern part of the '+
					'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
					'south west of the nearest large town, Alice Springs; 450&#160;km '+
					'(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
					'features of the Uluru - Kata Tjuta National Park. Uluru is '+
					'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
					'Aboriginal people of the area. It has many springs, waterholes, '+
					'rock caves and ancient paintings. Uluru is listed as a World '+
					'Heritage Site.</p>'+
					'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
					'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
					'(last visited June 22, 2009).</p>'+
					'</div>'+
					'</div>';
					
					temp.info = new google.maps.InfoWindow({
						content: contentString
					});

					temp.setVisible(false);
					temp.setMap(map);
					regions[i].markers.push(temp);

				 	// console.log("Marker in: ",regions[i].name);
					bool=true;
				}
			}
		}
		
		
		//-----------------Show/hide markers in a region
		function toggleRegionMarkers(region) {
			// console.log("toggling markers in: ",region.name);
			for(var i=0;i<region.markers.length;i++){
				
				if(region.markers[i].getVisible()==true){
					temp = region.markers[i];
					temp.setVisible(false);
					region.markers[i]=temp;	
				}
				else{
					temp = region.markers[i];
					temp.setVisible(true);
					region.markers[i]=temp;
				}		
			}
		}
		
		
		//------------------Adds an event listener to a marker to open/close its infowindow
		function addMarkerListener(marker){
		  google.maps.event.addListener(marker, 'click', function(){
				for(var i=0;i<regions.length;i++){
				    for(var j=0; j<regions[i].markers.length; j++){
					if(regions[i].markers[j]!=marker)regions[i].markers[j].info.close(); // close all other info windows
				    }
				}
				if(marker.info.getMap()==null) marker.info.open(map, marker);
				else marker.info.close();
			});
		}  
		
		
		//-----------------Region object
		function region(name, polygon){
			this.polygon = polygon;
			this.name = name;
			this.markers = [];
			this.selected = false;
		}
		
		
		//-----------------Construct a polygon for a region
		function constructPolygon(coordinates, name){
			r = new region(name, new google.maps.Polygon({
			paths: coordinates,
			strokeColor: regionStrokeCol,
			strokeOpacity: 0.8,
			strokeWeight: 1,
			fillColor: regionFillCol,
			fillOpacity: regionFillOpacity
			}));
			r.polygon.setMap(map);
			regions.push(r);		
		}
		
		
		//-----------------Add event handlers to a region
		function AddEventHandlers(region){
			google.maps.event.addListener(region.polygon, 'click', function() {
				RegionSelector(region.polygon);
				toggleRegionMarkers(region);
			});
			
			google.maps.event.addListener(region.polygon, 'mouseover', function() {
				if(region.polygon.get('fillOpacity')==regionFillOpacity) region.polygon.setOptions({fillOpacity: regionFillOpacityMouse});
			});
			
			google.maps.event.addListener(region.polygon, 'mouseout', function() {
				if(region.polygon.get('fillOpacity')==regionFillOpacityMouse) region.polygon.setOptions({fillOpacity: regionFillOpacity});
			});
		}
		
		
		//-----------------Determine the selected region
		function RegionSelector(regionPoly){
			if(regionPoly==null){  // multibox control
				DeselectRegions();
				var regionName = document.getElementById("region").value; // multibox value
				
				if(regionName=="All"){
					for(var i=0;i< regions.length;i++){
						regions[i].polygon.setOptions({fillColor: regionFillColShow, fillOpacity: regionFillOpacityShow, strokeColor: regionStrokeColShow});
						for (var j=0; j < regions[i].markers.length; j++){
							regions[i].markers[j].setVisible(true);
						}
					}
				}
				else{
					for(var i=0;i< regions.length;i++){
						if(regionName==regions[i].name){
							regions[i].polygon.setOptions({fillColor: regionFillColShow, fillOpacity: regionFillOpacityShow, strokeColor: regionStrokeColShow});
							toggleRegionMarkers(regions[i]);
							break;
						}
					}
				}
			}
			else{	// user click control
				if(regionPoly.get('fillOpacity')==regionFillOpacityShow) regionPoly.setOptions({fillOpacity: regionFillOpacity, fillColor: regionFillCol, strokeColor: regionStrokeCol});
				else regionPoly.setOptions({fillColor: regionFillColShow, fillOpacity: regionFillOpacityShow, strokeColor: regionStrokeColShow});
			}
		}
		
		
		//-----------------Deselect all regions
		function DeselectRegions(){
			for(var i=0;i< regions.length;i++){
				regions[i].polygon.setOptions({fillColor: regionFillCol, fillOpacity: regionFillOpacity, strokeColor: regionStrokeCol});
				for (var j=0; j < regions[i].markers.length; j++){
					regions[i].markers[j].setVisible(false);
				}
			}	
		}
		
		
	// attach a photo to a marker
		/*function attachPhoto(marker) {
			marker.info = new google.maps.InfoWindow({
				content: '<IMG SRC="river1.jpg">',
			});
			google.maps.event.addListener(marker, 'click', function(){
				marker.info.open(map, marker);
			});
		}*/
		
		/*function ShowTownNames(){
				townLabels = !townLabels;
					if(townLabels){
						styles.push({
							featureType: "administrative.locality", // town labels
							elementType: "labels",
							stylers: [
								{ visibility: "on" },
							]
						});
					}
					else{
						styles.pop();
					}
					map.setOptions({styles: styles});
			}*/
			
		/*function MarkerControl(controlDiv) {
			// Set CSS styles for the DIV containing the control
			controlDiv.style.padding = '5px';

			// Set CSS for the control border
			var controlUI = document.createElement('div');
			controlUI.style.backgroundColor = 'white';
			controlUI.style.borderStyle = 'solid';
			controlUI.style.borderWidth = '2px';
			controlUI.style.cursor = 'pointer';
			controlUI.style.textAlign = 'center';
			controlUI.title = 'Click to display/hide all markers';
			controlDiv.appendChild(controlUI);

			// Set CSS for the control interior
			var controlText = document.createElement('div');
			controlText.style.fontFamily = 'Arial,sans-serif';
			controlText.style.fontSize = '14px';
			controlText.style.paddingLeft = '6px';
			controlText.style.paddingRight = '6px';
			controlText.style.paddingTop = '2px';
			controlText.style.paddingBottom = '2px';
			controlText.innerHTML = '<b>Markers</b>';
			controlUI.appendChild(controlText);

			// Setup the click event listeners
			google.maps.event.addDomListener(controlUI, 'click', function() {
				if(markers[0].getVisible()){
					for (var i=0; i < markers.length; i++){markers[i].setVisible(false);}
				}
				else for (var i=0; i < markers.length; i++){markers[i].setVisible(true);}
			});
		}*/
		
		google.maps.event.addDomListener(window, 'load', initialize);
