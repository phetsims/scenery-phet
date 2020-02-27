// Copyright 2019, University of Colorado Boulder

/**
 * IO type for RoundMomentaryButton
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../../scenery/js/nodes/NodeIO.js';
import ObjectIO from '../../../tandem/js/types/ObjectIO.js';
import sceneryPhet from '../sceneryPhet.js';

class ResetAllButtonIO extends NodeIO {}

ResetAllButtonIO.documentation = 'Button that performs an action while it is being pressed, and stops the action when released';
ResetAllButtonIO.events = [ 'pressed', 'released', 'releasedDisabled' ];
ResetAllButtonIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.ResetAllButton };
ResetAllButtonIO.typeName = 'ResetAllButtonIO';
ObjectIO.validateSubtype( ResetAllButtonIO );

sceneryPhet.register( 'ResetAllButtonIO', ResetAllButtonIO );
export default ResetAllButtonIO;