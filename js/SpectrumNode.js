// Copyright 2014-2018, University of Colorado Boulder

/**
 * SpectrumNode displays a spectrum from one value to another.  The displayed colors are computed by a
 * required valueToColor function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Util = require( 'DOT/Util' );

  /**
   * Slider track that displays the visible spectrum.
   *
   * @param {Object} config
   * @constructor
   */
  function SpectrumNode( config ) {

    config = _.extend( {
      size: new Dimension2( 150, 30 ),
      minValue: 0,
      maxValue: 1,
      valueToColor: null // {function} - @required, maps value => Color
    }, config );

    // validate values
    assert && assert( config.minValue < config.maxValue, 'min should be less than max' );
    assert && assert( !!config.valueToColor, 'valueToColor is required' );

    // Draw the spectrum directly to a canvas, to improve performance.
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( '2d' );
    canvas.width = config.size.width;
    canvas.height = config.size.height;

    // map position to wavelength
    for ( var i = 0; i < config.size.width; i++ ) {
      var value = Util.clamp( Util.linear( 0, config.size.width, config.minValue, config.maxValue, i ), config.minValue, config.maxValue );
      context.fillStyle = config.valueToColor( value ).toCSS();
      context.fillRect( i, 0, 1, config.size.height );
    }

    Image.call( this, canvas.toDataURL(), config );

    // since the Image's bounds aren't immediately computed, we override it here
    this.setLocalBounds( new Bounds2( 0, 0, config.size.width, config.size.height ) );
  }

  sceneryPhet.register( 'SpectrumNode', SpectrumNode );

  return inherit( Image, SpectrumNode );
} );
