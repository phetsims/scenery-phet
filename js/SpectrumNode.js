// Copyright 2014-2019, University of Colorado Boulder

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
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Util = require( 'DOT/Util' );

  // constants
  const DEFAULT_SIZE = new Dimension2( 150, 30 );
  const DEFAULT_VALUE_TO_COLOR = value => new Color( 255 * value, 255 * value, 255 * value ); // grayscale spectrum

  class SpectrumNode extends Image {

    /**
     * @param {Object} [options]
     * @constructor
     */
    constructor( options ) {

      options = _.extend( {

        // {Dimension2} desired size of the Node. Actual size will be set to integer values via Math.ceil
        size: DEFAULT_SIZE,

        // {function(number): Color} maps value to Color
        valueToColor: DEFAULT_VALUE_TO_COLOR,

        // {number} min value to be mapped to Color via valueToColor
        minValue: 0,

        // {number} max value to be mapped to Color via valueToColor
        maxValue: 1
      }, options );

      // validate option values
      assert && assert( options.minValue < options.maxValue, 'minValue should be < maxValue' );

      // Draw the spectrum directly to a canvas, to improve performance.
      const canvas = document.createElement( 'canvas' );
      const context = canvas.getContext( '2d' );

      // Size the canvas, width and height must be integers.
      canvas.width = Math.ceil( options.size.width );
      canvas.height = Math.ceil( options.size.height );

      // Draw the spectrum.
      for ( let i = 0; i < canvas.width; i++ ) {
        const value = Util.clamp( Util.linear( 0, canvas.width, options.minValue, options.maxValue, i ), options.minValue, options.maxValue );
        context.fillStyle = options.valueToColor( value ).toCSS();
        context.fillRect( i, 0, 1, canvas.height );
      }

      super( canvas.toDataURL(), options );

      // Since the Image's bounds aren't immediately computed, we set them here.
      this.setLocalBounds( new Bounds2( 0, 0, canvas.width, canvas.height ) );
    }
  }

  return sceneryPhet.register( 'SpectrumNode', SpectrumNode );
} );
