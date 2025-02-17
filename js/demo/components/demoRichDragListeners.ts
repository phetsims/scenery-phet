// Copyright 2024-2025, University of Colorado Boulder

/**
 * Demo for SoundDragListener and SoundKeyboardDragListener
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import PhetFont from '../../PhetFont.js';
import SoundDragListener from '../../SoundDragListener.js';
import SoundKeyboardDragListener from '../../SoundKeyboardDragListener.js';
import SoundRichDragListener from '../../SoundRichDragListener.js';

export default function demoRichDragListeners( layoutBounds: Bounds2 ): Node {
  const RADIUS = 75;

  const dragBoundsProperty = new TinyProperty( layoutBounds.eroded( RADIUS ) );

  // A visualization of the drag bounds
  const dragArea = new Rectangle( dragBoundsProperty.value, {
    fill: 'lightGray'
  } );

  //---------------------------------------------------------------------------------
  // SoundDragListener
  //---------------------------------------------------------------------------------
  const soundDragistenerCircle = new Circle( RADIUS, {
    fill: 'red',
    cursor: 'pointer'
  } );
  const innerCircleMessage = new RichText( 'Mouse-drag me!', {
    font: new PhetFont( 15 ),
    fill: 'white',
    center: soundDragistenerCircle.center
  } );
  soundDragistenerCircle.addChild( innerCircleMessage );
  soundDragistenerCircle.addInputListener( new SoundDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    drag: ( event, listener ) => {
      soundDragistenerCircle.translate( listener.modelDelta );
    }
  } ) );

  //---------------------------------------------------------------------------------
  // SoundKeyboardDragListener
  //---------------------------------------------------------------------------------
  const soundKeyboardDragListenerRectangle = new Rectangle( -RADIUS * 3 / 2, -RADIUS / 2, RADIUS * 3, RADIUS, {
    fill: 'blue',
    tagName: 'div',
    focusable: true
  } );
  const innerRectangleMessage = new RichText( 'Tab and keyboard-drag me!', {
    font: new PhetFont( 15 ),
    fill: 'white',
    center: soundKeyboardDragListenerRectangle.center
  } );
  soundKeyboardDragListenerRectangle.addChild( innerRectangleMessage );
  soundKeyboardDragListenerRectangle.addInputListener( new SoundKeyboardDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    translateNode: true,
    dragSpeed: RADIUS * 5,
    shiftDragSpeed: RADIUS
  } ) );

  //---------------------------------------------------------------------------------
  // SoundRichDragListener
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
  richDragListenerEllipse.addInputListener( new SoundRichDragListener( {
    dragBoundsProperty: dragBoundsProperty,
    translateNode: true,
    keyboardDragListenerOptions: {
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
      soundDragistenerCircle,
      soundKeyboardDragListenerRectangle,
      richDragListenerEllipse,
      richDragListenerStateText
    ]
  } );

  // initial positions
  dragArea.center = layoutBounds.center;
  soundDragistenerCircle.center = layoutBounds.center.plusXY( -RADIUS, -RADIUS );
  soundKeyboardDragListenerRectangle.center = layoutBounds.center.plusXY( RADIUS, -RADIUS );
  richDragListenerEllipse.center = layoutBounds.center.plusXY( 0, RADIUS );
  updateStateText( 'Ready to drag...' );

  return content;
}