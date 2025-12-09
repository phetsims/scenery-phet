// Copyright 2020-2025, University of Colorado Boulder

/**
 * NumberKeyNode looks like a keyboard key with a single letter. See LetterKeyNode for implementation details. This is
 * a useful type to separate out usages for numbers in case we need to tweak all of them in the future.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import sceneryPhet from '../sceneryPhet.js';
import LetterKeyNode, { LetterKeyNodeOptions } from './LetterKeyNode.js';

type SelfOptions = EmptySelfOptions;

export type NumberKeyNodeOptions = SelfOptions & LetterKeyNodeOptions;

export default class NumberKeyNode extends LetterKeyNode {
  public constructor( value: number, providedOptions?: NumberKeyNodeOptions ) {
    assert && assert( value >= 0 && Number.isInteger( value ) );
    super( value.toString(), providedOptions );
  }

  /**
   * For convenience, a static factory method that creates a NumberKeyNode from a number.
   */
  public static fromNumber( value: number, providedOptions?: NumberKeyNodeOptions ): NumberKeyNode {
    return new NumberKeyNode( value, providedOptions );
  }
}

sceneryPhet.register( 'NumberKeyNode', NumberKeyNode );