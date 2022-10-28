// Copyright 2022, University of Colorado Boulder

/**
 * UndoButton is a push button for undoing a previous operation.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import sceneryPhet from '../../../scenery-phet/js/sceneryPhet.js';
import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import UndoIcon, { UndoIconOptions } from '../UndoIcon.js';
import PhetColorScheme from '../PhetColorScheme.js';

type SelfOptions = {
  iconOptions?: UndoIconOptions;
};

export type UndoButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class UndoButton extends RectangularPushButton {

  public constructor( providedOptions?: UndoButtonOptions ) {

    const options = optionize<UndoButtonOptions, StrictOmit<SelfOptions, 'iconOptions'>, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      xMargin: 5,
      yMargin: 5,
      baseColor: PhetColorScheme.BUTTON_YELLOW
    }, providedOptions );

    options.content = new UndoIcon( options.iconOptions );

    super( options );
  }
}

sceneryPhet.register( 'UndoButton', UndoButton );