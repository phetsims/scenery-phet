// Copyright 2002-2013, University of Colorado

/**
 * Highlights a node by changing its fill color.
 * Highlighting is typically used to as a visual cue to indicate that a node is interactive.
 * <p/>
 * A node is highlighted if:
 * (a) the mouse cursor is moved inside the node's bounding rectangle, or
 * (b) the mouse was been pressed while inside the node's bounding rectangle and not yet released.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  "use strict";

  // imports
  var ButtonListener = require( "SCENERY/input/ButtonListener" );
  var inherit = require( "PHET_CORE/inherit" );
  var Property = require( "AXON/Property" );

  /**
   * @param {Color|String} normalFill
   * @param {Color|String} highlightFill
   * @param {Property<Boolean>} enabled
   * @constructor
   */
  function FillHighlighter( normalFill, highlightFill, enabled ) {

    enabled = _.isUndefined( enabled ) ? new Property( true ) : enabled;

    var setHighlighted = function( node, highlighted ) {
      if ( enabled.get() ) {
        node.fill = highlighted ? highlightFill : normalFill;
      }
    };

    ButtonListener.call( this, {
      over: function( event ) {
        setHighlighted( event.currentTarget, true );
      },
      up: function( event ) {
        setHighlighted( event.currentTarget, false );
      }
    } );
  }

  inherit( ButtonListener, FillHighlighter );

  return FillHighlighter;
} );
