app.controller('indexCtrl', ['$scope', '$q', 'safetySheets', function ($scope, $q, safetySheets) {
/* Variable to control display of add form */
	$scope.addForm = 0;
	$scope.updateForm = 0;
/* Variable to control display of add form */
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

/* Show update form */
	$scope.showUpdateForm = function (safetySheet) {
		$scope.updateForm = !$scope.updateForm;
		$scope.update = {
			_id: safetySheet._id,
			manufacturer: safetySheet.manufacturer,
			product: safetySheet.product,
			tradeName: safetySheet.tradeName
		};
	};
/* Show update form */
/* Update manufacturer */
	$scope.updateManufacturer = function (safetySheet) {
		var data = {
			manufacturer: safetySheet.manufacturer
		};
		safetySheets.one('updateDatasheet').customPUT(data, '', {"_id" : safetySheet._id});
	};
/* Update manufacturer */
/* Update product */
	$scope.updateProduct = function (safetySheet) {
		var data = {
			product: safetySheet.product
		};
		safetySheets.one('updateDatasheet').customPUT(data, '', {"_id" : safetySheet._id});
	};
/* Update product */
/* Update trade name */
	$scope.updateTradeName = function (safetySheet) {
		var data = {
			tradeName: safetySheet.tradeName
		};
		safetySheets.one('updateDatasheet').customPUT(data, '', {"_id" : safetySheet._id});
	};
/* Update trade name */
/* Update file */
	$scope.updateFile = function (safetySheet) {
		var fd = new FormData();
		fd.append('safetySheet', $scope.myFile);
		safetySheets.one(safetySheet._id).customPUT(fd, '', {transformRequest: angular.identity}, {'Content-Type': undefined}).then(function () {
			$scope.alerts.push({ type: 'success', msg: 'You have updated the '+safetySheet.manufacturer+' '+safetySheet.product+' datasheet.'});
	        angular.element(document.getElementById('file')).val(null);
	        $scope.update = {};
	        $scope.updateForm = !$scope.updateForm;
		});
	};
/* Update file */

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
	$scope.uploadFile = function() {

		var fd = new FormData();
		fd.append('safetySheet', $scope.myFile);
		fd.append('manufacturer', $scope.add.manufacturer);
		fd.append('product', $scope.add.product);
		fd.append('tradeName', $scope.add.tradeName);

		safetySheets.one().customPOST(fd, "", {transformRequest: angular.identity}, {'Content-Type': undefined}).then(function () {
			$scope.currentPage = 1;
			init();
			$scope.alerts.push({ type: 'success', msg: 'You have added the '+$scope.add.manufacturer+' '+$scope.add.product+' datasheet.'});
	        angular.element(document.getElementById('file')).val(null);
	        $scope.add = {};
	        $scope.addForm = !$scope.addForm;
		});

    };
/* Upload a file */

/* Pagination */
	$scope.itemsPerPage = 5;
  	$scope.currentPage = 1;
  	$scope.paginate = function () {
  		var skip = (($scope.currentPage*$scope.itemsPerPage)-$scope.itemsPerPage);
		safetySheets.getList({"limit" : $scope.itemsPerPage, "skip" : skip, "sort" : "manufacturer"}).then(function (safetySheets) {
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
		safetySheets.getList({"limit" : $scope.itemsPerPage, "skip" : "0", "sort" : "manufacturer"}).then(function (safetySheets) {
			$scope.safetySheets = safetySheets;
		});
		safetySheets.one('count').customGET().then(function (count) {
			$scope.totalItems = count;
		});
	};
	init();
// Initialize

}]);