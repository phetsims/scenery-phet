// Copyright 2015-2022, University of Colorado Boulder

/**
 * A spinnable busy indicator, to indicate something behind the scenes is in progress (but with no indication of how
 * far along it is).
 *
 * The actual rectangles/circles/etc. (called elements in the documentation) stay in fixed positions, but their fill is
 * changed to give the impression of rotation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import optionize from '../../phet-core/js/optionize.js';
import { Circle, Color, Node, NodeOptions, PaintColorProperty, Path, Rectangle } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  // The uniform width and height of the indicator. For a circular indicator, this is the diameter.
  indicatorSize?: number;

  // A multiplier for how fast/slow the indicator will spin.
  indicatorSpeed?: number;

  // The number of Paths that make up the indicator
  elementQuantity?: number;

  // Creates one of the elements that make up the indicator
  elementFactory?: ( indicatorSize: number, elementQuantity: number ) => Path;

  // The active "mostly visible" color at the lead.
  activeColor?: Color | string;

  // The inactive "mostly invisible" color at the tail.
  inactiveColor?: Color | string;
};

export type SpinningIndicatorNodeOptions = SelfOptions & NodeOptions;

export default class SpinningIndicatorNode extends Node {

  // Current angle of rotation
  private indicatorRotation: number;

  // The angle between each element
  private readonly angleDelta: number;

  // A multiplier for how fast/slow the indicator will spin.
  private readonly indicatorSpeed: number;

  // See SelfOptions
  private readonly activeColorProperty: PaintColorProperty;
  private readonly inactiveColorProperty: PaintColorProperty;

  // Each element of the indicator must be Path or a subclass, because we set fill.
  private readonly elements: Path[];

  public constructor( providedOptions?: SpinningIndicatorNodeOptions ) {

    const options = optionize<SpinningIndicatorNodeOptions, SelfOptions, NodeOptions>()( {
      indicatorSize: 15,
      indicatorSpeed: 1,
      elementQuantity: 16,
      elementFactory: SpinningIndicatorNode.rectangleFactory,
      activeColor: 'rgba( 0, 0, 0, 1 )',
      inactiveColor: 'rgba( 0, 0, 0, 0.15 )'
    }, providedOptions );

    super( options );

    this.indicatorRotation = Math.PI * 2; // starts at 2pi so our modulo operation is safe below
    this.angleDelta = 2 * Math.PI / options.elementQuantity;
    this.activeColorProperty = new PaintColorProperty( options.activeColor );
    this.inactiveColorProperty = new PaintColorProperty( options.inactiveColor );
    this.indicatorSpeed = options.indicatorSpeed;

    // Create and add all of the elements
    this.elements = [];
    let angle = 0;
    for ( let i = 0; i < options.elementQuantity; i++ ) {
      const element = options.elementFactory( options.indicatorSize, options.elementQuantity );

      // push the element to the outside of the circle
      element.right = options.indicatorSize / 2;

      // center it vertically, so it can be rotated nicely into place
      element.centerY = 0;

      // rotate each element by its specific angle
      element.rotate( angle, true );

      angle += this.angleDelta;
      this.elements.push( element );
      this.addChild( element );
    }

    this.step( 0 ); // initialize colors
  }

  public step( dt: number ): void {

    // increment rotation based on dt
    this.indicatorRotation += dt * 10.0 * this.indicatorSpeed;

    // update each element
    let angle = this.indicatorRotation;
    for ( let i = 0; i < this.elements.length; i++ ) {
      // a number from 0 (active head) to 1 (inactive tail).
      let ratio = Math.pow( ( angle / ( 2 * Math.PI ) ) % 1, 0.5 );

      // Smoother transition, mapping our ratio from [0,0.2] => [1,0] and [0.2,1] => [0,1].
      // Otherwise, elements can instantly switch from one color to the other, which is visually displeasing.
      if ( ratio < 0.2 ) {
        ratio = 1 - ratio * 5;
      }
      else {
        ratio = ( ratio - 0.2 ) * 10 / 8;
      }

      // Fill it with the interpolated color
      const red = ratio * this.inactiveColorProperty.value.red + ( 1 - ratio ) * this.activeColorProperty.value.red;
      const green = ratio * this.inactiveColorProperty.value.green + ( 1 - ratio ) * this.activeColorProperty.value.green;
      const blue = ratio * this.inactiveColorProperty.value.blue + ( 1 - ratio ) * this.activeColorProperty.value.blue;
      const alpha = ratio * this.inactiveColorProperty.value.alpha + ( 1 - ratio ) * this.activeColorProperty.value.alpha;
      this.elements[ i ].fill = new Color( red, green, blue, alpha );

      // And rotate to the next element (in the opposite direction, so our motion is towards the head)
      angle -= this.angleDelta;
    }
  }

  public override dispose(): void {
    this.activeColorProperty.dispose();
    this.inactiveColorProperty.dispose();

    super.dispose();
  }

  /**
   * Factory method for creating rectangular-shaped elements, sized to fit.
   */
  public static rectangleFactory( indicatorSize: number, elementQuantity: number ): Rectangle {
    return new Rectangle( 0, 0, indicatorSize * 0.175, 1.2 * indicatorSize / elementQuantity );
  }

  /**
   * Factory method for creating circle-shaped elements, sized to fit.
   */
  public static circleFactory( indicatorSize: number, elementQuantity: number ): Circle {
    return new Circle( 0.8 * indicatorSize / elementQuantity );
  }
}

sceneryPhet.register( 'SpinningIndicatorNode', SpinningIndicatorNode );