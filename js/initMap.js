var base_server = "https://tsw.valutadev.com";
var keyword_id = null;

function getIconSize() {
    if (window.innerWidth < 500) {
        return 16;
    }
    else if (window.innerWidth < 900) {
        return 24;
    }
    else if (window.innerWidth < 1600) {
        return 32;
    }
    else {
        return 48;
    }
}

function cityProcessor(city, map) {
    var iconBase = './img/icons/';
    
    var size = getIconSize();
    console.log(window.innerWidth, size);

    var icons = {
        negative: {
            scaledSize: new google.maps.Size(size, size),
            url: iconBase + 'negative.png',
        },
        neutral: {
            scaledSize: new google.maps.Size(size, size),
            url: iconBase + 'neutral.png'
        },
        positive: {
            scaledSize: new google.maps.Size(size, size),
            url: iconBase + 'positive.png'
        }
    };
    var request = new XMLHttpRequest();

    request.open('GET', base_server + '/keywords/' + keyword_id + '/cities/' + city.id + '/sentiment/', true);

    request.onload = function () {
        // Begin accessing sentiment data per city here
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            //console.log(city.city, data)


            var scores = [], positive = 0, neutral = 0, negative = 0;

            //counting each data entry
            data.forEach(entry => {
                scores.push(entry.score);
                if (entry.sentiment === 'positive') {
                    positive++;
                } else if (entry.sentiment === 'neutral') {
                    neutral++;
                } else if (entry.sentiment === 'negative') {
                    negative++;
                }
            });

            sum = scores.reduce((previous, current) => current += previous);
            let avg_sent = sum / scores.length;
            sentiment = avg_sent < -0.25 ? 'negative' : avg_sent > 0.25 ? 'positive' : 'neutral';

            //console.log(avg_sent, sentiment, scores, positive, neutral, negative)
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(city.location.latitude, city.location.longitude),
                icon: icons[sentiment],
                map: map
            });

            var content = "<h2>" + city.name + "</h2><p>" 
                        // + "Cluster: " + city.cluster 
                        + "Avg. Sentiment score: " + avg_sent.toFixed(2) 
                        + "<br>Positive count: " + positive 
                        + "<br>Neutral count: " + neutral 
                        + "<br>Negative count: " + negative + "</p>";
            var infowindow = new google.maps.InfoWindow()

            var data = [
                {
                    y: scores,
                    name: "Boxplot Sentiment Scores",
                    domain: {
                        row: 0,
                        column: 0
                    },
                    type: 'box'
                },
                {
                    values: [positive, neutral, negative],
                    labels: ['Positive', 'Neutral', 'Negative'],
                    domain: {
                        row: 0,
                        column: 1
                    },
                    marker: {
                        colors: ['rgb(64, 206, 24)', 'rgb(206, 127, 24)', 'rgb(206, 33, 24)']
                    },
                    hoverinfo: 'all',
                    type: 'pie'
                }
            ];

            var layout = {
                title: 'Sentiment Analysis of ' + city.name,
                showlegend: true,
                grid: { rows: 1, columns: 2 }
            };

            google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                return function () {
                    Plotly.newPlot('plot', data, layout, { responsive: true, showSendToCloud: true });
                    plotOpen();
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                };
            })(marker, content, infowindow));
        } else {
            console.log('error');
        }
    }

    request.send();
}

function initMap() {
    var geocoder = new google.maps.Geocoder;
    var map = new google.maps.Map(
        document.getElementById('map'), {
            minZoom: 2,
            zoom: 2.5,
            maxZoom: 5,
            center: { lat: 0.0, lng: 0.0 },
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            styles: [
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

    var request = new XMLHttpRequest();

    request.open('GET', base_server + '/keywords/' + keyword_id + '/cities/', true);

    request.onload = function () {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(city => {
                cityProcessor(city, map);
            });
        } else {
            console.log('error');
        }
    }

    request.send();
}

function setKeyword(id) {
    keyword_id = id;
    initMap();

    var request = new XMLHttpRequest();

    request.open('GET', base_server + '/keywords/', true);

    request.onload = function () {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(keyword => {
                if (keyword.id === keyword_id) {
                    document.getElementById("curr-top").innerText = keyword.name;
                }
            });
        } else {
            console.log('error');
        }
    }

    request.send();
}

function randomTopic() {
    var enabled_keywords = [];
    var request = new XMLHttpRequest();
  
    request.open('GET', base_server + '/keywords/', true);
  
    request.onload = function () {
      var data = JSON.parse(this.response);
      if (request.status >= 200 && request.status < 400) {
        data.forEach(keyword => {
            if (keyword.enabled === true) {
                enabled_keywords.push(keyword.id);
            }
        });
        setKeyword(enabled_keywords[Math.floor(Math.random() * enabled_keywords.length)])
      } else {
        console.log('error');
      }
    }  
    request.send();
}