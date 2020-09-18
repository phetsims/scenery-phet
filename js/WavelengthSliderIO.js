// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for WavelengthSlider
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import sceneryPhet from './sceneryPhet.js';
import WavelengthSlider from './WavelengthSlider.js';

const WavelengthSliderIO = new IOType( 'WavelengthSliderIO', {
  valueType: WavelengthSlider,
  supertype: NodeIO,
  documentation: 'A slider that shows wavelengths for selection'
} );

sceneryPhet.register( 'WavelengthSliderIO', WavelengthSliderIO );
export default WavelengthSliderIO;