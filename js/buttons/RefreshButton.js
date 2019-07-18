// Copyright 2018, University of Colorado Boulder

/**
 * Standard PhET button for 'refresh'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RefreshButton', this );
  }

  sceneryPhet.register( 'RefreshButton', RefreshButton );

  return inherit( RectangularPushButton, RefreshButton );
} );