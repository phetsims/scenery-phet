// Copyright 2014-2022, University of Colorado Boulder

/**
 * WavelengthSpectrumNode displays a rectangle of the visible spectrum.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode, { SpectrumNodeOptions } from './SpectrumNode.js';
import VisibleColor from './VisibleColor.js';

type SelfOptions = {
  minWavelength?: number;
  maxWavelength?: number;
};

export type WavelengthSpectrumNodeOptions = SelfOptions & StrictOmit<SpectrumNodeOptions, 'minValue' | 'maxValue'>;

export default class WavelengthSpectrumNode extends SpectrumNode {

  public constructor( providedOptions?: WavelengthSpectrumNodeOptions ) {

    const options = optionize<WavelengthSpectrumNodeOptions, SelfOptions, SpectrumNodeOptions>()( {
      valueToColor: ( value: number ) => VisibleColor.wavelengthToColor( value ),
      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    // validation
    assert && assert( options.minWavelength < options.maxWavelength );
    assert && assert( options.minWavelength >= VisibleColor.MIN_WAVELENGTH && options.minWavelength <= VisibleColor.MAX_WAVELENGTH );
    assert && assert( options.maxWavelength >= VisibleColor.MIN_WAVELENGTH && options.maxWavelength <= VisibleColor.MAX_WAVELENGTH );

    options.minValue = options.minWavelength;
    options.maxValue = options.maxWavelength;

    super( options );
  }
}

sceneryPhet.register( 'WavelengthSpectrumNode', WavelengthSpectrumNode );