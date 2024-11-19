// Copyright 2024, University of Colorado Boulder

/**
 * SoundDragListener extends DragListener to integrate PhET-specific sounds for grab and release.
 *
 * For grab and release sounds, responsibilities include:
 * - provide default sound files
 * - create SoundClips and register them with soundManager
 * - dispose of SoundClips and deregister them with soundManager
 *
 * @author Agustín Vallejo
 * @author Michael Kauzmann
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 */

import { DragListener, DragListenerOptions, PressedDragListener } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import SoundRichDragListener, { RichDragListenerSoundOptions } from './SoundRichDragListener.js';

// Pattern followed from DragListenerOptions.
export type PressedSoundDragListener = SoundDragListener & PressedDragListener;

export type SoundDragListenerOptions<Listener extends PressedSoundDragListener = PressedSoundDragListener> = DragListenerOptions<Listener> & RichDragListenerSoundOptions;

export default class SoundDragListener extends DragListener {
  public constructor( providedOptions: SoundDragListenerOptions ) {

    // Apply the sound options to the drag listener, wrapping start/end callbacks, wrapping start/end callbacks with
    // functions that will play sounds on grab and release.
    const soundClips = SoundRichDragListener.wireSoundsToDragCallbacks(
      SoundRichDragListener.DEFAULT_SOUND_OPTIONS,
      providedOptions,
      providedOptions
    );

    super( providedOptions );

    // When this listener is disposed, sound clips must be removed from the soundManager.
    SoundRichDragListener.wireDisposeListener( this, soundClips[ 0 ], soundClips[ 1 ] );
  }
}

sceneryPhet.register( 'SoundDragListener', SoundDragListener );