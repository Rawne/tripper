	Meteor.publish('Activity', function publishFunction(trip) {
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
        saneActivity.end = activity.end;
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
    'updateActivityTitle': function(id, userId, title){
			console.log(userId);
		return ActivityList.update({_id: id, createdBy: userId}, {$set:{title:title}});
	},
	'updateActivityContent': function(id, userId, content){
	return ActivityList.update({_id: id, createdBy: userId}, {$set:{content:content}});
},
	'updateActivityLocation': function(id, userId, lat, lng){
		return ActivityList.update({_id: id, createdBy: userId}, {$set:{lat:lat, lng:lng}});
	},
	'updateActivityDate': function(id, userId, start, end){
	if(start)
	{
			return ActivityList.update({_id: id, createdBy: userId}, {$set:{start:start, end:end}});
	}
	},
    'removeActivityData': function(selectedActivityId, userId){
		ActivityList.remove({_id: selectedActivityId, createdBy: userId});
	},
    'addImageToActivity': function(id, userId, imageLink){
			console.log(imageLink);
			if(imageLink)
			{
				return ActivityList.update({_id: id, createdBy: userId}, {$push:{images:imageLink}});
		}
	}
});
