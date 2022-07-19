// Copyright 2016-2022, University of Colorado Boulder

/**
 * MathSymbolFont is the font used for math symbols (e.g. 'x', 'y') in PhET sims.
 * See https://github.com/phetsims/scenery/issues/545
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import EmptyObjectType from '../../phet-core/js/types/EmptyObjectType.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Font, FontOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

const DEFAULT_STYLE = 'italic';

type SelfOptions = EmptyObjectType;

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
}

sceneryPhet.register( 'MathSymbolFont', MathSymbolFont );