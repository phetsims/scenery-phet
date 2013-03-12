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
  var Matrix3 = require( 'DOT/Matrix3' );
  
  var BucketFront = function( bucket ) {
    Node.call( this );
    
    var width = bucket.size.width;
    var height = bucket.size.height;

    var frontGradient = new LinearGradient( -width / 2, 0, width / 2, 0 );
    var baseColor = new Color( bucket.baseColor );
    frontGradient.addColorStop( 0, baseColor.brighterColor( 0.5 ).getCSS() );
    frontGradient.addColorStop( 1, baseColor.darkerColor( 0.5 ).getCSS() );
    
    // Create the basic shape of the front of the bucket.
    var shape = new Shape();
    
    // the main container shape
    this.addChild( new Path( {
      shape: bucket.containerShape.transformed( Matrix3.Y_REFLECTION ),
      fill: frontGradient
    } ) );
    
    // Create and add the label, centered on the front.
    this.addChild( new Text( bucket.captionText, {
      font: "bold 18px Arial",
      fill: 'black',
      centerX: 0,
      centerY: height / 2
    } ) );
    
    this.x = bucket.position.x;
    this.y = bucket.position.y;
  };
  
  Inheritance.inheritPrototype( BucketFront, Node );
  
  return BucketFront;
} );
