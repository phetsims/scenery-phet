// Copyright 2002-2013, University of Colorado Boulder

/**
 * Reset All button.  This version is drawn in code using shapes, gradients,
 * and such, and does not use any image files.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Includes
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PushButton = require( 'SUN/PushButton' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var DEFAULT_RADIUS = 32; // Derived from images initially used for reset button.

  // Inner type for creating button nodes used for various button states.
  function ButtonStateNode( radius, fill, iconShape ) {
    Node.call( this, { pickable: false } );
    var backgroundGradient = new RadialGradient( radius * 0.05, radius * 0.05, radius * 0.85, 0, 0, radius * 1.2 );
    backgroundGradient.addColorStop( 0, 'black' );
    backgroundGradient.addColorStop( 1, 'rgb( 230, 230, 230 )' );
    this.addChild( new Circle( radius, { fill: backgroundGradient } ) );
    var innerButtonRadius = radius * 0.92; // Multiplier determined by eyeballing it.
    this.addChild( new Circle( innerButtonRadius, { fill: fill } ) );
    this.addChild( new Path( iconShape, { fill: 'white' } ) );
  }

  inherit( Node, ButtonStateNode );

  /**
   * @param {function} callback
   * @param {Object} options
   * @constructor
   */
  function ResetAllButton( callback, options ) {
    options = _.extend( {
      radius: DEFAULT_RADIUS,
      touchAreaRadius: DEFAULT_RADIUS * 1.3 // convenience for expanding the touchArea, which is a circle
    }, options );
    options.listener = callback;

    // Create the curved arrow shape, starting at the inside of the non-
    // pointed end.  The parameters immediately below can be adjusted in order
    // to tweak the appearance of the arrow.
    var innerRadius = options.radius * 0.4;
    var outerRadius = options.radius * 0.625;
    var headWidth = 2.25 * ( outerRadius - innerRadius );
    var startAngle = -Math.PI * 0.35;
    var endToNeckAngularSpan = -2 * Math.PI * 0.85;
    var arrowHeadAngularSpan = -Math.PI * 0.18;
    //---- End of tweak params ----
    var curvedArrowShape = new Shape();
    curvedArrowShape.moveTo( innerRadius * Math.cos( startAngle ), innerRadius * Math.sin( startAngle ) ); // Inner edge of end.
    curvedArrowShape.lineTo( outerRadius * Math.cos( startAngle ), outerRadius * Math.sin( startAngle ) );
    var neckAngle = startAngle + endToNeckAngularSpan;
    curvedArrowShape.arc( 0, 0, outerRadius, startAngle, neckAngle, true ); // Outer curve.
    var headWidthExtrusion = ( headWidth - ( outerRadius - innerRadius ) ) / 2;
    curvedArrowShape.lineTo(
      ( outerRadius + headWidthExtrusion ) * Math.cos( neckAngle ),
      ( outerRadius + headWidthExtrusion ) * Math.sin( neckAngle ) );
    var pointRadius = ( outerRadius + innerRadius ) * 0.55; // Tweaked a little from center for better look.
    curvedArrowShape.lineTo( // Tip of arrowhead.
      pointRadius * Math.cos( neckAngle + arrowHeadAngularSpan ),
      pointRadius * Math.sin( neckAngle + arrowHeadAngularSpan ) );
    curvedArrowShape.lineTo( ( innerRadius - headWidthExtrusion ) * Math.cos( neckAngle ), ( innerRadius - headWidthExtrusion ) * Math.sin( neckAngle ) );
    curvedArrowShape.lineTo( innerRadius * Math.cos( neckAngle ), innerRadius * Math.sin( neckAngle ) );
    curvedArrowShape.arc( 0, 0, innerRadius, neckAngle, startAngle ); // Inner curve.
    curvedArrowShape.close();

    // Local functions for creating gradients to use on buttons.
    var createButtonFillGradient = function( baseColor ) {
      var buttonGradient = new RadialGradient( options.radius * 0.05, options.radius * 0.05, options.radius * 0.87, 0, 0, options.radius );
      buttonGradient.addColorStop( 0, baseColor );
      buttonGradient.addColorStop( 0.7, baseColor.colorUtilsBrighter( 0.6 ) );
      buttonGradient.addColorStop( 1, baseColor.colorUtilsBrighter( 0.8 ) );
      return buttonGradient;
    };
    var createPushedButtonGradient = function( baseColor ) {
      var buttonGradient = new RadialGradient( 0, 0, options.radius * 0.5, 0, 0, options.radius );
      buttonGradient.addColorStop( 0, baseColor );
      buttonGradient.addColorStop( 0.3, baseColor );
      buttonGradient.addColorStop( 0.5, baseColor.colorUtilsDarker( 0.1 ) );
      buttonGradient.addColorStop( 0.7, baseColor );
      return buttonGradient;
    };

    // Create the nodes for each of the button states.
    var upNode = new ButtonStateNode( options.radius, createButtonFillGradient( new Color( 247, 151, 34 ) ), curvedArrowShape );
    var overNode = new ButtonStateNode( options.radius, createButtonFillGradient( new Color( 251, 171, 39 ) ), curvedArrowShape );
    var translatedArrowShape = curvedArrowShape.transformed( Matrix3.translation( options.radius * 0.01, options.radius * 0.01 ) );
    var downNode = new ButtonStateNode( options.radius, createPushedButtonGradient( new Color( 235, 141, 24 ) ), translatedArrowShape );
    var disabledNode = new ButtonStateNode( options.radius, createButtonFillGradient( new Color( 180, 180, 180 ) ), curvedArrowShape );

    // Create the actual button by invoking the parent type.
    PushButton.call( this, upNode, overNode, downNode, disabledNode, options );

    // Add an explicit mouse area so that the child nodes can all be non-pickable.
    this.mouseArea = Shape.circle( 0, 0, options.radius );

    // Expand the touch area so that the button works better on touch devices.
    this.touchArea = Shape.circle( 0, 0, options.touchAreaRadius );
  }

  return inherit( PushButton, ResetAllButton );
} );