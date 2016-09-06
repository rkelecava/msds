var app = angular.module('msds', ['ui.router','ui.bootstrap','restangular','xeditable']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});