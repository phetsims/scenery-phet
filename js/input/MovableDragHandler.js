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
  var Vector2 = require( 'DOT/Vector2' );
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

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      // note where the drag started
      start: function( event ) {

        var initialLocation = locationProperty.get();
        self.events.trigger1( 'startedCallbacksForDragStarted', initialLocation );

        options.startDrag( event );

        var location = self._modelViewTransform.modelToViewPosition( initialLocation );
        startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );

        self.events.trigger1( 'endedCallbacksForDragStarted', initialLocation );
      },

      // change the location, adjust for starting offset, constrain to drag bounds
      drag: function( event ) {

        var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
        var location = self._modelViewTransform.viewToModelPosition( parentPoint );
        location = constrainLocation( location, self._dragBounds );
        self.events.trigger1( 'startedCallbacksForDragged', location );

        locationProperty.set( location );

        options.onDrag( event );

        self.events.trigger1( 'endedCallbacksForDragged', location );
      },

      end: function( event ) {
        self.events.trigger1( 'startedCallbacksForDragEnded', locationProperty.get() );
        options.endDrag( event );
        self.events.trigger1( 'endedCallbacksForDragEnded', locationProperty.get() );
      }
    } );
  }

  /**
   * Constrains a location to some bounds.
   * It returns (1) the same location if the location is within the bounds
   * or (2) a location on the edge of the bounds if the location is outside the bounds
   * @param {Vector2} location
   * @param {Bounds2} bounds
   * @returns {Vector2}
   */
  var constrainLocation = function( location, bounds ) {
    if ( bounds.containsCoordinates( location.x, location.y ) ) {
      return location;
    }
    else {
      var xConstrained = Math.max( Math.min( location.x, bounds.maxX ), bounds.x );
      var yConstrained = Math.max( Math.min( location.y, bounds.maxY ), bounds.y );
      return new Vector2( xConstrained, yConstrained );
    }
  };

  return inherit( SimpleDragHandler, MovableDragHandler, {

    /**
     * Sets the dragBounds.
     * In addition, it forces the location to be within the bounds.
     * @param {Bounds2} dragBounds
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.locationProperty.set( constrainLocation( this.locationProperty.value, this._dragBounds ) );
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
    get modelViewTransform() { return this._modelViewTransform; }

  } );
} );
