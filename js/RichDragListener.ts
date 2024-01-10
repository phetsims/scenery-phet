// Copyright 2024, University of Colorado Boulder
/**
 * RichDragListener extends DragListener to integrate the drag and drop sound clips.
 *
 * @author Agustín Vallejo
 */

import sun from './sun.js';
import { DragListener, DragListenerOptions } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import SoundClip, { SoundClipOptions } from '../../tambo/js/sound-generators/SoundClip.js';
import grab_mp3 from '../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../tambo/sounds/release_mp3.js';
import soundManager from '../../tambo/js/soundManager.js';

type SelfOptions = {
  dragClipOptions: SoundClipOptions;
};

export type RichDragListenerOptions = SelfOptions & DragListenerOptions<IntentionalAny>;

export default class RichDragListener extends DragListener {
  public constructor( providedOptions: RichDragListenerOptions ) {

    // Create sound clips.
    const dragClipOptions = providedOptions.dragClipOptions ? providedOptions.dragClipOptions : {};
    const grabClip = new SoundClip( grab_mp3, dragClipOptions );
    const releaseClip = new SoundClip( release_mp3, dragClipOptions );

    // Add the sound clips to the soundManager.
    soundManager.addSoundGenerator( grabClip );
    soundManager.addSoundGenerator( releaseClip );

    const options = optionize<RichDragListenerOptions, SelfOptions, DragListenerOptions<IntentionalAny>>()( {

      start: () => {
        grabClip.play();
      },

      end: () => {
        releaseClip.play();
      }

    }, providedOptions );

    super( options );
  }
}

sun.register( 'RichDragListener', RichDragListener );