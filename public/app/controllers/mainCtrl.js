angular.module('mainCtrl',[])

.controller('MainController',function($rootScope,$location,Magazine,Customer, magsocketio, cussocketio){

    var vm = this;
    var token = localStorage.getItem("access_web_token").toString();
    Magazine.all_magazines(token)
        .then(function (data) {

            vm.magazines = data.data;
            console.log(data);
        });

    Customer.all_customers(token)
        .then(function (data) {

            vm.customers = data.data;
        });

    magsocketio.on('magazine',function (data) {

        vm.magazines.push(data);
    })

    cussocketio.on('customer',function (data) {

        vm.customers.push(data);
        vm.dropdown_data.push(data);
        console.log('customer added...')
    })

    $location.path('/dashboard');
});