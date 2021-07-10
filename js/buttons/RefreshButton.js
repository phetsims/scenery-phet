// Copyright 2018-2021, University of Colorado Boulder

/**
 * Standard PhET button for 'refresh'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import syncAltSolidShape from '../../../sherpa/js/fontawesome-5/syncAltSolidShape.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

class RefreshButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      iconHeight: 35
    }, options );

    assert && assert( !options.content, 'RefreshButton sets content' );
    options.content = new Path( syncAltSolidShape, {
      fill: 'black'
    } );
    options.content.setScaleMagnitude( options.iconHeight / options.content.height );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RefreshButton', this );
  }
}

sceneryPhet.register( 'RefreshButton', RefreshButton );
export default RefreshButton;