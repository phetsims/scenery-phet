// Copyright 2022, University of Colorado Boulder

/**
 * Demo for MeasuringTapeNode
 */

import Property from '../../../../axon/js/Property.js';
import MeasuringTapeNode from '../../MeasuringTapeNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default function demoMeasuringTapeNode( layoutBounds: Bounds2 ): Node {

  const measuringTapeUnitsProperty = new Property( { name: 'meters', multiplier: 1 } );

  return new MeasuringTapeNode( measuringTapeUnitsProperty, {
    textColor: 'black',
    textBackgroundColor: 'rgba( 255, 0, 0, 0.1 )', // translucent red
    textBackgroundXMargin: 10,
    textBackgroundYMargin: 3,
    textBackgroundCornerRadius: 5,
    dragBounds: layoutBounds,
    basePositionProperty: new Vector2Property( new Vector2( layoutBounds.centerX, layoutBounds.centerY ) ),
    tipPositionProperty: new Vector2Property( new Vector2( layoutBounds.centerX + 100, layoutBounds.centerY ) )
  } );
}