'use strict';

var _ = require('lodash');

/**
 * Combinations
 * Takes two lists, and forms all possible pairwise combinations between them.
 */
function run(A, B) {
	var allA = [], allB = [], C = Array(B.length);
	for (let a of A) {
		allA.push( ...C.fill(a) );
		allB.push( ...B );
	}
	return {
		A: allA,
		B: allB,
		Pairs: _.zip([allA, allB])
	}
}

module.exports = {
    run: run
};
