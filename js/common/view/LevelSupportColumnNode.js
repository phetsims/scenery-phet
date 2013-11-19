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
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  function LevelSupportColumnNode( mvt, levelSupportColumn, columnState ) {
    Node.call( this );
    var columnNode = new Path( mvt.modelToViewShape( levelSupportColumn.shape ), { fill: 'green' } );
    this.addChild( columnNode );

    columnState.link( function( state ) {
      columnNode.visible = state === 'doubleColumns';
    } )
  }

  return inherit( Node, LevelSupportColumnNode );
} );

