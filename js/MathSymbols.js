// Copyright 2018-2019, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // strings
  var symbolOhmsString = require( 'string!SCENERY_PHET/symbol.ohms' );
  var symbolResistivityString = require( 'string!SCENERY_PHET/symbol.resistivity' );

  var MathSymbols = {

    //==================================================================================================================
    // Symbols in this section are universal and are NOT translatable.  A decision to promote any of these to
    // translatable requires discussion with PhET team members and subject-matter experts.
    //==================================================================================================================

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

    // Greek characters
    THETA: '\u03b8',

    // Used to symbolize 'no value', e.g. on a meter that is not reading anything.
    // See https://github.com/phetsims/scenery-phet/issues/431
    NO_VALUE: '\u2014', // em dash

    //==================================================================================================================
    // Symbols in this section represent logical concepts and ARE translatable.
    // See https://github.com/phetsims/resistance-in-a-wire/issues/187
    //==================================================================================================================

    // universal units
    OHMS: symbolOhmsString,
    RESISTIVITY: symbolResistivityString
  };

  return sceneryPhet.register( 'MathSymbols', MathSymbols );
} );
 