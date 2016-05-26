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
  var triangleLength = 25;
  var triangleAltitude = Math.sqrt( 3 ) / 2 * triangleLength;
  var leftTriangleShape = new Shape()
    .moveTo( 0, 0 )
    .lineTo( triangleAltitude, triangleLength / 2 )
    .lineTo( 0, triangleLength )
    .lineTo( 0, 0 );
  var rightTriangleShape = leftTriangleShape.transformed( Matrix3.scaling( -1, 1 ) );

  function TriangleNode( direction, options ) {
    assert && assert( direction === 'right' || direction === 'left', 'Direction should be right or left' );
    options = _.extend( { stroke: 'black', lineWidth: 2 }, options );
    Path.call( this, direction === 'right' ? rightTriangleShape : leftTriangleShape, options );
  }

  proportionPlayground.register( 'TriangleNode', TriangleNode );

  return inherit( Path, TriangleNode );
} );