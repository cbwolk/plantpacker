
"use strict";

var svgElem = document.querySelector("article svg");
var inHullAllPts = svgElem.querySelectorAll("g")[1];
var onHullAllPts = svgElem.querySelectorAll("g")[2];
var allWeights = svgElem.querySelectorAll("g")[3];
var allPoints = svgElem.querySelectorAll("g")[0];
var weightElem = svgElem.querySelector("rect");
var pathElement = svgElem.querySelector("path");
var weightText = svgElem.querySelector("text");

var randomB = document.getElementById("random");
var resetB = document.getElementById("reset");
var startB = document.getElementById("start");
var endB = document.getElementById("end");

var currPlayer = document.getElementById("currPlayer");
var playerA = 0;
var playerB = 0;
var gameOn = false;
var hover = true;

var RADIUS = 0.012;
var points = [];
var currPointLoc = -1;

function initialize() {
	randomSelection();
	
	svgElem.onmousedown = function(ev) { handleChange(ev, "down", gameOn);};
	svgElem.onmousemove = function(ev) { handleChange(ev, "move", gameOn);};
	svgElem.onmouseup = function(ev) { handleChange(ev, "up", gameOn); };
    allPoints.onmouseenter = function(ev) { handleChange(ev, "over", gameOn); };
    allPoints.onmouseleave = function(ev) { handleChange(ev, "out", gameOn); };
	svgElem.onselectstart = function(ev) { ev.preventDefault(); };
	
	function handleChange(ev, type, gamePlaying) {
		var bounds = svgElem.getBoundingClientRect();
		var width  = bounds.width  / Math.min(bounds.width, bounds.height);
		var height = bounds.height / Math.min(bounds.width, bounds.height);
		var evX = ((ev.clientX - bounds.left) / bounds.width  - 0.5) * width ;
		var evY = ((ev.clientY - bounds.top ) / bounds.height - 0.5) * height;
		
		if (type == "down") {
            
            hover = false;
            weightText.setAttribute("visibility", "hidden");
            weightText.innerHTML = "";

            var nearestIndex = -1;
			var nearestDist = Infinity;
			points.forEach(function(point, index) {
				var dist = Math.hypot(point[0] - evX, point[1] - evY);
				if (dist < nearestDist) {
					nearestDist = dist;
					nearestIndex = index;
				}
			});
            
            if (gamePlaying && (ev.button == 0 || ev.button == 2)) {
				if (nearestIndex != -1 && nearestDist < RADIUS * 2) {
                    if (currPlayer.innerText == "Player A's Turn") {
                        playerA += points[nearestIndex][2];
                        currPlayer.innerText = "Player B's Turn";
                    } else {
                        playerB += points[nearestIndex][2];
                        currPlayer.innerText = "Player A's Turn";
                    }
					points.splice(nearestIndex, 1);
                }
				if (nearestDist < RADIUS * 5) {
					svgElem.oncontextmenu = function(ev) {
						ev.preventDefault();
						svgElem.oncontextmenu = null;
					};
				}
			} else if (!gamePlaying && ev.button == 0) {
				if (nearestIndex != -1 && nearestDist < RADIUS * 2)
					currPointLoc = nearestIndex;
				else {
					currPointLoc = points.length;
					points.push(null);
				}
			    points[currPointLoc] = [evX, evY, Math.floor(Math.random() * 10)];
            } else if (!gamePlaying &&  ev.button == 2) {
				if (nearestIndex != -1 && nearestDist < RADIUS * 2)
					points.splice(nearestIndex, 1);
				if (nearestDist < RADIUS * 5) {
					svgElem.oncontextmenu = function(ev) {
						ev.preventDefault();
						svgElem.oncontextmenu = null;
					};
				}
			} else 
				return;
			
		} else if (!gamePlaying && type == "move") {
            weightText.setAttribute("visibility", "hidden");
            weightText.innerHTML = "";
			if (currPointLoc == -1)
				return;
			points[currPointLoc] = [evX, evY, Math.floor(Math.random() * 10)];
            if (type == "up") {
				currPointLoc = -1;
                hover = true;
            }
		} else if (type == "up") {
            if (type == "up") {
				currPointLoc = -1;
                hover = true;
            }
        }
        else if (type == "over" && hover) {
            var nearestIndex = -1;
			var nearestDist = Infinity;
			points.forEach(function(point, index) {
				var dist = Math.hypot(point[0] - evX, point[1] - evY);
				if (dist < nearestDist) {
					nearestDist = dist;
					nearestIndex = index;
                }
			});
            if (nearestIndex != -1 && nearestDist < RADIUS * 2) {
                weightText.setAttribute("visibility", "visible");
    //            weightElem.setAttribute("x", evX - 0.1);
    //            weightElem.setAttribute("y", evY - 0.1);
    //            weightElem.setAttribute("width", 0.1);
    //            weightElem.setAttribute("height", 0.1);
                weightText.setAttribute("x", evX - 0.02);
                weightText.setAttribute("y", evY - 0.02);
                weightText.innerHTML = points[nearestIndex][2];
            }
            else {
                weightText.setAttribute("visibility", "hidden");
                weightText.innerHTML = "";
            }
		} else if (type == "out") {
            weightText.setAttribute("visibility", "hidden");
            weightText.innerHTML = "";
		} else
			return;
		renderAll();
	};
}

