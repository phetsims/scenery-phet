// Copyright 2017-2019, University of Colorado Boulder

/**
 * Semi-transparent black barrier used to block input events when a dialog (or other popup) is present, and fade out
 * the background.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {ObservableArray} modalNodeStack - see usage in Sim.js
   * @param {Object} [options]
   * @constructor
   */
  function BarrierRectangle( modalNodeStack, options ) {
    var self = this;

    options = _.extend( {
      tandem: Tandem.required,
      phetioDocumentation: 'Shown when a dialog is present, so that clicking on the invisible barrier rectangle will dismiss the dialog',
      phetioReadOnly: true, // Disable controls in the PhET-iO Studio wrapper
      phetioState: false,
      phetioEventType: PhetioObject.EventType.USER
    }, options );

    Plane.call( this );

    const lengthListener = function( numberOfBarriers ) {
      self.visible = numberOfBarriers > 0;
    };
    modalNodeStack.lengthProperty.link( lengthListener );

    this.addInputListener( new FireListener( {
      tandem: options.tandem.createTandem( 'inputListener' ),
      fire: function() {
        assert && assert( modalNodeStack.length > 0, 'There must be a Node in the stack to hide.' );
        modalNodeStack.get( modalNodeStack.length - 1 ).hide();
      }
    } ) );

    // @private
    this.disposeBarrierRectangle = function() {
      modalNodeStack.lengthProperty.unlink( lengthListener );
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