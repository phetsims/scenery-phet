// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var TNode = require( 'SCENERY/nodes/TNode' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * Wrapper type for phet/scenery-phet's NumberControl class.
   * @param numberControl
   * @param phetioID
   * @constructor
   */
  function TNumberControl( numberControl, phetioID ) {
    TNode.call( this, numberControl, phetioID );
    assertInstanceOf( numberControl, phet.sceneryPhet.NumberControl );
  }

  phetioInherit( TNode, 'TNumberControl', TNumberControl, {}, {
    documentation: 'A number control with a title, slider and +/- buttons'
  } );

  sceneryPhet.register( 'TNumberControl', TNumberControl );

  return TNumberControl;
} );