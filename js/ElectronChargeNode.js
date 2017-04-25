// Copyright 2017, University of Colorado Boulder

/**
 * Renders a shaded 2d electron with a "-" sign in the middle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var RADIUS = 10;

  /**
   * @constructor
   */
  function ElectronChargeNode( options ) {

    // No options supported yet
    options = _.extend( {}, options );
    options.children = [

      // The blue shaded sphere
      new Circle( RADIUS, {
        fill: new RadialGradient(
          2, -3, 2,
          2, -3, 7 )
          .addColorStop( 0, '#4fcfff' )
          .addColorStop( 0.5, '#2cbef5' )
          .addColorStop( 1, '#00a9e8' )
      } ),

      // Minus sign, intentionally not internationalized
      new Rectangle( 0, 0, 11, 2, {
        fill: 'white',
        centerX: 0,
        centerY: 0
      } )
    ];
    Node.call( this, options );
  }

  sceneryPhet.register( 'ElectronChargeNode', ElectronChargeNode );

  return inherit( Node, ElectronChargeNode );
} );