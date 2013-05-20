// Copyright 2013, University of Colorado

/**
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Button = require( 'SUN/Button' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  function ResetAllButton( callback, options ) {
    Button.call( this, new FontAwesomeNode( 'refresh', {fill: '#fff'} ), callback,
                 _.extend( { fill: '#f99d1c', xMargin: 8, yMargin: 8 }, options || {} ) );
  }

  inherit( ResetAllButton, Button );

  return ResetAllButton;
} );