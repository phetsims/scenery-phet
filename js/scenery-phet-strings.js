// Copyright 2002-2013, University of Colorado Boulder

/**
 * Load the strings only once and from a single location, because loading them from different relative paths
 * causes them to fall back to the root language sometimes for unknown reasons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';
  return require( 'i18n!SCENERY_PHET/../nls/scenery-phet-strings' );
} );