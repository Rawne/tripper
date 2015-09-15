Meteor.startup(function() {
  GoogleMaps.load();

});

Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8
      };
    }
  }
});
Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    $(".map-container").droppable({
      drop: function( event, ui ) {
        var mOffset=$(map.instance.getDiv()).offset();
        var pixel=new google.maps.Point(
            ui.offset.left-mOffset.left+(ui.helper.width()/2),
            ui.offset.top-mOffset.top+(ui.helper.height())
        );
        var scale = Math.pow(2, map.instance.getZoom());
        var proj = map.instance.getProjection();
        var bounds = map.instance.getBounds();

        var nw = proj.fromLatLngToPoint(
          new google.maps.LatLng(
            bounds.getNorthEast().lat(),
            bounds.getSouthWest().lng()
          ));
        var point = new google.maps.Point();

        point.x = pixel.x / scale + nw.x;
        point.y = pixel.y / scale + nw.y;
        var location = proj.fromPointToLatLng(point);
        console.log(location);
        var activity = Session.get('editing_event');
        Meteor.call('updateActivityLocation', activity, location.G, location.K, function(error, result) {
          if (error) {
            alert(error.reason);
          }
        });
      }
    });
    google.maps.event.addListener(map.instance, 'click', function(event) {
      var newActivity = {};
      newActivity.start = new Date();
      newActivity.title = "new event";
      newActivity.createdBy = Meteor.userId();
      newActivity.lat = event.latLng.lat();
      newActivity.lng = event.latLng.lng();
      //newActivity.forPerson = Iron.Location.get().path.substring(22);
      Meteor.call('insertActivityData', newActivity, function(error, result) {
        if (error) {
          alert(error.reason);
        }
        else {
          Session.set('editing_event', result);
          Session.set('showEditEvent', true);
        }
      });
   });

   var markers = {};

   ActivityList.find().observe({
      added: function(document) {
        // Create a marker for this document
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: document._id
        });
        google.maps.event.addListener(marker, 'click', function(event) {
          Session.set('editing_event', marker.id);
          Session.set('showEditEvent', true);
        });
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        // This listener lets us drag markers on the map and update their corresponding document.
        google.maps.event.addListener(marker, 'dragend', function(event) {
          Meteor.call('updateActivityLocation', marker.id, event.latLng.lat(), event.latLng.lng(), function(error, result) {
            if (error) {
              alert(error.reason);
            }
          });
        });

        // Store this marker instance within the markers object.
        markers[document._id] = marker;
      },
      changed: function(newDocument, oldDocument) {
        if(newDocument.lat && newDocument.lng)
        {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        }
      },
      removed: function(oldDocument) {
        // Remove the marker from the map
        markers[oldDocument._id].setMap(null);

        // Clear the event listener
        google.maps.event.clearInstanceListeners(
          markers[oldDocument._id]);

        // Remove the reference to this marker instance
        delete markers[oldDocument._id];
      }
    });
    Tracker.autorun(function () {
      var event = Session.get('editing_event');
      var previous = Session.get('previous_editing_event');
      if(previous && markers[previous])
      {
        markers[previous].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        markers[previous].setAnimation(null);
      }
      if(event && markers[event]){
        markers[event].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        markers[event].setAnimation(google.maps.Animation.BOUNCE);
        Session.set('previous_editing_event', event);
      }
    });
  });
});
