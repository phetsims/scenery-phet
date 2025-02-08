// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for SliderControlsKeyboardHelpSection
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import SliderControlsKeyboardHelpSection from '../../keyboard/help/SliderControlsKeyboardHelpSection.js';

export default function demoSliderControlsKeyboardHelpSection( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new HBox( {
    children: [
      new SliderControlsKeyboardHelpSection(),
      new SliderControlsKeyboardHelpSection( {
        verbStringProperty: new TinyProperty( 'Move custom' ),
        headingStringProperty: new TinyProperty( 'Custom Title About This Slidable' ),
        sliderStringProperty: new TinyProperty( 'stuff and things' )
      } )
    ],
    spacing: 10,
    center: layoutBounds.center
  } );
}