// Copyright 2014-2025, University of Colorado Boulder

/**
 * Button with an eraser icon.
 *
 * @author John Blanco
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import { TrimParallelDOMOptions } from '../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import Image from '../../../scenery/js/nodes/Image.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import sharedSoundPlayers from '../../../tambo/js/sharedSoundPlayers.js';
import eraser_svg from '../../images/eraser_svg.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';

type SelfOptions = {
  iconWidth?: number; // width of eraser icon, used for scaling, the aspect ratio will determine height
};

type TrimmedParentOptions = TrimParallelDOMOptions<RectangularPushButtonOptions>;
export type EraserButtonOptions = SelfOptions & StrictOmit<TrimmedParentOptions, 'content'>;

export default class EraserButton extends RectangularPushButton {

  public constructor( providedOptions?: EraserButtonOptions ) {

    const options = optionize<EraserButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // SelfOptions
      iconWidth: 20,

      // RectangularPushButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,

      // pdom
      accessibleName: SceneryPhetStrings.a11y.eraserButton.accessibleNameStringProperty,

      // sound
      soundPlayer: sharedSoundPlayers.get( 'erase' )
    }, providedOptions );

    // eraser icon
    options.content = new Image( eraser_svg );
    options.content.scale( options.iconWidth / options.content.width );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EraserButton', this );
  }
}

sceneryPhet.register( 'EraserButton', EraserButton );