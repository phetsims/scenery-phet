// Copyright 2018, University of Colorado Boulder

/**
 * Scenery node that shows a handle, which is made of two parts: the "grip" which is where you would grab it and the
 * "attachment" which are elbow-shaped bars that attach the handle to another surface.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  // constants
  // grip shape vars
  var GRIP_WIDTH = 100;
  var GRIP_HEIGHT = 42;
  var GRIP_CORNER_RADIUS = GRIP_WIDTH * 0.03;
  var GRIP_END_PAD = GRIP_WIDTH * 0.03; // horizontal line between the edge of the grip and the cubic curves
  var GRIP_SINGLE_FINGER_INDENT_DEPTH = GRIP_HEIGHT * 0.11;
  var GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH = ( GRIP_WIDTH - GRIP_CORNER_RADIUS * 2 - GRIP_END_PAD * 2 ) / 8;
  var DEFAULT_GRIP_BASE_COLOR = new Color( 183, 184, 185 );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HandleNode( options ) {

    options = _.extend( {
      gripBaseColor: DEFAULT_GRIP_BASE_COLOR, // {Color|string} base color of gradient on the grip
      gripStroke: 'black', // {Color|string} stroke color of the grip
      gripLineWidth: 3,
      attachmentFill: 'gray', // {Color|string} solid fill color for the attachments
      attachmentStroke: 'black', // {Color|string} stroke color of the attachments
      attachmentLineWidth: 3,
      hasLeftAttachment: true,
      hasRightAttachment: true
    }, options );

    assert && assert( options.hasLeftAttachment || options.hasRightAttachment, 'at least one attachment is required' );

    // control points for cubic curve shape on grip
    // each single-finger indent is made of two cubic curves that are mirrored over the y-axis
    var controlPoint1X = GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH / 2;
    var controlPoint1Y = 0;
    var controlPoint2X = GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH / 4;
    var controlPoint2Y = GRIP_SINGLE_FINGER_INDENT_DEPTH;

    /**
     * Add an "up/down" combination to either the top or bottom of the grip.
     * @param {Shape} shape - the shape to append to
     * @param {number} sign - +1 for top side of grip, -1 for bottom side of grip
     */
    function addGripIndent( shape, sign ) {

      // this is a grip indent
      shape.cubicCurveToRelative(
        sign * controlPoint1X,
        sign * controlPoint1Y,
        sign * controlPoint2X,
        sign * controlPoint2Y,
        sign * GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH,
        sign * GRIP_SINGLE_FINGER_INDENT_DEPTH )
        .cubicCurveToRelative(
          sign * ( GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH - controlPoint2X ),
          sign * -controlPoint1Y,
          sign * ( GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH - controlPoint1X ),
          sign * -controlPoint2Y,
          sign * GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH,
          sign * -GRIP_SINGLE_FINGER_INDENT_DEPTH );
    }

    // the shape begins on the left edge, middle y
    // this is the upper left corner before grip indents start
    var gripShape = new Shape()
      .moveTo( 0, GRIP_HEIGHT / 2 )
      .lineTo( 0, GRIP_CORNER_RADIUS )
      .arc( GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, Math.PI, Math.PI * 1.5, false )
      .lineToRelative( GRIP_END_PAD, 0 );

    // these are the top grip indents
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );

    // this is the whole right edge
    gripShape.lineToRelative( GRIP_END_PAD, 0 )
      .arc( GRIP_WIDTH - GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, Math.PI * 1.5, 0, false )
      .lineToRelative( 0, GRIP_HEIGHT - ( GRIP_CORNER_RADIUS * 2 ) )
      .arc( GRIP_WIDTH - GRIP_CORNER_RADIUS, GRIP_HEIGHT - GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, 0, Math.PI / 2, false )
      .lineToRelative( -GRIP_END_PAD, 0 );

    // these are the bottom grip indents
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );

    // this is the lower left hand corner
    gripShape.lineToRelative( -GRIP_END_PAD, 0 )
      .arc( GRIP_CORNER_RADIUS, GRIP_HEIGHT - GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, Math.PI / 2, Math.PI, false )
      .lineTo( 0, GRIP_HEIGHT / 2 )
      .close();

    // add handle grip shape
    var gradientBaseColor = Color.toColor( options.gripBaseColor );
    var gripPath = new Path( gripShape, {
      lineWidth: options.gripLineWidth,
      stroke: options.gripStroke,
      fill: new LinearGradient( 0, 0, 0, GRIP_HEIGHT )
        .addColorStop( 0, gradientBaseColor )
        .addColorStop( 0.4, gradientBaseColor.brighterColor( 0.5 ) )
        .addColorStop( 0.7, gradientBaseColor )
        .addColorStop( 1.0, gradientBaseColor.darkerColor( 0.6 ) )
    } );

    assert && assert( !options.hasOwnProperty( 'children' ), 'HandleNode sets children' );
    options = _.extend( {
      children: [ gripPath ]
    }, options );

    // handle attachment shape vars
    var attachmentShaftWidth = GRIP_HEIGHT * 0.35;
    var attachmentHeight = GRIP_HEIGHT * 1.15;
    var attachmentBaseNubWidth = attachmentShaftWidth * 0.4;
    var attachmentBaseNubHeight = attachmentHeight * 0.2;
    var attachmentMiddleHeight = attachmentHeight * 0.5;
    var attachmentSmallArcRadius = attachmentShaftWidth * 0.5;

    var attachmentOptions = {
      fill: options.attachmentFill,
      stroke: options.attachmentStroke,
      lineWidth: options.attachmentLineWidth,
      lineJoin: 'round',
      top: gripPath.centerY - attachmentShaftWidth / 2
    };

    var leftAttachmentShape = new Shape()

    // Starts at bottom-left and proceeds clockwise
      .moveTo( 0, attachmentHeight )
      .lineToRelative( attachmentBaseNubWidth, -attachmentBaseNubHeight )
      .lineToRelative( 0, -attachmentMiddleHeight )

      // The main arc at the top left of the attachment
      .arc(
        attachmentShaftWidth + attachmentBaseNubWidth + attachmentSmallArcRadius,
        attachmentHeight - attachmentBaseNubHeight - attachmentMiddleHeight,
        attachmentShaftWidth + attachmentSmallArcRadius,
        Math.PI,
        Math.PI * 1.5,
        false
      )
      .lineToRelative( 0, attachmentShaftWidth )

      // This is the smaller arc on the underside of the attachment
      .arc(
        attachmentShaftWidth + attachmentBaseNubWidth + attachmentSmallArcRadius,
        attachmentHeight - attachmentBaseNubHeight - attachmentMiddleHeight,
        attachmentSmallArcRadius,
        Math.PI * 1.5,
        Math.PI,
        true
      )
      .lineToRelative( 0, attachmentMiddleHeight )
      .lineToRelative( attachmentBaseNubWidth, attachmentBaseNubHeight )
      .lineToRelative( -attachmentShaftWidth - ( attachmentBaseNubWidth * 2 ), 0 )
      .close();

    // left attachment
    if ( options.hasLeftAttachment ) {

      var leftAttachmentPath = new Path( leftAttachmentShape, _.extend( {
        right: gripPath.left + options.gripLineWidth
      }, attachmentOptions ) );

      options.children.unshift( leftAttachmentPath ); // prepend so that attachment is behind grip
    }

    // right attachment, a mirror image of the left
    if ( options.hasRightAttachment ) {

      var rightAttachmentShape = leftAttachmentShape.transformed( Matrix3.scaling( -1, 1 ) );

      // handle right attachment
      var rightAttachmentPath = new Path( rightAttachmentShape, _.extend( {
        left: gripPath.right - options.gripLineWidth
      }, attachmentOptions ) );

      options.children.unshift( rightAttachmentPath );  // prepend so that attachment is behind grip
    }

    Node.call( this, options );
  }

  sceneryPhet.register( 'HandleNode', HandleNode );

  return inherit( Node, HandleNode );
} );