// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet with a pinball machine 'shooter'.
 * Pulling out the shooter changes the flow rate.
 * Releasing the shooter sets the flow rate to zero.
 * When the faucet is disabled, the flow rate is set to zero and the shooter is disabled.
 * Origin is at the bottom-center of the spout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Transform3 = require( 'DOT/Transform3' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var knobImage = require( 'image!SCENERY_PHET/faucet_knob.png' );
  var knobDisabledImage = require( 'image!SCENERY_PHET/faucet_knob_disabled.png' );
  var shaftImage = require( 'image!SCENERY_PHET/faucet_shaft.png' );
  var flangeImage = require( 'image!SCENERY_PHET/faucet_flange.png' );
  var flangeDisabledImage = require( 'image!SCENERY_PHET/faucet_flange_disabled.png' );
  var stopImage = require( 'image!SCENERY_PHET/faucet_stop.png' );
  var horizontalPipeImage = require( 'image!SCENERY_PHET/faucet_horizontal_pipe.png' );
  var verticalPipeImage = require( 'image!SCENERY_PHET/faucet_vertical_pipe.png' );
  var bodyImage = require( 'image!SCENERY_PHET/faucet_body.png' );
  var spoutImage = require( 'image!SCENERY_PHET/faucet_spout.png' );

  // constants
  var DEBUG_ORIGIN = false;
  var SPOUT_OUTPUT_CENTER_X = 112; // center of spout in bodyImage
  var HORIZONTAL_PIPE_Y_OFFSET = 30; // y-offset of horizontal pipe in bodyImage
  var HORIZONTAL_PIPE_X_OVERLAP = 1; // overlap between horizontal pipe and faucet body, so vertical seam is not visible
  var VERTICAL_PIPE_Y_OVERLAP = 1; // overlap between vertical pipe and faucet body/spout, so horizontal seam is not visible
  var SHOOTER_MIN_X_OFFSET = 4; // x-offset of shooter's off position in bodyImage
  var SHOOTER_MAX_X_OFFSET = 66; // x-offset of shooter's full-on position in bodyImage
  var SHOOTER_Y_OFFSET = 15; // y-offset of shooter's centerY in bodyImage
  var SHOOTER_WINDOW_BOUNDS = new Bounds2( 10, 10, 90, 25 ); // bounds of the window in bodyImage, through which you see the shooter handle

  /**
   * @param {Number} maxFlowRate
   * @param {Property<Number>} flowRateProperty
   * @param {Property<Boolean>} enabledProperty
   * @param {*} options
   * @constructor
   */
  function FaucetNode( maxFlowRate, flowRateProperty, enabledProperty, options ) {

    options = _.extend( {
      scale: 1,
      knobScale: 0.6, // values in the range 0.6 - 1.0 look decent
      horizontalPipeLength: 50, // distance between left edge of horizontal pipe and spout's center
      verticalPipeLength: 43 // length of the vertical pipe that connects the faucet body to the spout
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // knob
    var knobNode = new Image( knobImage );
    var dx = 0.5 * knobNode.width;
    var dy = 0.5 * knobNode.height;
    knobNode.touchArea = Shape.rectangle( -dx, -dy, knobNode.width + dx + dx, knobNode.height + dy + dy ); // before scaling!
    knobNode.scale( options.knobScale );
    var knobDisabledNode = new Image( knobDisabledImage );
    knobDisabledNode.scale( knobNode.getScaleVector() );

    // shaft
    var shaftNode = new Image( shaftImage );

    // flange
    var flangeNode = new Image( flangeImage );
    var flangeDisabledNode = new Image( flangeDisabledImage );

    // stop
    var stopNode = new Image( stopImage );

    // assemble the shooter
    var shooterNode = new Node();
    shooterNode.addChild( shaftNode );
    shooterNode.addChild( stopNode );
    shooterNode.addChild( flangeNode );
    shooterNode.addChild( flangeDisabledNode );
    shooterNode.addChild( knobNode );
    shooterNode.addChild( knobDisabledNode );
    stopNode.x = shaftNode.x + 12;
    stopNode.centerY = shaftNode.centerY;
    flangeNode.left = shaftNode.right;
    flangeNode.centerY = shaftNode.centerY;
    flangeDisabledNode.x = flangeNode.x;
    flangeDisabledNode.y = flangeNode.y;
    knobNode.left = flangeNode.right - 8; // a bit of overlap makes this look better
    knobNode.centerY = flangeNode.centerY;
    knobDisabledNode.x = knobNode.x;
    knobDisabledNode.y = knobNode.y;

    // horizontal pipe, tiled horizontally
    var horizontalPipeNode = new Image( horizontalPipeImage, { pickable: false } );
    var horizontalPipeWidth = options.horizontalPipeLength - SPOUT_OUTPUT_CENTER_X + HORIZONTAL_PIPE_X_OVERLAP;
    assert && assert( horizontalPipeWidth > 0 );
    horizontalPipeNode.setScaleMagnitude( horizontalPipeWidth / horizontalPipeImage.width, 1 );

    // vertical pipe
    var verticalPipeNode = new Image( verticalPipeImage );
    var verticalPipeNodeHeight = options.verticalPipeLength + ( 2 * VERTICAL_PIPE_Y_OVERLAP );
    assert && assert( verticalPipeNodeHeight > 0 );
    verticalPipeNode.setScaleMagnitude( 1, verticalPipeNodeHeight / verticalPipeNode.height );

    // other nodes
    var spoutNode = new Image( spoutImage );
    var bodyNode = new Image( bodyImage, { pickable: false } );
    var shooterWindowNode = new Rectangle( SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.minY,
      SHOOTER_WINDOW_BOUNDS.maxX - SHOOTER_WINDOW_BOUNDS.minX, SHOOTER_WINDOW_BOUNDS.maxY - SHOOTER_WINDOW_BOUNDS.minY,
      { fill: 'rgb(107,107,107)' } );

    // rendering order
    thisNode.addChild( shooterWindowNode );
    thisNode.addChild( shooterNode );
    thisNode.addChild( horizontalPipeNode );
    thisNode.addChild( verticalPipeNode );
    thisNode.addChild( spoutNode );
    thisNode.addChild( bodyNode );

    // origin
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
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
      shooterWindowNode.x = bodyNode.x;
      shooterWindowNode.y = bodyNode.y;
      // horizontal pipe connects to left edge of body
      horizontalPipeNode.right = bodyNode.left + HORIZONTAL_PIPE_X_OVERLAP;
      horizontalPipeNode.top = bodyNode.top + HORIZONTAL_PIPE_Y_OFFSET;
      // shooter at top of body
      shooterNode.left = bodyNode.left + SHOOTER_MIN_X_OFFSET;
      shooterNode.centerY = bodyNode.top + SHOOTER_Y_OFFSET;
    }

    var offsetToFlowRate = new LinearFunction( SHOOTER_MIN_X_OFFSET, SHOOTER_MAX_X_OFFSET, 0, maxFlowRate, true /* clamp */ );

    // encourage dragging by the blue parts, but make the entire shooter draggable
    knobNode.cursor = 'pointer';
    flangeNode.cursor = 'pointer';
    var shooterHandler = new SimpleDragHandler( {
      target: null, // save target, because event.currentTarget is null for drag.
      startXOffset: 0, // where the drag started, relative to the target's origin, in parent view coordinates

      allowTouchSnag: true,

      start: function( event ) {
        this.target = event.currentTarget;
        this.startXOffset = this.target.globalToParentPoint( event.pointer.point ).x;
      },

      // adjust the flow
      drag: function( event ) {
        if ( enabledProperty.get() ) {
          var xParent = this.target.globalToParentPoint( event.pointer.point ).x;
          var xOffset = xParent - this.startXOffset;
          var flowRate = offsetToFlowRate( xOffset );
          flowRateProperty.set( flowRate );
        }
      },

      // turn off the faucet when the handle is released
      end: function() {
        flowRateProperty.set( 0 );
        this.target = null;
      }
    } );
    shooterNode.addInputListener( shooterHandler );

    flowRateProperty.link( function( flowRate ) {
      var xOffset = offsetToFlowRate.inverse( flowRate );
      shooterNode.x = bodyNode.left + xOffset;
    } );

    enabledProperty.link( function( enabled ) {
      knobNode.visible = enabled;
      knobDisabledNode.visible = !enabled;
      flangeNode.visible = enabled;
      flangeDisabledNode.visible = !enabled;
      if ( !enabled && shooterHandler.dragging ) {
        shooterHandler.endDrag();
      }
    } );

    thisNode.mutate( options );
  }

  inherit( Node, FaucetNode );

  return FaucetNode;
} );
