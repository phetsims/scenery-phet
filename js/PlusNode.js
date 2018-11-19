// Copyright 2014-2018, University of Colorado Boulder

/**
 * Plus sign, created using scenery.Path because scenery.Text("+") cannot be accurately centered.
 * Origin at upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function PlusNode( options ) {

    options = _.extend( {
      size: new Dimension2( 20, 5 ), // width of the plus sign, height of the horizontal line in plus sign
      fill: 'black'
    }, options );

    // + shape, starting from top left and moving clockwise
    var c1 = ( options.size.width / 2 ) - ( options.size.height / 2 );
    var c2 = ( options.size.width / 2 ) + ( options.size.height / 2 );
    var shape = new Shape()
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

    Path.call( this, shape, options );
  }

  sceneryPhet.register( 'PlusNode', PlusNode );

  return inherit( Path, PlusNode );
} );

