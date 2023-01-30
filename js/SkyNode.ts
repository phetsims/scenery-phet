// Copyright 2014-2023, University of Colorado Boulder

/**
 * Node that can be used to represent the sky.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import { Color, TColor } from '../../scenery/js/imports.js';
import GradientBackgroundNode from './GradientBackgroundNode.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  topColor?: TColor;
  bottomColor?: TColor;
};

export type SkyNodeOptions = SelfOptions; // superclass GradientBackgroundNode has no options

export default class SkyNode extends GradientBackgroundNode {
  public constructor( x: number, y: number, width: number, height: number, gradientEndHeight: number, providedOptions?: SkyNodeOptions ) {
    const options = optionize<SkyNodeOptions, SelfOptions>()( {
      topColor: new Color( 1, 172, 228 ),
      bottomColor: new Color( 208, 236, 251 )
    }, providedOptions );
    super( x, y, width, height, options.bottomColor, options.topColor, gradientEndHeight, y );
  }
}

sceneryPhet.register( 'SkyNode', SkyNode );