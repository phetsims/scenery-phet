// Copyright 2016-2019, University of Colorado Boulder

/**
 * Triangle indicators used in the paint gradient and apple graph.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Path = require( 'SCENERY/nodes/Path' );
  const proportionPlayground = require( 'PROPORTION_PLAYGROUND/proportionPlayground' );
  const Shape = require( 'KITE/Shape' );
  const Side = require( 'PROPORTION_PLAYGROUND/common/model/Side' );

  // constants
  const TRIANGLE_LENGTH = 17;
  const TRIANGLE_ALTITUDE = 10;
  const LEFT_TRIANGLE_SHAPE = new Shape().moveTo( 0, 0 )
    .lineTo( TRIANGLE_ALTITUDE, TRIANGLE_LENGTH / 2 )
    .lineTo( 0, TRIANGLE_LENGTH )
    .lineTo( 0, 0 );
  const RIGHT_TRIANGLE_SHAPE = LEFT_TRIANGLE_SHAPE.transformed( Matrix3.scaling( -1, 1 ) );

  /**
   * @constructor
   * @extends {Path}
   *
   * @param {Side} side - Side.LEFT or Side.RIGHT
   * @param {Object} [options]
   */
  function TriangleNode( side, options ) {
    assert && assert( Side.isSide( side ), 'Side should be Side.LEFT or Side.RIGHT' );

    // defaults
    options = _.extend( {
      stroke: 'black',
      lineWidth: 1
    }, options );

    Path.call( this, side === Side.LEFT ? LEFT_TRIANGLE_SHAPE : RIGHT_TRIANGLE_SHAPE, options );
  }

  proportionPlayground.register( 'TriangleNode', TriangleNode );

  return inherit( Path, TriangleNode );
} );
