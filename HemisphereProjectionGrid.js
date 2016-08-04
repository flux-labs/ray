'use strict';

var _ = require('lodash');

/**
 * HemisphereProjectionGrid.js
 * Code block that creates an xy point grid sampling a 1x1 square, and converts each vector
 * to a hemispherical projection. Azimuths are angles off the horizontal, and altitudes are
 * the subsequent rotation upward from the horizontal plane. Used to generate a sampling
 * pattern for a Waldram diagram.
 * Inputs:
 *   HorizontalSegments: Number of points to sample in the horizontal direction
 *   VerticalSegments: Number of points to sample in the vertical direction
 * Outputs:
 *   Azimuths: Array of azimuth angles, centered on 0. In radians.
 *   Altitudes: Array of altitude angles, centered on pi/4. In radians.
 *   Domain: Array of x coordinates, centered on 0.
 *   Range: Array of y coordinates, centered on 0.5.
 */
function run(x_n, y_n) {
	var x_segment = 2 / x_n;
	var y_segment = 1 / y_n;
	
	var x_range = _.range(x_n).map(n => (n+0.5)*x_segment - 1);
	var y_range = _.range(y_n).map(n => (n+0.5)*y_segment);
	
	var az_range = x_range.map(Math.asin);
	var alt_range = y_range.map(Math.asin);
	
	return {
		Azimuths: az_range,
		Altitudes: alt_range,
		Domain: _.range(x_n).map(n => (n+0.5)*4 - 2*x_n),
		Range: _.range(y_n).map(n => (n+0.5)*4 - 2*y_n)
	}
}

module.exports = {
    run: run
};

function radToDegrees(n) {
	return n * 180 / Math.PI;
}