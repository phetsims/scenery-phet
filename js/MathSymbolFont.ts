// Copyright 2016-2022, University of Colorado Boulder

/**
 * MathSymbolFont is the font used for math symbols (e.g. 'x', 'y') in PhET sims.
 * See https://github.com/phetsims/scenery/issues/545
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Font, FontOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

const DEFAULT_STYLE = 'italic';

type SelfOptions = EmptySelfOptions;

export type MathSymbolFontOptions = SelfOptions & StrictOmit<FontOptions, 'family'>;

export default class MathSymbolFont extends Font {

  public static readonly FAMILY = '"Times New Roman", Times, serif';

  public constructor( providedOptions?: number | string | MathSymbolFontOptions ) {

    // convenience constructor: new MathSymbolFont( {number|string} size )
    if ( typeof providedOptions === 'number' || typeof providedOptions === 'string' ) {
      providedOptions = {
        size: providedOptions
      };
    }

    const options = optionize<MathSymbolFontOptions, SelfOptions, FontOptions>()( {
      family: MathSymbolFont.FAMILY,
      style: DEFAULT_STYLE
    }, providedOptions );

    super( options );
  }

  /**
   * Converts a string to the markup needed to display that string with RichText, using the same family as MathSymbolFont.
   * @param text
   * @param [style] - see Font options.style
   */
  public static getRichTextMarkup( text: string, style = DEFAULT_STYLE ): string {
    assert && assert( Font.isFontStyle( style ), `invalid style: ${style}` );
    return StringUtils.fillIn( '<span style=\'font-family: {{family}};font-style: {{style}}\'>{{text}}</span>', {
      family: MathSymbolFont.FAMILY,
      style: style,
      text: text
    } );
  }

  /**
   * Wraps a dynamic string in RichText that will display the string in the same font as MathSymbolFont.
   */
  public static createDerivedProperty( symbolStringProperty: TReadOnlyProperty<string>, style = DEFAULT_STYLE ): TReadOnlyProperty<string> {
    return new DerivedProperty( [ symbolStringProperty ],
      symbolString => MathSymbolFont.getRichTextMarkup( symbolString, style ) );
  }
}

sceneryPhet.register( 'MathSymbolFont', MathSymbolFont );