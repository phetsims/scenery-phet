// Copyright 2016-2021, University of Colorado Boulder

/**
 * A general button, typically used to reset something.
 * Drawn programmatically, does not use any image files.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Matrix3 from '../../../dot/js/Matrix3.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RoundPushButton from '../../../sun/js/buttons/RoundPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ResetShape from '../ResetShape.js';
import sceneryPhet from '../sceneryPhet.js';

class ResetButton extends RoundPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // radius is used in computation of defaults for other options
    const BUTTON_RADIUS = ( options && options.radius ) ? options.radius : 24;

    options = merge( {
      baseColor: 'white',
      arrowColor: 'black',
      radius: BUTTON_RADIUS,
      xMargin: 6,
      yMargin: 6,

      // NOTE: this should be handled by RoundButton.ThreeDAppearanceStrategy, see https://github.com/phetsims/sun/issues/236
      // The icon doesn't look right when perfectly centered, account for that here, and see docs in RoundButton.
      // The multiplier values were empirically determined.
      xContentOffset: -0.03 * BUTTON_RADIUS,
      yContentOffset: -0.0125 * BUTTON_RADIUS,

      tandem: Tandem.REQUIRED
    }, options );

    // icon, with bounds adjusted so that center of circle appears to be centered on button, see sun#235
    const resetIcon = new Path( new ResetShape( options.radius ), { fill: options.arrowColor } );
    const reflectedIcon = new Path( resetIcon.shape.transformed( Matrix3.scaling( -1, -1 ) ) );
    resetIcon.localBounds = resetIcon.localBounds.union( reflectedIcon.localBounds );

    assert && assert( !options.content, 'content is not customizable' );
    options.content = resetIcon;

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ResetButton', this );
  }
}

sceneryPhet.register( 'ResetButton', ResetButton );
export default ResetButton;