// Copyright 2014-2023, University of Colorado Boulder

/**
 * Node that can be used to represent the ground.
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

export type GroundNodeOptions = SelfOptions; // superclass GradientBackgroundNode has no options

class GroundNode extends GradientBackgroundNode {
  public constructor( x: number, y: number, width: number, height: number, gradientEndDepth: number, providedOptions?: GroundNodeOptions ) {
    const options = optionize<GroundNodeOptions, SelfOptions>()( {
      topColor: new Color( 144, 199, 86 ),
      bottomColor: new Color( 103, 162, 87 )
    }, providedOptions );
    super( x, y, width, height, options.topColor, options.bottomColor, y, gradientEndDepth );
  }
}

sceneryPhet.register( 'GroundNode', GroundNode );
export default GroundNode;