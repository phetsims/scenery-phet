// Copyright 2024-2025, University of Colorado Boulder

/**
 * A RichDragListener that supports sounds for grab and release.
 *
 * @author Jesse Greenberg
 */

import { combineOptions, optionize3 } from '../../phet-core/js/optionize.js';
import DragListener from '../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../scenery/js/listeners/KeyboardDragListener.js';
import RichDragListener, { RichDragListenerOptions } from '../../scenery/js/listeners/RichDragListener.js';
import sharedSoundPlayers from '../../tambo/js/sharedSoundPlayers.js';
import TSoundPlayer from '../../tambo/js/TSoundPlayer.js';
import sceneryPhet from './sceneryPhet.js';

// Options for drag listeners that are specific to sound.
export type RichDragListenerSoundOptions = {

  // Grab and release sounds. `null` means no sound.
  grabSoundPlayer?: TSoundPlayer | null;
  releaseSoundPlayer?: TSoundPlayer | null;
};

type SelfOptions = {

  // Sound players that only apply to the keyboard drag listener.
  keyboardDragListenerSoundOptions?: RichDragListenerSoundOptions;

  // Sound players that only apply to the drag listener.
  dragListenerSoundOptions?: RichDragListenerSoundOptions;
} & RichDragListenerSoundOptions; // Sound players that apply to both listeners.

export type SoundRichDragListenerOptions = RichDragListenerOptions & SelfOptions;

// Default values for sounds used by both drag listeners.
const DEFAULT_SOUND_OPTIONS = {
  grabSoundPlayer: sharedSoundPlayers.get( 'grab' ),
  releaseSoundPlayer: sharedSoundPlayers.get( 'release' )
} as const;

// Factored out of optionize for readability.
const SOUND_RICH_DRAG_LISTENER_DEFAULTS = _.assignIn( {
  keyboardDragListenerSoundOptions: {},
  dragListenerSoundOptions: {}
}, DEFAULT_SOUND_OPTIONS );

export default class SoundRichDragListener extends RichDragListener {
  public constructor( providedOptions?: SoundRichDragListenerOptions ) {
    const options = optionize3<SoundRichDragListenerOptions, SelfOptions, RichDragListenerOptions>()(
      {}, SOUND_RICH_DRAG_LISTENER_DEFAULTS, providedOptions
    );

    // Create options for each listener, combining the listener type specific options into the shared options.
    const dragListenerSoundOptions = combineOptions<RichDragListenerSoundOptions>( {}, options, options.dragListenerSoundOptions );
    const keyboardDragListenerSoundOptions = combineOptions<RichDragListenerSoundOptions>( {}, options, options.keyboardDragListenerSoundOptions );

    const dragListenerPressedSoundPlayer = dragListenerSoundOptions.grabSoundPlayer;
    const dragListenerReleasedSoundPlayer = dragListenerSoundOptions.releaseSoundPlayer;
    const keyboardDragListenerPressedSoundPlayer = keyboardDragListenerSoundOptions.grabSoundPlayer;
    const keyboardDragListenerReleasedSoundPlayer = keyboardDragListenerSoundOptions.releaseSoundPlayer;

    super( options );

    // Unlinks are not necessary because they are removed when the drag listeners are disposed.
    SoundRichDragListener.linkToDragEvents( this.dragListener, dragListenerPressedSoundPlayer, dragListenerReleasedSoundPlayer );
    SoundRichDragListener.linkToDragEvents( this.keyboardDragListener, keyboardDragListenerPressedSoundPlayer, keyboardDragListenerReleasedSoundPlayer );
  }

  /**
   * Plays the sounds when the drag listener is pressed or released.
   */
  public static linkToDragEvents( dragListener: DragListener | KeyboardDragListener, grabSound: TSoundPlayer | null | undefined, releaseSound: TSoundPlayer | null | undefined ): void {
    const isPressedListener = ( isPressed: boolean ) => {
      if ( isPressed ) {
        grabSound && grabSound.play();
      }
      else if ( !dragListener.interrupted ) {
        releaseSound && releaseSound.play();
      }
    };
    dragListener.isPressedProperty.lazyLink( isPressedListener );
  }

  public static readonly DEFAULT_SOUND_OPTIONS = DEFAULT_SOUND_OPTIONS;
}

sceneryPhet.register( 'SoundRichDragListener', SoundRichDragListener );