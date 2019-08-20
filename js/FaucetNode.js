// Copyright 2013-2019, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  const AccessibleSlider = require( 'SUN/accessibility/AccessibleSlider' );
  const AccessibleValueHandler = require( 'SUN/accessibility/AccessibleValueHandler' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const EventType = require( 'TANDEM/EventType' );
  const FaucetNodeIO = require( 'SCENERY_PHET/FaucetNodeIO' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Tandem = require( 'TANDEM/Tandem' );
  const timer = require( 'AXON/timer' );

  // images
  const bodyImage = require( 'image!SCENERY_PHET/faucet_body.png' );
  const flangeDisabledImage = require( 'image!SCENERY_PHET/faucet_flange_disabled.png' );
  const flangeImage = require( 'image!SCENERY_PHET/faucet_flange.png' );
  const horizontalPipeImage = require( 'image!SCENERY_PHET/faucet_horizontal_pipe.png' );
  const knobDisabledImage = require( 'image!SCENERY_PHET/faucet_knob_disabled.png' );
  const knobImage = require( 'image!SCENERY_PHET/faucet_knob.png' );
  const shaftImage = require( 'image!SCENERY_PHET/faucet_shaft.png' );
  const spoutImage = require( 'image!SCENERY_PHET/faucet_spout.png' );
  const stopImage = require( 'image!SCENERY_PHET/faucet_stop.png' );
  const trackImage = require( 'image!SCENERY_PHET/faucet_track.png' );
  const verticalPipeImage = require( 'image!SCENERY_PHET/faucet_vertical_pipe.png' );

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

  /**
   *
   * @param {number} maxFlowRate
   * @param {Property.<number>} flowRateProperty
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} [options]
   * @mixes AccessibleSlider
   * @constructor
   */
  function FaucetNode( maxFlowRate, flowRateProperty, enabledProperty, options ) {

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
        touchAreaXDilation: 37,
        touchAreaYDilation: 60,
        mouseAreaXDilation: 0,
        mouseAreaYDilation: 0
      },

      tandem: Tandem.required,
      phetioType: FaucetNodeIO,
      phetioEventType: EventType.USER
    }, options );

    assert && assert( ( 1000 * options.tapToDispenseAmount / options.tapToDispenseInterval ) <= maxFlowRate );

    var self = this;
    Node.call( this );

    // shooter
    var shooterNode = new ShooterNode( enabledProperty, options.shooterOptions );

    // track that the shooter moves in
    var trackNode = new Image( trackImage );

    // horizontal pipe, tiled horizontally
    var horizontalPipeNode = new Image( horizontalPipeImage );
    var horizontalPipeWidth = options.horizontalPipeLength - SPOUT_OUTPUT_CENTER_X + HORIZONTAL_PIPE_X_OVERLAP;
    assert && assert( horizontalPipeWidth > 0 );
    horizontalPipeNode.setScaleMagnitude( horizontalPipeWidth / horizontalPipeImage.width, 1 );
    if ( options.rasterizeHorizontalPipeNode ) {
      horizontalPipeNode = horizontalPipeNode.rasterized();
    }

    // vertical pipe
    var verticalPipeNode = new Image( verticalPipeImage );
    var verticalPipeNodeHeight = options.verticalPipeLength + ( 2 * VERTICAL_PIPE_Y_OVERLAP );
    assert && assert( verticalPipeNodeHeight > 0 );
    verticalPipeNode.setScaleMagnitude( 1, verticalPipeNodeHeight / verticalPipeNode.height );

    // other nodes
    var spoutNode = new Image( spoutImage );
    var bodyNode = new Image( bodyImage );

    var shooterWindowNode = new Rectangle( SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.minY,
      SHOOTER_WINDOW_BOUNDS.maxX - SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.maxY - SHOOTER_WINDOW_BOUNDS.minY,
      { fill: 'rgb(107,107,107)' } );

    // rendering order
    self.addChild( shooterWindowNode );
    self.addChild( shooterNode );
    self.addChild( horizontalPipeNode );
    self.addChild( verticalPipeNode );
    self.addChild( spoutNode );
    self.addChild( bodyNode );
    self.addChild( trackNode );

    // origin
    if ( DEBUG_ORIGIN ) {
      self.addChild( new Circle( { radius: 3, fill: 'red' } ) );
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
    var offsetToFlowRate = new LinearFunction( SHOOTER_MIN_X_OFFSET, SHOOTER_MAX_X_OFFSET, 0, maxFlowRate, true /* clamp */ );

    // tap-to-dispense feature
    var tapToDispenseIsArmed = false; // should we do tap-to-dispense when the pointer is released?
    var tapToDispenseIsRunning = false; // is tap-to-dispense in progress?
    var timeoutID = null;
    var intervalID = null;
    var startTapToDispense = function() {
      if ( enabledProperty.get() && tapToDispenseIsArmed ) { // redundant guard
        var flowRate = ( options.tapToDispenseAmount / options.tapToDispenseInterval ) * 1000;
        self.phetioStartEvent( 'startTapToDispense', { flowRate: flowRate } );
        tapToDispenseIsArmed = false;
        tapToDispenseIsRunning = true;
        flowRateProperty.set( flowRate ); // L/ms -> L/sec
        timeoutID = timer.setTimeout( function() {
          intervalID = timer.setInterval( function() {
            endTapToDispense();
          }, options.tapToDispenseInterval );
        }, 0 );
        self.phetioEndEvent();
      }
    };
    var endTapToDispense = function() {
      self.phetioStartEvent( 'endTapToDispense', { flowRate: 0 } );
      flowRateProperty.set( 0 );
      if ( timeoutID !== null ) {
        timer.clearTimeout( timeoutID );
        timeoutID = null;
      }
      if ( intervalID !== null ) {
        timer.clearInterval( intervalID );
        intervalID = null;
      }
      tapToDispenseIsRunning = false;
      self.phetioEndEvent();
    };

    var startXOffset = 0; // where the drag started, relative to the target node's origin, in parent view coordinates
    var inputListener = new SimpleDragHandler( {

      allowTouchSnag: true,

      start: function( event ) {
        if ( enabledProperty.get() ) {
          // prepare to do tap-to-dispense, will be canceled if the user drags before releasing the pointer
          tapToDispenseIsArmed = options.tapToDispenseEnabled;
          startXOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).x - event.currentTarget.left;
        }
      },

      // adjust the flow
      drag: function( event ) {

        // dragging is the cue that we're not doing tap-to-dispense
        tapToDispenseIsArmed = false;
        if ( tapToDispenseIsRunning ) {
          endTapToDispense();
        }

        // compute the new flow rate
        if ( enabledProperty.get() ) {

          // offsetToFlowRate is relative to bodyNode.left, so account for it
          var xOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).x - startXOffset - bodyNode.left;
          var flowRate = offsetToFlowRate( xOffset );

          flowRateProperty.set( flowRate );
        }
      },

      end: function() {
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
      tandem: options.tandem.createTandem( 'inputListener' )
    } );
    shooterNode.addInputListener( inputListener );

    var flowRateObserver = function( flowRate ) {
      shooterNode.left = bodyNode.left + offsetToFlowRate.inverse( flowRate );
    };
    flowRateProperty.link( flowRateObserver );

    var enabledObserver = function( enabled ) {
      if ( !enabled && inputListener.dragging ) {
        inputListener.interrupt();
      }
      if ( !enabled && tapToDispenseIsRunning ) {
        endTapToDispense();
      }
    };
    enabledProperty.link( enabledObserver );

    self.mutate( options );

    // mix accessible slider functionality into this node
    this.initializeAccessibleSlider(
      flowRateProperty,
      new Property( new Range( 0, maxFlowRate ) ),
      enabledProperty,
      options
    );

    // flow rate control is visible only when the faucet is interactive
    var interactiveObserver = function( interactive ) {
      shooterNode.visible = trackNode.visible = interactive;

      // Non-interactive faucet nodes should not be keyboard navigable.  Must be done after initializeAccessibleSlider()
      self.tagName = interactive ? AccessibleValueHandler.DEFAULT_TAG_NAME : null;
    };
    options.interactiveProperty.link( interactiveObserver );

    // @private called by dispose
    this.disposeFaucetNode = function() {

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
      if ( shooterNode.hasInputListener( inputListener ) ) {
        shooterNode.removeInputListener( inputListener );
      }
      shooterNode.dispose();

      self.disposeAccessibleSlider();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'FaucetNode', this );
  }

  sceneryPhet.register( 'FaucetNode', FaucetNode );

  /**
   * The 'shooter' is the interactive part of the faucet.
   * It's a relatively complicated node, so it's encapsulated in this nested type.
   *
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} config - see FaucetNode constructor for client options
   * @constructor
   */
  function ShooterNode( enabledProperty, config ) {

    var self = this;

    // knob
    var knobNode = new Image( knobImage );

    // set pointer areas before scaling
    knobNode.touchArea = knobNode.localBounds.dilatedXY( config.touchAreaXDilation, config.touchAreaYDilation );
    knobNode.mouseArea = knobNode.localBounds.dilatedXY( config.mouseAreaXDilation, config.mouseAreaYDilation );

    knobNode.scale( config.knobScale );
    var knobDisabledNode = new Image( knobDisabledImage );
    knobDisabledNode.scale( knobNode.getScaleVector() );

    // shaft
    var shaftNode = new Image( shaftImage );

    // flange
    var flangeNode = new Image( flangeImage );
    var flangeDisabledNode = new Image( flangeDisabledImage );

    // stop
    var stopNode = new Image( stopImage );

    Node.call( this, {
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

    var enabledObserver = function( enabled ) {
      // the entire shooter is draggable, but encourage dragging by the knob by changing its cursor
      self.pickable = enabled;
      knobNode.cursor = flangeNode.cursor = enabled ? 'pointer' : 'default';
      knobNode.visible = enabled;
      knobDisabledNode.visible = !enabled;
      flangeNode.visible = enabled;
      flangeDisabledNode.visible = !enabled;
    };
    enabledProperty.link( enabledObserver );

    // @private called by dispose
    this.disposeShooterNode = function() {
      if ( enabledProperty.hasListener( enabledObserver ) ) {
        enabledProperty.unlink( enabledObserver );
      }
    };
  }

  inherit( Node, ShooterNode, {

    // @public
    dispose: function() {
      this.disposeShooterNode();
      Node.prototype.dispose.call( this );
    }
  } );

  inherit( Node, FaucetNode, {

    // @public
    dispose: function() {
      this.disposeFaucetNode();
      Node.prototype.dispose.call( this );
    }
  } );

  // mix accessibility into this node
  AccessibleSlider.mixInto( FaucetNode );

  return FaucetNode;
} );
