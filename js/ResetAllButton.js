// Copyright 2002-2013, University of Colorado Boulder

/**
 * Reset All button.
 */
define( function( require ) {
  'use strict';

  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PushButton = require( 'SUN/PushButton' );
  var Vector2 = require( 'DOT/Vector2' );
  var resetButtonUp = require( 'image!SCENERY_PHET/../images/reset_button_up.png' );
  var resetButtonOver = require( 'image!SCENERY_PHET/../images/reset_button_over.png' );
  var resetButtonDown = require( 'image!SCENERY_PHET/../images/reset_button_down.png' );
  var resetButtonDisabled = require( 'image!SCENERY_PHET/../images/reset_button_disabled.png' );

  var radius = 33; // hardcoded width/height for the circle of the reset all button
  var radiusSquared = radius * radius;
  var center = new Vector2( radius, radius );

  function ResetAllButton( callback, options ) {
    PushButton.call( this,
      new ResetAllImage( resetButtonUp ),
      new ResetAllImage( resetButtonOver ),
      new ResetAllImage( resetButtonDown ),
      new ResetAllImage( resetButtonDisabled ),
      callback, options );
  }

  function ResetAllImage( image ) {
    Image.call( this, image );
  }

  inherit( Image, ResetAllImage, {
    containsPointSelf: function( point ) {
      return point.distanceSquared( center ) <= radiusSquared;
    }
  } );

  return inherit( PushButton, ResetAllButton );
} );