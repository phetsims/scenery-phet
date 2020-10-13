// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that can be used to represent the ground.
 *
 * @author John Blanco
 * @author Sam Reid
 */

import merge from '../../phet-core/js/merge.js';
import Color from '../../scenery/js/util/Color.js';
import GradientBackgroundNode from './GradientBackgroundNode.js';
import sceneryPhet from './sceneryPhet.js';

class GroundNode extends GradientBackgroundNode {

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} gradientEndDepth
   * @param {Object} [options]
   */
  constructor( x, y, width, height, gradientEndDepth, options ) {
    options = merge( {
      topColor: new Color( 144, 199, 86 ),
      bottomColor: new Color( 103, 162, 87 )
    }, options );
    super( x, y, width, height, options.topColor, options.bottomColor, y, gradientEndDepth );
  }
}

sceneryPhet.register( 'GroundNode', GroundNode );
export default GroundNode;