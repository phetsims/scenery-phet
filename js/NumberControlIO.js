// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for NumberControl
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import sceneryPhet from './sceneryPhet.js';

const NumberControlIO = new IOType( 'NumberControlIO', {
  isValidValue: v => v instanceof phet.sceneryPhet.NumberControl,
  documentation: 'A number control with a title, slider and +/- buttons',
  supertype: NodeIO
} );

sceneryPhet.register( 'NumberControlIO', NumberControlIO );
export default NumberControlIO;