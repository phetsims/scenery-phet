// Copyright 2015-2020, University of Colorado Boulder

/**
 * Close button, red with a white 'X'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */

import Shape from '../../../kite/js/Shape.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options] - see RectangularPushButton
 * @constructor
 */
function CloseButton( options ) {
  options = merge( {
    iconLength: 8, // {number} length of the 'X' icon, whose bounds are square
    iconLineWidth: 2.5, // {number} lineWidth for the 'X' icon
    xMargin: 4, // {number} x margin around the icon
    yMargin: 4, // {number} y margin around the icon
    listener: null // {function} called when the button is pressed
  }, options );

  // color is standardized, not configurable
  options.baseColor = PhetColorScheme.RED_COLORBLIND;

  // 'X' icon
  options.content = new Path( new Shape()
    .moveTo( -options.iconLength, -options.iconLength )
    .lineTo( options.iconLength, options.iconLength )
    .moveTo( options.iconLength, -options.iconLength )
    .lineTo( -options.iconLength, options.iconLength ), {
    stroke: 'white', // color is standardized, not configurable
    lineWidth: options.iconLineWidth
  } );

  RectangularPushButton.call( this, options );
}

sceneryPhet.register( 'CloseButton', CloseButton );

inherit( RectangularPushButton, CloseButton );
export default CloseButton;