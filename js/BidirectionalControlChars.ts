// Copyright 2025, University of Colorado Boulder

/**
 * Standard Unicode characters used for controlling the direction of string rendering in PhET sims. Sims should use
 * these so that the code is consistent and easy to change in the future.
 * 
 * Note: These are all 'as const' to support strong typing. See NUMBER_SUITE_COMMON/SymbolType for an example.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import sceneryPhet from './sceneryPhet.js';

const BidirectionalControlChars = {

  // According to unicode-explorer.com, these characters are the preferred way to control the direction of text
  // rendering in bidirectional strings.
  LRI: '\u2066' as const, // Left-to-Right Isolate, used to isolate a left-to-right section in a bidirectional string
  RLI: '\u2067' as const, // Right-to-Left Isolate, used to isolate a right-to-left section in a bidirectional string
  PDI: '\u2069' as const, // Pop Directional Isolate, used to end an isolated section in a bidirectional string

  // According to unicode-explorer.com, these characters can be used but as of Unicode 6.3 they are discouraged in favor
  // of the LRI, RLI, and PDI characters above. They are included here for compatibility with older code.
  LRE: '\u202A' as const, // Left-to-Right Embedding, used to start a left-to-right section in a bidirectional string
  RLE: '\u202B' as const, // Right-to-Left Embedding, used to start a right-to-left section in a bidirectional string
  PDF: '\u202C' as const // Pop Directional Formatting, used to end a bidirectional section
};

sceneryPhet.register( 'BidirectionalControlChars', BidirectionalControlChars );
export default BidirectionalControlChars;