// Copyright 2002-2013, University of Colorado Boulder

/*
 * The front of a bucket (does not include the hole)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );

  /**
   * Constructor.
   *
   * @param bucket Model of a bucket.
   * @param mvt Model-View transform.
   * @constructor
   */
  var BucketFront = function BucketFront( bucket, mvt ) {

    // Invoke super constructor.
    Node.call( this );

    var scaleMatrix = Matrix3.scaling( mvt.getMatrix().m00(), mvt.getMatrix().m11() );
    var transformedShape = bucket.containerShape.transformed( scaleMatrix );
    var baseColor = new Color( bucket.baseColor );
    var frontGradient = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 );
    frontGradient.addColorStop( 0, baseColor.colorUtilsBrighter( 0.5 ).toCSS() );
    frontGradient.addColorStop( 1, baseColor.colorUtilsDarker( 0.5 ).toCSS() );
    this.addChild( new Path( transformedShape, {
      fill: frontGradient
    } ) );

    // Create and add the label, centered on the front.
    this.addChild( new Text( bucket.captionText, {
      font: 'bold 18px Arial',
      fill: bucket.captionColor,
      centerX: transformedShape.bounds.getCenterX(),
      centerY: transformedShape.bounds.getCenterY(),
      renderer: 'svg'
    } ) );

    // Set initial position.
    this.translation = mvt.modelToViewPosition( bucket.position );
  };

  // Inherit from base type.
  inherit( Node, BucketFront );

  return BucketFront;
} );
