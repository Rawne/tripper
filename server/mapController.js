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
        Markers.insert({lat: lat, long:long, createdBy: currentUserId}, function(err, ins) {
          console.log(err);
          return ins;
        });
      } else {
        throw new Meteor.Error(500, "incorrect data", "The data you provided was incorrect");
      }
    },
    'updateMarkerPosition': function(id, lat, long){
		var currentUserId = Meteor.userId();
		return ActivityList.update({_id: id, createdBy: currentUserId}, {$set:{title:title}}, function(err, upd){
			return upd;
		});
	},
  });
