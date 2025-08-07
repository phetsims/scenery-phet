// Copyright 2014-2025, University of Colorado Boulder

/**
 * Button that is intended to indicate going backwards, much like the back button on a web browser.  It was originally
 * created for returning to the level selection screen when playing a game.  It looks like a button with an arrow
 * pointing to the left.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import sharedSoundPlayers from '../../../tambo/js/sharedSoundPlayers.js';
import TSoundPlayer from '../../../tambo/js/TSoundPlayer.js';
import ArrowShape from '../ArrowShape.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  soundPlayer?: TSoundPlayer;
};

export type BackButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class BackButton extends RectangularPushButton {

  public constructor( providedOptions?: BackButtonOptions ) {

    const options = optionize<BackButtonOptions, StrictOmit<SelfOptions, 'soundPlayer'>, RectangularPushButtonOptions>()( {

      // Default margin values were set up to make this button match the size of the refresh button, since these
      // buttons often appear together.  See https://github.com/phetsims/scenery-phet/issues/44.
      xMargin: 8,
      yMargin: 10.9,

      baseColor: PhetColorScheme.BUTTON_YELLOW,
      soundPlayer: sharedSoundPlayers.get( 'goBack' )

    }, providedOptions );

    const arrowShape = new ArrowShape( 0, 0, -28.5, 0, {
      tailWidth: 8,
      headWidth: 18,
      headHeight: 15
    } );
    options.content = new Path( arrowShape, { fill: 'black' } );

    super( options );
  }
}

sceneryPhet.register( 'BackButton', BackButton );