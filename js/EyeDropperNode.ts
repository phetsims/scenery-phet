// Copyright 2014-2022, University of Colorado Boulder

/**
 * Eye dropper, with a button for dispensing whatever is in the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { Circle, Image, TPaint, Node, NodeOptions, Path } from '../../scenery/js/imports.js';
import RoundMomentaryButton, { RoundMomentaryButtonOptions } from '../../sun/js/buttons/RoundMomentaryButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import eyeDropperBackground_png from '../images/eyeDropperBackground_png.js';
import eyeDropperForeground_png from '../images/eyeDropperForeground_png.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEBUG_ORIGIN = false; // if true, put a red dot at the dropper's origin (bottom center)
const BUTTON_CENTER_Y_OFFSET = 32; // y-offset of button's center in dropper image file

type SelfOptions = {

  // is the dropper dispensing?
  isDispensingProperty?: Property<boolean>;

  // does the dropper appear to be empty?
  isEmptyProperty?: Property<boolean>;

  // color of the fluid in the glass
  fluidColor?: TPaint;

  // propagated to RoundMomentaryButton
  buttonOptions?: RoundMomentaryButtonOptions;
};

export type EyeDropperNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class EyeDropperNode extends Node {

  // is the dropper dispensing?
  public readonly isDispensingProperty: Property<boolean>;

  // is the dropper empty of fluid?
  public readonly isEmptyProperty: Property<boolean>;

  // for clients who want to hide the button
  public readonly button: Node;

  // fluid in the dropper
  private readonly fluidNode: Path;

  private readonly disposeEyeDropperNode: () => void;

  // You'll need these if you want to create fluid coming out of the tip.
  public static TIP_WIDTH = 15;
  public static TIP_HEIGHT = 4;
  public static GLASS_WIDTH = 46;

  // You'll need these if you want to put a label on the glass. Values are relative to bottom center.
  public static GLASS_MIN_Y = -124;
  public static GLASS_MAX_Y = -18;

  public constructor( provideOptions?: EyeDropperNodeOptions ) {

    const options = optionize<EyeDropperNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      isDispensingProperty: new Property<boolean>( false ),
      isEmptyProperty: new Property<boolean>( false ),
      fluidColor: 'yellow',
      buttonOptions: {
        touchAreaDilation: 15,
        baseColor: 'red',
        radius: 18,
        listenerOptions: {
          // We want to be able to drag the dropper WHILE dispensing, see https://github.com/phetsims/ph-scale/issues/86
          attach: false
        }
      },

      // NodeOptions
      cursor: 'pointer',
      tandem: Tandem.REQUIRED
    }, provideOptions );

    super();

    this.isDispensingProperty = options.isDispensingProperty;
    this.isEmptyProperty = options.isEmptyProperty;

    // fluid fills the glass portion of the dropper, shape is specific to the dropper image file
    this.fluidNode = new Path( new Shape()
      .moveTo( -EyeDropperNode.TIP_WIDTH / 2, 0 )
      .lineTo( -EyeDropperNode.TIP_WIDTH / 2, -EyeDropperNode.TIP_HEIGHT )
      .lineTo( -EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MAX_Y )
      .lineTo( -EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MIN_Y )
      .lineTo( EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MIN_Y )
      .lineTo( EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MAX_Y )
      .lineTo( EyeDropperNode.TIP_WIDTH / 2, -EyeDropperNode.TIP_HEIGHT )
      .lineTo( EyeDropperNode.TIP_WIDTH / 2, 0 )
      .close(), {
      fill: options.fluidColor
    } );

    // images, origin moved to bottom center
    const foreground = new Image( eyeDropperForeground_png );
    const background = new Image( eyeDropperBackground_png );
    foreground.x = -foreground.width / 2;
    foreground.y = -foreground.height;
    background.x = -background.width / 2;
    background.y = -background.height;

    // button, centered in the dropper's bulb
    const button = new RoundMomentaryButton( this.isDispensingProperty, false, true, combineOptions<RoundMomentaryButtonOptions>( {
      centerX: foreground.centerX,
      centerY: foreground.top + BUTTON_CENTER_Y_OFFSET,
      tandem: options.tandem.createTandem( 'button' )
    }, options.buttonOptions ) );

    // make the background visible only when the dropper is empty
    const emptyObserver = ( empty: boolean ) => {
      this.fluidNode.visible = !empty;
      background.visible = empty;
    };
    this.isEmptyProperty.link( emptyObserver );

    options.children = [ this.fluidNode, background, foreground, button ];

    // add a red dot at the origin
    if ( DEBUG_ORIGIN ) {
      options.children.push( new Circle( { radius: 3, fill: 'red' } ) );
    }

    this.mutate( options );

    this.disposeEyeDropperNode = () => {
      button.dispose();
      this.isEmptyProperty.unlink( emptyObserver );
    };

    this.button = button;

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'EyeDropperNode', this );
  }

  public override dispose(): void {
    this.disposeEyeDropperNode();
    super.dispose();
  }

  /**
   * Sets the color of the fluid in the dropper.
   */
  public setFluidColor( color: TPaint ): void {
    this.fluidNode.fill = color;
  }

  public set fluidColor( value: TPaint ) {
    this.setFluidColor( value );
  }

  public get fluidColor(): TPaint {
    return this.getFluidColor();
  }

  /**
   * Gets the color of the fluid in the dropper.
   */
  public getFluidColor(): TPaint {
    return this.fluidNode.fill;
  }

}

sceneryPhet.register( 'EyeDropperNode', EyeDropperNode );