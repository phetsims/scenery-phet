// Copyright 2022, University of Colorado Boulder

/**
 * Demo for GridBox
 *
 * @author Jonathan Olson
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { Color, GridBox, HBox, Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';

export default function demoGridBox( layoutBounds ) {
  const scene = new Node( { y: 50 } );

  const niceColors = [
    new Color( 62, 171, 3 ),
    new Color( 23, 180, 77 ),
    new Color( 24, 183, 138 ),
    new Color( 23, 178, 194 ),
    new Color( 20, 163, 238 ),
    new Color( 71, 136, 255 ),
    new Color( 171, 101, 255 ),
    new Color( 228, 72, 235 ),
    new Color( 252, 66, 186 ),
    new Color( 252, 82, 127 )
  ];

  class ExampleExpandingRectangle extends Rectangle {
    constructor( ...args ) {
      super( ...args );

      this.localMinimumWidth = 50;
      this.localMinimumHeight = 50;
      this.widthSizable = true;
      this.heightSizable = true;
    }
  }

  const blockSizeProperty = new NumberProperty( 50, {
    range: new Range( 50, 200 )
  } );
  const preferredWidthProperty = new NumberProperty( 500, {
    range: new Range( 200, 800 )
  } );
  const preferredHeightProperty = new NumberProperty( 500, {
    range: new Range( 200, 800 )
  } );

  const rectA = new Rectangle( 0, 0, 50, 50, {
    fill: niceColors[ 9 ]
  } );
  const rectB = new Rectangle( 0, 0, 50, 50, {
    fill: niceColors[ 6 ]
  } );
  const rectC = new Rectangle( 0, 0, 50, 50, {
    fill: niceColors[ 3 ]
  } );
  const rectD = new Rectangle( 0, 0, 50, 50, {
    fill: niceColors[ 0 ]
  } );
  blockSizeProperty.link( size => {
    rectA.rectWidth = size;
    rectB.rectWidth = size * 0.5;
    rectC.rectWidth = size * 2;
    rectD.rectWidth = size * 0.5;
    rectA.rectHeight = size;
    rectB.rectHeight = size * 0.5;
    rectC.rectHeight = size * 2;
    rectD.rectHeight = size * 0.5;
  } );

  const mainBox = new VBox( {
    spacing: 10,
    align: 'left',
    children: [
      new HBox( {
        children: [
          new Text( 'Block Size' ),
          new HSlider( blockSizeProperty, blockSizeProperty.range ),
          new Text( 'Preferred Width' ),
          new HSlider( preferredWidthProperty, preferredWidthProperty.range ),
          new Text( 'Preferred Height' ),
          new HSlider( preferredHeightProperty, preferredHeightProperty.range )
        ]
      } )
    ]
  } );
  scene.addChild( mainBox );

  const gridBox = new GridBox( {
    spacing: 10,
    children: [
      new Node( {
        children: [ rectA ],
        layoutOptions: { column: 0, row: 0, xAlign: 'left' }
      } ),
      new Node( {
        children: [ rectB ],
        layoutOptions: { column: 1, row: 0 }
      } ),
      new Node( {
        children: [ rectC ],
        layoutOptions: { column: 2, row: 0 }
      } ),
      new Node( {
        children: [ rectD ],
        layoutOptions: { column: 0, row: 2 }
      } ),
      new Node( {
        children: [ rectD ],
        layoutOptions: { column: 1, row: 1, horizontalSpan: 2, yAlign: 'bottom' }
      } ),
      new ExampleExpandingRectangle( {
        fill: 'gray',
        layoutOptions: { column: 0, row: 1, stretch: true, grow: 1 }
      } ),
      new ExampleExpandingRectangle( {
        fill: 'gray',
        layoutOptions: { column: 3, row: 0, verticalSpan: 3, yStretch: true, leftMargin: 20, yMargin: 10 }
      } )
    ]
  } );
  const backgroundRect = new Rectangle( {
    fill: 'rgba(0,0,0,0.1)'
  } );
  gridBox.localBoundsProperty.link( localBounds => {
    backgroundRect.rectBounds = localBounds.copy();
  } );
  mainBox.addChild( new Node( {
    children: [ backgroundRect, gridBox ]
  } ) );

  preferredWidthProperty.link( width => { gridBox.preferredWidth = width; } );
  preferredHeightProperty.link( height => { gridBox.preferredHeight = height; } );

  window.gridBox = gridBox;

  return new Node( {
    children: [ scene ],
    center: layoutBounds.center
  } );
}