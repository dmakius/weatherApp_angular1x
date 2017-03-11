var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

weatherApp.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

//ROUTES
weatherApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'templates/main.html',
		controller: 'mainController'
	})
	.when('/forcast_f', {
		templateUrl: 'templates/forcast_f.html',
		controller: 'forcastController'
	})
	.when('/forcast_c', { 
		templateUrl: 'templates/forcast_c.html',
		controller: 'forcastController'
	})
	.otherwise({
        redirectTo: '/'
     });
});

//SERVICES
weatherApp.service('mainService', function(){
	this.city = "";
	this.mapKey = "";
});

//CONTROLLERS
weatherApp.controller("mainController",['$scope','$log','mainService', function($scope, $log, mainService){
	$scope.title = "Main";
	$scope.city = mainService.city;
	$scope.$watch('city', function(){
		mainService.city = $scope.city;
	});
}]);

weatherApp.controller("forcastController",['$scope', '$resource','mainService',function($scope ,$resource, mainService){
	$scope.title = "forcast";
	$scope.city = mainService.city;
	$scope.cnt = 7;
	$scope.forecast = [];
	$scope.map = mainService.mapKey;

	$scope.addMap =function(){
		 var map = document.getElementById("google_map");
		 console.log(map);
		 if($scope.map == ""){
		 	map.src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCVyMA5TUXJAmmklhlvK8kYv7n8FhNRPjE&q=" + mainService.city;
		 	$scope.map = map.src;
		 }else{
		 	map.src = $scope.map;
		 }
		
	}();
	
	$scope.weatherAppId = 'e1f50df08bce0b26b34b813be1c63de3';
	$scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily');
	$scope.weather = $scope.weatherAPI.get({appid:$scope.weatherAppId, q:$scope.city, mode:'json', cnt:7});


	$scope.$watch('weather', function(){
		$scope.forecast = $scope.weather
	});

	$scope.getWeatherImage = function(imageCode){
		if(imageCode >= 200 && imageCode <= 230){return "http://openweathermap.org/img/w/09d.png";}
		else if(imageCode >= 300 && imageCode <= 321){return "http://openweathermap.org/img/w/09d.png";}
		else if(imageCode >= 500 && imageCode <= 504){return "http://openweathermap.org/img/w/10d.png";}
		else if(imageCode == 511 ){return "http://openweathermap.org/img/w/13d.png";}
		else if(imageCode >= 520 && imageCode <= 531){return "http://openweathermap.org/img/w/09d.png";}
		else if(imageCode >= 600 && imageCode <= 631){return "http://openweathermap.org/img/w/13d.png";}
		else if(imageCode >= 700 && imageCode <= 781){return "http://openweathermap.org/img/w/50d.png";}
			//TO DO: Implement Logic for day/night images
		else if(imageCode == 800){return "http://openweathermap.org/img/w/01d.png";}
		else if(imageCode == 801){return "http://openweathermap.org/img/w/02d.png";}
		else if(imageCode == 802){return "http://openweathermap.org/img/w/03d.png";}
		else if(imageCode == 803){return "http://openweathermap.org/img/w/04d.png";}
		else if(imageCode == 804){return "http://openweathermap.org/img/w/04d.png";}
	}

	$scope.convertToFahrenheit = function(degK){
		return Math.round((1.8* (degK -273)) + 32);
	}
	
	$scope.convertToCelcius = function(degK){
		return Math.round((degK - 273));
	}

	$scope.convertDate = function(ts){
		return new Date(ts *1000)
	}
}]);