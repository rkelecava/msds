app.factory('fileUpload', ['$http', function ($http) {
	var o = {};

	o.uploadFileToUrl = function (file, safetySheet) {
		var fd = new FormData();
		fd.append('safetySheet', file);
		fd.append('manufacturer', safetySheet.manufacturer);
		fd.append('product', safetySheet.product);
		fd.append('tradeName', safetySheet.tradeName);
		$http.post('/api/safetySheets', fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(function () {
			//do something
		}).error(function () {
			//do something
		});
	};

	return o;
}]);
