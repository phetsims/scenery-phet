// Copyright 2013, University of Colorado

/**
 * Scenery node that looks like a single-ended arrow.
 *
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var inherit = require( "PHET_CORE/inherit" );
  var Node = require( "SCENERY/nodes/Node" );
  var Path = require( "SCENERY/nodes/Path" );
  var Shape = require( "KITE/Shape" );
  var Vector2 = require( "DOT/Vector2" );
  var Rectangle = require( "SCENERY/nodes/Rectangle" );

  /**
   * @param {Vector2} tailLocation
   * @param {Vector2} tipLocation
   * @param {number} headWeight
   * @param {number} headWidth
   * @param {number} tailWidth
   * @constructor
   */
  function ArrowNode( tailLocation, tipLocation, headWeight, headWidth, tailWidth, options ) {

    this.tailLocation = tailLocation;
    this.tipLocation = tipLocation;
    this.headWeight = headWeight;
    this.headWidth = headWidth;
    this.tailWidth = tailWidth;

    // default options
    options = _.extend(
        {
          fill: 'black',
          stroke: 'black',
          lineWidth: 1
        }, options );

    // things you're likely to mess up, add more as needed
//    assert && assert( headWidth > tailWidth );

    Node.call( this, options );

    this.path = new Path( options );
    this.addChild( this.path );
//    var shape = new Shape();
//    shape.moveTo( 0, 0 );
//    shape.lineTo( 0, 50 );
//    shape.lineTo( 50, 50 );
//    shape.close();
//    this.path = new Path( options );
//    this.path.shape = shape;
    this.addChild( this.path );
    this.updateShape();
  }

  inherit( Node, ArrowNode, {
    updateShape: function(){
      this.path.shape = new Shape().moveTo( this.tailLocation.x, this.tailLocation.y ).lineTo( this.tipLocation.x, this.tipLocation.y );
      this.addChild( this.path );
    }
  } );

  return ArrowNode;
} );
