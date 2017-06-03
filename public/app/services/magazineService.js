/**
 * Created by asantha on 3/26/2017.
 */
angular.module('magazineService',[])

.factory('Magazine',function($http){

    var magazineFactory = {};

    magazineFactory.all_magazines = function (token) {

        return $http.get('api/all_magazines',{headers: {'x-access-token' : token}});
    };

    magazineFactory.upload_magazine = function (magazineData,token) {


        return $http.post('api/upload_magazines', magazineData,{headers: {'x-access-token' : token}}).then(function (result) {

            return result;
        });
    };

    magazineFactory.add_magazine = function (magazineData,token) {

        return $http.post('api/add_magazines', magazineData,{headers: {'x-access-token' : token}});
    };

    magazineFactory.update_upload_magazine = function(magazineData,token){

        return $http.post('api/update_magazines_upload',magazineData,{headers: {'x-access-token' : token}});
    };

    magazineFactory.edit_magazine = function(magazineData,token){

        return $http.post('api/update_magazine', magazineData,{headers: {'x-access-token' : token}});
    };

    magazineFactory.delete_magazine = function (magazineData,token) {

        return $http.post('api/delete_magazine', magazineData,{headers: {'x-access-token' : token}});
    };

    magazineFactory.get_magazine = function (magazineData,token) {

        console.log(magazineData);
        return $http.get('api/find_conditional_magazine', {headers: {'x-access-token' : token},params: magazineData});
    };

    return magazineFactory;
})

.factory('magsocketio',function ($rootScope) {

    var socket = io.connect();
    return{

        on: function (eventName, callback) {

            socket.on(eventName,function () {

                var args = arguments;
                $rootScope.$apply(function () {

                    callback.apply(socket, args);
                })
            })
        },

        emit: function (eventName, data, callback) {

            socket.emit(eventName, data, function () {

                var args = arguments;
                $rootScope.apply(function () {

                    if(callback){

                        callback.apply(socket, args);
                    }
                })
            })
        }
    }
});


