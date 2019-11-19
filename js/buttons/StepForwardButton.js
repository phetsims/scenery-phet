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
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  const stepForwardSoundPlayer = require( 'TAMBO/shared-sound-players/stepForwardSoundPlayer' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StepForwardButton( options ) {

    assert && assert( !options || !options.direction, 'StepForwardButton sets direction' );
    options = merge( {
      direction: 'forward',
      soundPlayer: stepForwardSoundPlayer,
    }, options );
    
    StepButton.call( this, options );
  }

  sceneryPhet.register( 'StepForwardButton', StepForwardButton );

  return inherit( StepButton, StepForwardButton );
} );
