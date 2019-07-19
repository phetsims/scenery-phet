// Copyright 2018-2019, University of Colorado Boulder

/**
 * Standard PhET button for 'info', uses the international symbol for 'information'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function InfoButton( options ) {

    options = _.extend( {
      minXMargin: 10,
      minYMargin: 10,
      touchAreaXDilation: 10,
      touchAreaYDilation: 5,
      baseColor: 'rgb( 238, 238, 238 )',
      iconFill: 'black'
    }, options );

    assert && assert( !options.content, 'InfoButton sets content' );
    options.content = new FontAwesomeNode( 'info_circle', {
      fill: options.iconFill
    } );

    RoundPushButton.call( this, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'InfoButton', this );
  }

  sceneryPhet.register( 'InfoButton', InfoButton );

  return inherit( RoundPushButton, InfoButton );
} );