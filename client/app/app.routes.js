app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('index');
		$stateProvider
			.state('index', {
				url: '/index',
				templateUrl: '/partials/_index.html',
				controller: 'indexCtrl'
				/*resolve: {
					safetySheetPromise: ['safetySheets', function (safetySheets) {
						return safetySheets.get();
					}]
				},*/
			});
	}
]);