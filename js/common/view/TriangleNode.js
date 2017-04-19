// Copyright 2016, University of Colorado Boulder

/**
 * Triangle indicators used in the paint gradient and apple graph.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Path = require( 'SCENERY/nodes/Path' );
  var proportionPlayground = require( 'PROPORTION_PLAYGROUND/proportionPlayground' );
  var Shape = require( 'KITE/Shape' );
  var Side = require( 'PROPORTION_PLAYGROUND/common/model/Side' );

  // constants
  var TRIANGLE_LENGTH = 17;
  var TRIANGLE_ALTITUDE = 10;
  var LEFT_TRIANGLE_SHAPE = new Shape().moveTo( 0, 0 )
                                       .lineTo( TRIANGLE_ALTITUDE, TRIANGLE_LENGTH / 2 )
                                       .lineTo( 0, TRIANGLE_LENGTH )
                                       .lineTo( 0, 0 );
  var RIGHT_TRIANGLE_SHAPE = LEFT_TRIANGLE_SHAPE.transformed( Matrix3.scaling( -1, 1 ) );

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
