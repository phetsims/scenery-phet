// Copyright 2020, University of Colorado Boulder

/**
 * QUnit tests for StopwatchNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StopwatchNode from './StopwatchNode.js';

QUnit.module( 'StopwatchNode' );

QUnit.test( 'Decimal Formatting', assert => {
  assert.equal( StopwatchNode.getDecimalPlaces( 123.123, 1 ), '.1' );
  assert.equal( StopwatchNode.getDecimalPlaces( 9.114324529783822, 2 ), '.11' );
  assert.equal( StopwatchNode.getDecimalPlaces( 10.371315125053542, 1 ), '.4' );
  assert.equal( StopwatchNode.getDecimalPlaces( 7.644452643958845, 3 ), '.644' );
  assert.equal( StopwatchNode.getDecimalPlaces( 7.64455555, 3 ), '.645' );
  assert.equal( StopwatchNode.getDecimalPlaces( 5.245326003558443, 1 ), '.2' );
  assert.equal( StopwatchNode.getDecimalPlaces( 2.3999849450475925, 3 ), '.400' );
  assert.equal( StopwatchNode.getDecimalPlaces( 5.326367375905868, 3 ), '.326' );
  assert.equal( StopwatchNode.getDecimalPlaces( 5.357599160981993, 4 ), '.3576' );
  assert.equal( StopwatchNode.getDecimalPlaces( 7.5962564199877125, 2 ), '.60' );
  assert.equal( StopwatchNode.getDecimalPlaces( 10.6347712011732, 3 ), '.635' );
  assert.equal( StopwatchNode.getDecimalPlaces( 6.805918741130546, 4 ), '.8059' );
} );