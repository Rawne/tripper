 Session.setDefault('showEditEvent', false);
 Session.setDefault('editing_event', null);
 Template.calendar.showEditEvent = function(){
   return Session.get('showEditEvent');
 }

 Template.editEvent.helpers({
   'evt':function()
   {
     return ActivityList.findOne({_id:Session.get('editing_event')});
   },
   'markerPlaced':function()
     {
       var activity = ActivityList.findOne({_id:Session.get('editing_event')});
       if(activity && activity.lat && activity.lng)
       {
           return true;
       }
       return false;
     }
 });

function confirm(tmpl)
{
  Meteor.call('updateActivityData', Session.get('editing_event'), tmpl.find('#title').value, tmpl.find('#content').value, function(error, result) {
    if (error) {
      alert(error.reason);
    }
    Session.set('editing_event', null);
    Session.set('showEditEvent', false);
  });
}

 Template.editEvent.events({
   'click .center':function(event, tmpl){
      var activity = ActivityList.findOne({_id:Session.get('editing_event')});
      GoogleMaps.maps.map.instance.panTo(new google.maps.LatLng(activity.lat, activity.lng));
      return false;
   },
   'keypress input': function(event, tmpl) {
    if (event.keyCode == 13) {
        confirm(tmpl);
        event.stopPropagation();
        return false;
    }
    else if(event.keyCode == 27)
    {
        Session.set('editing_event', null);
        Session.set('showEditEvent', false);
        event.stopPropagation();
        return false;
    }
  },
   'mouseover #draggable' : function() {
     $("#draggable").draggable({revert: "invalid"});
   },
   'mouseover .modal-event' : function(){
     $( ".modal-event" ).draggable({ containment: "#calendar-container", scroll: false });
   },
   'click .save':function(evt, tmpl){
     confirm(tmpl);
   },
     'click .delete':function(evt, tmpl){
       Meteor.call('removeActivityData', Session.get('editing_event'), tmpl.find('#title').value, function(error, result) {
         if (error) {
           alert(error.reason);
         }
         Session.set('editing_event', null);
         Session.set('showEditEvent', false);
       });
   },
     'click .cancel':function(evt, tmpl){
         Session.set('editing_event', null);
         Session.set('showEditEvent', false);
   }
 });
