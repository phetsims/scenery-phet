// Copyright 2018, University of Colorado Boulder

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
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  var MathSymbols = {

    // binary operators
    PLUS: '+',
    MINUS: '\u2212', // longer than UNARY_MINUS (PhET-specific convention)
    TIMES: '\u00d7',
    DIVIDE: '\u00f7',
    DOT: '\u22c5',

    // unary operators
    UNARY_PLUS: '+',
    UNARY_MINUS: '-', // shorter than MINUS (PhET-specific convention)

    // relational operators
    EQUAL_TO: '=',
    NOT_EQUAL_TO: '\u2260',
    GREATER_THAN: '>',
    LESS_THAN: '<',

    // other math symbols
    PERCENT: '%',
    INFINITY: '\u221E',
    PI: '\u03c0',
    PLUS_MINUS: '\u00B1',
    THETA: '\u03b8',
    OHMS: '\u2126',
    RHO: '\u03C1'
  };

  sceneryPhet.register( 'MathSymbols', MathSymbols );

  return MathSymbols;
} );
 