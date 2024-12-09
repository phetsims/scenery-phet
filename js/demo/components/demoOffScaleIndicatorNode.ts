// Copyright 2024, University of Colorado Boulder

/**
 * Demo for OffScaleIndicatorNode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { GridBox, Node } from '../../../../scenery/js/imports.js';
import OffScaleIndicatorNode from '../../OffScaleIndicatorNode.js';
import PhetFont from '../../PhetFont.js';

export default function demoOffScaleIndicatorNode( layoutBounds: Bounds2 ): Node {
  const demoParent = new GridBox( {
    autoColumns: 2,
    spacing: 5
  } );

  const defaultLeftIndicator = new OffScaleIndicatorNode( 'left' );
  const defaultRightIndicator = new OffScaleIndicatorNode( 'right' );

  const customLeftIndicator = new OffScaleIndicatorNode( 'left', {
    offScaleStringProperty: new StringProperty( 'More to the left' ),
    richTextOptions: {
      font: new PhetFont( 24 ),
      maxWidth: 200,
      fill: 'white'
    },
    panelOptions: {
      fill: 'blue',
      stroke: 'red'
    },
    arrowNodeOptions: {
      fill: 'white'
    }
  } );
  const customRightIndicator = new OffScaleIndicatorNode( 'right', {
    offScaleStringProperty: new StringProperty( 'More to the right' ),
    spacing: 25,
    richTextOptions: {
      font: new PhetFont( 24 )
    },
    arrowTailLength: 100,
    arrowNodeOptions: {
      tailWidth: 4,
      headWidth: 10,
      headHeight: 20,
      fill: 'red'
    }
  } );

  demoParent.children = [
    defaultLeftIndicator,
    defaultRightIndicator,
    customLeftIndicator,
    customRightIndicator
  ];

  // layout
  demoParent.center = layoutBounds.center;

  return demoParent;
}