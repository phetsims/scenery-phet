// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that represents a single-ended arrow.
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var ArrowShape = require( 'SCENERY_PHET/ArrowShape' );
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} options
   * @constructor
   */
  function ArrowNode( tailX, tailY, tipX, tipY, options ) {

    // default options
    options = _.extend( {
      headHeight: 10,
      headWidth: 10,
      tailWidth: 5,
      fill: 'black',
      stroke: 'black',
      lineWidth: 1
    }, options );

    // things you're likely to mess up, add more as needed
    assert && assert( options.headWidth > options.tailWidth );

    // shape is not an option that the client should be able to set
    options.shape = new ArrowShape( tailX, tailY, tipX, tipY, options.tailWidth, options.headWidth, options.headHeight );
    var arrowNode = new Path( options );

    // wrap in a Node so that clients can't set Path.shape (yes, someone did this)
    Node.call( this, options );
    this.addChild( arrowNode );
  }

  return inherit( Node, ArrowNode );
} );