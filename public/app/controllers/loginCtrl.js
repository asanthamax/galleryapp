/**
 * Created by asantha on 6/2/2017.
 */
angular.module('loginCtrl',['userService'])

    .controller('LoginController',function($scope,$location,User) {

        var vm = this;

        vm.authenticate = function () {

            vm.requestData = {

                username: vm.formData.username,
                password: vm.formData.password
            };
            User.authenticate(vm.requestData).then(function (data) {

                console.log(data);
                if (data.data.success) {

                    localStorage.setItem("access_web_token",data.data.token);
                    $location.path('/dashboard');
                } else {

                    vm.message = data.data.message;
                }

           });
        }

       // $location.path('/dashboard');
    });