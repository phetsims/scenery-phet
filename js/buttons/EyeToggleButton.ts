// Copyright 2016-2026, University of Colorado Boulder

/**
 * Button that toggles between an open and closed eyeball, used to control the visibility of something.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularToggleButton, { RectangularToggleButtonOptions } from '../../../sun/js/buttons/RectangularToggleButton.js';
import eyeSlashSolidShape from '../../../sun/js/shapes/eyeSlashSolidShape.js';
import eyeSolidShape from '../../../sun/js/shapes/eyeSolidShape.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = EmptySelfOptions;

// The EyeToggleButton is meant to be a "toggle" with a single accessible name. It uses accessibleRoleConfiguration
// "toggle" to indicate the pressed state. As such, use an accessible name like "Component Visibility" rather than
// "Show Component" / "Hide Component". The result will be "Component Visibility, pressed" when the eye is open,
// and "Component Visibility, not pressed" when the eye is closed.
export type EyeToggleButtonOptions = SelfOptions & StrictOmit<RectangularToggleButtonOptions, 'content' | 'accessibleNameOn' | 'accessibleNameOff' | 'accessibleRoleConfiguration'>;

export default class EyeToggleButton extends RectangularToggleButton<boolean> {

  private readonly disposeEyeToggleButton: () => void;

  /**
   * @param eyeOpenProperty - true: eye is open; false: eye is closed
   * @param providedOptions
   */
  public constructor( eyeOpenProperty: Property<boolean>, providedOptions?: EyeToggleButtonOptions ) {
    const options = optionize<EyeToggleButtonOptions, SelfOptions, RectangularToggleButtonOptions>()( {
      accessibleRoleConfiguration: 'toggle'
    }, providedOptions );

    // icons
    const iconOptions = {
      scale: 0.76,
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

    super( eyeOpenProperty, false, true, options );

    this.disposeEyeToggleButton = () => {
      eyeOpenProperty.unlink( eyeOpenObserver );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EyeToggleButton', this );
  }

  public override dispose(): void {
    this.disposeEyeToggleButton();
    super.dispose();
  }
}

sceneryPhet.register( 'EyeToggleButton', EyeToggleButton );