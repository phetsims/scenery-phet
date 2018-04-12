// Copyright 2018, University of Colorado Boulder

/**
 * Standard PhET button for 'refresh'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RefreshButton( options ) {

    options = _.extend( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      iconScale: 1
    }, options );

    assert && assert( !options.content, 'RefreshButton sets content' );
    options.content = new FontAwesomeNode( 'refresh', {
      scale: options.iconScale
    } );

    RectangularPushButton.call( this, options );
  }

  sceneryPhet.register( 'RefreshButton', RefreshButton );

  return inherit( RectangularPushButton, RefreshButton );
} );