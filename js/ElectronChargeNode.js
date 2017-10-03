// Copyright 2017, University of Colorado Boulder

/**
 * Renders a shaded 2d electron with a "-" sign in the middle.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // constants
  var RADIUS = 10;

  /**
   * @constructor
   */
  function ElectronChargeNode( options ) {

    // No options supported yet
    options = _.extend( {

      // Workaround for https://github.com/phetsims/circuit-construction-kit-dc/issues/160
      sphereOpacity: 1,
      minusSignOpacity: 1

    }, options );
    options.children = [

      // The blue shaded sphere
      new Circle( RADIUS, {
        opacity: options.sphereOpacity,
        fill: new RadialGradient(
          2, -3, 2,
          2, -3, 7 )
          .addColorStop( 0, '#4fcfff' )
          .addColorStop( 0.5, '#2cbef5' )
          .addColorStop( 1, '#00a9e8' )
      } ),

      // Minus sign, intentionally not internationalized
      new Rectangle( 0, 0, 11, 2, {
        opacity: options.minusSignOpacity,
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