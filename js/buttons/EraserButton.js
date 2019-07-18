// Copyright 2014-2017, University of Colorado Boulder

/**
 * Button with an eraser icon.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // images
  const eraserImage = require( 'image!SCENERY_PHET/eraser.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function EraserButton( options ) {

    options = _.extend( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      iconWidth: 20 // width of eraser icon, used for scaling, the aspect ratio will determine height
    }, options );

    // eraser icon
    options.content = new Image( eraserImage );
    options.content.scale( options.iconWidth / options.content.width );

    RectangularPushButton.call( this, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EraserButton', this );
  }

  sceneryPhet.register( 'EraserButton', EraserButton );

  return inherit( RectangularPushButton, EraserButton );
} );