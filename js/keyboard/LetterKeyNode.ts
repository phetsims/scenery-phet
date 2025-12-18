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
import SceneryPhetFluent from '../SceneryPhetFluent.js';
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
    return new LetterKeyNode( SceneryPhetFluent.key.aStringProperty, providedOptions );
  }

  public static b( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.bStringProperty, providedOptions );
  }

  public static c( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.cStringProperty, providedOptions );
  }

  public static d( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.dStringProperty, providedOptions );
  }

  public static e( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.eStringProperty, providedOptions );
  }

  public static f( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.fStringProperty, providedOptions );
  }

  public static g( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.gStringProperty, providedOptions );
  }

  public static h( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.hStringProperty, providedOptions );
  }

  public static i( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.iStringProperty, providedOptions );
  }

  public static j( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.jStringProperty, providedOptions );
  }

  public static k( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.kStringProperty, providedOptions );
  }

  public static l( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.lStringProperty, providedOptions );
  }

  public static m( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.mStringProperty, providedOptions );
  }

  public static n( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.nStringProperty, providedOptions );
  }

  public static o( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.oStringProperty, providedOptions );
  }

  public static p( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.pStringProperty, providedOptions );
  }

  public static q( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.qStringProperty, providedOptions );
  }

  public static r( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.rStringProperty, providedOptions );
  }

  public static s( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.sStringProperty, providedOptions );
  }

  public static t( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.tStringProperty, providedOptions );
  }

  public static u( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.uStringProperty, providedOptions );
  }

  public static v( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.vStringProperty, providedOptions );
  }

  public static w( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.wStringProperty, providedOptions );
  }

  public static x( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.xStringProperty, providedOptions );
  }

  public static y( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.yStringProperty, providedOptions );
  }

  public static z( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.zStringProperty, providedOptions );
  }

  public static zero( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.zeroStringProperty, providedOptions );
  }

  public static one( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.oneStringProperty, providedOptions );
  }

  public static two( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.twoStringProperty, providedOptions );
  }

  public static three( providedOptions?: LetterKeyNodeOptions ): KeyNode {
    return new LetterKeyNode( SceneryPhetFluent.key.threeStringProperty, providedOptions );
  }
}

sceneryPhet.register( 'LetterKeyNode', LetterKeyNode );
