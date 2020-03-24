// Copyright 2014-2020, University of Colorado Boulder

/**
 * Button for toggling sound on and off.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */

import Shape from '../../../kite/js/Shape.js';
import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRectangularToggleButton from '../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import FontAwesomeNode from '../../../sun/js/FontAwesomeNode.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import sceneryPhet from '../sceneryPhet.js';

// constants
const WIDTH = 45;
const HEIGHT = 45;
const MARGIN = 4;
const X_WIDTH = WIDTH * 0.25; // Empirically determined.

const soundToggleLabelString = sceneryPhetStrings.a11y.soundToggle.label;
const simSoundOnString = sceneryPhetStrings.a11y.soundToggle.simSoundOn;
const simSoundOffString = sceneryPhetStrings.a11y.soundToggle.simSoundOff;

/**
 *
 * @param {Property.<boolean>} property
 * @param {Object} [options]
 * @constructor
 */
function SoundToggleButton( property, options ) {

  // 'on' icon is a font-awesome icon
  const soundOnNode = new FontAwesomeNode( 'volume_up' );
  const contentScale = ( WIDTH - ( 2 * MARGIN ) ) / soundOnNode.width;
  soundOnNode.scale( contentScale );

  // 'off' icon is a font-awesome icon, with an 'x' added to the right.
  const soundOffNode = new Node();
  soundOffNode.addChild( new FontAwesomeNode( 'volume_off', { scale: contentScale } ) );
  const soundOffX = new Path( new Shape().moveTo( 0, 0 ).lineTo( X_WIDTH, X_WIDTH ).moveTo( 0, X_WIDTH ).lineTo( X_WIDTH, 0 ), {
    stroke: 'black',
    lineWidth: 3,
    right: soundOnNode.width, // position the 'x' so that both icons have the same width, see scenery-phet#329
    centerY: soundOffNode.centerY
  } );
  soundOffNode.addChild( soundOffX );

  BooleanRectangularToggleButton.call( this, soundOnNode, soundOffNode, property, merge( {
    baseColor: PhetColorScheme.BUTTON_YELLOW,
    minWidth: WIDTH,
    minHeight: HEIGHT,
    xMargin: MARGIN,
    yMargin: MARGIN,

    // a11y
    tagName: 'button',
    innerContent: soundToggleLabelString
  }, options ) );

  const self = this;

  // accessible attribute lets user know when the toggle is pressed, linked lazily so that an alert isn't triggered
  // on construction and must be unlinked in dispose
  const pressedListener = function( value ) {
    self.setAccessibleAttribute( 'aria-pressed', !value );

    const alertString = value ? simSoundOnString : simSoundOffString;
    phet.joist.sim.utteranceQueue.addToBack( alertString );
  };
  property.lazyLink( pressedListener );
  self.setAccessibleAttribute( 'aria-pressed', !property.get() );

  // @private - make eligible for garbage collection
  this.disposeSoundToggleButton = function() {
    property.unlink( pressedListener );
  };

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'SoundToggleButton', this );
}

sceneryPhet.register( 'SoundToggleButton', SoundToggleButton );

export default inherit( BooleanRectangularToggleButton, SoundToggleButton, {

  /**
   * Make eligible for garbage collection.
   * @public
   */
  dispose: function() {
    this.disposeSoundToggleButton();
    BooleanRectangularToggleButton.prototype.dispose.call( this );
  }
} );