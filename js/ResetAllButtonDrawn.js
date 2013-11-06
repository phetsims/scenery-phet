// Copyright 2002-2013, University of Colorado Boulder

/**
 * Reset All button.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Includes
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PushButton = require( 'SUN/PushButton' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var DEFAULT_RADIUS = 32; // Derived from images initially used for reset button.

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
    var outerRadius = options.radius * 0.65;
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

    var outlineGradient = new RadialGradient( options.radius * 0.05, options.radius * 0.05, options.radius * 0.85, 0, 0, options.radius * 1.2 );
    outlineGradient.addColorStop( 0, 'black' );
    outlineGradient.addColorStop( 1, 'rgb( 230, 230, 230 )' );

    // Local function for creating the background.
    var createBackgroundNode = function() {
      return new Circle( options.radius, { fill: outlineGradient } );
    };

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
    var innerButtonRadius = options.radius * 0.92; // Multiplier determined by eyeballing it.
    var upNode = createBackgroundNode();
    upNode.addChild( new Circle( innerButtonRadius, { fill: createButtonFillGradient( new Color( 247, 151, 34 ) ) } ) );
    upNode.addChild( new Path( curvedArrowShape, { fill: 'white' } ) );
    var overNode = createBackgroundNode();
    overNode.addChild( new Circle( innerButtonRadius, { fill: createButtonFillGradient( new Color( 251, 171, 39 ) )} ) );
    overNode.addChild( new Path( curvedArrowShape, { fill: 'white' } ) );
    var downNode = createBackgroundNode();
    downNode.addChild( new Circle( innerButtonRadius, { fill: createPushedButtonGradient( new Color( 235, 141, 24 ) ) } ) );
    var downNodeArrow = new Path( curvedArrowShape, { fill: 'white' } );
    downNodeArrow.translate( -innerButtonRadius * 0.015, -innerButtonRadius * 0.015 );
    downNode.addChild( downNodeArrow );
    var disabledNode = createBackgroundNode();
    disabledNode.addChild( new Circle( innerButtonRadius, { fill: createButtonFillGradient( new Color( 220, 220, 220 ) ) } ) );
    disabledNode.addChild( new Path( curvedArrowShape, { fill: 'rgb( 240, 240, 240 )' } ) );

    // Create the actual button by invoking the parent type.
    PushButton.call( this, upNode, overNode, downNode, disabledNode, options );

    // Expend the touch area so that the button works better on touch devices.
    this.touchArea = Shape.circle( 0, 0, options.touchAreaRadius );
  }

  return inherit( PushButton, ResetAllButton );
} );