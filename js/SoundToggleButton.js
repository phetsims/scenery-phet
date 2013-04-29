// Copyright 2013, University of Colorado

/**
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function ( require ) {

  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ToggleButton = require( 'SUN/ToggleButton' );
  var ToggleNode = require( 'SUN/ToggleNode' );

  function SoundToggleButton( property ) {
    ToggleButton.call( this,
                       new ToggleNode( new FontAwesomeNode( 'volume_off' ),
                                       new FontAwesomeNode( 'volume_up' ),
                                       property ),
                       property );
  }

  inherit( SoundToggleButton, ToggleButton );

  return SoundToggleButton;
} );