// Copyright 2013-2017, University of Colorado Boulder

/**
 * Highlights a node by changing its fill color. See HighlightListener.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HighlightListener = require( 'SCENERY_PHET/input/HighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Color|string} normalFill
   * @param {Color|string} highlightFill
   * @param {Property.<boolean>} enabled
   * @constructor
   */
  function FillHighlightListener( normalFill, highlightFill, enabled ) {

    enabled = _.isUndefined( enabled ) ? new Property( true ) : enabled;

    HighlightListener.call( this, function( node, highlighted ) {
      if ( enabled.value ) {
        node.fill = highlighted ? highlightFill : normalFill;
      }
    } );
  }

  sceneryPhet.register( 'FillHighlightListener', FillHighlightListener );

  return inherit( HighlightListener, FillHighlightListener );
} );
