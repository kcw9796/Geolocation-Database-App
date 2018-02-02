/* jshint strict: false */
/* global $: false, google: false */
//
// Red, White, and Blue JavaScript 
// for EECS 339 Project A at Northwestern University
//
// Originally by Peter Dinda
// Sanitized and improved by Ben Rothman
//
//
// Global state
//
// html    - the document itself ($. or $(document).)
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
//
//

//
// When the document has finished loading, the browser
// will invoke the function supplied here.  This
// is an anonymous function that simply requests that the 
// brower determine the current position, and when it's
// done, call the "Start" function  (which is at the end
// of this file)
// 
//


$(document).ready(function() {
	navigator.geolocation.getCurrentPosition(Start);
});

// Global variables
var map, usermark, markers = [], cyclenumbers = "1112", whattypes = "committees", committees_check = true, candidates_check = false, individuals_check = false, opinions_check = false,

// UpdateMapById draws markers of a given category (id)
// onto the map using the data for that id stashed within 
// the document.


UpdateMapById = function(id, tag) {
// the document division that contains our data is #committees 
// if id=committees, and so on..
// We previously placed the data into that division as a string where
// each line is a separate data item (e.g., a committee) and
// tabs within a line separate fields (e.g., committee name, committee id, etc)
// 
// first, we slice the string into an array of strings, one per 
// line / data item
	var rows  = $("#"+id).html().split("\n");

	if(tag=="COMMITTEE")
		var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/000000/");
	else if(tag=="CANDIDATE")
		var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/FFFFFF/");
	else if(tag=="INDIVIDUAL")
		var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/00FF3C/");
	else
		var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/800080/");

// then, for each line / data item
	for (var i=0; i<rows.length; i++) {
// we slice it into tab-delimited chunks (the fields)
		var cols = rows[i].split("\t"),
// grab specific fields like lat and long
			lat = cols[0],
			long = cols[1];

// then add them to the map.   Here the "new google.maps.Marker"
// creates the marker and adds it to the map at the lat/long position
// and "markers.push" adds it to our list of markers so we can
// delete it later 
		markers.push(new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(lat,long),
			title: tag+"\n"+cols.join("\n"),
			icon: pinImage
		}));

	}
},

//
// ClearMarkers just removes the existing data markers from
// the map and from the list of markers.
//
ClearMarkers = function() {
	// clear the markers
	while (markers.length>0) {
		markers.pop().setMap(null);
	}
},



BoxChange = function() {
	var typearr = [];
	var ch1 = document.getElementById("cbox1");
	var ch2 = document.getElementById("cbox2");
	var ch3 = document.getElementById("cbox3");
	var ch4 = document.getElementById("cbox4");

	if (ch1.checked)
		{typearr.push("committees");
		committees_check = true;}
	else
		committees_check = false;
	if (ch2.checked)
		{typearr.push("candidates");
		candidates_check = true;}
	else
		candidates_check = false;
	if (ch3.checked)
		{typearr.push("individuals");
		individuals_check = true;}
	else
		individuals_check = false;
	if (ch4.checked)
		{typearr.push("opinions");
		opinions_check = true;}
	else
		opinions_check = false;

	whattypes = typearr.join(',');


	var cycleboxes = document.getElementsByClassName("cycles");
	var cyclearr = [];

	for(var i = 0; i < cycleboxes.length; i++)
	{
		if (cycleboxes[i].checked) 
			cyclearr.push(cycleboxes[i].value);
	}

	cyclenumbers = cyclearr.join(',');	

	ViewShift();
},



