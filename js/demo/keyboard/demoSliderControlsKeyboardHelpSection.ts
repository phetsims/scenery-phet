// Copyright 2022, University of Colorado Boulder

/**
 * Demo for SliderControlsKeyboardHelpSection
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import SliderControlsKeyboardHelpSection from '../../keyboard/help/SliderControlsKeyboardHelpSection.js';
import { Node } from '../../../../scenery/js/imports.js';

export default function demoSliderControlsKeyboardHelpSection( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new SliderControlsKeyboardHelpSection( {
    center: layoutBounds.center
  } );
}