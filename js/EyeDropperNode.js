// Copyright 2014-2020, University of Colorado Boulder

/**
 * Eye dropper, with a button for dispensing whatever is in the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import RoundMomentaryButton from '../../sun/js/buttons/RoundMomentaryButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import backgroundImage from '../images/eye_dropper_background_png.js';
import foregroundImage from '../images/eye_dropper_foreground_png.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEBUG_ORIGIN = false; // if true, put a red dot at the dropper's origin (bottom center)

// constants specific to the image files
const TIP_WIDTH = 15;
const TIP_HEIGHT = 4;
const GLASS_WIDTH = 46;
const GLASS_MAX_Y = -18; // relative to bottom center
const GLASS_MIN_Y = -124; // relative to bottom center
const BUTTON_CENTER_Y_OFFSET = 32; // y-offset of button's center in dropper image file

class EyeDropperNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      dispensingProperty: new Property( false ), // is the dropper dispensing?
      enabledProperty: new Property( true ), // is the button enabled?
      emptyProperty: new Property( false ), // does the dropper appear to be empty?
      buttonTouchAreaDilation: 15, // dilation of the button's radius for touchArea
      fluidColor: 'yellow', // {Color|String} color of the fluid in the glass

      // Node options
      cursor: 'pointer',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super();

    // @public
    this.dispensingProperty = options.dispensingProperty;
    this.enabledProperty = options.enabledProperty;
    this.emptyProperty = options.emptyProperty;

    // @private fluid fills the glass portion of the dropper, shape is specific to the dropper image file
    this.fluidNode = new Path( new Shape()
      .moveTo( -TIP_WIDTH / 2, 0 )
      .lineTo( -TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( -GLASS_WIDTH / 2, GLASS_MAX_Y )
      .lineTo( -GLASS_WIDTH / 2, GLASS_MIN_Y )
      .lineTo( GLASS_WIDTH / 2, GLASS_MIN_Y )
      .lineTo( GLASS_WIDTH / 2, GLASS_MAX_Y )
      .lineTo( TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( TIP_WIDTH / 2, 0 )
      .close(), {
      fill: options.fluidColor
    } );

    // images, origin moved to bottom center
    const foreground = new Image( foregroundImage );
    const background = new Image( backgroundImage );
    foreground.x = -foreground.width / 2;
    foreground.y = -foreground.height;
    background.x = -background.width / 2;
    background.y = -background.height;

    // button, centered in the dropper's bulb
    const button = new RoundMomentaryButton( false, true, this.dispensingProperty, {
      baseColor: 'red',
      radius: 18,
      listenerOptions: {
        // We want to be able to drag the dropper WHILE dispensing, see https://github.com/phetsims/ph-scale/issues/86
        attach: false
      },
      tandem: options.tandem.createTandem( 'button' )
    } );
    const enabledObserver = function( enabled ) { button.enabled = enabled; };
    this.enabledProperty.link( enabledObserver );
    button.touchArea = Shape.circle( 0, 0, ( button.width / 2 ) + options.buttonTouchAreaDilation );
    button.centerX = foreground.centerX;
    button.centerY = foreground.top + BUTTON_CENTER_Y_OFFSET;

    // make the background visible only when the dropper is empty
    const emptyObserver = empty => {
      this.fluidNode.visible = !empty;
      background.visible = empty;
    };
    this.emptyProperty.link( emptyObserver );

    assert && assert( !options.children, 'EyeDropperNode sets children' );
    options.children = [ this.fluidNode, background, foreground, button ];

    // add a red dot at the origin
    if ( DEBUG_ORIGIN ) {
      options.children.push( new Circle( { radius: 3, fill: 'red' } ) );
    }

    this.mutate( options );

    // @private
    this.disposeEyeDropperNode = () => {
      button.dispose();
      this.enabledProperty.unlink( enabledObserver );
      this.emptyProperty.unlink( emptyObserver );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EyeDropperNode', this );
  }

  get fluidColor() {
    return this.getFluidColor();
  }

  set fluidColor( value ) {
    this.setFluidColor( value );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeEyeDropperNode();
    super.dispose();
  }

  /**
   * Sets the color of the fluid in the dropper.
   * @param color {ColorDef}
   * @public
   */
  setFluidColor( color ) {
    this.fluidNode.fill = color;
  }

  /**
   * Gets the color of the fluid in the dropper.
   * @returns {ColorDef}
   * @public
   */
  getFluidColor() {
    return this.fluidNode.fill;
  }
}

// @public You'll need these if you want to create fluid coming out of the tip, or put a label on the glass.
EyeDropperNode.TIP_WIDTH = TIP_WIDTH;
EyeDropperNode.TIP_HEIGHT = TIP_HEIGHT;
EyeDropperNode.GLASS_WIDTH = GLASS_WIDTH;
EyeDropperNode.GLASS_MIN_Y = GLASS_MIN_Y;
EyeDropperNode.GLASS_MAX_Y = GLASS_MAX_Y;

sceneryPhet.register( 'EyeDropperNode', EyeDropperNode );
export default EyeDropperNode;