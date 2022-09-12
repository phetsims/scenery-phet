// Copyright 2017-2022, University of Colorado Boulder

/**
 * An octagonal, red stop sign node with a white internal border
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../kite/js/imports.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import optionize from '../../phet-core/js/optionize.js';
import { TColor, Node, NodeOptions, Path } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const NUMBER_OF_SIDES = 8;

type SelfOptions = {
  fillRadius?: number;
  innerStrokeWidth?: number;
  outerStrokeWidth?: number;
  fill?: TColor;
  innerStroke?: TColor;
  outerStroke?: TColor;
};

export type StopSignNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class StopSignNode extends Node {

  public constructor( providedOptions?: StopSignNodeOptions ) {

    const options = optionize<StopSignNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fillRadius: 23,
      innerStrokeWidth: 2,
      outerStrokeWidth: 1,
      fill: 'red',
      innerStroke: 'white',
      outerStroke: 'black',

      // NodeOptions
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'StopSignNode'
    }, providedOptions );

    options.children = [
      createStopSignPath( options.outerStroke, options.fillRadius + options.innerStrokeWidth + options.outerStrokeWidth ),
      createStopSignPath( options.innerStroke, options.fillRadius + options.innerStrokeWidth ),
      createStopSignPath( options.fill, options.fillRadius )
    ];

    super( options );
  }
}

function createStopSignPath( fill: TColor, radius: number ): Path {
  return new Path( Shape.regularPolygon( NUMBER_OF_SIDES, radius ), {
    fill: fill,
    rotation: Math.PI / NUMBER_OF_SIDES,

    // To support centering when stacked in z-order
    centerX: 0,
    centerY: 0
  } );
}

sceneryPhet.register( 'StopSignNode', StopSignNode );