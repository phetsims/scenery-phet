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
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import SimpleDragHandler from '../../../scenery/js/input/SimpleDragHandler.js';
import Tandem from '../../../tandem/js/Tandem.js';
import sceneryPhet from '../sceneryPhet.js';

class MovableDragHandler extends SimpleDragHandler {

  /**
   * @param {Property.<Vector2>} positionProperty - in model coordinate frame
   * @param {Object} [options]
   */
  constructor( positionProperty, options ) {
    assert && deprecationWarning( 'MovableDragHandler is deprecated, please use DragListener instead' );

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

    let startOffset; // where the drag started relative to positionProperty, in parent view coordinates

    // note where the drag started
    const movableDragHandlerStart = ( event, trail ) => {

      options.startDrag( event );

      // Note the options.startDrag can change the positionProperty, so read it again above, see https://github.com/phetsims/scenery-phet/issues/157
      const position = this._modelViewTransform.modelToViewPosition( positionProperty.get() );
      if ( options.targetNode ) {
        startOffset = options.targetNode.globalToParentPoint( event.pointer.point );
      }
      else {
        // See https://github.com/phetsims/beers-law-lab/issues/197, the Trail provided looks buggy (missing last node)
        startOffset = trail.globalToLocalPoint( event.pointer.point );
      }
      startOffset = startOffset.minus( position );
    };

    // change the position, adjust for starting offset, constrain to drag bounds
    const movableDragHandlerDrag = ( event, trail ) => {
      let parentPoint;
      if ( options.targetNode ) {
        parentPoint = options.targetNode.globalToParentPoint( event.pointer.point );
      }
      else {
        // See https://github.com/phetsims/beers-law-lab/issues/197, the Trail provided looks buggy (missing last node)
        parentPoint = trail.globalToLocalPoint( event.pointer.point );
      }
      parentPoint = parentPoint.minus( startOffset );
      let position = this._modelViewTransform.viewToModelPosition( parentPoint );
      position = this._dragBounds.closestPointTo( position );

      positionProperty.set( position );

      options.onDrag( event );
    };

    const movableDragHandlerEnd = function( event, trail ) {
      options.endDrag( event );
    };

    super( {
      tandem: options.tandem,
      allowTouchSnag: options.allowTouchSnag,
      start: movableDragHandlerStart,
      drag: movableDragHandlerDrag,
      end: movableDragHandlerEnd,
      attach: options.attach || false
    } );

    // @private used by methods
    this.positionProperty = positionProperty;
    this._dragBounds = options.dragBounds.copy();
    this._modelViewTransform = options.modelViewTransform;
    this.movableDragHandlerStart = movableDragHandlerStart;
    this.movableDragHandlerDrag = movableDragHandlerDrag;
    this.movableDragHandlerEnd = movableDragHandlerEnd;
  }

  get dragBounds() { return this.getDragBounds(); }

  set dragBounds( value ) { this.setDragBounds( value ); }

  get modelViewTransform() { return this.getModelViewTransform(); }

  set modelViewTransform( modelViewTransform ) { this.setModelViewTransform( modelViewTransform ); }

  /**
   * Sets the dragBounds.
   * In addition, it forces the position to be within the bounds.
   * @param {Bounds2} dragBounds
   * @public
   */
  setDragBounds( dragBounds ) {
    this._dragBounds = dragBounds.copy();
    this.constrainToBounds();
  }

  /**
   * Gets the dragBounds. Clients should not mutate the value returned.
   * @returns {Bounds2}
   * @public
   */
  getDragBounds() {
    return this._dragBounds;
  }

  /**
   * If the position is outside of the drag bounds, change it to lie to the closest in-bounds point.
   * @public
   */
  constrainToBounds() {
    this.positionProperty.set( this._dragBounds.closestPointTo( this.positionProperty.get() ) );
  }

  /**
   * Sets the modelViewTransform.
   * @param {ModelViewTransform2} modelViewTransform
   * @public
   */
  setModelViewTransform( modelViewTransform ) {
    this._modelViewTransform = modelViewTransform;
  }

  /**
   * Gets the modelViewTransform. Clients should not mutate the value returned.
   * @returns {ModelViewTransform2}
   * @public
   */
  getModelViewTransform() {
    return this._modelViewTransform;
  }

  /**
   * Forward an event from another listener to this one, useful when dragging an icon from a toolbox.
   * @param event
   * @public
   */
  handleForwardedStartEvent( event, trail ) {
    this.movableDragHandlerStart( event, trail );
  }

  /**
   * Forward an event from another listener to this one, useful when dragging an icon from a toolbox.
   * @param event
   * @public
   */
  handleForwardedDragEvent( event, trail ) {
    this.movableDragHandlerDrag( event, trail );
  }

  /**
   * Forward an event from another listener to this one, useful when dragging an icon from a toolbox.
   * @param event
   * @public
   */
  handleForwardedEndEvent( event, trail ) {
    this.movableDragHandlerEnd( event, trail );
  }
}

sceneryPhet.register( 'MovableDragHandler', MovableDragHandler );
export default MovableDragHandler;