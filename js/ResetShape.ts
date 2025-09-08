// Copyright 2016-2025, University of Colorado Boulder

/**
 * Shape used to indicate 'reset' of something, used on ResetButton.
 * Origin is at the center of the circle.
 *
 * @author John Blanco
 */

import Shape from '../../kite/js/Shape.js';
import sceneryPhet from './sceneryPhet.js';

export default class ResetShape extends Shape {

  /**
   * @param radius of the center of the reset arrow
   * @param adjustShapeForStroke - ResetAllButton expands the geometry to make room for the stroke
   */
  public constructor( radius: number, adjustShapeForStroke = false ) {

    super();

    // This 0.8 offset is related to the stroke width (which is currently 0.7, see ResetButton.ts). However, adjusting
    // by 0.7 here did not look correct and did not pass design review, so we had to adjust it independently.
    const RADIUS_ADJUSTMENT = adjustShapeForStroke ? 0.8 : 0;
    const HEAD_WIDTH_SCALE = adjustShapeForStroke ? 2.0 : 2.25;

    const INNER_RADIUS = radius * 0.4 - RADIUS_ADJUSTMENT;
    const OUTER_RADIUS = radius * 0.625 + RADIUS_ADJUSTMENT;
    const HEAD_WIDTH = HEAD_WIDTH_SCALE * ( OUTER_RADIUS - INNER_RADIUS );

    const START_ANGLE = -Math.PI * 0.35;
    const END_TO_NECK_ANGULAR_SPAN = -2 * Math.PI * 0.85;
    const ARROW_HEAD_ANGULAR_SPAN = -Math.PI * 0.18;

    // Create the curved arrow shape, starting at the inside of the non-pointed end.
    // Inner edge of end.
    this.moveTo( INNER_RADIUS * Math.cos( START_ANGLE ), INNER_RADIUS * Math.sin( START_ANGLE ) );
    this.lineTo( OUTER_RADIUS * Math.cos( START_ANGLE ), OUTER_RADIUS * Math.sin( START_ANGLE ) );
    const neckAngle = START_ANGLE + END_TO_NECK_ANGULAR_SPAN;

    // Outer curve.
    this.arc( 0, 0, OUTER_RADIUS, START_ANGLE, neckAngle, true );
    const HEAD_WIDTHExtrusion = ( HEAD_WIDTH - ( OUTER_RADIUS - INNER_RADIUS ) ) / 2;
    this.lineTo(
      ( OUTER_RADIUS + HEAD_WIDTHExtrusion ) * Math.cos( neckAngle ),
      ( OUTER_RADIUS + HEAD_WIDTHExtrusion ) * Math.sin( neckAngle ) );

    // Tip of arrowhead.
    const pointRadius = ( OUTER_RADIUS + INNER_RADIUS ) * 0.55; // Tweaked a little from center for better look.
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
}

sceneryPhet.register( 'ResetShape', ResetShape );