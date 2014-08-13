// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scenery node that represents a backspace icon.  This was originally created for use on keypads, but may have other
 * applications.  This is set at a fixed size and can be scaled as needed.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function BackspaceIcon( options ) {
    options = _.extend( {
      stroke: 'black',
      lineWidth: 1,
      lineJoin: 'round',
      lineCap: 'square'

    }, options );

    var iconShape = new Shape().
      moveTo( 0, 5 ).
      lineTo( 5, 0 ).
      lineTo( 15, 0 ).
      lineTo( 15, 10 ).
      lineTo( 5, 10 ).
      close();

    // Add the x in the middle.
    iconShape.moveTo( 7, 3 );
    iconShape.lineTo( 11, 7 );
    iconShape.moveTo( 7, 7 );
    iconShape.lineTo( 11, 3 );

    Path.call( this, iconShape, options );
  }

  return inherit( Path, BackspaceIcon );
} );