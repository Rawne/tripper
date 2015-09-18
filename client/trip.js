Template.trip.rendered = function(){
  $('#trip-info.editable').editable({
  mode : 'inline',
  success: function(response, newValue) {
    Meteor.call('updateTripInfo', Session.get('trip'), newValue, function(error, result)
    {
      if (error) {
        alert(error.reason);
      }
    });
  }});
}


Template.trip.helpers({
  trip : function()
  {
    return TripList.findOne({_id:Session.get('trip')});
  }
});
