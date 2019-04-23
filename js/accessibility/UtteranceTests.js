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

      // timer step in seconds, stepped every 10 millisecond
      const timerInterval = 1 / 3;

      // step the timer, because utteranceQueue runs on timer
      intervalID = setInterval( () => {
        timer.emit( timerInterval ); // step timer in seconds, every millisecond
      }, timerInterval * 1000 );

      ariaHerald.initialize();

      // whenever announcing, get a callback and populate the alerts array
      ariaHerald.announcingEmitter.addListener( text => {
        alerts.unshift( text );
      } );

      // initialize the queue
      utteranceQueue.initialize();

      // slightly slower than the interval that the utteranceQueue will wait so we don't have a race condition
      sleepTiming = timerInterval * 1000 * 1.1;
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
      assert.ok( alerts[ 0 ] === 'alert', 'second alert made it to ariaHerald' );
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

  QUnit.test( 'alertStable and alertStableDelay tests', async assert => {
    const highFrequencyUtterance = new Utterance( { alert: 'Rapidly Changing' } );

    const numAlerts = 4;

    // add the utterance to the back many times, by default they should collapse
    for ( let i = 0; i < numAlerts; i++ ) {
      utteranceQueue.addToBack( highFrequencyUtterance );
    }
    assert.ok( utteranceQueue.queue.length === 1, 'utterances should collapse by default after addToBack' );

    for ( let i = 0; i < numAlerts; i++ ) {
      utteranceQueue.addToFront( highFrequencyUtterance );
    }
    assert.ok( utteranceQueue.queue.length === 1, 'utterances should collapse by default after addToFront' );

    await timeout( sleepTiming * 4 );
    assert.ok( alerts.length === 1, ' we only heard one alert after they became stable' );


    /////////////////////////////////////////

    alerts = [];
    const stableDelay = 1100;
    const myUtterance = new Utterance( {
      alert: 'hi',
      alertStable: true,
      alertStableDelay: stableDelay
    } );

    for ( let i = 0; i < 100; i++ ) {
      utteranceQueue.addToBack( myUtterance );
    }

    assert.ok( utteranceQueue.queue.length === 1, 'same Utterance should override in queue' );
    await timeout( sleepTiming );

    assert.ok( myUtterance.stableTime >= myUtterance.timeInQueue, 'utterance should be in queue for at least stableDelay' );

    assert.ok( utteranceQueue.queue.length === 1, 'Alert still in queue after waiting less than alertStableDelay but more than stepInterval.' );
    await timeout( stableDelay );

    assert.ok( utteranceQueue.queue.length === 0, 'Utterance alerted after alertStableDelay time passed' );
    assert.ok( alerts.length === 1, 'utterance ended up in alerts list' );
    assert.ok( alerts[ 0 ] === myUtterance.alert, 'utterance text matches that which is expected' );
  } );
} );