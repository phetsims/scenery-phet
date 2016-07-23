// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );
  var toEventOnStatic = require( 'PHET_IO/events/toEventOnStatic' );
  var TTandemDragHandler = require( 'PHET_IO/types/tandem/scenery/input/TTandemDragHandler' );

  var TFaucet = phetioInherit( TNode, 'TFaucet', function( faucet, phetioID ) {
    TNode.call( this, faucet, phetioID );
    assertInstanceOf( faucet, phet.sceneryPhet.FaucetNode );

    // These must be model events because they are triggered by a user event 'dragEnded'
    toEventOnStatic( faucet, 'CallbacksForStartTapToDispense', 'model', phetioID, TFaucet, 'startTapToDispense', function( flowRate ) {
      return { flowRate: flowRate };
    } );
    toEventOnStatic( faucet, 'CallbacksForEndTapToDispense', 'model', phetioID, TFaucet, 'endTapToDispense', function( flowRate ) {
      return { flowRate: flowRate };
    } );
  }, {}, {
    documentation: 'Faucet that emits fluid, typically user-controllable',
    events: [ 'startTapToDispense', 'endTapToDispense' ],
    api: {
      inputListener: TTandemDragHandler
    }
  } );

  phetioNamespace.register( 'TFaucet', TFaucet );

  return TFaucet;
} );

