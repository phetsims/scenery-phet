// Copyright 2014-2015, University of Colorado Boulder

/**
 * The paper airplane that is part of the PhET logo.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function PaperAirplaneNode( options ) {

    options = _.extend( {
      size: new Dimension2( 20, 16 ), // dimensions taken from screen shot of logo on main site
      fill: PhetColorScheme.PHET_YELLOW
    }, options );

    // Define the shape.  This was done by trial and error and a little math.
    var bodyShape = new Shape();
    var width = options.size.width;
    var height = options.size.height;

    // main body
    bodyShape.moveTo( width, 0 ); // front tip
    bodyShape.lineTo( width * 0.8, height * 0.9 ); // right wing tip
    bodyShape.lineTo( width * 0.45, height * 0.725 );
    bodyShape.lineTo( width * 0.85, height * 0.2 );
    bodyShape.lineTo( width * 0.35, height * 0.675 );
    bodyShape.lineTo( 0, height * 0.5 ); // left wing tip
    bodyShape.close();

    // underneath part
    bodyShape.moveTo( width * 0.45, height * 0.8 );
    bodyShape.lineTo( width * 0.45, height );
    bodyShape.lineTo( width * 0.6, height * 0.875 );
    bodyShape.close();

    Path.call( this, bodyShape, options );
  }

  sceneryPhet.register( 'PaperAirplaneNode', PaperAirplaneNode );

  return inherit( Path, PaperAirplaneNode );
} );