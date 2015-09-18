Meteor.publish('Trip', function(){
		var currentUserId = this.userId;
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
      }
    });
