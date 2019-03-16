function initMap() {
  var geocoder = new google.maps.Geocoder;
  var map = new google.maps.Map(
      document.getElementById('map'), {
        minZoom: 2,
        zoom: 2.5, 
        maxZoom: 5,
        center: {lat: 0.0, lng: 0.0},
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        styles:     [
          {
              "elementType": "labels",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.land_parcel",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative.neighborhood",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          }
      ]    
        
      });
  // var marker = new google.maps.Marker({position: {lat: 0.0, lng: 0.0}, map: map});

  var iconBase = './icons/';
  var icons = {
    negative: {
      scaledSize: new google.maps.Size(32, 32),
      url: iconBase + 'negative.png',
    },
    neutral: {
      scaledSize: new google.maps.Size(32, 32),
      url: iconBase + 'neutral.png'
    },
    positive: {
      scaledSize: new google.maps.Size(32, 32),
      url: iconBase + 'positive.png'
    }
  };

  var request = new XMLHttpRequest();

  request.open('GET', './output.json', true);

  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        data.forEach(tweet => {
          var sentiment = tweet.sentiment_score < -0.25 ? 'negative' : tweet.sentiment_score > 0.25 ? 'positive' : 'neutral'
          
          var marker = new google.maps.Marker({
                position: new google.maps.LatLng(tweet.location.longitude, tweet.location.latitude),
                icon: icons[sentiment],
                map: map
              });
          

          var content =  "Sentiment score: " + tweet.sentiment_score
          var infowindow = new google.maps.InfoWindow()
          


          google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
            return function() {
              infowindow.setContent(content);
              infowindow.open(map,marker);
            };
          })(marker,content,infowindow));     

        });
      } else {
        console.log('error');
      }
  }

  request.send();
}