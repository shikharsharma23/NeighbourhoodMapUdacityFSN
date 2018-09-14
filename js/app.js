/* Knockout.js benfits

ViewModel: Knockout's ViewModel is similar to the Octopus. It separates the Model and the View

Declarative Bindings: Bindings allow you to connect the View and Model in a direct and simple way.

Automatic UI Refresh: Knockout's will update the View when the Model changes. And with the right declarative bindings, Knockout can update the Model when elements in the View change (such as input elements, checkboxes, etc).

Dependency Tracking: Knockout allows you to create a relationship between parts of the Model, and will automatically update Model data that depends on other Model data when that other Model data changes.

*/


var map; // global function

function ViewModel(){

    var self = this;

    this.markers = [];

    this.searchText =  ko.observable(""); // search empty
    fourSquareClientId = "2Y2GWLNZOZH5J4H4OOMEU21PCLGTEAL4JQNTJ5H3Y5S1H3QK";
    fourSquareClientSecret ="0GD1GY4LWZWCFDFKWRFXOWITJG0SONF1LP0Q2RFSGFK041AO";



    this.populateInfoWindow = function(marker, infowindow){

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;

    //  Foursquare API
    var foursquareAPIUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.position.lat() + ',' + marker.position.lng() + '&client_id=' + fourSquareClientId +
                '&client_secret=' + fourSquareClientSecret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';

    console.log(foursquareAPIUrl);

    $.getJSON(foursquareAPIUrl).done(function(marker) {

        var response = marker.response.venues[0];
        var htmlContent = "<div>" + response.location.formattedAddress[0]; + "</div>"
        htmlContent += "<div>" + response.location.formattedAddress[1]; + "</div>"
        htmlContent += "<div>" + response.location.formattedAddress[3]; + "</div>"
        infowindow.setContent(htmlContent);

    }).fail(function(){
        alert("Issue with foursquare API")
    });
            

      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.marker = null;
      });
    }


    };

    this.initMap = function(){

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: places[0].location.lat, lng: places[0].location.lng},
          zoom: 5
        });

    
        this.largeInfowindow = new google.maps.InfoWindow(); //belongs to this function and can be accessed outside now . specific vaar cant be accessed
        var bounds = new google.maps.LatLngBounds();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < places.length; i++) {
          // Get the position from the location array.
          var position = places[i].location;
          var title = places[i].name;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          this.markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            self.populateInfoWindow(this, self.largeInfowindow); // use self to call funciton at same level
            this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout((function() {this.setAnimation(null);}).bind(this), 1000); // reset animation after 1000 ms !
          });
          bounds.extend(this.markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);

    };

  
    this.reflectPlaceClicked = function(){
        self.populateInfoWindow(this,self.largeInfowindow); // this here is one who called me which is basically a marker object so we pass it
        // self here is basically i am trying to call a function of the thing which i am inside ie where i have retrieved self
        this.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout((function() {this.setAnimation(null);}).bind(this), 1000); // reset animation after 1000 ms !

    };

   

    this.initMap();
    this.largeInfowindow.close();

    this.listPlaces = ko.computed(function() {
    var result = [];
    for (var i = 0; i < this.markers.length; i++) 
        if (this.markers[i].title.toLowerCase().includes(this.searchText().toLowerCase())) {
            result.push(this.markers[i]);
            this.markers[i].setVisible(true);   
        }
        else
            this.markers[i].setVisible(false);
        return result;
    }, this);
}

function launch() {
    ko.applyBindings(new ViewModel()); // call the viewModel and apply bindings
}
// bindings are applied to view model, hence the properties of viewmodel are only visible and not directly the properties of odel