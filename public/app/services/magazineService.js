/**
 * Created by asantha on 3/26/2017.
 */
angular.module('magazineService',[])

.factory('Magazine',function($http){

    var magazineFactory = {};

    magazineFactory.all_magazines = function () {

        return $http.get('api/all_magazines');
    };

    magazineFactory.upload_magazine = function (magazineData) {


        return $http.post('api/upload_magazines', magazineData).then(function (result) {

            return result;
        });
    };

    magazineFactory.add_magazine = function (magazineData) {

        return $http.post('api/add_magazines', magazineData);
    };

    magazineFactory.update_upload_magazine = function(magazineData){

        return $http.post('api/update_magazines_upload',magazineData);
    };

    magazineFactory.edit_magazine = function(magazineData){

        return $http.post('api/update_magazine', magazineData);
    };

    magazineFactory.delete_magazine = function (magazineData) {

        return $http.post('api/delete_magazine', magazineData);
    };

    magazineFactory.get_magazine = function (magazineData) {

        console.log(magazineData);
        return $http.get('api/find_conditional_magazine', {params: magazineData});
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


