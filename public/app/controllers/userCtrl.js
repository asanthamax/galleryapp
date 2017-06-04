angular.module('userCtrl', [])

.controller('UserController', function(User){
	
	var vm = this;
	
	User.all()
		.then(function(data){
				
			vm.users = data;		
		})
})

.controller('UserCreateController', function(User, $location, $window){
	
	var vm = this;
	
	vm.signUpuser = function(){
		
		vm.message = '';
		User.create(vm.userData)
			.then(function(response){
				
				vm.userData = {}
			    vm.message = response.data.message;
				console.log(response.data)
				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
			})
	} 
})