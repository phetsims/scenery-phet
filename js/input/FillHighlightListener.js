// Copyright 2013-2020, University of Colorado Boulder

/**
 * Highlights a node by changing its fill color. See HighlightListener.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import inherit from '../../../phet-core/js/inherit.js';
import sceneryPhet from '../sceneryPhet.js';
import HighlightListener from './HighlightListener.js';

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

inherit( HighlightListener, FillHighlightListener );
export default FillHighlightListener;