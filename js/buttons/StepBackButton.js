// Copyright 2014-2016, University of Colorado Boulder

/**
 * Step Back button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function StepBackButton( enabledProperty, options ) {

    options = _.extend( {
      direction: 'back'
    }, options );

    StepButton.call( this, options );

    var thisButton = this;
    enabledProperty.link( function( value ) { thisButton.enabled = value; } );
  }

  sceneryPhet.register( 'StepBackButton', StepBackButton );

  return inherit( StepButton, StepBackButton );
} );