// Copyright 2002-2015, University of Colorado Boulder

/**
 * Alternative to MovableDragHandler which:
 * (a) moves a Node instead of a Property.<Vector2>
 * (b) Uses a Property.<Bounds2> for the draggable bounds rather than a static Bounds2
 *
 * Used by ToolListener
 *
 * I would have really liked to extend MovableDragHandler, but I cannot see how to create the correct
 * Property.<Vector2> without having the Node passed in to the arguments, and it would be best to avoid having the
 * node passed into the arguments.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Events = require( 'AXON/Events' );

  /**
   * @param {Property.<Bounds2>} boundsProperty - where the node can be dragged
   * @param {Object} [options]
   * @constructor
   */
  function BoundedDragHandler( boundsProperty, options ) {

    var self = this;

    // Events for signifying when processing callbacks starts/ends
    this.events = new Events();

    options = _.extend( {
      startDrag: function( event ) {},  // use this to do something at the start of dragging, like moving a node to the foreground
      endDrag: function( event ) {},  // use this to do something at the end of dragging, like 'snapping'
      onDrag: function( event ) {} // use this to do something every time drag is called, such as notify that a user has modified the position
    }, options );

    this._dragBounds = options.dragBounds.copy(); // @private
    this._modelViewTransform = options.modelViewTransform; // @private

    var startOffset; // where the drag started relative to locationProperty, in parent view coordinates

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      // note where the drag started
      start: function( event ) {

        self.events.trigger1( 'startedCallbacksForDragStarted' );

        options.startDrag( event );

        // Note the options.startDrag can change the locationProperty, so read it again above, see https://github.com/phetsims/scenery-phet/issues/157
        var location = event.currentTarget.translation;
        startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );

        self.events.trigger0( 'endedCallbacksForDragStarted' );
      },

      // change the location, adjust for starting offset, constrain to drag bounds
      drag: function( event ) {

        var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
        var location = self._modelViewTransform.viewToModelPosition( parentPoint );
        location = self._dragBounds.closestPointTo( location );
        self.events.trigger1( 'startedCallbacksForDragged', location );

        options.onDrag( event );

        self.events.trigger0( 'endedCallbacksForDragged' );
      },

      end: function( event ) {
        options.endDrag( event );
        self.events.trigger0( 'endedCallbacksForDragEnded' );
      }
    } );
  }

  return inherit( SimpleDragHandler, BoundedDragHandler );
} );
