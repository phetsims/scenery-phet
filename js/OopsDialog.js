// Copyright 2018-2019, University of Colorado Boulder

/**
 * Message dialog displayed when some limitation of the simulation is encountered.
 * So named because the messages typically begin with 'Oops!', so that's how people referred to it.
 * See https://github.com/phetsims/equality-explorer/issues/48
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  // images
  const phetGirlWaggingFingerImage = require( 'image!SCENERY_PHET/phet-girl-wagging-finger.png' );

  class OopsDialog extends Dialog {

    /**
     * @param {string} messageString - supports RichText formatting
     * @param {Object} [options]
     */
    constructor( messageString, options ) {

      options = _.extend( {

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

      const messageNode = new RichText( messageString, _.extend( {
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

  return sceneryPhet.register( 'OopsDialog', OopsDialog );
} );
 