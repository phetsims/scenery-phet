// Copyright 2014-2020, University of Colorado Boulder

/**
 * Node that can be used to represent the sky.
 *
 * @author John Blanco
 * @author Sam Reid
 */

import merge from '../../phet-core/js/merge.js';
import Color from '../../scenery/js/util/Color.js';
import GradientBackgroundNode from './GradientBackgroundNode.js';
import sceneryPhet from './sceneryPhet.js';

class SkyNode extends GradientBackgroundNode {

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} gradientEndHeight
   * @param {Object} [options]
   */
  constructor( x, y, width, height, gradientEndHeight, options ) {
    options = merge( {
      topColor: new Color( 1, 172, 228 ),
      bottomColor: new Color( 208, 236, 251 )
    }, options );
    super( x, y, width, height, options.bottomColor, options.topColor, gradientEndHeight, y );
  }
}

sceneryPhet.register( 'SkyNode', SkyNode );
export default SkyNode;