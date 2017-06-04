angular.module('layoutService',[])

.factory('Layout',function($http){

  var layoutFactory = {};

  layoutFactory.add_layout = function(layoutData,token){

    return $http.post('/api/save_layout',layoutData,{headers: {'x-access-token' : token}});
  };

  layoutFactory.get_layouts = function(token){

    return $http.get('/api/all_layouts',{headers: {'x-access-token' : token}});
  };

  layoutFactory.get_layout = function(layoutData,token){

    return $http.get('/api/layout_find',{headers: {'x-access-token' : token},params: layoutData});
  };

  return layoutFactory;
})

.factory('laysocketio',function($rootScope){

   var socket = io.connect();
   return{

       on:function (eventName, callback) {

           socket.on(eventName,function () {

               var args = arguments;
               $rootScope.$apply(function () {

                   callback.apply(socket, args);
               })
           })
       },

       emit:function (eventName,data, callback) {


           socket.emit(eventName, data, function () {

               var args = arguments;
               $rootScope.apply(function () {

                   if (callback) {

                       callback.apply(socket, args);
                   }
               })
           })
       }
   }
});
