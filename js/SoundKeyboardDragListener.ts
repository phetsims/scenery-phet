// Copyright 2024, University of Colorado Boulder

/**
 * SoundKeyboardDragListener extends KeyboardDragListener to integrate PhET-specific sounds for grab and release.
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

import { KeyboardDragListener, KeyboardDragListenerOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import SoundRichDragListener, { RichDragListenerSoundOptions } from './SoundRichDragListener.js';

export type SoundKeyboardDragListenerOptions = KeyboardDragListenerOptions & RichDragListenerSoundOptions;

export default class SoundKeyboardDragListener extends KeyboardDragListener {
  public constructor( providedOptions: SoundKeyboardDragListenerOptions ) {
    const [ pressedSoundClip, releasedSoundClip ] = SoundRichDragListener.createSoundClips(
      SoundRichDragListener.DEFAULT_SOUND_OPTIONS,
      providedOptions
    );

    super( providedOptions );

    const isPressedListener = SoundRichDragListener.linkSounds( this, pressedSoundClip, releasedSoundClip );

    // When this listener is disposed, sound clips must be removed from the soundManager.
    SoundRichDragListener.wireDisposeListener( this, pressedSoundClip, releasedSoundClip, isPressedListener );
  }
}

sceneryPhet.register( 'SoundKeyboardDragListener', SoundKeyboardDragListener );