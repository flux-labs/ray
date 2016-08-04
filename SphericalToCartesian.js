'use strict';

/**
 * SphericalToCartesian.js
 * Code block converting an azimuth-altitude pair to cartesian vector coordinates.
 * Radius is assumed to be 1; hence why we only need 2 inputs. Resulting vector will
 * already be normalized.
 * Inputs: Azimuth and Altitude, both in radians.
 * Outputs: Vector as Array of numbers.
 */
function run(azimuth, altitude) {
	// azimuth = Math.PI * azimuth / 180;
	// altitude = Math.PI * altitude / 180;
	let X = Math.cos(altitude) * Math.sin(azimuth);
	let Y = Math.cos(altitude) * Math.cos(azimuth);
	let Z = Math.sin(altitude);

	return { Vector: [X, Y, Z] }
}

module.exports = {
    run: run
};
