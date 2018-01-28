$(document).ready(function(){
	var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyCuyWZ5gRFMxBbYu5zMYs-HCcVguVL-w0s"
	$('#btn').click(function() {
		$.ajax({
		  type: "POST",
		  headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    		},
		  cache: "false",
		  dataType: "json",
		  url: url,
		  success: function(response) {
		  	console.log(response)
		  }
		});

	})
});