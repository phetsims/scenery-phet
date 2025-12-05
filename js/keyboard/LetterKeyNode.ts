// Copyright 2017-2025, University of Colorado Boulder

/**
 * LetterKeyNode is a TextKeyNode with layout and spacing defaults that look best for a single letter. A letter key is
 * square and that looks best for a single character.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import KeyNode from './KeyNode.js';
import TextKeyNode, { TextKeyNodeOptions } from './TextKeyNode.js';

type SelfOptions = EmptySelfOptions;

export type LetterKeyNodeOptions = SelfOptions & StrictOmit<TextKeyNodeOptions, 'forceSquareKey'>;

export default class LetterKeyNode extends TextKeyNode {

  public constructor( letter: string | TReadOnlyProperty<string>, providedOptions?: LetterKeyNodeOptions ) {
    const options = optionize<LetterKeyNodeOptions, SelfOptions, TextKeyNodeOptions>()( {
      xPadding: 5,
      forceSquareKey: true
    }, providedOptions );

    super( letter, options );
  }

  //-------------------------------------------------------------------------------------------------
  // Static factory methods for specific letter key strings.
  //-------------------------------------------------------------------------------------------------

  public static a( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.aStringProperty, providedOptions );
  }

  public static b( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.bStringProperty, providedOptions );
  }

  public static c( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.cStringProperty, providedOptions );
  }

  public static d( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.dStringProperty, providedOptions );
  }

  public static e( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.eStringProperty, providedOptions );
  }

  public static f( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.fStringProperty, providedOptions );
  }

  public static g( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.gStringProperty, providedOptions );
  }

  public static h( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.hStringProperty, providedOptions );
  }

  public static i( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.iStringProperty, providedOptions );
  }

  public static j( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.jStringProperty, providedOptions );
  }

  public static k( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.kStringProperty, providedOptions );
  }

  public static l( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.lStringProperty, providedOptions );
  }

  public static m( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.mStringProperty, providedOptions );
  }

  public static n( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.nStringProperty, providedOptions );
  }

  public static o( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.oStringProperty, providedOptions );
  }

  public static p( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.pStringProperty, providedOptions );
  }

  public static q( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.qStringProperty, providedOptions );
  }

  public static r( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.rStringProperty, providedOptions );
  }

  public static s( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.sStringProperty, providedOptions );
  }

  public static t( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.tStringProperty, providedOptions );
  }

  public static u( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.uStringProperty, providedOptions );
  }

  public static v( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.vStringProperty, providedOptions );
  }

  public static w( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.wStringProperty, providedOptions );
  }

  public static x( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.xStringProperty, providedOptions );
  }

  public static y( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.yStringProperty, providedOptions );
  }

  public static z( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.zStringProperty, providedOptions );
  }

  public static zero( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.zeroStringProperty, providedOptions );
  }

  public static one( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.oneStringProperty, providedOptions );
  }

  public static two( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.twoStringProperty, providedOptions );
  }

  public static three( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetStrings.key.threeStringProperty, providedOptions );
  }
}

sceneryPhet.register( 'LetterKeyNode', LetterKeyNode );
