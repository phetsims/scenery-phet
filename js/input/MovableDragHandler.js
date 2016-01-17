// Copyright 2013-2015, University of Colorado Boulder

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
  var TandemDragHandler = require( 'SCENERY_PHET/input/TandemDragHandler' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Property.<Vector2>} locationProperty - in model coordinate frame
   *        OR {get:...,set:...}, used in Bending Light's PrismNode as somewhat of a hack.
   * @param {Object} [options]
   * @constructor
   */
  function MovableDragHandler( locationProperty, options ) {

    var self = this;

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging will be constrained to these bounds, in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity(), // {ModelViewTransform2} defaults to identity
      startDrag: function( event ) {},  // use this to do something at the start of dragging, like moving a node to the foreground
      endDrag: function( event ) {},  // use this to do something at the end of dragging, like 'snapping'
      onDrag: function( event ) {}, // use this to do something every time drag is called, such as notify that a user has modified the position
      targetNode: null, // MovableDragHandler defaults to using event.currentTarget for its reference coordinate frame, but
      // the target can be overriden here.  This is useful when you need to attach a listener to a sub-
      // component of a node hierarchy
      tandem: null
    }, options );

    this.locationProperty = locationProperty; // @private
    this._dragBounds = options.dragBounds.copy(); // @private
    this._modelViewTransform = options.modelViewTransform; // @private

    var startOffset; // where the drag started relative to locationProperty, in parent view coordinates

    // @private - note where the drag started
    this.movableDragHandlerStart = function( event ) {

      options.startDrag( event );

      // Note the options.startDrag can change the locationProperty, so read it again above, see https://github.com/phetsims/scenery-phet/issues/157
      var targetNode = options.targetNode || event.currentTarget;
      var location = self._modelViewTransform.modelToViewPosition( locationProperty.get() );
      startOffset = targetNode.globalToParentPoint( event.pointer.point ).minus( location );
    };

    // @private - change the location, adjust for starting offset, constrain to drag bounds
    this.movableDragHandlerDrag = function( event ) {

      var targetNode = options.targetNode || event.currentTarget;
      var parentPoint = targetNode.globalToParentPoint( event.pointer.point ).minus( startOffset );
      var location = self._modelViewTransform.viewToModelPosition( parentPoint );
      location = self._dragBounds.closestPointTo( location );

      locationProperty.set( location );

      options.onDrag( event );
    };

    // @private
    this.movableDragHandlerEnd = function( event ) {
      options.endDrag( event );
    };

    TandemDragHandler.call( this, {
      tandem: options.tandem,
      allowTouchSnag: true,
      start: this.movableDragHandlerStart,
      drag: this.movableDragHandlerDrag,
      end: this.movableDragHandlerEnd
    } );
  }

  sceneryPhet.register( 'MovableDragHandler', MovableDragHandler );

  // MovableDragHandler extends TandemDragHandler to facilitate phet-io instrumentation.  If no tandem is provided,
  // then no additional work is done.
  return inherit( TandemDragHandler, MovableDragHandler, {

    /**
     * Sets the dragBounds.
     * In addition, it forces the location to be within the bounds.
     * @param {Bounds2} dragBounds
     * @public
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.locationProperty.set( this._dragBounds.closestPointTo( this.locationProperty.get() ) );
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
     * Sets the modelViewTransform.
     * @param {ModelViewTransform2} modelViewTransform
     * @public
     */
    setModelViewTransform: function( modelViewTransform ) {
      this._modelViewTransform = modelViewTransform;
    },
    set modelViewTransform( modelViewTransform ) { this._modelViewTransform = modelViewTransform; },

    /**
     * Gets the modelViewTransform. Clients should not mutate the value returned.
     * @returns {ModelViewTransform2}
     * @public
     */
    getModelViewTransform: function() {
      return this._modelViewTransform;
    },

    // @public
    get modelViewTransform() {
      return this._modelViewTransform;
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from the toolbox.
     * @param event
     * @public
     */
    forwardStartEvent: function( event ) {
      this.movableDragHandlerStart( event );
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from the toolbox.
     * @param event
     * @public
     */
    forwardDragEvent: function( event ) {
      this.movableDragHandlerDrag( event );
    },

    /**
     * Forward an event from another listener to this one, useful when dragging an icon from the toolbox.
     * @param event
     * @public
     */
    forwardEndEvent: function( event ) {
      this.movableDragHandlerEnd( event );
    }
  } );
} );
