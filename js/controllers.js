'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('global', [ '$rootScope', '$scope', '$http', '$compile', function( $rootScope, $scope, $http, $compile) {

    $scope.filter = function() {
      var typesArr = [];
      var regionsArr = [];
      var minPrice = $('.range-min').val();
      var maxPrice = $('.range-max').val();
      // Get checked filters.
      if($('.wine-type input[type=checkbox]:checked').length > 0) {
        $('.wine-type input[type=checkbox]').each(function() {
          if($(this).prop('checked')) {
            typesArr.push($(this).data('name'));
          }
        });
      } else {
        $('.wine-type input[type=checkbox]').each(function() {
          typesArr.push($(this).data('name'));
        });
      }
      if($('.regions input[type=checkbox]:checked').length > 0) {
        $('.regions input[type=checkbox]').each(function() {
          if($(this).prop('checked')) {
            regionsArr.push($(this).data('name'));
          }
        });
      } else {
        $('.regions input[type=checkbox]').each(function() {
          regionsArr.push($(this).data('name'));
        });
      }
      // Load results from local storage.
      var results = localStorage.getItem('wines');
      results = JSON.parse(results);
      $('.results-content').html('');
      angular.forEach(results, function(result, key) {
        // Result must be selected type of wine, appelation and min/max price.
        if(typesArr.indexOf(result.Varietal.Name) > -1 && regionsArr.indexOf(result.Appellation.Name) > -1 && result.PriceMax > minPrice && result.PriceMax < maxPrice) {
          var wine = '<div class="result" data-id="' + result.Id + '">';
          wine += '<div class="result-label"><a href=' + result.Url + '><img src="' + result.Labels[0].Url + '" alt="" border="0" /></a></div>';
          wine += '<p class="result-name"><a href=' + result.Url + '>' + result.Name + '</a></p>';
          wine += '<p class="result-price">$' + result.PriceMax.toFixed(2) + '*</p>';
          wine += '<a href=' + result.Url + ' class="btn btn-default">View</a>';
          $('.results-content').append(wine);
        }
      });
    };

    $scope.buildFilters = function(results, showTypes) {
      $('.filters').show();
      if(!showTypes) {
        $('.wine-type').hide();
        $('.h4-wine-type').hide();
      } else {
        $('.wine-type').show();
        $('.h4-wine-type').show();
      }
      $('.wine-type').html('');
      var wineTypes = [];
      var priceMin = 0;
      var priceMax = 0;
      var regions = [];
      angular.forEach(results, function(result, key) {
        var name = result.Varietal.Name;
        var price = result.PriceMax;
        var exists = wineTypes.indexOf(name);
        var region = result.Appellation.Name;
        var regionExists = regions.indexOf(region);
        if(exists === -1) {
          wineTypes.push(name);
        }
        if(regionExists === -1) {
          regions.push(region);
        }
        if(priceMax === 0 && priceMin === 0) {
          priceMin = price;
          priceMax = price;
        } else {
          if(price > priceMax) {
            priceMax = price;
          } else if(price < priceMin) {
            priceMin = price;
          }
        }
      });
      var type ='';
      var reg = '';
      angular.forEach(wineTypes, function(wineType, key) {
        type += '<label><input type="checkbox" data-name="' + wineType + '" ng-click="filter()" />' + wineType + '</label>';
      });
      $compile($('.wine-type').html(type))($scope);
      angular.forEach(regions, function(region, key) {
        reg += '<label><input type="checkbox" data-name="' + region + '" ng-click="filter()" />' + region + '</label>';
      });
      $compile($('.regions').html(reg))($scope);
      // Bind jQuery UI slider.
      $('.range-slider').slider({
        range: true,
        min: priceMin,
        max: priceMax,
        values: [ priceMin, priceMax ],
        slide: function( event, ui ) {
          $('.range-value').html( "<strong>Min: $" + ui.values[ 0 ] + " - Max: $" + ui.values[ 1 ] + "</strong>" );
          $('.range-min').val(ui.values[0]);
          $('.range-max').val(ui.values[1]);
          $scope.filter();
        }
      });
      $('.range-value').html( "<strong>Min: $" + priceMin + " - Max: $" + priceMax + "</strong>" );
      $('.range-min').val(priceMin);
      $('.range-max').val(priceMax);
    };

    $scope.displayWines = function(results, showTypes) {
      angular.forEach(results, function(result, key) {
        var wine = '<div class="result" data-id="' + result.Id + '">';
        wine += '<div class="result-label"><a href=' + result.Url + '><img src="' + result.Labels[0].Url + '" alt="" border="0" /></a></div>';
        wine += '<p class="result-name"><a href=' + result.Url + '>' + result.Name + '</a></p>';
        wine += '<p class="result-price">$' + result.PriceMax.toFixed(2) + '*</p>';
        wine += '<a href=' + result.Url + ' class="btn btn-default">View</a>';
        $('.results-content').append(wine);
      });
      $('.results-loader').hide();
      $('.filters').show();
      $('.results-content').fadeIn(250);
      $scope.buildFilters(results, showTypes);
    };

    $scope.init = function(cat, subcat) {
      if(cat && subcat) {
        // Subcategory.
        var url = 'http://services.wine.com/api/beta2/service.svc/json/catalog?filter=categories(' + cat + '+' + subcat + ')&size=100&sortBy=popularity|descending&instock=true&apikey=24fd8a880d5f4549afe0e43f40dcd0c3&affiliateId=1LAPppeuuh0';
        var showWineTypes = false;
      } else {
        // Category.
        var url = 'http://services.wine.com/api/beta2/service.svc/json/catalog?filter=categories(101)&size=100&sortBy=popularity|descending&instock=true&apikey=24fd8a880d5f4549afe0e43f40dcd0c3&affiliateId=1LAPppeuuh0';
        var showWineTypes = true;
      }
      $http({method: 'GET', url: url }).
        success(function(data, status, headers, config) {
          var _results = data.Products.List;
          // Save wines locally for faster filtering
          localStorage.setItem('wines', JSON.stringify(_results));
          $scope.displayWines(_results, showWineTypes);
        }).
        error(function(data, status, headers, config) {
          $('.results-content').html('There was a problem with your request, please try again.');
          $('.results-loader').remove();
          //$scope.results = 'There was a problem with your request, please try again.';
        });
    };

  }])
  .controller('cabernet', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.init(101, 139);

  }])
  .controller('chardonnay', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.init(101, 140);

  }])
  .controller('pinot', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.init(101, 143);

  }])
  .controller('sauvignon', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.init(101, 151);

  }])
  .controller('syrah', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.init(101, 146);

  }])
  .controller('privacy', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $('.filters').hide();

  }])
  .controller('terms', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $('.filters').hide();

  }])
  .controller('index', [ '$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.init();


  }]);