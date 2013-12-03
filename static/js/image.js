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
      /*Edited to display properly
      Sort of, when changing to map will link to top of page*/
      $("#maps").hide();
      google.maps.event.addListener(map, 'tilesloaded', function(){
       if(firstTimeRound){
         firstTimeRound = !firstTimeRound;

         $("#map_container").append($("#maps"));
         $("#loc").toggle(function(e){
          e.preventDefault();         
          $("#img").hide();
          $("#maps").show({"effect":"fade", "duration":800});
          google.maps.event.trigger(map, 'resize');
          map.setCenter(center);
        }, function(e){
          e.preventDefault();
          $("#img").show({"effect":"fade", "duration":800});
                  $("#maps").hide();//, function(){google.maps.event.trigger(map, 'resize'); map.setCenter(center)});
       });
       };
     });     

      /* Ditched modal for jquery toggle*/
      $( "#add_tag" ).click(function(e) {
        e.preventDefault();

        function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $( "#tag_container" ).toggle( {"effect":"slide"} );
  $("#tag_text").typeahead({source:typeAheadSource});
  $("#add_tag_submit").click(function(e){
    var tag_text = $("#tag_text").val();
    if(tag_text == ''){
      if(!$("#empty_tag").length)
        // console.log("Hi, It's empty");
      $("<div id='empty_tag' class='alert-error'>Cannot add an empty tag!</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":5000});
    }else if(tag_text.length > 30){
      if(!$("#lengthy_tag").length)
        $("<div id='lengthy_tag' class='alert-error'>Tags must be less than 30 characters</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":5000});
    }else if("{{current_user_id}}" == 'None'){
      if(!$("#auth_tag").length)
        $("<div id='auth_tag' class='alert-error'>You must be logged in to add a tag</div>").appendTo($("#tag_container")).toggle();
    }else{

      if(!current_uid){
        $("<div id='auth_tag' class='alert alert-error hide'>You must be logged in to add a tag</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":5000});
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
          $("<div id='success' class='alert-success'>Tag added</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":5000});
          // console.log("Success!");
        }
        // setTimeout(function(){$('.modal').modal('hide'); $('.modal').remove();}, 2000);
      }).error(function(post){
        // console.log("Error");
        $("<div id='failed_post' class='alert-error'>Something broke : (maybe refresh and try again)</div>").appendTo($("#tag_container")).toggle({"effect":"fade", "duration":5000});
          // setTimeout(function(){$('.modal').modal('hide'); $('.modal').remove();}, 2000);
        });
    }
  });
});


});
