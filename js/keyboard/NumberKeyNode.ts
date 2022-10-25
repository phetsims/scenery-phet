// Copyright 2020-2022, University of Colorado Boulder

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
}

sceneryPhet.register( 'NumberKeyNode', NumberKeyNode );