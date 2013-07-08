// Copyright 2002-2013, University of Colorado Boulder

/**
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ToggleButton = require( 'SUN/ToggleButton' );
  var ToggleNode = require( 'SUN/ToggleNode' );

  function SoundToggleButton( property, options ) {
    ToggleButton.call( this,
      new FontAwesomeNode( 'volume_up' ),
      new FontAwesomeNode( 'volume_off' ),
      property,
      _.extend( { addRectangle: true, label: 'Sound' }, options ) );
  }

  inherit( ToggleButton, SoundToggleButton );

  return SoundToggleButton;
} );