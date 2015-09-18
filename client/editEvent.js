 Session.setDefault('showEditEvent', false);
 Session.setDefault('editing_event', null);

 Template.editEvent.rendered = function() {
   var options = {
     show: true,
     backdrop: 'static',
     keyboard: false,
   }
   $('#editEvent-modal').modal(options);
   $('.modal-backdrop').removeClass("modal-backdrop");

   $('#editable-title.editable').editable({
     mode: 'inline',
     value: ActivityList.findOne({
       _id: Session.get('editing_event')
     }).title,
     success: function(response, newValue) {
       Meteor.call('updateActivityTitle', Session.get('editing_event'), newValue, function(error, result) {
         if (error) {
           alert(error.reason);
         }
       });
     }
   });

   $('#event-content.editable').editable({
     mode: 'inline',
     value: ActivityList.findOne({
       _id: Session.get('editing_event')
     }).content,
     success: function(response, newValue) {
       Meteor.call('updateActivityContent', Session.get('editing_event'), newValue, function(error, result) {
         if (error) {
           alert(error.reason);
         }
       });
     }
   });
 }

 Template.editEvent.helpers({
   'evt': function() {
     return ActivityList.findOne({
       _id: Session.get('editing_event')
     });
   },
   'markerPlaced': function() {
     var activity = ActivityList.findOne({
       _id: Session.get('editing_event')
     });
     if (activity && activity.lat && activity.lng) {
       return true;
     }
     return false;
   }
 });

 function close() {
   Session.set('editing_event', null);
   Session.set('showEditEvent', false);
 }

 Template.editEvent.events({
   'click .center': function(event, tmpl) {
     var activity = ActivityList.findOne({
       _id: Session.get('editing_event')
     });
     GoogleMaps.maps.map.instance.panTo(new google.maps.LatLng(activity.lat, activity.lng));
     return false;
   },
   'keydown': function(event, tmpl) {
     if (event.keyCode == 27) {
       close();
       return false;
     }
   },
   'mouseover #draggable': function() {
     $("#draggable").draggable({
       revert: "invalid"
     });
   },
   'mouseover .modal-event': function() {
     $(".modal-event").draggable({
       containment: "#calendar-container",
       scroll: false
     });
   },
   'click .delete': function(evt, tmpl) {
     Meteor.call('removeActivityData', Session.get('editing_event'), function(error, result) {
       if (error) {
         alert(error.reason);
       }
       Session.set('editing_event', null);
       Session.set('showEditEvent', false);
     });
   },
   'click .cancel': function(evt, tmpl) {
     close();
   }
 });
