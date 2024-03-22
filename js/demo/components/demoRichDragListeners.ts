// Copyright 2024, University of Colorado Boulder

/**
 * Demo for RichDragListener and RichKeyboardDragListener
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { Circle, Node, Rectangle } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RichDragListener from '../../RichDragListener.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import RichKeyboardDragListener from '../../RichKeyboardDragListener.js';

export default function demoRichDragListeners( layoutBounds: Bounds2 ): Node {
  const RADIUS = 50;

  const richDragListenerCircle = new Circle( RADIUS, {
    fill: 'red',
    cursor: 'pointer'
  } );
  const dragBoundsProperty = new TinyProperty( layoutBounds.shifted( layoutBounds.center.times( -1 ) ).eroded( RADIUS ) );

  richDragListenerCircle.addInputListener( new RichDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    translateNode: true,
    targetNode: richDragListenerCircle
  } ) );

  const richKeyboardDragListenerRectangle = new Rectangle( 0, RADIUS * 2, RADIUS * 2, RADIUS, {
    fill: 'blue',
    tagName: 'div',
    focusable: true
  } );
  richKeyboardDragListenerRectangle.addInputListener( new RichKeyboardDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    drag: delta => {
      richKeyboardDragListenerRectangle.translate( delta );
    }
  } ) );

  return new Node( {
    children: [
      richDragListenerCircle,
      richKeyboardDragListenerRectangle
    ],
    center: layoutBounds.center
  } );
}