// Copyright 2014-2018, University of Colorado Boulder

/**
 * Scenery node that draws a backspace icon.
 * This was originally created for use on keypads, but may have other applications.
 *
 * @author John Blanco
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
  function BackspaceIcon( options ) {

    options = _.extend( {
      stroke: 'black',
      lineWidth: 1,
      lineJoin: 'round',
      lineCap: 'square',
      size: new Dimension2( 15, 10 )
    }, options );

    var iconShape = new Shape();

    // the outline, tip points left, described clockwise from the tip
    var tipWidth = options.size.width / 3;
    iconShape.moveTo( 0, tipWidth )
      .lineTo( tipWidth, 0 )
      .lineTo( options.size.width, 0 )
      .lineTo( options.size.width, options.size.height )
      .lineTo( tipWidth, options.size.height )
      .close();

    // the x in the middle, multipliers determined empirically
    var left = 0.47 * options.size.width;
    var right = 0.73 * options.size.width;
    var top = 0.3 * options.size.height;
    var bottom = 0.7 * options.size.height;
    iconShape.moveTo( left, top )
      .lineTo( right, bottom )
      .moveTo( right, top )
      .lineTo( left, bottom );

    Path.call( this, iconShape, options );
  }

  sceneryPhet.register( 'BackspaceIcon', BackspaceIcon );

  return inherit( Path, BackspaceIcon );
} );