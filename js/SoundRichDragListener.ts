// Copyright 2024, University of Colorado Boulder

/**
 * A RichDragListener that supports sounds for grab and release.
 *
 * @author Jesse Greenberg
 */

import { DragListener, DragListenerOptions, KeyboardDragListener, KeyboardDragListenerOptions, RichDragListener, RichDragListenerOptions } from '../../scenery/js/imports.js';
import { combineOptions, optionize3 } from '../../phet-core/js/optionize.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import SoundClip, { SoundClipOptions } from '../../tambo/js/sound-generators/SoundClip.js';
import soundManager, { SoundGeneratorAddOptions } from '../../tambo/js/soundManager.js';
import grab_mp3 from '../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../tambo/sounds/release_mp3.js';
import SceneryPhetConstants from './SceneryPhetConstants.js';
import sceneryPhet from './sceneryPhet.js';

// Options for drag listeners that are specific to sound.
export type RichDragListenerSoundOptions = {

  // Grab and release sounds. `null` means no sound.
  grabSound?: WrappedAudioBuffer | null | undefined;
  releaseSound?: WrappedAudioBuffer | null;

  // Passed to the grab and release SoundClip instances.
  grabSoundClipOptions?: SoundClipOptions;
  releaseSoundClipOptions?: SoundClipOptions;

  // addSoundGeneratorOptions
  grabSoundGeneratorAddOptions?: SoundGeneratorAddOptions;
  releaseSoundGeneratorAddOptions?: SoundGeneratorAddOptions;
};

type SelfOptions = {
  keyboardDragListenerSoundOptions?: RichDragListenerSoundOptions;
  dragListenerSoundOptions?: RichDragListenerSoundOptions;
} & RichDragListenerSoundOptions;

export type SoundRichDragListenerOptions = RichDragListenerOptions & SelfOptions;

// Default values for sounds used by the drag listeners.
const DEFAULT_SOUND_OPTIONS = {
  grabSound: grab_mp3,
  releaseSound: release_mp3,
  grabSoundClipOptions: SceneryPhetConstants.DEFAULT_DRAG_CLIP_OPTIONS,
  releaseSoundClipOptions: SceneryPhetConstants.DEFAULT_DRAG_CLIP_OPTIONS,
  grabSoundGeneratorAddOptions: SceneryPhetConstants.DEFAULT_GRAB_SOUND_GENERATOR_ADD_OPTIONS,
  releaseSoundGeneratorAddOptions: SceneryPhetConstants.DEFAULT_GRAB_SOUND_GENERATOR_ADD_OPTIONS
} as const;

// Factored out of optionize for readability.
const SOUND_RICH_DRAG_LISTENER_DEFAULTS = _.assignIn( {
  keyboardDragListenerSoundOptions: {},
  dragListenerSoundOptions: {},

  // Empty objects by default so we have a reference to the wrapped callbacks when we forward them to the drag
  // listeners, see wireSoundsToDragCallbacks.
  dragListenerOptions: {},
  keyboardDragListenerOptions: {}
}, DEFAULT_SOUND_OPTIONS );

export default class SoundRichDragListener extends RichDragListener {
  public constructor( providedOptions?: SoundRichDragListenerOptions ) {

    const options = optionize3<SoundRichDragListenerOptions, SelfOptions, RichDragListenerOptions>()(
      {}, SOUND_RICH_DRAG_LISTENER_DEFAULTS, providedOptions
    );

    // Apply overrides for the KeyboardDragListener sounds and forward to the KeyboardDragListenerOptions drag callbacks.
    const dragListenerClips = SoundRichDragListener.wireSoundsToDragCallbacks(
      options,
      options.keyboardDragListenerSoundOptions,
      options.keyboardDragListenerOptions
    );

    // Apply overrides for the DragListener sounds and forward to the DragListenerOptions drag callbacks.
    const keyboardDragListenerClips = SoundRichDragListener.wireSoundsToDragCallbacks(
      options,
      options.dragListenerSoundOptions,
      options.dragListenerOptions
    );

    super( options );

    // Dispose the grab and release clips when the listener is disposed.
    SoundRichDragListener.wireDisposeListener( this.dragListener, dragListenerClips[ 0 ], dragListenerClips[ 1 ] );
    SoundRichDragListener.wireDisposeListener( this.keyboardDragListener, keyboardDragListenerClips[ 0 ], keyboardDragListenerClips[ 1 ] );
  }

