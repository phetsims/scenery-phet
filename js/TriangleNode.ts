// Copyright 2022, University of Colorado Boulder

/**
 * Draws an equilateral or isosceles triangle pointing up by default.
 * triangleWidth sets the base, while triangleHeight sets the altitude.
 * The point of the triangle is drawn to be perpendicular from the halfway point of the base.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { Shape } from '../../kite/js/imports.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {
  pointDirection?: string; // up, right, down, left
  triangleWidth?: number;
  triangleHeight?: number;
};
export type TriangleNodeOptions = SelfOptions & PathOptions;

export default class TriangleNode extends Path {

  public constructor( providedOptions: TriangleNodeOptions ) {

    // defaults
    const options = optionize<TriangleNodeOptions, SelfOptions, PathOptions>()( {
      pointDirection: 'up',
      triangleWidth: 15,
      triangleHeight: 13,
      stroke: 'black',
      lineWidth: 1
    }, providedOptions );

    // Draws an equilateral or isosceles triangle
    const triangleShape = new Shape().moveTo( options.triangleWidth / 2, 0 )
      .lineTo( options.triangleWidth, options.triangleHeight )
      .lineTo( 0, options.triangleHeight )
      .lineTo( options.triangleWidth / 2, 0 );

    super( triangleShape, options );

    // rotate triangle according to provided options
    if ( options.pointDirection === 'up' ) {
      this.rotation = 0;
    }
    else if ( options.pointDirection === 'right' ) {
      this.rotation = Math.PI / 2;
    }
    else if ( options.pointDirection === 'down' ) {
      this.rotation = Math.PI;
    }
    else if ( options.pointDirection === 'left' ) {
      this.rotation = -Math.PI / 2;
    }
  }
}

sceneryPhet.register( 'TriangleNode', TriangleNode );
