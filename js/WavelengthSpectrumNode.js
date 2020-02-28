// Copyright 2014-2020, University of Colorado Boulder

/**
 * WavelengthSpectrumNode displays a rectangle of the visible spectrum.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode from './SpectrumNode.js';
import VisibleColor from './VisibleColor.js';

/**
 * Slider track that displays the visible spectrum of light.
 *
 * @param {Object} [options]
 * @constructor
 */
class WavelengthSpectrumNode extends SpectrumNode {

  constructor( options ) {

    options = merge( {
      valueToColor: value => VisibleColor.wavelengthToColor( value ),
      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,
      tandem: Tandem.OPTIONAL
    }, options );

    // validation
    assert && assert( options.minWavelength < options.maxWavelength );
    assert && assert( options.minWavelength >= VisibleColor.MIN_WAVELENGTH && options.minWavelength <= VisibleColor.MAX_WAVELENGTH );
    assert && assert( options.maxWavelength >= VisibleColor.MIN_WAVELENGTH && options.maxWavelength <= VisibleColor.MAX_WAVELENGTH );
    assert && assert( typeof options.minValue === 'undefined', 'minValue is supplied by WavelengthSlider' );
    assert && assert( typeof options.maxValue === 'undefined', 'maxValue is supplied by WavelengthSlider' );

    options.minValue = options.minWavelength;
    options.maxValue = options.maxWavelength;

    super( options );
  }
}

sceneryPhet.register( 'WavelengthSpectrumNode', WavelengthSpectrumNode );
export default WavelengthSpectrumNode;