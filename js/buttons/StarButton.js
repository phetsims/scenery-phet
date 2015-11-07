// Copyright 2014-2015, University of Colorado Boulder

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
  var StarShape = require( 'SCENERY_PHET/StarShape' );
  var Path = require( 'SCENERY/nodes/Path' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StarButton( options ) {

    options = _.extend( {
      xMargin: 8.134152255572697, //Match the size of the star button to the refresh buttons, since they often appear together.  see https://github.com/phetsims/scenery-phet/issues/44
      baseColor: new Color( 242, 233, 22 )//Color match with the yellow in the PhET logo
    }, options );

    RectangularPushButton.call( this, _.extend( { content: new Path( new StarShape(), { fill: 'black' } ) }, options ) );
  }

  return inherit( RectangularPushButton, StarButton );
} );