// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scenery input listener that implements a 'press-and-hold' feature.
 * On 'down', waits for some specified delay, then fires continuously until released.
 * Intended for use with buttons, but may be applicable to other things.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Timer = require( 'JOIST/Timer' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function PressAndHoldInputListener( options ) {

    options = _.extend( {
      listener: null, // optional {function} listener to be notified when fired
      enabled: true, // is this input listener enabled?
      timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      timerInterval: 100, // fire continuously at this interval (milliseconds)
      startCallback: function() {}, // called when the pointer is pressed
      endCallback: function() {} // called when the pointer is released
    }, options );

    var thisListener = this;

    thisListener.enabled = options.enabled; // @public

    thisListener.listeners = []; // @private
    if ( options.listener ) { thisListener.listeners.push( options.listener ); }

    var delayID = null; // identified for timer associated with the initial delay
    var intervalID = null; // identifier for timer associates with the continuous interval
    var fired = false;  // have we fired since 'down' was detected?

    // cleans up the timers
    var cleanupTimer = function() {
      if ( delayID ) {
        Timer.clearTimeout( delayID );
        delayID = null;
      }
      if ( intervalID ) {
        Timer.clearInterval( intervalID );
        intervalID = null;
      }
    };

    var isPressed = false;
    ButtonListener.call( thisListener, {

      // set up timers for the initial delay and interval
      down: function() {
        isPressed = true;
        options.startCallback();
        if ( delayID === null && intervalID === null ) {
          fired = false;
          delayID = Timer.setTimeout( function() {
            delayID = null;
            fired = true;
            intervalID = Timer.setInterval( function() {
              thisListener.fire();
            }, options.timerInterval );
          }, options.timerDelay );
        }
      },

      endPressed: function() {
        if ( isPressed ) {
          isPressed = false;
          options.endCallback();
          cleanupTimer();
        }
      },

      up: function() {
        this.endPressed();
      },

      over: function() {
        this.endPressed();
      },

      fire: function() {
        cleanupTimer();
        if ( !fired ) { thisListener.fire(); }
      }
    } );
  }

  return inherit( ButtonListener, PressAndHoldInputListener, {

    // notifies all registered listeners when this input listener fires
    fire: function() {
      if ( this.enabled ) {
        var listenersCopy = this.listeners.slice( 0 );
        for ( var i = 0; i < listenersCopy.length; i++ ) {
          listenersCopy[ i ]();
        }
      }
    },

    // {function} listener
    addListener: function( listener ) {
      if ( this.listeners.indexOf( listener ) === -1 ) {
        this.listeners.push( listener );
      }
    },

    // {function} listener
    removeListener: function( listener ) {
      var index = this.listeners.indexOf( listener );
      if ( index !== -1 ) {
        this.listeners.splice( index, 1 );
      }
    }
  } );
} );