//
// UpdateMap takes data sitting in the hidden data division of 
// the document and it draws it appropriately on the map
//
UpdateMap = function() {
// We're consuming the data, so we'll reset the "color"
// division to white and to indicate that we are updating
	var color = $("#color");
	color.css("background-color", "white")
		.html("<b><blink>Updating Display...</blink></b>");

// Remove any existing data markers from the map
	ClearMarkers();

// Then we'll draw any new markers onto the map, by category
// Note that there additional categories here that are 
// commented out...  Those might help with the project...
//
	
	if(committees_check)
		UpdateMapById("committee_data","COMMITTEE");
	if(candidates_check)
		UpdateMapById("candidate_data","CANDIDATE");
	if(individuals_check)
		UpdateMapById("individual_data","INDIVIDUAL");
	if(opinions_check)
		UpdateMapById("opinion_data","OPINION");

	
	var target,data,table,demmoney,repmoney,tr,td,tdemmoney=0,trepmoney=0,diff;
	target = document.getElementById("comm_money_data_target");
	target.style.display = "none";
	if(committees_check) {
		target.style.display = "block";
		data = document.getElementById("comm_money_data");
		table = data.innerHTML;
		target.innerHTML = table; 
		target.style.color = "white";

		demmoney = 0;
		repmoney = 0;
		tr = document.getElementById("committee_money_data_table").rows;
	    td = null;
	    for (var i = 0; i < tr.length; ++i) {   
	        td = tr[i].cells;
	        if (td[0].innerHTML == "DEM")
	        	demmoney += parseInt(td[1].innerHTML);
	        if (td[0].innerHTML == "REP")
	        	repmoney += parseInt(td[1].innerHTML);       
	     }
	     diff = demmoney - repmoney;
	     if(diff>10000000)
	     	target.style.background = "rgb(0,0,102)";
	     else if(diff>5000000)
	     	target.style.background = "rgb(50,50,203";
	     else if(diff>0)
	     	target.style.background = "rgb(153,153,254)";
	     else if(diff=0)
	     	target.style.background = "grey";
	     else if(diff>-5000000)
	     	target.style.background = "rgb(255,152,152)";
	     else if(diff>-10000000)
	     	target.style.background = "rgb(204,51,51)";
	     else
	     	target.style.background = "rgb(153,0,0)";

	     tdemmoney += demmoney;
	     trepmoney += repmoney;
 	}


 	target = document.getElementById("ind_money_data_target");
 	target.style.display = "none";
 	if(individuals_check) {
		target.style.display = "block";
		data = document.getElementById("ind_money_data");
		table = data.innerHTML;
		target.innerHTML = table;
		target.style.color = "white";  

		demmoney = 0;
		repmoney = 0;
		tr = document.getElementById("individual_money_data_table").rows;
	    td = null;
	    for (var i = 0; i < tr.length; ++i) {   
	        td = tr[i].cells;
	        if (td[0].innerHTML == "DEM")
	        	demmoney += parseInt(td[1].innerHTML);
	        if (td[0].innerHTML == "REP")
	        	repmoney += parseInt(td[1].innerHTML);       
	     }
	      diff = demmoney - repmoney;
	     if(diff>5000000)
	     	target.style.background = "rgb(0,0,102)";
	     else if(diff>1000000)
	     	target.style.background = "rgb(50,50,203";
	     else if(diff>0)
	     	target.style.background = "rgb(153,153,254)";
	     else if(diff=0)
	     	target.style.background = "grey";
	     else if(diff>-1000000)
	     	target.style.background = "rgb(255,152,152)";
	     else if(diff>-5000000)
	     	target.style.background = "rgb(204,51,51)";
	     else
	     	target.style.background = "rgb(153,0,0)";

	     tdemmoney += demmoney;
	     trepmoney += repmoney;
 	}

 	target = document.getElementById("opinion_color_data_target");
 	target.style.display = "none";
 	if(opinions_check) {
		target.style.display = "block";
		data = document.getElementById("opinion_color_data");
		table = data.innerHTML;
		target.innerHTML = table;
		target.style.color = "white";   

		tr = document.getElementById("opinion_color_data_table").rows;  
	    td = tr[1].cells;

	    diff = parseInt(td[0].innerHTML);
	     if(diff>0.8)
	     	target.style.background = "rgb(0,0,102)";
	     else if(diff>0.5)
	     	target.style.background = "rgb(50,50,203";
	     else if(diff>0)
	     	target.style.background = "rgb(153,153,254)";
	     else if(diff=0)
	     	target.style.background = "grey";
	     else if(diff>-0.5)
	     	target.style.background = "rgb(255,152,152)";
	     else if(diff>-0.8)
	     	target.style.background = "rgb(204,51,51)";
	     else
	     	target.style.background = "rgb(153,0,0)";
 	}

// When we're done with the map update, we mark the color division as
// Ready.
	color.html("Ready");

// The hand-out code doesn't actually set the color according to the data
// (that's the student's job), so we'll just assign it a random color for now
	if(tdemmoney>trepmoney)
		color.css("background-color", "blue");
	else if(tdemmoney<trepmoney)
		color.css("background-color", "red");
	else
		color.css("background-color", "white");	
	

},

