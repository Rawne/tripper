Meteor.subscribe('Trip');
Template.homepage.events({
  'click #start-button': function(event, tmpl) {
    console.log('start');
    var newTrip = {};
    newTrip.title = "new trip";
    newTrip.createdBy = Meteor.userId();
    newTrip.users = [Meteor.userId()];
    Meteor.call('insertTrip', newTrip, function(error, result) {
      if (error) {
        alert(error.reason);
      } else {
        Session.set('trip', result);
        Router.go('/trip/' + result);
      }
    });
  }
});

Template.homepage.helpers({
  noTrips: function() {
    if (TripList.find())
      return false;
    return true;
  },
  'trips': function() {
    return TripList.find();
  }
});

Template.homepage.events({
  'click .delete': function(evt, tmpl) {
    console.log(evt.target.parentElement.id);
    Meteor.call('deleteTrip', evt.target.parentElement.id, function(error, result) {
      if (error) {
        alert(error.reason);
      }
    });
  }
});
