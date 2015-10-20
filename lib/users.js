getUserId = function()
{
   if(Meteor.userId())
   {
      return Meteor.userId();
   }
   else
   {
      return Session.get('anonoymous_id');
   }
}
hasEditRights =  function(){
  var trip = TripList.findOne({
    _id: Session.get('trip')
  });
  if(trip)
  {
    return trip.users.indexOf(getUserId()) > -1;
  }
  return false;
}
