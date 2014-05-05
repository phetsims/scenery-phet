// Copyright 2002-2014, University of Colorado Boulder

/**
 * Reset All button.  This version is drawn in code using shapes, gradients,
 * and such, and does not use any image files.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  // Constants
  var DEFAULT_RADIUS = 24; // Derived from images initially used for reset button.

  /**
   * @param {Object} options
   * @constructor
   */
  function ResetAllButton( options ) {
    options = _.extend( {
      radius: DEFAULT_RADIUS,
      minXMargin: ( options.radius || DEFAULT_RADIUS ) * 0.2,

      // Default orange color scheme, standard for PhET reset buttons
      baseColor: new Color( 247, 151, 34 ),

      // The arrow shape doesn't look right when perfectly centered, account
      // for that here, and see docs in RoundButtonView.  The multiplier
      // values were empirically determined.
      xContentOffset: ( options.radius || DEFAULT_RADIUS ) * 0.03,
      yContentOffset: ( options.radius || DEFAULT_RADIUS ) * ( -0.0125 )
    }, options );

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

    RoundPushButton.call( this, _.extend( { content: icon }, options ) );
  }

  return inherit( RoundPushButton, ResetAllButton );
} );