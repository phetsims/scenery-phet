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
  var toEventOnEmit = require( 'ifphetio!PHET_IO/toEventOnEmit' );

  /**
   * Wrapper type for phet/sun's Faucet class.
   * @param faucet
   * @param phetioID
   * @constructor
   */
  function TFaucetNode( faucet, phetioID ) {
    assertInstanceOf( faucet, phet.sceneryPhet.FaucetNode );
    TNode.call( this, faucet, phetioID );

    // These must be model events because they are triggered by a user event 'dragEnded'
    toEventOnEmit(
      faucet.startedCallbacksForStartTapToDispenseEmitter,
      faucet.endedCallbacksForStartTapToDispenseEmitter,
      'model',
      phetioID,
      this.constructor,
      'startTapToDispense',
      function( flowRate ) {
        return { flowRate: flowRate };
      } );

    toEventOnEmit(
      faucet.startedCallbacksForEndTapToDispenseEmitter,
      faucet.endedCallbacksForEndTapToDispenseEmitter,
      'model',
      phetioID,
      this.constructor,
      'endTapToDispense',
      function( flowRate ) {
        return { flowRate: flowRate };
      } );
  }

  phetioInherit( TNode, 'TFaucetNode', TFaucetNode, {}, {
    documentation: 'Faucet that emits fluid, typically user-controllable',
    events: [ 'startTapToDispense', 'endTapToDispense' ]
  } );

  sceneryPhet.register( 'TFaucetNode', TFaucetNode );

  return TFaucetNode;
} );

