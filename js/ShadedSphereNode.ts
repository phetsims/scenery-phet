// Copyright 2013-2021, University of Colorado Boulder

/**
 * A 3D-looking sphere with a specular highlight.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import { Circle, CircleOptions, IColor, RadialGradient } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  mainColor?: IColor;
  highlightColor?: IColor;
  shadowColor?: IColor;
  highlightDiameter?: number;
  highlightXOffset?: number; // x-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
  highlightYOffset?: number; // y-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
};

export type ShadedSphereNodeOptions = SelfOptions & CircleOptions;

export default class ShadedSphereNode extends Circle {

  /**
   * @param diameter
   * @param providedOptions
   */
  constructor( diameter: number, providedOptions?: ShadedSphereNodeOptions ) {

    const options = optionize<ShadedSphereNodeOptions, SelfOptions, CircleOptions>( {

      // SelfOptions
      mainColor: 'gray',
      highlightColor: 'white',
      shadowColor: 'black',
      highlightDiameter: 0.5 * diameter,
      highlightXOffset: -0.4,
      highlightYOffset: -0.4
    }, providedOptions );

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