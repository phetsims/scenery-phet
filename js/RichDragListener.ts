// Copyright 2024, University of Colorado Boulder

/**
 * RichDragListener extends DragListener to integrate PhET-specific features that should be broadly applied to
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
 */

import sceneryPhet from './sceneryPhet.js';
import { DragListener, DragListenerOptions, PressedDragListener } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import SoundClip, { SoundClipOptions } from '../../tambo/js/sound-generators/SoundClip.js';
import grab_mp3 from '../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../tambo/sounds/release_mp3.js';
import soundManager, { SoundGeneratorAddOptions } from '../../tambo/js/soundManager.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';

const DEFAULT_DRAG_CLIP_OPTIONS: SoundClipOptions = {
  initialOutputLevel: 0.4
};
const DEFAULT_ADD_SOUND_GENERATOR_OPTIONS: SoundGeneratorAddOptions = { categoryName: 'user-interface' };

type SelfOptions = {

  // Grab and release sounds. null means no sound.
  grabSound?: WrappedAudioBuffer | null;
  releaseSound?: WrappedAudioBuffer | null;

  // Passed to the grab and release SoundClip instances.
  grabSoundClipOptions?: SoundClipOptions;
  releaseSoundClipOptions?: SoundClipOptions;

  // addSoundGeneratorOptions
  grabSoundGeneratorAddOptions?: SoundGeneratorAddOptions;
  releaseSoundGeneratorAddOptions?: SoundGeneratorAddOptions;
};

// Pattern followed from DragListenerOptions.
export type PressedRichDragListener = RichDragListener & PressedDragListener;

export type RichDragListenerOptions<Listener extends PressedRichDragListener = PressedRichDragListener> = SelfOptions & DragListenerOptions<Listener>;

export default class RichDragListener extends DragListener {

  public constructor( providedOptions: RichDragListenerOptions ) {

    const options = optionize<RichDragListenerOptions, SelfOptions, DragListenerOptions<PressedRichDragListener>>()( {

      // SelfOptions
      grabSound: grab_mp3,
      releaseSound: release_mp3,
      grabSoundClipOptions: DEFAULT_DRAG_CLIP_OPTIONS,
      releaseSoundClipOptions: DEFAULT_DRAG_CLIP_OPTIONS,
      grabSoundGeneratorAddOptions: DEFAULT_ADD_SOUND_GENERATOR_OPTIONS,
      releaseSoundGeneratorAddOptions: DEFAULT_ADD_SOUND_GENERATOR_OPTIONS
    }, providedOptions );

    // Create the grab SoundClip and wire it into the start function for the drag cycle.
    let grabClip: SoundClip;
    if ( options.grabSound ) {

      grabClip = new SoundClip( options.grabSound, options.grabSoundClipOptions );
      soundManager.addSoundGenerator( grabClip, options.grabSoundGeneratorAddOptions );

      const previousStart = options.start;
      options.start = ( ...args ) => {
        previousStart && previousStart( ...args );
        grabClip.play();
      };
    }

    // Create the release SoundClip and wire it into the end function for the drag cycle.
    let releaseClip: SoundClip;
    if ( options.releaseSound ) {

      releaseClip = new SoundClip( options.releaseSound, options.releaseSoundClipOptions );
      soundManager.addSoundGenerator( releaseClip, options.releaseSoundGeneratorAddOptions );

      const previousEnd = options.end;
      options.end = ( ...args ) => {
        previousEnd && previousEnd( ...args );
        !this.interrupted && releaseClip.play();
      };
    }

    super( options );

    // Clean up SoundClips when this RichDragListener is disposed.
    this.disposeEmitter.addListener( () => {
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
}

sceneryPhet.register( 'RichDragListener', RichDragListener );