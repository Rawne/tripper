Template.menu.onCreated(function() {
  if(!Meteor.userId() && !Session.get('anonoymous_id'))
  {
      Session.set('anonoymous_id', Random.id());
  }
  Meteor.subscribe('Trip', getUserId());
});

Accounts.onLogin(function(){
  console.log('Convert any trips to correct userId');
  Meteor.call('convertUserIds', Session.get('anonoymous_id'), Meteor.userId(), function(error, result) {
    if (error) {
      alert(error.reason);
    }
    Session.set('editing_event', null);
    Session.set('showEditEvent', false);
  });
});

Template.menu.helpers({
  'currentRouteIs': function(route, id) {
    var routeName;
    if (Router.current() === null) {
      routeName = 'home';
    } else {
      routeName = Router.current().route.getName();
      if (routeName === undefined)
        routeName = 'home';
      if (route == 'trip') {
        if (id != Session.get('trip')) {
          return false;
        }
      }
    }
    return routeName === route;
  },
  'trips': function() {
    return TripList.find();
  }
});
