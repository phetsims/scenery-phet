// Copyright 2024-2025, University of Colorado Boulder

/**
 * The model of the grab drag cueing logic. This is a separate model in part so that different interaction instances
 * can share the same info about whether the cues should be shown.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';

export default class GrabDragUsageTracker {

  // The number of times the component has been picked up for dragging, regardless
  // of pickup method for things like determining content for "hints" describing the interaction
  // to the user
  public numberOfGrabs = 0;

  // The number of times this component has been picked up with a keyboard specifically to provide hints specific
  // to alternative input.
  public numberOfKeyboardGrabs = 0;

  // Clients can provide application-specific logic for when to show the drag cue. Typically, they will want to hide it
  // after the user has interacted with it in a certain way.
  public shouldShowDragCue = true;

  public reset(): void {
    this.numberOfGrabs = 0;
    this.numberOfKeyboardGrabs = 0;
    this.shouldShowDragCue = true;
  }
}

sceneryPhet.register( 'GrabDragUsageTracker', GrabDragUsageTracker );