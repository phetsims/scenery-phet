// Copyright 2013-2021, University of Colorado Boulder

/**
 * A 3D-looking sphere with a specular highlight.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import RadialGradient from '../../scenery/js/util/RadialGradient.js';
import sceneryPhet from './sceneryPhet.js';

class ShadedSphereNode extends Circle {

  /**
   * @param {number} diameter
   * @param {Object} [options]
   */
  constructor( diameter, options ) {

    options = merge( {
      mainColor: 'gray',
      highlightColor: 'white',
      shadowColor: 'black',
      highlightDiameter: 0.5 * diameter,
      highlightXOffset: -0.4, // x-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
      highlightYOffset: -0.4  // y-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
    }, options );

    // validate option values
    assert && assert( options.highlightDiameter < diameter,
      `highlightDiameter must be < diameter: ${options.highlightDiameter}` );
    assert && assert( options.highlightXOffset >= -1 && options.highlightXOffset <= 1,
      `highlightXOffset out of range: ${options.highlightXOffset}` );
    assert && assert( options.highlightYOffset >= -1 && options.highlightYOffset <= 1,
      `highlightYOffset out of range: ${options.highlightYOffset}` );

    const radius = diameter / 2;
    const highlightX = radius * options.highlightXOffset;
    const highlightY = radius * options.highlightYOffset;
    options.fill = new RadialGradient( highlightX, highlightY, 0, highlightX, highlightY, diameter )
      .addColorStop( 0, options.highlightColor )
      .addColorStop( options.highlightDiameter / diameter, options.mainColor )
      .addColorStop( 1, options.shadowColor );

    super( radius, options );
  }
}

sceneryPhet.register( 'ShadedSphereNode', ShadedSphereNode );
export default ShadedSphereNode;