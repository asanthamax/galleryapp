angular.module('storyCtrl',['storyService'])

	.controller('StoryController',function(Story,socketio){
		
		var vm = this;
		
		Story.getStory()
			.then(function(data){
				
				vm.stories = data.data;
			})
		
		vm.createStory = function(){
			
			vm.message = '';
			Story.createStory(vm.storyData)
				.then(function(data){
					
					vm.storyData = '';
					vm.message = data.message;
					
				})
		}
		
		socketio.on('story',function(data){
			
			vm.stories.push(data);
		})
	})
	
	.controller('AllStoriesController',function(stories, socketio){
		
		var vm = this;
		vm.stories = stories.data;
		socketio.on('story',function(data){
			
			vm.stories.push(data);
		});
	})