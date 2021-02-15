// Copyright 2014-2020, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundPushButton (as opposed to using raster images).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import PauseIconShape from '../PauseIconShape.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import PlayControlButton from './PlayControlButton.js';

class PlayPauseButton extends PlayControlButton {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, options ) {

    options = merge( {

      // {number}
      radius: SceneryPhetConstants.PLAY_CONTROL_BUTTON_RADIUS,

      // {number} - Scale factor applied to the button when the "Play" button is shown (isPlayingProperty is false).
      // PhET convention is to increase the size of the "Play" button when interaction with the sim does NOT unpause
      // the sim.
      scaleFactorWhenPaused: 1,

      // ny default the PlayPauseButton adds a global key command that will toggle the isPlayingProperty
      includeGlobalHotKey: true
    }, options );

    assert && assert( options.scaleFactorWhenPaused > 0, 'button scale factor must be greater than 0' );

    // icon sized relative to the radius
    const pauseHeight = options.radius;
    const pauseWidth = options.radius * 0.6;
    const pausePath = new Path( new PauseIconShape( pauseWidth, pauseHeight ), { fill: 'black' } );

    super( isPlayingProperty, pausePath, options );

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