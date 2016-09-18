

var map;
var markerArr = [];
var glat, glng;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.472293, lng: -80.545072},
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: true,
        scrollwheel: false
    });


    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    var locationArray = [];

    // Getting input from first search box
    var inputA = (document.getElementById('pointA'));
    var autocompleteA = new google.maps.places.Autocomplete(inputA);
    autocompleteA.bindTo('bounds', map);

    // Getting input from second search box
    var inputB = (document.getElementById('pointB'));
    var autocompleteB = new google.maps.places.Autocomplete(inputB);
    autocompleteB.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var i;

    autocompleteA.addListener('place_changed', function() {
        var place = autocompleteA.getPlace();
        locationArray.push([place.geometry.location.lat(),place.geometry.location.lng()]);
        console.log(locationArray[0]);
        console.log(locationArray[0].length);
        paint(place, locationArray);
    });

    autocompleteB.addListener('place_changed', function() {
        var place = autocompleteB.getPlace();
        locationArray.push([place.geometry.location.lat(),place.geometry.location.lng()]);
        console.log(locationArray[1]);
        console.log(locationArray[1].length);
        paint(place, locationArray);
    });

    function paint(place, locationArray){
        console.log(locationArray.length);
        for (i = 0; i < locationArray.length; i++){

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(locationArray[i][0], locationArray[i][1]),
                map: map
            });

            markerArr.push(marker);

            marker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));

            // marker.setPosition(place.geometry.location);         // fix this shit
           // marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        }
    }

    function findMidPoint(locationArray) {
        var lat1 = locationArray[0][0];
        var lat2 = locationArray[1][0];

        var lng1 = locationArray[0][1];
        var lng2 = locationArray[1][1];

        var mid = [];

        mid[0] = (lat1 + lat2) / 2;
        mid[1] = (lng1 + lng2) / 2;

        console.log("Mid lat = " + mid[0]);
        console.log("Mid Lng = " + mid[1]);

       return mid;
    }


    $("#findButton").click(function(){
        var mid = findMidPoint(locationArray);
        findTims(mid);

        locationArray = [];



    });

}

function findTims(mid) {
    console.log(mid[0]);
    console.log(mid[1]);
    var bounds = new google.maps.LatLng(mid[0],mid[1]);

    var request = {
        location: bounds,
        keyword: ['tim hortons'],
        rankBy: google.maps.places.RankBy.DISTANCE
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    function callback(results, status) {


        if (results.length==0){
            console.log("No shop around!");
            alert("No Tim Horton shops around!");
        }

        console.log(results);
        glat = results[0].geometry.location.lat();
        glng = results[0].geometry.location.lng();

        console.log("Tim lat = " + glat);
        console.log("Tim Lng = " + glng);
        paintTims(glat, glng);

    }

}


function paintTims(lat, lng) {



    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        icon: 'http://i.imgur.com/L3uPOwE.png'
    });

    marker.setIcon(({
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));

    marker.setVisible(true);

    var bounds = new google.maps.LatLng(lat,lng);
    map.setCenter(bounds);
   // $('#searchBoxes').append("<a href=\"http://maps.google.com/?ie=UTF8&hq=&ll="+lat+","+lng+"&z=13\" + target=\"_blank\"><button class=\"btn btn-success directionButton\" type=\"button\">Directions</button></a>");
    $('#searchBoxes').append("<a href=\"http://maps.google.com/maps?q="+lat+","+lng+"&ll="+lat+0.1+","+lng+0.1+"&z=17\"+ target=\"_blank\"><button class=\"btn btn-success directionButton\" type=\"button\">Directions</button></a>")

    h
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}


$(document).ready(initMap);
