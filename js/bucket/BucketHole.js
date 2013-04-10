// Copyright 2002-2012, University of Colorado

/*
 * The hole of a bucket
 */
define( function ( require ) {

  var Inheritance = require( 'PHETCOMMON/util/Inheritance' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Shape = require( 'KITE/Shape' );

  var BucketHole = function ( bucket, mvt ) {
    Node.call( this );

    var transformedShape = mvt.modelToViewShape( bucket.holeShape );
    var gradientPaint = new LinearGradient( transformedShape.bounds.getMinX(), 0, transformedShape.bounds.getMaxX(), 0 );
    gradientPaint.addColorStop( 0, 'black' );
    gradientPaint.addColorStop( 1, '#c0c0c0' );

    this.addChild( new Path( {
                               shape: transformedShape,
                               fill: gradientPaint,
                               stroke: '#777',
                               lineWidth: 1
                             } ) );

    // Set initial position.
    this.x = mvt.modelToViewPosition( bucket.position ).x;
    this.y = mvt.modelToViewPosition( bucket.position ).y;
  };

  Inheritance.inheritPrototype( BucketHole, Node );

  return BucketHole;
} );
