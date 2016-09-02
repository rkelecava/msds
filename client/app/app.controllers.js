app.controller('indexCtrl', ['$scope', 'fileUpload', 'safetySheets', function ($scope, fileUpload, safetySheets) {
/* Alerts */
  $scope.alerts = [];
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
/* Alerts */

/* Download a file by _id */
	$scope.download = function (id) {
		safetySheets.one('download').customGET({"_id" : id});
	};
/* Download a file by _id */

/* Count safety sheets */
	$scope.results = function () {
		if (!$scope.safetySheets) { return false; }
		return $scope.safetySheets.length > 0;
	};
/* Count safety sheets */

/* Delete */
	$scope.delete = function (id, manufacturer, product) {
		safetySheets.one(id).customDELETE('', {}).then(function () {
			$scope.currentPage = 1;
			init();
			$scope.alerts.push({ type: 'success', msg: 'You have deleted the '+manufacturer+' '+product+' datasheet.'});
		});
	};
/* Delete */

/* Search */
	$scope.find = function () {
		$scope.currentPage = 1;
		safetySheets.one('searchByManufacturer').customGETLIST('', {"search" : $scope.search}, '').then(function (manResults) {
			if (manResults.length === 0) {
				safetySheets.one('searchByProduct').customGETLIST('', {"search" : $scope.search}, '').then(function (productResults) {
					if (productResults.length === 0) {
						safetySheets.one('searchByTradeName').customGETLIST('', {"search" : $scope.search}, '').then(function (tradeResults) {
							$scope.safetySheets = tradeResults;
						});
					} else {
						$scope.safetySheets = productResults;
					}
				});
			} else {
				$scope.safetySheets = manResults;
			}
		});
	};
/* Search */

/* Upload a file */
	$scope.safetySheet = {};

	$scope.uploadFile = function(){

        fileUpload.uploadFileToUrl($scope.myFile, $scope.safetySheet);
        $scope.myFile = {};
        $scope.safetySheet = {};
    };
/* Upload a file */

/* Pagination */
	$scope.itemsPerPage = 5;
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