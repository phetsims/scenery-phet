// Copyright 2017-2019, University of Colorado Boulder

/**
 * Semi-transparent black barrier used to block input events when a dialog (or other popup) is present, and fade out
 * the background.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  var FireListener = require( 'SCENERY/listeners/FireListener' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  class BarrierRectangle extends Plane {
    constructor( modalNodeStack, options ) {

      options = _.extend( {
        tandem: Tandem.required,
        phetioDocumentation: 'Shown when a dialog is present, so that clicking on the invisible barrier rectangle will dismiss the dialog',
        phetioReadOnly: true, // Disable controls in the PhET-iO Studio wrapper
        phetioEventType: PhetioObject.EventType.USER,
        phetioComponentOptions: {
          phetioState: false
        }
      }, options );

      super( options );

      const lengthListener = numberOfBarriers => {
        this.visible = numberOfBarriers > 0;
      };
      modalNodeStack.lengthProperty.link( lengthListener );

      this.addInputListener( new FireListener( {
        tandem: options.tandem.createTandem( 'inputListener' ),
        fire() {
          assert && assert( modalNodeStack.length > 0, 'There must be a Node in the stack to hide.' );
          modalNodeStack.get( modalNodeStack.length - 1 ).hide();
        }
      } ) );

      // @private
      this.disposeBarrierRectangle = () => {
        modalNodeStack.lengthProperty.unlink( lengthListener );
      };
    }

    /**
     * @public
     * @override
     */
    dispose() {
      this.disposeBarrierRectangle();
      super.dispose();
    }
  }

  return sceneryPhet.register( 'BarrierRectangle', BarrierRectangle );
} );