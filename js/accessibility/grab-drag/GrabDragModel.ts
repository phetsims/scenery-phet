// Copyright 2018-2024, University of Colorado Boulder

/**
 * The model of the grab drag interaction. This has the current interaction state, and the cueing state.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import GrabDragUsageTracker from './GrabDragUsageTracker.js';
import Property from '../../../../axon/js/Property.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnabledComponent, { EnabledComponentOptions } from '../../../../axon/js/EnabledComponent.js';
import { TReadOnlyEmitter } from '../../../../axon/js/TEmitter.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

export type GrabDragInteractionState = 'grabbable' | 'draggable';

type SelfOptions = EmptySelfOptions;
export type GrabDragModelOptions = SelfOptions & EnabledComponentOptions;

export default class GrabDragModel extends EnabledComponent {

  // Interaction states that this component interaction can be in:
  // "grabbable": In the button state where you can interact with the node to grab it.
  // "draggable": In the state where you can use a keyboard listener to move the object with arrow keys.
  // TODO: Rename to "idle" and "grabbed"? See https://github.com/phetsims/scenery-phet/issues/869
  public readonly interactionStateProperty = new Property<GrabDragInteractionState>( 'grabbable' );

  // called on reset()
  public readonly resetEmitter = new Emitter();

  private readonly _releasedEmitter = new Emitter(); // called after setting to "idle" state
  private readonly _grabbedEmitter = new Emitter(); // called after setting to "grabbed" state

  public constructor( public readonly grabDragUsageTracker: GrabDragUsageTracker = new GrabDragUsageTracker(), providedOptions?: GrabDragModelOptions ) {
    const options = optionize<GrabDragModelOptions, SelfOptions, EnabledComponentOptions>()( {}, providedOptions );
    super( options );
  }

  public get grabbedEmitter(): TReadOnlyEmitter { return this._grabbedEmitter; }

  public get releasedEmitter(): TReadOnlyEmitter { return this._releasedEmitter; }

  /**
   * Grab with keyboard usage tracking
   */
  public keyboardGrab( onBeforeEmit: VoidFunction = _.noop ): void {

    // increment before grab in case something during the state change reads this value.
    this.grabDragUsageTracker.numberOfKeyboardGrabs++;

    this.grab( onBeforeEmit );
  }

  /**
   * Turn from grabbable into draggable interaction state.
   * This updates accessibility representation in the PDOM and changes input listeners. This function can be called
   * while already grabbed, because of nuance in how we support multi-input and gestureDescription.
   */
  public grab( onBeforeEmit: VoidFunction = _.noop ): void {

    // Increment this even if we are already in the grabbed state, to indicate user intention in our usage tracker.
    this.grabDragUsageTracker.numberOfGrabs++;

    this.interactionStateProperty.value = 'draggable';

    onBeforeEmit();

    this._grabbedEmitter.emit();
  }

  /**
   * Release the draggable. This function will set the interaction back to the "grabbable" state and should only be called
   * when draggable. It also behaves as though it was released from user input, for example a sound effect and description
   * will occur.
   */
  public release(): void {
    assert && assert( this.interactionStateProperty.value === 'draggable', 'cannot set to interactionState if already set that way' );
    this.interactionStateProperty.value = 'grabbable';
    this._releasedEmitter.emit();
  }

  public override dispose(): void {
    this._grabbedEmitter.dispose();
    this._releasedEmitter.dispose();
    this.resetEmitter.dispose();
    super.dispose();
  }

  public reset(): void {

    // This should go first, so that state logic listening to the interaction state respects the resetted usage tracker.
    this.grabDragUsageTracker.reset();

    this.interactionStateProperty.value = 'grabbable';

    this.resetEmitter.emit();

    assert && assert( this.grabDragUsageTracker.numberOfGrabs === 0, 'numberOfGrabs should be 0, but it was: ' + this.grabDragUsageTracker.numberOfGrabs );
    assert && assert( this.grabDragUsageTracker.numberOfKeyboardGrabs === 0, 'numberOfKeyboardGrabs should be 0, but it was ' + this.grabDragUsageTracker.numberOfKeyboardGrabs );
  }
}

sceneryPhet.register( 'GrabDragModel', GrabDragModel );