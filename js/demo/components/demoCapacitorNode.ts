// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for CapacitorNode
 *
 * @author Sam Reid
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Bounds3 from '../../../../dot/js/Bounds3.js';
import Range from '../../../../dot/js/Range.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CapacitorConstants from '../../capacitor/CapacitorConstants.js';
import CapacitorNode from '../../capacitor/CapacitorNode.js';
import YawPitchModelViewTransform3 from '../../capacitor/YawPitchModelViewTransform3.js';
import NumberControl from '../../NumberControl.js';

export default function demoCapacitorNode( layoutBounds: Bounds2 ): Node {

  const plateBounds = new Bounds3( 0, 0, 0, 0.01414213562373095, CapacitorConstants.PLATE_HEIGHT, 0.01414213562373095 );

  // An object literal is fine in a demo like this, but we probably wouldn't do this in production code.
  const circuit = {
    maxPlateCharge: 2.6562e-12,
    capacitor: {
      plateSizeProperty: new Property( plateBounds ),
      plateSeparationProperty: new NumberProperty( 0.006 ),
      plateVoltageProperty: new NumberProperty( 1.5 ),
      plateChargeProperty: new NumberProperty( 4.426999999999999e-13 / 10 * 4 ),
      getEffectiveEField() {
        return 0;
      }
    }
  };
  const modelViewTransform = new YawPitchModelViewTransform3();
  const plateChargeVisibleProperty = new BooleanProperty( true );
  const electricFieldVisibleProperty = new BooleanProperty( true );

  const capacitorNode = new CapacitorNode( circuit, modelViewTransform, plateChargeVisibleProperty, electricFieldVisibleProperty, {
    tandem: Tandem.OPT_OUT
  } );

  const controls = new VBox( {
    children: [
      new NumberControl( 'separation', circuit.capacitor.plateSeparationProperty, new Range( 0, 0.01 ), {
        delta: 0.0001,
        numberDisplayOptions: {
          decimalPlaces: 5
        }
      } ),
      new NumberControl( 'charge', circuit.capacitor.plateChargeProperty, new Range( -( 4.426999999999999e-13 ) * 1.5, ( 4.426999999999999e-13 ) * 1.5 ), {
        delta: 4.426999999999999e-13 / 30,
        numberDisplayOptions: {
          decimalPlaces: 20
        }
      } )
    ]
  } );

  return new VBox( {
    spacing: 20,
    resize: false,
    children: [
      capacitorNode,
      controls
    ],
    center: layoutBounds.center
  } );
}