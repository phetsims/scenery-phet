// Copyright 2014-2019, University of Colorado Boulder

/**
 * Button for returning to the level selection screen.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const StarShape = require( 'SCENERY_PHET/StarShape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StarButton( options ) {
    options = merge( {
      xMargin: 8.134152255572697, //Match the size of the star button to the refresh buttons, since they often appear together.  see https://github.com/phetsims/scenery-phet/issues/44
      baseColor: PhetColorScheme.BUTTON_YELLOW
    }, options );

    RectangularPushButton.call( this, merge( { content: new Path( new StarShape(), { fill: 'black' } ) }, options ) );
  }

  sceneryPhet.register( 'StarButton', StarButton );

  return inherit( RectangularPushButton, StarButton );
} );