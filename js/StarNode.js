//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param options
   * @constructor
   */
  function StarNode( options ) {

    options = _.extend( {

      //The amount the star is filled.  0=empty, 1=full
      value: 1,

      //Distance from the center to the tip of a star limb
      outerRadius: 20,

      //Distance from the center to the closest point on the exterior of the star.  Sets the "thickness" of the star limbs
      innerRadius: 10,

      fill: '#fcff03', // a bold yellow indeed,
      stroke: 'black',
      lineWidth: 3
    }, options );

    var shape = new Shape().moveTo( 0, 0 );
    var moved = false;
    for ( var i = 0; i < 10; i++ ) {

      //Start at the top
      var angle = i / 10 * Math.PI * 2 - Math.PI / 2;
      var radius = i % 2 === 0 ? options.outerRadius : options.innerRadius;
      var x = radius * Math.cos( angle );
      var y = radius * Math.sin( angle );
      if ( !moved ) {
        shape.moveTo( x, y );
        moved = true;
      }
      else {
        shape.lineTo( x, y );
      }
    }
    shape.close();
    Path.call( this, shape, options );
  }

  return inherit( Path, StarNode );
} );