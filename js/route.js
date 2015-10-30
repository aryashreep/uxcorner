/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('ux2dayWebApp', [
  'ngRoute',
  'filters'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Blog
    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})  
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "AboutCtrl"})
	.when("/portfolio", {templateUrl: "partials/portfolio.html", controller: "PageCtrl"})
	.when('/:portfolioName', {templateUrl: 'partials/portfolio-detail.html', controller: 'portfolioDetailCtrl'})
    .when("/blog/post/:Article", {templateUrl: "partials/blog-details.html", controller: "BlogDetailCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function ($scope, $http) {
  console.log("Blog Controller reporting for duty.");
	$http.get('json/blog.json').success(function(data) {
	    $scope.blog = data;
		//console.log($scope.blog);
	});  
});
app.controller('BlogDetailCtrl', function ($scope, $sce, $routeParams, $http){
	$scope.name = $routeParams.Article;
		$http.get('json/blog.json').success(function(data) {
		$scope.single_blog = data;
		for(i in $scope.single_blog){	
			if($scope.single_blog[i].blogTitle == $routeParams.Article){
				$scope.cur_blog = angular.copy( $scope.single_blog[i] );
			}	
		}
	  console.log($scope.cur_blog);
	});
});
/**
 * Controls the About
 */
app.controller('AboutCtrl', function (/* $scope, $location, $http */) {
  console.log("About Controller reporting for duty.");
});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ($scope, $http) {
  console.log("Page Controller reporting for duty.");

	$http.get('json/home.json').success(function(data) {
	    $scope.home = data;
		//console.log($scope.home);
	});

	$http.get('json/homeResources.json').success(function(data) {
	    $scope.resources = data;
		//console.log($scope.resources);
	});
/*PAGINATION*/
$scope.showData = function( ){

    $scope.itemsPerPage = 6;
    $scope.currentPage = 0;
    $scope.portfolio = []
	 	$http.get('json/portfolio.json').success(function(data) {
	    $scope.portfolio = data;
		//console.log($scope.portfolio);
	});	
    $scope.range = function() {
    var rangeSize = 2;
    var ps = [];
    var start;

    start = $scope.currentPage;
    if ( start > $scope.pageCount()-rangeSize ) {
      start = $scope.pageCount()-rangeSize+1;
    }

    for (var i=start; i<start+rangeSize; i++) {
      if(i>=0) 
         ps.push(i);
    }
    return ps;
  };
    
  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.DisablePrevPage = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.portfolio.length/$scope.itemsPerPage)-1;
  };

  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.DisableNextPage = function() {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };

  $scope.setPage = function(n) {
    $scope.currentPage = n;
  };
         
}
/*END PAGINATION*/	
/*SUB MENU portfolio*/
	$http.get('json/portfolio.json').success(function(data) {
	    $scope.sub_menu_portfolio = data;
		//console.log($scope.portfolio);
	});	
  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});
app.controller('portfolioDetailCtrl', function ($scope, $sce, $routeParams, $http){
	$scope.name = $routeParams.portfolioName;
		$http.get('json/portfolio.json').success(function(data) {
		$scope.single_portfolio = data;
		for(i in $scope.single_portfolio){	
			if($scope.single_portfolio[i].portfolioTitle == $routeParams.portfolioName){
				$scope.cur_portfolio = angular.copy( $scope.single_portfolio[i] );
			}	
		}
	  //console.log($scope.cur_portfolio);
	});
});

angular.module('filters', []).filter('linebreak', function(){
    return function(text) {
        return text.replace(/\n/g, '<br>');
    }
}).filter('to_trusted', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]);
angular.module('ux2dayWebApp').filter('pagination', function()
{
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

angular.module('ux2dayWebApp').filter('cut', function () {
	return function (value, wordwise, max, tail) {
		if (!value) return '';

		max = parseInt(max, 10);
		if (!max) return value;
		if (value.length <= max) return value;

		value = value.substr(0, max);
		if (wordwise) {
			var lastspace = value.lastIndexOf(' ');
			if (lastspace != -1) {
				value = value.substr(0, lastspace);
			}
		}

		//return value + (tail || ' …');
		return value + (tail);
	};
});