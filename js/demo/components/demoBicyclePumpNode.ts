// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for BicyclePumpNode
 */

import { Node, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import PhetFont from '../../PhetFont.js';
import BicyclePumpNode from '../../BicyclePumpNode.js';
import ResetButton from '../../buttons/ResetButton.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default function demoBicyclePumpNode( layoutBounds: Bounds2 ): Node {

  const numberOfParticlesProperty = new NumberProperty( 0, {
    numberType: 'Integer',
    range: new Range( 0, 100 )
  } );

  const rangeProperty = new Property( numberOfParticlesProperty.range );

  const bicyclePumpNode = new BicyclePumpNode( numberOfParticlesProperty, rangeProperty, {
    hoseAttachmentOffset: new Vector2( 100, -100 )
  } );

  // Displays the number of particles, positioned next to the hose output
  const displayNode = new Text( numberOfParticlesProperty.value, {
    font: new PhetFont( 24 ),
    left: bicyclePumpNode.x + bicyclePumpNode.hoseAttachmentOffset.x + 20,
    centerY: bicyclePumpNode.y + bicyclePumpNode.hoseAttachmentOffset.y
  } );

  numberOfParticlesProperty.link( numberOfParticles => {
    displayNode.string = numberOfParticles;
  } );

  const resetButton = new ResetButton( {
    listener: () => {
      numberOfParticlesProperty.reset();
      bicyclePumpNode.reset();
    },
    scale: 0.75,
    centerX: bicyclePumpNode.x,
    top: bicyclePumpNode.bottom + 20
  } );

  return new Node( {
    children: [ bicyclePumpNode, displayNode, resetButton ],
    center: layoutBounds.center
  } );
}