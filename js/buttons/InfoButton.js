// Copyright 2018-2021, University of Colorado Boulder

/**
 * Standard PhET button for 'info', uses the international symbol for 'information'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import infoCircleSolidShape from '../../../sherpa/js/fontawesome-5/infoCircleSolidShape.js';
import RoundPushButton from '../../../sun/js/buttons/RoundPushButton.js';
import sceneryPhet from '../sceneryPhet.js';

class InfoButton extends RoundPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      xMargin: 10,
      yMargin: 10,
      touchAreaXDilation: 10,
      touchAreaYDilation: 5,
      baseColor: 'rgb( 238, 238, 238 )',
      iconFill: 'black'
    }, options );

    assert && assert( !options.content, 'InfoButton sets content' );
    options.content = new Path( infoCircleSolidShape, {
      scale: 0.08,
      fill: options.iconFill
    } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'InfoButton', this );
  }
}

sceneryPhet.register( 'InfoButton', InfoButton );
export default InfoButton;