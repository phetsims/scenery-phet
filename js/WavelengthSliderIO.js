// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for WavelengthSlider
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NodeIO from '../../scenery/js/nodes/NodeIO.js';
import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import sceneryPhet from './sceneryPhet.js';
import WavelengthSlider from './WavelengthSlider.js';

class WavelengthSliderIO extends NodeIO {}

WavelengthSliderIO.documentation = 'A slider that shows wavelengths for selection';
WavelengthSliderIO.validator = { valueType: WavelengthSlider };
WavelengthSliderIO.typeName = 'WavelengthSliderIO';
ObjectIO.validateSubtype( WavelengthSliderIO );

sceneryPhet.register( 'WavelengthSliderIO', WavelengthSliderIO );
export default WavelengthSliderIO;