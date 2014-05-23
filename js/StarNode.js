//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var Line = require( 'KITE/segments/Line' );
  var StarShape = require( 'SCENERY_PHET/StarShape' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param options
   * @constructor
   */
  function StarNode( options ) {

    options = _.extend( {

      //The amount the star is filled.  0=empty, 1=full
      value: 1,

      //Distance from the center to the tip of a star limb
      outerRadius: 20,

      //Distance from the center to the closest point on the exterior of the star.  Sets the "thickness" of the star limbs
      innerRadius: 10,

      // a bold yellow indeed
      filledFill: '#fcff03',
      filledStroke: 'black',
      filledLineWidth: 3,
      filledLineJoin: 'round',

      emptyFill: 'white',
      emptyStroke: 'gray',
      emptyLineWidth: 3,
      emptyLineJoin: 'round'
    }, options );

    Node.call( this );

    //Add the gray star behind the filled star, so it will look like it fills in
    var o2 = _.clone( options );
    o2.value = 1;
    this.addChild( new Path( new StarShape( o2 ), {
      stroke: options.emptyStroke,
      fill: options.emptyFill,
      lineWidth: options.emptyLineWidth,
      lineJoin: options.emptyLineJoin
    } ) );

    this.addChild( new Path( new StarShape( options ), {
      stroke: options.filledStroke,
      fill: options.filledFill,
      lineWidth: options.filledLineWidth,
      lineJoin: options.filledLineJoin
    } ) );

    this.mutate( options );
  }

  return inherit( Node, StarNode );
} );