// Copyright 2018-2022, University of Colorado Boulder

/**
 * TimeControlNode provides a UI for controlling time.  It includes a play/pause button, step-forward button,
 * optional step-backward button, and optional radio buttons for time speed. Various layouts are supported via options.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../axon/js/EnumerationProperty.js';
import Property from '../../axon/js/Property.js';
import Vector2 from '../../dot/js/Vector2.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import { HBox, HBoxOptions, Node, NodeOptions, SceneryConstants, Text, TextOptions } from '../../scenery/js/imports.js';
import { AquaRadioButtonGroupItem } from '../../sun/js/AquaRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../tandem/js/Tandem.js';
import BooleanIO from '../../tandem/js/types/BooleanIO.js';
import PlayPauseButton, { PlayPauseButtonOptions } from './buttons/PlayPauseButton.js';
import StepBackwardButton, { StepBackwardButtonOptions } from './buttons/StepBackwardButton.js';
import StepForwardButton, { StepForwardButtonOptions } from './buttons/StepForwardButton.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetConstants from './SceneryPhetConstants.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import TimeSpeed from './TimeSpeed.js';

// default speeds for SpeedRadioButtonGroup
const DEFAULT_TIME_SPEEDS = [ TimeSpeed.NORMAL, TimeSpeed.SLOW ];

// maps TimeSpeed to its label and Tandem name
const SPEED_LABEL_MAP = new Map();
SPEED_LABEL_MAP.set( TimeSpeed.FAST, { labelString: sceneryPhetStrings.speed.fast, tandemName: 'fastRadioButton' } );
SPEED_LABEL_MAP.set( TimeSpeed.NORMAL, { labelString: sceneryPhetStrings.speed.normal, tandemName: 'normalRadioButton' } );
SPEED_LABEL_MAP.set( TimeSpeed.SLOW, { labelString: sceneryPhetStrings.speed.slow, tandemName: 'slowRadioButton' } );

type SelfOptions = {

  // Play speed Property for the radio button group. If null, no radio buttons included in this control.
  timeSpeedProperty?: EnumerationProperty<TimeSpeed> | null;

  // Speeds supported by this TimeControlNode. Vertical radio buttons are created for each in the order provided.
  timeSpeeds?: TimeSpeed[];

  // true = speed radio buttons to left of push buttons
  // false = speed radio buttons to right of push buttons
  speedRadioButtonGroupOnLeft?: boolean;

  // horizontal space between PlayPauseStepButtons and SpeedRadioButtonGroup, if SpeedRadioButtonGroup is included
  buttonGroupXSpacing?: number;

  // options passed along to the PlayPauseStepButtons, see the inner class for defaults
  playPauseStepButtonOptions?: Omit<PlayPauseStepButtonsOptions, 'tandem'>;

  // options passed along to the SpeedRadioButtonGroup, if included
  speedRadioButtonGroupOptions?: Omit<SpeedRadioButtonGroupOptions, 'tandem'>;

  // if true, the SpeedRadioButtonGroup will be wrapped in a Panel
  wrapSpeedRadioButtonGroupInPanel?: boolean;

  // options passed to the panel wrapping SpeedRadioButtonGroup, if SpeedRadioButtonGroup included AND we are wrapping
  // them in a panel
  speedRadioButtonGroupPanelOptions?: PanelOptions;
};

export type TimeControlNodeOptions = SelfOptions & Omit<NodeOptions, 'children'>;

export default class TimeControlNode extends Node {

  // push button for play/pause and (optionally) step forward, step back
  private readonly playPauseStepButtons: PlayPauseStepButtons;

  // radio buttons from controlling speed
  private readonly speedRadioButtonGroup: SpeedRadioButtonGroup | null;

  // parent for speedRadioButtonGroup, optionally a Panel
  private readonly speedRadioButtonGroupParent: Node | Panel | null;

  // whether the radio buttons are to the left or right of the push buttons
  private readonly speedRadioButtonGroupOnLeft: boolean;

  // horizontal spacing between push buttons and radio buttons
  private buttonGroupXSpacing: number;

  private readonly disposeTimeControlNode: () => void;

  constructor( isPlayingProperty: Property<boolean>, providedOptions?: TimeControlNodeOptions ) {

    const options = optionize<TimeControlNodeOptions,
      Omit<SelfOptions, 'playPauseStepButtonOptions' | 'speedRadioButtonGroupOptions'>, NodeOptions>()( {

      // TimeControlNodeOptions
      timeSpeedProperty: null,
      timeSpeeds: DEFAULT_TIME_SPEEDS,
      speedRadioButtonGroupOnLeft: false,
      buttonGroupXSpacing: 40,
      wrapSpeedRadioButtonGroupInPanel: false,
      speedRadioButtonGroupPanelOptions: {
        xMargin: 8,
        yMargin: 6
      },

      // NodeOptions
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,

      // phet-io
      tandem: Tandem.REQUIRED, // {Tandem}
      visiblePropertyOptions: { phetioFeatured: true },
      phetioEnabledPropertyInstrumented: true, // opt into default PhET-iO instrumented enabledProperty

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: sceneryPhetStrings.a11y.timeControlNode.label
    }, providedOptions );

    super();

    const children = [];

    this.playPauseStepButtons = new PlayPauseStepButtons( isPlayingProperty,
      optionize<PlayPauseStepButtonsOptions, {}, PlayPauseStepButtonsOptions>()( {
        tandem: options.tandem.createTandem( 'playPauseStepButtons' )
      }, options.playPauseStepButtonOptions ) );
    children.push( this.playPauseStepButtons );

    this.speedRadioButtonGroup = null;
    this.speedRadioButtonGroupParent = null;
    if ( options.timeSpeedProperty !== null ) {

      this.speedRadioButtonGroup = new SpeedRadioButtonGroup( options.timeSpeedProperty, options.timeSpeeds,
        optionize<SpeedRadioButtonGroupOptions, {}, SpeedRadioButtonGroupOptions>()( {
          tandem: options.tandem.createTandem( 'speedRadioButtonGroup' )
        }, options.speedRadioButtonGroupOptions ) );

      if ( options.wrapSpeedRadioButtonGroupInPanel ) {
        this.speedRadioButtonGroupParent = new Panel( this.speedRadioButtonGroup, options.speedRadioButtonGroupPanelOptions );
      }
      else {
        this.speedRadioButtonGroupParent = new Node( { children: [ this.speedRadioButtonGroup ] } );
      }

      if ( options.speedRadioButtonGroupOnLeft ) {
        children.unshift( this.speedRadioButtonGroupParent );
      }
      else {
        children.push( this.speedRadioButtonGroupParent );
      }

      this.speedRadioButtonGroupParent.centerY = this.playPauseStepButtons.centerY;
    }

    assert && assert( !options.children, 'TimeControlNode sets children' );
    options.children = children;

    this.speedRadioButtonGroupOnLeft = options.speedRadioButtonGroupOnLeft;
    this.buttonGroupXSpacing = options.buttonGroupXSpacing;

    this.setButtonGroupXSpacing( this.buttonGroupXSpacing );

    // pdom - dynamic or component dependent descriptions
    const playingListener = ( playing: boolean ) => {
      let description;
      if ( playing ) {
        description = options.timeSpeedProperty ?
                      sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.playingWithSpeedDescription :
                      sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.playingDescription;
      }
      else {
        description = options.timeSpeedProperty ?
                      sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.pausedWithSpeedDescription :
                      sceneryPhetStrings.a11y.timeControlNode.playPauseStepButtons.pausedDescription;
      }
      this.playPauseStepButtons.descriptionContent = description;
    };
    isPlayingProperty.link( playingListener );

    this.disposeTimeControlNode = () => {
      this.playPauseStepButtons.dispose();
      this.speedRadioButtonGroup && this.speedRadioButtonGroup.dispose();
      isPlayingProperty.unlink( playingListener );
    };

    // mutate with options after spacing and layout is complete so other layout options apply correctly to the
    // whole TimeControlNode
    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'TimeControlNode', this );
  }

  /**
   * Translate this node so that the center of the PlayPauseButton is at the specified point in the parent
   * coordinate frame for the TimeControlNode.
   */
  public setPlayPauseButtonCenter( center: Vector2 ): void {
    const distanceToCenter = this.localToParentPoint( this.getPlayPauseButtonCenter() ).minus( this.center );
    this.center = center.minus( distanceToCenter );
  }

  /**
   * Get the center of the PlayPauseButton, in the local coordinate frame of the TimeControlNode. Useful if the
   * TimeControlNode needs to be positioned relative to the PlayPauseButtons.
   */
  public getPlayPauseButtonCenter(): Vector2 {
    return this.playPauseStepButtons.getPlayPauseButtonCenter();
  }

  /**
   * Set the spacing between the SpeedRadioButtonGroup and the PlayPauseStepButtons. Spacing is from horizontal
   * edge to edge for each Node. This will move the SpeedRadioButtonGroup relative to the edge of the
   * PlayPauseStepButtons. No-op if there is no SpeedRadioButtonGroup for this TimeControlNode.
   */
  public setButtonGroupXSpacing( spacing: number ) {
    this.buttonGroupXSpacing = spacing;
    if ( this.speedRadioButtonGroupParent ) {
      if ( this.speedRadioButtonGroupOnLeft ) {
        this.speedRadioButtonGroupParent.right = this.playPauseStepButtons.left - this.buttonGroupXSpacing;
      }
      else {
        this.speedRadioButtonGroupParent.left = this.playPauseStepButtons.right + this.buttonGroupXSpacing;
      }
    }
  }

  public getButtonGroupXSpacing(): number {
    return this.buttonGroupXSpacing;
  }

  public override dispose(): void {
    this.disposeTimeControlNode();
    super.dispose();
  }
}

