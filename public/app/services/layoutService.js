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
  
  layoutFactory.edit_layout = function(layoutData, token){

     return $http.post('/api/edit_layout',layoutData,{headers: {'x-access-token' : token}});
  };

  layoutFactory.deleteLayoutImage = function(image, token){

      return $http.get('/api/delete_layout_photo',{headers: {'x-access-token': token},params: image});
  };

  layoutFactory.delete_layout = function(layout_id,token){

      return $http.get('/api/delete_layout',{headers: {'x-access-token': token},params: layout_id});
  }

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
