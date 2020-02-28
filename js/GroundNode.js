// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that, when parameterized correctly, can be used to represent the
 * ground in a simulation screen.
 *
 * @author John Blanco
 * @author Sam Reid
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Color from '../../scenery/js/util/Color.js';
import GradientBackgroundNode from './GradientBackgroundNode.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} gradientEndDepth
 * @param {Object} [options]
 * @constructor
 */
function GroundNode( x, y, width, height, gradientEndDepth, options ) {
  options = merge(
    {
      topColor: new Color( 144, 199, 86 ),
      bottomColor: new Color( 103, 162, 87 )
    }, options );
  GradientBackgroundNode.call( this, x, y, width, height, options.topColor, options.bottomColor, y, gradientEndDepth );
}

sceneryPhet.register( 'GroundNode', GroundNode );

inherit( GradientBackgroundNode, GroundNode );
export default GroundNode;