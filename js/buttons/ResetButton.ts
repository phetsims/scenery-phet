// Copyright 2016-2022, University of Colorado Boulder

/**
 * A general button, typically used to reset something.
 * Drawn programmatically, does not use any image files.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Matrix3 from '../../../dot/js/Matrix3.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../../phet-core/js/optionize.js';
import { TColor, Path } from '../../../scenery/js/imports.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../sun/js/buttons/RoundPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ResetShape from '../ResetShape.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  radius?: number;
  arrowColor?: TColor;
};

export type ResetButtonOptions = SelfOptions & StrictOmit<RoundPushButtonOptions, 'content'>;

export default class ResetButton extends RoundPushButton {

  public constructor( providedOptions?: ResetButtonOptions ) {

    // radius is used in computation of defaults for other options
    const BUTTON_RADIUS = ( providedOptions && providedOptions.radius ) ? providedOptions.radius : 24;

    const options = optionize<ResetButtonOptions, SelfOptions, RoundPushButtonOptions>()( {

      // SelfOptions
      radius: BUTTON_RADIUS,
      arrowColor: 'black',

      // RoundPushButtonOptions
      baseColor: 'white',
      xMargin: 6,
      yMargin: 6,

      // NOTE: this should be handled by RoundButton.ThreeDAppearanceStrategy, see https://github.com/phetsims/sun/issues/236
      // The icon doesn't look right when perfectly centered, account for that here, and see docs in RoundButton.
      // The multiplier values were empirically determined.
      xContentOffset: -0.03 * BUTTON_RADIUS,
      yContentOffset: -0.0125 * BUTTON_RADIUS,

      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'ResetButton'
    }, providedOptions );

    // icon, with bounds adjusted so that center of circle appears to be centered on button, see sun#235
    const resetShape = new ResetShape( options.radius );
    const resetIcon = new Path( resetShape, { fill: options.arrowColor } );
    const reflectedIcon = new Path( resetShape.transformed( Matrix3.scaling( -1, -1 ) ) );
    resetIcon.localBounds = resetIcon.localBounds.union( reflectedIcon.localBounds );

    options.content = resetIcon;

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ResetButton', this );
  }
}

sceneryPhet.register( 'ResetButton', ResetButton );