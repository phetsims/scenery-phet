// Copyright 2013-2021, University of Colorado Boulder

/**
 * Faucet with a pinball machine 'shooter'.
 * When the faucet is disabled, the flow rate is set to zero and the shooter is disabled.
 * Origin is at the bottom-center of the spout.
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
import Bounds2 from '../../dot/js/Bounds2.js';
import LinearFunction from '../../dot/js/LinearFunction.js';
import Range from '../../dot/js/Range.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import DragListener from '../../scenery/js/listeners/DragListener.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import AccessibleSlider from '../../sun/js/accessibility/AccessibleSlider.js';
import AccessibleValueHandler from '../../sun/js/accessibility/AccessibleValueHandler.js';
import EventType from '../../tandem/js/EventType.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import bodyImage from '../images/faucet_body_png.js';
import flangeDisabledImage from '../images/faucet_flange_disabled_png.js';
import flangeImage from '../images/faucet_flange_png.js';
import horizontalPipeImage from '../images/faucet_horizontal_pipe_png.js';
import knobDisabledImage from '../images/faucet_knob_disabled_png.js';
import knobImage from '../images/faucet_knob_png.js';
import shaftImage from '../images/faucet_shaft_png.js';
import spoutImage from '../images/faucet_spout_png.js';
import stopImage from '../images/faucet_stop_png.js';
import trackImage from '../images/faucet_track_png.js';
import verticalPipeImage from '../images/faucet_vertical_pipe_png.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEBUG_ORIGIN = false; // when true, draws a red dot at the origin (bottom-center of the spout)
const SPOUT_OUTPUT_CENTER_X = 112; // center of spout in bodyImage
const HORIZONTAL_PIPE_X_OVERLAP = 1; // overlap between horizontal pipe and faucet body, so vertical seam is not visible
const VERTICAL_PIPE_Y_OVERLAP = 1; // overlap between vertical pipe and faucet body/spout, so horizontal seam is not visible
const SHOOTER_MIN_X_OFFSET = 4; // x-offset of shooter's off position in trackImage
const SHOOTER_MAX_X_OFFSET = 66; // x-offset of shooter's full-on position in trackImage
const SHOOTER_Y_OFFSET = 16; // y-offset of shooter's centerY in trackImage
const SHOOTER_WINDOW_BOUNDS = new Bounds2( 10, 10, 90, 25 ); // bounds of the window in bodyImage, through which you see the shooter handle
const TRACK_Y_OFFSET = 15; // offset of the track's bottom from the top of bodyImage

class FaucetNode extends Node {
  /**
   *
   * @param {number} maxFlowRate
   * @param {Property.<number>} flowRateProperty
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} [options]
   * @mixes AccessibleSlider
   */
  constructor( maxFlowRate, flowRateProperty, enabledProperty, options ) {

    options = merge( {
      scale: 1,
      horizontalPipeLength: SPOUT_OUTPUT_CENTER_X, // distance between left edge of horizontal pipe and spout's center
      verticalPipeLength: 43, // length of the vertical pipe that connects the faucet body to the spout
      tapToDispenseEnabled: true, // tap-to-dispense feature: tapping the shooter dispenses some fluid
      tapToDispenseAmount: 0.25 * maxFlowRate, // tap-to-dispense feature: amount to dispense, in L
      tapToDispenseInterval: 500, // tap-to-dispense feature: amount of time that fluid is dispensed, in milliseconds
      closeOnRelease: true, // when the shooter is released, close the faucet
      interactiveProperty: new Property( true ), // when the faucet is interactive, the flow rate control is visible, see issue #67

      // Overcome a flickering problems, see https://github.com/phetsims/wave-interference/issues/187
      rasterizeHorizontalPipeNode: false,

      // options for the nested type ShooterNode
      shooterOptions: {
        knobScale: 0.6, // values in the range 0.6 - 1.0 look decent

        // pointer area dilation
        touchAreaXDilation: 0,
        touchAreaYDilation: 0,
        mouseAreaXDilation: 0,
        mouseAreaYDilation: 0
      },

      tandem: Tandem.REQUIRED,
      phetioType: FaucetNode.FaucetNodeIO,
      phetioEventType: EventType.USER
    }, options );

    assert && assert( ( 1000 * options.tapToDispenseAmount / options.tapToDispenseInterval ) <= maxFlowRate );

    super();

    // shooter
    const shooterNode = new ShooterNode( enabledProperty, options.shooterOptions );

    // track that the shooter moves in
    const trackNode = new Image( trackImage );

    // horizontal pipe, tiled horizontally
    let horizontalPipeNode = new Image( horizontalPipeImage );
    const horizontalPipeWidth = options.horizontalPipeLength - SPOUT_OUTPUT_CENTER_X + HORIZONTAL_PIPE_X_OVERLAP;
    assert && assert( horizontalPipeWidth > 0 );
    horizontalPipeNode.setScaleMagnitude( horizontalPipeWidth / horizontalPipeImage.width, 1 );
    if ( options.rasterizeHorizontalPipeNode ) {
      horizontalPipeNode = horizontalPipeNode.rasterized();
    }

    // vertical pipe
    const verticalPipeNode = new Image( verticalPipeImage );
    const verticalPipeNodeHeight = options.verticalPipeLength + ( 2 * VERTICAL_PIPE_Y_OVERLAP );
    assert && assert( verticalPipeNodeHeight > 0 );
    verticalPipeNode.setScaleMagnitude( 1, verticalPipeNodeHeight / verticalPipeNode.height );

    // other nodes
    const spoutNode = new Image( spoutImage );
    const bodyNode = new Image( bodyImage );

    const shooterWindowNode = new Rectangle( SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.minY,
      SHOOTER_WINDOW_BOUNDS.maxX - SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.maxY - SHOOTER_WINDOW_BOUNDS.minY,
      { fill: 'rgb(107,107,107)' } );

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
    let timeoutID = null;
    let intervalID = null;
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
    const dragListener = new DragListener( {

      start: event => {
        if ( enabledProperty.get() ) {
          // prepare to do tap-to-dispense, will be canceled if the user drags before releasing the pointer
          tapToDispenseIsArmed = options.tapToDispenseEnabled;
          startXOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).x - event.currentTarget.left;
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
          const flowRate = offsetToFlowRate( xOffset );

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

    const flowRateObserver = flowRate => {
      shooterNode.left = bodyNode.left + offsetToFlowRate.inverse( flowRate );
    };
    flowRateProperty.link( flowRateObserver );

    const enabledObserver = enabled => {
      if ( !enabled && dragListener.isPressed ) {
        dragListener.interrupt();
      }
      if ( !enabled && tapToDispenseIsRunning ) {
        endTapToDispense();
      }
    };
    enabledProperty.link( enabledObserver );

    this.mutate( options );

    // mix accessible slider functionality into this node
    this.initializeAccessibleSlider(
      flowRateProperty,
      new Property( new Range( 0, maxFlowRate ) ),
      enabledProperty,
      options
    );

    // flow rate control is visible only when the faucet is interactive
    const interactiveObserver = interactive => {
      shooterNode.visible = trackNode.visible = interactive;

      // Non-interactive faucet nodes should not be keyboard navigable.  Must be done after initializeAccessibleSlider()
      this.tagName = interactive ? AccessibleValueHandler.DEFAULT_TAG_NAME : null;
    };
    options.interactiveProperty.link( interactiveObserver );

    // Add a link to flowRateProperty, to make it easier to find in Studio.
    // See https://github.com/phetsims/ph-scale/issues/123
    this.addLinkedElement( flowRateProperty, {
      tandem: options.tandem.createTandem( 'flowRateProperty' )
    } );

    // @private called by dispose
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
      shooterNode.dispose();

      this.disposeAccessibleSlider();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'FaucetNode', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeFaucetNode();
    super.dispose();
  }
}

// mix accessibility into FaucetNode
AccessibleSlider.mixInto( FaucetNode );

sceneryPhet.register( 'FaucetNode', FaucetNode );

class ShooterNode extends Node {

  /**
   * The 'shooter' is the interactive part of the faucet.
   * It's a relatively complicated node, so it's encapsulated in this nested type.
   *
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} config - see FaucetNode constructor for client options
   */
  constructor( enabledProperty, config ) {

    // knob
    const knobNode = new Image( knobImage );

    // set pointer areas before scaling
    knobNode.touchArea = knobNode.localBounds.dilatedXY( config.touchAreaXDilation, config.touchAreaYDilation );
    knobNode.mouseArea = knobNode.localBounds.dilatedXY( config.mouseAreaXDilation, config.mouseAreaYDilation );

    knobNode.scale( config.knobScale );
    const knobDisabledNode = new Image( knobDisabledImage );
    knobDisabledNode.scale( knobNode.getScaleVector() );

    // shaft
    const shaftNode = new Image( shaftImage );

    // flange
    const flangeNode = new Image( flangeImage );
    const flangeDisabledNode = new Image( flangeDisabledImage );

    // stop
    const stopNode = new Image( stopImage );

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

    const enabledObserver = enabled => {
      // the entire shooter is draggable, but encourage dragging by the knob by changing its cursor
      this.pickable = enabled;
      knobNode.cursor = flangeNode.cursor = enabled ? 'pointer' : 'default';
      knobNode.visible = enabled;
      knobDisabledNode.visible = !enabled;
      flangeNode.visible = enabled;
      flangeDisabledNode.visible = !enabled;
    };
    enabledProperty.link( enabledObserver );

    // @private called by dispose
    this.disposeShooterNode = () => {
      if ( enabledProperty.hasListener( enabledObserver ) ) {
        enabledProperty.unlink( enabledObserver );
      }
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeShooterNode();
    super.dispose();
  }
}

FaucetNode.FaucetNodeIO = new IOType( 'FaucetNodeIO', {
  valueType: FaucetNode,
  documentation: 'Faucet that emits fluid, typically user-controllable',
  supertype: Node.NodeIO,
  events: [ 'startTapToDispense', 'endTapToDispense' ]
} );

export default FaucetNode;