// Copyright 2018-2022, University of Colorado Boulder

/**
 * An arrow that is composed of 3 line segments: one for the tail, and 2 for a V-shaped head
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../dot/js/Vector2.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { LineCap, LineJoin, Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import { TColor, Node, NodeOptions, Path } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  // head & tail
  stroke?: TColor;
  lineJoin?: LineJoin; // affects the appearance of the arrow tip
  lineCap?: LineCap; // affects appears of the arrow tail, and outside ends of the head

  // head
  headHeight?: number;
  headWidth?: number;
  headLineWidth?: number;

  // tail
  tailLineWidth?: number;
  tailLineDash?: number[];
};

export type LineArrowNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class LineArrowNode extends Node {

  private readonly headWidth: number;
  private readonly headHeight: number;
  private readonly tailNode: Path;
  private readonly headNode: Path;

  public constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: LineArrowNodeOptions ) {

    const options = optionize<LineArrowNodeOptions, SelfOptions, NodeOptions>()( {
      stroke: 'black',
      lineJoin: 'miter',
      lineCap: 'butt',
      headHeight: 10,
      headWidth: 10,
      headLineWidth: 1,
      tailLineWidth: 1,
      tailLineDash: []
    }, providedOptions );

    super();

    this.headWidth = options.headWidth;
    this.headHeight = options.headHeight;

    this.tailNode = new Path( null, {
      stroke: options.stroke,
      lineJoin: options.lineJoin,
      lineCap: options.lineCap,
      lineWidth: options.tailLineWidth,
      lineDash: options.tailLineDash
    } );

    this.headNode = new Path( null, {
      stroke: options.stroke,
      lineJoin: options.lineJoin,
      lineCap: options.lineCap,
      lineWidth: options.headLineWidth
    } );

    this.setTailAndTip( tailX, tailY, tipX, tipY );

    options.children = [ this.tailNode, this.headNode ];

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'LineArrowNode', this );
  }

  /**
   * Set the tail and tip positions to update the arrow shape.
   */
  public setTailAndTip( tailX: number, tailY: number, tipX: number, tipY: number ): void {

    this.tailNode.shape = Shape.lineSegment( tailX, tailY, tipX, tipY );

    // Set up a coordinate frame that goes from tail to tip.
    const vector = new Vector2( tipX - tailX, tipY - tailY );
    const xHatUnit = vector.normalized();
    const yHatUnit = xHatUnit.rotated( Math.PI / 2 );
    const length = vector.magnitude;
    const getPoint = function( xHat: number, yHat: number ) {
      const x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
      const y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
      return new Vector2( x, y );
    };

    // limit head height to tail length
    const headHeight = Math.min( this.headHeight, 0.99 * length );

    this.headNode.shape = new Shape()
      .moveToPoint( getPoint( length - headHeight, this.headWidth / 2 ) )
      .lineToPoint( getPoint( length, 0 ) )
      .lineToPoint( getPoint( length - headHeight, -this.headWidth / 2 ) );
  }
}

sceneryPhet.register( 'LineArrowNode', LineArrowNode );