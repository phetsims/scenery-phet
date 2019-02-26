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
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {FaucetNode} faucetNode
   * @param {string} phetioID
   * @constructor
   */
  function FaucetNodeIO( faucetNode, phetioID ) {
    NodeIO.call( this, faucetNode, phetioID );
  }

  phetioInherit( NodeIO, 'FaucetNodeIO', FaucetNodeIO, {}, {
    validator: { isValidValue: v => v instanceof phet.sceneryPhet.FaucetNode },
    documentation: 'Faucet that emits fluid, typically user-controllable',
    events: [ 'startTapToDispense', 'endTapToDispense' ]
  } );

  sceneryPhet.register( 'FaucetNodeIO', FaucetNodeIO );

  return FaucetNodeIO;
} );

