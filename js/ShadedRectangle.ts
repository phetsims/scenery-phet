// Copyright 2014-2022, University of Colorado Boulder

/**
 * A rectangle with pseudo-3D shading.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { Color, TColor, LinearGradient, Node, NodeOptions, PaintColorProperty, Path, RadialGradient, Rectangle } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type LightSource = 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';

type SelfOptions = {
  baseColor?: TColor;
  lightFactor?: number; // how much lighter the "light" parts (top and left) are
  lighterFactor?: number; // how much lighter is the top than the left
  darkFactor?: number; // how much darker the "dark" parts (bottom and right) are
  darkerFactor?: number; // how much darker the bottom is than the right
  cornerRadius?: number; // the radius of curvature at the corners (also determines the size of the faux-3D shading)
  lightSource?: LightSource; // relative position of the light source

  // What fraction of the cornerRadius should the light and dark gradients extend into the rectangle?
  // Should always be less than 1.
  lightOffset?: number;
  darkOffset?: number;
};

export type ShadedRectangleOptions = SelfOptions & NodeOptions;

export default class ShadedRectangle extends Node {

  private readonly lighterPaintProperty: PaintColorProperty;
  private readonly lightPaintProperty: PaintColorProperty;
  private readonly darkPaintProperty: PaintColorProperty;
  private readonly darkerPaintProperty: PaintColorProperty;

  /**
   * @param rectBounds - takes up rectBounds in size
   * @param [providedOptions]
   */
  public constructor( rectBounds: Bounds2, providedOptions?: ShadedRectangleOptions ) {

    super();

    const options = optionize<ShadedRectangleOptions, SelfOptions, NodeOptions>()( {
      baseColor: new Color( 80, 130, 230 ),
      lightFactor: 0.5,
      lighterFactor: 0.1,
      darkFactor: 0.5,
      darkerFactor: 0.1,
      cornerRadius: 10,
      lightSource: 'leftTop',
      lightOffset: 0.525,
      darkOffset: 0.375
    }, providedOptions );

    assert && assert( options.lightOffset < 1, 'options.lightOffset needs to be less than 1' );
    assert && assert( options.darkOffset < 1, 'options.darkOffset needs to be less than 1' );

    const lightFromLeft = options.lightSource.includes( 'left' );
    const lightFromTop = options.lightSource.includes( 'Top' );

    const cornerRadius = options.cornerRadius;

    // compute our colors (properly handle color-Property cases for baseColor)
    this.lighterPaintProperty = new PaintColorProperty( options.baseColor, { luminanceFactor: options.lightFactor + options.lighterFactor } );
    this.lightPaintProperty = new PaintColorProperty( options.baseColor, { luminanceFactor: options.lightFactor } );
    this.darkPaintProperty = new PaintColorProperty( options.baseColor, { luminanceFactor: -options.darkFactor } );
    this.darkerPaintProperty = new PaintColorProperty( options.baseColor, { luminanceFactor: -options.darkFactor - options.darkerFactor } );

    // change colors based on orientation
    const topColorProperty = lightFromTop ? this.lighterPaintProperty : this.darkerPaintProperty;
    const leftColorProperty = lightFromLeft ? this.lightPaintProperty : this.darkPaintProperty;
    const rightColorProperty = lightFromLeft ? this.darkPaintProperty : this.lightPaintProperty;
    const bottomColorProperty = lightFromTop ? this.darkerPaintProperty : this.lighterPaintProperty;

    // how far our light and dark gradients will extend into the rectangle
    const lightOffset = options.lightOffset * cornerRadius;
    const darkOffset = options.darkOffset * cornerRadius;

    // change offsets based on orientation
    const topOffset = lightFromTop ? lightOffset : darkOffset;
    const leftOffset = lightFromLeft ? lightOffset : darkOffset;
    const rightOffset = lightFromLeft ? darkOffset : lightOffset;
    const bottomOffset = lightFromTop ? darkOffset : lightOffset;

    // we layer two gradients on top of each other as the base (using the same rounded rectangle shape)
    const horizontalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, { pickable: false } );
    const verticalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, { pickable: false } );

    horizontalNode.fill = new LinearGradient( horizontalNode.left, 0, horizontalNode.right, 0 )
      .addColorStop( 0, leftColorProperty )
      .addColorStop( leftOffset / verticalNode.width, options.baseColor )
      .addColorStop( 1 - rightOffset / verticalNode.width, options.baseColor )
      .addColorStop( 1, rightColorProperty );

    verticalNode.fill = new LinearGradient( 0, verticalNode.top, 0, verticalNode.bottom )
      .addColorStop( 0, topColorProperty )
      .addColorStop( topOffset / verticalNode.height, new DerivedProperty( [ topColorProperty ], ( color => {
        return color.withAlpha( 0 );
      } ) ) )
      .addColorStop( 1 - bottomOffset / verticalNode.height, new DerivedProperty( [ bottomColorProperty ], ( color => {
        return color.withAlpha( 0 );
      } ) ) )
      .addColorStop( 1, bottomColorProperty );

    // shape of our corner (in this case, top-right)
    const cornerShape = new Shape().moveTo( 0, 0 )
      .arc( 0, 0, cornerRadius, -Math.PI / 2, 0, false )
      .close();
    // rotation needed to move the cornerShape into the proper orientation as the light corner (Math.PI more for dark corner)
    const lightCornerRotation = {
      leftTop: -Math.PI / 2,
      rightTop: 0,
      rightBottom: Math.PI / 2,
      leftBottom: Math.PI
    }[ options.lightSource ];

    const innerBounds = rectBounds.eroded( cornerRadius );

    // since both the top and left are "lighter", we have a rounded gradient along that corner
    const lightCorner = new Path( cornerShape, {
      x: lightFromLeft ? innerBounds.minX : innerBounds.maxX,
      y: lightFromTop ? innerBounds.minY : innerBounds.maxY,
      rotation: lightCornerRotation,
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, options.baseColor )
        .addColorStop( 1 - lightOffset / cornerRadius, options.baseColor )
        .addColorStop( 1, this.lighterPaintProperty ),
      pickable: false
    } );

    // since both the bottom and right are "darker", we have a rounded gradient along that corner
    const darkCorner = new Path( cornerShape, {
      x: lightFromLeft ? innerBounds.maxX : innerBounds.minX,
      y: lightFromTop ? innerBounds.maxY : innerBounds.minY,
      rotation: lightCornerRotation + Math.PI, // opposite direction from our light corner
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, options.baseColor )
        .addColorStop( 1 - darkOffset / cornerRadius, options.baseColor )
        .addColorStop( 1, this.darkerPaintProperty ),
      pickable: false
    } );

    // the stroke around the outside
    const panelStroke = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {
      stroke: new DerivedProperty( [ rightColorProperty ], ( color => {
        return color.withAlpha( 0.4 );
      } ) )
    } );

    // layout
    this.addChild( horizontalNode );
    this.addChild( verticalNode );
    this.addChild( lightCorner );
    this.addChild( darkCorner );
    this.addChild( panelStroke ); // NOTE: this is the pickable child used for hit testing. Ensure something is pickable.

    this.mutate( options );
  }

  public override dispose(): void {
    this.lighterPaintProperty.dispose();
    this.lightPaintProperty.dispose();
    this.darkPaintProperty.dispose();
    this.darkerPaintProperty.dispose();

    super.dispose();
  }
}

sceneryPhet.register( 'ShadedRectangle', ShadedRectangle );