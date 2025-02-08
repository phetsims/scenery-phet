// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demos a NumberControl that uses SpectrumSliderTrack and SpectrumSliderThumb.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NumberControl from '../../NumberControl.js';
import PhetFont from '../../PhetFont.js';
import SpectrumSliderThumb from '../../SpectrumSliderThumb.js';
import SpectrumSliderTrack from '../../SpectrumSliderTrack.js';
import VisibleColor from '../../VisibleColor.js';

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