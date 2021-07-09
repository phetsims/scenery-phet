// Copyright 2014-2021, University of Colorado Boulder

/**
 * Button for toggling sound on and off.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */

import Shape from '../../../kite/js/Shape.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import volumeOffSolidShape from '../../../sherpa/js/fontawesome-5/volumeOffSolidShape.js';
import volumeUpSolidShape from '../../../sherpa/js/fontawesome-5/volumeUpSolidShape.js';
import BooleanRectangularToggleButton from '../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';

// constants
const WIDTH = 45;
const HEIGHT = 45;
const MARGIN = 4;
const X_WIDTH = WIDTH * 0.25; // Empirically determined.

class SoundToggleButton extends BooleanRectangularToggleButton {

  /**
   *
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( property, options ) {

    options = merge( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN,

      // pdom
      tagName: 'button',
      innerContent: sceneryPhetStrings.a11y.soundToggle.label
    }, options );

    // 'on' icon is a font-awesome icon
    const soundOnNode = new Path( volumeUpSolidShape, {
      fill: 'black'
    } );
    const contentScale = ( WIDTH - ( 2 * MARGIN ) ) / soundOnNode.width;
    soundOnNode.scale( contentScale );

    // 'off' icon is a font-awesome icon, with an 'x' added to the right.
    const soundOffNode = new Node();
    soundOffNode.addChild( new Path( volumeOffSolidShape, {
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

    super( soundOnNode, soundOffNode, property, options );

    // pdom attribute lets user know when the toggle is pressed
    const pressedListener = value => {
      this.setPDOMAttribute( 'aria-pressed', !value );
    };
    property.lazyLink( pressedListener );
    this.setPDOMAttribute( 'aria-pressed', !property.get() );

    // @private - make eligible for garbage collection
    this.disposeSoundToggleButton = () => {
      property.unlink( pressedListener );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'SoundToggleButton', this );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeSoundToggleButton();
    super.dispose();
  }
}

sceneryPhet.register( 'SoundToggleButton', SoundToggleButton );
export default SoundToggleButton;