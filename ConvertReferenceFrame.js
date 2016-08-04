'use strict';

/**
 * ConvertReferenceFrame.js
 * Transforms vector from the given reference frame to global reference frame.
 * Inputs: 
 *   In: Vector as Array of 3 Numbers
 *   ReferenceFrame: Reference frame JSON object with unitX, unitY, and unitZ properties.
 * Outputs:
 *   Out: Vector as Array of 3 Numbers
 */
function run(In, refFrame) {
    let x = refFrame.unitX, y = refFrame.unitY, z = refFrame.unitZ;
    var out = [0,1,2].map( c => In[0]*x[c] + In[1]*y[c] + In[2]*z[c] );
    
    return {Out: out};
}

module.exports = {
    run: run
};