type PlayPauseStepButtonsSelfOptions = {

  // if true, a StepForwardButton is included in the button group
  includeStepForwardButton?: boolean;

  // if true, a StepBackwardButton is included in the button group
  includeStepBackwardButton?: boolean;

  // horizontal space between Play/Pause and Step buttons
  playPauseStepXSpacing?: number;

  // options for button subcomponents
  playPauseButtonOptions?: Omit<PlayPauseButtonOptions, 'tandem' | 'phetioDocumentation'>;
  stepForwardButtonOptions?: Omit<StepForwardButtonOptions, 'tandem' | 'phetioDocumentation'>;
  stepBackwardButtonOptions?: Omit<StepBackwardButtonOptions, 'tandem' | 'phetioDocumentation'>;
};

const DEFAULT_STEP_BUTTON_RADIUS = 15;
const DEFAULT_STEP_BUTTON_TOUCH_AREA_DILATION = 5;

type PlayPauseStepButtonsOptions = PlayPauseStepButtonsSelfOptions & Omit<HBoxOptions, 'spacing' | 'children'>;

/**
 * Inner type that collects the PlayPauseButton, StepForwardButton, and optionally the StepBackwardButton in
 * horizontal layout.
 */
class PlayPauseStepButtons extends HBox {

  private readonly playPauseButton: PlayPauseButton;
  private readonly disposePlayPauseStepButtons: () => void;

