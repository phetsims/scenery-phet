// Copyright 2019-2020, University of Colorado Boulder

/**
 * Message dialog displayed when some limitation of the simulation is encountered.
 * So named because the messages typically begin with 'Oops!', so that's how people referred to it.
 * See https://github.com/phetsims/equality-explorer/issues/48
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Image from '../../scenery/js/nodes/Image.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import Dialog from '../../sun/js/Dialog.js';
import phetGirlWaggingFingerImage from '../images/phet-girl-wagging-finger_png.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

class OopsDialog extends Dialog {

  /**
   * @param {string} messageString - supports RichText formatting
   * @param {Object} [options]
   */
  constructor( messageString, options ) {

    options = merge( {

      // {Node|null} optional icon that will be placed to the right of the image.
      // If this is null, then a PhET Girl image is used.
      // If provided, the caller is responsible for all aspects of the icon, including scale.
      iconNode: null,

      // nested options
      richTextOptions: null,

      // Dialog options
      topMargin: 20,
      bottomMargin: 20,
      rightMargin: 20

    }, options );

    const messageNode = new RichText( messageString, merge( {
      font: new PhetFont( 20 ),
      maxWidth: 600,
      maxHeight: 400
    }, options.richTextOptions ) );

    const iconNode = options.iconNode || new Image( phetGirlWaggingFingerImage, {
      maxHeight: 132 // determined empirically
    } );

    const content = new HBox( {
      spacing: 20,
      children: [ messageNode, iconNode ]
    } );

    super( content, options );
  }
}

sceneryPhet.register( 'OopsDialog', OopsDialog );
export default OopsDialog;