function showWeights() {
    points.forEach(function(point) {
		var circElem = document.createElementNS(svgElem.namespaceURI, "circle");
		circElem.setAttribute("cx", point[0]);
		circElem.setAttribute("cy", point[1]);
		circElem.setAttribute("r", 0.1);
        allWeights.appendChild(textE);
	});
    
//    var s = points.map(function(point, i) {
//        return (i == 0 ? "M" : "L") + point[0] + "," + point[1];
//	   }).join("") + "Z";
//	pathElement.setAttribute("d", s);
}

function handleStart() {
    gameOn = true;
    currPlayer.innerText = "Player A's Turn";
	playerA = 0;
    playerB = 0;
}

function handleEnd() {
	gameOn = false;
    if (playerA > playerB) {
        currPlayer.innerText = "A wins!";
    } else if (playerB > playerA) {
        currPlayer.innerText = "B wins!";
    } else {
        currPlayer.innerText = "It's a tie!";
    }
}

function handleRandom() {
    gameOn = false;
	randomSelection();
}

function handleReset() {
    gameOn = false;
    currPlayer.innerText = "";
	points = [];
    renderAll();
}



function randomSelection(){
		var newN = Math.round(((Math.random() * 10) + 1) * 2.5);
		points = [];
		for (var i = 0; i < newN; i++) {
			points.push([randGaus() * 0.17, randGaus() * 0.17, Math.floor(Math.random() * 10)]);
		}
		renderAll();
};

function renderAll() {
    
	while (inHullAllPts.firstChild !== null)
		inHullAllPts.removeChild(inHullAllPts.firstChild);
	while (onHullAllPts.firstChild !== null)
		onHullAllPts.removeChild(onHullAllPts.firstChild);
    while (allWeights.firstChild !== null)
		allWeights.removeChild(allWeights.firstChild);

    var ch = convexHull.formHull(points);
	var pathway = ch.map(function(point, i) {
		return (i == 0 ? "M" : "L") + point[0] + "," + point[1];
	}).join("") + "Z";
	pathElement.setAttribute("d", pathway);
	
	var hullSet = new Set(ch);
	points.forEach(function(point) {
		var circElem = document.createElementNS(svgElem.namespaceURI, "circle");
		circElem.setAttribute("cx", point[0]);
		circElem.setAttribute("cy", point[1]);
		circElem.setAttribute("r", RADIUS);
		if (hullSet.has(point))
			onHullAllPts.appendChild(circElem);
		else
			inHullAllPts.appendChild(circElem);
	});
}

// Borrowed from Stackoverflow
function randGaus() {
	return Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(Math.random() * Math.PI * 2);
}


window.addEventListener("DOMContentLoaded", initialize);