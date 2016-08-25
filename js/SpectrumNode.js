// Copyright 2014-2016, University of Colorado Boulder

/**
 * SpectrumNode displays a rectangle of the visible spectrum.
 *
 * @author Chris Malley (PixelZoom, Inc.)
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
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  /**
   * Slider track that displays the visible spectrum.
   *
   * @param {Object} [options]
   * @constructor
   */
  function SpectrumNode( options ) {

    options = _.extend( {
      size: new Dimension2( 150, 30 ),
      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH
    }, options );

    // validate wavelengths
    assert && assert( options.minWavelength < options.maxWavelength );
    assert && assert( options.minWavelength >= VisibleColor.MIN_WAVELENGTH && options.minWavelength <= VisibleColor.MAX_WAVELENGTH );
    assert && assert( options.maxWavelength >= VisibleColor.MIN_WAVELENGTH && options.maxWavelength <= VisibleColor.MAX_WAVELENGTH );

    // Draw the spectrum directly to a canvas, to improve performance.
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( '2d' );
    canvas.width = options.size.width;
    canvas.height = options.size.height;
    for ( var i = 0; i < options.size.width; i++ ) {
      // map position to wavelength
      var wavelength = Util.clamp( Util.linear( 0, options.size.width, options.minWavelength, options.maxWavelength, i ), options.minWavelength, options.maxWavelength );
      context.fillStyle = VisibleColor.wavelengthToColor( wavelength ).toCSS();
      context.fillRect( i, 0, 1, options.size.height );
    }

    Image.call( this, canvas.toDataURL(), options );

    // since the Image's bounds aren't immediately computed, we override it here
    this.setLocalBounds( new Bounds2( 0, 0, options.size.width, options.size.height ) );
  }

  sceneryPhet.register( 'SpectrumNode', SpectrumNode );

  return inherit( Image, SpectrumNode );
} );
