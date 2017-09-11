// Copyright 2016-2017, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StepForwardButton( options ) {

    assert && assert( !options.direction, 'options.direction must be omitted for StepForwardButton' );
    StepButton.call( this, _.extend( { direction: 'forward' }, options ) );
  }

  sceneryPhet.register( 'StepForwardButton', StepForwardButton );

  return inherit( StepButton, StepForwardButton );
} );
