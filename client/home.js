

Template.homepage.events({
  'click #start-button': function(event, tmpl) {
    var newTrip = {};
    newTrip.title = "new trip";
    newTrip.createdBy = getUserId();
    newTrip.users = [getUserId()];
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
  anyTrips: function() {
    if (TripList.find({createdBy:getUserId()}).fetch().length > 0)
      return true;
    return false;
  },
  anySharedTrips: function() {
    if (TripList.find({users:getUserId(), createdBy:{ $not:getUserId()}}).fetch().length > 0)
      return true;
    return false;
  },
  'trips': function() {
    return TripList.find({createdBy:getUserId()});
  },
  'sharedTrips': function() {
    return TripList.find({users:getUserId(), createdBy:{ $not:getUserId()}});
  }
});

Template.homepage.events({
  'click .delete': function(evt, tmpl) {
    Meteor.call('deleteTrip', evt.target.parentElement.id, getUserId(), function(error, result) {
      if (error) {
        alert(error.reason);
      }
    });
  }
});
