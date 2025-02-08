// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for EyeDropperNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import EyeDropperNode from '../../EyeDropperNode.js';
import PhetFont from '../../PhetFont.js';

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