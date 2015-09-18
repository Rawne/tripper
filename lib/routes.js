Router.route('/',{template:'homepage'});
Router.route('/calendar',{template:'calendar'});
Router.route('/trip/:_id', function(){
  var params = this.params;
  var id = params._id;
  Session.set('trip', id);
  console.log('router:', Session.get('trip'));
  this.render('calendar');
}, {name: 'trip'});
