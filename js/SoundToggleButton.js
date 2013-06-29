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
      new ToggleNode( new FontAwesomeNode( 'volume_off' ),
        new FontAwesomeNode( 'volume_up' ),
        property ),
      property, _.extend( { label: 'Sound' }, options || {} ) );
  }

  inherit( ToggleButton, SoundToggleButton );

  return SoundToggleButton;
} );