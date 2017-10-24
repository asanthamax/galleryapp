/**
 * Created by asantha on 3/22/2017.
 */
angular.module('customerService',[])

.factory('Customer',function ($http) {

    var customerFactory = {};

    customerFactory.all_customers = function (token) {

        return $http.get('/api/all_customers',{headers: {'x-access-token' : token}});
    };

    customerFactory.add_customer = function(customerData,token){

        return $http.post('/api/save_customer', customerData,{headers: {'x-access-token' : token}});
    };

    customerFactory.edit_customer = function(customerData,token){

		console.log('x-access-token:'+token);
        return $http.post('/api/edit_customer', customerData,{headers: {'x-access-token' : token}});
    };

    customerFactory.find_customers = function (customerData,token) {

        return $http.post('/api/find_conditional_customers',customerData,{headers: {'x-access-token' : token}});
    };

    customerFactory.delete_customer = function (customerData,token) {

        return $http.post('/api/remove_customer', customerData,{headers: {'x-access-token' : token}})
    };

    customerFactory.get_customer = function(customerData,token){

        return $http.get('/api/find_customer',{headers: {'x-access-token' : token},params: customerData});
    }

    return customerFactory;
})

.factory('cussocketio',function($rootScope){

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
