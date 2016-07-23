'use strict';

/**
 * BoundingBox.js
 * This custom block finds the extreme x, y, and z values among a mesh's vertices, and forms
 * the bounding box enclosing the mesh using the two corners.
 * It writes these corner points, as two Arrays of Numbers, to the attributes/boundingBox property
 * of the mesh.
 * Intended for use in processing meshes before attempting a ray-mesh intersection.
 */

function boundingBox(positions) {
  if(positions.length === 0) {
    return null;
  }

  var dimensions = positions[0].length;
  var min = new Array(dimensions);
  var max = new Array(dimensions);

  for(var i=0; i<dimensions; i++) {
    min[i] =  Infinity;
    max[i] = -Infinity;
  }

  positions.forEach(function(position) {
    for(var i=0; i<dimensions; i++) {
      max[i] = position[i] > max[i] ? position[i] : max[i];
      min[i] = position[i] < min[i] ? position[i] : min[i];
    }
  });

  return [min, max];
}

function run(mesh) {
  if (!mesh.attributes) mesh.attributes = {};
  mesh.attributes.boundingBox = boundingBox(mesh.vertices);
  return { MeshWithBB: mesh };
}

module.exports = {
    run: run
};
