// Copyright 2014-2021, University of Colorado Boulder

/**
 * Plus sign, created using scenery.Path because scenery.Text("+") cannot be accurately centered.
 * Origin at upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import { Path } from '../../scenery/js/imports.js';
import PlusShape from './PlusShape.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_SIZE = new Dimension2( 20, 5 );

class PlusNode extends Path {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      size: DEFAULT_SIZE, // width of the plus sign, height of the horizontal line in plus sign
      fill: 'black'
    }, options );

    super( new PlusShape( options.size ), options );
  }
}

sceneryPhet.register( 'PlusNode', PlusNode );
export default PlusNode;