// Copyright 2022, University of Colorado Boulder

/**
 * Demo for WavelengthNumberControl
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FineCoarseSpinner from '../../FineCoarseSpinner.js';
import PhetFont from '../../PhetFont.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';

export default function demoFineCoarseSpinner( layoutBounds: Bounds2, providedOptions?: SunDemoOptions ): Node {

  const options = optionize<NodeOptions, EmptySelfOptions, NodeOptions>()( {
    tandem: Tandem.OPTIONAL
  }, providedOptions );

  const numberProperty = new NumberProperty( 0, {
    range: new Range( 0, 100 ),
    tandem: options.tandem.createTandem( 'numberProperty' )
  } );

  const enabledProperty = new BooleanProperty( true, {
    tandem: options.tandem.createTandem( 'enabledProperty' )
  } );

  const spinner = new FineCoarseSpinner( numberProperty, {
    enabledProperty: enabledProperty,
    tandem: options.tandem.createTandem( 'spinner' )
  } );

  const checkbox = new Checkbox( enabledProperty, new Text( 'enabled', {
    font: new PhetFont( 20 ),
    tandem: options.tandem.createTandem( 'checkbox' )
  } ) );

  return new VBox( {
    spacing: 60,
    children: [ spinner, checkbox ],
    center: layoutBounds.center
  } );
}