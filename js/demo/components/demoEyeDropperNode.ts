// Copyright 2022, University of Colorado Boulder

/**
 * Demo for EyeDropperNode
 */

import EyeDropperNode from '../../EyeDropperNode.js';
import PhetFont from '../../PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Checkbox from '../../../../sun/js/Checkbox.js';

export default function demoEyeDropperNode( layoutBounds: Bounds2 ): Node {

  const buttonEnabledProperty = new BooleanProperty( true );

  const dropperNode = new EyeDropperNode( {
    buttonOptions: {
      enabledProperty: buttonEnabledProperty
    },
    fluidColor: 'purple',
    center: layoutBounds.center
  } );

  const buttonEnabledCheckbox = new Checkbox( buttonEnabledProperty, new Text( 'button enabled', { font: new PhetFont( 20 ) } ) );

  dropperNode.isDispensingProperty.lazyLink(
    dispensing => console.log( `dropper ${dispensing ? 'dispensing' : 'not dispensing'}` )
  );

  return new VBox( {
    spacing: 15,
    children: [ dropperNode, buttonEnabledCheckbox ],
    center: layoutBounds.center
  } );
}