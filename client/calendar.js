Template.calendar.rendered = function() {
  var calendar = $('#calendar').fullCalendar({
    height: 650,
    select: function(start, end) {
      if (Session.get('showEditEvent')) {
        Session.set('showEditEvent', false);
        Session.set('editing_event', null);
      } else if (hasEditRights()) {
        var newActivity = {};
        newActivity.start = start.toDate();
        newActivity.end = end.toDate();
        newActivity.title = "new event";
        newActivity.trip = Session.get('trip');
        newActivity.createdBy = getUserId();
        Meteor.call('insertActivityData', newActivity, function(error, result) {
          if (error) {
            alert(error.reason);
          } else {
            console.log(result);
            Session.set('editing_event', result);
            Session.set('showEditEvent', true);
          }
        });
      }
      $('#calendar').fullCalendar('unselect');
    },
    selectable: true,
    selectHelper: true,
    allDayDefault: true,
    eventDrop: function(calEvent) {
      var startDate = calEvent.start ? calEvent.start.toDate() : null;
      var endDate = calEvent.end ? calEvent.end.toDate() : null;
      Meteor.call('updateActivityDate', calEvent.id, getUserId(), startDate,
        endDate,
        function(error, result) {
          if (error) {
            alert(error.reason);
          }
        });
    },
    eventClick: function(calEvent, jsEvent, view) {
      var activity = ActivityList.findOne({
        _id: calEvent.id
      });
      $('#draggable').css("left", 500);
      $('#draggable').css("top", 100);

      Session.set('editing_event', calEvent.id);
      Session.set('showEditEvent', true);
    },
    events: function(start, end, timezone, callback) {
      var events = [];
      var activities = ActivityList.find().fetch();

      activities.forEach(function(evt) {
        var color = 'blue';

        var event = {
          id: evt._id,
          title: evt.title,
          start: $.fullCalendar.moment(evt.start),
          end: evt.end
        };
        if (evt._id === Session.get('editing_event')) {
          event.color = '#378006';
        }
        events.push(event);
      })
      callback(events);
    },
    editable: true
  }).data().fullCalendar;

  Tracker.autorun(function() {
    Meteor.subscribe('Activity', Session.get('trip'));
  });
  Tracker.autorun(function() {
    allReqsCursor = ActivityList.find().fetch();
    console.log("Autorun -> ", allReqsCursor.length)
    if (calendar)
      calendar.refetchEvents();
  });

  Tracker.autorun(function() {
    var eventId = Session.get('editing_event');
    if (calendar)
      calendar.refetchEvents();
  });
};
Template.calendar.helpers({
  editing_event: function() {
    return Session.get('editing_event');
  },
  showEditEvent: function() {
    return Session.get('showEditEvent');
  }
});
