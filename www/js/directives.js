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
.directive('gameTiles', function() {
    return {
        scope: false,
        replace: true,
        link: function(scope, el, attrs) {
            var tiles = scope.tiles; 

            for (i in tiles) {
                tile = tiles[i];
                position = scope.position(tile.id+1);
                onHammer = scope.onHammer;
                scope.dragdirection = null;

                tileDiv = angular.element('<div></div>')
                .attr('class', tile.class)
                .css('top', tile.top + "px")
                .css('height', tile.height + "px")
                .css('left', tile.left + "px")
                .css('width', tile.width + "px")
                .attr('data-id',tile.id)
                .attr('data-position-x',position[0])
                .attr('data-position-y',position[1]);

                scope.tiles[i].tileDiv = tileDiv;

                el.append(tileDiv);
                ionic.onGesture("release dragleft dragright swipeleft swiperight dragup dragdown", onHammer, tileDiv[0], { drag_lock_to_axis: false });
                
                tileDiv.on('dragend', null, scope, function(event) {
                    var curId = Number(this.attributes['data-id'].value);
                    var curTileTop = this.style.top;
                    var curTileLeft = this.style.left;
                    var curTilePosition = scope.position(curId+1);

                    var nextTile = null;

                    switch (scope.dragdirection) {
                        case 'right': 
                        if (event.data.$parent.tiles[curId+1]!=undefined){
                            nextTilePosition = scope.position(curId+1+1);
                            if(curTilePosition[1] == nextTilePosition[1]){
                                var nextTile = event.data.$parent.tiles[curId+1].tileDiv[0];
                                var nextTileId = Number(nextTile.attributes['data-id'].value);
                                var nextTileTop = nextTile.style.top;
                                var nextTileLeft = nextTile.style.left;
                            }

                        } 

                        break;
                        case 'left':
                        if (event.data.$parent.tiles[curId-1]!=undefined){
                            nextTilePosition = scope.position(curId-1+1);
                            if(curTilePosition[1] == nextTilePosition[1]){
                                var nextTile = event.data.$parent.tiles[curId-1].tileDiv[0];
                                var nextTileId = Number(nextTile.attributes['data-id'].value);
                                var nextTileTop = nextTile.style.top;
                                var nextTileLeft = nextTile.style.left;
                            }

                        } 

                        //check 1st element, dodrag is set execute, otherwise not

                        break;
                        case 'up': 
                        if (event.data.$parent.tiles[curId-4]!=undefined){
                            var nextTile = event.data.$parent.tiles[curId-4].tileDiv[0];
                            var nextTileId = Number(nextTile.attributes['data-id'].value);
                            var nextTileTop = nextTile.style.top;
                            var nextTileLeft = nextTile.style.left;
                        } 

                        break;
                        case 'down': 
                        if (event.data.$parent.tiles[curId+4]!=undefined){
                            var nextTile = event.data.$parent.tiles[curId+4].tileDiv[0];
                            var nextTileId = Number(nextTile.attributes['data-id'].value);
                            var nextTileTop = nextTile.style.top;
                            var nextTileLeft = nextTile.style.left;
                        } 

                        break;
                    }

                    // Switch current tile with next Tile
                    if (nextTile != null){
                        this.attributes['data-id'].value = nextTileId;
                        this.style.top = nextTileTop; 
                        this.style.left = nextTileLeft;
                        event.data.$parent.tiles[nextTileId].tileDiv[0] = this;


                        nextTile.attributes['data-id'].value = curId;
                        nextTile.style.top = curTileTop; 
                        nextTile.style.left = curTileLeft;
                        event.data.$parent.tiles[curId].tileDiv[0] = nextTile;

                        scope.dragdirection = null;

                        // Update Level

                        curId = nextTileId;
                        curTilePosition = scope.position(curId+1);

                        tileClass = this.attributes['class'].value;
                        var tilesToBeRemoved = ["" + curId];

                        // Search Horizontal
                        // Search Left

                        NeighbourTileID = curId -1;
                        NeighbourTilePosition = scope.position(NeighbourTileID+1);

                        while(NeighbourTilePosition[1] == curTilePosition[1]){
                            NeighbourTile = event.data.$parent.tiles[NeighbourTileID].tileDiv[0];
                            if(NeighbourTile.attributes['class'].value == tileClass){
                                tilesToBeRemoved.push("" + NeighbourTileID);
                                NeighbourTileID = NeighbourTileID -1;
                                NeighbourTilePosition = scope.position(NeighbourTileID+1);
                            }
                            else{
                                break;
                            }
                        }

                        // Search Right
                        NeighbourTileID = curId +1;
                        NeighbourTilePosition = scope.position(NeighbourTileID+1);

                        while(NeighbourTilePosition[1] == curTilePosition[1]){
                            NeighbourTile = event.data.$parent.tiles[NeighbourTileID].tileDiv[0];
                            if(NeighbourTile.attributes['class'].value == tileClass){
                                tilesToBeRemoved.push("" + NeighbourTileID);
                                NeighbourTileID = NeighbourTileID +1;
                                NeighbourTilePosition = scope.position(NeighbourTileID+1);
                            }
                            else{
                                break;
                            }
                        }

                        // Check if already more than 2 tiles with same type
                        if(tilesToBeRemoved.length < 3){

                            // Search Vertical

                            var tilesToBeRemoved = ["" + curId];

                            // Search Up
                            NeighbourTileID = curId -4;
                            NeighbourTilePosition = scope.position(NeighbourTileID+1);

                            while(NeighbourTileID >= 0 && NeighbourTilePosition[0] == curTilePosition[0]){
                                NeighbourTile = event.data.$parent.tiles[NeighbourTileID].tileDiv[0];
                                if(NeighbourTile.attributes['class'].value == tileClass){
                                    tilesToBeRemoved.push("" + NeighbourTileID);
                                    NeighbourTileID = NeighbourTileID -4;
                                    NeighbourTilePosition = scope.position(NeighbourTileID+1);
                                }
                                else{
                                    break;
                                }
                            }
                            // Search Down
                            NeighbourTileID = curId +4;
                            NeighbourTilePosition = scope.position(NeighbourTileID+1);

                            while(NeighbourTileID < 16 && NeighbourTilePosition[0] == curTilePosition[0]){
                                NeighbourTile = event.data.$parent.tiles[NeighbourTileID].tileDiv[0];
                                if(NeighbourTile.attributes['class'].value == tileClass){
                                    tilesToBeRemoved.push("" + NeighbourTileID);
                                    NeighbourTileID = NeighbourTileID +4;
                                    NeighbourTilePosition = scope.position(NeighbourTileID+1);
                                }
                                else{
                                    break;
                                }
                            }
                        }

                    // UPDATE Game
                    // Check if already more than 2 tiles with same type
                    if(tilesToBeRemoved.length >= 3){
                        for (i = 0; i < tilesToBeRemoved.length; i++) {
                            newClass = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
                            newClass="type-" + newClass + " row disable-user-behavior";
                            event.data.$parent.tiles[Number(tilesToBeRemoved[i])].tileDiv[0].attributes['class'].value = newClass;
                        }
                    }
                }

            });

tileDiv.on('dragright', null, scope, function(event) {
    scope.dragdirection = 'right';
});
tileDiv.on('dragleft', null, scope, function(event) {
    scope.dragdirection = 'left';
});
tileDiv.on('dragup', null, scope, function(event) {
    scope.dragdirection = 'up';
});
tileDiv.on('dragdown', null, scope, function(event) {
    scope.dragdirection = 'down';
});

};
}
}
})