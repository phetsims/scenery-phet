// Copyright 2024, University of Colorado Boulder
/**
 * Demo for RichPointerDragListener and RichKeyboardDragListener
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Circle, Node, Path, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RichPointerDragListener from '../../RichPointerDragListener.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import RichKeyboardDragListener from '../../RichKeyboardDragListener.js';
import PhetFont from '../../PhetFont.js';
import { Shape } from '../../../../kite/js/imports.js';
import RichDragListener from '../../RichDragListener.js';

export default function demoRichDragListeners( layoutBounds: Bounds2 ): Node {
  const RADIUS = 75;

  const dragBoundsProperty = new TinyProperty( layoutBounds.eroded( RADIUS ) );

  // A visualization of the drag bounds
  const dragArea = new Rectangle( dragBoundsProperty.value, {
    fill: 'lightGray'
  } );

  //---------------------------------------------------------------------------------
  // RichPointerDragListener
  //---------------------------------------------------------------------------------
  const richPointerDragListenerCircle = new Circle( RADIUS, {
    fill: 'red',
    cursor: 'pointer'
  } );
  const innerCircleMessage = new RichText( 'Mouse-drag me!', {
    font: new PhetFont( 15 ),
    fill: 'white',
    center: richPointerDragListenerCircle.center
  } );
  richPointerDragListenerCircle.addChild( innerCircleMessage );
  richPointerDragListenerCircle.addInputListener( new RichPointerDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    drag: ( event, listener ) => {
      richPointerDragListenerCircle.translate( listener.modelDelta );
    }
  } ) );

  //---------------------------------------------------------------------------------
  // RichKeyboardDragListener
  //---------------------------------------------------------------------------------
  const richKeyboardDragListenerRectangle = new Rectangle( -RADIUS * 3 / 2, -RADIUS / 2, RADIUS * 3, RADIUS, {
    fill: 'blue',
    tagName: 'div',
    focusable: true
  } );
  const innerRectangleMessage = new RichText( 'Tab and keyboard-drag me!', {
    font: new PhetFont( 15 ),
    fill: 'white',
    center: richKeyboardDragListenerRectangle.center
  } );
  richKeyboardDragListenerRectangle.addChild( innerRectangleMessage );
  richKeyboardDragListenerRectangle.addInputListener( new RichKeyboardDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    translateNode: true,
    dragSpeed: RADIUS * 5,
    shiftDragSpeed: RADIUS
  } ) );

  //---------------------------------------------------------------------------------
  // RichDragListener
  //---------------------------------------------------------------------------------
  const richDragListenerEllipse = new Path( Shape.ellipse( 0, 0, RADIUS * 2, RADIUS, 0 ), {
    fill: 'green',

    // so that it is focusable and can receive keyboard input
    tagName: 'div',
    focusable: true
  } );
  const innerEllipseMessage = new RichText( 'Drag me with any input!', {
    font: new PhetFont( 15 ),
    fill: 'white',
    center: richDragListenerEllipse.center
  } );
  const richDragListenerStateText = new RichText( 'Ready to drag...', {
    font: new PhetFont( 24 )
  } );

  const updateStateText = ( newString: string ) => {
    richDragListenerStateText.string = newString;
    richDragListenerStateText.centerBottom = dragArea.centerBottom;
  };

  richDragListenerEllipse.addChild( innerEllipseMessage );
  richDragListenerEllipse.addInputListener( new RichDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    translateNode: true,
    richKeyboardDragListenerOptions: {
      dragSpeed: RADIUS * 5,
      shiftDragSpeed: RADIUS
    },
    start: ( event, listener ) => {
      if ( event.isFromPDOM() ) {
        updateStateText( 'Keyboard drag started' );
      }
      else {
        updateStateText( 'Mouse drag started' );
      }
    },
    end: ( event, listener ) => {
      if ( event && event.isFromPDOM() ) {
        updateStateText( 'Keyboard drag ended' );
      }
      else {
        updateStateText( 'Mouse drag ended' );
      }
    }
  } ) );

  const content = new Node( {
    children: [
      dragArea,
      richPointerDragListenerCircle,
      richKeyboardDragListenerRectangle,
      richDragListenerEllipse,
      richDragListenerStateText
    ]
  } );

  // initial positions
  dragArea.center = layoutBounds.center;
  richPointerDragListenerCircle.center = layoutBounds.center.plusXY( -RADIUS, -RADIUS );
  richKeyboardDragListenerRectangle.center = layoutBounds.center.plusXY( RADIUS, -RADIUS );
  richDragListenerEllipse.center = layoutBounds.center.plusXY( 0, RADIUS );
  updateStateText( 'Ready to drag...' );

  return content;
}