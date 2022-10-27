// Copyright 2017-2022, University of Colorado Boulder

/**
 * LetterKeyNode is a TextKeyNode with layout and spacing defaults that look best for a single letter. A letter key is
 * square and that looks best for a single character.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode, { TextKeyNodeOptions } from './TextKeyNode.js';

type SelfOptions = EmptySelfOptions;

export type LetterKeyNodeOptions = SelfOptions & StrictOmit<TextKeyNodeOptions, 'forceSquareKey'>;

export default class LetterKeyNode extends TextKeyNode {

  public constructor( letter: string, providedOptions?: LetterKeyNodeOptions ) {
    assert && assert( letter.length === 1, 'letter for LetterKeyNode needs to be a single character.' );

    const options = optionize<LetterKeyNodeOptions, SelfOptions, TextKeyNodeOptions>()( {
      xPadding: 5,
      forceSquareKey: true
    }, providedOptions );

    super( letter, options );
  }
}

sceneryPhet.register( 'LetterKeyNode', LetterKeyNode );