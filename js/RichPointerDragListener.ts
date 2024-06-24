// Copyright 2024, University of Colorado Boulder

/**
 * RichPointerDragListener extends DragListener to integrate PhET-specific features that should be broadly applied to
 * DragListener instances in PhET sims.
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
import { DragListener, DragListenerOptions, PressedDragListener } from '../../scenery/js/imports.js';
import SoundRichDragListener, { RichDragListenerSoundOptions } from './SoundRichDragListener.js';

// Pattern followed from DragListenerOptions.
export type PressedRichPointerDragListener = RichPointerDragListener & PressedDragListener;

export type RichPointerDragListenerOptions<Listener extends PressedRichPointerDragListener = PressedRichPointerDragListener> = DragListenerOptions<Listener> & RichDragListenerSoundOptions;

export default class RichPointerDragListener extends DragListener {
  public constructor( providedOptions: RichPointerDragListenerOptions ) {

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

sceneryPhet.register( 'RichPointerDragListener', RichPointerDragListener );