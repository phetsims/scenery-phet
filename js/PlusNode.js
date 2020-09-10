// Copyright 2014-2020, University of Colorado Boulder

/**
 * Plus sign, created using scenery.Path because scenery.Text("+") cannot be accurately centered.
 * Origin at upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
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

    // + shape, starting from top left and moving clockwise
    const c1 = ( options.size.width / 2 ) - ( options.size.height / 2 );
    const c2 = ( options.size.width / 2 ) + ( options.size.height / 2 );
    const shape = new Shape()
      .moveTo( c1, 0 )
      .lineTo( c2, 0 )
      .lineTo( c2, c1 )
      .lineTo( options.size.width, c1 )
      .lineTo( options.size.width, c2 )
      .lineTo( c2, c2 )
      .lineTo( c2, options.size.width )/* yes, use width for y param */
      .lineTo( c1, options.size.width )/* yes, use width for y param */
      .lineTo( c1, c2 )
      .lineTo( 0, c2 )
      .lineTo( 0, c1 )
      .lineTo( c1, c1 )
      .close();

    super( shape, options );
  }
}

sceneryPhet.register( 'PlusNode', PlusNode );
export default PlusNode;