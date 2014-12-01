// Copyright 2002-2014, University of Colorado Boulder

/**
 * Button with an eraser icon.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  var eraserImage = require( 'image!SCENERY_PHET/eraser.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function EraserButton( options ) {

    options = _.extend( {
      iconWidth: 20 // width of eraser icon, used for scaling, the aspect ratio will determine height
    }, options );

    var eraserImageNode = new Image( eraserImage );
    eraserImageNode.scale( options.iconWidth / eraserImageNode.width );

    options = _.extend( {
      content: eraserImageNode,
      baseColor: '#F2E916'
    }, options );

    RectangularPushButton.call( this, options );
  }

  return inherit( RectangularPushButton, EraserButton );
} );