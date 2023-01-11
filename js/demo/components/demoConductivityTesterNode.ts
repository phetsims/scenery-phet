// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for ConductivityTesterNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { DragListener, Node, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import HSlider from '../../../../sun/js/HSlider.js';
import ConductivityTesterNode from '../../ConductivityTesterNode.js';
import PhetFont from '../../PhetFont.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default function demoConductivityTesterNode( layoutBounds: Bounds2 ): Node {

  const brightnessProperty = new NumberProperty( 0, { range: new Range( 0, 1 ) } );
  const testerPositionProperty = new Vector2Property( new Vector2( 0, 0 ) );
  const positiveProbePositionProperty = new Vector2Property( new Vector2( testerPositionProperty.get().x + 140, testerPositionProperty.get().y + 100 ) );
  const negativeProbePositionProperty = new Vector2Property( new Vector2( testerPositionProperty.get().x - 40, testerPositionProperty.get().y + 100 ) );

  const conductivityTesterNode = new ConductivityTesterNode( brightnessProperty,
    testerPositionProperty, positiveProbePositionProperty, negativeProbePositionProperty, {
      positiveProbeFill: 'orange',
      cursor: 'pointer',
      tandem: Tandem.OPT_OUT
    }
  );

  conductivityTesterNode.addInputListener( new DragListener( {
    positionProperty: testerPositionProperty
  } ) );

  // brightness slider
  const brightnessSlider = new HSlider( brightnessProperty, new Range( 0, 1 ), {
    trackSize: new Dimension2( 200, 5 ),
    thumbSize: new Dimension2( 25, 45 ),
    thumbFill: 'orange',
    thumbFillHighlighted: 'rgb( 255, 210, 0 )',
    thumbCenterLineStroke: 'black',
    centerX: conductivityTesterNode.centerX,
    bottom: conductivityTesterNode.bottom + 100
  } );

  const shortCircuitProperty = new Property( false );
  shortCircuitProperty.link( shortCircuit => {
    conductivityTesterNode.shortCircuit = shortCircuit;
  } );

  const shortCircuitCheckbox = new Checkbox( shortCircuitProperty, new Text( 'short circuit', { font: new PhetFont( 20 ) } ), {
    centerX: brightnessSlider.centerX,
    bottom: brightnessSlider.bottom + 50
  } );

  return new Node( {
    children: [ conductivityTesterNode, brightnessSlider, shortCircuitCheckbox ],
    center: layoutBounds.center
  } );
}