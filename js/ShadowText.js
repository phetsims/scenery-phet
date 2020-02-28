// Copyright 2014-2020, University of Colorado Boulder

/**
 * Text with a drop shadow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {string} text
 * @param {Object} [options]
 * @constructor
 */
function ShadowText( text, options ) {
  options = merge( {
    font: new PhetFont( 24 ),
    fill: 'lightGray',
    stroke: null,
    shadowXOffset: 3,
    shadowYOffset: 1,
    shadowFill: 'black'
  }, options );

  options.children = [
    new Text( text, {
      font: options.font,
      fill: options.shadowFill,
      x: options.shadowXOffset,
      y: options.shadowYOffset
    } ), // shadow
    new Text( text, { font: options.font, fill: options.fill, stroke: options.stroke } )
  ];

  Node.call( this, options );
}

sceneryPhet.register( 'ShadowText', ShadowText );

inherit( Node, ShadowText );
export default ShadowText;