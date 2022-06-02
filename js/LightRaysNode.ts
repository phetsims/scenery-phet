// Copyright 2015-2022, University of Colorado Boulder

/**
 * Light rays that indicate brightness of a light source such as a bulb.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';

// constants, these are specific to bulb images
const RAYS_START_ANGLE = 3 * Math.PI / 4;
const RAYS_ARC_ANGLE = 3 * Math.PI / 2;

type SelfOptions = {
  minRays?: number;
  maxRays?: number;
  minRayLength?: number;
  maxRayLength?: number;
  longRayLineWidth?: number; // for long rays
  mediumRayLineWidth?: number; // for medium-length rays
  shortRayLineWidth?: number; // for short rays
};

export type LightRaysNodeOptions = SelfOptions & PathOptions;

export default class LightRaysNode extends Path {

  private readonly bulbRadius: number;
  private readonly minRays: number;
  private readonly maxRays: number;
  private readonly minRayLength: number;
  private readonly maxRayLength: number;
  private readonly longRayLineWidth: number;
  private readonly mediumRayLineWidth: number;
  private readonly shortRayLineWidth: number;

  public constructor( bulbRadius: number, provideOptions?: LightRaysNodeOptions ) {

    assert && assert( bulbRadius > 0 );

    const options = optionize<LightRaysNodeOptions, SelfOptions, PathOptions>()( {

      // LightRaysNodeOptions
      minRays: 8,
      maxRays: 60,
      minRayLength: 0,
      maxRayLength: 200,
      longRayLineWidth: 1.5, // for long rays
      mediumRayLineWidth: 1, // for medium-length rays
      shortRayLineWidth: 0.5, // for short rays

      // PathOptions
      stroke: 'yellow',
      tandem: Tandem.OPTIONAL
    }, provideOptions );

    super( null );

    this.bulbRadius = bulbRadius;
    this.minRays = options.minRays;
    this.maxRays = options.maxRays;
    this.minRayLength = options.minRayLength;
    this.maxRayLength = options.maxRayLength;
    this.mediumRayLineWidth = options.mediumRayLineWidth;
    this.longRayLineWidth = options.longRayLineWidth;
    this.shortRayLineWidth = options.shortRayLineWidth;

    // Ensures there are well-defined bounds at initialization
    this.setBrightness( 0 );

    this.mutate( options );
  }

  /**
   * Sets the brightness, which updates the number and length of light rays.
   * @param brightness -a value in the range [0,1]
   */
  public setBrightness( brightness: number ): void {

    assert && assert( brightness >= 0 && brightness <= 1 );

    // number of rays is a function of brightness
    const numberOfRays = ( brightness === 0 ) ? 0 : this.minRays + Utils.roundSymmetric( brightness * ( this.maxRays - this.minRays ) );

    // ray length is a function of brightness
    const rayLength = this.minRayLength + ( brightness * ( this.maxRayLength - this.minRayLength ) );

    let angle = RAYS_START_ANGLE;
    const deltaAngle = RAYS_ARC_ANGLE / ( numberOfRays - 1 );

    // The ray line width is a linear function within the allowed range
    const lineWidth = Utils.linear(
      0.3 * this.maxRayLength,
      0.6 * this.maxRayLength,
      this.shortRayLineWidth,
      this.longRayLineWidth,
      rayLength
    );
    this.lineWidth = Utils.clamp( lineWidth, this.shortRayLineWidth, this.longRayLineWidth );

    const shape = new Shape();

    // rays fill part of a circle, incrementing clockwise
    for ( let i = 0, x1, x2, y1, y2; i < this.maxRays; i++ ) {
      if ( i < numberOfRays ) {

        // determine the end points of the ray
        x1 = Math.cos( angle ) * this.bulbRadius;
        y1 = Math.sin( angle ) * this.bulbRadius;
        x2 = Math.cos( angle ) * ( this.bulbRadius + rayLength );
        y2 = Math.sin( angle ) * ( this.bulbRadius + rayLength );

        shape.moveTo( x1, y1 ).lineTo( x2, y2 );

        // increment the angle
        angle += deltaAngle;
      }
    }

    // Set shape to an invisible circle to maintain local bounds if there aren't any rays.
    this.setVisible( numberOfRays > 0 );
    if ( numberOfRays === 0 ) {
      shape.circle( 0, 0, this.bulbRadius );
    }

    // Set the shape of the path to the shape created above
    this.setShape( shape );
  }
}

sceneryPhet.register( 'LightRaysNode', LightRaysNode );