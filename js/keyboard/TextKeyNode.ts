// Copyright 2017-2022, University of Colorado Boulder

/**
 * TextKeyNode is a keyboard key with text that is generally more than a single character. By default, a key
 * with text is more rectangular than a letter key (LetterKeyNode), and the key compactly surrounds the text content.
 *
 * @author Jesse Greenberg
 */

import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import { Font, TColor, RichText } from '../../../scenery/js/imports.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import KeyNode, { KeyNodeOptions } from './KeyNode.js';

type SelfOptions = {
  font?: Font;
  fill?: TColor;
  textMaxWidth?: number;
};

export type TextKeyNodeOptions = SelfOptions & KeyNodeOptions;

export default class TextKeyNode extends KeyNode {

  private readonly disposeTextKeyNode: () => void;

  public constructor( string: string | TReadOnlyProperty<string>, providedOptions?: TextKeyNodeOptions ) {

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
    const text = new RichText( string, {
      font: options.font,
      fill: options.fill,
      maxWidth: options.textMaxWidth
    } );

    super( text, options );

    this.disposeTextKeyNode = () => {
      text.dispose();
    };
  }

  public override dispose(): void {
    this.disposeTextKeyNode();
    super.dispose();
  }

  //-------------------------------------------------------------------------------------------------
  // Static factory methods for specific text strings. For brevity, these methods have the same names
  // as their string keys. For example SceneryPhetStrings.key.alt is rendered by the alt method.
  //-------------------------------------------------------------------------------------------------

  public static alt( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.altStringProperty, providedOptions );
  }

  public static capsLock( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.capsLockStringProperty, providedOptions );
  }

  public static esc( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.escStringProperty, providedOptions );
  }

  public static end( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.endStringProperty, providedOptions );
  }

  public static enter( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.enterStringProperty, providedOptions );
  }

  public static fn( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.fnStringProperty, providedOptions );
  }

  public static home( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.homeStringProperty, providedOptions );
  }

  public static pageDown( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.pageDownStringProperty, providedOptions );
  }

  public static pageUp( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.pageUpStringProperty, providedOptions );
  }

  public static space( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.spaceStringProperty, providedOptions );
  }

  public static shift( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.shiftStringProperty, providedOptions );
  }

  public static tab( providedOptions?: KeyNodeOptions ): KeyNode {
    return new TextKeyNode( SceneryPhetStrings.key.tabStringProperty, providedOptions );
  }
}

sceneryPhet.register( 'TextKeyNode', TextKeyNode );