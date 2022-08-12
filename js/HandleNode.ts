// Copyright 2018-2022, University of Colorado Boulder

/**
 * Scenery node that shows a handle, which is made of two parts: the "grip" which is where you would grab it and the
 * "attachment" which are elbow-shaped bars that attach the handle to another surface.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Matrix3 from '../../dot/js/Matrix3.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { TColor, LinearGradient, Node, NodeOptions, PaintColorProperty, Path, PathOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

// constants
// grip shape
const GRIP_WIDTH = 100;
const GRIP_HEIGHT = 42;
const GRIP_CORNER_RADIUS = GRIP_WIDTH * 0.03;
const GRIP_END_PAD = GRIP_WIDTH * 0.03; // horizontal line between the edge of the grip and the cubic curves
const GRIP_SINGLE_FINGER_INDENT_DEPTH = GRIP_HEIGHT * 0.11;
const GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH = ( GRIP_WIDTH - GRIP_CORNER_RADIUS * 2 - GRIP_END_PAD * 2 ) / 8;

type SelfOptions = {

  // options for the grip
  gripBaseColor?: TColor; // base color of gradient on the grip
  gripStroke?: TColor; // stroke color of the grip
  gripLineWidth?: number;

  // options for the attachment(s)
  attachmentFill?: TColor; // solid fill color for the attachments
  attachmentStroke?: TColor; // stroke color of the attachments
  attachmentLineWidth?: number;
  hasLeftAttachment?: boolean;
  hasRightAttachment?: boolean;
};

export type HandleNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class HandleNode extends Node {

  private readonly disposeHandleNode: () => void;

  public constructor( providedOptions?: HandleNodeOptions ) {

    const options = optionize<HandleNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      gripBaseColor: 'rgb( 183, 184, 185 )',
      gripStroke: 'black',
      gripLineWidth: 3,
      attachmentFill: 'gray',
      attachmentStroke: 'black',
      attachmentLineWidth: 3,
      hasLeftAttachment: true,
      hasRightAttachment: true
    }, providedOptions );

    assert && assert( options.hasLeftAttachment || options.hasRightAttachment, 'at least one attachment is required' );

    // the grip shape begins on the left edge, middle y
    // this is the upper left corner before grip indents start
    const gripShape = new Shape()
      .moveTo( 0, GRIP_HEIGHT / 2 )
      .lineTo( 0, GRIP_CORNER_RADIUS )
      .arc( GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, Math.PI, Math.PI * 1.5, false )
      .lineToRelative( GRIP_END_PAD, 0 );

    // these are the top grip indents
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );
    addGripIndent( gripShape, 1 );

    // this is the whole right edge
    gripShape.lineToRelative( GRIP_END_PAD, 0 )
      .arc( GRIP_WIDTH - GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, Math.PI * 1.5, 0, false )
      .lineToRelative( 0, GRIP_HEIGHT - ( GRIP_CORNER_RADIUS * 2 ) )
      .arc( GRIP_WIDTH - GRIP_CORNER_RADIUS, GRIP_HEIGHT - GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, 0, Math.PI / 2, false )
      .lineToRelative( -GRIP_END_PAD, 0 );

    // these are the bottom grip indents
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );
    addGripIndent( gripShape, -1 );

    // this is the lower left hand corner
    gripShape.lineToRelative( -GRIP_END_PAD, 0 )
      .arc( GRIP_CORNER_RADIUS, GRIP_HEIGHT - GRIP_CORNER_RADIUS, GRIP_CORNER_RADIUS, Math.PI / 2, Math.PI, false )
      .lineTo( 0, GRIP_HEIGHT / 2 )
      .close();

    // Use PaintColorProperty so that colors can be updated dynamically
    const gripBaseColorProperty = new PaintColorProperty( options.gripBaseColor );
    const brighterColorProperty = new PaintColorProperty( gripBaseColorProperty, { luminanceFactor: 0.95 } );
    const darkerColorProperty = new PaintColorProperty( gripBaseColorProperty, { luminanceFactor: -0.35 } );

    // add handle grip shape
    const gripPath = new Path( gripShape, {
      lineWidth: options.gripLineWidth,
      stroke: options.gripStroke,
      fill: new LinearGradient( 0, 0, 0, GRIP_HEIGHT )
        .addColorStop( 0, gripBaseColorProperty )
        .addColorStop( 0.4, brighterColorProperty )
        .addColorStop( 0.7, gripBaseColorProperty )
        .addColorStop( 1.0, darkerColorProperty )
    } );

    options.children = [ gripPath ];

    // handle attachment shape vars
    const attachmentShaftWidth = GRIP_HEIGHT * 0.35;
    const attachmentHeight = GRIP_HEIGHT * 1.15;
    const attachmentBaseNubWidth = attachmentShaftWidth * 0.4;
    const attachmentBaseNubHeight = attachmentHeight * 0.2;
    const attachmentMiddleHeight = attachmentHeight * 0.5;
    const attachmentSmallArcRadius = attachmentShaftWidth * 0.5;

    const attachmentOptions: StrictOmit<PathOptions, 'left' | 'right'> = {
      fill: options.attachmentFill,
      stroke: options.attachmentStroke,
      lineWidth: options.attachmentLineWidth,
      lineJoin: 'round',
      top: gripPath.centerY - attachmentShaftWidth / 2
    };

    const leftAttachmentShape = new Shape()

      // Starts at bottom-left and proceeds clockwise
      .moveTo( 0, attachmentHeight )
      .lineToRelative( attachmentBaseNubWidth, -attachmentBaseNubHeight )
      .lineToRelative( 0, -attachmentMiddleHeight )

      // The main arc at the top left of the attachment
      .arc(
        attachmentShaftWidth + attachmentBaseNubWidth + attachmentSmallArcRadius,
        attachmentHeight - attachmentBaseNubHeight - attachmentMiddleHeight,
        attachmentShaftWidth + attachmentSmallArcRadius,
        Math.PI,
        Math.PI * 1.5,
        false
      )
      .lineToRelative( 0, attachmentShaftWidth )

      // This is the smaller arc on the underside of the attachment
      .arc(
        attachmentShaftWidth + attachmentBaseNubWidth + attachmentSmallArcRadius,
        attachmentHeight - attachmentBaseNubHeight - attachmentMiddleHeight,
        attachmentSmallArcRadius,
        Math.PI * 1.5,
        Math.PI,
        true
      )
      .lineToRelative( 0, attachmentMiddleHeight )
      .lineToRelative( attachmentBaseNubWidth, attachmentBaseNubHeight )
      .lineToRelative( -attachmentShaftWidth - ( attachmentBaseNubWidth * 2 ), 0 )
      .close();

    // left attachment
    if ( options.hasLeftAttachment ) {

      const leftAttachmentPath = new Path( leftAttachmentShape, combineOptions<PathOptions>( {
        right: gripPath.left + options.gripLineWidth
      }, attachmentOptions ) );

      options.children.unshift( leftAttachmentPath ); // prepend so that attachment is behind grip
    }

    // right attachment, a mirror image of the left
    if ( options.hasRightAttachment ) {

      const rightAttachmentShape = leftAttachmentShape.transformed( Matrix3.scaling( -1, 1 ) );

      // handle right attachment
      const rightAttachmentPath = new Path( rightAttachmentShape, combineOptions<PathOptions>( {
        left: gripPath.right - options.gripLineWidth
      }, attachmentOptions ) );

      options.children.unshift( rightAttachmentPath );  // prepend so that attachment is behind grip
    }

    super( options );

    this.disposeHandleNode = () => {
      gripBaseColorProperty.dispose();
      brighterColorProperty.dispose();
      darkerColorProperty.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'HandleNode', this );
  }

  public override dispose(): void {
    this.disposeHandleNode();
    super.dispose();
  }
}

/**
 * Add an "up/down" combination to either the top or bottom of the grip.
 * @param shape - the shape to append to
 * @param sign - +1 for top side of grip, -1 for bottom side of grip
 */
function addGripIndent( shape: Shape, sign: 1 | -1 ): void {

  // control points for cubic curve shape on grip
  // each single-finger indent is made of two cubic curves that are mirrored over the y-axis
  const controlPoint1X = GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH / 2;
  const controlPoint1Y = 0;
  const controlPoint2X = GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH / 4;
  const controlPoint2Y = GRIP_SINGLE_FINGER_INDENT_DEPTH;

  // this is a grip indent
  shape.cubicCurveToRelative(
    sign * controlPoint1X,
    sign * controlPoint1Y,
    sign * controlPoint2X,
    sign * controlPoint2Y,
    sign * GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH,
    sign * GRIP_SINGLE_FINGER_INDENT_DEPTH )
    .cubicCurveToRelative(
      sign * ( GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH - controlPoint2X ),
      sign * -controlPoint1Y,
      sign * ( GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH - controlPoint1X ),
      sign * -controlPoint2Y,
      sign * GRIP_SINGLE_FINGER_INDENT_HALF_WIDTH,
      sign * -GRIP_SINGLE_FINGER_INDENT_DEPTH );
}

sceneryPhet.register( 'HandleNode', HandleNode );