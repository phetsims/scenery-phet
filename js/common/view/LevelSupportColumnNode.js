// Copyright 2013-2015, University of Colorado Boulder

/**
 * Node that represents a support column with a flat top in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param mvt
   * @param levelSupportColumn
   * @param columnState
   * @constructor
   */
  function LevelSupportColumnNode( mvt, levelSupportColumn, columnState ) {
    Node.call( this );
    var thisNode = this;

    // Create and add the main body of the column.
    var transformedColumnShape = mvt.modelToViewShape( levelSupportColumn.shape );
    var mainBodyGradient = new LinearGradient( transformedColumnShape.bounds.minX, 0, transformedColumnShape.bounds.maxX, 0 ).
      addColorStop( 0, 'rgb( 150, 150, 150 )' ).
      addColorStop( 0.25, 'rgb( 230, 230, 230 )' ).
      addColorStop( 0.65, 'rgb( 150, 150, 150 )' ).
      addColorStop( 1, 'rgb( 200, 200, 200 )' );

    var columnNode = new Path( transformedColumnShape,
      {
        fill: mainBodyGradient,
        stroke: 'black',
        lineWidth: 1
      } );
    thisNode.addChild( columnNode );

    // Create and add the column support.
    var supportWidth = transformedColumnShape.bounds.width * 1.3; // Empirically determined.
    var supportHeight = transformedColumnShape.bounds.height * 0.15; // Empirically determined.
    var supportGradient = new LinearGradient( transformedColumnShape.bounds.centerX - supportWidth / 2, 0, transformedColumnShape.bounds.centerX + supportWidth / 2, 0 ).
      addColorStop( 0, 'rgb( 150, 150, 150 )' ).
      addColorStop( 0.25, 'rgb( 210, 210, 210 )' ).
      addColorStop( 0.65, 'rgb( 150, 150, 150 )' ).
      addColorStop( 1, 'rgb( 170, 170, 170 )' );
    var columnSupportNode = new Rectangle(
      transformedColumnShape.bounds.centerX - supportWidth / 2,
      transformedColumnShape.bounds.maxY - supportHeight,
      supportWidth,
      supportHeight,
      3,
      3,
      {
        fill: supportGradient,
        stroke: 'black',
        lineWidth: 1
      } );
    thisNode.addChild( columnSupportNode );

    columnState.link( function( state ) {
      thisNode.visible = state === 'doubleColumns';
    } );
  }

  return inherit( Node, LevelSupportColumnNode );
} );

