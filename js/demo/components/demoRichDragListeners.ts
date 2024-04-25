// Copyright 2024, University of Colorado Boulder

/**
 * Demo for RichDragListener and RichKeyboardDragListener
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import { Circle, Node, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RichDragListener from '../../RichDragListener.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import RichKeyboardDragListener from '../../RichKeyboardDragListener.js';
import PhetFont from '../../PhetFont.js';

export default function demoRichDragListeners( layoutBounds: Bounds2 ): Node {
  const RADIUS = 75;

  const richDragListenerCircle = new Circle( RADIUS, {
    fill: 'red',
    cursor: 'pointer',
    centerX: -RADIUS * 2
  } );
  const innerCircleMessage = new RichText( 'Mouse-drag me!', {
    font: new PhetFont( 15 ),
    fill: 'white',
    centerX: 0,
    centerY: 0
  } );
  richDragListenerCircle.addChild( innerCircleMessage );
  const dragBoundsProperty = new TinyProperty( layoutBounds.shifted( layoutBounds.center.times( -1 ) ).eroded( RADIUS ) );

  richDragListenerCircle.addInputListener( new RichDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    translateNode: true,
    targetNode: richDragListenerCircle
  } ) );

  const richKeyboardDragListenerRectangle = new Rectangle( RADIUS * 2, -RADIUS / 2, RADIUS * 3, RADIUS, {
    fill: 'blue',
    tagName: 'div',
    focusable: true
  } );
  const innerRectangleMessage = new RichText( 'Tab and keyboard-drag me!', {
    font: new PhetFont( 15 ),
    fill: 'white',
    centerX: richKeyboardDragListenerRectangle.centerX,
    centerY: richKeyboardDragListenerRectangle.centerY
  } );
  richKeyboardDragListenerRectangle.addChild( innerRectangleMessage );

  richKeyboardDragListenerRectangle.addInputListener( new RichKeyboardDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    drag: ( event, listener ) => {
      richKeyboardDragListenerRectangle.translate( listener.vectorDelta );
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