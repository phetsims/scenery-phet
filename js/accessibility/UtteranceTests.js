// Copyright 2018-2019, University of Colorado Boulder

/**
 * QUnit tests for Utterance and utteranceQueue
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ariaHerald = require( 'SCENERY_PHET/accessibility/ariaHerald' );
  const timer = require( 'AXON/timer' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  let sleepTiming = null;

  // helper es6 functions from  https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout/33292942
  function timeout( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
  }

  async function sleep( fn, ...args ) {

    assert && assert( typeof sleepTiming === 'number' && sleepTiming > 0 );
    await timeout( sleepTiming );
    return fn( ...args );
  }

  var alerts = [];

  let intervalID = null;
  QUnit.module( 'Utterance', {
    before() {

      // step the timer, because utteranceQueue runs on timer
      intervalID = setInterval( () => {
        timer.emit( 1 / 100 ); // step timer in seconds, every millisecond
      }, 10 );

      ariaHerald.initialize();

      // whenever announcing, get a callback
      ariaHerald.announcingEmitter.addListener( text => {
        alerts.unshift( text );
      } );

      // initialize the queue
      utteranceQueue.initialize();

      // slightly slower than the interval that the utteranceQueue will wait so we don't have a race condition
      sleepTiming = utteranceQueue.stepInterval + 10;
    },
    beforeEach() {

      // clear the alerts before each new test
      alerts = [];
      utteranceQueue.clear();
    },
    after() {
      clearInterval( intervalID );
    }
  } );

  QUnit.test( 'Basic Utterance testing', async assert => {

    // for this test, we just want to verify that the alert makes it through to ariaHerald
    const alertContent = 'hi';
    const myAlert = new Utterance( {
      alert: alertContent,
      alertStable: false
    } );
    utteranceQueue.addToBack( myAlert );

    await sleep( () => {
      assert.ok( alerts[ 0 ] === alertContent, 'first alert made it to ariaHerald' );
    } );

    utteranceQueue.addToBack( 'alert' );
    await sleep( () => {
      assert.ok( alerts[ 0 ] === alertContent, 'second alert made it to ariaHerald' );
    } );
  } );

  QUnit.test( 'Utterance options', async assert => {

    const alert = new Utterance( {
      alert: [ '1', '2', '3' ],
      alertStable: false
    } );

    const alert4 = () => {
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
    };

    const testOrder = ( messageSuffix ) => {

      // newest at lowest index because of unshift
      assert.ok( alerts[ 3 ] === '1', 'Array order1' + messageSuffix );
      assert.ok( alerts[ 2 ] === '2', 'Array order2' + messageSuffix );
      assert.ok( alerts[ 1 ] === '3', 'Array order3' + messageSuffix );
      assert.ok( alerts[ 0 ] === '3', 'Array order4' + messageSuffix );
    };

    alert4();
    await timeout( sleepTiming * 4 );
    testOrder( '' );
    alert.reset();
    alert4();
    testOrder( ', reset should start over' );
  } );


  QUnit.test( 'Utterance loopAlerts', async assert => {

    const alert = new Utterance( {
      alert: [ '1', '2', '3' ],
      loopAlerts: true,
      alertStable: false
    } );

    const alert7 = () => {
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
      utteranceQueue.addToBack( alert );
    };

    const testOrder = ( messageSuffix ) => {

      // newest at lowest index
      assert.ok( alerts[ 6 ] === '1', 'Array order1' + messageSuffix );
      assert.ok( alerts[ 5 ] === '2', 'Array order2' + messageSuffix );
      assert.ok( alerts[ 4 ] === '3', 'Array order3' + messageSuffix );
      assert.ok( alerts[ 3 ] === '1', 'Array order4' + messageSuffix );
      assert.ok( alerts[ 2 ] === '2', 'Array order5' + messageSuffix );
      assert.ok( alerts[ 1 ] === '3', 'Array order6' + messageSuffix );
      assert.ok( alerts[ 0 ] === '1', 'Array order7' + messageSuffix );
    };

    alert7();
    await timeout( sleepTiming * 7 );
    testOrder( '' );
    alert.reset();
    alert7();
    testOrder( ', reset should start over' );
  } );
} );