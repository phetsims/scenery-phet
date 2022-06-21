// Copyright 2022, University of Colorado Boulder

/**
 * QUnit tests for ScientificNotationNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScientificNotationNode from './ScientificNotationNode.js';

QUnit.module( 'ScientificNotationNode' );

QUnit.test( 'value === 0', assert => {

  // For zero value, the specified exponent should be used.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 0, {
    exponent: 2,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '0.0', exponent: '2' } );

  // For zero value, if no exponent is requested, exponent should be 0.
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 0, {
    exponent: null,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '0.0', exponent: '0' } );
} );

QUnit.test( 'exponent === 0', assert => {

  // For exponent zero, we use dot.Utils.toFixed to create the mantissa
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.8, {
    exponent: 0,
    mantissaDecimalPlaces: 3
  } ), { mantissa: '424.800', exponent: '0' } );

  // For exponent zero, we use dot.Utils.toFixed to create the mantissa
  assert.deepEqual( ScientificNotationNode.toScientificNotation( 424.856, {
    exponent: 0,
    mantissaDecimalPlaces: 1
  } ), { mantissa: '424.9', exponent: '0' } );
} );