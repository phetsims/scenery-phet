// Copyright 2022, University of Colorado Boulder

/**
 * Demo for BasicActionsKeyboardHelpSection
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node } from '../../../../scenery/js/imports.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import BasicActionsKeyboardHelpSection from '../../keyboard/help/BasicActionsKeyboardHelpSection.js';

export default function demoBasicActionsKeyboardHelpSection( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {
  return new BasicActionsKeyboardHelpSection( {
    center: layoutBounds.center
  } );
}