// Copyright 2013-2022, University of Colorado Boulder

/*
 * The front of a bucket (does not include the hole)
 *
 * @author Jonathan Olson
 */

import Bucket from '../../../phetcommon/js/model/Bucket.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Matrix3 from '../../../dot/js/Matrix3.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { LinearGradient, Node, NodeOptions, PaintColorProperty, Path, Text } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import optionize from '../../../phet-core/js/optionize.js';

type SelfOptions = {
  labelNode?: Node;
};

export type BucketFrontOptions = SelfOptions & NodeOptions;

export default class BucketFront extends Node {

  public readonly bucket: Bucket; // public (a11y)
  private labelNode: Node;
  private readonly disposeBucketFront: () => void;

  public constructor( bucket: Bucket, modelViewTransform: ModelViewTransform2, providedOptions?: BucketFrontOptions ) {

    const options = optionize<BucketFrontOptions, StrictOmit<SelfOptions, 'labelNode'>, NodeOptions>()( {
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'BucketFrontNode',
      cursor: 'pointer'
    }, providedOptions );

    super();

    // If the client didn't provide a label for the bucket, create one.
    if ( !options.labelNode ) {

      //TODO https://github.com/phetsims/scenery-phet/issues/732 BuckFront owns this instance, and must dispose it
      options.labelNode = new Text( bucket.captionText, {
        font: new PhetFont( 20 ),
        fill: bucket.captionColor,
        tandem: options.tandem.createTandem( 'labelText' )
      } );
    }

    this.bucket = bucket;

    // shape
    const scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
    const transformedShape = bucket.containerShape.transformed( scaleMatrix );

    // fill
    const baseBrighter5Property = new PaintColorProperty( bucket.baseColor, { luminanceFactor: 0.5 } );
    const baseDarker5Property = new PaintColorProperty( bucket.baseColor, { luminanceFactor: -0.5 } );
    const frontGradient = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 )
      .addColorStop( 0, baseBrighter5Property )
      .addColorStop( 1, baseDarker5Property );

    this.addChild( new Path( transformedShape, {
      fill: frontGradient
    } ) );

    this.labelNode = options.labelNode;
    this.setLabel( this.labelNode );

    // Set initial position.
    this.translation = modelViewTransform.modelToViewPosition( bucket.position );

    this.mutate( options );

    this.disposeBucketFront = () => {

      //TOO https://github.com/phetsims/scenery-phet/issues/732 if BucketFront didn't create labelNode, then it should not be disposing it here
      this.labelNode && this.labelNode.dispose();
      baseBrighter5Property.dispose();
      baseDarker5Property.dispose();
    };
  }

  /**
   * Set a scenery node to appear in front of the bucket.
   */
  public setLabel( labelNode: Node ): void {

    if ( this.hasChild( this.labelNode ) ) {

      //TODO https://github.com/phetsims/scenery-phet/issues/732 memory leak - if BucketFront created this instance of labelNode, it needs to dispose it
      this.removeChild( this.labelNode );
    }

    if ( labelNode ) {
      this.labelNode = labelNode;
      this.labelNode.maxWidth = this.width * 0.8;
      this.labelNode.maxHeight = this.height;
      this.labelNode.center = this.localBounds.center;
      this.addChild( this.labelNode );
    }
  }

  public override dispose(): void {
    this.disposeBucketFront();
    super.dispose();
  }
}

sceneryPhet.register( 'BucketFront', BucketFront );