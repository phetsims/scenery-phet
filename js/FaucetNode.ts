// Copyright 2013-2025, University of Colorado Boulder

/**
 * FaucetNode is a faucet with a pinball machine 'shooter' that behaves like a slider.
 * When the faucet is disabled, the flow rate is set to zero and the shooter is disabled.
 * The origin is at the bottom-center of the spout.
 *
 * The shooter is optionally interactive. When it's not interactive, the shooter and track are hidden.
 * When the shooter is interactive, it has the following features:
 *
 * (1) Close-on-release mode: When the user drags the slider, releasing it sets the flow to zero.
 * See options.closeToRelease: true.
 *
 * (2) Slider mode: When the user drags the slider, releasing it will leave the shooter wherever it is
 * released, and (if in the on position) the flow will continue. See options.closeToRelease: false.
 *
 * (3) Tap-to-dispense: When the user taps on the shooter without dragging, it's on/off state toggles.
 * If the shooter was in the off state when tapped, it opens and dispenses a configurable amount of fluid.
 * This feature can be enabled simultaneously with (1) and (2) above. See the various tapToDispense* options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import stepTimer from '../../axon/js/stepTimer.js';
import { TimerListener } from '../../axon/js/Timer.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import LinearFunction from '../../dot/js/LinearFunction.js';
import Range from '../../dot/js/Range.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import WithOptional from '../../phet-core/js/types/WithOptional.js';
import GroupHighlightPath from '../../scenery/js/accessibility/GroupHighlightPath.js';
import HighlightPath from '../../scenery/js/accessibility/HighlightPath.js';
import InteractiveHighlighting from '../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import HotkeyData from '../../scenery/js/input/HotkeyData.js';
import KeyboardListener from '../../scenery/js/listeners/KeyboardListener.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import { rasterizeNode } from '../../scenery/js/util/rasterizeNode.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../sun/js/accessibility/AccessibleSlider.js';
import EventType from '../../tandem/js/EventType.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import faucetBody_png from '../images/faucetBody_png.js';
import faucetFlange_png from '../images/faucetFlange_png.js';
import faucetFlangeDisabled_png from '../images/faucetFlangeDisabled_png.js';
import faucetHorizontalPipe_png from '../images/faucetHorizontalPipe_png.js';
import faucetKnob_png from '../images/faucetKnob_png.js';
import faucetKnobDisabled_png from '../images/faucetKnobDisabled_png.js';
import faucetShaft_png from '../images/faucetShaft_png.js';
import faucetSpout_png from '../images/faucetSpout_png.js';
import faucetStop_png from '../images/faucetStop_png.js';
import faucetTrack_png from '../images/faucetTrack_png.js';
import faucetVerticalPipe_png from '../images/faucetVerticalPipe_png.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import SoundDragListener from './SoundDragListener.js';

// constants
const DEBUG_ORIGIN = false; // when true, draws a red dot at the origin (bottom-center of the spout)
const SPOUT_OUTPUT_CENTER_X = 112; // center of spout in faucetBody_png
const HORIZONTAL_PIPE_X_OVERLAP = 1; // overlap between horizontal pipe and faucet body, so vertical seam is not visible
const VERTICAL_PIPE_Y_OVERLAP = 1; // overlap between vertical pipe and faucet body/spout, so horizontal seam is not visible
const SHOOTER_MIN_X_OFFSET = 4; // x-offset of shooter's off position in faucetTrack_png
const SHOOTER_MAX_X_OFFSET = 66; // x-offset of shooter's full-on position in faucetTrack_png
const SHOOTER_Y_OFFSET = 16; // y-offset of shooter's centerY in faucetTrack_png
const SHOOTER_WINDOW_BOUNDS = new Bounds2( 10, 10, 90, 25 ); // bounds of the window in faucetBody_png, through which you see the shooter handle
const TRACK_Y_OFFSET = 15; // offset of the track's bottom from the top of faucetBody_png
const HIGHLIGHT_DILATION = 5; // dilation of the highlight around the shooter components

type SelfOptions = {
  horizontalPipeLength?: number; // distance between left edge of horizontal pipe and spout's center
  verticalPipeLength?: number; // length of the vertical pipe that connects the faucet body to the spout
  tapToDispenseEnabled?: boolean; // tap-to-dispense feature: when true, tapping the shooter dispenses some fluid
  tapToDispenseAmount?: number; // tap-to-dispense feature: amount to dispense, in L
  tapToDispenseInterval?: number; // tap-to-dispense feature: amount of time that fluid is dispensed, in milliseconds
  closeOnRelease?: boolean; // when true, releasing the shooter closes the faucet
  interactiveProperty?: TReadOnlyProperty<boolean>; // when the faucet is interactive, the flow rate control is visible, see issue #67

  // Overcome a flickering problems, see https://github.com/phetsims/wave-interference/issues/187
  rasterizeHorizontalPipeNode?: boolean;

  // options for the nested type ShooterNode
  shooterOptions?: ShooterNodeOptions;
};
type ParentOptions = AccessibleSliderOptions & NodeOptions;

export type FaucetNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'interactiveHighlightEnabled' | 'enabledRangeProperty' | 'valueProperty'>;

export default class FaucetNode extends AccessibleSlider( Node, 0 ) {

  private readonly disposeFaucetNode: () => void;

  public constructor( maxFlowRate: number, flowRateProperty: Property<number>,
                      enabledProperty: TReadOnlyProperty<boolean>, providedOptions?: FaucetNodeOptions ) {

    const options = optionize<FaucetNodeOptions, StrictOmit<SelfOptions, 'shooterOptions'>, WithOptional<ParentOptions, 'valueProperty'>>()( {

      // SelfOptions
      horizontalPipeLength: SPOUT_OUTPUT_CENTER_X,
      verticalPipeLength: 43,
      tapToDispenseEnabled: true,
      tapToDispenseAmount: 0.25 * maxFlowRate,
      tapToDispenseInterval: 500,
      closeOnRelease: true,
      interactiveProperty: new Property( true ),
      rasterizeHorizontalPipeNode: false,

      // AccessibleSliderOptions
      enabledRangeProperty: new Property( new Range( 0, maxFlowRate ) ),
      valueProperty: flowRateProperty,

      // ParentOptions
      scale: 1,
      enabledProperty: enabledProperty,

      // AccessibleSlider is composed with InteractiveHighlighting, but the InteractiveHighlight should surround
      // the shooter. It is disabled for the Slider and composed with the ShooterNode.
      interactiveHighlightEnabled: false,

      // phet-io
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'FaucetNode',
      phetioType: FaucetNode.FaucetNodeIO,
      phetioFeatured: true,
      phetioEventType: EventType.USER
    }, providedOptions );

    assert && assert( ( 1000 * options.tapToDispenseAmount / options.tapToDispenseInterval ) <= maxFlowRate );

    // shooter
    const shooterNode = new ShooterNode( enabledProperty, options.shooterOptions );

    // track that the shooter moves in
    const trackNode = new Image( faucetTrack_png );

    // horizontal pipe, tiled horizontally
    let horizontalPipeNode: Node = new Image( faucetHorizontalPipe_png );
    const horizontalPipeWidth = options.horizontalPipeLength - SPOUT_OUTPUT_CENTER_X + HORIZONTAL_PIPE_X_OVERLAP;
    assert && assert( horizontalPipeWidth > 0 );
    horizontalPipeNode.setScaleMagnitude( horizontalPipeWidth / faucetHorizontalPipe_png.width, 1 );
    if ( options.rasterizeHorizontalPipeNode ) {
      horizontalPipeNode = rasterizeNode( horizontalPipeNode );
    }

    // vertical pipe
    const verticalPipeNode = new Image( faucetVerticalPipe_png );
    const verticalPipeNodeHeight = options.verticalPipeLength + ( 2 * VERTICAL_PIPE_Y_OVERLAP );
    assert && assert( verticalPipeNodeHeight > 0 );
    verticalPipeNode.setScaleMagnitude( 1, verticalPipeNodeHeight / verticalPipeNode.height );

    // other nodes
    const spoutNode = new Image( faucetSpout_png );
    const bodyNode = new Image( faucetBody_png );

    const shooterWindowNode = new Rectangle( SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.minY,
      SHOOTER_WINDOW_BOUNDS.maxX - SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.maxY - SHOOTER_WINDOW_BOUNDS.minY,
      { fill: 'rgb(107,107,107)' } );

    const boundsRequiredOptionKeys = _.pick( options, Node.REQUIRES_BOUNDS_OPTION_KEYS );

    super( _.omit( options, Node.REQUIRES_BOUNDS_OPTION_KEYS ) );

    // rendering order
    this.addChild( shooterWindowNode );
    this.addChild( horizontalPipeNode );
    this.addChild( verticalPipeNode );
    this.addChild( spoutNode );
    this.addChild( bodyNode );
    this.addChild( shooterNode );
    this.addChild( trackNode );

    // origin
    if ( DEBUG_ORIGIN ) {
      this.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // layout
    {
      // spout's origin is at bottom-center
      spoutNode.centerX = 0;
      spoutNode.bottom = 0;

      // vertical pipe above spout
      verticalPipeNode.centerX = spoutNode.centerX;
      verticalPipeNode.bottom = spoutNode.top + VERTICAL_PIPE_Y_OVERLAP;

      // body above vertical pipe
      bodyNode.right = verticalPipeNode.right;
      bodyNode.bottom = verticalPipeNode.top + VERTICAL_PIPE_Y_OVERLAP;

      // shooter window is in the body's coordinate frame
      shooterWindowNode.translation = bodyNode.translation;

      // horizontal pipe connects to left edge of body
      horizontalPipeNode.right = bodyNode.left + HORIZONTAL_PIPE_X_OVERLAP;
      horizontalPipeNode.top = bodyNode.top;

      // track at top of body
      trackNode.left = bodyNode.left;
      trackNode.bottom = bodyNode.top + TRACK_Y_OFFSET;

      // shooter at top of body
      shooterNode.left = trackNode.left + SHOOTER_MIN_X_OFFSET;
      shooterNode.centerY = trackNode.top + SHOOTER_Y_OFFSET;
    }

    // x-offset relative to left edge of bodyNode
    const offsetToFlowRate = new LinearFunction( SHOOTER_MIN_X_OFFSET, SHOOTER_MAX_X_OFFSET, 0, maxFlowRate, true /* clamp */ );

    // tap-to-dispense feature
    let tapToDispenseIsArmed = false; // should we do tap-to-dispense when the pointer is released?
    let tapToDispenseIsRunning = false; // is tap-to-dispense in progress?
    let timeoutID: TimerListener | null;
    let intervalID: TimerListener | null;
    const startTapToDispense = () => {
      if ( enabledProperty.get() && tapToDispenseIsArmed ) { // redundant guard
        const flowRate = ( options.tapToDispenseAmount / options.tapToDispenseInterval ) * 1000; // L/ms -> L/sec
        this.phetioStartEvent( 'startTapToDispense', { data: { flowRate: flowRate } } );
        tapToDispenseIsArmed = false;
        tapToDispenseIsRunning = true;
        flowRateProperty.set( flowRate );
        timeoutID = stepTimer.setTimeout( () => {
          intervalID = stepTimer.setInterval( () => endTapToDispense(), options.tapToDispenseInterval );
        }, 0 );
        this.phetioEndEvent();
      }
    };
    const endTapToDispense = () => {
      this.phetioStartEvent( 'endTapToDispense', { data: { flowRate: 0 } } );
      flowRateProperty.set( 0 );
      if ( timeoutID !== null ) {
        stepTimer.clearTimeout( timeoutID );
        timeoutID = null;
      }
      if ( intervalID !== null ) {
        stepTimer.clearInterval( intervalID );
        intervalID = null;
      }
      tapToDispenseIsRunning = false;
      this.phetioEndEvent();
    };

    let startXOffset = 0; // where the drag started, relative to the target node's origin, in parent view coordinates
    const dragListener = new SoundDragListener( {

      start: event => {
        if ( enabledProperty.get() ) {

          // prepare to do tap-to-dispense, will be canceled if the user drags before releasing the pointer
          tapToDispenseIsArmed = options.tapToDispenseEnabled;
          assert && assert( event.currentTarget );
          startXOffset = event.currentTarget!.globalToParentPoint( event.pointer.point ).x - event.currentTarget!.left;
        }
      },

      // adjust the flow
      drag: ( event, listener ) => {

        // dragging is the cue that we're not doing tap-to-dispense
        tapToDispenseIsArmed = false;
        if ( tapToDispenseIsRunning ) {
          endTapToDispense();
        }

        // compute the new flow rate
        if ( enabledProperty.get() ) {

          // offsetToFlowRate is relative to bodyNode.left, so account for it
          const xOffset = listener.currentTarget.globalToParentPoint( event.pointer.point ).x - startXOffset - bodyNode.left;
          const flowRate = offsetToFlowRate.evaluate( xOffset );

          flowRateProperty.set( flowRate );
        }
      },

      end: () => {
        if ( enabledProperty.get() ) {

          if ( tapToDispenseIsArmed ) {
            // tapping toggles the tap-to-dispense state
            ( tapToDispenseIsRunning || flowRateProperty.get() !== 0 ) ? endTapToDispense() : startTapToDispense();
          }
          else if ( options.closeOnRelease ) {

            // the shooter was dragged and released, so turn off the faucet
            flowRateProperty.set( 0 );
          }
        }
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );
    shooterNode.addInputListener( dragListener );

    // Keyboard support for tap-to-dispense and setting the flow rate to zero.
    const keyboardListener = new KeyboardListener( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [
        FaucetNode.CLOSE_FAUCET_HOTKEY_DATA,
        FaucetNode.TAP_TO_DISPENSE_HOTKEY_DATA
      ] ),
      fire: ( event, keysPressed, listener ) => {
        if ( options.tapToDispenseEnabled && FaucetNode.TAP_TO_DISPENSE_HOTKEY_DATA.hasKeyStroke( keysPressed ) ) {

          // stop the previous timeout before running a new dispense
          if ( tapToDispenseIsRunning ) {
            endTapToDispense();
          }

          tapToDispenseIsArmed = true;
          startTapToDispense();
        }

        if ( FaucetNode.CLOSE_FAUCET_HOTKEY_DATA.hasKeyStroke( keysPressed ) ) {
          flowRateProperty.set( 0 );
        }
      }
    } );
    this.addInputListener( keyboardListener );

    // if close on release is true, the faucet should turn off when focus moves somewhere else
    if ( options.closeOnRelease ) {
      this.addInputListener( {
        blur: () => {
          flowRateProperty.set( 0 );
        }
      } );
    }

    // The highlights surround the interactive part of the ShooterNode.
    const localHighlightBounds = this.globalToLocalBounds( shooterNode.localToGlobalBounds( shooterNode.focusHighlightBounds ) );
    const localGroupHighlightBounds = this.globalToLocalBounds( shooterNode.localToGlobalBounds( shooterNode.groupFocusHighlightBounds ) );
    this.focusHighlight = new HighlightPath( Shape.bounds( localHighlightBounds ) );
    this.groupFocusHighlight = new GroupHighlightPath( Shape.bounds( localGroupHighlightBounds ) );

    const flowRateObserver = ( flowRate: number ) => {
      shooterNode.left = bodyNode.left + offsetToFlowRate.inverse( flowRate );
      ( this.focusHighlight as HighlightPath ).right = shooterNode.right + HIGHLIGHT_DILATION;
    };
    flowRateProperty.link( flowRateObserver );

    const enabledObserver = ( enabled: boolean ) => {
      if ( !enabled && dragListener.isPressed ) {
        dragListener.interrupt();
      }
      if ( !enabled && tapToDispenseIsRunning ) {
        endTapToDispense();
      }
    };
    enabledProperty.link( enabledObserver );

    this.mutate( boundsRequiredOptionKeys );

    // flow rate control is visible only when the faucet is interactive
    const interactiveObserver = ( interactive: boolean ) => {
      shooterNode.visible = trackNode.visible = interactive;
    };
    options.interactiveProperty.link( interactiveObserver );

    // Add a link to flowRateProperty, to make it easier to find in Studio.
    // See https://github.com/phetsims/ph-scale/issues/123
    this.addLinkedElement( flowRateProperty, {
      tandemName: 'flowRateProperty'
    } );

    this.disposeFaucetNode = () => {

      // Properties
      if ( options.interactiveProperty.hasListener( interactiveObserver ) ) {
        options.interactiveProperty.unlink( interactiveObserver );
      }
      if ( flowRateProperty.hasListener( flowRateObserver ) ) {
        flowRateProperty.unlink( flowRateObserver );
      }
      if ( enabledProperty.hasListener( enabledObserver ) ) {
        enabledProperty.unlink( enabledObserver );
      }

      // Subcomponents
      dragListener.dispose();
      keyboardListener.dispose();
      shooterNode.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'FaucetNode', this );
  }

  public override dispose(): void {
    this.disposeFaucetNode();
    super.dispose();
  }

  public static readonly CLOSE_FAUCET_HOTKEY_DATA = new HotkeyData( {
    keyStringProperties: [ new Property( '0' ), new Property( 'home' ) ],
    repoName: sceneryPhet.name,
    keyboardHelpDialogLabelStringProperty: SceneryPhetStrings.keyboardHelpDialog.faucetControls.closeFaucetStringProperty
  } );

  public static readonly TAP_TO_DISPENSE_HOTKEY_DATA = new HotkeyData( {
    keyStringProperties: [ new Property( 'enter' ), new Property( 'space' ) ],
    repoName: sceneryPhet.name,
    binderName: 'Tap to dispense faucet'
  } );

  public static FaucetNodeIO = new IOType<IntentionalAny, IntentionalAny>( 'FaucetNodeIO', {
    valueType: FaucetNode,
    documentation: 'Faucet that emits fluid, typically user-controllable',
    supertype: Node.NodeIO,
    events: [ 'startTapToDispense', 'endTapToDispense' ]
  } );
}

