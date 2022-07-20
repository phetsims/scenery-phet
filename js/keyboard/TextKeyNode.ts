// Copyright 2017-2022, University of Colorado Boulder

/**
 * TextKeyNode is a keyboard key with text that is generally more than a single character. By default, a key
 * with text is more rectangular than a letter key (LetterKeyNode), and the key compactly surrounds the text content.
 *
 * @author Jesse Greenberg
 */

import optionize from '../../../phet-core/js/optionize.js';
import { Font, IColor, RichText } from '../../../scenery/js/imports.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import KeyNode, { KeyNodeOptions } from './KeyNode.js';

type SelfOptions = {
  font?: Font;
  fill?: IColor;
  textMaxWidth?: number;
};

export type TextKeyNodeOptions = SelfOptions & KeyNodeOptions;

export default class TextKeyNode extends KeyNode {

  public constructor( string: string, providedOptions?: TextKeyNodeOptions ) {

    // margins, width, and height in ScreenView coordinates
    const options = optionize<TextKeyNodeOptions, SelfOptions, KeyNodeOptions>()( {

      // text options
      font: new PhetFont( { size: 16 } ),
      fill: 'black',
      textMaxWidth: 45, // Long keys like Space, Enter, Tab, Shift are all smaller than this.

      // by default, key should tightly surround the text, with a bit more horizontal space
      xPadding: 11

    }, providedOptions );

    // use RichText because some keys (like page up/page down/caps lock) might span multiple lines
    const textNode = new RichText( string, {
      font: options.font,
      fill: options.fill,
      maxWidth: options.textMaxWidth
    } );

    super( textNode, options );
  }

  //-------------------------------------------------------------------------------------------------
  // Static factory methods for specific text strings. For brevity, these methods have the same names
  // as their string keys. For example sceneryPhetStrings.key.alt is rendered by the alt method.
  //-------------------------------------------------------------------------------------------------

  public static alt( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.alt, providedOptions );
  }

  public static capsLock( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.capsLock, providedOptions );
  }

  public static esc( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.esc, providedOptions );
  }

  public static end( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.end, providedOptions );
  }

  public static enter( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.enter, providedOptions );
  }

  public static fn( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.fn, providedOptions );
  }

  public static home( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.home, providedOptions );
  }

  public static pageDown( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.pageDown, providedOptions );
  }

  public static pageUp( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.pageUp, providedOptions );
  }

  public static space( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.space, providedOptions );
  }

  public static shift( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.shift, providedOptions );
  }

  public static tab( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( sceneryPhetStrings.key.tab, providedOptions );
  }
}

sceneryPhet.register( 'TextKeyNode', TextKeyNode );