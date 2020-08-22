
///////////////////////////////////////////////////////////////////////////////////////////////
"use strict";

var convexHull = new function() {
//    function init() {
//        var points = [[1,0],[0,0],[-1,-1],[0,1],[.5,.5],[-5,5],[-10,.5],[1,1],[10,1]];
//        var boundaryPoints = grahamScan(points);
//        //document.write(boundaryPoints);
//    }
    
	this.formHull = function(points) {
        var newPoints = points.slice();
        //var points = [[1,0],[0,0],[-1,-1],[0,1],[.5,.5],[-5,5],[-10,.5],[1,1],[10,1]];
        return this.weightPoints(this.grahamScan(newPoints));
	};
    
    this.weightPoints = function(points) {
        var newPoints = points.slice();
        for (var i = 0; i < newPoints.length; i++) {
            if(newPoints[i][2] == undefined) {
                newPoints[i].push(Math.floor(Math.random() * 10));
            }
        }
        return newPoints;
    };
	
	
	// Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
	this.grahamScan = function(points) {
          var n = points.length;
          if (n <= 3) return points;

          // Find the centroid
          var centroidX = (points[0][0] + points[1][0] + points[2][0]) / 3;
          var centroidY = (points[0][1] + points[1][1] + points[2][1]) / 3;
          var centroid = [centroidX, centroidY];

          // Find leftmost point
          var leftmost = points[0];
          var minX = Infinity;
          for (var i = 1; i < n; i++) { 
            if (points[i][0] < minX) {
               leftmost = points[i];
               minX = points[i][0]; 
            }
          } 

          // Sort by slope relative to centroid
          var maxCentSlope = -Infinity;
          var maxCentSlopePoint = points[0];
          for (var i = 0; i < n; i++) {
            points[i]._centroidSlope = Math.atan2(points[i][1] - centroid[1], points[i][0] - centroid[0]);
            if (points[i]._centroidSlope > maxCentSlope) {
                maxCentSlope = points[i]._centroidSlope;
                maxCentSlopePoint = points[i];
            }
          }
          points.sort(function(a, b){return b._centroidSlope - a._centroidSlope});

          // Sort by slope relative to leftmost
          var maxLeftSlope = -Infinity;
          var maxLeftSlopePoint = points[0];
          var leftmostSlope = Math.atan2(leftmost[1] - centroid[1], leftmost[0] - centroid[0]);
          for (var i = 0; i < n; i++) {
            points[i]._leftmostSlope = Math.atan2(points[i][1] - leftmost[1], points[i][0] - leftmost[0]);
            if ((points[i][0] !== leftmost[0] || points[i][1] !== leftmost[1]) && points[i]._leftmostSlope >= maxLeftSlope) {
                maxLeftSlope = points[i]._leftmostSlope;
                maxLeftSlopePoint = points[i];
            }
          }

          while ((points[0][0] != maxLeftSlopePoint[0]) || (points[0][1] != maxLeftSlopePoint[1])) {
            points.push(points.shift());
          }
          points.push(points.shift());

          // Do the scan
          var stack = [];
          stack.push(leftmost);
          stack.push(maxLeftSlopePoint);
          var p = maxLeftSlopePoint;
          var count = 0;
          while ((p[0] !== leftmost[0]) || (p[1] !== leftmost[1])) {
                p = points[count];
                count++;

                var firstPt = stack[stack.length - 2];
                var secondPt = stack[stack.length - 1];

                while ((secondPt[1] - firstPt[1]) * (p[0] - secondPt[0]) < (p[1] - secondPt[1]) * (secondPt[0] - firstPt[0])) {
                    stack.pop();
                    secondPt = firstPt;
                    firstPt = stack[stack.length - 2];
                }
                stack.push(p);
          }
          return stack;
	};
	
};

