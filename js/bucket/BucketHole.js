// Copyright 2013-2020, University of Colorado Boulder

/*
 * The hole of a bucket
 *
 * @author Jonathan Olson
 */

import Matrix3 from '../../../dot/js/Matrix3.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import sceneryPhet from '../sceneryPhet.js';

class BucketHole extends Node {

  /**
   * @param {Bucket} bucket - Model of a bucket, type definition found in phetcommon/model as of this writing.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( bucket, modelViewTransform, options ) {

    super( options );

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
export default BucketHole;