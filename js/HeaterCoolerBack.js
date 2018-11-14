// Copyright 2015-2017, University of Colorado Boulder

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
  const Range = require( 'DOT/Range' );
  const NumberProperty = require( 'AXON/NumberProperty' );
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
  const DEFAULT_HEAT_COOL_AMOUNT_PROPERTY = new NumberProperty( 0, {
    range: new Range( -1, 1 ) // +1 for max heating, -1 for max cooling
  } );

  class HeaterCoolerBack extends Node {

    /**
     * Constructor for a HeaterCoolerBack.
     *
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    constructor( options ) {
      super();
      Tandem.indicateUninstrumentedCode();

      options = _.extend( {
        baseColor: new Color( 159, 182, 205 ), //  base color used for the stove body
        width: 120, // in screen coords, much of the rest of the size of the stove derives from this value
        snapToZero: true, // controls whether the slider will snap to the off.
        heatCoolAmountProperty: DEFAULT_HEAT_COOL_AMOUNT_PROPERTY, // Property set through interaction with slider.
        heatEnabled: true, // Can this node heat the environment?
        coolEnabled: true // Can this node cool the environment?
      }, options );

      // Dimensions for the rest of the stove, dependent on the desired stove width.
      let burnerOpeningHeight = options.width * OPENING_HEIGHT_SCALE;

      // Create the inside bowl of the burner, which is an ellipse.
      let burnerInteriorShape = new Shape()
        .ellipse( options.width / 2, burnerOpeningHeight / 4, options.width / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false );
      let burnerInterior = new Path( burnerInteriorShape, {
        stroke: 'black',
        fill: new LinearGradient( 0, 0, options.width, 0 )
          .addColorStop( 0, options.baseColor.darkerColor( 0.5 ) )
          .addColorStop( 1, options.baseColor.brighterColor( 0.5 ) )
      } );

      let fireNode = new Image( fireImage, { centerX: burnerInterior.centerX, top: burnerInterior.bottom } );
      let iceNode = new Image( iceImage, { centerX: burnerInterior.centerX, top: burnerInterior.bottom } );
      options.heatCoolAmountProperty.link( function( heat ) {

        // max heating and cooling is limited to +/- 1
        assert && assert( Math.abs( heat ) <= 1 );

        if ( heat > 0 ) {
          fireNode.setTranslation( ( burnerInterior.width - fireNode.width ) / 2, -heat * fireImage.height * 0.85 );
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

    /**
     * @public
     */
    dispose() {
      Node.prototype.dispose.call( this );
    }
  }

  // Shape of heater front depends on this value.
  // @static
  HeaterCoolerBack.OPENING_HEIGHT_SCALE = OPENING_HEIGHT_SCALE;

  return sceneryPhet.register( 'HeaterCoolerBack', HeaterCoolerBack );
} );

