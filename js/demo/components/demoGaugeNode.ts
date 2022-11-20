// Copyright 2022, University of Colorado Boulder

/**
 * Demo for GaugeNode
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
import GaugeNode from '../../GaugeNode.js';
import NumberControl from '../../NumberControl.js';

export default function demoGaugeNode( layoutBounds: Bounds2 ): Node {

  const valueProperty = new Property( 0 );
  const gaugeValueRange = new Range( -100, 100 );
  const sliderValueRange = new Range( gaugeValueRange.min - 20, gaugeValueRange.max + 20 );

  const gaugeNode = new GaugeNode( valueProperty, new Property( 'GaugeNode' ), gaugeValueRange );

  return new VBox( {
    spacing: 15,
    children: [
      gaugeNode,
      NumberControl.withMinMaxTicks( 'Value:', valueProperty, sliderValueRange )
    ],
    center: layoutBounds.center
  } );
}