// Copyright 2024-2025, University of Colorado Boulder

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

import { EmptySelfOptions, optionize3 } from '../../phet-core/js/optionize.js';
import KeyboardDragListener, { KeyboardDragListenerOptions } from '../../scenery/js/listeners/KeyboardDragListener.js';
import sceneryPhet from './sceneryPhet.js';
import SoundRichDragListener, { RichDragListenerSoundOptions } from './SoundRichDragListener.js';

export type SoundKeyboardDragListenerOptions = KeyboardDragListenerOptions & RichDragListenerSoundOptions;

export default class SoundKeyboardDragListener extends KeyboardDragListener {
  public constructor( providedOptions: SoundKeyboardDragListenerOptions ) {

    // Get default sounds from SoundRichDragListener.
    const options = optionize3<SoundKeyboardDragListenerOptions, EmptySelfOptions, RichDragListenerSoundOptions>()(
      {}, SoundRichDragListener.DEFAULT_SOUND_OPTIONS, providedOptions
    );

    super( options );

    // Unlink is not necessary because the link is removed when this KeyboardDragListener is disposed.
    SoundRichDragListener.linkToDragEvents( this, options.grabSoundPlayer, options.releaseSoundPlayer );
  }
}

sceneryPhet.register( 'SoundKeyboardDragListener', SoundKeyboardDragListener );