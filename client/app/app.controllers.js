app.controller('indexCtrl', ['$scope', 'fileUpload', 'safetySheets', function ($scope, fileUpload, safetySheets) {
// Download a file by _id
	$scope.download = function (id) {
		safetySheets.one('download').customGET({"_id" : id});
	};
// Download a file by _id

	$scope.safetySheet = {};

	$scope.uploadFile = function(){

        fileUpload.uploadFileToUrl($scope.myFile, $scope.safetySheet);
        $scope.myFile = {};
        $scope.safetySheet = {};
    };

/* Pagination */
	$scope.itemsPerPage = 10;
  	$scope.currentPage = 1;
  	$scope.paginate = function () {
  		var skip = (($scope.currentPage*$scope.itemsPerPage)-$scope.itemsPerPage);
		safetySheets.getList({"limit" : $scope.itemsPerPage, "skip" : skip}).then(function (safetySheets) {
			$scope.safetySheets = safetySheets;
		});
  	};
  	$scope.setPage = function (pageNo) {
    	$scope.currentPage = pageNo;
  	};
  	$scope.pageChanged = function() {
    	$log.log('Page changed to: ' + $scope.currentPage);
  	};
  	$scope.maxSize = 5;
/* Pagination */

// Initialize
	var init = function () {
		safetySheets.getList({"limit" : $scope.itemsPerPage, "skip" : "0"}).then(function (safetySheets) {
			$scope.safetySheets = safetySheets;
		});
		safetySheets.one('count').customGET().then(function (count) {
			$scope.totalItems = count;
		});
	};
	init();
// Initialize

}]);