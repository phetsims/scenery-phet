// Copyright 2020-2022, University of Colorado Boulder

/**
 * NumberKeyNode looks like a keyboard key with a single letter. See LetterKeyNode for implementation details. This is
 * a useful type to separate out usages for numbers in case we need to tweak all of them in the future.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../sceneryPhet.js';
import LetterKeyNode from './LetterKeyNode.js';

export default class NumberKeyNode extends LetterKeyNode {}

sceneryPhet.register( 'NumberKeyNode', NumberKeyNode );