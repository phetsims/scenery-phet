// Copyright 2015-2019, University of Colorado Boulder

/**
 * Close button, red with a white 'X'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options] - see RectangularPushButton
   * @constructor
   */
  function CloseButton( options ) {
    options = _.extend( {
      iconLength: 8, // {number} length of the 'X' icon, whose bounds are square
      iconLineWidth: 2.5, // {number} lineWidth for the 'X' icon
      xMargin: 4, // {number} x margin around the icon
      yMargin: 4, // {number} y margin around the icon
      listener: null // {function} called when the button is pressed
    }, options );

    // color is standardized, not configurable
    options.baseColor = PhetColorScheme.RED_COLORBLIND;

    // 'X' icon
    options.content = new Path( new Shape()
      .moveTo( -options.iconLength, -options.iconLength )
      .lineTo( options.iconLength, options.iconLength )
      .moveTo( options.iconLength, -options.iconLength )
      .lineTo( -options.iconLength, options.iconLength ), {
      stroke: 'white', // color is standardized, not configurable
      lineWidth: options.iconLineWidth
    } );

    RectangularPushButton.call( this, options );
  }

  sceneryPhet.register( 'CloseButton', CloseButton );

  return inherit( RectangularPushButton, CloseButton );
} );
