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

    // Local convenience functions for creating gradients to use on buttons.
    var createButtonFillGradient = function( baseColor ) {
      var buttonGradient = new RadialGradient( options.radius * 0.1, options.radius * 0.1, options.radius * 0.8, 0, 0, options.radius );
      buttonGradient.addColorStop( 0, baseColor );
      buttonGradient.addColorStop( 0.8, baseColor.colorUtilsBrighter( 0.7 ) );
      buttonGradient.addColorStop( 1, 'white' );
      return buttonGradient;
    };
    var createPushedButtonGradient = function( baseColor ) {
      var buttonGradient = new RadialGradient( 0, 0, options.radius * 0.5, 0, 0, options.radius );
      buttonGradient.addColorStop( 0, baseColor );
      buttonGradient.addColorStop( 0.6, baseColor.colorUtilsDarker( 0.1 ) );
      buttonGradient.addColorStop( 0.8, baseColor );
      return buttonGradient;
    };

    var outlineGradient = new RadialGradient( -options.radius * 0.4, -options.radius * 0.4, 0, -options.radius * 0.4, -options.radius * 0.4, options.radius * 1.6 );
    outlineGradient.addColorStop( 0, 'rgb( 230, 230, 230 )' );
    outlineGradient.addColorStop( 1, 'black' );

    // Create the nodes for each of the button states.
    var upNode = new Circle( options.radius, { fill: createButtonFillGradient( new Color( 247, 151, 34 ) ), stroke: outlineGradient, lineWidth: 2 } );
    upNode.addChild( new Path( curvedArrowShape, { fill: 'white' } ) );
    var overNode = new Circle( options.radius, { fill: createButtonFillGradient( new Color( 251, 171, 39 ) ), stroke: outlineGradient, lineWidth: 2 } );
    overNode.addChild( new Path( curvedArrowShape, { fill: 'white' } ) );
    var downNode = new Circle( options.radius, { fill: createPushedButtonGradient( new Color( 235, 141, 24 ) ), stroke: outlineGradient, lineWidth: 2 } );
    var downNodeArrow = new Path( curvedArrowShape, { fill: 'white' } );
    downNodeArrow.translate( -options.radius * 0.03, -options.radius * 0.03 );
    downNode.addChild( downNodeArrow );
    var disabledNode = new Circle( options.radius, { fill: createButtonFillGradient( new Color( 220, 220, 220 ) ), stroke: outlineGradient, lineWidth: 2 } );
    disabledNode.addChild( new Path( curvedArrowShape, { fill: 'rgb( 240, 240, 240 )' } ) );

    // Create the actual button by invoking the parent type.
    PushButton.call( this, upNode, overNode, downNode, disabledNode, options );

    // Expend the touch area so that the button works better on touch devices.
    this.touchArea = Shape.circle( 0, 0, options.touchAreaRadius );
  }

  return inherit( PushButton, ResetAllButton );
} );