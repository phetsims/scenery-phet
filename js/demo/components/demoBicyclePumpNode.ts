// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for BicyclePumpNode
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BicyclePumpNode from '../../BicyclePumpNode.js';
import ResetButton from '../../buttons/ResetButton.js';
import PhetFont from '../../PhetFont.js';

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