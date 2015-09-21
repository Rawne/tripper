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
