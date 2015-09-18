Meteor.subscribe('Trip');
 Template.menu.helpers({
   'currentRouteIs':function(route, id)
     {
       var routeName;
       if(Router.current() === null)
       {
         routeName = 'home';
       }
       else {
         routeName = Router.current().route.getName();
         if(routeName === undefined)
          routeName = 'home';
          if(route == 'trip')
          {
            if(id != Session.get('trip'))
            {
                return false;
            }
          }
       }
       return routeName === route;
     },
     'trips':function()
       {
         return TripList.find();
       }
 });
