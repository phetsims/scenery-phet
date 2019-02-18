// Copyright 2015-2019, University of Colorado Boulder

/**
 * Representation of the back of a HeaterCoolerNode.  It is independent from the front of the HeaterCoolerNode so that
 * one can easily layer objects between the heater/cooler front and back.  The back contains the elliptical hole and the
 * fire and ice images.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );

  //images
  const fireImage = require( 'image!SCENERY_PHET/flame.png' );
  const iceImage = require( 'image!SCENERY_PHET/ice-cube-stack.png' );

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
      Tandem.indicateUninstrumentedCode();

      options = _.extend( {
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
      heatCoolAmountProperty.link( function( heat ) {

        // max heating and cooling is limited to +/- 1
        assert && assert( Math.abs( heat ) <= 1 );

        if ( heat > 0 ) {
          fireNode.setTranslation( ( burnerInterior.width - fireNode.width ) / 2, -heat * fireImage.height * .85 );
        }
        else if ( heat < 0 ) {
          iceNode.setTranslation( ( burnerInterior.width - iceNode.width ) / 2, heat * iceImage.height * 0.85 );
        }
        iceNode.setVisible( heat < 0 );
        fireNode.setVisible( heat > 0 );
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

  return sceneryPhet.register( 'HeaterCoolerBack', HeaterCoolerBack );
} );

