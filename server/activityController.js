	Meteor.publish('Activity', function publishFunction(trip) {
		console.log(trip);
	  return ActivityList.find({trip: trip});
	});

	Meteor.methods({
    'insertActivityData': function(activity){
      // Sanitize the input
			console.log(activity.start);
			console.log(activity.title);
			if(!activity.createdBy)
			{
				throw new Meteor.Error(500, "please login", "Please login to use calendar");
			}
      if (activity.title && activity.start && activity.trip) {
        var saneActivity = {};
        saneActivity.title = activity.title;
        saneActivity.trip = activity.trip;
        saneActivity.start = activity.start;
        //current implementation uses only events on 1 day, without time. not gonna be bothered to make it anymore complicated at this point. hence "start = end"
        saneActivity.end = activity.start;
        // time is for labels only, calendar is implemented with days only!
        saneActivity.time = activity.time;
        // event type controls wether to show the item in all calendars or only 1.
        saneActivity.type = activity.type || "personal";
        saneActivity.forPerson = activity.forPerson;
        saneActivity.createdBy = activity.createdBy;
        saneActivity.createdAt = new Date();
				saneActivity.lat = activity.lat;
				saneActivity.lng = activity.lng;


        // Insert in mongoDB and return the id of the newly created calEvent
        return ActivityList.insert(saneActivity);
      } else {
        throw new Meteor.Error(500, "incorrect data", "The data you provided was incorrect");
      }
    },
    'updateActivityData': function(id, title, content){
		var currentUserId = Meteor.userId();
		return ActivityList.update({_id: id, createdBy: currentUserId}, {$set:{title:title, content:content}});
	},
	'updateActivityLocation': function(id, lat, lng){
		var currentUserId = Meteor.userId();
		return ActivityList.update({_id: id, createdBy: currentUserId}, {$set:{lat:lat, lng:lng}});
	},
	'updateActivityDate': function(id, start, end){
	var currentUserId = Meteor.userId();
	if(start)
	{
			return ActivityList.update({_id: id, createdBy: currentUserId}, {$set:{start:start, end:end}});
	}
	},
    'removeActivityData': function(selectedActivityId){
		var currentUserId = Meteor.userId();
		ActivityList.remove({_id: selectedActivityId, createdBy: currentUserId});
	}
});
