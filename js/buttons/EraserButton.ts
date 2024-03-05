// Copyright 2014-2024, University of Colorado Boulder

/**
 * Button with an eraser icon.
 *
 * @author John Blanco
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../phet-core/js/optionize.js';
import { Image } from '../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import eraser_png from '../../images/eraser_png.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SoundClipPlayer from '../../../tambo/js/sound-generators/SoundClipPlayer.js';
import erase_mp3 from '../../sounds/erase_mp3.js';

type SelfOptions = {
  iconWidth?: number; // width of eraser icon, used for scaling, the aspect ratio will determine height
};

export type EraserButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class EraserButton extends RectangularPushButton {

  public constructor( providedOptions?: EraserButtonOptions ) {

    const options = optionize<EraserButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // SelfOptions
      iconWidth: 20,

      // RectangularPushButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      soundPlayer: new SoundClipPlayer( erase_mp3, {
        soundClipOptions: { initialOutputLevel: 0.22 }
      } )
    }, providedOptions );

    // eraser icon
    options.content = new Image( eraser_png );
    options.content.scale( options.iconWidth / options.content.width );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EraserButton', this );
  }
}

sceneryPhet.register( 'EraserButton', EraserButton );