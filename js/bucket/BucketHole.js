// Copyright 2013-2018, University of Colorado Boulder

/*
 * The hole of a bucket
 *
 * @author Jonathan Olson
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Bucket} bucket - Model of a bucket, type definition found in phetcommon/model as of this writing.
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BucketHole( bucket, modelViewTransform, options ) {

    Node.call( this, options );

    var scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
    var transformedShape = bucket.holeShape.transformed( scaleMatrix );
    var gradientPaint = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 );
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

  sceneryPhet.register( 'BucketHole', BucketHole );

  return inherit( Node, BucketHole );
} );
