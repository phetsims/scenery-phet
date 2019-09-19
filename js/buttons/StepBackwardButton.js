// Copyright 2014-2019, University of Colorado Boulder

/**
 * Step backward button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StepBackwardButton( options ) {
    options = options || {};

    assert && assert( !options.direction, 'StepBackwardButton sets direction' );
    options.direction = 'backward';

    StepButton.call( this, options );
  }

  sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );

  return inherit( StepButton, StepBackwardButton );
} );