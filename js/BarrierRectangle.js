// Copyright 2017-2020, University of Colorado Boulder

/**
 * Semi-transparent black barrier used to block input events when a dialog (or other popup) is present, and fade out
 * the background.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import FireListener from '../../scenery/js/listeners/FireListener.js';
import Plane from '../../scenery/js/nodes/Plane.js';
import EventType from '../../tandem/js/EventType.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';

class BarrierRectangle extends Plane {

  /**
   * @param {Array.<Node>} modalNodeStack
   * @param {Object} [options]
   */
  constructor( modalNodeStack, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'Shown when a dialog is present, so that clicking on the invisible barrier rectangle will dismiss the dialog',
      phetioReadOnly: true, // Disable controls in the PhET-iO Studio wrapper
      phetioEventType: EventType.USER,
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

sceneryPhet.register( 'BarrierRectangle', BarrierRectangle );
export default BarrierRectangle;