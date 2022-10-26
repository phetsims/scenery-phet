// Copyright 2013-2022, University of Colorado Boulder

/**
 * DO NOT USE IN NEW DEVELOPMENT - see deprecation notice below
 *
 * MultiLine plain text.
 * Lines are separated with the newline character '\n', which will be converted to '<br>'.
 * This was reimplemented as a subclass of RichText, see https://github.com/phetsims/scenery-phet/issues/392.
 *
 * NOTE: While PhET does not typically convert deprecated code to TypeScript, this class is unlikely to go away,
 * due to the cost of modifying translations. So it was converted to TypeScript on 7/22/2022.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import deprecationWarning from '../../phet-core/js/deprecationWarning.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { RichText, RichTextOptions } from '../../scenery/js/imports.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = EmptySelfOptions;
export type MultiLineTextOptions = SelfOptions & RichTextOptions;

/**
 * @deprecated please use SCENERY/nodes/RichText
 */
class MultiLineText extends RichText {

  /**
   * @param text - newlines will be replaced with '<br>'.
   * @param [providedOptions]
   */
  public constructor( text: string, providedOptions: MultiLineTextOptions ) {
    assert && deprecationWarning( 'MultiLineText is deprecated, please use RichText instead' );

    const options = optionize<MultiLineTextOptions, SelfOptions, RichTextOptions>()( {

      // RichTextOptions
      align: 'center',
      font: new PhetFont()
    }, providedOptions );

    super( MultiLineText.replaceNewlines( text ), options );
  }

  /**
   * Sets the text, replacing newlines with '<br>'.
   */
  public override setText( text: string | number ): this {
    return super.setText( MultiLineText.replaceNewlines( text ) );
  }

  /**
   * Replaces newline characters with '<br>'.
   */
  public static replaceNewlines( text: string | number ): string {
    return text.toString().replace( /\n/g, '<br>' );
  }
}

sceneryPhet.register( 'MultiLineText', MultiLineText );
export default MultiLineText;