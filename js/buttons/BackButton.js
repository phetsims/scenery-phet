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
import SoundClip from '../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../tambo/js/soundManager.js';
import goBackSound from '../../sounds/go-back_mp3.js';
import ArrowShape from '../ArrowShape.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

class BackButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Default margin values were set up to make this button match the size of the refresh button, since these
      // buttons often appear together.  See see https://github.com/phetsims/scenery-phet/issues/44.
      xMargin: 8,
      yMargin: 10.9,

      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // sound generation, default sound player will be created if nothing is provided
      soundPlayer: null

    }, options );

    const arrowShape = new ArrowShape( 0, 0, -28.5, 0, {
      tailWidth: 8,
      headWidth: 18,
      headHeight: 15
    } );

    // Create and add the default sound generator if none was provided.
    if ( !options.soundPlayer ) {
      const goBackSoundClip = new SoundClip( goBackSound, { initialOutputLevel: 0.35 } );
      soundManager.addSoundGenerator( goBackSoundClip );
      options.soundPlayer = goBackSoundClip;
    }

    super( merge( {
      content: new Path( arrowShape, { fill: 'black' } )
    }, options ) );
  }
}

sceneryPhet.register( 'BackButton', BackButton );
export default BackButton;