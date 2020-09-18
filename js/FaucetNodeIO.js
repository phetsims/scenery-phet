// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for FaucetNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import sceneryPhet from './sceneryPhet.js';

const FaucetNodeIO = new IOType( 'FaucetNodeIO', {
  isValidValue: v => v instanceof phet.sceneryPhet.FaucetNode,
  documentation: 'Faucet that emits fluid, typically user-controllable',
  supertype: NodeIO,
  events: [ 'startTapToDispense', 'endTapToDispense' ]
} );

sceneryPhet.register( 'FaucetNodeIO', FaucetNodeIO );
export default FaucetNodeIO;