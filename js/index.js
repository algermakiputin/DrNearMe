
$(document).ready(function(){
	var map;
	var service;
	var infowindow;
	var lat;
	var long;
	var btn = $('#btn');
	var query;
	var placeID;

	$('#feedback-form').submit(function( event ){
		
		name = $("#name").val();
		email = $("#email").val();
		message = $("#textarea").val();

		if (name === "" || email === "" || message === "") {
			alert('Please fill out all the the required fields');
		}else {
			alert('Thank you for sending us a message although we cannot read it.');
			location.reload();
		}
		
		event.preventDefault();

	});
		
	$("#close-map").click(function(){
		$("#modal-map").removeClass('showmap');
		$("#modal-map").addClass('hide');
	});

	$("#searchForm").submit(function(event){
		val = "";
		if ($("#input-str").val() !== "") {
			val = $("#input-str").val();
			$('#result-header').text("Doctors/Places for " + val);
			$("#page").addClass('hide');
			$("#load").addClass("show");
			$("#load").removeClass("hide");
			$("#results").removeClass('hide');
			$("#results").addClass('show');
			query = val;
			searchPlace();
			event.preventDefault();
		}

		val = $("#tf").val();
		if (val === "HIV") {
			$('#result-header').text("Places for HIV treatment");
		}else if (val === "dermatologists") {
			$("#result-header").text("Doctors/Places for Skin Disorders");
		}else if (val === "psychiatrist") {
			$("#result-header").text("Doctors/Places for Stress and Anxiety");
		}else if (val === "immunologist") {
			$("#result-header").text("Doctors/Places for Allergies");
		}else if (val === "Cardiologist") {
			$("#result-header").text("Doctors/Places for Hypertension");
		}else if (val === "Pediatrician") {
			$("#result-header").text("Doctors/Places for Influenza & Pneumonia");
		}else if (val === "Plastic surgeon") {
			$("#result-header").text("Doctors/Places for Breast Cancer");
		}
		
		if (val === "default" && $("#input-str".val() === "")) {
			alert('Please Select Your Condition')
		}else {
			query = val;
			$("#page").addClass('hide');
			$("#load").addClass("show");
			$("#load").removeClass("hide");
			$("#results").removeClass('hide');
			$("#results").addClass('show');
			searchPlace();

		}
		event.preventDefault();
	});
	
	function searchPlace() {

	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(position){
	        	lat = position.coords.latitude; 
	    		long = position.coords.longitude; 
	    		
	    		initialize(lat,long);
	        },function (error) { 
			  if (error.code == error.PERMISSION_DENIED)
			      $("#load").addClass("hide");
					$("#load").removeClass("show");
					$("#page").addClass('show');
					$("#page").removeClass('hide');
					alert('Location Access Denied');
			});
	    }


	  
	}

	function initialize(lat,long) {
	  var pyrmont = new google.maps.LatLng(lat,long);

	  map = new google.maps.Map(document.getElementById('map'), {
	      center: pyrmont,
	      zoom: 15
	    });

	  var request = {
	    location: pyrmont,
	    radius: '500',
	    query: query
	  };

	  service = new google.maps.places.PlacesService(map);
	  service.textSearch(request, callback);

	  
	}

	function callback(result, status) {
	  	results = result;
		var count = 0;
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			$("#load").addClass("hide");
			$("#load").removeClass("show");

			var place_map = new google.maps.Map(document.getElementById('place-map'), {
			  zoom: 13,
			  center: {lat: lat, lng: long}
			});
			var geocoder = new google.maps.Geocoder;
			var infowindow = new google.maps.InfoWindow;
		    for (var i = 0; i < results.length; i++) {
		    	count++;
		      var place = results[i];
		      var place_id = results[i].place_id;
		      createMarker(results[i]);

		      var request = {
				  placeId: place_id
				};

				service = new google.maps.places.PlacesService(map);
				service.getDetails(request, callback);

				function callback(place, status) {
					var name = place.name;
					var address = place.formatted_address;
					var id = place.place_id;
					
					if (place.hasOwnProperty('formatted_phone_number')) {
						var number = place.formatted_phone_number;
					}else {
						number = "Not Available";
					}

				 	$("#search-result").append('<li><div class="wrap"><div class="direction"></div><h3>'+name+'</h3><p>'+address+'</p><p> Contact Number : '+number+'</p><button value="'+id+'" id="'+id+'" class="directions">View Map <i class="fa fa-arrow-circle-right"></i></button></div></li>');
				 	
				 	
				 	$("#"+id+"").click(function() {
				 		$("#modal-map").removeClass('hide');
					    $("#modal-map").addClass('showmap');
					    var btn_id = $(this).val();
					    placeID = btn_id;
						$("#place-name").text(name);
					    geocodePlaceId(geocoder, place_map, infowindow, placeID);
					    

					});


					$("#result_number").text(count);

				}
		    }
	
	
		 }
		 
	}

	function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }


		
	});


// This function is called when the user clicks the UI button requesting
// a geocode of a place ID.
	function geocodePlaceId(geocoder, map, infowindow,placeID) {
	var placeId = placeID;
	geocoder.geocode({'placeId': placeId}, function(results, status) {
	  if (status === 'OK') {
	    if (results[0]) {
	    	console.log(results[0]);
	      map.setZoom(15);
	      map.setCenter(results[0].geometry.location);
	      var marker = new google.maps.Marker({
	        map: map,
	        position: results[0].geometry.location
	      });
	      infowindow.setContent(results[0].formatted_address);
	      infowindow.open(map, marker);
	    } else {
	      window.alert('No results found');
	    }
	  } else {
	    window.alert('Geocoder failed due to: ' + status);
	  }
	});



}