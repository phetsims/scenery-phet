// Copyright 2002-2013, University of Colorado Boulder

/**
 * Reset All button.
 */
define( function( require ) {
  'use strict';

  // Includes
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PushButton = require( 'SUN/PushButton' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var DEFAULT_RADIUS = 33; // Derived from images initially used for reset button.

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
    curvedArrowShape.moveTo( innerRadius * Math.cos( startAngle ), innerRadius * Math.sin( startAngle ) );
    curvedArrowShape.lineTo( outerRadius * Math.cos( startAngle ), outerRadius * Math.sin( startAngle ) );
    var neckAngle = startAngle + endToNeckAngularSpan;
    curvedArrowShape.arc( 0, 0, outerRadius, startAngle, neckAngle, true ); // Outer curve.
    var headWidthExtrusion = ( headWidth - ( outerRadius - innerRadius ) ) / 2;
    curvedArrowShape.lineTo(
      ( outerRadius + headWidthExtrusion ) * Math.cos( neckAngle ),
      ( outerRadius + headWidthExtrusion ) * Math.sin( neckAngle ) );
    var pointRadius = ( outerRadius + innerRadius ) * 0.55; // Tweaked a little from center for better look.
    // Point of the arrow.
    curvedArrowShape.lineTo( pointRadius * Math.cos( neckAngle + arrowHeadAngularSpan ), pointRadius * Math.sin( neckAngle + arrowHeadAngularSpan ) );
    curvedArrowShape.lineTo( ( innerRadius - headWidthExtrusion ) * Math.cos( neckAngle ), ( innerRadius - headWidthExtrusion ) * Math.sin( neckAngle ) );
    curvedArrowShape.lineTo( innerRadius * Math.cos( neckAngle ), innerRadius * Math.sin( neckAngle ) );
    curvedArrowShape.arc( 0, 0, innerRadius, neckAngle, startAngle );
    curvedArrowShape.close();

    var node = new Circle( options.radius, { fill: 'orange' } );
    node.addChild( new Path( curvedArrowShape, { fill: 'white' } ) );

    PushButton.call( this,
      node,
      new Circle( options.radius, { fill: 'yellow' } ),
      new Circle( options.radius, { fill: 'pink' } ),
      new Circle( options.radius, { fill: 'gray' } ),
      callback, options );
    this.touchArea = Shape.circle( 0, 0, options.touchAreaRadius );
  }

  return inherit( PushButton, ResetAllButton );
} );