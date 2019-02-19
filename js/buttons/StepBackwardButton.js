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

    options = options || {};

    assert && assert( !options.direction, 'StepBackwardButton sets direction' );
    options.direction = 'backward';

    StepButton.call( this, options );
  }

  sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );

  return inherit( StepButton, StepBackwardButton );
} );