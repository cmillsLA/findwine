'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.controllers'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'templates/index.html', controller: 'index'});
    $routeProvider.when('/cabernet-sauvignon/', {templateUrl: 'templates/cabernet.html', controller: 'cabernet'});
    $routeProvider.when('/pinot-noir/', {templateUrl: 'templates/pinot.html', controller: 'pinot'});
    $routeProvider.when('/chardonnay/', {templateUrl: 'templates/chardonnay.html', controller: 'chardonnay'});
    $routeProvider.when('/syrah/', {templateUrl: 'templates/syrah.html', controller: 'syrah'});
    $routeProvider.when('/sauvignon-blanc/', {templateUrl: 'templates/sauvignon.html', controller: 'sauvignon'});
    $routeProvider.when('/privacy-policy/', {templateUrl: 'templates/privacy.html', controller: 'privacy'});
    $routeProvider.when('/terms-conditions/', {templateUrl: 'templates/terms.html', controller: 'terms'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);