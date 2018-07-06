// Copyright 2018, University of Colorado Boulder

/**
 * QUnit tests for MultiLineText
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );

  QUnit.module( 'MultiLineText' );

  QUnit.test( 'Test setText', function( assert ) {
    //assert.equal( p.changedEmitter.listeners.length, 2, 'should have removed an item' );
    var multiLineText = new MultiLineText( 'test' );
    assert.ok( true, 'constructed a MultiLineText' );
    multiLineText.setText( 'tes' );
    multiLineText.setText( 't\ne' );
    multiLineText.setText( 'tes' );
  } );
} );