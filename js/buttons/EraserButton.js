// Copyright 2014-2017, University of Colorado Boulder

/**
 * Button with an eraser icon.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // images
  var eraserImage = require( 'image!SCENERY_PHET/eraser.png' );

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
  }

  sceneryPhet.register( 'EraserButton', EraserButton );

  return inherit( RectangularPushButton, EraserButton );
} );