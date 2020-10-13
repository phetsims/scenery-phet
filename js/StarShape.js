// Copyright 2014-2020, University of Colorado Boulder

/**
 * Star shape (full, 5-pointed)
 *
 * @author Sam Reid
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import sceneryPhet from './sceneryPhet.js';

class StarShape extends Shape {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Distance from the center to the tip of a star limb
      outerRadius: 15,

      // Distance from the center to the closest point on the exterior of the star.  Sets the "thickness" of the star limbs
      innerRadius: 7.5,

      // Number of star points, must be an integer
      numberStarPoints: 5
    }, options );

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

export default StarShape;