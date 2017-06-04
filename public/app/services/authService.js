angular.module('authService', [])

.factory('Auth',function($http, $q, AuthToken){
	
	var authFactory = {}
	
	authFactory.login = function(username, password){
		
		return $http.post('api/login', {
			
			username: username,
			password: password
		})
		.then(function(response){
			
			AuthToken.setToken(response.data.token)
			return response.data;
		})
	}

	authFactory.logout = function(){
		
		AuthToken.setToken()
	}

	authFactory.isLoggedIn = function(){
		
		if(AuthToken.getToken()){
			
			return true;
		}else{
			
			return false;
		}
	}

	authFactory.getUser = function(){
		
		if(AuthToken.getToken()){
			
			return $http.get('api/me');
		}else{
			
			return $q.reject({message: 'user has no valid token'});
		}
	}

	return authFactory;	
})

.factory('AuthToken', function($window){
	
	authTokenFactory = {}
	authTokenFactory.getToken = function(){
		
		return $window.localStorage.getItem('token')
	}
	
	authTokenFactory.setToken = function(token){
		
		if(token){
			
			$window.localStorage.setItem('token', token)
		}else{
			$window.localStorage.removeItem('token')
		}
	}
	
	return authTokenFactory;
})

.factory('AuthInterceptor',function($q,$location,AuthToken){
	
	var interceptorFactory = {}
	
	interceptorFactory.request = function(config){
		
		var token = AuthToken.getToken()
		if(token){
			
			config.headers['x-access-token'] = token
		}
		return config
	}
	
	interceptorFactory.responseError = function(response){
		
		if(response.status == 403){
			
			$location.path('/login');
		}
		return $q.reject(response);
	}
	
	return interceptorFactory;
})