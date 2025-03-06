// Copyright 2022-2025, University of Colorado Boulder

/**
 * PlayPauseStepButtonGroup has a play & pause button, optional step-forward button, and optional step-back button.
 * It's typically a subcomponent of TimeControlNode, and was originally an inner class of TimeControlNode.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Property from '../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import { RemoveParallelDOMOptions } from '../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import HBox, { HBoxOptions } from '../../../scenery/js/layout/nodes/HBox.js';
import Tandem from '../../../tandem/js/Tandem.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import PlayPauseButton, { PlayPauseButtonOptions } from './PlayPauseButton.js';
import StepBackwardButton, { StepBackwardButtonOptions } from './StepBackwardButton.js';
import StepForwardButton, { StepForwardButtonOptions } from './StepForwardButton.js';

const DEFAULT_STEP_BUTTON_RADIUS = 15;
const DEFAULT_STEP_BUTTON_TOUCH_AREA_DILATION = 5;

type SelfOptions = {

  // if true, a StepForwardButton is included in the button group
  includeStepForwardButton?: boolean;

  // if true, a StepBackwardButton is included in the button group
  includeStepBackwardButton?: boolean;

  // horizontal space between Play/Pause and Step buttons
  playPauseStepXSpacing?: number;

  // options for button subcomponents
  playPauseButtonOptions?: StrictOmit<PlayPauseButtonOptions, 'tandem' | 'phetioDocumentation'>;
  stepForwardButtonOptions?: StrictOmit<StepForwardButtonOptions, 'tandem' | 'phetioDocumentation'>;
  stepBackwardButtonOptions?: StrictOmit<StepBackwardButtonOptions, 'tandem' | 'phetioDocumentation'>;

  // pdom - Strings used for the help text of this button group in the playing and paused states. If not provided,
  // default help text will be used when a step button is visible.
  playingHelpText?: string | TReadOnlyProperty<string> | null;
  pausedHelpText?: string | TReadOnlyProperty<string> | null;
};

export type PlayPauseStepButtonGroupOptions = SelfOptions & StrictOmit<RemoveParallelDOMOptions<HBoxOptions>, 'spacing' | 'children'>;

export default class PlayPauseStepButtonGroup extends HBox {

  // Public to help with positioning
  public readonly playPauseButton: PlayPauseButton;

  private readonly disposePlayPauseStepButtonGroup: () => void;

  public constructor( isPlayingProperty: Property<boolean>, providedOptions?: PlayPauseStepButtonGroupOptions ) {

    const options = optionize<PlayPauseStepButtonGroupOptions, SelfOptions, HBoxOptions>()( {

      // {boolean} - if true, a StepForwardButton is included in the button group
      includeStepForwardButton: true,

      // {boolean} - if true, a StepBackwardButton is included in the button group
      includeStepBackwardButton: false,

      // {number} horizontal space between Play/Pause and Step buttons
      playPauseStepXSpacing: 10,

      // Options for the PlayPauseButton
      playPauseButtonOptions: {
        radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS,
        touchAreaDilation: 5
      },

      // Options for the StepBackwardButton
      stepBackwardButtonOptions: {
        radius: DEFAULT_STEP_BUTTON_RADIUS,
        touchAreaDilation: DEFAULT_STEP_BUTTON_TOUCH_AREA_DILATION
      },

      // Options for the StepForwardButton
      stepForwardButtonOptions: {
        radius: DEFAULT_STEP_BUTTON_RADIUS,
        touchAreaDilation: DEFAULT_STEP_BUTTON_TOUCH_AREA_DILATION
      },

      // HBoxOptions
      resize: false, // don't change layout if playPauseButton resizes with scaleFactorWhenNotPlaying

      // phet-io
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'ButtonGroup',

      // pdom
      tagName: 'div', // so that it can receive descriptions
      appendDescription: true,
      playingHelpText: null,
      pausedHelpText: null,

      phetioEnabledPropertyInstrumented: true
    }, providedOptions );

    // by default, the step buttons are enabled when isPlayingProperty is false, but only create a PhET-iO instrumented
    // Property if it is going to be used
    if ( ( !options.stepForwardButtonOptions.enabledProperty ) || ( !options.stepBackwardButtonOptions.enabledProperty ) ) {

      // This is clearer than having the variable names match exactly. Opt out below
      const stepButtonEnabledProperty = DerivedProperty.not( isPlayingProperty );

      if ( !options.stepForwardButtonOptions.enabledProperty ) {

        options.stepForwardButtonOptions.enabledProperty = stepButtonEnabledProperty;
      }
      if ( !options.stepBackwardButtonOptions.enabledProperty ) {

        options.stepBackwardButtonOptions.enabledProperty = stepButtonEnabledProperty;
      }
    }

    const children = [];

    const playPauseButton = new PlayPauseButton( isPlayingProperty,
      combineOptions<PlayPauseButtonOptions>( {
        tandem: options.tandem.createTandem( 'playPauseButton' ),
        phetioDocumentation: 'Button to control the animation in the simulation. This will also stop the model from stepping.'
      }, options.playPauseButtonOptions ) );
    children.push( playPauseButton );

    let stepForwardButton: StepForwardButton | null = null;
    if ( options.includeStepForwardButton ) {
      stepForwardButton = new StepForwardButton(
        combineOptions<StepForwardButtonOptions>( {
          tandem: options.tandem.createTandem( 'stepForwardButton' ),
          phetioDocumentation: 'Progress the simulation a single model step forwards.'
        }, options.stepForwardButtonOptions ) );
      children.push( stepForwardButton );
    }

    let stepBackwardButton: StepBackwardButton | null = null;
    if ( options.includeStepBackwardButton ) {
      stepBackwardButton = new StepBackwardButton(
        combineOptions<StepBackwardButtonOptions>( {
          phetioDocumentation: 'Progress the simulation a single model step backwards.',
          tandem: options.tandem.createTandem( 'stepBackwardButton' )
        }, options.stepBackwardButtonOptions ) );
      children.unshift( stepBackwardButton );
    }

    options.spacing = options.playPauseStepXSpacing;
    options.children = children;

    super( options );

    this.playPauseButton = playPauseButton;

    // pdom - Always use the provided help text. If not provided, a default string describes how to step forward and backward
    // when paused. The default accessibleHelpText will only be used if a step button is visible.
    const eitherStepButtonVisible = options.includeStepForwardButton || options.includeStepBackwardButton;
    const playingHelpText = options.playingHelpText || ( eitherStepButtonVisible
                                                         ? SceneryPhetStrings.a11y.playPauseStepButtonGroup.playingHelpTextStringProperty
                                                         : null );

    const pausedHelpText = options.pausedHelpText || ( eitherStepButtonVisible
                                                       ? SceneryPhetStrings.a11y.playPauseStepButtonGroup.pausedHelpTextStringProperty
                                                       : null );

    const playingListener = ( playing: boolean ) => {
      this.accessibleHelpText = playing ? playingHelpText : pausedHelpText;
    };
    isPlayingProperty.link( playingListener );

    this.disposePlayPauseStepButtonGroup = () => {
      isPlayingProperty.unlink( playingListener );

      playPauseButton.dispose();
      stepForwardButton && stepForwardButton.dispose();
      stepBackwardButton && stepBackwardButton.dispose();
    };
  }

  /**
   * Get the center of the PlayPauseButton, in the local coordinate frame of the PlayPauseStepButtonGroup.
   */
  public getPlayPauseButtonCenter(): Vector2 {
    return this.playPauseButton.center;
  }

  public override dispose(): void {
    this.disposePlayPauseStepButtonGroup();
    super.dispose();
  }
}

sceneryPhet.register( 'PlayPauseStepButtonGroup', PlayPauseStepButtonGroup );