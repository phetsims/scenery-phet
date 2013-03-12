// Copyright 2002-2012, University of Colorado

/*
 * The hole of a bucket
 */
define( function( require ) {
  
  var Inheritance = require( 'PHETCOMMON/util/Inheritance' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );
  
  var BucketHole = function( bucket ) {
    Node.call( this );
    this.bucket = bucket;
    
    var width = this.bucket.width;
    var height = width * 0.2;
    var center = new Vector2( this.bucket.x, this.bucket.y );
    
    this.addChild( new Path( {
      shape: Shape.ellipse( 0, 0, width, height ),
      fill: 'black',
      stroke: 'black',
      lineWidth: 2
    } ) );
    
    this.centerX = this.bucket.x;
    this.centerY = this.bucket.y;
    // this.x = center.x - width / 2;
    // this.y = center.y;
  };
  
  Inheritance.inheritPrototype( BucketFront, Node );
  
  return BucketHole;
} );
