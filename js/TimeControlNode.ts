// Copyright 2018-2025, University of Colorado Boulder

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
import Property from '../../axon/js/Property.js';
import { roundToInterval } from '../../dot/js/util/roundToInterval.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import ManualConstraint from '../../scenery/js/layout/constraints/ManualConstraint.js';
import { HorizontalLayoutAlign, VerticalLayoutAlign } from '../../scenery/js/layout/LayoutAlign.js';
import FlowBox from '../../scenery/js/layout/nodes/FlowBox.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import SceneryConstants from '../../scenery/js/SceneryConstants.js';
import RoundPushButton from '../../sun/js/buttons/RoundPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import PlayPauseStepButtonGroup, { PlayPauseStepButtonGroupOptions } from './buttons/PlayPauseStepButtonGroup.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import TimeSpeed from './TimeSpeed.js';
import TimeSpeedRadioButtonGroup, { TimeSpeedRadioButtonGroupOptions } from './TimeSpeedRadioButtonGroup.js';

// default speeds for SpeedRadioButtonGroup
const DEFAULT_TIME_SPEEDS = [ TimeSpeed.NORMAL, TimeSpeed.SLOW ];

type SelfOptions = {

  // Play speed Property for the radio button group. If null, no radio buttons included in this control.
  timeSpeedProperty?: EnumerationProperty<TimeSpeed> | null;

  // Speeds supported by this TimeControlNode. Vertical radio buttons are created for each in the order provided.
  timeSpeeds?: TimeSpeed[];

  // speed radio buttons placement relative to the play/pause button group
  speedRadioButtonGroupPlacement?: 'left' | 'right' | 'top' | 'bottom';

  // options passed along to the PlayPauseStepButtons, see the inner class for defaults
  playPauseStepButtonOptions?: PlayPauseStepButtonGroupOptions;

  // options passed along to the SpeedRadioButtonGroup, if included
  speedRadioButtonGroupOptions?: StrictOmit<TimeSpeedRadioButtonGroupOptions, 'tandem'>;

  // Alignment of the FlowBox containing the buttons
  flowBoxAlign?: HorizontalLayoutAlign | VerticalLayoutAlign;

  // horizontal space between PlayPauseStepButtons and SpeedRadioButtonGroup, if SpeedRadioButtonGroup is included
  flowBoxSpacing?: number;
};

export type TimeControlNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class TimeControlNode extends Node {

  // push button for play/pause and (optionally) step forward, step back
  protected readonly pushButtonGroup: PlayPauseStepButtonGroup;

  // radio buttons from controlling speed
  private readonly speedRadioButtonGroup: TimeSpeedRadioButtonGroup | null;

  public constructor( isPlayingProperty: Property<boolean>, providedOptions?: TimeControlNodeOptions ) {

    const options = optionize<TimeControlNodeOptions,
      StrictOmit<SelfOptions, 'playPauseStepButtonOptions' | 'speedRadioButtonGroupOptions'>, NodeOptions>()( {

      // TimeControlNodeOptions
      timeSpeedProperty: null,
      timeSpeeds: DEFAULT_TIME_SPEEDS,
      speedRadioButtonGroupPlacement: 'right',
      flowBoxSpacing: 40,
      flowBoxAlign: 'center',

      // NodeOptions
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,

      // phet-io
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'TimeControlNode',
      visiblePropertyOptions: { phetioFeatured: true },
      phetioEnabledPropertyInstrumented: true, // opt into default PhET-iO instrumented enabledProperty

      excludeInvisibleChildrenFromBounds: true,

      // pdom
      accessibleHeading: SceneryPhetStrings.a11y.timeControlNode.labelStringProperty
    }, providedOptions );

    super();

    this.pushButtonGroup = new PlayPauseStepButtonGroup( isPlayingProperty,
      combineOptions<PlayPauseStepButtonGroupOptions>( {
        tandem: options.tandem.createTandem( 'playPauseStepButtonGroup' )
      }, options.playPauseStepButtonOptions ) );

    this.speedRadioButtonGroup = null;
    if ( options.timeSpeedProperty !== null ) {

      this.speedRadioButtonGroup = new TimeSpeedRadioButtonGroup(
        options.timeSpeedProperty,
        options.timeSpeeds,
        combineOptions<TimeSpeedRadioButtonGroupOptions>( {
          tandem: options.tandem.createTandem( 'speedRadioButtonGroup' )
        }, options.speedRadioButtonGroupOptions )
      );

      this.addDisposable( this.speedRadioButtonGroup );
    }

    const children: Node[] = [
      this.pushButtonGroup
    ];

    if ( this.speedRadioButtonGroup ) {
      if ( options.speedRadioButtonGroupPlacement === 'left' || options.speedRadioButtonGroupPlacement === 'top' ) {
        children.unshift( this.speedRadioButtonGroup );
      }
      else {
        children.push( this.speedRadioButtonGroup );
      }
    }

    // Use a nested Node that will allow us to keep the play/pause button centered at (0,0) to simplify layout
    const flowBox = new FlowBox( {
      children: children,
      spacing: options.flowBoxSpacing,
      orientation: options.speedRadioButtonGroupPlacement === 'left' || options.speedRadioButtonGroupPlacement === 'right' ? 'horizontal' : 'vertical',
      align: options.flowBoxAlign
    } );

    options.children = [ flowBox ];

    ManualConstraint.create( this, [ flowBox ], flowBoxProxy => {
      const localBounds = this.globalToLocalBounds( this.pushButtonGroup.playPauseButton.globalBounds );
      const x = localBounds.centerX;
      const y = localBounds.centerY;

      // Round to prevent hysteresis on roundoff error
      flowBoxProxy.translation = flowBoxProxy.translation.plusXY( -roundToInterval( x, 1E-6 ), -roundToInterval( y, 1E-6 ) );
    } );

    this.addDisposable( this.pushButtonGroup );

    // mutate with options after spacing and layout is complete so other layout options apply correctly to the
    // whole TimeControlNode
    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'TimeControlNode', this );
  }

  /**
   * Add a push button to the TimeControlNode.
   */
  public addPushButton( pushButton: RoundPushButton, index: number ): void {
    this.pushButtonGroup.insertChild( index, pushButton );
    this.pushButtonGroup.updateLayout();
  }
}

sceneryPhet.register( 'TimeControlNode', TimeControlNode );