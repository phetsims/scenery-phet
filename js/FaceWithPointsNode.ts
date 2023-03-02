// Copyright 2014-2023, University of Colorado Boulder

/**
 * A face that either smiles or frowns.  When the face is smiling, it displays points awarded next to it.
 *
 * @author John Blanco
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../dot/js/Vector2.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import optionize from '../../phet-core/js/optionize.js';
import { Font, TColor, Node, NodeOptions, Text } from '../../scenery/js/imports.js';
import FaceNode from './FaceNode.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

type PointsAlignment = 'centerBottom' | 'rightBottom' | 'rightCenter';

type SelfOptions = {
  spacing?: number; // space between face and points

  // face options
  faceDiameter?: number;
  faceOpacity?: number; // 0 (transparent) to 1 (opaque)

  // points options
  pointsAlignment?: PointsAlignment;
  pointsFont?: Font;
  pointsFill?: TColor;
  pointsStroke?: TColor;
  pointsOpacity?: number; // 0 (transparent) to 1 (opaque)
  showZeroPoints?: boolean; // whether to show '0' points
  points?: number; // the number of points
};

export type FaceWithPointsNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class FaceWithPointsNode extends Node {

  // options needed by methods
  private readonly spacing: number;
  private readonly pointsAlignment: PointsAlignment;
  private readonly showZeroPoints: boolean;

  private readonly faceNode: FaceNode;
  private readonly pointsNode: Text;

  public constructor( providedOptions?: FaceWithPointsNodeOptions ) {

    const options = optionize<FaceWithPointsNodeOptions, SelfOptions, NodeOptions>()( {

      // FaceWithPointsNodeOptions
      spacing: 2,
      faceDiameter: 100,
      faceOpacity: 1,
      pointsAlignment: 'centerBottom',
      pointsFont: new PhetFont( { size: 44, weight: 'bold' } ),
      pointsFill: 'black',
      pointsStroke: null,
      pointsOpacity: 1,
      showZeroPoints: false,
      points: 0
    }, providedOptions );

    // Validate options
    assert && assert( options.faceDiameter > 0, `invalid faceDiameter: ${options.faceDiameter}` );
    assert && assert( options.faceOpacity >= 0 && options.faceOpacity <= 1, `invalid faceOpacity: ${options.faceOpacity}` );
    assert && assert( options.pointsOpacity >= 0 && options.pointsOpacity <= 1, `invalid pointsOpacity: ${options.pointsOpacity}` );
    assert && assert( options.points >= 0, 'points must be non-negative' );

    super();

    this.spacing = options.spacing;
    this.pointsAlignment = options.pointsAlignment;
    this.showZeroPoints = options.showZeroPoints;

    this.faceNode = new FaceNode( options.faceDiameter, { opacity: options.faceOpacity } );

    this.pointsNode = new Text( '', {
      font: options.pointsFont,
      fill: options.pointsFill,
      opacity: options.pointsOpacity,
      stroke: options.pointsStroke,
      lineWidth: 1
    } );

    options.children = [ this.faceNode, this.pointsNode ];
    this.mutate( options );

    this.setPoints( options.points );
  }

  public smile(): void {
    this.faceNode.smile();
    this.pointsNode.visible = true;
  }

  public frown(): void {
    this.faceNode.frown();
    this.pointsNode.visible = false;
  }

  /**
   * Sets the number of points displayed.
   * @param points
   */
  public setPoints( points: number ): void {

    // We do not have negative points, as it goes against our philosophy,
    // see https://github.com/phetsims/scenery-phet/issues/224
    assert && assert( points >= 0, 'points must be non-negative' );

    if ( points === 0 && !this.showZeroPoints ) {
      this.pointsNode.string = '';
    }
    else {
      this.pointsNode.string = `+${points}`;
    }
    this.updatePointsPosition();
  }

  /**
   * Adjusts position of the points to match the specified value of options.pointsAlignment.
   */
  private updatePointsPosition(): void {
    switch( this.pointsAlignment ) {

      case 'centerBottom':
        this.pointsNode.centerX = this.faceNode.centerX;
        this.pointsNode.top = this.faceNode.bottom + this.spacing;
        break;

      case 'rightBottom':
        this.pointsNode.leftCenter = new Vector2( this.faceNode.right + this.spacing, this.faceNode.centerY ).rotate( Math.PI / 4 );
        break;

      case 'rightCenter':
        this.pointsNode.left = this.faceNode.right + this.spacing;
        this.pointsNode.centerY = this.faceNode.centerY;
        break;

      default:
        throw new Error( `unsupported pointsAlignment: ${this.pointsAlignment}` );
    }
  }
}

sceneryPhet.register( 'FaceWithPointsNode', FaceWithPointsNode );