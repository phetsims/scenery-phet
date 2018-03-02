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
    PLUS: '\u002b',
    MINUS: '\u2212',
    TIMES: '\u00d7',
    DIVIDE: '\u00f7',

    // unary operators
    UNARY_PLUS: '\u002b', // currently the same as PLUS
    UNARY_MINUS: '\u002d', // shorter than MINUS, a PhET-specific convention

    // relational operators
    EQUAL_TO: '\u003d',
    NOT_EQUAL_TO: '\u2260',
    GREATER_THAN: '\u003e',
    LESS_THAN: '\u003c'

  };

  sceneryPhet.register( 'MathSymbols', MathSymbols );

  return MathSymbols;
} );
 