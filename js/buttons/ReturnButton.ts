// Copyright 2022-2024, University of Colorado Boulder

/**
 * ReturnButton is a push button for undoing a previous operation.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../../../scenery-phet/js/sceneryPhet.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import ReturnIcon, { ReturnIconOptions } from '../ReturnIcon.js';

type SelfOptions = {
  iconOptions?: ReturnIconOptions;
};

export type ReturnButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class ReturnButton extends RectangularPushButton {

  public constructor( providedOptions?: ReturnButtonOptions ) {

    const options = optionize<ReturnButtonOptions, StrictOmit<SelfOptions, 'iconOptions'>, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      xMargin: 5,
      yMargin: 5,
      baseColor: PhetColorScheme.BUTTON_YELLOW
    }, providedOptions );

    options.content = new ReturnIcon( options.iconOptions );

    super( options );
  }
}

sceneryPhet.register( 'ReturnButton', ReturnButton );