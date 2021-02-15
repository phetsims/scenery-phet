// Copyright 2021, University of Colorado Boulder

/**
 * Button for starting/stopping some behavior. Unlike the PlayPauseButton, this indicates that play will re-start
 * from the beginning after switch from play to stop.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import StopIconShape from '../StopIconShape.js';
import PlayControlButton from './PlayControlButton.js';

class PlayStopButton extends PlayControlButton {

  /**
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( isPlayingProperty, options ) {
    options = merge( {

      // {number}
      radius: SceneryPhetConstants.PLAY_CONTROL_BUTTON_RADIUS,

      // pdom - label for the button when the "stop" icon is displayed
      endPlayingLabel: sceneryPhetStrings.a11y.playControlButton.stop
    }, options );

    // icon is sized relative to radius
    const stopWidth = options.radius * 0.75;
    const stopPath = new Path( new StopIconShape( stopWidth ), { fill: 'black' } );

    super( isPlayingProperty, stopPath, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'PlayStopButton', this );
  }
}

sceneryPhet.register( 'PlayStopButton', PlayStopButton );
export default PlayStopButton;