// Copyright 2002-2014, University of Colorado Boulder

//TODO Reimplemented this button using sun.button package, which currently doesn't support the "look" or functionality required.
/**
 * A round red button that changes it's on/off state when pressed.
 * Can optionally be configured as a 'momentary' button, which is on while pressed, off when released.
 *
 * @deprecated see issue #80
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );

  // images
  var pressedImage = require( 'image!SCENERY_PHET/round_red_button_pressed.png' );
  var unpressedImage = require( 'image!SCENERY_PHET/round_red_button_unpressed.png' );
  var disabledImage = require( 'image!SCENERY_PHET/round_red_button_disabled.png' );

  /**
   * @param {Property.<boolean>} onProperty
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function RoundRedButton( onProperty, enabledProperty, options ) {

    options = _.extend( {
      onWhilePressed: false // true makes this a momentary button, which stays on while pressed
    }, options );

    var thisButton = this;
    Image.call( this, unpressedImage );

    onProperty.link( function( on ) {
      if ( enabledProperty.get() ) {
        thisButton.setImage( on ? pressedImage : unpressedImage );
      }
    } );

    enabledProperty.link( function( enabled ) {
      if ( enabled ) {
        thisButton.setImage( onProperty.get() ? pressedImage : unpressedImage );
        thisButton.cursor = 'pointer';
      }
      else {
        thisButton.setImage( disabledImage );
        thisButton.cursor = 'default';
        onProperty.set( false );
      }
    } );

    if ( options.onWhilePressed ) {
      // momentary button, on while pressed, off when released
      thisButton.addInputListener( new DownUpListener( {
        down: function() {
          onProperty.set( enabledProperty.get() );
        },
        up: function() {
          onProperty.set( false );
        }
      } ) );
    }
    else {
      // toggle button, changes its state when fired
      thisButton.addInputListener( new ButtonListener( {
        fire: function() {
          onProperty.set( !onProperty.get() && enabledProperty.get() );
        }
      } ) );
    }
  }

  return inherit( Image, RoundRedButton );
} );
