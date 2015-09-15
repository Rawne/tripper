Meteor.publish('Activity', function(){
		var currentUserId = this.userId;
		return ActivityList.find({createdBy: currentUserId})
	});

	Meteor.methods({
    'insertActivityData': function(activity){
      // Sanitize the input
			console.log(activity.start);
			console.log(activity.title);
      if (activity.createdBy && activity.title && activity.start) {
        var saneActivity = {};
        saneActivity.title = activity.title;
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
        ActivityList.insert(saneActivity, function(err, ins) {
          return ins;
        });
      } else {
        throw new Meteor.Error(500, "incorrect data", "The data you provided was incorrect");
      }
    },
    'updateActivityTitle': function(id, title){
		var currentUserId = Meteor.userId();
		return ActivityList.update({_id: id, createdBy: currentUserId}, {$set:{title:title}}, function(err, upd){
			return upd;
		});
	},
	'updateActivityLocation': function(id, lat, lng){
	var currentUserId = Meteor.userId();
	return ActivityList.update({_id: id, createdBy: currentUserId}, {$set:{lat:lat, lng:lng}}, function(err, upd){
		return upd;
	});
	},
	'updateActivityDate': function(id, start, end){
	var currentUserId = Meteor.userId();
	if(start)
	{
		return ActivityList.update({_id: id, createdBy: currentUserId}, {$set:{start:start, end:end}}, function(err, upd){
			return upd;
		});
	}
	},
    'removeActivityData': function(selectedActivityId){
		var currentUserId = Meteor.userId();
		ActivityList.remove({_id: selectedActivityId, createdBy: currentUserId});
	}
});
