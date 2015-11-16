// Copyright 2014-2015, University of Colorado Boulder

/**
 * Star that fills in from left to right.  Can be used in games to show the score.
 *
 * @author Sam Reid
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var StarShape = require( 'SCENERY_PHET/StarShape' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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

    // add the gray star behind the filled star, so it will look like it fills in
    var backgroundStar = new Path( null, {
      stroke: options.emptyStroke,
      fill: options.emptyFill,
      lineWidth: options.emptyLineWidth,
      lineJoin: options.emptyLineJoin,
      boundsMethod: 'none' // optimization for faster creation and usage
    } );
    var o2 = _.clone( options );
    o2.value = 1;
    var backgroundStarShape = new StarShape( o2 );
    backgroundStar.setShape( backgroundStarShape );
    function getBounds() {
      return backgroundStarShape.bounds;
    }

    backgroundStar.computeShapeBounds = getBounds; // optimization - override bounds calculation to used pre-computed value

    this.addChild( backgroundStar );

    // add the foreground star
    var foregroundStar = new Path( new StarShape( options ), {
      stroke: options.filledStroke,
      fill: options.filledFill,
      lineWidth: options.filledLineWidth,
      lineJoin: options.filledLineJoin,
      boundsMethod: 'none' // optimization for faster creation and usage
    } );
    foregroundStar.computeShapeBounds = getBounds; // optimization - override bounds calculation to used pre-computed value
    foregroundStar.shape = new StarShape( options );
    this.addChild( foregroundStar );

    this.mutate( options );
  }

  sceneryPhet.register( 'StarNode', StarNode );

  return inherit( Node, StarNode );
} );