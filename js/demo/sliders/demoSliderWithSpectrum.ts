// Copyright 2022, University of Colorado Boulder

/**
 * Demos an HSlider that uses a SpectrumSliderTrack and SpectrumSliderThumb.
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import HSlider from '../../../../sun/js/HSlider.js';
import VisibleColor from '../../VisibleColor.js';
import SpectrumSliderTrack from '../../SpectrumSliderTrack.js';
import SpectrumSliderThumb from '../../SpectrumSliderThumb.js';
import { Node } from '../../../../scenery/js/imports.js';

export default function demoSliderWithSpectrum( layoutBounds: Bounds2 ): Node {
  const property = new Property( 380 );
  const wavelengthToColor = VisibleColor.wavelengthToColor;
  const range = new Range( 380, 780 );
  return new HSlider( property, range, {
    center: layoutBounds.center,
    trackNode: new SpectrumSliderTrack( property, range, { valueToColor: wavelengthToColor } ),
    thumbNode: new SpectrumSliderThumb( property, { valueToColor: wavelengthToColor } )
  } );
}