//
// NewData is called by the browser after any request
// for data we have initiated completes
//
NewData = function(data) {
// All it does is copy the data that came back from the server
// into the data division of the document.   This is a hidden 
// division we use to cache it locally
	$("#data").html(data);
// Now that the new data is in the document, we use it to
// update the map
	UpdateMap();
},

//
// The Google Map calls us back at ViewShift when some aspect
// of the map changes (for example its bounds, zoom, etc)
//



ViewShift = function() {
// We determine the new bounds of the map
	var bounds = map.getBounds(),
		ne = bounds.getNorthEast(),
		sw = bounds.getSouthWest();

// Now we need to update our data based on those bounds
// first step is to mark the color division as white and to say "Querying"
	$("#color").css("background-color","white")
		.html("<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>");

// Now we make a web request.   Here we are invoking rwb.pl on the 
// server, passing it the act, latne, etc, parameters for the current
// map info, requested data, etc.
// the browser will also automatically send back the cookie so we keep
// any authentication state
// 
// This *initiates* the request back to the server.  When it is done,
// the browser will call us back at the function NewData (given above)
	
	$.get("rwb.pl",
		{
			act:	"near",
			latne:	ne.lat(),
			longne:	ne.lng(),
			latsw:	sw.lat(),
			longsw:	sw.lng(),
			format:	"raw",
			what:	whattypes,
			cycle: cyclenumbers
		}, NewData);


},

GetCoords = function() {
	navigator.geolocation.getCurrentPosition(SubmitCoords);
},

SubmitCoords = function(location) {
	var lat = location.coords.latitude,
	    long = location.coords.longitude;

	var f = document.createElement("form");
	f.setAttribute('method',"get");

	var i = document.createElement("input");
	i.setAttribute('type',"hidden");
	i.setAttribute('name',"latitude");
	i.setAttribute('value',lat);

	var s = document.createElement("input");
	s.setAttribute('type',"hidden");
	s.setAttribute('name',"longitude");
	s.setAttribute('value',long);

	var t = document.createElement("input");
	t.setAttribute('type',"hidden");
	t.setAttribute('name',"act");
	t.setAttribute('value',"give-opinion-data");

	var u = document.createElement("input");
	u.setAttribute('type',"hidden");
	u.setAttribute('name',"run");
	u.setAttribute('value',0);

	f.appendChild(i);
	f.appendChild(s);
	f.appendChild(t);
	f.appendChild(u);
	f.submit();
	
},


//
// If the browser determines the current location has changed, it 
// will call us back via this function, giving us the new location
//
Reposition = function(pos) {
// We parse the new location into latitude and longitude
	var lat = pos.coords.latitude,
		long = pos.coords.longitude;



// ... and scroll the map to be centered at that position
// this should trigger the map to call us back at ViewShift()
	map.setCenter(new google.maps.LatLng(lat,long));
// ... and set our user's marker on the map to the new position
	usermark.setPosition(new google.maps.LatLng(lat,long));
},


//
// The start function is called back once the document has 
// been loaded and the browser has determined the current location
//
Start = function(location) {
// Parse the current location into latitude and longitude        
	var lat = location.coords.latitude,
	    long = location.coords.longitude,
	    acc = location.coords.accuracy,
// Get a pointer to the "map" division of the document
// We will put a google map into that division
	    mapc = $("#map");


// Create a new google map centered at the current location
// and place it into the map division of the document
	map = new google.maps.Map(mapc[0],
		{
			zoom: 16,
			center: new google.maps.LatLng(lat,long),
			mapTypeId: google.maps.MapTypeId.HYBRID
		});

// create a marker for the user's location and place it on the map
	usermark = new google.maps.Marker({ map:map,
		position: new google.maps.LatLng(lat,long),
		title: "You are here"});

// clear list of markers we added to map (none yet)
// these markers are committees, candidates, etc
	markers = [];

// set the color for "color" division of the document to white
// And change it to read "waiting for first position"
	$("#color").css("background-color", "white")
		.html("<b><blink>Waiting for first position</blink></b>");

//
// These lines register callbacks.   If the user scrolls the map, 
// zooms the map, etc, then our function "ViewShift" (defined above
// will be called after the map is redrawn
//
	google.maps.event.addListener(map,"bounds_changed",ViewShift);
	google.maps.event.addListener(map,"center_changed",ViewShift);
	google.maps.event.addListener(map,"zoom_changed",ViewShift);

//
// Finally, tell the browser that if the current location changes, it
// should call back to our "Reposition" function (defined above)
//
	navigator.geolocation.watchPosition(Reposition);

	

	
};
