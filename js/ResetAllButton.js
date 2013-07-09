// Copyright 2002-2013, University of Colorado Boulder

/**
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangleButton = require( 'SUN/RectangleButton' );

  function ResetAllButton( callback, options ) {
    RectangleButton.call( this, new FontAwesomeNode( 'refresh', {fill: '#fff'} ), callback,
      _.extend( { rectangleFill: '#f99d1c', rectangleXMargin: 8, rectangleYMargin: 8, label: 'Reset All' }, options || {} ) );//TODO: i18n a11y
  }

  inherit( RectangleButton, ResetAllButton );

  return ResetAllButton;
} );