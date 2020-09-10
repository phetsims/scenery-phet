// Copyright 2014-2020, University of Colorado Boulder

/**
 * Minus sign, created using scenery.Rectangle because scenery.Text("-") looks awful on Windows and cannot be accurately
 * centered. The origin is at the upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_SIZE = new Dimension2( 20, 5 );

class MinusNode extends Rectangle {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      size: DEFAULT_SIZE,
      fill: 'black'
    }, options );

    assert && assert( options.size.width >= options.size.height );

    super( 0, 0, options.size.width, options.size.height, options );
  }
}

sceneryPhet.register( 'MinusNode', MinusNode );
export default MinusNode;