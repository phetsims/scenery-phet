// Copyright 2013-2020, University of Colorado Boulder

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

import inherit from '../../../phet-core/js/inherit.js';
import ButtonListener from '../../../scenery/js/input/ButtonListener.js';
import sceneryPhet from '../sceneryPhet.js';

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

inherit( ButtonListener, HighlightListener );
export default HighlightListener;