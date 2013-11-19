// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that represents a support column with a flat top in the view.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  function LevelSupportColumnNode( mvt, levelSupportColumn, columnState ) {
    Node.call( this );

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
    this.addChild( columnNode );

    columnState.link( function( state ) {
      columnNode.visible = state === 'doubleColumns';
    } )
  }

  return inherit( Node, LevelSupportColumnNode );
} );

