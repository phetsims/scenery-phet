// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );
  var toEventOnEmit = require( 'PHET_IO/events/toEventOnEmit' );

  /**
   * Wrapper type for phet/sun's Faucet class.
   * @param faucet
   * @param phetioID
   * @constructor
   */
  function TFaucet( faucet, phetioID ) {
    TNode.call( this, faucet, phetioID );
    assertInstanceOf( faucet, phet.sceneryPhet.FaucetNode );

    // These must be model events because they are triggered by a user event 'dragEnded'
    toEventOnEmit(
      faucet.startedCallbacksForStartTapToDispenseEmitter,
      faucet.endedCallbacksForStartTapToDispenseEmitter,
      'model',
      phetioID,
      TFaucet,
      'startTapToDispense',
      function( flowRate ) {
        return { flowRate: flowRate };
      } );

    toEventOnEmit(
      faucet.startedCallbacksForEndTapToDispenseEmitter,
      faucet.endedCallbacksForEndTapToDispenseEmitter,
      'model',
      phetioID,
      TFaucet,
      'endTapToDispense',
      function( flowRate ) {
        return { flowRate: flowRate };
      } );
  }

  phetioInherit( TNode, 'TFaucet', TFaucet, {}, {
    documentation: 'Faucet that emits fluid, typically user-controllable',
    events: [ 'startTapToDispense', 'endTapToDispense' ]
  } );

  phetioNamespace.register( 'TFaucet', TFaucet );

  return TFaucet;
} );

