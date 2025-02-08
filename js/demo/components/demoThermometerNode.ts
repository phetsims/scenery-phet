// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for ThermometerNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import HSlider from '../../../../sun/js/HSlider.js';
import ThermometerNode from '../../ThermometerNode.js';

export default function demoThermometerNode( layoutBounds: Bounds2 ): Node {

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