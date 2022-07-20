// Copyright 2013-2022, University of Colorado Boulder

/*
 * The hole of a bucket
 *
 * @author Jonathan Olson
 */

import Bucket from '../../../phetcommon/js/model/Bucket.js';
import Matrix3 from '../../../dot/js/Matrix3.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { LinearGradient, Node, NodeOptions, Path } from '../../../scenery/js/imports.js';
import sceneryPhet from '../sceneryPhet.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type BucketHoleOptions = SelfOptions & NodeOptions;

export default class BucketHole extends Node {

  public constructor( bucket: Bucket, modelViewTransform: ModelViewTransform2, providedOptions?: BucketHoleOptions ) {

    super( providedOptions );

    const scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
    const transformedShape = bucket.holeShape.transformed( scaleMatrix );
    const gradientPaint = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 );
    gradientPaint.addColorStop( 0, 'black' );
    gradientPaint.addColorStop( 1, '#c0c0c0' );

    this.addChild( new Path( transformedShape, {
      fill: gradientPaint,
      stroke: '#777',
      lineWidth: 1
    } ) );

    // Set initial position.
    this.translation = modelViewTransform.modelToViewPosition( bucket.position );
  }
}

sceneryPhet.register( 'BucketHole', BucketHole );