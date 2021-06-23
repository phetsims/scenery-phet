// Copyright 2014-2021, University of Colorado Boulder

/**
 * A round toggle button that displays some custom icon when playing and a triangular "Play" icon when not playing.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import globalKeyStateTracker from '../../../scenery/js/accessibility/globalKeyStateTracker.js';
import KeyboardUtils from '../../../scenery/js/accessibility/KeyboardUtils.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRoundToggleButton from '../../../sun/js/buttons/BooleanRoundToggleButton.js';
import pauseSoundPlayer from '../../../tambo/js/shared-sound-players/pauseSoundPlayer.js';
import playSoundPlayer from '../../../tambo/js/shared-sound-players/playSoundPlayer.js';
import PlayIconShape from '../PlayIconShape.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';

class PlayControlButton extends BooleanRoundToggleButton {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Node} endPlayingIcon - icon for the button when pressing it will stop play
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, endPlayingIcon, options ) {
    options = merge( {

      // {number}
      radius: SceneryPhetConstants.PLAY_CONTROL_BUTTON_RADIUS,

      // It's dimensions are calculated dynamically based on radius below to make sure the play and pause buttons are
      // in sync.
      xMargin: 0,
      yMargin: 0,

      // {number} - Scale factor applied to the button when the "Play" button is shown (isPlayingProperty is false).
      // PhET convention is to increase the size of the "Play" button when interaction with the sim does NOT unpause
      // the sim.
      scaleFactorWhenNotPlaying: 1,

      // sound generation
      valueOffSoundPlayer: pauseSoundPlayer,
      valueOnSoundPlayer: playSoundPlayer,

      // pdom
      // {boolean} - If true, listener is added to toggle isPlayingProperty with key command "alt + k" regardless
      // of where focus is in the document
      includeGlobalHotkey: false,

      // {string|null} - Label for the button in the PDOM when the button will set isPlayingProperty to true
      startPlayingLabel: sceneryPhetStrings.a11y.playControlButton.play,

      // {string|null} - Label for the button in the PDOM when the button will set isPlayingProperty to false
      endPlayingLabel: null
    }, options );

    assert && assert( options.scaleFactorWhenNotPlaying > 0, 'button scale factor must be greater than 0' );

    // play and pause icons are sized relative to the radius
    const playWidth = options.radius * 0.8;
    const playHeight = options.radius;

    const playPath = new Path( new PlayIconShape( playWidth, playHeight ), {
      fill: 'black',
      centerX: options.radius * 0.05, // move to right slightly since we don't want it exactly centered
      centerY: 0
    } );

    // put the play and stop symbols inside circles so they have the same bounds,
    // otherwise BooleanToggleNode will re-adjust their positions relative to each other
    const playCircle = new Circle( options.radius, {
      children: [ playPath ]
    } );

    endPlayingIcon.centerX = 0;
    endPlayingIcon.centerY = 0;

    const endPlayingCircle = new Circle( options.radius, {
      children: [ endPlayingIcon ]
    } );

    super( endPlayingCircle, playCircle, isPlayingProperty, options );

    const isPlayingListener = ( isPlaying, oldValue ) => {

      // pdom - accessible name for the button
      this.innerContent = isPlaying ? options.endPlayingLabel
                                    : options.startPlayingLabel;

      // so we don't scale down the button immediately if isPlayingProperty is initially false
      const runningScale = oldValue === null ? 1 : 1 / options.scaleFactorWhenNotPlaying;
      this.scale( isPlaying ? runningScale : options.scaleFactorWhenNotPlaying );
    };
    isPlayingProperty.link( isPlayingListener );

    // a listener that toggles the isPlayingProperty with hotkey Alt+K, regardless of where focus is in the document
    let globalKeyboardListener;
    if ( options.includeGlobalHotkey ) {
      globalKeyboardListener = event => {

        // Only enabled if the sim supports interactive descriptions, and this Node is in the PDOM.
        if (
          phet.chipper.queryParameters.supportsInteractiveDescription &&
          this.pdomDisplayed &&
          this.buttonModel.enabledProperty.get() &&
          globalKeyStateTracker.altKeyDown &&
          KeyboardUtils.isKeyEvent( event, KeyboardUtils.KEY_K )
        ) {
          isPlayingProperty.set( !isPlayingProperty.get() );

          const soundPlayer = isPlayingProperty.get() ? options.valueOnSoundPlayer : options.valueOffSoundPlayer;
          if ( soundPlayer ) { soundPlayer.play(); }
        }
      };
      globalKeyStateTracker.keyupEmitter.addListener( globalKeyboardListener );
    }

    // @private
    this.disposePlayStopButton = () => {
      if ( isPlayingProperty.hasListener( isPlayingListener ) ) {
        isPlayingProperty.unlink( isPlayingListener );
      }
      if ( globalKeyStateTracker.keyupEmitter.hasListener( globalKeyboardListener ) ) {
        globalKeyStateTracker.keyupEmitter.removeListener( globalKeyboardListener );
      }
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposePlayStopButton();
    super.dispose();
  }
}

sceneryPhet.register( 'PlayControlButton', PlayControlButton );
export default PlayControlButton;