
 Template.homepage.events({
   'click #start-button':function(event, tmpl){
     console.log('start');
     var newTrip = {};
     newTrip.title = "new trip";
     newTrip.createdBy = Meteor.userId();
     newTrip.users = [Meteor.userId()];
     Meteor.call('insertTrip', newTrip, function(error, result) {
       if (error) {
         alert(error.reason);
       }
       else {
         console.log(result);
         Session.set('trip', result);
       }
     });
   }
 });
