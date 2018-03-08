// Copyright 2018, University of Colorado Boulder

/**
 * Standard math symbols used in PhET sims.
 * Sims should use these so that they are easy to change in the future.
 * Do NOT inline characters in string concatenations.
 *
 * E.g. for an expression that involves the addition of 2 values:
 * Good:  var expressionString = value1 + ' ' + MathSymbols.PLUS + ' ' +  value2;
 * Bad:   var expressionString = value1 + ' \u002b ' + value2;
 * Wrong: var expressionString = value1 + ' + ' + value2;
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
    MINUS: '\u2212', // longer than '-'
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
    LESS_THAN: '<'

  };

  sceneryPhet.register( 'MathSymbols', MathSymbols );

  return MathSymbols;
} );
 