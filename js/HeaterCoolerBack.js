// Copyright 2015-2016, University of Colorado Boulder

/**
 * Representation of the back of a HeaterCoolerNode.  It is independent from the front of the HeaterCoolerNode so that
 * one can easily layer objects between the heater/cooler front and back.  The back contains the elliptical hole and the
 * fire and ice images.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Property = require( 'AXON/Property' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Vector2 = require( 'DOT/Vector2' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  //images
  var fireImage = require( 'image!SCENERY_PHET/flame.png' );
  var iceImage = require( 'image!SCENERY_PHET/ice-cube-stack.png' );

  // constants
  // Scale factor that determines the height of the heater opening.  Can be made an optional parameter if necessary.
  var OPENING_HEIGHT_SCALE = 0.1;

  /**
   * Constructor for a HeaterCoolerBack.
   *
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function HeaterCoolerBack( options ) {
    Tandem.indicateUninstrumentedCode();

    Node.call( this );

    options = _.extend( {
      baseColor: new Color( 159, 182, 205 ), //  base color used for the stove body
      width: 120, // in screen coords, much of the rest of the size of the stove derives from this value
      snapToZero: true, // controls whether the slider will snap to the off.
      heatCoolAmountProperty: new Property( 0 ), // Property set through interaction with slider.  +1 for max heating, -1 for max cooling.
      heatEnabled: true, // Can this node heat the environment?
      coolEnabled: true // Can this node cool the environment?
    }, options );

    // Dimensions for the rest of the stove, dependent on the desired stove width.
    var burnerOpeningHeight = options.width * OPENING_HEIGHT_SCALE;

    // Create the inside bowl of the burner, which is an ellipse.
    var burnerInteriorShape = new Shape()
      .ellipse( options.width / 2, burnerOpeningHeight / 4, options.width / 2, burnerOpeningHeight / 2, 0, 0, Math.PI, false );
    var burnerInterior = new Path( burnerInteriorShape, {
      stroke: 'black',
      fill: new LinearGradient( 0, 0, options.width, 0 )
        .addColorStop( 0, options.baseColor.darkerColor( 0.5 ) )
        .addColorStop( 1, options.baseColor.brighterColor( 0.5 ) )
    } );

    var fireNode = new Image( fireImage, { centerX: burnerInterior.centerX, top: burnerInterior.bottom } );
    var iceNode = new Image( iceImage, { centerX: burnerInterior.centerX, top: burnerInterior.bottom } );
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
  }

  sceneryPhet.register( 'HeaterCoolerBack', HeaterCoolerBack );

  return inherit( Node, HeaterCoolerBack, {

    /**
     * Convenience function that returns the correct position for the front of the HeaterCoolerNode.  Specifically,
     * this returns the left center of the burner opening.
     *
     * @returns {Vector2}
     * @public
     */
    getHeaterFrontPosition: function() {
      return new Vector2( this.leftTop.x, this.leftTop.y + this.width * OPENING_HEIGHT_SCALE / 2 );
    }

  }, {

    // Shape of heater front depends on this value.
    // @static
    OPENING_HEIGHT_SCALE: OPENING_HEIGHT_SCALE

  } );
} );

