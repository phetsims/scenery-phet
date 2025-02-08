// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for LaserPointerNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LaserPointerNode from '../../LaserPointerNode.js';

export default function demoLaserPointerNode( layoutBounds: Bounds2 ): Node {


  const leftOnProperty = new Property( false );
  const rightOnProperty = new Property( false );

  // Demonstrate how to adjust lighting
  const leftLaserNode = new LaserPointerNode( leftOnProperty, {

    // these options adjust the lighting
    topColor: LaserPointerNode.DEFAULT_LASER_NODE_OPTIONS.bottomColor,
    bottomColor: LaserPointerNode.DEFAULT_LASER_NODE_OPTIONS.topColor,
    highlightColorStop: 1 - LaserPointerNode.DEFAULT_LASER_NODE_OPTIONS.highlightColorStop,
    buttonOptions: {
      rotation: Math.PI
    },
    rotation: Math.PI,
    right: layoutBounds.centerX - 20,
    centerY: layoutBounds.centerY
  } );

  const rightLaserNode = new LaserPointerNode( rightOnProperty, {
    left: layoutBounds.centerX + 20,
    centerY: layoutBounds.centerY,
    hasGlass: true
  } );

  const leftBeamNode = new Rectangle( 0, 0, 1000, 40, {
    fill: 'yellow',
    right: leftLaserNode.centerX,
    centerY: leftLaserNode.centerY
  } );

  const rightBeamNode = new Rectangle( 0, 0, 1000, 40, {
    fill: 'yellow',
    left: rightLaserNode.centerX,
    centerY: rightLaserNode.centerY
  } );

  leftOnProperty.link( on => {
    leftBeamNode.visible = on;
  } );
  rightOnProperty.link( on => {
    rightBeamNode.visible = on;
  } );

  return new Node( { children: [ leftBeamNode, leftLaserNode, rightBeamNode, rightLaserNode ] } );
}