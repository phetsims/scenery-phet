// Copyright 2002-2013, University of Colorado Boulder

/**
 * A drag handler for something has a location and is constrained to some (optional) bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Events = require( 'AXON/Events' );

  /**
   * @param {Property.<Vector2>} locationProperty - in model coordinate frame
   * @param {Object} [options]
   * @constructor
   */
  function MovableDragHandler( locationProperty, options ) {

    var self = this;

    // Events for signifying when processing callbacks starts/ends
    this.events = new Events();

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging will be constrained to these bounds, in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity(), // {ModelViewTransform2} defaults to identity
      startDrag: function( event ) {},  // use this to do something at the start of dragging, like moving a node to the foreground
      endDrag: function( event ) {},  // use this to do something at the end of dragging, like 'snapping'
      onDrag: function( event ) {} // use this to do something every time drag is called, such as notify that a user has modified the position
    }, options );

    this.locationProperty = locationProperty; // @private
    this._dragBounds = options.dragBounds.copy(); // @private
    this._modelViewTransform = options.modelViewTransform; // @private

    var startOffset; // where the drag started relative to locationProperty, in parent view coordinates

    // @private - note where the drag started
    this.movableDragHandlerStart = function( event ) {

      self.events.trigger1( 'startedCallbacksForDragStarted', locationProperty.get() );

      options.startDrag( event );

      // Note the options.startDrag can change the locationProperty, so read it again above, see https://github.com/phetsims/scenery-phet/issues/157
      var location = self._modelViewTransform.modelToViewPosition( locationProperty.get() );
      startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );

      self.events.trigger0( 'endedCallbacksForDragStarted' );
    };

    // @private - change the location, adjust for starting offset, constrain to drag bounds
    this.movableDragHandlerDrag = function( event ) {

      var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
      var location = self._modelViewTransform.viewToModelPosition( parentPoint );
      location = self._dragBounds.closestPointTo( location );
      self.events.trigger1( 'startedCallbacksForDragged', location );

      locationProperty.set( location );

      options.onDrag( event );

      self.events.trigger0( 'endedCallbacksForDragged' );
    };

    // @private
    this.movableDragHandlerEnd = function( event ) {
      self.events.trigger1( 'startedCallbacksForDragEnded', locationProperty.get() );
      options.endDrag( event );
      self.events.trigger0( 'endedCallbacksForDragEnded' );
    };
    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      start: this.movableDragHandlerStart,

      drag: this.movableDragHandlerDrag,

      end: this.movableDragHandlerEnd
    } );
  }

  return inherit( SimpleDragHandler, MovableDragHandler, {

    /**
     * Sets the dragBounds.
     * In addition, it forces the location to be within the bounds.
     * @param {Bounds2} dragBounds
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.locationProperty.set( this._dragBounds.closestPointTo( this.locationProperty.value ) );
    },
    set dragBounds( value ) { this.setDragBounds( value ); },

    /**
     * Gets the dragBounds. Clients should not mutate the value returned.
     * @returns {Bounds2}
     */
    getDragBounds: function() {
      return this._dragBounds;
    },
    get dragBounds() { return this.getDragBounds(); },

    /**
     * Sets the modelViewTransform.
     * @param {ModelViewTransform2} modelViewTransform
     */
    setModelViewTransform: function( modelViewTransform ) {
      this._modelViewTransform = modelViewTransform;
    },
    set modelViewTransform( modelViewTransform ) { this._modelViewTransform = modelViewTransform; },

    /**
     * Gets the modelViewTransform. Clients should not mutate the value returned.
     * @returns {ModelViewTransform2}
     */
    getModelViewTransform: function() {
      return this._modelViewTransform;
    },

    get modelViewTransform() {
      return this._modelViewTransform;
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from the toolbox.
     * @param event
     */
    forwardStartEvent: function( event ) {
      this.movableDragHandlerStart( event );
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from the toolbox.
     * @param event
     */
    forwardDragEvent: function( event ) {
      this.movableDragHandlerDrag( event );
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from the toolbox.
     * @param event
     */
    forwardEndEvent: function( event ) {
      this.movableDragHandlerEnd( event );
    }
  } );
} );
