// Copyright 2022, University of Colorado Boulder

/**
 * Demo for Drawer
 */

import Drawer from '../../Drawer.js';
import PhetFont from '../../PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';

export default function demoDrawer( layoutBounds: Bounds2 ): Node {

  const rectangle = new Rectangle( 0, 0, 400, 50, {
    fill: 'gray',
    stroke: 'black',
    cornerRadius: 10
  } );

  const textNode = new Text( 'Hello Drawer!', {
    font: new PhetFont( 40 ),
    fill: 'red'
  } );

  const drawer = new Drawer( textNode, {
    handlePosition: 'bottom',
    open: false,
    xMargin: 30,
    yMargin: 20,
    centerX: rectangle.centerX,
    top: rectangle.bottom - 1
  } );

  return new Node( {
    children: [ drawer, rectangle ],
    center: layoutBounds.center
  } );
}