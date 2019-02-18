// Copyright 2013-2019, University of Colorado Boulder

/**
 * A drag handler for something that has a location and is constrained to some (optional) bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @deprecated - please use DragListener for new code
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Property.<Vector2>} locationProperty - in model coordinate frame
   * @param {Object} [options]
   * @constructor
   */
  function MovableDragHandler( locationProperty, options ) {

    var self = this;

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging will be constrained to these bounds, in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity(), // {ModelViewTransform2} defaults to identity
      startDrag: function( event ) {},  // use this to do something at the start of dragging, like moving a node to the foreground
      onDrag: function( event ) {}, // use this to do something every time drag is called, such as notify that a user has modified the position
      endDrag: function( event ) {},  // use this to do something at the end of dragging, like 'snapping'
      allowTouchSnag: true, // Override this with false to prevent touch snagging.

      // MovableDragHandler defaults to using event.currentTarget for its reference coordinate frame, but
      // the target can be overridden here. This is useful when you need to attach a listener to a sub-component
      // of a node hierarchy
      targetNode: null,
      tandem: Tandem.required
    }, options );

    this.locationProperty = locationProperty; // @private
    this._dragBounds = options.dragBounds.copy(); // @private
    this._modelViewTransform = options.modelViewTransform; // @private

    var startOffset; // where the drag started relative to locationProperty, in parent view coordinates

    // @private - note where the drag started
    this.movableDragHandlerStart = function( event, trail ) {

      options.startDrag( event );

      // Note the options.startDrag can change the locationProperty, so read it again above, see https://github.com/phetsims/scenery-phet/issues/157
      var location = self._modelViewTransform.modelToViewPosition( locationProperty.get() );
      if ( options.targetNode ) {
        startOffset = options.targetNode.globalToParentPoint( event.pointer.point );
      }
      else {
        // See https://github.com/phetsims/beers-law-lab/issues/197, the Trail provided looks buggy (missing last node)
        startOffset = trail.globalToLocalPoint( event.pointer.point );
      }
      startOffset = startOffset.minus( location );
    };

    // @private - change the location, adjust for starting offset, constrain to drag bounds
    this.movableDragHandlerDrag = function( event, trail ) {
      var parentPoint;
      if ( options.targetNode ) {
        parentPoint = options.targetNode.globalToParentPoint( event.pointer.point );
      }
      else {
        // See https://github.com/phetsims/beers-law-lab/issues/197, the Trail provided looks buggy (missing last node)
        parentPoint = trail.globalToLocalPoint( event.pointer.point );
      }
      parentPoint = parentPoint.minus( startOffset );
      var location = self._modelViewTransform.viewToModelPosition( parentPoint );
      location = self._dragBounds.closestPointTo( location );

      locationProperty.set( location );

      options.onDrag( event );
    };

    // @private
    this.movableDragHandlerEnd = function( event, trail ) {
      options.endDrag( event );
    };

    SimpleDragHandler.call( this, {
      tandem: options.tandem,
      allowTouchSnag: options.allowTouchSnag,
      start: this.movableDragHandlerStart,
      drag: this.movableDragHandlerDrag,
      end: this.movableDragHandlerEnd,
      attach: options.attach || false
    } );
  }

  sceneryPhet.register( 'MovableDragHandler', MovableDragHandler );

  // MovableDragHandler extends SimpleDragHandler to facilitate phet-io instrumentation.  If no tandem is provided,
  // then no additional work is done.
  return inherit( SimpleDragHandler, MovableDragHandler, {

    /**
     * Sets the dragBounds.
     * In addition, it forces the location to be within the bounds.
     * @param {Bounds2} dragBounds
     * @public
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.constrainToBounds();
    },
    set dragBounds( value ) { this.setDragBounds( value ); },

    /**
     * Gets the dragBounds. Clients should not mutate the value returned.
     * @returns {Bounds2}
     * @public
     */
    getDragBounds: function() {
      return this._dragBounds;
    },
    get dragBounds() { return this.getDragBounds(); },

    /**
     * If the location is outside of the drag bounds, change it to lie to the closest in-bounds point.
     * @public
     */
    constrainToBounds: function() {
      this.locationProperty.set( this._dragBounds.closestPointTo( this.locationProperty.get() ) );
    },

    /**
     * Sets the modelViewTransform.
     * @param {ModelViewTransform2} modelViewTransform
     * @public
     */
    setModelViewTransform: function( modelViewTransform ) {
      this._modelViewTransform = modelViewTransform;
    },
    set modelViewTransform( modelViewTransform ) { this.setModelViewTransform( modelViewTransform ); },

    /**
     * Gets the modelViewTransform. Clients should not mutate the value returned.
     * @returns {ModelViewTransform2}
     * @public
     */
    getModelViewTransform: function() {
      return this._modelViewTransform;
    },
    get modelViewTransform() { return this.getModelViewTransform(); },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from a toolbox.
     * @param event
     * @public
     */
    handleForwardedStartEvent: function( event, trail ) {
      this.movableDragHandlerStart( event, trail );
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from a toolbox.
     * @param event
     * @public
     */
    handleForwardedDragEvent: function( event, trail ) {
      this.movableDragHandlerDrag( event, trail );
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from a toolbox.
     * @param event
     * @public
     */
    handleForwardedEndEvent: function( event, trail ) {
      this.movableDragHandlerEnd( event, trail );
    }
  } );
} );
