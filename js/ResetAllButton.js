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
  var RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' );

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

      // Default orange color scheme, standard for PhET reset buttons
//      upFill: new Color( 247, 151, 34 ),
//      overFill: new Color( 251, 171, 39 ),
//      disabledFill: new Color( 180, 180, 180 ),
//      downFill: new Color( 235, 141, 24 ),

      // The arrow shape is not perfectly centered, account for that here, and see docs in RoundShinyButton
      iconOffsetX: 1,
      iconOffsetY: 0
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

    var icon = new Path( curvedArrowShape, { fill: 'white' } );

    RoundShinyButton.call( this, callback, icon, options );
  }

  return inherit( RoundShinyButton, ResetAllButton );
} );