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
    
    var width = bucket.width;
    var height = bucket.height;
    
    // .beginLinearGradientFill( ["white", bucket.color, "gray" ], [.05, .9, 1], 0, 0, width, 0 )
    var frontGradient = new LinearGradient( -width / 2, 0, width / 2, 0 );
    frontGradient.addColorStop( 0.05, 'white' );
    frontGradient.addColorStop( 0.9, bucket.color );
    frontGradient.addColorStop( 1, 'gray' );
    
    // Create the basic shape of the front of the bucket.
    var shape = new Shape();
    
    // the main container shape
    this.addChild( new Path( {
      shape: bucket.containerShape,
      stroke: 'black',
      lineWidth: 2,
      fill: frontGradient
    } ) );
    
    // Create and add the label, centered on the front.
    this.addChild( new Text( bucket.labelText, {
      font: "bold 24px Helvetica",
      fill: "white",
      centerX: width / 2,
      centerY: height / 2
    } ) );
    
    this.x = bucket.position.x;
    this.y = bucket.position.y;
  };
  
  Inheritance.inheritPrototype( BucketFront, Node );
  
  return BucketFront;
} );
