// Copyright 2002-2012, University of Colorado

/*
 * The front of a bucket (does not include the hole)
 */
define( function( require ) {
  
  var Inheritance = require( 'PHETCOMMON/util/Inheritance' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );
  
  var BucketFront = function( bucket ) {
    Node.call( this );
    
    this.initialize( bucket );
  };
  
  BucketFront.initialize = function( bucket ) {
    this.bucket = bucket;
    
    var width = this.bucket.width;
    var height = width * 0.5; // Determined empirically for best look.
    
    // .beginLinearGradientFill( ["white", bucket.color, "gray" ], [.05, .9, 1], 0, 0, width, 0 )
    var frontGradient = new LinearGradient( 0, 0, width, 0 );
    frontGradient.addColorStop( 0.05, 'white' );
    frontGradient.addColorStop( 0.9, bucket.color );
    frontGradient.addColorStop( 1, 'gray' );
    
    // Create the basic shape of the front of the bucket.
    var shape = new Shape();
    
    // TODO: elliptical curve for best view? or use cubic from Java
    this.addChild( new Path( {
      stroke: 'black',
      lineWidth: 2,
      fill: frontGradient,
      shape: new Shape().moveTo( 0, 0 )
                        .lineTo( width * 0.1, height * 0.8 )
                        .quadraticCurveTo( width / 2, height * 1.0, width * 0.9, height * 0.8 )
                        .lineTo( width, 0 )
                        .quadraticCurveTo( width / 2, height * 0.2, 0, 0 )
                        .close()
    } ) );
    
    // Create and add the label, centered on the front.
    this.addChild( new Text( this.bucket.labelText, {
      font: "bold 24px Helvetica",
      fill: "white",
      centerX: width / 2,
      centerY: height / 2
    } ) );
    
    // Set the position.
    var topCenter = new Vector2( this.bucket.x, this.bucket.y );
    this.x = topCenter.x;
    this.y = topCenter.y;
  };
  
  Inheritance.inheritPrototype( BucketFront, Node );
  
  return BucketFront;
} );
