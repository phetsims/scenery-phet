// Copyright 2014-2017, University of Colorado Boulder

/**
 * Step backward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StepBackwardButton( options ) {
    Tandem.indicateUninstrumentedCode();

    assert && assert( !options.direction, 'options.direction must be omitted for StepBackwardButton' );
    StepButton.call( this, _.extend( { direction: 'backward' }, options ) );
  }

  sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );

  return inherit( StepButton, StepBackwardButton );
} );