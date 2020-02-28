// Copyright 2014-2020, University of Colorado Boulder

/**
 * SpectrumNode displays a spectrum from one value to another.  The displayed colors are computed by a
 * required valueToColor function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Utils from '../../dot/js/Utils.js';
import merge from '../../phet-core/js/merge.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import Color from '../../scenery/js/util/Color.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_SIZE = new Dimension2( 150, 30 );
const DEFAULT_VALUE_TO_COLOR = value => new Color( 255 * value, 255 * value, 255 * value ); // grayscale spectrum

class SpectrumNode extends Node {

  /**
   * @param {Object} [options]
   * @constructor
   */
  constructor( options ) {

    options = merge( {

      // {Dimension2} dimensions of the spectrum
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

    // Size the canvas a bit larger, using integer width and height, as required by canvas.
    canvas.width = 1.1 * Math.ceil( options.size.width );
    canvas.height = 1.1 * Math.ceil( options.size.height );

    // Draw the spectrum.
    for ( let i = 0; i < canvas.width; i++ ) {
      const value = Utils.clamp( Utils.linear( 0, canvas.width, options.minValue, options.maxValue, i ), options.minValue, options.maxValue );
      context.fillStyle = options.valueToColor( value ).toCSS();
      context.fillRect( i, 0, 1, canvas.height );
    }

    const image = new Image( canvas.toDataURL() );

    // Since the Image's bounds aren't immediately computed, set them here.
    image.setLocalBounds( new Bounds2( 0, 0, canvas.width, canvas.height ) );

    // Scale the Image to match the requested options.size
    image.setScaleMagnitude( options.size.width / canvas.width, options.size.height / canvas.height );

    assert && assert( !options.children, 'SpectrumNode sets options' );
    options.children = [ image ];

    super( options );
  }
}

/**
 * @static
 * @public
 */
SpectrumNode.DEFAULT_VALUE_TO_COLOR = DEFAULT_VALUE_TO_COLOR;

sceneryPhet.register( 'SpectrumNode', SpectrumNode );
export default SpectrumNode;