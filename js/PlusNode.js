// Copyright 2002-2013, University of Colorado Boulder

/**
 * Plus sign, created using scenery.Path because scenery.Text("+") cannot be accurately centered.
 * Origin at upper left.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Dimension2} size
   * @param {*} options
   * @constructor
   */
  function PlusNode( size, options ) {

    // + shape, starting from top left and moving clockwise
    var c1 = ( size.width / 2 ) - ( size.height / 2 );
    var c2 = ( size.width / 2 ) + ( size.height / 2 );
    var shape = new Shape()
      .moveTo( c1, 0 )
      .lineTo( c2, 0 )
      .lineTo( c2, c1 )
      .lineTo( size.width, c1 )
      .lineTo( size.width, c2 )
      .lineTo( c2, c2 )
      .lineTo( c2, size.width )/* yes, use width for y param */
      .lineTo( c1, size.width )/* yes, use width for y param */
      .lineTo( c1, c2 )
      .lineTo( 0, c2 )
      .lineTo( 0, c1 )
      .lineTo( c1, c1 )
      .close();

    options = _.extend( { fill: 'black' }, options );

    Path.call( this, shape, options );
  }

  return inherit( Path, PlusNode );
} );

