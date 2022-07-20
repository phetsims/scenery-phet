// Copyright 2014-2022, University of Colorado Boulder

/**
 * Button for returning to the level selection screen.
 *
 * @author John Blanco
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import { Path } from '../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import StarShape from '../StarShape.js';

type SelfOptions = EmptySelfOptions;

export type StarButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class StarButton extends RectangularPushButton {

  public constructor( providedOptions?: StarButtonOptions ) {

    const options = optionize<StarButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // Match the size of the star button to the refresh buttons, since they often appear together.
      // see https://github.com/phetsims/scenery-phet/issues/44
      xMargin: 8.134152255572697
    }, providedOptions );

    options.content = new Path( new StarShape(), { fill: 'black' } );

    super( options );
  }
}

sceneryPhet.register( 'StarButton', StarButton );