// Copyright 2022, University of Colorado Boulder

/**
 * Demo for ThermometerNode
 */

import ThermometerNode from '../../ThermometerNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

export default function demoTemperatureNode( layoutBounds: Bounds2 ): Node {

  const temperatureProperty = new Property( 50 );

  const thermometer = new ThermometerNode( temperatureProperty, 0, 100, {
    scale: 1.5
  } );

  const temperatureSlider = new HSlider( temperatureProperty, new Range( 0, 100 ), {
    trackSize: new Dimension2( 200, 5 ),
    thumbSize: new Dimension2( 25, 50 ),
    thumbFillHighlighted: 'red',
    thumbFill: 'rgb(158,35,32)'
  } );
  temperatureSlider.rotation = -Math.PI / 2;
  temperatureSlider.right = thermometer.left - 50;
  temperatureSlider.centerY = thermometer.centerY;

  return new Node( {
    children: [ thermometer, temperatureSlider ],
    center: layoutBounds.center
  } );
}