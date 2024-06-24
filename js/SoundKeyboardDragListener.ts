// Copyright 2024, University of Colorado Boulder

/**
 * SoundKeyboardDragListener extends KeyboardDragListener to integrate PhET-specific features that should be
 * broadly applied to DragListener instances in PhET sims.
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

import sceneryPhet from './sceneryPhet.js';
import { KeyboardDragListener, KeyboardDragListenerOptions } from '../../scenery/js/imports.js';
import SoundRichDragListener, { RichDragListenerSoundOptions } from './SoundRichDragListener.js';

export type SoundKeyboardDragListenerOptions = KeyboardDragListenerOptions & RichDragListenerSoundOptions;

export default class SoundKeyboardDragListener extends KeyboardDragListener {
  public constructor( providedOptions: SoundKeyboardDragListenerOptions ) {

    // Apply the sound options to the drag listener, wrapping start/end callbacks with functions that will
    // play sounds on grab and release.
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

sceneryPhet.register( 'SoundKeyboardDragListener', SoundKeyboardDragListener );