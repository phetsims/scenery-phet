// Copyright 2018-2020, University of Colorado Boulder

/**
 * Standard PhET button for 'refresh'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import FontAwesomeNode from '../../../sun/js/FontAwesomeNode.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function RefreshButton( options ) {

  options = merge( {
    baseColor: PhetColorScheme.BUTTON_YELLOW,
    iconScale: 1
  }, options );

  assert && assert( !options.content, 'RefreshButton sets content' );
  options.content = new FontAwesomeNode( 'refresh', {
    scale: options.iconScale
  } );

  RectangularPushButton.call( this, options );

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RefreshButton', this );
}

sceneryPhet.register( 'RefreshButton', RefreshButton );

inherit( RectangularPushButton, RefreshButton );
export default RefreshButton;