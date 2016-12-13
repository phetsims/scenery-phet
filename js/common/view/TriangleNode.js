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
  var proportionPlayground = require( 'PROPORTION_PLAYGROUND/proportionPlayground' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Matrix3 = require( 'DOT/Matrix3' );

  // constants
  var TRIANGLE_LENGTH = 17;
  var TRIANGLE_ALTITUDE = 10;
  var LEFT_TRIANGLE_SHAPE = new Shape()
    .moveTo( 0, 0 )
    .lineTo( TRIANGLE_ALTITUDE, TRIANGLE_LENGTH / 2 )
    .lineTo( 0, TRIANGLE_LENGTH )
    .lineTo( 0, 0 );
  var RIGHT_TRIANGLE_SHAPE = LEFT_TRIANGLE_SHAPE.transformed( Matrix3.scaling( -1, 1 ) );

  /**
   *
   * @param {string} direction - 'left' or 'right'
   * @param {Object} [options]
   * @constructor
   */
  function TriangleNode( direction, options ) {
    assert && assert( direction === 'right' || direction === 'left', 'Direction should be right or left' );
    options = _.extend( { stroke: 'black', lineWidth: 1 }, options );
    Path.call( this, direction === 'right' ? RIGHT_TRIANGLE_SHAPE : LEFT_TRIANGLE_SHAPE, options );
  }

  proportionPlayground.register( 'TriangleNode', TriangleNode );

  return inherit( Path, TriangleNode );
} );
