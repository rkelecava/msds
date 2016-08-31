app.controller('indexCtrl', ['$scope', 'fileUpload', function ($scope, fileUpload) {
	$scope.safetySheet = {};

	$scope.uploadFile = function(){

        fileUpload.uploadFileToUrl($scope.myFile, $scope.safetySheet);
        $scope.myFile = {};
        $scope.safetySheet = {};
    };
}]);