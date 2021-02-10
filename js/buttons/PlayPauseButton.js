// Copyright 2014-2020, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundPushButton (as opposed to using raster images).
 *
 * @author Sam Reid
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import globalKeyStateTracker from '../../../scenery/js/accessibility/globalKeyStateTracker.js';
import KeyboardUtils from '../../../scenery/js/accessibility/KeyboardUtils.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRoundToggleButton from '../../../sun/js/buttons/BooleanRoundToggleButton.js';
import pauseSoundPlayer from '../../../tambo/js/shared-sound-players/pauseSoundPlayer.js';
import playSoundPlayer from '../../../tambo/js/shared-sound-players/playSoundPlayer.js';
import PauseIconShape from '../PauseIconShape.js';
import PlayIconShape from '../PlayIconShape.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';

class PlayPauseButton extends BooleanRoundToggleButton {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, options ) {

    options = merge( {
      radius: 28,

      // It's dimensions are calculated dynamically based on radius below to make sure the play and pause buttons are
      // in sync.
      xMargin: 0,
      yMargin: 0,

      // {number} - Scale factor applied to the button when the "Play" button is shown (isPlayingProperty is false).
      // PhET convention is to increase the size of the "Play" button when interaction with the sim does NOT unpause
      // the sim.
      scaleFactorWhenPaused: 1,

      // sound generation
      valueOffSoundPlayer: pauseSoundPlayer,
      valueOnSoundPlayer: playSoundPlayer,

      // pdom
      // {boolean} - If true, listener is added to toggle isPlayingProperty with key command "alt + k" regardless
      // of where focus is in the document
      includeGlobalHotKey: true
    }, options );

    assert && assert( options.scaleFactorWhenPaused > 0, 'button scale factor must be greater than 0' );

    // play and pause icons are sized relative to the radius
    const playHeight = options.radius;
    const playWidth = options.radius * 0.8;
    const playPath = new Path( new PlayIconShape( playWidth, playHeight ), { fill: 'black' } );
    const pausePath = new Path( new PauseIconShape( 0.75 * playWidth, playHeight ), { fill: 'black' } );

    // put the play and pause symbols inside circles so they have the same bounds,
    // otherwise BooleanToggleNode will re-adjust their positions relative to each other
    const playCircle = new Circle( options.radius );
    playPath.centerX = options.radius * 0.05; // move to right slightly since we don't want it exactly centered
    playPath.centerY = 0;
    playCircle.addChild( playPath );

    const pausedCircle = new Circle( options.radius );
    pausePath.centerX = 0;
    pausePath.centerY = 0;
    pausedCircle.addChild( pausePath );

    super( pausedCircle, playCircle, isPlayingProperty, options );

    // @private
    this.isPlayingProperty = isPlayingProperty;

    // a listener that toggles the isPlayingProperty with a hotkey, regardless of where focus is in the document
    let globalKeyboardListener;
    if ( options.includeGlobalHotKey ) {
      globalKeyboardListener = event => {

        // only enabled if the sim supports interactive descriptions
        if ( phet.joist.sim.supportsInteractiveDescriptions ) {
          if ( this.buttonModel.enabledProperty.get() ) {
            if ( event.keyCode === KeyboardUtils.KEY_K && globalKeyStateTracker.altKeyDown ) {

              // only allow hotkey if this Node is accessibleDisplayed, so it cannot be used if removed from PDOM
              if ( this.accessibleDisplayed ) {
                isPlayingProperty.set( !isPlayingProperty.get() );

                const soundPlayer = isPlayingProperty.get() ? options.valueOnSoundPlayer : options.valueOffSoundPlayer;
                if ( soundPlayer ) { soundPlayer.play(); }
              }
            }
          }
        }
      };
      globalKeyStateTracker.keyupEmitter.addListener( globalKeyboardListener );
    }

    const isPlayingListener = ( isPlaying, oldValue ) => {

      // so we don't scale down the button immediately if isPlayingProperty is initially false
      const runningScale = oldValue === null ? 1 : 1 / options.scaleFactorWhenPaused;
      this.scale( isPlaying ? runningScale : options.scaleFactorWhenPaused );

      // PDOM - accessible name for the button
      this.innerContent = isPlaying ? sceneryPhetStrings.a11y.playPauseButton.pause
                                    : sceneryPhetStrings.a11y.playPauseButton.play;
    };
    isPlayingProperty.link( isPlayingListener );

    // @private
    this.disposePlayPauseButton = () => {
      if ( isPlayingProperty.hasListener( isPlayingListener ) ) {
        isPlayingProperty.unlink( isPlayingListener );
      }
      if ( globalKeyStateTracker.keyupEmitter.hasListener( globalKeyboardListener ) ) {
        globalKeyStateTracker.keyupEmitter.removeListener( globalKeyboardListener );
      }
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'PlayPauseButton', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposePlayPauseButton();
    super.dispose();
  }
}

sceneryPhet.register( 'PlayPauseButton', PlayPauseButton );
export default PlayPauseButton;