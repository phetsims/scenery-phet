// Copyright 2018-2024, University of Colorado Boulder

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
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { FlowBox, FlowBoxOptions, Node, NodeOptions, SceneryConstants } from '../../scenery/js/imports.js';
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

  // speed radio buttons placement relative to the play/pause button group:
  // before (left for orientation 'horizontal' or top for orientation: 'vertical')
  // after (right for orientation 'horizontal' or below for orientation: 'vertical')
  speedRadioButtonGroupPlacement?: 'before' | 'after';

  // horizontal space between PlayPauseStepButtons and SpeedRadioButtonGroup, if SpeedRadioButtonGroup is included
  buttonGroupXSpacing?: number;

  // options passed along to the PlayPauseStepButtons, see the inner class for defaults
  playPauseStepButtonOptions?: PlayPauseStepButtonGroupOptions;

  // options passed along to the SpeedRadioButtonGroup, if included
  speedRadioButtonGroupOptions?: StrictOmit<TimeSpeedRadioButtonGroupOptions, 'tandem'>;
};

export type TimeControlNodeOptions = SelfOptions & StrictOmit<FlowBoxOptions, 'children'>;

export default class TimeControlNode extends FlowBox {

  // push button for play/pause and (optionally) step forward, step back
  public readonly playPauseStepButtons: PlayPauseStepButtonGroup;

  // radio buttons from controlling speed
  private readonly speedRadioButtonGroup: TimeSpeedRadioButtonGroup | null;

  public constructor( isPlayingProperty: Property<boolean>, providedOptions?: TimeControlNodeOptions ) {

    const options = optionize<TimeControlNodeOptions,
      StrictOmit<SelfOptions, 'playPauseStepButtonOptions' | 'speedRadioButtonGroupOptions'>, NodeOptions>()( {

      // TimeControlNodeOptions
      timeSpeedProperty: null,
      timeSpeeds: DEFAULT_TIME_SPEEDS,
      speedRadioButtonGroupPlacement: 'after',
      buttonGroupXSpacing: 40,

      // NodeOptions
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,

      // phet-io
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'TimeControlNode',
      visiblePropertyOptions: { phetioFeatured: true },
      phetioEnabledPropertyInstrumented: true, // opt into default PhET-iO instrumented enabledProperty

      excludeInvisibleChildrenFromBounds: true,

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: SceneryPhetStrings.a11y.timeControlNode.labelStringProperty
    }, providedOptions );

    super();

    this.playPauseStepButtons = new PlayPauseStepButtonGroup( isPlayingProperty,
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

      this.disposeEmitter.addListener( () => this.speedRadioButtonGroup!.dispose() );
    }

    const children: Node[] = [
      this.playPauseStepButtons
    ];

    if ( this.speedRadioButtonGroup ) {
      if ( options.speedRadioButtonGroupPlacement === 'before' ) {
        children.unshift( this.speedRadioButtonGroup );
      }
      else {
        children.push( this.speedRadioButtonGroup );
      }
    }
    options.children = children;

    this.setSpacing( options.buttonGroupXSpacing );

    this.disposeEmitter.addListener( () => this.playPauseStepButtons.dispose() );

    // mutate with options after spacing and layout is complete so other layout options apply correctly to the
    // whole TimeControlNode
    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'TimeControlNode', this );
  }

  /**
   * Many simulations have the constraint that the Play/Pause button in particular is aligned with some other UI element.
   * However, this is difficult since the Play/Pause button may be in a different coordinate frame than the item it aligns with.
   * Therefore, we compute the translation needed to align the Play/Pause button with the given centerX in the parent's
   * coordinate frame, assuming it is a linear relationship.
   */
  public setPlayPauseButtonCenterX( container: Node, centerX: number ): void {

    // Get the current center point of the play/pause button in parent coordinates
    const pt1 = container.globalToParentPoint( this.playPauseStepButtons.playPauseButton.globalBounds.center );

    // Perform a trial translation of 1 unit in the x-direction
    this.translate( 1, 0 );

    // Get the new center point of the play/pause button after translation
    const pt2 = container.globalToParentPoint( this.playPauseStepButtons.playPauseButton.globalBounds.center );

    // Revert the trial translation to maintain the original position
    this.translate( -1, 0 );

    // Calculate how much the play/pause button moves per unit translation
    const deltaPerUnit = pt2.x - pt1.x;

    // Calculate the difference needed to align the play/pause button with the spacer
    const requiredDelta = centerX - pt1.x;

    // Determine how many units to translate to achieve the required alignment
    const translationUnits = requiredDelta / deltaPerUnit;

    // Apply the calculated translation to align the play/pause button
    this.translate( translationUnits, 0 );
  }
}

sceneryPhet.register( 'TimeControlNode', TimeControlNode );