angular.module('userService',[])

.factory('User', function($http){
	
	var userFactory = {}
	
	userFactory.create = function(userData){
		
		return $http.post('api/signup', userData)
	}
	
	userFactory.all = function(token){
		
		return $http.get('api/findusers',{headers: {'x-access-token' : token}});
	}

	userFactory.authenticate = function (data) {

		return $http.post('api/login',"",{headers:{'username': data.username,'password': data.password}});
    }
	
	return userFactory;
})