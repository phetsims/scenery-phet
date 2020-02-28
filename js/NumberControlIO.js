// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for NumberControl
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import sceneryPhet from './sceneryPhet.js';

class NumberControlIO extends NodeIO {}

NumberControlIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.NumberControl };
NumberControlIO.documentation = 'A number control with a title, slider and +/- buttons';
NumberControlIO.typeName = 'NumberControlIO';
ObjectIO.validateSubtype( NumberControlIO );

sceneryPhet.register( 'NumberControlIO', NumberControlIO );
export default NumberControlIO;