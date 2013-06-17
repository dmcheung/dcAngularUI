/*******************
  dcAngularUI 0.1
  (c) 2013
  AngularFlot may be freely distributed under the MIT license.
********************/
angular.module('flotComponent', []);
angular.module('flotComponent')
  .directive('flot', function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div ng-style="myProp()"></div>',
      scope: { width: '@width', height: '@height',   iteminfo: '=', collection: '=' },
      controller: function($scope, $element) {
        $scope.addItem = function(item) {
          if (item.symbolDataSet) {
            var data = [];
            angular.forEach(item.symbolDataSet, function(v,i) {
              data.push([new Date(v[0]).getTime(), v[1]]);
            });
            var item = {
              label: item.name,
              data: data 
            }
            $scope.collection.push(item);
          }
        };
        $scope.draw =function() {
          var collection = $scope.collection;
          $scope.chart = jQuery.plot($element, $scope.collection, $scope.opts);
          if (collection.length==0) {
            $element.html('<div class="beginMessage" style="padding-top:'+$scope.height/2
              +'px">Please select symbol to add to chart</div>');
          }
        }
      },
      link: function($scope, $element, $attrs) {
        $scope.opts = { 
          crosshair: { mode: 'x' },
          grid: { hoverable: true, autoHighlight: false },
          xaxis: {
            mode: 'time',
            tickLength: 0,
            tickFormatter: function (val, axis) {
              var d = new Date(val);
              return (d.getUTCMonth() + 1) +'/'+d.getUTCDate() + "/"  +String(d.getUTCFullYear()).substring(2);
            }
          }
        };

        $scope.myProp = function() {
          return {
            height: $scope.height+'px',
            width: $scope.width+'px'
          }
        }

        $scope.$watch('collection', function(newValue) {
          $scope.draw();
        }, true);

        $scope.$watch('iteminfo', function(newValue) {
          if (newValue) {
            $scope.addItem(newValue);
          }
        }, true);
      }
    };
  });
  
