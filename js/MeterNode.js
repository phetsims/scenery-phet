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
  var DragListener = require( 'SCENERY/listeners/DragListener' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Node} backgroundNode - node that is shown for the main body
   * @param {Object} [options]
   * @constructor
   */
  function MeterNode( backgroundNode, options ) {

    var self = this;
    options = _.extend( {

      // This function is called when the a wave detector drag ends.  It can be used to drop it back into a toolbox.
      end: function() {}
    }, options );
    Node.call( this );

    // @private {boolean} - true if dragging the MeterNode also causes attached probes to translate.
    // This is accomplished by calling alignProbes() on drag start and each drag event.
    this.synchronizeProbeLocations = false;

    // @private {Node} - shows the background for the MeterNode.  Any attached probes or other supplemental nodes
    // should not be children if the backgroundNode if they need to translate independently
    this.backgroundNode = backgroundNode;

    // @private
    this.backgroundDragListener = new DragListener( {
      translateNode: true,
      start: function() {
        if ( self.synchronizeProbeLocations ) {

          // Align the probes when the drag begins.
          self.alignProbes();
        }
      },
      drag: function() {
        if ( self.synchronizeProbeLocations ) {

          // Align the probes each time the MeterNode translates, so they will stay in sync
          self.alignProbes();
        }
      },
      end: function() {
        options.end();
        self.synchronizeProbeLocations = false;
      }
    } );
    this.backgroundNode.addInputListener( this.backgroundDragListener );
    this.addChild( this.backgroundNode );

    // @public (listen-only) {Emitter}
    this.alignProbesEmitter = new Emitter();

    this.alignProbes();

    // Mutate after backgroundNode is added as a child
    this.mutate( options );
  }

  inherit( Node, MeterNode, {

    /**
     * Put the probes into their standard position relative to the graph body.  Clients can override this method
     * or listen to the alignProbesEmitter.
     * @public
     */
    alignProbes: function() {
      this.alignProbesEmitter.emit();
    },

    /**
     * Gets the region of the background in global coordinates.  This can be used to determine if the MeterNode should
     * be dropped back in a toolbox.
     * @returns {Bounds2}
     */
    getBackgroundNodeGlobalBounds: function() {
      return this.localToGlobalBounds( this.backgroundNode.bounds );
    },

    /**
     * Forward an event from the toolbox to start dragging the node in the play area.  This triggers the probes (if any)
     * to drag together with the MeterNode.  This is accomplished by calling this.alignProbes() at each drag event.
     * @param {Object} event
     */
    startDrag: function( event ) {

      // Set the internal flag that indicates the probes should remain in alignment during the drag
      this.synchronizeProbeLocations = true;

      // Forward the event to the drag listener
      this.backgroundDragListener.press( event, this.backgroundNode );
    }
  } );

  return sceneryPhet.register( 'MeterNode', MeterNode );
} );