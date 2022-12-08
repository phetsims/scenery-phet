// Copyright 2022, University of Colorado Boulder

/**
 * Demo for FlowBox
 *
 * @author Jonathan Olson
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { Circle, Color, FlowBox, HBox, Node, Rectangle, Text, VBox, WidthSizable } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import MutableOptionsNode from '../../../../sun/js/MutableOptionsNode.js';
import NumberDisplay from '../../NumberDisplay.js';

export default function demoFlowBox( layoutBounds ) {

  const scene = new Node( { y: 50, scale: 0.8 } );

  const blockSizeProperty = new NumberProperty( 50, {
    range: new Range( 50, 100 )
  } );
  const preferredSizeProperty = new NumberProperty( 500, {
    range: new Range( 200, 800 )
  } );

  const leftBox = new HBox( { spacing: 5, align: 'top' } );
  const rightBox = new VBox( { spacing: 5, align: 'left' } );
  scene.addChild( new HBox( {
    children: [ leftBox, rightBox ],
    spacing: 10,
    align: 'top'
  } ) );

  rightBox.addChild( new HBox( {
    spacing: 5,
    children: [
      new Text( 'Block Size' ),
      new HSlider( blockSizeProperty, blockSizeProperty.range ),
      new Text( 'Preferred Size' ),
      new HSlider( preferredSizeProperty, preferredSizeProperty.range )
    ]
  } ) );

  class HackySizableHSlider extends WidthSizable( MutableOptionsNode ) {
    constructor( property, options ) {
      const trackSizeProperty = new Property( new Dimension2( 100, 5 ) );

      super( HSlider, [ property, property.range ], {}, {
        trackSize: trackSizeProperty
      }, options );

      this.localMinimumWidth = this.width;

      this.localPreferredWidthProperty.lazyLink( preferredWidth => {
        const delta = Math.max( preferredWidth, this.localMinimumWidth ) - this.width;

        trackSizeProperty.value = new Dimension2( trackSizeProperty.value.width + delta, 5 );
      } );
    }
  }

  const hackyProperty = new NumberProperty( 0, {
    range: new Range( 0, 100 )
  } );
  const hackyBox = new FlowBox( {
    children: [
      new Text( 'Example slider:', {
        fontSize: 16,
        layoutOptions: { rightMargin: 10 }
      } ),
      new HackySizableHSlider( hackyProperty, {
        layoutOptions: { grow: 1 }
      } ),
      new NumberDisplay( hackyProperty, hackyProperty.range, {
        layoutOptions: { leftMargin: 5 }
      } )
    ]
  } );
  rightBox.addChild( hackyBox );
  preferredSizeProperty.link( size => { hackyBox.preferredWidth = size; } );

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
      this.localMinimumHeight = 15;

      this.localPreferredWidthProperty.lazyLink( width => {
        if ( width ) {
          this.rectWidth = Math.max( this.localMinimumWidth, width );
        }
      } );
      this.localPreferredHeightProperty.lazyLink( height => {
        if ( height ) {
          this.rectHeight = Math.max( this.localMinimumHeight, height );
        }
      } );
    }
  }

  const rectA = new Rectangle( 0, 0, 50, 15, {
    fill: niceColors[ 9 ]
  } );
  const rectB = new Rectangle( 0, 0, 50, 15, {
    fill: niceColors[ 6 ]
  } );
  const rectC = new Rectangle( 0, 0, 50, 15, {
    fill: niceColors[ 3 ]
  } );
  const rectD = new Rectangle( 0, 0, 50, 15, {
    fill: niceColors[ 0 ]
  } );
  blockSizeProperty.link( size => {
    rectA.rectWidth = size;
    rectB.rectWidth = size * 0.5;
    rectC.rectWidth = size * 2;
    rectD.rectWidth = size * 0.5;
  } );

  function demoBox( box, title, usePreferred = true, isHorizontal = true ) {
    if ( usePreferred ) {
      preferredSizeProperty.link( size => {
        if ( isHorizontal ) {
          box.preferredWidth = size;
        }
        else {
          box.preferredHeight = size;
        }
      } );
    }

    const backgroundRect = new Rectangle( {
      fill: 'rgba(0,0,0,0.1)'
    } );
    box.localBoundsProperty.link( localBounds => {
      backgroundRect.rectBounds = localBounds.copy();
    } );

    return new Node( {
      children: [
        backgroundRect,
        box,
        ...( title ? [ new Text( title, {
          fill: 'black',
          centerY: 15 / 2,
          left: 5
        } ) ] : [] )
      ]
    } );
  }

  const noPreferredBox = new FlowBox( {
    children: [
      new Node( { children: [ rectA ] } ),
      new Node( { children: [ rectB ] } ),
      new Node( { children: [ rectC ] } ),
      new Node( { children: [ rectD ] } )
    ]
  } );
  rightBox.addChild( demoBox( noPreferredBox, 'no-preferred', false ) );

  const justifyBox = new VBox( { spacing: 1, align: 'left' } );
  rightBox.addChild( justifyBox );

  [
    'left',
    'right',
    'center',
    'spaceBetween',
    'spaceAround',
    'spaceEvenly'
  ].forEach( justify => {
    const flowBox = new FlowBox( {
      children: [
        new Node( { children: [ rectA ] } ),
        new Node( { children: [ rectB ] } ),
        new Node( { children: [ rectC ] } ),
        new Node( { children: [ rectD ] } )
      ],
      justify: justify
    } );

    justifyBox.addChild( demoBox( flowBox, `justify:${justify}` ) );
  } );

  [
    'left',
    'right',
    'center',
    'spaceBetween',
    'spaceAround',
    'spaceEvenly'
  ].forEach( justify => {
    const wrapBox = new FlowBox( {
      children: [
        new Node( { children: [ rectA ] } ),
        new Node( { children: [ rectB ] } ),
        new Node( { children: [ rectC ] } ),
        new Node( { children: [ rectD ] } )
      ],
      justify: justify,
      wrap: true
    } );

    justifyBox.addChild( demoBox( wrapBox, `wrap+justify:${justify}` ) );
  } );

  const alignBox = new VBox( { spacing: 1, align: 'left' } );
  rightBox.addChild( alignBox );

  [
    'top',
    'bottom',
    'center',
    'origin'
  ].forEach( align => {
    const flowBox = new FlowBox( {
      children: [
        new Rectangle( 0, 0, 50, 15, {
          fill: niceColors[ 9 ]
        } ),
        new Rectangle( 0, 0, 50, 20, {
          fill: niceColors[ 6 ]
        } ),
        new ExampleExpandingRectangle( 0, 0, 50, 10, {
          fill: 'gray'
        } ),
        new Rectangle( 0, 0, 50, 5, {
          fill: niceColors[ 4 ]
        } ),
        new Rectangle( 0, 0, 50, 15, {
          fill: niceColors[ 2 ]
        } ),
        new Circle( 7, {
          fill: niceColors[ 0 ]
        } ),
        new Text( 'Some text' )
      ],
      justify: 'left',
      align: align
    } );

    justifyBox.addChild( demoBox( flowBox, `align:${align}` ) );
  } );

  const singleGrowBox = new FlowBox( {
    children: [
      new Node( { children: [ rectA ] } ),
      new Node( { children: [ rectB ] } ),
      new ExampleExpandingRectangle( 0, 0, 50, 15, {
        fill: 'gray',
        layoutOptions: { grow: 1 }
      } ),
      new Node( { children: [ rectC ] } ),
      new Node( { children: [ rectD ] } )
    ]
  } );
  rightBox.addChild( demoBox( singleGrowBox, 'Single Grow' ) );

  const doubleGrowBox = new FlowBox( {
    children: [
      new Node( { children: [ rectA ] } ),
      new ExampleExpandingRectangle( 0, 0, 50, 15, {
        fill: 'gray',
        layoutOptions: { grow: 1 }
      } ),
      new Node( { children: [ rectB ] } ),
      new Node( { children: [ rectC ] } ),
      new ExampleExpandingRectangle( 0, 0, 50, 15, {
        fill: 'gray',
        layoutOptions: { grow: 4 }
      } ),
      new Node( { children: [ rectD ] } )
    ]
  } );
  rightBox.addChild( demoBox( doubleGrowBox, 'Double Grow, 1,4' ) );

  const maxWidthBox = new FlowBox( {
    children: [
      new Node( { children: [ rectA ] } ),
      new Node( { children: [ rectB ] } ),
      new ExampleExpandingRectangle( 0, 0, 50, 15, {
        fill: 'gray',
        layoutOptions: { grow: 1, maxContentWidth: 150 }
      } ),
      new Node( { children: [ rectC ] } ),
      new Node( { children: [ rectD ] } )
    ]
  } );
  rightBox.addChild( demoBox( maxWidthBox, 'maxContentWidth' ) );

  const spacingBox = new FlowBox( {
    children: [
      new Node( { children: [ rectA ] } ),
      new Node( { children: [ rectB ] } ),
      new Node( { children: [ rectC ] } ),
      new Node( { children: [ rectD ] } )
    ],
    spacing: 10,
    lineSpacing: 10,
    wrap: true,
    justify: 'left'
  } );
  rightBox.addChild( demoBox( spacingBox, 'spacing+lineSpacing+wrap+left' ) );

  const marginBox = new FlowBox( {
    children: [
      new Node( { children: [ rectA ] } ),
      new Node( { children: [ rectB ], layoutOptions: { xMargin: 10 } } ),
      new Node( { children: [ rectC ] } ),
      new Node( { children: [ rectD ], layoutOptions: { topMargin: 10 } } )
    ],
    justify: 'left',
    align: 'top'
  } );
  rightBox.addChild( demoBox( marginBox, 'margins+justify:left+align:top' ) );

  // Left (vertical)
  const rectE = new Rectangle( 0, 0, 15, 50, {
    fill: niceColors[ 9 ]
  } );
  const rectF = new Rectangle( 0, 0, 15, 50, {
    fill: niceColors[ 6 ]
  } );
  const rectG = new Rectangle( 0, 0, 15, 50, {
    fill: niceColors[ 3 ]
  } );
  const rectH = new Rectangle( 0, 0, 15, 50, {
    fill: niceColors[ 0 ]
  } );
  blockSizeProperty.link( size => {
    rectE.rectHeight = size;
    rectF.rectHeight = size * 0.5;
    rectG.rectHeight = size * 2;
    rectH.rectHeight = size * 0.5;
  } );

  const verticalBox = new FlowBox( {
    orientation: 'vertical',
    children: [
      new Node( { children: [ rectE ] } ),
      new Node( { children: [ rectF ] } ),
      new Node( { children: [ rectG ] } ),
      new Node( { children: [ rectH ] } )
    ]
  } );
  leftBox.addChild( demoBox( verticalBox, null, true, false ) );

  return new Node( {
    children: [ scene ],
    center: layoutBounds.center
  } );
}