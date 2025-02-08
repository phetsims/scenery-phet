// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for WavelengthNumberControl
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import WavelengthNumberControl from '../../WavelengthNumberControl.js';

export default function demoWavelengthNumberControl( layoutBounds: Bounds2 ): Node {
  const wavelengthProperty = new Property( 500 );
  return new WavelengthNumberControl( wavelengthProperty, {
    center: layoutBounds.center
  } );
}