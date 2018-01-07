// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for FaucetNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {FaucetNode} faucetNode
   * @param {string} phetioID
   * @constructor
   */
  function FaucetNodeIO( faucetNode, phetioID ) {
    assert && assertInstanceOf( faucetNode, phet.sceneryPhet.FaucetNode );
    NodeIO.call( this, faucetNode, phetioID );
  }

  phetioInherit( NodeIO, 'FaucetNodeIO', FaucetNodeIO, {}, {
    documentation: 'Faucet that emits fluid, typically user-controllable',
    events: [ 'startTapToDispense', 'endTapToDispense' ]
  } );

  sceneryPhet.register( 'FaucetNodeIO', FaucetNodeIO );

  return FaucetNodeIO;
} );

