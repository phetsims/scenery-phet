// Copyright 2002-2012, University of Colorado

/*
 * The front of a bucket (does not include the hole)
 */
define( function( require ) {
  
  var Inheritance = require( 'PHETCOMMON/util/Inheritance' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );

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

    var transformedShape = mvt.modelToViewShape( bucket.containerShape );
    var baseColor = new Color( bucket.baseColor );
    var frontGradient = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 );
    frontGradient.addColorStop( 0, baseColor.brighterColor( 0.5 ).getCSS() );
    frontGradient.addColorStop( 1, baseColor.darkerColor( 0.5 ).getCSS() );
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
    this.x = mvt.modelToViewPosition( bucket.position ).x;
    this.y = mvt.modelToViewPosition( bucket.position ).y;
  };

  // Inherit from base type.
  Inheritance.inheritPrototype( BucketFront, Node );
  
  return BucketFront;
} );
