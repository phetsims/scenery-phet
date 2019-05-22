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
  const Bounds2 = require( 'DOT/Bounds2' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Util = require( 'DOT/Util' );


  class SpectrumNode extends Image {

    /**
     * @param {Object} [options]
     * @constructor
     */
    constructor( options ) {

      options = _.extend( {
        size: new Dimension2( 150, 30 ),
        minValue: 0,
        maxValue: 1,
        valueToColor: null // {function} - @required, maps value => Color
      }, options );

      // validate values
      assert && assert( options.minValue < options.maxValue, 'min should be less than max' );
      assert && assert( !!options.valueToColor, 'valueToColor is required' );

      // Draw the spectrum directly to a canvas, to improve performance.
      const canvas = document.createElement( 'canvas' );
      const context = canvas.getContext( '2d' );
      canvas.width = options.size.width;
      canvas.height = options.size.height;

      // map position to wavelength
      for ( let i = 0; i < options.size.width; i++ ) {
        const value = Util.clamp( Util.linear( 0, options.size.width, options.minValue, options.maxValue, i ), options.minValue, options.maxValue );
        context.fillStyle = options.valueToColor( value ).toCSS();
        context.fillRect( i, 0, 1, options.size.height );
      }

      super( canvas.toDataURL(), options );

      // since the Image's bounds aren't immediately computed, we override it here
      this.setLocalBounds( new Bounds2( 0, 0, options.size.width, options.size.height ) );
    }
  }

  return sceneryPhet.register( 'SpectrumNode', SpectrumNode );
} );
