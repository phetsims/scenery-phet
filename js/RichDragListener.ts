// Copyright 2024, University of Colorado Boulder
/**
 * RichDragListener extends DragListener to integrate PhET-specific designed features that should be broadly
 * applied to DragListener instances in phetsims. This includes the grab and release sound clips.
 *
 * @author Agustín Vallejo
 */

import sun from './sun.js';
import { DragListener, DragListenerOptions } from '../../scenery/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import SoundClip, { SoundClipOptions } from '../../tambo/js/sound-generators/SoundClip.js';
import grab2_mp3 from '../../tambo/sounds/grab2_mp3.js';
import release_mp3 from '../../tambo/sounds/release_mp3.js';
import soundManager from '../../tambo/js/soundManager.js';

type SelfOptions = {

  // If false, grab/release sounds will not be added by the RichDragListener instance. Note that adding these sounds
  // involves overwriting provided start/end callbacks.
  addGrabReleaseSounds?: boolean;

  // Provided to the grab and release SoundClip instances. Ignored if addGrabReleaseSounds:false
  dragClipOptions?: SoundClipOptions | null;
};

const DEFAULT_DRAG_CLIP_OPTIONS: SoundClipOptions = {
  initialOutputLevel: 0.4
};

export type RichDragListenerOptions = SelfOptions & DragListenerOptions<IntentionalAny>;

export default class RichDragListener extends DragListener {
  public constructor( providedOptions: RichDragListenerOptions ) {

    const options = optionize<RichDragListenerOptions, SelfOptions, DragListenerOptions<IntentionalAny>>()( {
      addGrabReleaseSounds: true,
      dragClipOptions: null

    }, providedOptions );

    if ( options.addGrabReleaseSounds ) {

      // Create sound clips.
      const dragClipOptions = providedOptions.dragClipOptions ? providedOptions.dragClipOptions : DEFAULT_DRAG_CLIP_OPTIONS;
      const grabClip = new SoundClip( grab2_mp3, dragClipOptions );
      const releaseClip = new SoundClip( release_mp3, dragClipOptions );

      const previousStart = options.start;
      options.start = ( ...args ) => {
        previousStart && previousStart( ...args );
        grabClip.play();
      };

      const previousEnd = options.end;
      options.end = ( ...args ) => {
        previousEnd && previousEnd( ...args );
        releaseClip.play();
      };

      // Add the sound clips to the soundManager.
      soundManager.addSoundGenerator( grabClip );
      soundManager.addSoundGenerator( releaseClip );
    }

    super( options );
  }
}

sun.register( 'RichDragListener', RichDragListener );