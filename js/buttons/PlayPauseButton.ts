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
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
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
    let ownedAccessibleContextResponseProperty: TReadOnlyProperty<string> | null = null;
    if ( providedOptions === undefined || !providedOptions.accessibleContextResponse ) {
      ownedAccessibleContextResponseProperty = new DerivedProperty(
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
      accessibleContextResponse: ownedAccessibleContextResponseProperty || providedOptions!.accessibleContextResponse!
    }, providedOptions );

    // icon sized relative to the radius
    const pauseHeight = options.radius;
    const pauseWidth = options.radius * 0.6;
    const pausePath = new Path( new PauseIconShape( pauseWidth, pauseHeight ), { fill: 'black' } );

    super( isPlayingProperty, pausePath, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'PlayPauseButton', this );

    if ( ownedAccessibleContextResponseProperty ) {
      this.addDisposable( ownedAccessibleContextResponseProperty );
    }
  }
}

sceneryPhet.register( 'PlayPauseButton', PlayPauseButton );