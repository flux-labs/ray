'use strict';

/**
 * VerticalWindowReferenceFrame.js
 * Determine the reference frame when looking straight out from a vertical window.
 * We assume the unit z vector is the vertical, unit y is the normal of the front face of the window, 
 * and unit x points to the right when facing along the normal.
 * Inputs: 
 *   Window: Mesh with single face.
 * Outputs:
 *   ReferenceFrame: Object with three components: unitX, unitY, unitZ.
 *                   Each component is an Array of three Numbers. Each will be normalized.
 */
function run(Window) {
	var vertices = Window.faces[0].map(i => Window.vertices[i]);
	console.log(vertices);
	
	var side1 = [], side2 = [], normal = [], vertical = [0,0,1], horizontal = [];
	sub(side1, vertices[0], vertices[1]);
	sub(side2, vertices[2], vertices[1]);
	cross(normal, side2, side1);
	normalize(normal, normal);
	cross(horizontal, normal, vertical);
	console.log(side1,side2,horizontal, normal, vertical)
	
	var referenceFrame = {
		unitX: horizontal, unitY: normal, unitZ: vertical
	}
	
	return { ReferenceFrame: referenceFrame };
}

module.exports = {
    run: run
};


function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2]

    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out
}

function sub(out, a, b) {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    out[2] = a[2] - b[2]
    return out
}

function normalize(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
}