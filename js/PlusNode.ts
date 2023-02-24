// Copyright 2014-2023, University of Colorado Boulder

/**
 * Plus sign, created using phet.scenery.Path because scenery.Text("+") cannot be accurately centered.
 * Origin at upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import PlusShape from './PlusShape.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_SIZE = new Dimension2( 20, 5 );

type SelfOptions = {
  size?: Dimension2; // width = width & height of '+', height = thickness of '+'
};

export type PlusNodeOptions = SelfOptions & PathOptions;

export default class PlusNode extends Path {

  public constructor( providedOptions?: PlusNodeOptions ) {

    const options = optionize<PlusNodeOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      size: DEFAULT_SIZE,

      // PathOptions
      fill: 'black'
    }, providedOptions );

    super( new PlusShape( options.size ), options );
  }
}

sceneryPhet.register( 'PlusNode', PlusNode );