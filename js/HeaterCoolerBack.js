// Copyright 2015-2020, University of Colorado Boulder

/**
 * Representation of the back of a HeaterCoolerNode.  It is independent from the front of the HeaterCoolerNode so that
 * one can easily layer objects between the heater/cooler front and back.  The back contains the elliptical hole and the
 * fire and ice images.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

import Vector2 from '../../dot/js/Vector2.js';
import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Color from '../../scenery/js/util/Color.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import fireImage from '../images/flame_png.js';
import iceImage from '../images/ice-cube-stack_png.js';
import sceneryPhet from './sceneryPhet.js';

//images

// constants
// Scale factor that determines the height of the heater opening.  Can be made an optional parameter if necessary.
const OPENING_HEIGHT_SCALE = 0.1;
const DEFAULT_WIDTH = 120; // in screen coords, much of the rest of the size of the stove derives from this value
const DEFAULT_BASE_COLOR = 'rgb( 159, 182, 205 )';

class HeaterCoolerBack extends Node {

  /**
   * @param {NumberProperty} heatCoolAmountProperty // +1 for max heating, -1 for max cooling
   * @param {Object} [options]
   * @constructor
   */
  constructor( heatCoolAmountProperty, options ) {
    super();

    options = merge( {
      baseColor: DEFAULT_BASE_COLOR // {Color|string} Base color used for the bowl of the burner
    }, options );

    // Dimensions for the rest of the stove, dependent on the desired stove width.
    const burnerOpeningHeight = DEFAULT_WIDTH * OPENING_HEIGHT_SCALE;

    // Create the inside bowl of the burner, which is an ellipse.
    const burnerInteriorShape = new Shape()
      .ellipse( DEFAULT_WIDTH / 2, burnerOpeningHeight / 4, DEFAULT_WIDTH / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false );
    const burnerInterior = new Path( burnerInteriorShape, {
      stroke: 'black',
      fill: new LinearGradient( 0, 0, DEFAULT_WIDTH, 0 )
        .addColorStop( 0, Color.toColor( options.baseColor ).darkerColor( 0.5 ) )
        .addColorStop( 1, Color.toColor( options.baseColor ).brighterColor( 0.5 ) )
    } );

    const fireNode = new Image( fireImage, {
      centerX: burnerInterior.centerX,
      top: burnerInterior.bottom,
      scale: DEFAULT_WIDTH / DEFAULT_WIDTH
    } );

    const iceNode = new Image( iceImage, {
      centerX: burnerInterior.centerX,
      top: burnerInterior.bottom,
      scale: DEFAULT_WIDTH / DEFAULT_WIDTH
    } );

    heatCoolAmountProperty.link( function( heatCoolAmount ) {

      // max heating and cooling is limited to +/- 1
      assert && assert( Math.abs( heatCoolAmount ) <= 1 );

      if ( heatCoolAmount > 0 ) {
        fireNode.setTranslation( ( burnerInterior.width - fireNode.width ) / 2, -heatCoolAmount * fireImage.height * .85 );
      }
      else if ( heatCoolAmount < 0 ) {
        iceNode.setTranslation( ( burnerInterior.width - iceNode.width ) / 2, heatCoolAmount * iceImage.height * 0.85 );
      }
      iceNode.setVisible( heatCoolAmount < 0 );
      fireNode.setVisible( heatCoolAmount > 0 );
    } );

    this.addChild( burnerInterior );
    this.addChild( fireNode );
    this.addChild( iceNode );

    this.mutate( options );
  }

  /**
   * Convenience function that returns the correct position for the front of the HeaterCoolerNode.  Specifically,
   * this returns the left center of the burner opening.
   *
   * @returns {Vector2}
   * @public
   */
  getHeaterFrontPosition() {
    return new Vector2( this.leftTop.x, this.leftTop.y + this.width * OPENING_HEIGHT_SCALE / 2 );
  }
}

// Shape of heater front depends on this value.
// @static
HeaterCoolerBack.OPENING_HEIGHT_SCALE = OPENING_HEIGHT_SCALE;

sceneryPhet.register( 'HeaterCoolerBack', HeaterCoolerBack );
export default HeaterCoolerBack;