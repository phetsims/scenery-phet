// Copyright 2016, University of Colorado Boulder

/**
 * Step Forward button.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Property.<boolean>} playingProperty - button is disabled when this is true
   * @param {Object} [options]
   * @constructor
   */
  function StepForwardButton( playingProperty, options ) {

    // button radius is used in computation of other default options
    var BUTTON_RADIUS = ( options && options.radius ) ? options.radius : 20;

    options = _.extend( {
      direction: 'forward',
      xContentOffset: 0.075 * BUTTON_RADIUS // shift the content to center align, assumes 3D appearance
    }, options );

    StepButton.call( this, options );

    // Disable this button when playing
    var thisButton = this;
    playingProperty.link( function( value ) { thisButton.enabled = !value; } );
  }

  sceneryPhet.register( 'StepForwardButton', StepForwardButton );

  return inherit( StepButton, StepForwardButton );
} );