  constructor( isPlayingProperty: Property<boolean>, providedOptions?: PlayPauseStepButtonsOptions ) {

    const options = optionize<PlayPauseStepButtonsOptions, PlayPauseStepButtonsSelfOptions, HBoxOptions>()( {

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

      // pdom
      tagName: 'div', // so that it can receive descriptions
      appendDescription: true
    }, providedOptions );

    // by default, the step buttons are enabled when isPlayingProperty is false, but only create a PhET-iO instrumented
    // Property if it is going to be used
    if ( ( !options.stepForwardButtonOptions.enabledProperty ) || ( !options.stepBackwardButtonOptions.enabledProperty ) ) {
      const defaultEnabledProperty = DerivedProperty.not( isPlayingProperty, {
        tandem: options.tandem.createTandem( 'enabledProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
      } );

      if ( !options.stepForwardButtonOptions.enabledProperty ) {
        options.stepForwardButtonOptions.enabledProperty = defaultEnabledProperty;
      }
      if ( !options.stepBackwardButtonOptions.enabledProperty ) {
        options.stepBackwardButtonOptions.enabledProperty = defaultEnabledProperty;
      }
    }

    const children = [];

    const playPauseButton = new PlayPauseButton( isPlayingProperty,
      optionize<PlayPauseButtonOptions, {}, PlayPauseButtonOptions>()( {
        tandem: options.tandem.createTandem( 'playPauseButton' ),
        phetioDocumentation: 'Button to control the animation in the simulation. This will also stop the model from stepping.'
      }, options.playPauseButtonOptions ) );
    children.push( playPauseButton );

    let stepForwardButton: StepForwardButton | null = null;
    if ( options.includeStepForwardButton ) {
      stepForwardButton = new StepForwardButton(
        optionize<StepForwardButtonOptions, {}, StepForwardButtonOptions>()( {
          tandem: options.tandem.createTandem( 'stepBackwardButton' ),
          phetioDocumentation: 'Progress the simulation a single model step backwards.'
        }, options.stepForwardButtonOptions ) );
      children.push( stepForwardButton );
    }

    let stepBackwardButton: StepBackwardButton | null = null;
    if ( options.includeStepBackwardButton ) {
      stepBackwardButton = new StepBackwardButton(
        optionize<StepBackwardButtonOptions, {}, StepBackwardButtonOptions>()( {
          phetioDocumentation: 'Progress the simulation a single model step forwards.',
          tandem: options.tandem.createTandem( 'stepForwardButton' )
        }, options.stepBackwardButtonOptions ) );
      children.unshift( stepBackwardButton );
    }

    options.spacing = options.playPauseStepXSpacing;
    options.children = children;

    super( options );

    this.playPauseButton = playPauseButton;

    this.disposePlayPauseStepButtons = () => {
      playPauseButton.dispose();
      stepForwardButton && stepForwardButton.dispose();
      stepBackwardButton && stepBackwardButton.dispose();
    };
  }

  /**
   * Get the center of the PlayPauseButton, in the local coordinate frame of the PlayPauseStepButtons.
   */
  public getPlayPauseButtonCenter(): Vector2 {
    return this.playPauseButton.center;
  }

  public override dispose(): void {
    this.disposePlayPauseStepButtons();
    super.dispose();
  }
}

type SpeedRadioButtonGroupSelfOptions = {
  radius?: number;
  labelOptions?: TextOptions;
};

type SpeedRadioButtonGroupOptions = SpeedRadioButtonGroupSelfOptions & VerticalAquaRadioButtonGroupOptions;

/**
 * Inner type for speed radio buttons.
 */
class SpeedRadioButtonGroup extends VerticalAquaRadioButtonGroup<TimeSpeed> {

