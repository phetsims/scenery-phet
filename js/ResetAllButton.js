// Copyright 2002-2013, University of Colorado Boulder

/**
 * Reset All button.
 */
define( function( require ) {
  'use strict';

  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PushButton = require( 'SUN/PushButton' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var resetButtonUp = require( 'image!SCENERY_PHET/reset_button_up.png' );
  var resetButtonOver = require( 'image!SCENERY_PHET/reset_button_over.png' );
  var resetButtonDown = require( 'image!SCENERY_PHET/reset_button_down.png' );
  var resetButtonDisabled = require( 'image!SCENERY_PHET/reset_button_disabled.png' );

  function ResetAllButton( callback, options ) {
    var resetAllButton = this;

    //Compute the image metrics in the constructor to make sure SimLauncher.doneLoadingImages has completed
    this.RADIUS = resetButtonUp.width / 2; // assumes that all button images are circles and have the same dimensions.
    this.RADIUS_SQUARED = this.RADIUS * this.RADIUS;
    this.CENTER = new Vector2( this.RADIUS, this.RADIUS );

    options = _.extend( {
      touchAreaRadius: resetAllButton.RADIUS + 5, // convenience for expanding the touchArea, which is a circle
      pickable: true
    }, options );
    options.callback = callback;
    PushButton.call( this,
      new ResetAllImage( resetButtonUp, this.CENTER ),
      new ResetAllImage( resetButtonOver, this.CENTER ),
      new ResetAllImage( resetButtonDown, this.CENTER ),
      new ResetAllImage( resetButtonDisabled, this.CENTER ),
      options );
    this.touchArea = Shape.circle( this.CENTER.x, this.CENTER.y, options.touchAreaRadius );
    this.mouseArea = Shape.circle( this.CENTER.x, this.CENTER.y, this.RADIUS );
  }

  function ResetAllImage( image, CENTER ) {
    Image.call( this, image );
    this.CENTER = CENTER;
  }

  inherit( Image, ResetAllImage, {
    containsPointSelf: function( point ) {
      return point.distanceSquared( this.CENTER ) <= this.RADIUS_SQUARED;
    }
  } );

  return inherit( PushButton, ResetAllButton );
} );