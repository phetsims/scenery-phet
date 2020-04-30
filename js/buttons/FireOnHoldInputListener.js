// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery input listener that implements a fire-on-hold feature.
 * On 'down', waits for some specified delay, then fires continuously until released.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CallbackTimer from '../../../axon/js/CallbackTimer.js';
import deprecationWarning from '../../../phet-core/js/deprecationWarning.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import DownUpListener from '../../../scenery/js/input/DownUpListener.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 * @deprecated - Use FireListener instead, see https://github.com/phetsims/scenery/issues/1004
 */
function FireOnHoldInputListener( options ) {
  assert && deprecationWarning( 'FireOnHoldInputListener is deprecated, please use FireListener instead' );

  options = merge( {
    listener: null, // {function} convenience for adding 1 listener
    enabled: true, // is this input listener enabled?
    timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
    timerInterval: 100, // fire continuously at this interval (milliseconds)
    startCallback: _.noop, // {function()} called when the pointer is pressed
    endCallback: _.noop // {function(inside:boolean)} called when the pointer is released, {boolean} inside indicates whether the pointer was inside
  }, options );

  this._enabled = options.enabled; // @private

  this.listeners = []; // @private
  if ( options.listener ) { this.listeners.push( options.listener ); }

  // @private
  this.timer = new CallbackTimer( {
    callback: options.listener,
    delay: options.timerDelay,
    interval: options.timerInterval
  } );

  const self = this;
  DownUpListener.call( this, {

    // Pointer down, start the timer.
    down: function() {
      if ( self._enabled ) {
        options.startCallback();
        self.timer.start();
      }
    },

    // Point released inside. Stop the timer, fire if we haven't already.
    upInside: function() {
      options.endCallback( true );
      self.timer.stop( self._enabled );
    },

    // Pointer released outside. Stop the timer, don't fire if we haven't already
    upOutside: function() {
      options.endCallback( false );
      self.timer.stop( false );
    }
  } );
}

sceneryPhet.register( 'FireOnHoldInputListener', FireOnHoldInputListener );

inherit( DownUpListener, FireOnHoldInputListener, {

  // @public Adds a {function} listener
  addListener: function( listener ) {
    this.timer.addCallback( listener );
  },

  // @public Removes a {function} listener
  removeListener: function( listener ) {
    this.timer.removeCallback( listener );
  },

  /**
   * Enables or disabled this input listener. When disabled, the timer is stopped.
   * @param {boolean} enabled
   * @public
   */
  setEnabled: function( enabled ) {
    this._enabled = enabled;
    if ( !enabled ) {
      this.timer.stop( false ); // stop timer, don't fire if we haven't already
    }
  },
  set enabled( value ) { this.setEnabled( value ); },

  // @public Is this input listener enabled?
  getEnabled: function() {
    return this._enabled;
  },
  get enabled() { return this.getEnabled(); },

  // @public
  dispose: function() {
    this.listeners.length = 0;
    this.timer.dispose();
    this.timer = null;
    DownUpListener.prototype.dispose && DownUpListener.prototype.dispose.call( this );
  }
} );

export default FireOnHoldInputListener;