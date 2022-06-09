// Copyright 2014-2022, University of Colorado Boulder

/**
 * Star shape (full, 5-pointed)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  // Distance from the center to the tip of a star limb
  outerRadius?: number;

  // Distance from the center to the closest point on the exterior of the star.  Sets the "thickness" of the star limbs
  innerRadius?: number;

  // Number of star points, must be an integer
  numberStarPoints?: number;
};

export type StarShapeOptions = SelfOptions;

export default class StarShape extends Shape {

  public constructor( providedOptions?: StarShapeOptions ) {

    const options = optionize<StarShapeOptions, SelfOptions>()( {

      // SelfOptions
      outerRadius: 15,
      innerRadius: 7.5,
      numberStarPoints: 5
    }, providedOptions );

    super();

    const numSegments = 2 * options.numberStarPoints; // number of segments

    // start at the top and proceed clockwise
    _.times( numSegments, i => {
      const angle = i / numSegments * Math.PI * 2 - Math.PI / 2;
      const radius = i % 2 === 0 ? options.outerRadius : options.innerRadius;

      this.lineTo(
        radius * Math.cos( angle ),
        radius * Math.sin( angle )
      );
    } );
    this.close();
    this.makeImmutable(); // So Paths won't need to add listeners
  }
}

sceneryPhet.register( 'StarShape', StarShape );