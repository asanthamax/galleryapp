angular.module('appRoute',['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

        .when('/',{

            templateUrl: 'app/views/pages/login.html'
        })
		.when('/dashboard', {
			
			templateUrl: 'app/views/pages/dashboard.html',
			controller: 'MainController',
			controllerAs: 'main',
            resolve:{

                magazines:function (Magazine) {

                    return Magazine.all_magazines(localStorage.getItem("access_web_token").toString());
                },
                customers:function(Customer){

                    return Customer.all_customers(localStorage.getItem("access_web_token").toString());
                }
            }
		})
		.when('/magazines',{
			
			templateUrl: 'app/views/pages/magazines.html',
			controller: 'MagazineController',
			controllerAs: 'magazine',
			resolve:{

				magazines:function (Magazine) {

					return Magazine.all_magazines(localStorage.getItem("access_web_token").toString());
                }
			}
		})
		.when('/orders',{
			
			templateUrl: 'app/views/pages/orders.html'
		})
		.when('/customers',{

			templateUrl: 'app/views/pages/customers.html',
			controller: 'CustomerController',
            controllerAs: 'customer',
            resolve:{

			    customers:function(Customer){

			        return Customer.all_customers(localStorage.getItem("access_web_token").toString());
                }
            }
		})
		.when('/layouts',{

			templateUrl: 'app/views/pages/layouts.html'
		})
		.when('/add_layout',{

			templateUrl: 'app/views/pages/editlayout.html'
		})
		.when('/edit_layout/:id/:status',{

			templateUrl: 'app/views/pages/modifylayout.html'
		})
		.when('/remove_layout/:id/:status',{

			templateUrl: 'app/views/pages/deletelayout.html'
		})
        .when('/add_customer',{

            templateUrl: 'app/views/pages/editcustomer.html'
        })
		.when('/edit_customer/:id/:status',{

			templateUrl: 'app/views/pages/modifycustomer.html'
		})
        .when('/remove_customer/:id/:status',{

            templateUrl: 'app/views/pages/modifycustomer.html'
        })
        .when('/view_customer/:id/:status',{

            templateUrl: 'app/views/pages/modifycustomer.html'
        })
        .when('/edit_magazine/:id/:status',{

            templateUrl: 'app/views/pages/modifymagazine.html'
        })
        .when('/remove_magazine/:id/:status',{

            templateUrl: 'app/views/pages/modifymagazine.html'
        })
        .when('/view_magazine/:id/:status',{

            templateUrl: 'app/views/pages/modifymagazine.html'
        })
        .when('/add_order',{

            templateUrl: 'app/views/pages/editorders.html'
        })
        .when('/add_magazines',{

            templateUrl: 'app/views/pages/editmagazines.html'
        })
        .when('/add_layouts',{

            templateUrl: 'app/views/pages/editlayouts.html'
        })
        .when('/submit_customer',{

            controller: 'CustomerController'
        })
		.when('/allStories',{
			
			templateUrl: 'app/views/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
			resolve:{
				
				stories: function(Story){
					
					return Story.allStories();
				}
			}
		})
	$locationProvider.html5Mode(true);	
})