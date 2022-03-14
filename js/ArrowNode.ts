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

  tailX: number;
  tailY: number;
  tipX: number;
  tipY: number;

  private options: Required<SelfOptions>;
  private shapePoints: Vector2[];

  constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: ArrowNodeOptions ) {

    // default options
    const options = optionize<ArrowNodeOptions, SelfOptions, PathOptions>( {
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

    this.tailX = tailX;
    this.tailY = tailY;
    this.tipX = tipX;
    this.tipY = tipY;

    this.setTailAndTip( tailX, tailY, tipX, tipY );

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    // @ts-ignore chipper query parameters
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ArrowNode', this );
  }

  /**
   * Update the internal shapePoints array which is used to populate the points in the Shape instance.
   * @returns true if the number of points in the array has changed, which would require building a new shape instance.
   */
  private updateShapePoints(): boolean {
    const numberOfPoints = this.shapePoints.length;
    this.shapePoints = ArrowShape.getArrowShapePoints( this.tailX, this.tailY, this.tipX, this.tipY, this.shapePoints, this.options );
    return ( this.shapePoints.length !== numberOfPoints );
  }

  /**
   * Initialize or update the shape. Only called if the number of points in the shape changes.
   */
  private updateShape() {

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
   * Sets the tail and tip positions to update the arrow shape.
   * If the tail and tip are at the same point, the arrow is not shown.
   */
  setTailAndTip( tailX: number, tailY: number, tipX: number, tipY: number ) {

    this.tailX = tailX;
    this.tailY = tailY;
    this.tipX = tipX;
    this.tipY = tipY;

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
   * Sets the tail position.
   */
  setTail( tailX: number, tailY: number ) {
    this.setTailAndTip( tailX, tailY, this.tipX, this.tipY );
  }

  /**
   * Sets the tip position.
   */
  setTip( tipX: number, tipY: number ) {
    this.setTailAndTip( this.tailX, this.tailY, tipX, tipY );
  }

  /**
   * Sets the tail width.
   */
  setTailWidth( tailWidth: number ) {
    this.options.tailWidth = tailWidth;
    this.updateShapePoints();
    this.updateShape();
  }

  /**
   * Sets whether the arrow has one or two heads.
   */
  setDoubleHead( doubleHead: boolean ) {
    this.options.doubleHead = doubleHead;
    this.updateShapePoints();
    this.updateShape();
  }
}

sceneryPhet.register( 'ArrowNode', ArrowNode );
