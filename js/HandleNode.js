// Copyright 2018, University of Colorado Boulder

/**
 * View for a handle node.
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

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HandleNode( options ) {

    options = _.extend( {
      gripFillBaseColor: new Color( 183, 184, 185 ), // base color of gradient on the grip
      gripStrokeColor: 'black', // stroke color of the grip
      gripLineWidth: 3,
      attachmentFillColor: 'gray', // solid fill color for the attachments
      attachmentStrokeColor: 'black', // stroke color of the attachments
      attachmentLineWidth: 3
    }, options );

    // grip shape vars
    var gripWidth = 100;
    var gripHeight = 42;
    var gripCornerRadius = gripWidth * 0.03;
    var gripEndPad = gripWidth * 0.03; // horizontal line between the edge of the grip and the cubic curves
    var gripSingleFingerIndentDepth = gripHeight * 0.11;
    var gripSingleFingerIndentHalfWidth = ( gripWidth - gripCornerRadius * 2 - gripEndPad * 2 ) / 8;

    // control points for cubic curve shape on grip
    // each single-finger indent is made of two cubic curves that are mirrored over the y-axis
    var controlPoint1X = gripSingleFingerIndentHalfWidth / 2;
    var controlPoint1Y = 0;
    var controlPoint2X = gripSingleFingerIndentHalfWidth / 4;
    var controlPoint2Y = gripSingleFingerIndentDepth;

    function addGripIndent( shape, sign ) {

      // this is a grip indent
      return shape.cubicCurveToRelative(
        sign * controlPoint1X,
        sign * controlPoint1Y,
        sign * controlPoint2X,
        sign * controlPoint2Y,
        sign * gripSingleFingerIndentHalfWidth,
        sign * gripSingleFingerIndentDepth )
        .cubicCurveToRelative(
          sign * ( gripSingleFingerIndentHalfWidth - controlPoint2X ),
          sign * -controlPoint1Y,
          sign * ( gripSingleFingerIndentHalfWidth - controlPoint1X ),
          sign * -controlPoint2Y,
          sign * gripSingleFingerIndentHalfWidth,
          sign * -gripSingleFingerIndentDepth );
    }

    var gripShape = new Shape()

    // the shape begins on the left edge, middle y
    // this is the upper left corner before grip indents start
      .moveTo( 0, gripHeight / 2 )
      .lineTo( 0, gripCornerRadius )
      .arc( gripCornerRadius, gripCornerRadius, gripCornerRadius, Math.PI, Math.PI * 1.5, false )
      .lineToRelative( gripEndPad, 0 );

    // these are the top grip indents
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );

    // this is the whole right edge
    gripShape.lineToRelative( gripEndPad, 0 )
      .arc( gripWidth - gripCornerRadius, gripCornerRadius, gripCornerRadius, Math.PI * 1.5, 0, false )
      .lineToRelative( 0, gripHeight - ( gripCornerRadius * 2 ) )
      .arc( gripWidth - gripCornerRadius, gripHeight - gripCornerRadius, gripCornerRadius, 0, Math.PI / 2, false )
      .lineToRelative( -gripEndPad, 0 );

    // these are the bottom grip indents
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );

    // this is the lower left hand corner
    gripShape.lineToRelative( -gripEndPad, 0 )
      .arc( gripCornerRadius, gripHeight - gripCornerRadius, gripCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( 0, gripHeight / 2 )
      .close();

    // add handle grip shape
    var gripPath = new Path( gripShape, {
      lineWidth: options.gripLineWidth,
      stroke: options.gripStrokeColor,
      fill: new LinearGradient( 0, 0, 0, gripHeight )
        .addColorStop( 0, options.gripFillBaseColor )
        .addColorStop( 0.4, options.gripFillBaseColor.brighterColor( 0.5 ) )
        .addColorStop( 0.7, options.gripFillBaseColor )
        .addColorStop( 1.0, options.gripFillBaseColor.darkerColor( 0.6 ) )
    } );

    // handle attachment shape vars
    var attachmentShaftWidth = gripHeight * 0.35;
    var attachmentHeight = gripHeight * 1.15;
    var attachmentBaseNubWidth = attachmentShaftWidth * 0.4;
    var attachmentBaseNubHeight = attachmentHeight * 0.2;
    var attachmentMiddleHeight = attachmentHeight * 0.5;
    var attachmentSmallArcRadius = attachmentShaftWidth * 0.5;

    var leftAttachmentShape = new Shape()
      .moveTo( 0, attachmentHeight )
      .lineToRelative( attachmentBaseNubWidth, -attachmentBaseNubHeight )
      .lineToRelative( 0, -attachmentMiddleHeight )
      .arc(
        attachmentShaftWidth + attachmentBaseNubWidth + attachmentSmallArcRadius,
        attachmentHeight - attachmentBaseNubHeight - attachmentMiddleHeight,
        attachmentShaftWidth + attachmentSmallArcRadius,
        Math.PI,
        Math.PI * 1.5,
        false
      )
      .lineToRelative( 0, attachmentShaftWidth )
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

    var attachmentOptions = {
      lineWidth: options.attachmentLineWidth,
      stroke: options.attachmentStrokeColor,
      fill: options.attachmentFillColor,
      lineJoin: 'round',
      top: gripPath.centerY - attachmentShaftWidth / 2
    };

    // add handle left attachment
    var leftAttachmentPath = new Path( leftAttachmentShape, _.extend( {
      right: gripPath.left + options.gripLineWidth
    }, attachmentOptions ) );

    // the right attachment shape is a mirror image of the left
    var rightAttachmentShape = leftAttachmentShape.transformed( Matrix3.scaling( -1, 1 ) );

    // add handle right attachment
    var rightAttachmentPath = new Path( rightAttachmentShape, _.extend( {
      left: gripPath.right - options.gripLineWidth
    }, attachmentOptions ) );

    Node.call( this, _.extend( {
      children: [ leftAttachmentPath, rightAttachmentPath, gripPath ]
    }, options ) );
  }

  sceneryPhet.register( 'HandleNode', HandleNode );

  return inherit( Node, HandleNode );
} );