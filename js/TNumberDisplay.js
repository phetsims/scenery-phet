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
   * Wrapper type for phet/scenery-phet's NumberDisplay class.
   * @param numberControl
   * @param phetioID
   * @constructor
   */
  function TNumberDisplay( numberControl, phetioID ) {
    TNode.call( this, numberControl, phetioID );
    assertInstanceOf( numberControl, phet.sceneryPhet.NumberDisplay );
  }

  phetioInherit( TNode, 'TNumberControl', TNumberDisplay, {}, {
    documentation: 'A numeric readout with a background'
  } );

  sceneryPhet.register( 'TNumberDisplay', TNumberDisplay );

  return TNumberDisplay;
} );