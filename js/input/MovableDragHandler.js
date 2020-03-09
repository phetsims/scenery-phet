// Copyright 2013-2020, University of Colorado Boulder

/**
 * A drag handler for something that has a position and is constrained to some (optional) bounds.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 * @deprecated - please use DragListener for new code
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import deprecationWarning from '../../../phet-core/js/deprecationWarning.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import SimpleDragHandler from '../../../scenery/js/input/SimpleDragHandler.js';
import Tandem from '../../../tandem/js/Tandem.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Property.<Vector2>} positionProperty - in model coordinate frame
 * @param {Object} [options]
 * @constructor
 */
function MovableDragHandler( positionProperty, options ) {
  assert && deprecationWarning( 'MovableDragHandler is deprecated, please use DragListener instead' );

  const self = this;

  options = merge( {
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
    tandem: Tandem.REQUIRED
  }, options );

  this.positionProperty = positionProperty; // @private
  this._dragBounds = options.dragBounds.copy(); // @private
  this._modelViewTransform = options.modelViewTransform; // @private

  let startOffset; // where the drag started relative to positionProperty, in parent view coordinates

  // @private - note where the drag started
  this.movableDragHandlerStart = function( event, trail ) {

    options.startDrag( event );

    // Note the options.startDrag can change the positionProperty, so read it again above, see https://github.com/phetsims/scenery-phet/issues/157
    const position = self._modelViewTransform.modelToViewPosition( positionProperty.get() );
    if ( options.targetNode ) {
      startOffset = options.targetNode.globalToParentPoint( event.pointer.point );
    }
    else {
      // See https://github.com/phetsims/beers-law-lab/issues/197, the Trail provided looks buggy (missing last node)
      startOffset = trail.globalToLocalPoint( event.pointer.point );
    }
    startOffset = startOffset.minus( position );
  };

  // @private - change the position, adjust for starting offset, constrain to drag bounds
  this.movableDragHandlerDrag = function( event, trail ) {
    let parentPoint;
    if ( options.targetNode ) {
      parentPoint = options.targetNode.globalToParentPoint( event.pointer.point );
    }
    else {
      // See https://github.com/phetsims/beers-law-lab/issues/197, the Trail provided looks buggy (missing last node)
      parentPoint = trail.globalToLocalPoint( event.pointer.point );
    }
    parentPoint = parentPoint.minus( startOffset );
    let position = self._modelViewTransform.viewToModelPosition( parentPoint );
    position = self._dragBounds.closestPointTo( position );

    positionProperty.set( position );

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
export default inherit( SimpleDragHandler, MovableDragHandler, {

  /**
   * Sets the dragBounds.
   * In addition, it forces the position to be within the bounds.
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
   * If the position is outside of the drag bounds, change it to lie to the closest in-bounds point.
   * @public
   */
  constrainToBounds: function() {
    this.positionProperty.set( this._dragBounds.closestPointTo( this.positionProperty.get() ) );
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