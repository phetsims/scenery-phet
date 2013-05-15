// Copyright 2002-2012, University of Colorado

/*
 * The front of a bucket (does not include the hole)
 */
define( function( require ) {
  'use strict';
  
  var Inheritance = require( 'PHETCOMMON/util/Inheritance' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

  /**
   * Constructor.
   *
   * @param bucket Model of a bucket.
   * @param mvt Model-View transform.
   * @constructor
   */
  var BucketFront = function( bucket, mvt ) {

    // Invoke super constructor.
    Node.call( this );

    // TODO: scaleOnlyTransform is kind of weird, discuss with rest of team.
    var scaleOnlyTransform = ModelViewTransform2.createOffsetXYScaleMapping( { x: 0, y: 0 }, mvt.getMatrix().m00(), mvt.getMatrix().m11() );
    var transformedShape = scaleOnlyTransform.modelToViewShape( bucket.containerShape );
    var baseColor = new Color( bucket.baseColor );
    var frontGradient = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 );
    frontGradient.addColorStop( 0, baseColor.brighterColor( 0.5 ).toCSS() );
    frontGradient.addColorStop( 1, baseColor.darkerColor( 0.5 ).toCSS() );
    this.addChild( new Path( {
      shape: transformedShape,
      fill: frontGradient
    } ) );
    
    // Create and add the label, centered on the front.
    this.addChild( new Text( bucket.captionText, {
      font: "bold 18px Arial",
      fill: bucket.captionColor,
      centerX: transformedShape.bounds.getCenterX(),
      centerY: transformedShape.bounds.getCenterY()
    } ) );

    // Set initial position.
    this.translation = mvt.modelToViewPosition( bucket.position );
  };

  // Inherit from base type.
  Inheritance.inheritPrototype( BucketFront, Node );
  
  return BucketFront;
} );
