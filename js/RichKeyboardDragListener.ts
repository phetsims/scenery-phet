// Copyright 2024, University of Colorado Boulder
/**
 * RichKeyboardDragListener extends KeyboardDragListener to integrate the drag and drop sound clips.
 *
 * @author Agustín Vallejo
 */

import sun from './sun.js';
import { KeyboardDragListener, KeyboardDragListenerOptions } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import SoundClip, { SoundClipOptions } from '../../tambo/js/sound-generators/SoundClip.js';
import grab_mp3 from '../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../tambo/sounds/release_mp3.js';
import soundManager from '../../tambo/js/soundManager.js';

type SelfOptions = {
  dragClipOptions?: SoundClipOptions | null;
};

const DEFAULT_DRAG_CLIP_OPTIONS: SoundClipOptions = {
  initialOutputLevel: 0.4
};

export type RichKeyboardDragListenerOptions = SelfOptions & KeyboardDragListenerOptions;

export default class RichKeyboardDragListener extends KeyboardDragListener {
  public constructor( providedOptions: RichKeyboardDragListenerOptions ) {

    // Create sound clips.
    const dragClipOptions = providedOptions.dragClipOptions ? providedOptions.dragClipOptions : DEFAULT_DRAG_CLIP_OPTIONS;
    const grabClip = new SoundClip( grab_mp3, dragClipOptions );
    const releaseClip = new SoundClip( release_mp3, dragClipOptions );

    // Add the sound clips to the soundManager.
    soundManager.addSoundGenerator( grabClip );
    soundManager.addSoundGenerator( releaseClip );

    const options = optionize<RichKeyboardDragListenerOptions, SelfOptions, KeyboardDragListenerOptions>()( {

      start: () => {
        grabClip.play();
      },

      end: () => {
        releaseClip.play();
      },

      dragClipOptions: null

    }, providedOptions );

    super( options );
  }
}

sun.register( 'RichKeyboardDragListener', RichKeyboardDragListener );