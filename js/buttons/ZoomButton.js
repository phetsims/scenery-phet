// Copyright 2014-2020, University of Colorado Boulder

/**
 * Zoom button, has an icon with a magnifying glass, with either a plus or minus sign in the center of the glass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import MagnifyingGlassNode from '../MagnifyingGlassNode.js';
import MinusNode from '../MinusNode.js';
import PhetColorScheme from '../PhetColorScheme.js';
import PlusNode from '../PlusNode.js';
import sceneryPhet from '../sceneryPhet.js';

class ZoomButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      in: true, // true: zoom-in button, false: zoom-out button
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      magnifyingGlassOptions: { glassRadius: 15 },
      tandem: Tandem.REQUIRED
    }, options );

    // plus or minus sign in middle of magnifying glass
    const signOptions = {
      size: new Dimension2( 1.3 * options.magnifyingGlassOptions.glassRadius, options.magnifyingGlassOptions.glassRadius / 3 )
    };

    const magnifyingGlassNode = new MagnifyingGlassNode( merge( {
      icon: options.in ? new PlusNode( signOptions ) : new MinusNode( signOptions )
    }, options.magnifyingGlassOptions ) );

    assert && assert( !options.content, 'ZoomButton sets content' );
    options.content = magnifyingGlassNode;

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ZoomButton', this );
  }
}

sceneryPhet.register( 'ZoomButton', ZoomButton );
export default ZoomButton;