  constructor( timeSpeedProperty: EnumerationProperty<TimeSpeed>, timeSpeeds: TimeSpeed[],
               providedOptions?: SpeedRadioButtonGroupOptions ) {

    const options = optionize<SpeedRadioButtonGroupOptions,
      Omit<SpeedRadioButtonGroupSelfOptions, 'radius'>, VerticalAquaRadioButtonGroupOptions>()( {

      // SpeedRadioButtonGroupSelfOptions
      labelOptions: {
        font: new PhetFont( 14 ),
        maxWidth: 130 // i18n
      },

      // VerticalAquaRadioButtonGroupOptions
      spacing: 9,

      // phetio
      tandem: Tandem.REQUIRED,

      // pdom
      labelTagName: 'h4',
      labelContent: sceneryPhetStrings.a11y.timeControlNode.simSpeeds,
      descriptionContent: sceneryPhetStrings.a11y.timeControlNode.simSpeedDescription
    }, providedOptions );

    // by default, radio buttons match height of label before maxWidth scaling adjustments
    if ( !options.radioButtonOptions || options.radioButtonOptions.radius === undefined ) {
      if ( !options.radioButtonOptions ) {
        options.radioButtonOptions = {};
      }
      options.radioButtonOptions.radius = new Text( 'test', options.labelOptions ).height / 2;
    }
    console.log( `AFTER: options.radioButtonOptions.radius=${options.radius}` );

    const items: AquaRadioButtonGroupItem<TimeSpeed>[] = [];
    timeSpeeds.forEach( speed => {

      const speedLabel = SPEED_LABEL_MAP.get( speed ).labelString;
      const labelNode = new Text( speedLabel, options.labelOptions );

      items.push( {
        value: speed,
        node: labelNode,
        labelContent: speedLabel,
        tandemName: SPEED_LABEL_MAP.get( speed ).tandemName
      } );
    } );

    super( timeSpeedProperty, items, options );
  }
}

sceneryPhet.register( 'TimeControlNode', TimeControlNode );