// Copyright 2017-2023, University of Colorado Boulder

/**
 * Semi-transparent black barrier used to block input events when a dialog (or other popup) is present, and fade out
 * the background.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import { FireListener, Plane, PlaneOptions } from '../../scenery/js/imports.js';
import EventType from '../../tandem/js/EventType.js';
import dotRandom from '../../dot/js/dotRandom.js';
import sceneryPhet from './sceneryPhet.js';
import { ObservableArray } from '../../axon/js/createObservableArray.js';
import { PopupableNode } from '../../sun/js/Popupable.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import Tandem from '../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;

export type BarrierRectangleOptions = SelfOptions & PlaneOptions;

export default class BarrierRectangle extends Plane {

  private readonly disposeBarrierRectangle: () => void;

  public constructor( modalNodeStack: ObservableArray<PopupableNode>, providedOptions?: BarrierRectangleOptions ) {

    const options = optionize<BarrierRectangleOptions, SelfOptions, PlaneOptions>()( {
      fill: 'rgba( 0, 0, 0, 0.3 )',
      pickable: true,
      tandem: Tandem.OPTIONAL,
      phetioReadOnly: true, // Disable controls in the PhET-iO Studio wrapper
      phetioEventType: EventType.USER,
      visiblePropertyOptions: {
        phetioState: false
      }
    }, providedOptions );

    super( options );

    const lengthListener = ( numberOfBarriers: number ) => {
      this.visible = ( numberOfBarriers > 0 );
    };
    modalNodeStack.lengthProperty.link( lengthListener );

    this.addInputListener( new FireListener( {
      tandem: options.tandem.createTandem( 'fireListener' ),
      phetioReadOnly: options.phetioReadOnly,
      fire() {
        assert && assert( modalNodeStack.length > 0, 'There must be a Node in the stack to hide.' );

        // If fuzzing is enabled, close popups with a reduced probability, to improve testing coverage.
        // As of this writing, this addresses Dialogs and the PhET menu.
        // See https://github.com/phetsims/aqua/issues/136
        if ( !phet.chipper.isFuzzEnabled() || dotRandom.nextDouble() < 0.005 ) {
          modalNodeStack.get( modalNodeStack.length - 1 ).hide();
        }
      }
    } ) );

    this.disposeBarrierRectangle = () => {
      if ( modalNodeStack.lengthProperty.hasListener( lengthListener ) ) {
        modalNodeStack.lengthProperty.unlink( lengthListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeBarrierRectangle();
    super.dispose();
  }
}

sceneryPhet.register( 'BarrierRectangle', BarrierRectangle );