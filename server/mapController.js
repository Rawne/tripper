Meteor.publish('Markers', function(){
		var currentUserId = this.userId;
		return Markers.find({createdBy: currentUserId});
	});

  Meteor.methods({
    'insertMarker': function(lat, long){
      var currentUserId = Meteor.userId();
      console.log(currentUserId);
      console.log(this.userId);
      if (lat && long) {
        Markers.insert({lat: lat, lng:long, createdBy: currentUserId}, function(err, ins) {
          if(err)
          {
              console.log(err);
              throw new Meteor.Error(500, err.reason, "An unexpected error occured");
          }
          return ins;
        });
      } else {
        throw new Meteor.Error(500, "incorrect data", "The data you provided was incorrect");
      }
    },
    'updateMarkerPosition': function(id, lat, long){
  		var currentUserId = Meteor.userId();
  		Markers.update({_id: id, createdBy: currentUserId}, {$set:{lat:lat, lng: long}}, function(err, upd){
      if(err)
      {
          console.log(err);
          throw new Meteor.Error(500, err.reason, "An unexpected error occured");
      }
      return upd;
		});
	},
  });
