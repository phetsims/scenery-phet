// Copyright 2018, University of Colorado Boulder

/**
 * Standard PhET button for 'info', uses the international symbol for 'information'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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
  }

  sceneryPhet.register( 'InfoButton', InfoButton );

  return inherit( RoundPushButton, InfoButton );
} );