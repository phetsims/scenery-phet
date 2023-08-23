// Copyright 2023, University of Colorado Boulder

/**
 * Creates a dashed arrow use for the drag indicator in the ball play area and the cards play area.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { HBox, HBoxOptions, Node, Rectangle } from '../../../scenery/js/imports.js';
import TriangleNode, { TriangleNodeOptions } from '../../../scenery-phet/js/TriangleNode.js';
import optionize, { combineOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import soccerCommon from '../soccerCommon.js';

type SelfOptions = {
  numberOfDashes: number;
  doubleHead: boolean;
  dashHeight?: number;
  dashWidth?: number;
  triangleNodeOptions?: TriangleNodeOptions;
};

type InteractiveCueArrowNodeOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class InteractiveCueArrowNode extends HBox {

  public constructor( providedOptions: InteractiveCueArrowNodeOptions ) {

    const options = optionize<InteractiveCueArrowNodeOptions, SelfOptions, HBoxOptions>()( {
      dashHeight: 2,
      dashWidth: 2,
      triangleNodeOptions: {},

      isDisposable: false
    }, providedOptions );

    const createArrowHead = ( pointDirection: 'right' | 'left' ) => {

      const triangleNodeOptions = combineOptions<TriangleNodeOptions>( {
        pointDirection: pointDirection,
        triangleWidth: 6,
        triangleHeight: 5,
        fill: 'black'
      }, options.triangleNodeOptions );

      return new TriangleNode( triangleNodeOptions );
    };

    const dashes: Node[] = [];

    _.times( options.numberOfDashes, () => {
      dashes.push( new Rectangle( 0, 0, options.dashWidth, options.dashHeight, { fill: 'black' } ) );
    } );

    const superOptions = combineOptions<HBoxOptions>( {
      children: [
        ...( options.doubleHead ? [ createArrowHead( 'left' ) ] : [] ),
        ...dashes,
        createArrowHead( 'right' )
      ],
      spacing: 2
    }, providedOptions );

    super( superOptions );
  }
}

soccerCommon.register( 'InteractiveCueArrowNode', InteractiveCueArrowNode );