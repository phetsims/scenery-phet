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
   * @param {Object} [options]
   * @constructor
   */
  function StepBackButton( options ) {
    assert && assert( !options.direction );
    StepButton.call( this, _.extend( {}, options, { direction: 'back' } ) );
  }

  sceneryPhet.register( 'StepBackButton', StepBackButton );

  return inherit( StepButton, StepBackButton );
} );