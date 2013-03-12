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
  var Matrix3 = require( 'DOT/Matrix3' );
  
  var BucketHole = function( bucket ) {
    Node.call( this );
    
    var gradientPaint = new LinearGradient( -bucket.size.width / 2, 0, bucket.size.width / 2, 0 );
    gradientPaint.addColorStop( 0, 'black' );
    gradientPaint.addColorStop( 1, '#c0c0c0' );
    
    this.addChild( new Path( {
      shape: bucket.holeShape,
      // shape: bucket.holeShape.transformed( Matrix3.Y_REFLECTION ),
      fill: gradientPaint,
      stroke: '#777',
      lineWidth: 1
    } ) );
    
    this.x = bucket.position.x;
    this.y = bucket.position.y;
  };
  
  Inheritance.inheritPrototype( BucketHole, Node );
  
  return BucketHole;
} );
