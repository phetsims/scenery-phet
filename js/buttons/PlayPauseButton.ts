// Copyright 2014-2025, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundPushButton (as opposed to using raster images).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Property from '../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Path from '../../../scenery/js/nodes/Path.js';
import PauseIconShape from '../PauseIconShape.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import PlayControlButton, { PlayControlButtonOptions } from './PlayControlButton.js';

type SelfOptions = EmptySelfOptions;

export type PlayPauseButtonOptions = SelfOptions & PlayControlButtonOptions;

export default class PlayPauseButton extends PlayControlButton {

  public constructor( isPlayingProperty: Property<boolean>, providedOptions?: PlayPauseButtonOptions ) {

    // Only create the Property if necessary.
    let contextResponseProperty = providedOptions?.accessibleContextResponse;
    const ownsContextResponseProperty = !contextResponseProperty;
    if ( ownsContextResponseProperty ) {
      contextResponseProperty = new DerivedProperty(
        [ isPlayingProperty,
          SceneryPhetStrings.a11y.playPauseButton.playingAccessibleContextResponseStringProperty,
          SceneryPhetStrings.a11y.playPauseButton.pausedAccessibleContextResponseStringProperty
        ],
        ( isPlaying, playingContextResponse, pausedContextResponse ) => isPlaying ? playingContextResponse : pausedContextResponse
      );
    }

    const options = optionize<PlayPauseButtonOptions, SelfOptions, PlayControlButtonOptions>()( {

      // PlayPauseButtonOptions
      radius: SceneryPhetConstants.PLAY_CONTROL_BUTTON_RADIUS,

      // PlayControlButtonOptions
      includeGlobalHotkey: true,
      endPlayingAccessibleName: SceneryPhetStrings.a11y.playControlButton.pauseStringProperty,
      accessibleContextResponse: contextResponseProperty,

      // For this button, do not speak the voicing name when it is pressed because the context responses are clearer without it.
      // Otherwise, it says "Play, Sim Paused."
      speakVoicingNameResponseOnFire: false
    }, providedOptions );

    // icon sized relative to the radius
    const pauseHeight = options.radius;
    const pauseWidth = options.radius * 0.6;
    const pausePath = new Path( new PauseIconShape( pauseWidth, pauseHeight ), { fill: 'black' } );

    super( isPlayingProperty, pausePath, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'PlayPauseButton', this );

    if ( ownsContextResponseProperty ) {
      this.addDisposable( contextResponseProperty as TReadOnlyProperty<string> );
    }
  }
}

sceneryPhet.register( 'PlayPauseButton', PlayPauseButton );