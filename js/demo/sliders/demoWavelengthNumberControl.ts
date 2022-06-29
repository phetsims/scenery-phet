// Copyright 2022, University of Colorado Boulder

/**
 * Demo for WavelengthNumberControl
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import WavelengthNumberControl from '../../WavelengthNumberControl.js';

export default function demoWavelengthNumberControl( layoutBounds: Bounds2 ) {
  const wavelengthProperty = new Property( 500 );
  return new WavelengthNumberControl( wavelengthProperty, {
    center: layoutBounds.center
  } );
}