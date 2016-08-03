'use strict';

var modeling = require('flux-modelingjs').modeling();

/**
 * VisualizeRay.js
 * Code block for visualizing a ray object as line geometry.
 * Inputs:
 *   Ray: A ray JSON object.
 *   Bound: The bounds along every axis for the lines generated. Use this to limit the length of the ray lines, particularly when they
 *          extend past the bounds of the parasolid worker. A bound value of 100 will force all lines within a 200x200x200 cube centered
 *          on [0,0,0].
 * Outputs:
 *   Line: Line visualizing the ray. Starts from the ro point and extends along the rd vector until it hits the bounding box
 *         defined by Bound.
 *
 */

function run(ray, bound) {
  var runways = [0,1,2].map( i => runway(ray.ro[i], ray.rd[i], bound) );
  var minRunway = Math.floor(Math.min(...runways));
  var endPoint = ray.ro.map( (n,i) => n + minRunway * ray.rd[i] );
  
  return { 
    Line : modeling.entities.line(ray.ro, endPoint)
  };
}

module.exports = {
    run: run
};

function runway(start, velocity, bound) {
  if (velocity === 0) return Infinity;
  var space = velocity > 0 ? bound - start : -bound - start;
  return space / velocity;
}
