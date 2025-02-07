// Copyright 2022-2025, University of Colorado Boulder

/**
 * CameraButton is a push button with a camera icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Path from '../../../scenery/js/nodes/Path.js';
import TColor from '../../../scenery/js/util/TColor.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import cameraSolidShape from '../../../sun/js/shapes/cameraSolidShape.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  iconFill?: TColor;
  iconScale?: number;
};

type CameraButtonOptions = SelfOptions &
  StrictOmit<RectangularPushButtonOptions, 'content'> &
  PickRequired<RectangularPushButtonOptions, 'tandem'>;

export default class CameraButton extends RectangularPushButton {

  public constructor( providedOptions: CameraButtonOptions ) {

    const options = optionize<CameraButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // SelfOptions
      iconFill: 'black',
      iconScale: 0.587,

      // RectangularPushButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 8,
      yMargin: 4
    }, providedOptions );

    options.content = new Path( cameraSolidShape, {
      scale: options.iconScale,
      fill: options.iconFill
    } );

    super( options );
  }
}

sceneryPhet.register( 'CameraButton', CameraButton );