type ShooterNodeSelfOptions = {
  knobScale?: number; // values in the range 0.6 - 1.0 look decent

  // pointer areas
  touchAreaXDilation?: number;
  touchAreaYDilation?: number;
  mouseAreaXDilation?: number;
  mouseAreaYDilation?: number;
};
type ShooterNodeOptions = ShooterNodeSelfOptions; // no NodeOptions are included

/**
 * The 'shooter' is the interactive part of the faucet.
 */
class ShooterNode extends InteractiveHighlighting( Node ) {

  private readonly disposeShooterNode: () => void;

  // Custom bounds that define highlight shapes for the ShooterNode. The FaucetNode uses these as its own
  // highlight to indicate that the Shooter is the interactive part. But the highlights themselves are set
  // on the FaucetNode because that is the component that is focusable.
  public readonly focusHighlightBounds: Bounds2;
  public readonly groupFocusHighlightBounds: Bounds2;

  public constructor( enabledProperty: TReadOnlyProperty<boolean>, providedOptions?: ShooterNodeOptions ) {

    const options = optionize<ShooterNodeOptions, ShooterNodeSelfOptions, NodeOptions>()( {
      knobScale: 0.6,
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 0
    }, providedOptions );

    // knob
    const knobNode = new Image( faucetKnob_png );

    // set pointer areas before scaling
    knobNode.touchArea = knobNode.localBounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
    knobNode.mouseArea = knobNode.localBounds.dilatedXY( options.mouseAreaXDilation, options.mouseAreaYDilation );

    knobNode.scale( options.knobScale );
    const knobDisabledNode = new Image( faucetKnobDisabled_png );
    knobDisabledNode.scale( knobNode.getScaleVector() );

    // shaft
    const shaftNode = new Image( faucetShaft_png );

    // flange
    const flangeNode = new Image( faucetFlange_png );
    const flangeDisabledNode = new Image( faucetFlangeDisabled_png );

    // stop
    const stopNode = new Image( faucetStop_png );

    super( {
      children: [
        shaftNode,
        stopNode,
        flangeNode,
        flangeDisabledNode,
        knobNode,
        knobDisabledNode
      ]
    } );

    // layout, relative to shaft
    stopNode.x = shaftNode.x + 13;
    stopNode.centerY = shaftNode.centerY;
    flangeNode.left = shaftNode.right - 1; // a bit of overlap
    flangeNode.centerY = shaftNode.centerY;
    flangeDisabledNode.translation = flangeNode.translation;
    knobNode.left = flangeNode.right - 8; // a bit of overlap makes this look better
    knobNode.centerY = flangeNode.centerY;
    knobDisabledNode.translation = knobNode.translation;

    // custom focus highlights that are relative to components of this Node
    this.focusHighlightBounds = new Bounds2( flangeNode.left, knobNode.top, knobNode.right, knobNode.bottom ).dilated( HIGHLIGHT_DILATION );

    // the group focus highlight bounds surrounds the whole shooter and extends out to show the range of the knob
    this.groupFocusHighlightBounds = new Bounds2(
      shaftNode.left,
      knobNode.top - HIGHLIGHT_DILATION * 2,
      knobNode.right + shaftNode.width / 2 + 15,
      knobNode.bottom + HIGHLIGHT_DILATION * 2
    );

    // This ShooterNode receives input to activate the Interactive Highlight, so this highlight is set on the
    // ShooterNode even though focus highlights are set on the parent FaucetNode.
    this.interactiveHighlight = new HighlightPath( Shape.bounds( this.focusHighlightBounds ) );

    const enabledObserver = ( enabled: boolean ) => {
      // the entire shooter is draggable, but encourage dragging by the knob by changing its cursor
      this.pickable = enabled;
      knobNode.cursor = flangeNode.cursor = enabled ? 'pointer' : 'default';
      knobNode.visible = enabled;
      knobDisabledNode.visible = !enabled;
      flangeNode.visible = enabled;
      flangeDisabledNode.visible = !enabled;
    };
    enabledProperty.link( enabledObserver );

    this.disposeShooterNode = () => {
      if ( enabledProperty.hasListener( enabledObserver ) ) {
        enabledProperty.unlink( enabledObserver );
      }
    };
  }

  public override dispose(): void {
    this.disposeShooterNode();
    super.dispose();
  }
}

sceneryPhet.register( 'FaucetNode', FaucetNode );