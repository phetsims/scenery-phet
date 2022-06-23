// Copyright 2022, University of Colorado Boulder

/**
 * Triangle indicators used in the paint gradient and apple graph.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Matrix3 from '../../dot/js/Matrix3.js';
import { Shape } from '../../kite/js/imports.js';
import merge from '../../phet-core/js/merge.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import Side from '../../proportion-playground/js/common/model/Side.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const TRIANGLE_LENGTH = 17;
const TRIANGLE_ALTITUDE = 10;
const LEFT_TRIANGLE_SHAPE = new Shape().moveTo( 0, 0 )
  .lineTo( TRIANGLE_ALTITUDE, TRIANGLE_LENGTH / 2 )
  .lineTo( 0, TRIANGLE_LENGTH )
  .lineTo( 0, 0 );
const RIGHT_TRIANGLE_SHAPE = LEFT_TRIANGLE_SHAPE.transformed( Matrix3.scaling( -1, 1 ) );

type selfOptions = {
  stroke: 'black';
  lineWidth: 1;
}

type triangleNodeOptions = selfOptions & PathOptions;

export default class TriangleNode extends Path {

  /**
   *
   */
  public constructor( side: typeof Side, providedOptions: triangleNodeOptions ) {
    assert && assert( Side.includes( side ), 'Side should be Side.LEFT or Side.RIGHT' );

    // defaults
    const options = merge( {
      stroke: 'black',
      lineWidth: 1
    }, providedOptions );

    super( side === Side ? LEFT_TRIANGLE_SHAPE : RIGHT_TRIANGLE_SHAPE, options );
  }
}

sceneryPhet.register( 'TriangleNode', TriangleNode );
