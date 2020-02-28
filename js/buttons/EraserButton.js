// Copyright 2014-2020, University of Colorado Boulder

/**
 * Button with an eraser icon.
 *
 * @author John Blanco
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import eraserImage from '../../images/eraser_png.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function EraserButton( options ) {

  options = merge( {
    baseColor: PhetColorScheme.BUTTON_YELLOW,
    iconWidth: 20 // width of eraser icon, used for scaling, the aspect ratio will determine height
  }, options );

  // eraser icon
  options.content = new Image( eraserImage );
  options.content.scale( options.iconWidth / options.content.width );

  RectangularPushButton.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EraserButton', this );
}

sceneryPhet.register( 'EraserButton', EraserButton );

inherit( RectangularPushButton, EraserButton );
export default EraserButton;