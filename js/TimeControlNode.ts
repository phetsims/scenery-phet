// Copyright 2018-2023, University of Colorado Boulder

/**
 * TimeControlNode provides a UI for controlling time.  It includes a play/pause button, step-forward button,
 * optional step-backward button, and optional radio buttons for time speed. Various layouts are supported via options.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../axon/js/EnumerationProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../dot/js/Vector2.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { Node, NodeOptions, SceneryConstants } from '../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../sun/js/Panel.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import TimeSpeed from './TimeSpeed.js';
import TimeSpeedRadioButtonGroup, { TimeSpeedRadioButtonGroupOptions } from './TimeSpeedRadioButtonGroup.js';
import PlayPauseStepButtonGroup, { PlayPauseStepButtonGroupOptions } from './buttons/PlayPauseStepButtonGroup.js';
import Property from '../../axon/js/Property.js';

// default speeds for SpeedRadioButtonGroup
const DEFAULT_TIME_SPEEDS = [ TimeSpeed.NORMAL, TimeSpeed.SLOW ];

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
  playPauseStepButtonOptions?: StrictOmit<PlayPauseStepButtonGroupOptions, 'tandem'>;

  // options passed along to the SpeedRadioButtonGroup, if included
  speedRadioButtonGroupOptions?: StrictOmit<TimeSpeedRadioButtonGroupOptions, 'tandem'>;

  // if true, the SpeedRadioButtonGroup will be wrapped in a Panel
  wrapSpeedRadioButtonGroupInPanel?: boolean;

  // options passed to the panel wrapping SpeedRadioButtonGroup, if SpeedRadioButtonGroup included AND we are wrapping
  // them in a panel
  speedRadioButtonGroupPanelOptions?: PanelOptions;
};

export type TimeControlNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class TimeControlNode extends Node {

  // push button for play/pause and (optionally) step forward, step back
  protected readonly playPauseStepButtons: PlayPauseStepButtonGroup;

  // radio buttons from controlling speed
  private readonly speedRadioButtonGroup: TimeSpeedRadioButtonGroup | null;

  // parent for speedRadioButtonGroup, optionally a Panel
  protected readonly speedRadioButtonGroupParent: Node | Panel | null;

  // whether the radio buttons are to the left or right of the push buttons
  private readonly speedRadioButtonGroupOnLeft: boolean;

  // horizontal spacing between push buttons and radio buttons
  private buttonGroupXSpacing: number;

  private readonly disposeTimeControlNode: () => void;

  public constructor( isPlayingProperty: Property<boolean>, providedOptions?: TimeControlNodeOptions ) {

    const options = optionize<TimeControlNodeOptions,
      StrictOmit<SelfOptions, 'playPauseStepButtonOptions' | 'speedRadioButtonGroupOptions'>, NodeOptions>()( {

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
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'TimeControlNode',
      visiblePropertyOptions: { phetioFeatured: true },
      phetioEnabledPropertyInstrumented: true, // opt into default PhET-iO instrumented enabledProperty

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: SceneryPhetStrings.a11y.timeControlNode.labelStringProperty
    }, providedOptions );

    super();

    const children = [];

    this.playPauseStepButtons = new PlayPauseStepButtonGroup( isPlayingProperty,
      combineOptions<PlayPauseStepButtonGroupOptions>( {
        tandem: options.tandem.createTandem( 'playPauseStepButtonGroup' )
      }, options.playPauseStepButtonOptions ) );
    children.push( this.playPauseStepButtons );

    this.speedRadioButtonGroup = null;
    this.speedRadioButtonGroupParent = null;
    if ( options.timeSpeedProperty !== null ) {

      this.speedRadioButtonGroup = new TimeSpeedRadioButtonGroup( options.timeSpeedProperty, options.timeSpeeds,
        combineOptions<TimeSpeedRadioButtonGroupOptions>( {
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

    options.children = children;

    this.speedRadioButtonGroupOnLeft = options.speedRadioButtonGroupOnLeft;
    this.buttonGroupXSpacing = options.buttonGroupXSpacing;

    this.setButtonGroupXSpacing( this.buttonGroupXSpacing );

    this.disposeTimeControlNode = () => {
      this.playPauseStepButtons.dispose();
      this.speedRadioButtonGroup && this.speedRadioButtonGroup.dispose();
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
  public setButtonGroupXSpacing( spacing: number ): void {
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

sceneryPhet.register( 'TimeControlNode', TimeControlNode );