// Copyright 2016-2022, University of Colorado Boulder

/**
 * Button that toggles between an open and closed eyeball, used to control the visibility of something.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import { Node, Path } from '../../../scenery/js/imports.js';
import eyeSlashSolidShape from '../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import RectangularToggleButton, { RectangularToggleButtonOptions } from '../../../sun/js/buttons/RectangularToggleButton.js';
import sceneryPhet from '../sceneryPhet.js';
import Property from '../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

export type EyeToggleButtonOptions = SelfOptions & StrictOmit<RectangularToggleButtonOptions, 'content'>;

export default class EyeToggleButton extends RectangularToggleButton<boolean> {

  private readonly disposeEyeToggleButton: () => void;

  /**
   * @param eyeOpenProperty - true: eye is open; false: eye is closed
   * @param providedOptions
   */
  public constructor( eyeOpenProperty: Property<boolean>, providedOptions?: EyeToggleButtonOptions ) {

    const options = optionize<EyeToggleButtonOptions, SelfOptions, RectangularToggleButtonOptions>()( {}, providedOptions );

    // icons
    const iconOptions = {
      scale: 0.08,
      fill: 'black'
    };
    const eyeOpenNode = new Path( eyeSolidShape, iconOptions );
    const eyeCloseNode = new Path( eyeSlashSolidShape, iconOptions );
    eyeCloseNode.center = eyeOpenNode.center;

    // button content
    options.content = new Node( {
      children: [ eyeCloseNode, eyeOpenNode ]
    } );

    // toggle which icon is shown
    const eyeOpenObserver = ( eyeOpen: boolean ) => {
      eyeOpenNode.visible = eyeOpen;
      eyeCloseNode.visible = !eyeOpen;
    };
    eyeOpenProperty.link( eyeOpenObserver ); // unlink required by dispose

    super( eyeOpenProperty, true, false, options );

    this.disposeEyeToggleButton = () => {
      eyeOpenProperty.unlink( eyeOpenObserver );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EyeToggleButton', this );
  }

  public override dispose(): void {
    this.disposeEyeToggleButton();
    super.dispose();
  }
}

sceneryPhet.register( 'EyeToggleButton', EyeToggleButton );