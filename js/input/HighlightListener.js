// Copyright 2013-2017, University of Colorado Boulder

/**
 * Listener that indicates whether a node should be highlighted.
 * Highlighting is typically used to as a visual cue to indicate that a node is interactive.
 * <p/>
 * A node is highlighted if:
 * (a) the mouse cursor is moved inside the node's bounding rectangle, or
 * (b) the mouse was been pressed while inside the node's bounding rectangle and not yet released.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {function} callback called when the highlight changes, has 2 parameters: the {Node} to be highlighted, and a {boolean} indicating whether to highlight
   * @constructor
   */
  function HighlightListener( callback ) {

    ButtonListener.call( this, {
      over: function( event ) {
        callback( event.currentTarget, true );
      },
      up: function( event ) {
        callback( event.currentTarget, false );
      }
    } );
  }

  sceneryPhet.register( 'HighlightListener', HighlightListener );

  return inherit( ButtonListener, HighlightListener );
} );
