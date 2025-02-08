// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for WavelengthNumberControl
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import FineCoarseSpinner from '../../FineCoarseSpinner.js';
import PhetFont from '../../PhetFont.js';

export default function demoFineCoarseSpinner( layoutBounds: Bounds2, options?: SunDemoOptions ): Node {

  const numberProperty = new NumberProperty( 0, {
    range: new Range( 0, 100 ),
    tandem: options?.tandem?.createTandem( 'numberProperty' )
  } );

  const enabledProperty = new BooleanProperty( true, {
    tandem: options?.tandem?.createTandem( 'enabledProperty' )
  } );

  const spinner = new FineCoarseSpinner( numberProperty, {
    enabledProperty: enabledProperty,
    tandem: options?.tandem?.createTandem( 'spinner' )
  } );

  const checkbox = new Checkbox( enabledProperty, new Text( 'enabled', {
    font: new PhetFont( 20 ),
    tandem: options?.tandem?.createTandem( 'checkbox' )
  } ) );

  return new VBox( {
    spacing: 60,
    children: [ spinner, checkbox ],
    center: layoutBounds.center
  } );
}