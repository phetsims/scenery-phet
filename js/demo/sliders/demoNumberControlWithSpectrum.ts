// Copyright 2022, University of Colorado Boulder

/**
 * Demos a NumberControl that uses SpectrumSliderTrack and SpectrumSliderThumb.
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import VisibleColor from '../../VisibleColor.js';
import NumberControl from '../../NumberControl.js';
import PhetFont from '../../PhetFont.js';
import SpectrumSliderTrack from '../../SpectrumSliderTrack.js';
import SpectrumSliderThumb from '../../SpectrumSliderThumb.js';
import { Node } from '../../../../scenery/js/imports.js';

export default function demoNumberControlWithSpectrum( layoutBounds: Bounds2 ): Node {
  const property = new Property( 380 );
  const wavelengthToColor = VisibleColor.wavelengthToColor;

  // NumberControl with default layout
  const range = new Range( 380, 780 );
  return new NumberControl( '', property, range, {
    titleNodeOptions: {
      font: new PhetFont( 14 )
    },
    numberDisplayOptions: {
      textOptions: {
        font: new PhetFont( 14 )
      },
      valuePattern: '{0} nm'
    },
    sliderOptions: {
      trackNode: new SpectrumSliderTrack( property, range, { valueToColor: wavelengthToColor } ),
      thumbNode: new SpectrumSliderThumb( property, { valueToColor: wavelengthToColor } )
    },
    center: layoutBounds.center,
    layoutFunction: NumberControl.createLayoutFunction3( {
      alignTitle: 'left'
    } )
  } );
}
