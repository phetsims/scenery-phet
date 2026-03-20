// Copyright 2013-2026, University of Colorado Boulder

/**
 * The front of a bucket (does not include the hole)
 *
 * @author Jonathan Olson
 */

import Matrix3 from '../../../dot/js/Matrix3.js';
import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Bucket from '../../../phetcommon/js/model/Bucket.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import InteractiveHighlighting from '../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import PaintColorProperty from '../../../scenery/js/util/PaintColorProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  labelNode?: Node;

  // Luminance values for the left and right sides of the gradient fill.  These values are relative to the base color
  // and can be used to adjust the appearance of the gradient.  Values must be from -1 to 1.
  gradientLuminanceLeft?: number;
  gradientLuminanceRight?: number;
};

export type BucketFrontOptions = SelfOptions & NodeOptions;

export default class BucketFront extends InteractiveHighlighting( Node ) {

  public readonly bucket: Bucket; // public for a11y purposes
  private labelNode: Node;
  private readonly disposeBucketFront: () => void;

  // Whether this instance created the labelNode, which determines whether it is responsible for disposing it.
  private labelNodeCreated = false;

  // Container for the label, so that we can keep it centered on the bucket.
  private labelContainer = new Node();

  public constructor( bucket: Bucket,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: BucketFrontOptions ) {

    const options = optionize<BucketFrontOptions, StrictOmit<SelfOptions, 'labelNode'>, NodeOptions>()( {
      gradientLuminanceLeft: 0.5,
      gradientLuminanceRight: -0.5,
      cursor: 'pointer',
      tandemNameSuffix: 'BucketFrontNode',
      tandem: Tandem.OPT_OUT
    }, providedOptions );

    super();

    // If the client didn't provide a label for the bucket, create one.
    if ( !options.labelNode ) {
      options.labelNode = new Text( bucket.captionText, {
        font: new PhetFont( 20 ),
        fill: bucket.captionColor,
        pickable: false,
        tandem: options.tandem.createTandem( 'labelText' )
      } );
      this.labelNodeCreated = true;
    }

    this.bucket = bucket;

    // shape
    const scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
    const transformedShape = bucket.containerShape.transformed( scaleMatrix );

    // fill
    const baseLeftSidePaintProperty = new PaintColorProperty( bucket.baseColor, {
      luminanceFactor: options.gradientLuminanceLeft
    } );
    const baseRightSidePaintProperty = new PaintColorProperty( bucket.baseColor, {
      luminanceFactor: options.gradientLuminanceRight
    } );
    const frontGradient = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 )
      .addColorStop( 0, baseLeftSidePaintProperty )
      .addColorStop( 1, baseRightSidePaintProperty );

    this.addChild( new Path( transformedShape, {
      fill: frontGradient
    } ) );

    this.addChild( this.labelContainer );

    // Keep the label centered on the bucket.
    this.labelContainer.boundsProperty.lazyLink( () => {
      this.labelNode.center = this.localBounds.center;
    } );

    // Set the initial label.
    this.labelNode = options.labelNode;
    this.setLabel( this.labelNode );

    // Set initial position.
    this.translation = modelViewTransform.modelToViewPosition( bucket.position );

    this.mutate( options );

    this.disposeBucketFront = () => {
      this.labelNodeCreated && this.labelNode.dispose();
      this.labelContainer.dispose();
      baseLeftSidePaintProperty.dispose();
      baseRightSidePaintProperty.dispose();
    };
  }

  /**
   * Set a scenery node to appear in front of the bucket.
   */
  public setLabel( labelNode: Node ): void {

    if ( this.labelContainer.hasChild( this.labelNode ) ) {
      this.labelContainer.removeChild( this.labelNode );
      this.labelNodeCreated && this.labelNode.dispose();
    }

    this.labelNode = labelNode;
    this.labelNode.maxWidth = this.width * 0.8;
    this.labelNode.maxHeight = this.height;
    this.labelContainer.addChild( this.labelNode );
    this.labelNodeCreated = false;
  }

  public override dispose(): void {
    this.disposeBucketFront();
    super.dispose();
  }
}

sceneryPhet.register( 'BucketFront', BucketFront );