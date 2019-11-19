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
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StepBackwardButton( options ) {

    assert && assert( !options || !options.direction, 'StepBackwardButton sets direction' );
    options = merge( { direction: 'backward' }, options );

    StepButton.call( this, options );
  }

  sceneryPhet.register( 'StepBackwardButton', StepBackwardButton );

  return inherit( StepButton, StepBackwardButton );
} );