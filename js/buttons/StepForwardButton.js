// Copyright 2016-2019, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid
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
  function StepForwardButton( options ) {

    options = options || {};

    assert && assert( !options.direction, 'StepForwardButton sets direction' );
    options.direction = 'forward';

    StepButton.call( this, options );
  }

  sceneryPhet.register( 'StepForwardButton', StepForwardButton );

  return inherit( StepButton, StepForwardButton );
} );
