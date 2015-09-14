Meteor.subscribe('Activity');
Session.setDefault('showEditEvent', false);
Session.setDefault('editing_event', null);
Template.calendar.showEditEvent = function(){
  return Session.get('showEditEvent');
}

Template.editEvent.helpers({
'evt':function()
  {
    return ActivityList.findOne({_id:Session.get('editing_event')});
  }
});
Template.editEvent.events({
  'click .save':function(evt, tmpl){
    Meteor.call('updateActivityTitle', Session.get('editing_event'), tmpl.find('#title').value, function(error, result) {
      if (error) {
        alert(error.reason);
      }
      Session.set('editing_event', null);
      Session.set('showEditEvent', false);
    });
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



Template.calendar.rendered = function(){
  var calendar = $('#calendar').fullCalendar(
    {
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
        Session.set('editing_event', calEvent.id);
        Session.set('showEditEvent', true);
    },
    events: function(start, end, timezone, callback) {
      var events = [];
      var activities = ActivityList.find().fetch();
      activities.forEach(function(evt){
        events.push({
          id:evt._id,
          title:evt.title,
          start:$.fullCalendar.moment(evt.start),
          end:evt.end
        })
      })
      callback(events);
    },
    editable:true
  }).data().fullCalendar;

  Deps.autorun(function(){
    allReqsCursor = ActivityList.find().fetch();
    console.log("Autorun -> ", allReqsCursor.length)
    if(calendar)
        calendar.refetchEvents();
  })
};
Template.calendar.editing_event = function(){
  return Session.get('editing_event')
}
