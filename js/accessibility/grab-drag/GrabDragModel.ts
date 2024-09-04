// Copyright 2018-2024, University of Colorado Boulder

/**
 * The model of the grab drag interaction. This has the current interaction state, and the cueing state.
 *
 * TODO: Having the model be modeProperty = 'grabbable' or 'draggable' and listening for changes in that could help address some of the recommendations below.
 *        Like interactionStateProperty https://github.com/phetsims/scenery-phet/issues/869
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import GrabDragCueModel from './GrabDragCueModel.js';
import Property from '../../../../axon/js/Property.js';

export type GrabDragInteractionState = 'grabbable' | 'draggable';

// TODO: This should be the EnabledComponent instead of the view, https://github.com/phetsims/scenery-phet/issues/869
export default class GrabDragModel {

  // Interaction states that this component interaction can be in:
  // "grabbable": In the button state where you can interact with the node to grab it.
  // "draggable": In the state where you can use a keyboard listener to move the object with arrow keys.
  /**
   * TODO: Rename to "idle" vs "grabbed"? See https://github.com/phetsims/scenery-phet/issues/869
   * SR: grabbable vs draggable was initially confusing
   * MK: Since we want to show the "grabbable" cue when it is grabbable, we should call it grabbable.
   *     Wouldn't it introduce another layer of confusion to call it "idle" and have to know/figure out that idle means to show the "grabbable" message?
   * SR: Isn't grabbable a bit of a misnomer since something cannot be grabbed unless it also has focus?
   */
  public readonly interactionStateProperty = new Property<GrabDragInteractionState>( 'grabbable' );

  public constructor( public readonly grabDragCueModel: GrabDragCueModel = new GrabDragCueModel() ) {}

  public reset(): void {

    // This should go first, so that cue logic listening to the interaction state respects the default cue model.
    this.grabDragCueModel.reset();

    this.interactionStateProperty.value = 'grabbable';

    assert && assert( this.grabDragCueModel.numberOfGrabs === 0, 'numberOfGrabs should be 0, but it was: ' + this.grabDragCueModel.numberOfGrabs );
    assert && assert( this.grabDragCueModel.numberOfKeyboardGrabs === 0, 'numberOfKeyboardGrabs should be 0, but it was ' + this.grabDragCueModel.numberOfKeyboardGrabs );
  }
}

sceneryPhet.register( 'GrabDragModel', GrabDragModel );