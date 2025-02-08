// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for GrabDragInteraction
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import GrabDragInteraction from '../../accessibility/grab-drag/GrabDragInteraction.js';

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

  // A parent Node for the interaction cues that will be added by GrabDragInteraction.
  const interactionCueParent = new Node();

  new GrabDragInteraction( rect, keyboardDragListener, interactionCueParent, { // eslint-disable-line no-new
    objectToGrabString: 'rectangle',
    idleStateAccessibleName: 'grab rectangle',
    grabCueOffset: new Vector2( 0, 10 ),
    tandem: providedOptions.tandem!.createTandem( 'grabDragInteraction' )
  } );

  return new Node( {
    children: [ interactionCueParent, rect ],
    center: layoutBounds.center
  } );
}