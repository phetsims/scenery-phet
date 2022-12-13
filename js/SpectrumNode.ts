// Copyright 2014-2022, University of Colorado Boulder

/**
 * SpectrumNode displays a color spectrum for a range of values. By default, it maps values in the range [0,1] to
 * the grayscale spectrum. The client can provide a different range, and different method of mapping value to color.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Utils from '../../dot/js/Utils.js';
import optionize from '../../phet-core/js/optionize.js';
import { Color, Image, Node, NodeOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

const DEFAULT_SIZE = new Dimension2( 150, 30 );

type SelfOptions = {

  // dimensions of the spectrum
  size?: Dimension2;

  // maps value to Color, range of value is determined by the client
  valueToColor?: ( value: number ) => Color;

  // min value to be mapped to Color via valueToColor
  minValue?: number;

  // max value to be mapped to Color via valueToColor
  maxValue?: number;
};

export type SpectrumNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class SpectrumNode extends Node {

  // value is [0,1] and maps to the grayscale spectrum
  public static readonly DEFAULT_VALUE_TO_COLOR = ( value: number ): Color => {
    assert && assert( value >= 0 && value <= 1, `value is out of range [0,1]: ${value}` );
    return new Color( 255 * value, 255 * value, 255 * value );
  };

  public constructor( providedOptions?: SpectrumNodeOptions ) {

    const options = optionize<SpectrumNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      size: DEFAULT_SIZE,
      valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR,
      minValue: 0,
      maxValue: 1
    }, providedOptions );

    // validate option values
    assert && assert( options.minValue < options.maxValue, 'minValue should be < maxValue' );

    // Draw the spectrum directly to a canvas, to improve performance.
    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' )!;
    assert && assert( context, 'expected a CanvasRenderingContext2D' );

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

    options.children = [ image ];

    super( options );
  }
}

sceneryPhet.register( 'SpectrumNode', SpectrumNode );