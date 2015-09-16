Meteor.subscribe('Activity');

Template.calendar.rendered = function(){
  var calendar = $('#calendar').fullCalendar(
    {
      height: 750,
    dayClick:function(moment, allDay, jsEvent, view){
      var newActivity = {};
      newActivity.start = moment.toDate();
      newActivity.title = "new event";
      newActivity.createdBy = Meteor.userId();
      //newActivity.forPerson = Iron.Location.get().path.substring(22);
      console.log(moment);
      Meteor.call('insertActivityData', newActivity, function(error, result) {
        if (error) {
          alert(error.reason);
        }
        else {
          console.log(result);
          Session.set('editing_event', result);
          Session.set('showEditEvent', true);
        }
      });
    },
    eventDrop:function(calEvent)
    {
      var startDate = calEvent.start ? calEvent.start.toDate(): null;
      var endDate = calEvent.end ? calEvent.end.toDate(): null;
      Meteor.call('updateActivityDate', calEvent.id, startDate,
                    endDate, function(error, result)
      {
        if (error) {
          alert(error.reason);
        }
      });
    },
    eventClick:function(calEvent, jsEvent, view){
        var activity = ActivityList.findOne({_id:calEvent.id});
        $('#draggable').css("left", 500);
        $('#draggable').css("top", 100);

        Session.set('editing_event', calEvent.id);
        Session.set('showEditEvent', true);
    },
    events: function(start, end, timezone, callback) {
      var events = [];
      var activities = ActivityList.find().fetch();

      activities.forEach(function(evt){
        var color = 'blue';

        var event = {
          id:evt._id,
          title:evt.title,
          start:$.fullCalendar.moment(evt.start),
          end:evt.end
        };
        if(evt._id === Session.get('editing_event'))
        {
          event.color = '#378006';
        }
        events.push(event);
      })
      callback(events);
    },
    editable:true
  }).data().fullCalendar;

  Tracker.autorun(function(){
    allReqsCursor = ActivityList.find().fetch();
    console.log("Autorun -> ", allReqsCursor.length)
    if(calendar)
        calendar.refetchEvents();
  });

  Tracker.autorun(function () {
    console.log('changed2');
    var eventId = Session.get('editing_event');
    if(calendar)
        calendar.refetchEvents();
  });
};
Template.calendar.editing_event = function(){
  return Session.get('editing_event')
}
