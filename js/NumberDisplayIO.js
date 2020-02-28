// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for NumberDisplay
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import sceneryPhet from './sceneryPhet.js';

class NumberDisplayIO extends NodeIO {}

NumberDisplayIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.NumberDisplay };
NumberDisplayIO.documentation = 'A numeric readout with a background';
NumberDisplayIO.typeName = 'NumberDisplayIO';
ObjectIO.validateSubtype( NumberDisplayIO );

sceneryPhet.register( 'NumberDisplayIO', NumberDisplayIO );
export default NumberDisplayIO;