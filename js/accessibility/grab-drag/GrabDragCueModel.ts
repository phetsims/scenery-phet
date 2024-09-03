// Copyright 2018-2024, University of Colorado Boulder

/**
 * The model of the grab drag cueing logic. This is a separate model in part so that different interaction instances
 * can share the same info about whether the cues should be shown.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';

export default class GrabDragCueModel {

  // The number of times the component has been picked up for dragging, regardless
  // of pickup method for things like determining content for "hints" describing the interaction
  // to the user
  public numberOfGrabs = 0;

  // The number of times this component has been picked up with a keyboard specifically to provide hints specific
  // to alternative input.
  public numberOfKeyboardGrabs = 0;

  // TODO: added for https://github.com/phetsims/density-buoyancy-common/issues/364, but probably won't pass code review. https://github.com/phetsims/scenery-phet/issues/869
  public shouldShowDragCue = true;

  public reset(): void {
    this.numberOfGrabs = 0;
    this.numberOfKeyboardGrabs = 0;
    this.shouldShowDragCue = true;
  }
}

sceneryPhet.register( 'GrabDragCueModel', GrabDragCueModel );