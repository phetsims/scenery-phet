// Copyright 2015-2022, University of Colorado Boulder

/**
 * Representation of the back of a HeaterCoolerNode.  It is independent from the front of the HeaterCoolerNode so that
 * one can easily layer objects between the heater/cooler front and back.  The back contains the elliptical hole and the
 * fire and ice images.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { Color, Image, LinearGradient, Node, NodeOptions, Path } from '../../scenery/js/imports.js';
import flame_png from '../images/flame_png.js';
import iceCubeStack_png from '../images/iceCubeStack_png.js';
import HeaterCoolerFront from './HeaterCoolerFront.js';
import sceneryPhet from './sceneryPhet.js';

const DEFAULT_WIDTH = 120; // in screen coords, much of the rest of the size of the stove derives from this value

type SelfOptions = {
  baseColor?: Color | string; // Base color used for the bowl of the stove
};

export type HeaterCoolerBackOptions = SelfOptions & NodeOptions;

export default class HeaterCoolerBack extends Node {

  // Scale factor that determines the height of the heater opening. Can be made an optional parameter if necessary.
  public static readonly OPENING_HEIGHT_SCALE = 0.1;

  /**
   * @param heatCoolAmountProperty // +1 for max heating, -1 for max cooling
   * @param providedOptions
   */
  public constructor( heatCoolAmountProperty: NumberProperty, providedOptions?: HeaterCoolerBackOptions ) {
    super();

    const options = optionize<HeaterCoolerBackOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      baseColor: HeaterCoolerFront.DEFAULT_BASE_COLOR
    }, providedOptions );

    // Dimensions for the rest of the stove, dependent on the desired stove width.
    const stoveOpeningHeight = DEFAULT_WIDTH * HeaterCoolerBack.OPENING_HEIGHT_SCALE;

    // Create the inside bowl of the stove, which is an ellipse.
    const stoveBaseColor = Color.toColor( options.baseColor );
    const stoveInteriorShape = new Shape()
      .ellipse( DEFAULT_WIDTH / 2, stoveOpeningHeight / 4, DEFAULT_WIDTH / 2, stoveOpeningHeight / 2, 0 );
    const stoveInterior = new Path( stoveInteriorShape, {
      stroke: 'black',
      fill: new LinearGradient( 0, 0, DEFAULT_WIDTH, 0 )
        .addColorStop( 0, stoveBaseColor.darkerColor( 0.5 ) )
        .addColorStop( 1, stoveBaseColor.brighterColor( 0.5 ) )
    } );

    const fireNode = new Image( flame_png, {
      centerX: stoveInterior.centerX,
      top: stoveInterior.bottom,
      scale: DEFAULT_WIDTH / DEFAULT_WIDTH
    } );

    const iceNode = new Image( iceCubeStack_png, {
      centerX: stoveInterior.centerX,
      top: stoveInterior.bottom,
      scale: DEFAULT_WIDTH / DEFAULT_WIDTH
    } );

    heatCoolAmountProperty.link( heatCoolAmount => {

      // max heating and cooling is limited to +/- 1
      assert && assert( Math.abs( heatCoolAmount ) <= 1 );

      if ( heatCoolAmount > 0 ) {
        fireNode.setTranslation( ( stoveInterior.width - fireNode.width ) / 2, -heatCoolAmount * flame_png.height * 0.85 );
      }
      else if ( heatCoolAmount < 0 ) {
        iceNode.setTranslation( ( stoveInterior.width - iceNode.width ) / 2, heatCoolAmount * iceCubeStack_png.height * 0.85 );
      }
      iceNode.setVisible( heatCoolAmount < 0 );
      fireNode.setVisible( heatCoolAmount > 0 );
    } );

    this.addChild( stoveInterior );
    this.addChild( fireNode );
    this.addChild( iceNode );

    this.mutate( options );
  }

  /**
   * Convenience function that returns the correct position for the front of the HeaterCoolerNode.
   * Specifically, this returns the left center of the stove opening.
   */
  public getHeaterFrontPosition(): Vector2 {
    return new Vector2( this.leftTop.x, this.leftTop.y + this.width * HeaterCoolerBack.OPENING_HEIGHT_SCALE / 2 );
  }
}

sceneryPhet.register( 'HeaterCoolerBack', HeaterCoolerBack );