  /**
   * Wire the sounds to the drag callbacks. Returns a tuple of the grab and release SoundClips so that they can be
   * disposed when the listener is disposed.
   *
   * @param soundOptions - A default set of sound options.
   * @param listenerSoundOptions - Overriding sound options for a particular listener.
   * @param listenerOptions - Listener specific options with start/end callbacks. Callbacks will be modified/wrapped
   *                          to play sounds on grab and release. This object is modified, and so it is required.
   */
  public static wireSoundsToDragCallbacks<T extends DragListener>(
    soundOptions: RichDragListenerSoundOptions,
    listenerSoundOptions: RichDragListenerSoundOptions | undefined,
    listenerOptions: KeyboardDragListenerOptions | DragListenerOptions<T>
  ):
    [ SoundClip | undefined, SoundClip | undefined ] {

    const dragListenerSoundOptions = combineOptions<RichDragListenerSoundOptions>( {}, soundOptions, listenerSoundOptions );
    listenerOptions = listenerOptions || {};

    // Create the grab SoundClip and wire it into the start function for the drag cycle.
    let dragClip: SoundClip | undefined;
    if ( dragListenerSoundOptions.grabSound ) {
      dragClip = new SoundClip( dragListenerSoundOptions.grabSound, dragListenerSoundOptions.grabSoundClipOptions );
      soundManager.addSoundGenerator( dragClip, dragListenerSoundOptions.grabSoundGeneratorAddOptions );

      const previousStart = listenerOptions.start;

      // @ts-expect-error - The args have implicit any type because of the union of KeyboardDragListenerOptions and
      // DragListenerOptions. I (JG) couldn't figure out how to type this properly, even defining the args.
      listenerOptions.start = ( ...args ) => {

        // @ts-expect-error - see above note.
        previousStart && previousStart( ...args );
        dragClip!.play();
      };
    }

    // Create the release SoundClip and wire it into the end function for the drag cycle.
    let releaseClip: SoundClip | undefined;
    if ( dragListenerSoundOptions.releaseSound ) {
      releaseClip = new SoundClip( dragListenerSoundOptions.releaseSound, dragListenerSoundOptions.releaseSoundClipOptions );
      soundManager.addSoundGenerator( releaseClip, dragListenerSoundOptions.releaseSoundGeneratorAddOptions );

      const previousEnd = listenerOptions.end;

      // @ts-expect-error - The args have implicit any type because of the union of KeyboardDragListenerOptions and
      // DragListenerOptions. I (JG) couldn't figure out how to type this properly, even defining the args.
      listenerOptions.end = ( ...args ) => {

        // @ts-expect-error - see above note.
        previousEnd && previousEnd( ...args );

        const listener = args[ 1 ] as DragListener | KeyboardDragListener;
        assert && assert( listener instanceof DragListener || listener instanceof KeyboardDragListener, 'listener should be an instance of DragListener or KeyboardDragListener' );
        !listener.interrupted && releaseClip!.play();
      };
    }

    return [ dragClip, releaseClip ];
  }

  /**
   * Dispose of the SoundClips and deregister them with soundManager when the listener is disposed.
   */
  public static wireDisposeListener(
    listener: DragListener | KeyboardDragListener,
    grabClip: SoundClip | undefined,
    releaseClip: SoundClip | undefined
  ): void {
    listener.disposeEmitter.addListener( () => {
      if ( grabClip ) {
        grabClip.dispose();
        soundManager.removeSoundGenerator( grabClip );
      }

      if ( releaseClip ) {
        releaseClip.dispose();
        soundManager.removeSoundGenerator( releaseClip );
      }
    } );
  }

  public static readonly DEFAULT_SOUND_OPTIONS = DEFAULT_SOUND_OPTIONS;
}

sceneryPhet.register( 'SoundRichDragListener', SoundRichDragListener );