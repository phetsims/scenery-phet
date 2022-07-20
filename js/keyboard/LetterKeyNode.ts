// Copyright 2017-2022, University of Colorado Boulder

/**
 * LetterKeyNode looks like a keyboard key with a single letter. By default, a letter key is square, with a bit less
 * horizontal padding than a key with a full word.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import sceneryPhet from '../sceneryPhet.js';
import TextKeyNode, { TextKeyNodeOptions } from './TextKeyNode.js';

type SelfOptions = EmptySelfOptions;

export type LetterKeyNodeOptions = SelfOptions & TextKeyNodeOptions;

export default class LetterKeyNode extends TextKeyNode {

  public constructor( letter: string, providedOptions?: LetterKeyNodeOptions ) {

    const options = optionize<LetterKeyNodeOptions, SelfOptions, TextKeyNodeOptions>()( {
      xPadding: 5,
      forceSquareKey: true
    }, providedOptions );

    super( letter, options );
  }
}

sceneryPhet.register( 'LetterKeyNode', LetterKeyNode );