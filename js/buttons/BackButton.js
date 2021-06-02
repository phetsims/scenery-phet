// Copyright 2014-2021, University of Colorado Boulder

/**
 * Button that is intended to indicate going backwards, much like the back button on a web browser.  It was originally
 * created for returning to the level selection screen when playing a game.  It looks like a button with an arrow
 * pointing to the left.
 *
 * @author John Blanco
 * @author Sam Reid
 */

import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import MultiClip from '../../../tambo/js/sound-generators/MultiClip.js';
import soundManager from '../../../tambo/js/soundManager.js';
import backButtonSound001 from '../../sounds/back-button-001_mp3.js';
import backButtonSound002 from '../../sounds/back-button-002_mp3.js';
import backButtonSound003 from '../../sounds/back-button-003_mp3.js';
import ArrowShape from '../ArrowShape.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

class BackButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // TODO: See https://github.com/phetsims/vegas/issues/91. The creation and registration of the sound player below is
    //       in a temporary state and will be finalized, probably into a shared sound player, once a sound has been
    //       chosen.
    const backButtonMultiClip = new MultiClip( new Map( [
      [ 0, backButtonSound001 ],
      [ 1, backButtonSound002 ],
      [ 2, backButtonSound003 ]
    ] ) );
    soundManager.addSoundGenerator( backButtonMultiClip );
    const backButtonSoundPlayer = {
      play() {
        backButtonMultiClip.playAssociatedSound( phet.vegas.soundIndexForBackButtonProperty.value );
      }
    };

    options = merge( {

      // Default margin values were set up to make this button match the size of the refresh button, since these
      // buttons often appear together.  See see https://github.com/phetsims/scenery-phet/issues/44.
      xMargin: 8,
      yMargin: 10.9,

      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // sound generation
      soundPlayer: backButtonSoundPlayer

    }, options );

    const arrowShape = new ArrowShape( 0, 0, -28.5, 0, {
      tailWidth: 8,
      headWidth: 18,
      headHeight: 15
    } );

    super( merge( {
      content: new Path( arrowShape, { fill: 'black' } )
    }, options ) );
  }
}

sceneryPhet.register( 'BackButton', BackButton );
export default BackButton;