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
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Util = require( 'DOT/Util' );

  // constants
  const DEFAULT_SIZE = new Dimension2( 150, 30 );
  const DEFAULT_VALUE_TO_COLOR = value => new Color( 255 * value, 255 * value, 255 * value ); // black to white

  class SpectrumNode extends CanvasNode {

    /**
     * @param {Object} [options]
     * @constructor
     */
    constructor( options ) {

      options = _.extend( {

        // {Dimension2} desired size of the Node. Actual size will be set to integer values via Math.ceil for Canvas
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

      super();

      // Size the canvas
      this.setCanvasBounds( new Bounds2( 0, 0, options.size.width, options.size.height ) );

      // @private
      this.size = options.size;
      this.valueToColor = options.valueToColor;
      this.minValue = options.minValue;
      this.maxValue = options.maxValue;

      // Mutate options after setCanvasBounds, or transform options will fail because the Node has no bounds.
      this.mutate( options );
    }

    /**
     * Draws the spectrum.  Call invalidatePaint if you need this to be called explicitly.
     * @param {CanvasRenderingContext2D} context
     * @public
     * @override
     */
    paintCanvas( context ) {
      for ( let i = 0; i < this.size.width; i++ ) {
        let value = Util.linear( 0, this.size.width, this.minValue, this.maxValue, i );
        value = Util.clamp( value, this.minValue, this.maxValue );
        context.fillStyle = this.valueToColor( value ).toCSS();
        context.fillRect( i, 0, 1, this.size.height );
      }
    }
  }

  return sceneryPhet.register( 'SpectrumNode', SpectrumNode );
} );
