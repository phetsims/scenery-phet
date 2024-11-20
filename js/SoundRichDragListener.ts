// Copyright 2024, University of Colorado Boulder

/**
 * A RichDragListener that supports sounds for grab and release.
 *
 * @author Jesse Greenberg
 */

import { combineOptions, optionize3 } from '../../phet-core/js/optionize.js';
import { DragListener, KeyboardDragListener, RichDragListener, RichDragListenerOptions } from '../../scenery/js/imports.js';
import SoundClip, { SoundClipOptions } from '../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager, { SoundGeneratorAddOptions } from '../../tambo/js/soundManager.js';
import TSoundPlayer from '../../tambo/js/TSoundPlayer.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import grab_mp3 from '../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../tambo/sounds/release_mp3.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetConstants from './SceneryPhetConstants.js';

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
  dragListenerOptions: {},
  keyboardDragListenerOptions: {}
}, DEFAULT_SOUND_OPTIONS );

export default class SoundRichDragListener extends RichDragListener {
  public constructor( providedOptions?: SoundRichDragListenerOptions ) {

    const options = optionize3<SoundRichDragListenerOptions, SelfOptions, RichDragListenerOptions>()(
      {}, SOUND_RICH_DRAG_LISTENER_DEFAULTS, providedOptions
    );

    // Apply overrides for the KeyboardDragListener sounds and forward to the KeyboardDragListenerOptions drag callbacks.
    const [ dragListenerPressedSoundClip, dragListenerReleasedSoundClip ] = SoundRichDragListener.createSoundClips(
      options,
      options.dragListenerSoundOptions
    );

    // Apply overrides for the DragListener sounds and forward to the DragListenerOptions drag callbacks.
    const [ keyboardDragListenerPressedSoundClip, keyboardDragListenerReleasedSoundClip ] = SoundRichDragListener.createSoundClips(
      options,
      options.keyboardDragListenerSoundOptions
    );

    super( options );

    const dragListenerPressedListener = SoundRichDragListener.linkSounds( this.dragListener, dragListenerPressedSoundClip, dragListenerReleasedSoundClip );
    const keyboardDragListenerPressedListener = SoundRichDragListener.linkSounds( this.keyboardDragListener, keyboardDragListenerPressedSoundClip, keyboardDragListenerReleasedSoundClip );

    // Dispose the grab and release clips when the listener is disposed.
    SoundRichDragListener.wireDisposeListener( this.dragListener, dragListenerPressedSoundClip, dragListenerReleasedSoundClip, dragListenerPressedListener );
    SoundRichDragListener.wireDisposeListener( this.keyboardDragListener, keyboardDragListenerPressedSoundClip, keyboardDragListenerReleasedSoundClip, keyboardDragListenerPressedListener );
  }

  /**
   * Wire the sounds to the drag callbacks. Returns a tuple of the grab and release SoundClips so that they can be
   * disposed when the listener is disposed.
   *
   * @param soundOptions - A default set of sound options.
   * @param listenerSoundOptions - Overriding sound options for a particular listener.
   */
  public static createSoundClips(
    soundOptions: RichDragListenerSoundOptions,
    listenerSoundOptions: RichDragListenerSoundOptions | undefined
  ): [ SoundClip | undefined, SoundClip | undefined ] {

    const dragListenerSoundOptions = combineOptions<RichDragListenerSoundOptions>( {}, soundOptions, listenerSoundOptions );

    // Create the grab SoundClip and wire it into the start function for the drag cycle.
    let dragClip: SoundClip | undefined;
    if ( dragListenerSoundOptions.grabSound ) {
      dragClip = new SoundClip( dragListenerSoundOptions.grabSound, dragListenerSoundOptions.grabSoundClipOptions );
      soundManager.addSoundGenerator( dragClip, dragListenerSoundOptions.grabSoundGeneratorAddOptions );
    }

    // Create the release SoundClip and wire it into the end function for the drag cycle.
    let releaseClip: SoundClip | undefined;
    if ( dragListenerSoundOptions.releaseSound ) {
      releaseClip = new SoundClip( dragListenerSoundOptions.releaseSound, dragListenerSoundOptions.releaseSoundClipOptions );
      soundManager.addSoundGenerator( releaseClip, dragListenerSoundOptions.releaseSoundGeneratorAddOptions );
    }

    return [ dragClip, releaseClip ];
  }

  /**
   * Plays the sounds when the drag listener is pressed or released. A reference to the listener is returned so that
   * it can be removed for disposal.
   */
  public static linkSounds( dragListener: DragListener | KeyboardDragListener, grabSound: TSoundPlayer | undefined, releaseSound: TSoundPlayer | undefined ): ( isPressed: boolean ) => void {
    const isPressedListener = ( isPressed: boolean ) => {
      if ( isPressed ) {
        grabSound && grabSound.play();
      }
      else if ( !dragListener.interrupted ) {
        releaseSound && releaseSound.play();
      }
    };
    dragListener.isPressedProperty.link( isPressedListener );

    return isPressedListener;
  }

  /**
   * Handles disposal when the drag listener is disposed by removing sound clips from the sound manager and listeners on
   * the DragListener.
   */
  public static wireDisposeListener(
    listener: DragListener | KeyboardDragListener,
    grabClip: SoundGenerator | undefined,
    releaseClip: SoundGenerator | undefined,
    isPressedListener: ( isPressed: boolean ) => void
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

      listener.isPressedProperty.unlink( isPressedListener );
    } );
  }

  public static readonly DEFAULT_SOUND_OPTIONS = DEFAULT_SOUND_OPTIONS;
}

sceneryPhet.register( 'SoundRichDragListener', SoundRichDragListener );