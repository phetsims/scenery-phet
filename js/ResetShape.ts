// Copyright 2016-2022, University of Colorado Boulder

/**
 * Shape used to indicate 'reset' of something, used on ResetButton.
 * Origin is at the center of the circle.
 *
 * @author John Blanco
 */

import { Shape } from '../../kite/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

export default class ResetShape extends Shape {

  /**
   * @param radius of the center of the reset arrow
   */
  public constructor( radius: number ) {

    super();

    // Adjust these parameters to tweak the appearance of the arrow.
    const INNER_RADIUS = radius * 0.4;
    const OUTER_RADIUS = radius * 0.625;
    const HEAD_WIDTH = 2.25 * ( OUTER_RADIUS - INNER_RADIUS );
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