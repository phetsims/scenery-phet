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
import { Circle, Image, Node, NodeOptions, Path, TPaint } from '../../scenery/js/imports.js';
import RoundMomentaryButton, { RoundMomentaryButtonOptions } from '../../sun/js/buttons/RoundMomentaryButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import eyeDropperBackground_png from '../images/eyeDropperBackground_png.js';
import eyeDropperForeground_png from '../images/eyeDropperForeground_png.js';
import sceneryPhet from './sceneryPhet.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';

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
  public static readonly TIP_WIDTH = 15;
  public static readonly TIP_HEIGHT = 4;
  public static readonly GLASS_WIDTH = 46;

  // You'll need these if you want to put a label on the glass. Values are relative to bottom center.
  public static readonly GLASS_MIN_Y = -124;
  public static readonly GLASS_MAX_Y = -18;

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
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'DropperNode'
    }, provideOptions );

    super();

    this.isDispensingProperty = options.isDispensingProperty;
    this.isEmptyProperty = options.isEmptyProperty;

    // fluid fills the glass portion of the dropper, shape is specific to the dropper image file
    const fluidShape = new Shape()
      .moveTo( -EyeDropperNode.TIP_WIDTH / 2, 0 )
      .lineTo( -EyeDropperNode.TIP_WIDTH / 2, -EyeDropperNode.TIP_HEIGHT )
      .lineTo( -EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MAX_Y )
      .lineTo( -EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MIN_Y )
      .lineTo( EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MIN_Y )
      .lineTo( EyeDropperNode.GLASS_WIDTH / 2, EyeDropperNode.GLASS_MAX_Y )
      .lineTo( EyeDropperNode.TIP_WIDTH / 2, -EyeDropperNode.TIP_HEIGHT )
      .lineTo( EyeDropperNode.TIP_WIDTH / 2, 0 )
      .close();
    this.fluidNode = new Path( fluidShape, {
      fill: options.fluidColor,
      visibleProperty: DerivedProperty.not( this.isEmptyProperty ) // visible when not empty
    } );

    // body of the dropper, origin at bottom center
    const foreground = new Image( eyeDropperForeground_png );
    const background = new Image( eyeDropperBackground_png, {
      visibleProperty: this.isEmptyProperty // visible when empty
    } );
    const bodyNode = new Node( {
      children: [ background, foreground ]
    } );
    bodyNode.x = -bodyNode.width / 2;
    bodyNode.y = -bodyNode.height;

    // button, centered in the dropper's bulb
    const button = new RoundMomentaryButton( this.isDispensingProperty, false, true, combineOptions<RoundMomentaryButtonOptions>( {
      centerX: bodyNode.centerX,
      centerY: bodyNode.top + BUTTON_CENTER_Y_OFFSET,
      tandem: options.tandem.createTandem( 'button' )
    }, options.buttonOptions ) );

    options.children = [ this.fluidNode, bodyNode, button ];

    // add a red dot at the origin
    if ( DEBUG_ORIGIN ) {
      options.children.push( new Circle( { radius: 3, fill: 'red' } ) );
    }

    this.mutate( options );

    this.disposeEyeDropperNode = () => {
      button.dispose();
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
   * Gets the color of the fluid in the dropper.
   */
  public getFluidColor(): TPaint {
    return this.fluidNode.fill;
  }

  /**
   * Sets the color of the fluid in the dropper.
   */
  public setFluidColor( color: TPaint ): void {
    this.fluidNode.fill = color;
  }

  public get fluidColor(): TPaint {
    return this.getFluidColor();
  }

  public set fluidColor( value: TPaint ) {
    this.setFluidColor( value );
  }
}

sceneryPhet.register( 'EyeDropperNode', EyeDropperNode );