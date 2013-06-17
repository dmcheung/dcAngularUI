/*******************
  dcAngularUI 0.1
  (c) 2013
  AngularFlot may be freely distributed under the MIT license.
********************/
/*******************
notes:  inspiration for this module: http://jsfiddle.net/ZguhP/195/

6/16/13
1. Added configurable template for drop down display of autocomplete
2. Added loading indicator during search
3. Must have resource service definition before using this module.  See angularFlot.html for example.
*******************/

angular.module('autocomplete', []);
angular.module('autocomplete')
  .directive('autocomplete', function($compile, $http, $templateCache) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        minInputLength: '@minInput',
        remoteData: '&',
        source: '=',
        choiceTemplate: '=',
        selectedItemInfo:'=',
        placeholder: '@placeholder',
        restrictCombo: '@restrict',
        selectedItem: '=selectedItem',
        callback: '&'
      },
      compile: function($element, $attrs) { 
        return function($scope, $element, $attrs) {
          var choiceDisplay = ($scope.choiceTemplate) ? $scope.choiceTemplate : '{{choice.name}}'; 
          var template = angular.element(
            '<div class="dropdown search"  ng-class="{open: focused && _choices.length>0}">' + 
              '<input type="text" ng-model="searchTerm" placeholder="{{placeholder}}" ' + 
                'tabindex="1" accesskey="s" class="input-medium search-query" focused="focused"> ' + 
              '<ul class="dropdown-menu"> ' + 
                '<li ng-repeat="choice in _choices">' + 
                  '<a href="javascript:void(0);" ng-click="selectMe(choice)">'+choiceDisplay+'</a>'+
                '</li>' + 
              '</ul>' + 
              '<div class="autoSuggestLoading" ng-show="searching">' +
                '<img ng-show="searching" src="http://loadinggif.com/images/image-selection/2.gif" /> ' +
              '</div>' +
            '</div>');
          $element.append(template);
          var templateFn = $compile(template);
          templateFn($scope);
        }
      },
      controller: function($scope, $element, $attrs) {
        //console.log('inside controller');
        $scope.selectMe = function(choice) {
          $scope.selectedItem = choice;
          $scope.searchTerm = $scope.lastSearchTerm = choice.label;
          $scope.selectedItemInfo= angular.copy(choice);
        };
  
        $scope.UpdateSearch = function() {
          if ($scope.canRefresh()) {
            $scope.searching = true;
            $scope.lastSearchTerm = $scope.searchTerm;
            try {
              $scope.source.query({searchTerm: $scope.lastSearchTerm}, function(data) { 
                $scope.searching = false;
                $scope._choices = data;
              });
            } catch (ex) {
              console.log(ex.message);
              $scope.searching = false;
            }
          }
        }
          
        $scope.$watch('searchTerm', $scope.UpdateSearch);
          
        $scope.canRefresh = function() {
          return ($scope.searchTerm !== "") && ($scope.searchTerm !== $scope.lastSearchTerm) && ($scope.searching != true);
        };
      }, //END of controller
      link: function(scope, iElement, iAttrs, controller) {
        scope._searchTerm = '';
        scope._lastSearchTerm = '';
        scope.searching = false;
        scope._choices = [];
        if (iAttrs.restrict == 'true') {
          var searchInput = angular.element(iElement.children()[0])
          searchInput.bind('blur', function() {
            if (scope._choices.indexOf(scope.selectedItem) < 0) {
              scope.selectedItem = null;
              scope.searchTerm = '';
            }
          });
        }
      } //END of link
    }; //END of return
  }) //END of autocomplete directive
  .directive("focused", function($timeout) {
    return function(scope, element, attrs) {
      element[0].focus();
      element.bind('focus', function() {
        scope.$apply(attrs.focused + '=true');
      });
      element.bind('blur', function() {
        $timeout(function() {
          scope.$eval(attrs.focused + '=false');
        }, 200);
      });
      scope.$eval(attrs.focused + '=true')
    } //END of return
  }); //END of focused directive
