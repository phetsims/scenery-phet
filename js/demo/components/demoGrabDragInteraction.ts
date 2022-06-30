// Copyright 2022, University of Colorado Boulder

/**
 * Demo for GrabDragInteraction
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { DragListener, KeyboardDragListener, Node, Rectangle } from '../../../../scenery/js/imports.js';
import GrabDragInteraction from '../../accessibility/GrabDragInteraction.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default function demoGrabDragInteraction( layoutBounds: Bounds2, providedOptions: SunDemoOptions ): Node {

  const rect = new Rectangle( 0, 0, 100, 100, {
    tagName: 'div',
    ariaRole: 'application',
    fill: 'blue',
    cursor: 'pointer'
  } );
  const positionProperty = new Vector2Property( Vector2.ZERO );
  positionProperty.linkAttribute( rect, 'translation' );

  const listener = new DragListener( {
    positionProperty: positionProperty
  } );
  rect.addInputListener( listener );
  const keyboardDragListener = new KeyboardDragListener( {
    positionProperty: positionProperty,
    tandem: providedOptions.tandem!.createTandem( 'keyboardDragListener' )
  } );
  rect.addInputListener( keyboardDragListener );

  new GrabDragInteraction( rect, keyboardDragListener, { // eslint-disable-line no-new
    objectToGrabString: 'rectangle',
    grabbableAccessibleName: 'grab rectangle',
    tandem: providedOptions.tandem!.createTandem( 'grabDragInteraction' )
  } );

  return new Node( {
    children: [ rect ],
    center: layoutBounds.center
  } );
}