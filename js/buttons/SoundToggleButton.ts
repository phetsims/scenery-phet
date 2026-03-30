// Copyright 2014-2026, University of Colorado Boulder

/**
 * Button for toggling sound on and off.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Property from '../../../axon/js/Property.js';
import Shape from '../../../kite/js/Shape.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRectangularToggleButton, { BooleanRectangularToggleButtonOptions } from '../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import volumeOffShape from '../../../sun/js/shapes/volumeOffShape.js';
import volumeOnShape from '../../../sun/js/shapes/volumeOnShape.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

// constants
const WIDTH = 45;
const HEIGHT = 45;
const MARGIN = 4;
const X_WIDTH = WIDTH * 0.25; // Empirically determined.

type SelfOptions = EmptySelfOptions;

export type SoundToggleButtonOptions = SelfOptions & StrictOmit<BooleanRectangularToggleButtonOptions,
  'accessibleName' | 'accessiblePressedProperty' | 'accessibleRoleConfiguration'>;

export default class SoundToggleButton extends BooleanRectangularToggleButton {

  private readonly disposeSoundToggleButton: () => void;

  public constructor( property: Property<boolean>, provideOptions?: SoundToggleButtonOptions ) {
    const accessiblePressedProperty = DerivedProperty.not( property );

    const options = optionize<SoundToggleButtonOptions, SelfOptions, BooleanRectangularToggleButtonOptions>()( {

      // BooleanRectangularToggleButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN,

      // This button acts as a "toggle" for sound, but with inverted "pressed" logic. The
      // accessibleName for the button is "Mute Sound" and so it is is "pressed" when
      // sound is OFF, while our property is true when sound is ON.
      accessibleName: SceneryPhetFluent.a11y.soundToggle.labelStringProperty,
      accessibleRoleConfiguration: 'toggle',
      accessiblePressedProperty: accessiblePressedProperty
    }, provideOptions );

    // 'on' icon is a font-awesome icon
    const soundOnNode = new Path( volumeOnShape, {
      fill: 'black'
    } );
    const contentScale = ( WIDTH - ( 2 * MARGIN ) ) / soundOnNode.width;
    soundOnNode.scale( contentScale );

    // 'off' icon is a font-awesome icon, with an 'x' added to the right.
    const soundOffNode = new Node();
    soundOffNode.addChild( new Path( volumeOffShape, {
      scale: contentScale,
      fill: 'black'
    } ) );
    const soundOffX = new Path( new Shape().moveTo( 0, 0 ).lineTo( X_WIDTH, X_WIDTH ).moveTo( 0, X_WIDTH ).lineTo( X_WIDTH, 0 ), {
      stroke: 'black',
      lineWidth: 3,
      right: soundOnNode.width, // position the 'x' so that both icons have the same width, see scenery-phet#329
      centerY: soundOffNode.centerY
    } );
    soundOffNode.addChild( soundOffX );

    super( property, soundOnNode, soundOffNode, options );

    this.disposeSoundToggleButton = () => {
      accessiblePressedProperty.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'SoundToggleButton', this );
  }

  public override dispose(): void {
    this.disposeSoundToggleButton();
    super.dispose();
  }
}

sceneryPhet.register( 'SoundToggleButton', SoundToggleButton );