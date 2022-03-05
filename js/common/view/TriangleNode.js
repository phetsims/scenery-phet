// Copyright 2016-2022, University of Colorado Boulder

/**
 * Triangle indicators used in the paint gradient and apple graph.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Path } from '../../../../scenery/js/imports.js';
import proportionPlayground from '../../proportionPlayground.js';
import Side from '../model/Side.js';

// constants
const TRIANGLE_LENGTH = 17;
const TRIANGLE_ALTITUDE = 10;
const LEFT_TRIANGLE_SHAPE = new Shape().moveTo( 0, 0 )
  .lineTo( TRIANGLE_ALTITUDE, TRIANGLE_LENGTH / 2 )
  .lineTo( 0, TRIANGLE_LENGTH )
  .lineTo( 0, 0 );
const RIGHT_TRIANGLE_SHAPE = LEFT_TRIANGLE_SHAPE.transformed( Matrix3.scaling( -1, 1 ) );

class TriangleNode extends Path {
  /**
   * @param {Side} side - Side.LEFT or Side.RIGHT
   * @param {Object} [options]
   */
  constructor( side, options ) {
    assert && assert( Side.includes( side ), 'Side should be Side.LEFT or Side.RIGHT' );

    // defaults
    options = merge( {
      stroke: 'black',
      lineWidth: 1
    }, options );

    super( side === Side.LEFT ? LEFT_TRIANGLE_SHAPE : RIGHT_TRIANGLE_SHAPE, options );
  }
}

proportionPlayground.register( 'TriangleNode', TriangleNode );

export default TriangleNode;