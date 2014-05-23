// Copyright 2002-2014, University of Colorado Boulder

/**
 * Button for returning to the level selection screen.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Star = require( 'VEGAS/Star' );

  /**
   * @param {Object} options
   * @constructor
   */
  function ReturnToLevelSelectButton( options ) {

    options = _.extend( {
      xMargin: 8.134152255572697, //Match the size of the star button to the refresh buttons, since they often appear together.  see https://github.com/phetsims/scenery-phet/issues/44
      baseColor: new Color( 255, 242, 2 )
    }, options );

    RectangularPushButton.call( this, _.extend( { content: new Star( 30, { fill: 'black' } ) }, options ) );
  }

  return inherit( RectangularPushButton, ReturnToLevelSelectButton );
} );