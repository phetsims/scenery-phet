// Copyright 2024-2025, University of Colorado Boulder

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

import { EmptySelfOptions, optionize3 } from '../../phet-core/js/optionize.js';
import DragListener, { DragListenerOptions, PressedDragListener } from '../../scenery/js/listeners/DragListener.js';
import sceneryPhet from './sceneryPhet.js';
import SoundRichDragListener, { RichDragListenerSoundOptions } from './SoundRichDragListener.js';

// Pattern followed from DragListenerOptions.
export type PressedSoundDragListener = SoundDragListener & PressedDragListener;

export type SoundDragListenerOptions<Listener extends PressedSoundDragListener = PressedSoundDragListener> = DragListenerOptions<Listener> & RichDragListenerSoundOptions;

export default class SoundDragListener extends DragListener {
  public constructor( providedOptions: SoundDragListenerOptions ) {

    // Get default sounds from SoundRichDragListener.
    const options = optionize3<SoundDragListenerOptions, EmptySelfOptions, RichDragListenerSoundOptions>()(
      {}, SoundRichDragListener.DEFAULT_SOUND_OPTIONS, providedOptions
    );

    super( options );

    // Unlink is not necessary because the link is removed when this DragListener is disposed.
    SoundRichDragListener.linkToDragEvents( this, options.grabSoundPlayer, options.releaseSoundPlayer );
  }
}

sceneryPhet.register( 'SoundDragListener', SoundDragListener );