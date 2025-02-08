// Copyright 2024-2025, University of Colorado Boulder

/**
 * Creates a double-headed, dashed arrow used to cue sorting in the "group sort" interaction.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import HBox, { HBoxOptions } from '../../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import sceneryPhet from '../../../sceneryPhet.js';
import TriangleNode, { TriangleNodeOptions } from '../../../TriangleNode.js';

type SelfOptions = {
  numberOfDashes: number;
  doubleHead: boolean;
  dashHeight?: number;
  dashWidth?: number;
  triangleNodeOptions?: TriangleNodeOptions;
};

type SortCueArrowNodeOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class SortCueArrowNode extends HBox {

  public constructor( providedOptions: SortCueArrowNodeOptions ) {

    const options = optionize<SortCueArrowNodeOptions, SelfOptions, HBoxOptions>()( {
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

sceneryPhet.register( 'SortCueArrowNode', SortCueArrowNode );