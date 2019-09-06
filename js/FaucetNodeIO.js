// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for FaucetNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class FaucetNodeIO extends NodeIO {}

  FaucetNodeIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.FaucetNode };
  FaucetNodeIO.documentation = 'Faucet that emits fluid, typically user-controllable';
  FaucetNodeIO.events = [ 'startTapToDispense', 'endTapToDispense' ];
  FaucetNodeIO.typeName = 'FaucetNodeIO';
  ObjectIO.validateSubtype( FaucetNodeIO );

  return sceneryPhet.register( 'FaucetNodeIO', FaucetNodeIO );
} );

