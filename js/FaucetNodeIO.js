// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for FaucetNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import sceneryPhet from './sceneryPhet.js';

class FaucetNodeIO extends NodeIO {}

FaucetNodeIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.FaucetNode };
FaucetNodeIO.documentation = 'Faucet that emits fluid, typically user-controllable';
FaucetNodeIO.events = [ 'startTapToDispense', 'endTapToDispense' ];
FaucetNodeIO.typeName = 'FaucetNodeIO';
ObjectIO.validateSubtype( FaucetNodeIO );

sceneryPhet.register( 'FaucetNodeIO', FaucetNodeIO );
export default FaucetNodeIO;