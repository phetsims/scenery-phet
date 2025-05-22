// Copyright 2024-2025, University of Colorado Boulder

/**
 * The model of the grab drag interaction. This has the current interaction state, and the cueing state.
 * Scenery-phet internal, GrabDragInteraction should be the only one to create this.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import EnabledComponent, { EnabledComponentOptions } from '../../../../axon/js/EnabledComponent.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyEmitter } from '../../../../axon/js/TEmitter.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import GrabDragUsageTracker from './GrabDragUsageTracker.js';

// Input type for the interaction.
export const InputTypeValues = [
  'pointer', // mouse or touch
  'alternative', // keyboard or other input
  'programmatic' // cancel or interrupt
] as const;
export type InputType = typeof InputTypeValues[number];

// Interaction states that this component interaction can be in:
// "idle": In the default state where you can interact with the node to grab it. It is ready to be
//         "picked up" ("grabbed") from this state. This state mostly behaves like a button.
// "grabbed": In the state where you can use keyboard to move the object with arrow keys. You are also able to "release"
//            back into idle
export type GrabDragInteractionState = 'idle' | 'grabbed';

type SelfOptions = EmptySelfOptions;
export type GrabDragModelOptions = SelfOptions & EnabledComponentOptions;

export default class GrabDragModel extends EnabledComponent {
  public readonly interactionStateProperty = new Property<GrabDragInteractionState>( 'idle' );

  // called on reset()
  public readonly resetEmitter = new Emitter();

  private readonly _releasedEmitter = new Emitter<[ InputType ]>( { parameters: [ { validValues: InputTypeValues } ] } ); // called after setting to "idle" state
  private readonly _grabbedEmitter = new Emitter<[ InputType ]>( { parameters: [ { validValues: InputTypeValues } ] } ); // called after setting to "grabbed" state

  public constructor( public readonly grabDragUsageTracker: GrabDragUsageTracker = new GrabDragUsageTracker(), providedOptions?: GrabDragModelOptions ) {
    const options = optionize<GrabDragModelOptions, SelfOptions, EnabledComponentOptions>()( {}, providedOptions );
    super( options );
  }

  public get grabbedEmitter(): TReadOnlyEmitter<[ InputType ]> { return this._grabbedEmitter; }

  public get releasedEmitter(): TReadOnlyEmitter<[ InputType ]> { return this._releasedEmitter; }

  /**
   * Grab with keyboard usage tracking
   */
  public keyboardGrab( onBeforeEmit: VoidFunction = _.noop ): void {

    // increment before grab in case something during the state change reads this value.
    this.grabDragUsageTracker.numberOfKeyboardGrabs++;

    this.grab( onBeforeEmit, 'alternative' );
  }

  /**
   * Turn from idle into grabbed interaction state.
   * This updates accessibility representation in the PDOM and changes input listeners. This function can be called
   * while already grabbed, because of nuance in how we support multi-input and gestureDescription.
   * @param onBeforeEmit
   * @param inputType - is the user using pointer or alternative input?
   */
  public grab( onBeforeEmit: VoidFunction, inputType: InputType ): void {

    // Increment this even if we are already in the grabbed state, to indicate user intention in our usage tracker.
    this.grabDragUsageTracker.numberOfGrabs++;

    this.interactionStateProperty.value = 'grabbed';

    onBeforeEmit();

    this._grabbedEmitter.emit( inputType );
  }

  /**
   * Release from being grabbed. This function will set the interaction back to the "idle" state and should only be called
   * when in "grabbed" state. It also behaves as though it was released from user input, for example sound effect
   * and description will occur may occur.
   */
  public release( inputType: InputType ): void {

    assert && assert( this.interactionStateProperty.value === 'grabbed', 'cannot set to interactionState if already set that way' );
    this.interactionStateProperty.value = 'idle';
    this._releasedEmitter.emit( inputType );
  }

  public override dispose(): void {
    this._grabbedEmitter.dispose();
    this._releasedEmitter.dispose();
    this.resetEmitter.dispose();
    this.interactionStateProperty.dispose();
    super.dispose();
  }

  public reset(): void {

    // This should go first, so that state logic listening to the interaction state respects the resetted usage tracker.
    this.grabDragUsageTracker.reset();

    this.interactionStateProperty.value = 'idle';

    this.resetEmitter.emit();

    assert && assert( this.grabDragUsageTracker.numberOfGrabs === 0, 'numberOfGrabs should be 0, but it was: ' + this.grabDragUsageTracker.numberOfGrabs );
    assert && assert( this.grabDragUsageTracker.numberOfKeyboardGrabs === 0, 'numberOfKeyboardGrabs should be 0, but it was ' + this.grabDragUsageTracker.numberOfKeyboardGrabs );
  }
}

sceneryPhet.register( 'GrabDragModel', GrabDragModel );