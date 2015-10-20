Meteor.publish('Trip', function tripFunction(anonymousId){
		var currentUserId = this.userId;
		if(currentUserId == null && anonymousId != null)
		{
			currentUserId = anonymousId;
		}
		return TripList.find({users: currentUserId})
	});

  	Meteor.methods({
      'insertTrip': function(trip){
        // Sanitize the input
  			console.log(trip.users);
  			console.log(trip.title);
  			if(!trip.createdBy)
  			{
  				throw new Meteor.Error(500, "please login", "Please login to use calendar");
  			}
        if (trip.users && trip.title) {
          var saneTrip = {};
          saneTrip.title = trip.title;
          saneTrip.users = trip.users;
          saneTrip.createdBy = trip.createdBy;

          // Insert in mongoDB and return the id of the newly created calEvent
          return TripList.insert(saneTrip);
        } else {
          throw new Meteor.Error(500, "incorrect data", "The data you provided was incorrect");
        }
      },
      'updateTripInfo':function(id, userId, info){
  		return TripList.update({_id: id, createdBy: userId}, {$set:{info:info}});
  	},
		'updateTripLocation':function(id, userId, lat, lng, zoom){
			console.log(lat + lng);
		return TripList.update({_id: id, createdBy: userId}, {$set:{lat:lat, lng:lng, zoom:zoom}});
	},
		'convertUserIds':function(oldId, newId){
			var result = TripList.update({createdBy: oldId}, {$set:{createdBy:newId, users:[newId]}})
			if(result)
			{
				result = ActivityList.update({createdBy: oldId}, {$set:{createdBy:newId}});
			}
			return result;
		},
      'deleteTrip': function(tripId, userId){
  		TripList.remove({_id: tripId, createdBy: userId});
  	}
    });
