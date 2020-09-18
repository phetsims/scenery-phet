// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for NumberDisplay
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import sceneryPhet from './sceneryPhet.js';

const NumberDisplayIO = new IOType( 'NumberDisplayIO', {
  isValidValue: v => v instanceof phet.sceneryPhet.NumberDisplay,
  supertype: NodeIO,
  documentation: 'A numeric readout with a background'
} );

sceneryPhet.register( 'NumberDisplayIO', NumberDisplayIO );
export default NumberDisplayIO;