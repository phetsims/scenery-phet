// Copyright 2022-2023, University of Colorado Boulder

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

  const ZERO_EXPONENT = 0;

  // For exponent === 0, we use phet.dot.Utils.toFixed to create the mantissa. This example adds zeros to decimal places.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.8, {
    exponent: ZERO_EXPONENT,
    mantissaDecimalPlaces: 3
  } ), { mantissa: '424.800', exponent: '0' } );

  // For exponent === 0, we use phet.dot.Utils.toFixed to create the mantissa. This example rounds decimal places.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.856, {
    exponent: ZERO_EXPONENT,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '424.9', exponent: '0' } );

  // This case was reported in https://github.com/phetsims/scenery-phet/issues/747, with bad mantissa '35.85'
  // assert.deepEqual( ScientificNotationNode.toScientificNotation( 35.855, {
  //   exponent: ZERO_EXPONENT,
  //   mantissaDecimalPlaces: 2
  // } ), { mantissa: '35.86', exponent: '0' } );
} );

QUnit.test( 'exponent === null', assert => {

  const NULL_EXPONENT = null;

  // This case was reported in https://github.com/phetsims/build-a-nucleus/issues/24 with bad mantissa '4.3'
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.8, {
    exponent: NULL_EXPONENT,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '4.2', exponent: '2' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 425.8, {
    exponent: NULL_EXPONENT,
    mantissaDecimalPlaces: 2
  } ), { mantissa: '4.26', exponent: '2' } );

  // This case was reported in https://github.com/phetsims/build-a-nucleus/issues/24, with bad mantissa '9.7'
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: NULL_EXPONENT,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '9.6', exponent: '3' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9658, {
    exponent: NULL_EXPONENT,
    mantissaDecimalPlaces: 2
  } ), { mantissa: '9.66', exponent: '3' } );

  // This case was reported in https://github.com/phetsims/ph-scale/issues/235, with bad exponent sign.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 1.0484477197064377e-7, {
    exponent: NULL_EXPONENT,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '1.0', exponent: '-7' } );
} );

QUnit.test( 'exponent !== 0 && exponent !== null', assert => {

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: 1,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '964.8', exponent: '1' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: 2,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '96.5', exponent: '2' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: 3,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '9.6', exponent: '3' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: 3,
    mantissaDecimalPlaces: 2
  } ), { mantissa: '9.65', exponent: '3' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: 4,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '1.0', exponent: '4' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: 4,
    mantissaDecimalPlaces: 3
  } ), { mantissa: '0.965', exponent: '4' } );

  assert.deepEqual( ScientificNotationNode.toScientificNotation( 9648, {
    exponent: 5,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '0.1', exponent: '5' } );
} );