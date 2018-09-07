// Copyright 2018, University of Colorado Boulder

/**
 * Depicts a draggable meter node with an arbitrary number of probes which can optionally travel with the meter.
 * This type is also set up for usage in a toolbox, including dragging out of a toolbox and dropping back in a toolbox.
 * Migrated from wave-interference on Aug 21, 2018, see https://github.com/phetsims/wave-interference/issues/24
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Node} backgroundNode - node that is shown for the main body
   * @param {DragListener} dragListener
   * @param {Object} [options]
   * @constructor
   */
  function MeterBodyNode( backgroundNode, dragListener, options ) {
    Node.call( this );

    // @private {Node} - shows the background for the MeterBodyNode.  Any attached probes or other supplemental nodes
    // should not be children if the backgroundNode if they need to translate independently
    this.backgroundNode = backgroundNode;

    // @private
    this.backgroundDragListener = dragListener;
    this.backgroundNode.addInputListener( this.backgroundDragListener );
    this.addChild( this.backgroundNode );

    // Mutate after backgroundNode is added as a child
    this.mutate( options );
  }

  inherit( Node, MeterBodyNode, {

    /**
     * Gets the region of the background in global coordinates.  This can be used to determine if the MeterBodyNode should
     * be dropped back in a toolbox.
     * @returns {Bounds2}
     */
    getBackgroundNodeGlobalBounds: function() {
      return this.localToGlobalBounds( this.backgroundNode.bounds );
    },

    /**
     * Forward an event from the toolbox to start dragging the node in the play area.  This triggers the probes (if any)
     * to drag together with the MeterBodyNode.  This is accomplished by calling this.alignProbes() at each drag event.
     * @param {Object} event
     */
    startDrag: function( event ) {

      // Forward the event to the drag listener
      this.backgroundDragListener.press( event, this.backgroundNode );
    }
  } );

  return sceneryPhet.register( 'MeterBodyNode', MeterBodyNode );
} );