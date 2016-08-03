'use strict';

var modeling = require('flux-modelingjs').modeling();

/**
 * CreateRays.js
 * Code block creating ray objects for use in the RayMeshIntersection block, as well as visualizing the ray as line geometry.
 * Inputs:
 *   Origin: Array of ray origin points, each as an Array of numbers.
 *   Direction: Array of ray destination points, each as an Array of numbers.
 * Outputs:
 *   Ray: Array of ray objects, i.e. JSON objects with each ray's components, classification, and other pre-calculated attributes for use in RayMeshIntersection.
 *
 */

function run(origins, destinations) {
  var rays = [];
  for (let i=0, len=origins.length; i<len; i++) {
    rays.push( createRay( origins[i], normalize(vertexSubtract(destinations[i], origins[i])) ));
  }

  return {
    Rays: rays
  }
}

module.exports = {
    run: run
};

function vertexSubtract(A,B) {
  let C = [];
  for (let i=0; i<A.length; i++) {
    C[i] = A[i] - B[i];
  }
  return C;
}

function normalize(a) {
  if (a === [0,0,0]) throw new Error("Cannot normalize vector of length 0");
    var x = a[0],
        y = a[1],
        z = a[2];
    var inverseLen = 1 / Math.sqrt(x*x + y*y + z*z);
    return a.map(n => n*inverseLen);;
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