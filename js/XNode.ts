// Copyright 2022, University of Colorado Boulder

/**
 * XNode is a specialized view for displaying a 'x'. It is used throughout the sim to indicate the center of mass
 * of a system of Balls. Generalized to appear as a icon as well.
 *
 * XNode's rendering strategy is to sub-type PlusNode and rotate the Node 45 degrees.
 *
 * @author Brandon Li
 * @author Alex Schor
 */

import sceneryPhet from './sceneryPhet.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import PlusNode, { PlusNodeOptions } from './PlusNode.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {

  // thickness of the legs of the 'x'
  legThickness?: number;

  // the length of the diagonal of the 'x'.
  length?: number;
};

export type XNodeOptions = SelfOptions & StrictOmit<PlusNodeOptions, 'size' | 'rotation'>;

export default class XNode extends PlusNode {

  public constructor( providedOptions?: XNodeOptions ) {

    const options = optionize<XNodeOptions, SelfOptions, PlusNodeOptions>()( {

      // XNodeOptions
      legThickness: 6,
      length: 22,

      // PlusNodeOptions
      lineWidth: 1.5
    }, providedOptions );

    options.size = new Dimension2( options.length, options.legThickness );
    options.rotation = Math.PI / 4;

    super( options );
  }
}
sceneryPhet.register( 'XNode', XNode );