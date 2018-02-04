
$(document).ready(function(){
	var map;
	var service;
	var infowindow;
	var lat;
	var long;
	var btn = $('#btn');
	var query;

	$("#searchForm").submit(function(event){
		val = $("#tf").val();
		if (val === "HIV") {
			$('#result-header').text("Places for HIV treatment");
		}else if (val === "dermatologists") {
			$("#result-header").text("Doctors/Places for Skin Disorders");
		}else if (val === "psychiatrist") {
			$("#result-header").text("Doctors/Places for Stress and Anxiety");
		}
		
		if (val === "default") {
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
	    		console.log(lat + "  " + long)
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
	    rankBy: google.maps.places.RankBy.DISTANCE,
	    query: query
	  };

	  service = new google.maps.places.PlacesService(map);
	  service.textSearch(request, callback);

	  
	}

	function callback(result, status) {
	  	results = result;
		
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			$("#load").addClass("hide");
			$("#load").removeClass("show");
		    for (var i = 0; i < results.length; i++) {
		      var place = results[i];
		      var place_id = results[i].place_id;
		      createMarker(results[i]);

		      var request = {
				  placeId: place_id
				};

				service = new google.maps.places.PlacesService(map);
				service.getDetails(request, callback);

				function callback(place, status) {
					console.log(place);
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
					    var btn_id = $(this).val();
					    alert(btn_id);
					});
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