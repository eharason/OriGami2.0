angular.module('starter.directives', [])
    .directive('testAnimate', function () {
        return {
            link: function (scope, iElement, iAttrs) {
                scope.$watch(iAttrs.testAnimate, function (newValue, oldValue) {
                    if (newValue == -1) {
                        iElement.stop();
                    } else {
                        iElement.animate({
                            width: 100 + '%'
                        }, 10000);
                    }
                });
            }
        };
    })
    .directive('smiley', function ($parse) {
        var directive = {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.canvas = element[0];
                scope.canvasContext = element[0].getContext('2d');

                scope.drawSmiley = function (canvas, context, distance, fill) {
                    var GOLDEN_RATIO = 1.618;
                    var padding = 2; //padding between edge of face and canvas
                    var center_x = canvas.width / 2;
                    var center_y = canvas.height / 2;
                    var radius = (canvas.width <= canvas.height) ? (canvas.width / 2 - padding) : (canvas.height / 2 - padding);
                    // Define coordinates for left, right eyes and left,right vertices of mouth and control points for bezier
                    // Co-ordinates are defined relative to the center of canvas and radius
                    var reye_x = center_x + (radius - radius / GOLDEN_RATIO);
                    var reye_y = center_y / GOLDEN_RATIO;
                    var leye_x = center_x - (radius - radius / GOLDEN_RATIO);
                    var leye_y = reye_y;
                    var lmouth_x = center_x - 0.7 * radius;
                    var lmouth_y = center_y + (radius - radius / GOLDEN_RATIO);
                    var rmouth_x = center_x + 0.7 * radius;
                    var rmouth_y = lmouth_y;
                    var control_x = (lmouth_x + rmouth_x) / 2;
                    var control_y_max = center_y + radius;
                    var control_y_min = 2 * lmouth_y - control_y_max;
                    // Compute control_y as a linear function of normalized distance
                    var control_y = control_y_max - (control_y_max / scope.initialDistance * distance);
                    if (control_y < control_y_min) {
                        control_y = control_y_min;
                    }

                    var clearCanvas = function (canvas, context) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    };
                    var drawCircle = function (context, x, y, radius, fillColor) {
                        context.beginPath();
                        context.arc(x, y, radius, 0, 2 * Math.PI); // main rectangle
                        context.fillStyle = fillColor;
                        context.fill();
                        context.closePath();
                    };
                    var drawSmile = function (context) {
                        context.beginPath();
                        context.moveTo(lmouth_x, lmouth_y);
                        context.quadraticCurveTo(control_x, control_y, rmouth_x, rmouth_y);
                        context.lineWidth = 5;
                        context.stroke();
                    };

                    /* Not perfect. Fill should instead be based on whether distance to
                     destination is decreasing, rather than using absolute distance */
                    switch (true) {
                    case distance <= 10:
                        fill = 'green';
                        break;
                    case distance <= 50:
                        fill = 'yellowgreen';
                        break;
                    case distance <= 100:
                        fill = 'gold';
                        break;
                    case distance <= 500:
                        fill = 'yellow';
                        break;
                    default:
                        fill = 'red';
                    }

                    /* Clear canvas and draw smiley */
                    clearCanvas(canvas, context);
                    drawCircle(context, center_x, center_y, radius, fill); // main rectangle
                    drawCircle(context, reye_x, reye_y, radius / 10, 'black');
                    drawCircle(context, leye_x, leye_y, radius / 10, 'black');
                    drawSmile(context, control_y);
                };
            }
        };
        return directive;
    })
    .directive('gameTiles', function () {
        return {
            scope: false,
            link: function(scope, element, attrs) {
                var tiles = scope.tiles;
                for (i in tiles) {
                    tile = tiles[i];
                    var str = '<div data-id="' + tile.id +  '"' +
                             'class="' +tile.class + '"' + 'style="top:' + tile.top + 'px; left:' +
                             tile.left + 'px; height:' + tile.height + 'px; width:' + tile.width + 'px;"></div>';
                    element.append(str);
                    console.log(str);
                }
            }
        }
    })
;