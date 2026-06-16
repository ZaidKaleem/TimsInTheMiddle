
var map;
var markerArr = [];
var locationMarkers = [null, null];
var glat, glng;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.472293, lng: -80.545072},
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: true,
        scrollwheel: true
    });

    var infoWindow = new google.maps.InfoWindow();

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

    autocompleteA.addListener('place_changed', function() {
        var place = autocompleteA.getPlace();
        if (!place.geometry) {
            return;
        }
        locationArray[0] = [place.geometry.location.lat(), place.geometry.location.lng()];
        paint(place, 0);
    });

    autocompleteB.addListener('place_changed', function() {
        var place = autocompleteB.getPlace();
        if (!place.geometry) {
            return;
        }
        locationArray[1] = [place.geometry.location.lat(), place.geometry.location.lng()];
        paint(place, 1);
    });

    function paint(place, index) {
        if (locationMarkers[index]) {
            locationMarkers[index].setMap(null);
        }

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locationArray[index][0], locationArray[index][1]),
            map: map
        });

        locationMarkers[index] = marker;
        markerArr.push(marker);

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

    function findMidPoint(locationArray) {
        var lat1 = locationArray[0][0];
        var lat2 = locationArray[1][0];

        var lng1 = locationArray[0][1];
        var lng2 = locationArray[1][1];

        var mid = [];

        mid[0] = (lat1 + lat2) / 2;
        mid[1] = (lng1 + lng2) / 2;

        return mid;
    }


    $("#findButton").click(function(){
        if (!locationArray[0] || !locationArray[1]) {
            alert('Please enter both locations.');
            return;
        }

        var mid = findMidPoint(locationArray);
        findTims(mid);
    });
}

function findTims(mid) {
    var bounds = new google.maps.LatLng(mid[0], mid[1]);

    var request = {
        location: bounds,
        keyword: 'tim hortons',
        rankBy: google.maps.places.RankBy.DISTANCE
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    function callback(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            alert('No Tim Horton shops around!');
            return;
        }

        glat = results[0].geometry.location.lat();
        glng = results[0].geometry.location.lng();

        paintTims(glat, glng);
    }
}

function paintTims(lat, lng) {

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        icon: {
            url: 'http://i.imgur.com/L3uPOwE.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }
    });

    marker.setVisible(true);

    map.setCenter(new google.maps.LatLng(lat, lng));

    $('.directionButton').parent().remove();
    $('#searchBoxes').append(
        '<a href="http://maps.google.com/maps?q=' + lat + ',' + lng + '&ll=' + lat + ',' + lng + '&z=17" target="_blank">' +
        '<button class="btn btn-success directionButton" type="button">Directions</button></a>'
    );
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
