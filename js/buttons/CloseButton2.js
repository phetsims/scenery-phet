// Copyright 2015-2017, University of Colorado Boulder

/**
 * Close button, red with a white 'X'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );


  /**
   * @param {Object} [options] - see RectangularPushButton
   * @constructor
   */
  function CloseButton2( options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      iconLength: 7,
      baseColor: 'transparent',
      buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
      xMargin: 0,
      yMargin: 0,
      listener: null // {function} called when the button is pressed
    }, options );

        // close button shape, an 'X'
    var closeButtonShape = new Shape()
      .moveTo( -options.iconLength, -options.iconLength )
      .lineTo( options.iconLength, options.iconLength )
      .moveTo( options.iconLength, -options.iconLength )
      .lineTo( -options.iconLength, options.iconLength );

    options.content = new Path( closeButtonShape, {
      stroke: 'black',
      lineCap: 'round',
      lineWidth: 2
    } );

    RectangularPushButton.call( this, options );
  }

  sceneryPhet.register( 'CloseButton2', CloseButton2 );

  return inherit( RectangularPushButton, CloseButton2 );
} );
