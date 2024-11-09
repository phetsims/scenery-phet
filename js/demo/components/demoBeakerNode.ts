// Copyright 2022-2024, University of Colorado Boulder

/**
 * Demo for BeakerNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import VSlider from '../../../../sun/js/VSlider.js';
import BeakerNode from '../../BeakerNode.js';
import PhetFont from '../../PhetFont.js';

export default function demoBeakerNode( layoutBounds: Bounds2 ): Node {

  const ticksVisibleText = new Text( 'ticks visible', {
    font: new PhetFont( 16 )
  } );

  const ticksVisibleProperty = new BooleanProperty( true );

  const ticksVisibleCheckbox = new Checkbox( ticksVisibleProperty, ticksVisibleText );

  const solutionLevelProperty = new NumberProperty( 0.5, {
    range: new Range( 0, 1 )
  } );

  const solutionLevelSlider = new VSlider( solutionLevelProperty, solutionLevelProperty.range );

  const beakerNode = new BeakerNode( solutionLevelProperty, {
    ticksVisible: true
  } );

  ticksVisibleProperty.link( ticksVisible => {
    beakerNode.setTicksVisible( ticksVisible );
  } );

  return new HBox( {
    children: [ ticksVisibleCheckbox, beakerNode, solutionLevelSlider ],
    spacing: 50,
    center: layoutBounds.center
  } );
}