// Copyright 2024-2025, University of Colorado Boulder

/**
 * StringDisplay displays the value of a string or TReadOnlyProperty<string> on a background. The background can
 * be a fixed size, or it can dynamically size itself to fit the displayed string.
 *
 * StringDisplay is a nice alternative to NumberDisplay, when the thing you're displaying is not a number,
 * or when formatting is more-cleanly implemented using a TReadOnlyProperty<string>.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../scenery/js/nodes/Rectangle.js';
import RichText, { RichTextOptions } from '../../scenery/js/nodes/RichText.js';
import Text, { TextOptions } from '../../scenery/js/nodes/Text.js';
import sceneryPhet from './sceneryPhet.js';

type AlignX = 'left' | 'right' | 'center';
type AlignY = 'top' | 'bottom' | 'center';

type SelfOptions = {

  // Fixed size of the background.
  // If provided, the text will be scaled to fit the background.
  // If not provided, the background will be dynamically sized to fix the text.
  size?: Dimension2;

  // Margins inside the background
  xMargin?: number;
  yMargin?: number;

  // How the string is aligned in the background
  alignX?: AlignX;
  alignY?: AlignY;

  // Options passed to the background Rectangle
  rectangleOptions?: RectangleOptions;

  // true = use RichText, false = use Text
  useRichText?: boolean;

  // Options passed to the RichText that displays the string
  textOptions?: StrictOmit<TextOptions | RichTextOptions, 'maxWidth' | 'maxHeight'>;
};

export type StringDisplayOptions = SelfOptions & NodeOptions;

export default class StringDisplay extends Node {

  private readonly disposeStringDisplay: () => void;

  public constructor( string: TReadOnlyProperty<string> | string, providedOptions?: StringDisplayOptions ) {

    const options = optionize<StringDisplayOptions, StrictOmit<SelfOptions, 'size' | 'textOptions' | 'rectangleOptions'>, NodeOptions>()( {

      // SelfOptions
      xMargin: 2,
      yMargin: 2,
      alignX: 'right',
      alignY: 'center',
      useRichText: false
    }, providedOptions );

    // If size was not specified, background will be sized to fit the text by text.boundsProperty listener.
    const backgroundWidth = ( options.size ) ? options.size.width : 1;
    const backgroundHeight = ( options.size ) ? options.size.height : 1;
    const background = new Rectangle( 0, 0, backgroundWidth, backgroundHeight,
      combineOptions<RectangleOptions>( {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 4
      }, options.rectangleOptions ) );

    // If size was specified, text will be scale to fit the background.
    const textMaxWidth = ( options.size ) ? options.size.width - ( 2 * options.xMargin ) : null;
    const textMaxHeight = ( options.size ) ? options.size.height - ( 2 * options.yMargin ) : null;
    const textOptions = combineOptions<RichTextOptions>( {
      maxWidth: textMaxWidth,
      maxHeight: textMaxHeight
    }, options.textOptions );
    const text = ( options.useRichText ) ? new RichText( string, textOptions ) : new Text( string, textOptions );

    text.boundsProperty.link( textBounds => {

      // If a fixed size was not specified, dynamically size the background to fit the text.
      if ( !options.size ) {
        const width = textBounds.width + ( 2 * options.xMargin );
        const height = textBounds.height + ( 2 * options.yMargin );
        background.setRect( 0, 0, width, height );
      }

      // Align the text in the background.
      alignText( text, background, options.alignX, options.alignY, options.xMargin, options.yMargin );
    } );

    options.children = [ background, text ];

    super( options );

    this.disposeStringDisplay = () => {
      background.dispose(); // may be listening to TReadOnlyProperty<TColor>
      text.dispose(); // is listening to a TReadOnlyProperty<string>
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeStringDisplay();
  }
}

function alignText( text: Node, background: Node, alignX: AlignX, alignY: AlignY, xMargin: number, yMargin: number ): void {

  // x align
  if ( alignX === 'right' ) {
    text.right = background.right - xMargin;
  }
  else if ( alignX === 'left' ) {
    text.left = background.left + xMargin;
  }
  else {
    text.centerX = background.centerX;
  }

  // y align
  if ( alignY === 'top' ) {
    text.top = background.top + yMargin;
  }
  else if ( alignY === 'bottom' ) {
    text.bottom = background.bottom - yMargin;
  }
  else {
    text.centerY = background.centerY;
  }
}

sceneryPhet.register( 'StringDisplay', StringDisplay );