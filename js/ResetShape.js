// Copyright 2016-2017, University of Colorado Boulder

/**
 * Shape used to indicate 'reset' of something, used on ResetButton.
 * Origin is at the center of the circle.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {number} radius of the center of the reset arrow
   * @constructor
   */
  function ResetShape( radius ) {

    Shape.call( this );

    // Adjust these parameters to tweak the appearance of the arrow.
    var INNER_RADIUS = radius * 0.4;
    var OUTER_RADIUS = radius * 0.625;
    var HEAD_WIDTH = 2.25 * ( OUTER_RADIUS - INNER_RADIUS );
    var START_ANGLE = -Math.PI * 0.35;
    var END_TO_NECK_ANGULAR_SPAN = -2 * Math.PI * 0.85;
    var ARROW_HEAD_ANGULAR_SPAN = -Math.PI * 0.18;

    // Create the curved arrow shape, starting at the inside of the non-pointed end.
    // Inner edge of end.
    this.moveTo( INNER_RADIUS * Math.cos( START_ANGLE ), INNER_RADIUS * Math.sin( START_ANGLE ) );
    this.lineTo( OUTER_RADIUS * Math.cos( START_ANGLE ), OUTER_RADIUS * Math.sin( START_ANGLE ) );
    var neckAngle = START_ANGLE + END_TO_NECK_ANGULAR_SPAN;
    
    // Outer curve.
    this.arc( 0, 0, OUTER_RADIUS, START_ANGLE, neckAngle, true );
    var HEAD_WIDTHExtrusion = ( HEAD_WIDTH - ( OUTER_RADIUS - INNER_RADIUS ) ) / 2;
    this.lineTo(
      ( OUTER_RADIUS + HEAD_WIDTHExtrusion ) * Math.cos( neckAngle ),
      ( OUTER_RADIUS + HEAD_WIDTHExtrusion ) * Math.sin( neckAngle ) );

    // Tip of arrowhead.
    var pointRadius = ( OUTER_RADIUS + INNER_RADIUS ) * 0.55; // Tweaked a little from center for better look.
    this.lineTo(
      pointRadius * Math.cos( neckAngle + ARROW_HEAD_ANGULAR_SPAN ),
      pointRadius * Math.sin( neckAngle + ARROW_HEAD_ANGULAR_SPAN ) );
    this.lineTo(
      ( INNER_RADIUS - HEAD_WIDTHExtrusion ) * Math.cos( neckAngle ),
      ( INNER_RADIUS - HEAD_WIDTHExtrusion ) * Math.sin( neckAngle ) );
    this.lineTo(
      INNER_RADIUS * Math.cos( neckAngle ),
      INNER_RADIUS * Math.sin( neckAngle ) );
   
    // Inner curve.
    this.arc( 0, 0, INNER_RADIUS, neckAngle, START_ANGLE );
    this.close();
  }

  sceneryPhet.register( 'ResetShape', ResetShape );

  return inherit( Shape, ResetShape );
} );
