//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var StarShape = require( 'SCENERY_PHET/StarShape' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Object} [options] see comments in the constructor for options parameter values
   * @constructor
   */
  function StarNode( options ) {

    options = _.extend( {

      //See StarShape for the other options, including:
      // value
      // outerRadius
      // innerRadius

      // Fill parameters for the part of the star that is filled in.  Should be bold and gold.
      filledFill: '#fcff03',
      filledStroke: 'black',
      filledLineWidth: 1.5,
      filledLineJoin: 'round',

      // Fill parameters for the part of the star that is unfilled.  Should be bland.
      emptyFill: '#e1e1e1', //pretty gray
      emptyStroke: '#d3d1d1 ',//darker gray than the fill, but still pretty faint
      emptyLineWidth: 1.5,
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