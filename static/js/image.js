$(document).ready(function(){
  $(".ttip").tooltip()

  var center = new google.maps.LatLng(lat, lng);
  var mapOptions = {
   center: center,
   zoom: 7,
   zoomControl:false,
   streetViewControl:false,
   panControl:false, 
   mapTypeId: google.maps.MapTypeId.ROADMAP
 };         
 map = new google.maps.Map(document.getElementById("maps"), mapOptions)
 var markerOpts = {map:map, position: center}
 var marker = new google.maps.Marker(markerOpts);         
 var firstTimeRound = true;
 var mapShowing = false;
      /*Edited to display properly
      Sort of, when changing to map will link to top of page*/
      $("#maps").hide();
      google.maps.event.addListener(map, 'tilesloaded', function(){
       if(firstTimeRound){
         firstTimeRound = !firstTimeRound;
         $("#map_container").append($("#maps"));
       };
     });     


         $("#loc").click(function(e){
         
          if (!mapShowing) {
          $("#img").hide();
          $("#maps").effect("fade",800);
          google.maps.event.trigger(map, 'resize');
          map.setCenter(center);
          }
          else{
          	$("#maps").hide();
          	$("#img").effect("fade",400);
          }
          mapShowing = !mapShowing;
        });


      /* Ditched modal for jquery toggle*/
      $( "#add_tag" ).click(function(e) {
      	
      	var alreadyExists = false;
        e.preventDefault();
        
        function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $( "#tag_container" ).toggle( {"effect":"slide"} );
  $("#tag_text").typeahead({source:typeAheadSource});
  $("#add_tag_submit").click(function(e){

  	$(".alert").alert('close');
  	alreadyExists = false;
    var tag_text = $("#tag_text").val();
    for (var i = image_tags.length - 1; i >= 0; i--) {
    		
    		if (tag_text.toUpperCase()===(image_tags[i].toUpperCase())) {
    			alreadyExists = true;
    			break;
    		}
    	}
    if(tag_text == ''){
      if(!$("#empty_tag").length)
        // console.log("Hi, It's empty");
      $("<div id='empty_tag' class='alert alert-info'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>Oh dear!</strong> You cannot add an empty tag.</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":6000});
    }else if(tag_text.length > 30){
      if(!$("#lengthy_tag").length)
        $("<div id='lengthy_tag' class='alert-danger'><button type='button' class='close' data-dismiss='alert'>&times;</button>Tags must be less than 30 characters</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":6000});
    }else if("{{current_user_id}}" == 'None'){
      if(!$("#auth_tag").length)
        $("<div id='auth_tag' class='alert alert-danger'><button type='button' class='close' data-dismiss='alert'>&times;</button>You must be logged in to add a tag</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":6000});
    }else if(alreadyExists){    		
    		$("<div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>Gracious me!</strong> That tag is already applied to this image </div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":6000});
    	}
    	else{
    	
      if(!current_uid){
        $("<div id='auth_tag' class='alert alert-error hide'>You must be logged in to add a tag</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":6000});
        return;
      }
      var post = new Array(4);
      post['csrfmiddlewaretoken'] = document.getElementsByName("csrfmiddlewaretoken")[0].value;
      $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", post['csrfmiddlewaretoken']);
          }
        }
      });
      post['tag'] = tag_text;
      post['id'] = img_id;
      console.log("Posting: "+post['tag']+", "+post['id']+", "+post['csrfmiddlewaretoken']);

      $.post("/add_tag/", {id:img_id,tag:tag_text,csrfmiddlewaretoken:post['csrfmiddlewaretoken']}, function(post){
        if(post['added']){
          $("#tags").append($("<span class='tag'>| "+tag_text+" </span>"));
          $("<div id='success' class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><strong>Great!</strong> Your tag has been added</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":6000});
          image_tags.push(tag_text);
          // console.log("Success!");
        }
        // setTimeout(function(){$('.modal').modal('hide'); $('.modal').remove();}, 2000);
      }).error(function(post){
        // console.log("Error");
        $("<div id='failed_post' class='alert alert-error'><strong>Crikey!</strong> Something has gone wrong on our end, try again later! :[</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":6000});
          // setTimeout(function(){$('.modal').modal('hide'); $('.modal').remove();}, 2000);
        });
    }
  });
});


});
