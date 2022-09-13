// Copyright 2013-2022, University of Colorado Boulder

/**
 * A 3D-looking sphere with a specular highlight.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { Circle, CircleOptions, TColor, RadialGradient } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  mainColor?: TColor;
  highlightColor?: TColor;
  shadowColor?: TColor;
  highlightDiameterRatio?: number;
  highlightXOffset?: number; // x-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
  highlightYOffset?: number; // y-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
};

export type ShadedSphereNodeOptions = SelfOptions & StrictOmit<CircleOptions, 'fill'>;

export default class ShadedSphereNode extends Circle {

  private readonly updateShadedSphereFill: () => void;

  public constructor( diameter: number, providedOptions?: ShadedSphereNodeOptions ) {

    const options = optionize<ShadedSphereNodeOptions, SelfOptions, CircleOptions>()( {

      // SelfOptions
      mainColor: 'gray',
      highlightColor: 'white',
      shadowColor: 'black',
      highlightDiameterRatio: 0.5,
      highlightXOffset: -0.4,
      highlightYOffset: -0.4
    }, providedOptions );

    // validate option values
    assert && assert( options.highlightDiameterRatio < 1,
      `highlightDiameterRatio must be < diameter: ${options.highlightDiameterRatio}` );
    assert && assert( options.highlightXOffset >= -1 && options.highlightXOffset <= 1,
      `highlightXOffset out of range: ${options.highlightXOffset}` );
    assert && assert( options.highlightYOffset >= -1 && options.highlightYOffset <= 1,
      `highlightYOffset out of range: ${options.highlightYOffset}` );

    super( diameter / 2, options );

    this.updateShadedSphereFill = () => {
      const radius = this.radius;
      const highlightX = radius * options.highlightXOffset;
      const highlightY = radius * options.highlightYOffset;
      this.fill = new RadialGradient( highlightX, highlightY, 0, highlightX, highlightY, radius * 2 )
        .addColorStop( 0, options.highlightColor )
        .addColorStop( options.highlightDiameterRatio, options.mainColor )
        .addColorStop( 1, options.shadowColor );
    };

    this.updateShadedSphereFill();
  }

  protected override invalidatePath(): void {
    super.invalidatePath();

    // Called during the super() call, so we may not be defined yet. We'll call this during the constructor
    // manually.
    this.updateShadedSphereFill && this.updateShadedSphereFill();
  }
}

sceneryPhet.register( 'ShadedSphereNode', ShadedSphereNode );