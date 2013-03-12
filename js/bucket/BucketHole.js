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
    
    this.addChild( new Path( {
      shape: bucket.holeShape,
      fill: 'black',
      stroke: 'black',
      lineWidth: 2
    } ) );
    
    this.x = bucket.position.x;
    this.y = bucket.position.y;
  };
  
  Inheritance.inheritPrototype( BucketHole, Node );
  
  return BucketHole;
} );
