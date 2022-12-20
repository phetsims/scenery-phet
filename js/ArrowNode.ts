// Copyright 2013-2022, University of Colorado Boulder

/**
 * A single- or double-headed arrow. This is a convenience class, most of the work is done in ArrowShape.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Aaron Davis
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import ArrowShape from './ArrowShape.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  headHeight?: number;
  headWidth?: number;
  tailWidth?: number;
  isHeadDynamic?: boolean;
  scaleTailToo?: boolean;

  // head will be scaled when headHeight is greater than fractionalHeadHeight * arrow length
  fractionalHeadHeight?: number;

  // true puts heads on both ends of the arrow, false puts a head at the tip
  doubleHead?: boolean;
};

export type ArrowNodeOptions = SelfOptions & PathOptions;

export default class ArrowNode extends Path {

  // Get these fields using ES5 getters.
  public constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: ArrowNodeOptions ) {

    // default options
    const options = optionize<ArrowNodeOptions, SelfOptions, PathOptions>()( {
      headHeight: 10,
      headWidth: 10,
      tailWidth: 5,
      isHeadDynamic: false,
      scaleTailToo: false,
      fractionalHeadHeight: 0.5, // head will be scaled when headHeight is greater than fractionalHeadHeight * arrow length
      doubleHead: false, // true puts heads on both ends of the arrow, false puts a head at the tip

      // Path options
      fill: 'black',
      stroke: 'black',
      lineWidth: 1,

      // phet-io
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    super( null );

    this.options = options;
    this.shapePoints = [];

    this._tailX = tailX;
    this._tailY = tailY;
    this._tipX = tipX;
    this._tipY = tipY;

    this.setTailAndTip( tailX, tailY, tipX, tipY );

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ArrowNode', this );
  }

  // Set these fields using setTail, setTip, setTailAndTip.
  private _tailX: number;

  public get tailX(): number { return this._tailX; }

  private _tailY: number;

  private readonly options: Required<SelfOptions>;
  private shapePoints: Vector2[];

  public get tailY(): number { return this._tailY; }

  private _tipX: number;

  public get tipX(): number { return this._tipX; }

  private _tipY: number;

  public get tipY(): number { return this._tipY; }

  /**
   * Sets the tail and tip positions to update the arrow shape.
   * If the tail and tip are at the same point, the arrow is not shown.
   */
  public setTailAndTip( tailX: number, tailY: number, tipX: number, tipY: number ): void {

    this._tailX = tailX;
    this._tailY = tailY;
    this._tipX = tipX;
    this._tipY = tipY;

    const numberOfPointsChanged = this.updateShapePoints();

    // This bit of logic is to improve performance for the case where the Shape instance can be reused
    // (if the number of points in the array is the same).
    if ( !this.shape || numberOfPointsChanged ) {
      this.updateShape();
    }
    else {

      // This is the higher-performance case where the Shape instance can be reused
      this.shape.invalidatePoints();
    }
  }

  /**
   * Initialize or update the shape. Only called if the number of points in the shape changes.
   */
  private updateShape(): void {

    const shape = new Shape();

    if ( this.shapePoints.length > 1 ) {
      shape.moveToPoint( this.shapePoints[ 0 ] );
      for ( let i = 1; i < this.shapePoints.length; i++ ) {
        shape.lineToPoint( this.shapePoints[ i ] );
      }
      shape.close();
    }

    this.shape = shape;
  }

  /**
   * Sets the tail position.
   */
  public setTail( tailX: number, tailY: number ): void {
    this.setTailAndTip( tailX, tailY, this._tipX, this._tipY );
  }

  /**
   * Sets the tip position.
   */
  public setTip( tipX: number, tipY: number ): void {
    this.setTailAndTip( this._tailX, this._tailY, tipX, tipY );
  }

  /**
   * Update the internal shapePoints array which is used to populate the points in the Shape instance.
   * Returns true if the number of points in the array has changed, which would require building a new shape instance.
   */
  private updateShapePoints(): boolean {
    const numberOfPoints = this.shapePoints.length;
    this.shapePoints = ArrowShape.getArrowShapePoints( this._tailX, this._tailY, this._tipX, this._tipY, this.shapePoints, this.options );
    return ( this.shapePoints.length !== numberOfPoints );
  }

  /**
   * Sets the tail width.
   */
  public setTailWidth( tailWidth: number ): void {
    this.options.tailWidth = tailWidth;
    this.updateShapePoints();
    this.updateShape();
  }

  /**
   * Sets whether the arrow has one or two heads.
   */
  public setDoubleHead( doubleHead: boolean ): void {
    this.options.doubleHead = doubleHead;
    this.updateShapePoints();
    this.updateShape();
  }
}

sceneryPhet.register( 'ArrowNode', ArrowNode );
