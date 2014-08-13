'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.controllers'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'templates/index.html', controller: 'index'});
    //$routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'login'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);