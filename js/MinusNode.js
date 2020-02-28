// Copyright 2014-2020, University of Colorado Boulder

/**
 * Minus sign, created using scenery.Rectangle because scenery.Text("-") looks awful on Windows and cannot be accurately
 * centered. The origin is at the upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function MinusNode( options ) {

  options = merge( {
    size: new Dimension2( 20, 5 ),
    fill: 'black'
  }, options );

  assert && assert( options.size.width >= options.size.height );

  Rectangle.call( this, 0, 0, options.size.width, options.size.height, options );
}

sceneryPhet.register( 'MinusNode', MinusNode );

inherit( Rectangle, MinusNode );
export default MinusNode;