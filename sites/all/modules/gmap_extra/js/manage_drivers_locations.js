(function ($) {
  Drupal.behaviors.gmapExtraGenerateDrivers = {
    attach: function (context, settings) {
      var defaultCenter = new google.maps.LatLng(38.010742, -99.1384153);
      var directionsService = new google.maps.DirectionsService();
      var map;
      var geocoder;
      var pickUpLocation = null;
      var tempDistance;
      var self = this;

      google.maps.event.addDomListener(window, 'load', initialize);

      function initialize() {
          geocoder = new google.maps.Geocoder();

          var myOptions = {
              zoom: 5,
              center: defaultCenter,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          }

          map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

          if ($('#top-search-input').val()) {
              setPickUpMarker($('#top-search-input').val());
          } else {
              getDrivers();
          }
      }

      function setPickUpMarker(pickUpAddress) {
          geocoder.geocode({'address': '"' + pickUpAddress + '"'}, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  markerIcon = imagesUrl + 'icon-marker-gray.png';
                  setMarker(results[0].geometry.location, false, 7, results[0].geometry.location, markerIcon, false, true);
                  // Set driver with pickup location by param
                  getDrivers(results[0].geometry.location);
              } else {
                  console.log("Geocode was not successful for the following reason: " + status);
              }
          });
      }

      function getDrivers(pickUp) {

          var pickUpLoc = null;

          if (pickUp) {
              pickUpLoc = new google.maps.LatLng(pickUp.lat(), pickUp.lng());
          }

          $.get(baseUrl + "get-driver-locations/", null).done(function (data) {

              $.each(data, function (index) {
                  var location = new google.maps.LatLng(data[index].k, data[index].D);

                  if (pickUpLoc) {
                      calculateDistances(pickUpLoc, location, function (distance) {
                          constructMarkerStyle(location, data[index], distance);
                      });
                  } else {
                      if ($('#enabledGeocode').val())
                          geocodeDriverMarker(data[index]);
                      else
                          constructMarkerStyle(location, data[index], null);
                  }

              });
          });
      }

      function geocodeDriverMarker(data) {
          geocoder.geocode({'address': '"' + data.Location + '"'}, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  $.get(baseUrl + "set-driver-coords/" + data.ID + "/" + results[0].geometry.location.lat() + "/" + results[0].geometry.location.lng());
                  constructMarkerStyle(results[0].geometry.location, data, null);
              } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                  setTimeout(function () {
                      geocodeDriverMarker(data);
                  }, 0);
              } else {
                  console.log("Geocode was not successful for the following reason: " + status);
              }
          });
      }

      function constructMarkerStyle(location, data, distance) {

          var markerIcon = '';
          var noteString = '';
          var vehicleType = '';

          if (data.VehicleType == 1) {
              markerIcon = markerIcon = imagesUrl + 'icon-marker-red.png?v=2';
              vehicleType = 'SPRINTER VAN';
          } else if (data.VehicleType == 2) {
              markerIcon = markerIcon = imagesUrl + 'icon-marker-blue.png?v=2';
              vehicleType = 'BOX TRUCK 12-16FT';
          } else if (data.VehicleType == 3) {
              markerIcon = markerIcon = imagesUrl + 'icon-marker-green.png?v=2';
              vehicleType = 'STRAIGHT TRUCK 16-26FT';
          }

          if (data.AvailableInFuture)
              markerIcon = markerIcon = imagesUrl + 'icon-marker-yellow.png?v=2';

          if (data.CurrUserRoleID == 1 || data.CurrUserRoleID == 2) {

              var contentString = '<div style="width:250px"><div style="float:left;max-width:150px;">' + data.Location + '</div>';

              if (data.TravelCanada == 1)
                  contentString += '<img style="float:right;" src="' + imagesUrl + '/icon-canada-flag.jpg"/>';

              contentString += '<br/><br/><strong>' + data.Name + '</strong>';

              if (data.Note)
                  noteString = 'Note: ' + data.Note + '<br/>';

              contentString += '<br/>'
                      + 'Tel.: ' + data.Phone + '<br/>'
                      + toNormalDate(data.AvailableAt) + '<br/>'
                      + noteString
                      + vehicleType + " (" + data.Vehicle + ")"
                      + ', MaxWeight:'
                      + data.MaxWeight;

              if (distance)
                  contentString += '<br/>' + distance + '</div>';
              else
                  contentString += '</div>';

          } else if (data.CurrUserRoleID == 4) {
              var contentString = '<div style="width:200px">' + vehicleType;
          }

          setMarker(location, contentString, 5, false, markerIcon, data.ID, false);
      }

      function setMarker(location, infowindowStr, zoom, center, icon, driverID, isPickUpMarker) {

          var zIndex = 0;

          if (isPickUpMarker)
              zIndex = 10;

          var marker = new google.maps.Marker({
              map: map,
              position: location,
              icon: icon,
              zIndex: zIndex
          });

          if (infowindowStr) {
              var infowindow = new google.maps.InfoWindow({
                  content: infowindowStr,
                  maxWidth: 320
              });

              google.maps.event.addListener(marker, 'click', function () {
                  infowindow.open(map, marker);
              });
          }

      }

      function getDirection(startLocation, endLocation, callback) {

          var request = {
              origin: startLocation,
              destination: endLocation,
              travelMode: google.maps.TravelMode.DRIVING
          };

          directionsService.route(request, function (response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  var distanceStringInMiles = response.routes[0].legs[0].distance.text;
                  var durationString = response.routes[0].legs[0].duration.text;
                  callback(distanceStringInMiles + " (" + durationString + ")");
              } else {
                  callback(status);
              }
          });

      }

      function calculateDistances(startLocation, endLocation, callback) {

          var service = new google.maps.DistanceMatrixService();

          var request = {
              origins: [startLocation],
              destinations: [endLocation],
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.IMPERIAL,
              avoidHighways: false,
              avoidTolls: false
          };

          service.getDistanceMatrix(request, function (response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  var distanceStringInMiles = response.rows[0].elements[0].distance.text;
                  var durationString = response.rows[0].elements[0].duration.text;
                  callback(distanceStringInMiles + " (" + durationString + ")");
              }
          });
      }
    }
  };
}(jQuery));
