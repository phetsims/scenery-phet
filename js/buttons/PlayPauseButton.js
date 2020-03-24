// Copyright 2014-2020, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundPushButton (as opposed to using raster images).
 *
 * @author Sam Reid
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRoundToggleButton from '../../../sun/js/buttons/BooleanRoundToggleButton.js';
import pauseSoundPlayer from '../../../tambo/js/shared-sound-players/pauseSoundPlayer.js';
import playSoundPlayer from '../../../tambo/js/shared-sound-players/playSoundPlayer.js';
import PauseIconShape from '../PauseIconShape.js';
import PlayIconShape from '../PlayIconShape.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';

// constants
const playString = sceneryPhetStrings.a11y.playPauseButton.play;
const pauseString = sceneryPhetStrings.a11y.playPauseButton.pause;

const DEFAULT_RADIUS = 28;

/**
 * @param {Property.<boolean>} isPlayingProperty
 * @param {Object} [options]
 * @constructor
 */
function PlayPauseButton( isPlayingProperty, options ) {
  const self = this;

  options = merge( {
    radius: DEFAULT_RADIUS,

    // {number} - Scale factor applied to the button when the "Play" button is shown (isPlayingProperty is false).
    // PhET convention is to increase the size of the "Play" button when interaction with the sim does NOT unpause
    // the sim.
    scaleFactorWhenPaused: 1,

    // sound generation
    valueOffSoundPlayer: pauseSoundPlayer,
    valueOnSoundPlayer: playSoundPlayer

  }, options );

  assert && assert( options.scaleFactorWhenPaused > 0, 'button scale factor must be greater than 0' );

  this.isPlayingProperty = isPlayingProperty; // @private

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

  BooleanRoundToggleButton.call( this, pausedCircle, playCircle, isPlayingProperty, options );

  const isPlayingListener = function( running, oldValue ) {

    // so we don't scale down the button immediately if isPlayingProperty is initially false
    const runningScale = oldValue === null ? 1 : 1 / options.scaleFactorWhenPaused;
    self.scale( running ? runningScale : options.scaleFactorWhenPaused );

    // PDOM - accessible name for the button
    self.innerContent = running ? pauseString : playString;
  };
  isPlayingProperty.link( isPlayingListener );

  // @private
  this.disposePlayPauseButton = function() {
    if ( isPlayingProperty.hasListener( isPlayingListener ) ) {
      isPlayingProperty.unlink( isPlayingListener );
    }
  };

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'PlayPauseButton', this );
}

sceneryPhet.register( 'PlayPauseButton', PlayPauseButton );

export default inherit( BooleanRoundToggleButton, PlayPauseButton, {

  /**
   * @public
   * @override
   */
  dispose: function() {
    this.disposePlayPauseButton();
    BooleanRoundToggleButton.prototype.dispose.call( this );
  }
} );