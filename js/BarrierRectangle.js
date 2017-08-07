// Copyright 2017, University of Colorado Boulder

/**
 * Semi-transparent black barrier used to block input events when a dialog (or other popup) is present, and fade out
 * the background.
 *
 * @author - Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Emitter = require( 'AXON/Emitter' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TBarrierRectangle = require( 'SCENERY_PHET/TBarrierRectangle' );

  /**
   * @param {ObservableArray} modalNodeStack - see usage in Sim.js
   * @param {Object} [options]
   * @constructor
   */
  function BarrierRectangle( modalNodeStack, options ) {
    var self = this;

    options = _.extend( {
      tandem: Tandem.tandemRequired(),
      phetioType: TBarrierRectangle
    }, options );

    Plane.call( this );

    // @private
    this.startedCallbacksForFiredEmitter = new Emitter( { indicateCallbacks: false } );
    this.endedCallbacksForFiredEmitter = new Emitter( { indicateCallbacks: false } );

    modalNodeStack.lengthProperty.link( function( numBarriers ) {
      self.visible = numBarriers > 0;
    } );

    this.addInputListener( new ButtonListener( {
      fire: function( event ) {
        self.startedCallbacksForFiredEmitter.emit();
        assert && assert( modalNodeStack.length > 0, 'There must be a Node in the stack to hide.' );
        modalNodeStack.get( modalNodeStack.length - 1 ).hide();
        self.endedCallbacksForFiredEmitter.emit();
      }
    } ) );

    // @private
    this.disposeBarrierRectangle = function() {
      modalNodeStack.lengthProperty.unlink();
    };

    this.mutate( options );
  }

  sceneryPhet.register( 'BarrierRectangle', BarrierRectangle );

  return inherit( Plane, BarrierRectangle, {

    // @public
    dispose: function() {
      this.disposeBarrierRectangle();
      Plane.prototype.dispose.call( this );
    }
  } );
} );