// Copyright 2014-2018, University of Colorado Boulder

/**
 * AbstractSpectrumNode displays a spectrum from one value to another.
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
   * @param {Object} [options]
   * @constructor
   */
  function AbstractSpectrumNode( options ) {

    options = _.extend( {
      size: new Dimension2( 150, 30 ),
      minValue: 0,
      maxValue: 1,
      valueToColor: null // {function} - required, maps value => Color
    }, options );

    // validate values
    assert && assert( options.minValue < options.maxValue, 'min should be less than max' );
    assert && assert( !!options.valueToColor, 'valueToColor is required' );

    // Draw the spectrum directly to a canvas, to improve performance.
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( '2d' );
    canvas.width = options.size.width;
    canvas.height = options.size.height;

    // map position to wavelength
    for ( var i = 0; i < options.size.width; i++ ) {
      var value = Util.clamp( Util.linear( 0, options.size.width, options.minValue, options.maxValue, i ), options.minValue, options.maxValue );
      context.fillStyle = options.valueToColor( value ).toCSS();
      context.fillRect( i, 0, 1, options.size.height );
    }

    Image.call( this, canvas.toDataURL(), options );

    // since the Image's bounds aren't immediately computed, we override it here
    this.setLocalBounds( new Bounds2( 0, 0, options.size.width, options.size.height ) );
  }

  sceneryPhet.register( 'AbstractSpectrumNode', AbstractSpectrumNode );

  return inherit( Image, AbstractSpectrumNode );
} );
