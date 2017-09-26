// Copyright 2014-2017, University of Colorado Boulder

/**
 * Button for returning to the level selection screen.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StarShape = require( 'SCENERY_PHET/StarShape' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StarButton( options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      xMargin: 8.134152255572697, //Match the size of the star button to the refresh buttons, since they often appear together.  see https://github.com/phetsims/scenery-phet/issues/44
      baseColor: PhetColorScheme.BUTTON_YELLOW
    }, options );

    RectangularPushButton.call( this, _.extend( { content: new Path( new StarShape(), { fill: 'black' } ) }, options ) );
  }

  sceneryPhet.register( 'StarButton', StarButton );

  return inherit( RectangularPushButton, StarButton );
} );