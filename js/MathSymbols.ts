// Copyright 2018-2023, University of Colorado Boulder

/**
 * Standard math symbols used in PhET sims.
 * Sims should use these so that they are easy to change in the future.
 * Do NOT inline characters in string concatenations.
 *
 * E.g. for an expression that involves the multiplication of 2 values:
 * Good:  var expressionString = value1 + ' ' + MathSymbols.TIMES + ' ' +  value2;
 * Bad:   var expressionString = value1 + ' \u00d7 ' + value2;
 * Wrong: var expressionString = value1 + ' x ' + value2;
 *
 * Note: These are all 'as const' to support strong typing. See NUMBER_SUITE_COMMON/SymbolType for an example.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import sceneryPhet from './sceneryPhet.js';

const MathSymbols = {

  //==================================================================================================================
  // Symbols in this section are universal and are NOT translatable.  A decision to promote any of these to
  // translatable requires discussion with PhET team members and subject-matter experts.
  //==================================================================================================================

  // binary operators
  PLUS: '+' as const,
  MINUS: '\u2212' as const, // longer than UNARY_MINUS (PhET-specific convention)
  TIMES: '\u00d7' as const,
  DIVIDE: '\u00f7' as const,
  DOT: '\u22c5' as const,

  // unary operators
  UNARY_PLUS: '+' as const,
  UNARY_MINUS: '-' as const, // shorter than MINUS (PhET-specific convention)

  // relational operators
  EQUAL_TO: '=' as const,
  NOT_EQUAL_TO: '\u2260' as const,
  GREATER_THAN: '>' as const,
  LESS_THAN: '<' as const,
  LESS_THAN_OR_EQUAL: '\u2264' as const,
  GREATER_THAN_OR_EQUAL: '\u2265' as const,

  // other math symbols
  PERCENT: '%' as const,
  INFINITY: '\u221E' as const,
  PI: '\u03c0' as const,
  PLUS_MINUS: '\u00B1' as const,

  // Greek characters
  THETA: '\u03b8' as const,

  // Used to symbolize 'no value', e.g. on a meter that is not reading anything.
  // See https://github.com/phetsims/scenery-phet/issues/431
  NO_VALUE: '\u2014' as const, // em dash

  DEGREES: '\u00B0' as const
};

sceneryPhet.register( 'MathSymbols', MathSymbols );
export default MathSymbols;