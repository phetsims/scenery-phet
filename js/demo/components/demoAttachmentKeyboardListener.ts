// Copyright 2026, University of Colorado Boulder

/**
 * Demo for AttachmentKeyboardListener.
 *
 * Focus the circle and press Space/Enter to open the transient list of attachment targets.
 * Choosing one of the squares moves the circle into that square; the reset button returns it
 * to its original location.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AttachmentKeyboardListener from '../../input/AttachmentKeyboardListener.js';
import ResetButton from '../../buttons/ResetButton.js';
import PhetFont from '../../PhetFont.js';

type AttachmentSelection = 'top' | 'middle' | 'bottom';
type AttachmentTargetData = {
  value: AttachmentSelection;
  label: string;
  center: Vector2;
};

// Square dimensions for the three attachment targets.
const SQUARE_SIDE_LENGTH = 70;

// Radius of the attachable source circle.
const CIRCLE_RADIUS = 24;

// Vertical spacing between target square centers.
const TARGET_VERTICAL_SPACING = 110;

export default function demoAttachmentKeyboardListener( layoutBounds: Bounds2 ): Node {

  // Root node that hosts the visual demo content and the transient ComboBox parent.
  const rootNode = new Node();

  // Initial resting location for the attachable circle.
  const initialCircleCenter = new Vector2( layoutBounds.left + 170, layoutBounds.centerY );

  // Horizontal location for the square targets on the right side of the demo.
  const targetCenterX = layoutBounds.right - 170;

  // Target metadata used for both square rendering and list item generation.
  const targetData: AttachmentTargetData[] = [
    { value: 'top', label: 'Top square', center: new Vector2( targetCenterX, layoutBounds.centerY - TARGET_VERTICAL_SPACING ) },
    { value: 'middle', label: 'Middle square', center: new Vector2( targetCenterX, layoutBounds.centerY ) },
    { value: 'bottom', label: 'Bottom square', center: new Vector2( targetCenterX, layoutBounds.centerY + TARGET_VERTICAL_SPACING ) }
  ];

  // Lookup table from attachment selection value to corresponding square center.
  const targetCenterMap = new Map<AttachmentSelection, Vector2>( targetData.map( target => [ target.value, target.center ] ) );

  const circleNode = new Circle( CIRCLE_RADIUS, {
    fill: '#f28e2b',
    stroke: 'black',
    lineWidth: 1.5,
    center: initialCircleCenter,
    tagName: 'button',
    accessibleName: 'Attachable circle'
  } );

  // Dashed highlight indicating the currently focused attachment target while the list is open.
  const highlightNode = new Rectangle( 0, 0, SQUARE_SIDE_LENGTH + 18, SQUARE_SIDE_LENGTH + 18, {
    stroke: 'black',
    lineWidth: 2,
    lineDash: [ 8, 4 ],
    visible: false,
    pickable: false
  } );

  const targetNodes = targetData.map( target => {
    return new Node( {
      children: [
        new Rectangle( 0, 0, SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH, {
          fill: '#4e79a7',
          stroke: 'black',
          lineWidth: 1.5,
          center: target.center
        } ),
        new Text( target.label, {
          font: new PhetFont( 14 ),
          centerX: target.center.x,
          top: target.center.y + SQUARE_SIDE_LENGTH * 0.5 + 8
        } )
      ]
    } );
  } );

  // TODO: The keyboard listener fails because it expects `fireOnClick` true in the listener.
  //  Why isn't that an issue for sim usages? See https://github.com/phetsims/energy-skate-park/issues/524
  circleNode.addInputListener( new AttachmentKeyboardListener<AttachmentSelection>( {
    triggerNode: circleNode,
    listParent: rootNode,
    layoutBounds: layoutBounds,
    showHighlight: position => {
      highlightNode.center = position;
      highlightNode.visible = true;
    },
    hideHighlight: () => {
      highlightNode.visible = false;
    },
    getItems: () => {
      return targetData.map( target => ( {
        value: target.value,
        createNode: () => new Text( target.label )
      } ) );
    },
    getInitialPosition: () => initialCircleCenter,
    getHighlightPosition: selection => selection ? targetCenterMap.get( selection ) || initialCircleCenter : initialCircleCenter,
    applySelection: ( selection, targetPosition ) => {
      if ( selection ) {
        circleNode.center = targetPosition;
      }
      else {
        circleNode.center = initialCircleCenter;
      }
    },
    noItemsContextResponse: 'No attachment targets available.'
  } ) );

  const resetButton = new ResetButton( {
    listener: () => {
      circleNode.center = initialCircleCenter;
      highlightNode.visible = false;
    },
    scale: 0.75,
    centerX: layoutBounds.centerX,
    bottom: layoutBounds.bottom - 20
  } );

  targetNodes.forEach( targetNode => rootNode.addChild( targetNode ) );
  rootNode.addChild( highlightNode );
  rootNode.addChild( circleNode );
  rootNode.addChild( resetButton );

  return rootNode;
}
