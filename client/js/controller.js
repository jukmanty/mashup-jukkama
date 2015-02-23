var checkGasApp = angular.module('checkGasApp', ['nvd3ChartDirectives']);

checkGasApp.controller('BestGasPriceCtrl', function($scope, $http) {
  $http.get('api/best').success(function(data) {
    $scope.best = data;
  });
});

checkGasApp.controller('AvgCtrl', function($scope, $http){
	$scope.xAxisTickFormat = function(){
		return function(d){
			return d3.time.format('%x')(new Date(d));
		}
	};
	$http.get('api/avg').success(function(data) {
		var points = [];
		for (key in data) {                             
	         points.push([(new Date(key)).getTime(), data[key]]);
		}
		$scope.avg = [{
			"key": "Gasoline price changes",
            "values": points
		}];
    });
});
