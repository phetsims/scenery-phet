// Copyright 2014-2020, University of Colorado Boulder

/**
 * Text with a drop shadow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

class ShadowText extends Node {

  /**
   * @param {string} text
   * @param {Object} [options]
   */
  constructor( text, options ) {

    options = merge( {
      font: new PhetFont( 24 ),
      fill: 'lightGray',
      stroke: null,
      shadowXOffset: 3,
      shadowYOffset: 1,
      shadowFill: 'black'
    }, options );

    options.children = [

      // background (shadow)
      new Text( text, {
        font: options.font,
        fill: options.shadowFill,
        x: options.shadowXOffset,
        y: options.shadowYOffset
      } ),

      // foreground
      new Text( text, { font: options.font, fill: options.fill, stroke: options.stroke } )
    ];

    super( options );
  }
}

sceneryPhet.register( 'ShadowText', ShadowText );
export default ShadowText;