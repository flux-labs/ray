'use strict';

var modeling = require('flux-modelingjs').modeling();

/**
 * ByOriginDirection.js
 * Code block creating a ray object for use in the RayMeshIntersection block, as well as visualizing the ray as line geometry.
 * Inputs:
 *   Origin: Origin point of the ray, as an Array of numbers.
 *   Direction: Direction vector of the ray, as an Array of numbers. Does not need to be normalized, as we will do so as a first step.
 *   Bound: The bounds along every axis for the lines generated. Use this to limit the length of the ray lines, particularly when they
 *          extend past the bounds of the parasolid worker. A bound value of 100 will force all lines within a 200x200x200 cube centered
 *          on [0,0,0].
 * Outputs:
 *   Line: Line visualizing the ray. Starts from the Origin point and extends along the Direction vector until it hits the bounding box
 *         defined by Bound.
 *   Ray: A JSON object with the ray's components, classification, and other pre-calculated attributes for use in RayMeshIntersection.
 *
 */

function run(origin, direction, bound) {
	if (direction === [0,0,0]) return null;
	direction = normalize(direction);
	
	var runways = [0,1,2].map( i => runway(origin[i], direction[i], bound) );
	var minRunway = Math.floor(Math.min(...runways));
	var endPoint = origin.map( (n,i) => n + minRunway * direction[i] );
	
	return { 
		Line : modeling.entities.line(origin, endPoint),
		Ray: createRay(origin, direction)
	};
}

module.exports = {
    run: run
};

function normalize(a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var inverseLen = 1 / Math.sqrt(x*x + y*y + z*z);
    return a.map(n => n*inverseLen);;
}

function runway(start, velocity, bound) {
  if (velocity === 0) return Infinity;
	var space = velocity > 0 ? bound - start : -bound - start;
	return space / velocity;
}

function sign(a) {
  return typeof a === 'number' ? a ? a < 0 ? -1 : 1 : a === a ? 0 : 0 : 0
}

function classify(i, j, k) {
  // sign
  i = sign(i);
  j = sign(j);
  k = sign(k);

  // b00110100 === MPO
  //    ||||||_ k non-zero (false)
  //    |||||_ k negative (false)
  //    ||||_ j non-zero (true)
  //    |||_ j negative (false)
  //    ||_ i non-zero (true)
  //    |_ i negative (true)
  return (i>>>-1) << 5 | (i&1) << 4 |
         (j>>>-1) << 3 | (j&1) << 2 |
         (k>>>-1) << 1 | (k&1);
}

function createRay(ro, rd) {
  var r = {"ro": [], "rd": []};
  var i = rd[0], j = rd[1], k = rd[2];
  var x = ro[0], y = ro[1], z = ro[2];

  r.ro[0] = x;
  r.ro[1] = y;
  r.ro[2] = z;
  r.rd[0] = i;
  r.rd[1] = j;
  r.rd[2] = k;

  var ii = r.ii = (i === 0)?0:1.0/i;
  var ij = r.ij = (j === 0)?0:1.0/j;
  var ik = r.ik = (k === 0)?0:1.0/k;
  //ray slope
  var ibyj = r.ibyj = i * ij;
  var jbyi = r.jbyi = j * ii;
  var jbyk = r.jbyk = j * ik;
  var kbyj = r.kbyj = k * ij;
  var ibyk = r.ibyk = i * ik;
  var kbyi = r.kbyi = k * ii;
  r.cxy = y - jbyi * x;
  r.cxz = z - kbyi * x;
  r.cyx = x - ibyj * y;
  r.cyz = z - kbyj * y;
  r.czx = x - ibyk * z;
  r.czy = y - jbyk * z;

  r.classification = classify(i, j, k);
  return r;
}