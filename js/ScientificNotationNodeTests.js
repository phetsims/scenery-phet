// Copyright 2022, University of Colorado Boulder

/**
 * QUnit tests for ScientificNotationNode.toScientificNotation, the part of ScientificNotationNode that is unit-testable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScientificNotationNode from './ScientificNotationNode.js';

QUnit.module( 'ScientificNotationNode' );

QUnit.test( 'value === 0', assert => {

  // For value === 0, the specified exponent should be used.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 0, {
    exponent: 2,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '0.0', exponent: '2' } );

  // For value === 0, if no exponent is requested, exponent should be 0.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 0, {
    exponent: null,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '0.0', exponent: '0' } );
} );

QUnit.test( 'exponent === 0', assert => {

  // For exponent === 0, we use dot.Utils.toFixed to create the mantissa. This example adds zeros to decimal places.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.8, {
    exponent: 0,
    mantissaDecimalPlaces: 3
  } ), { mantissa: '424.800', exponent: '0' } );

  // For exponent === 0, we use dot.Utils.toFixed to create the mantissa. This example rounds decimal places.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.856, {
    exponent: 0,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '424.9', exponent: '0' } );
} );

QUnit.test( 'rounding', assert => {

  // This case was reported in https://github.com/phetsims/build-a-nucleus/issues/24 with bad mantissa 4.3
  // assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.8, {
  //   exponent: null,
  //   mantissaDecimalPlaces: 1
  // } ), { mantissa: '4.2', exponent: '2' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 425.8, {
    exponent: null,
    mantissaDecimalPlaces: 2
  } ), { mantissa: '4.26', exponent: '2' } );

  // This case was reported in https://github.com/phetsims/build-a-nucleus/issues/24, with bad mantissa 9.7
  // assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
  //   exponent: null,
  //   mantissaDecimalPlaces: 1
  // } ), { mantissa: '9.6', exponent: '3' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9658, {
    exponent: null,
    mantissaDecimalPlaces: 2
  } ), { mantissa: '9.66', exponent: '3' } );
} );