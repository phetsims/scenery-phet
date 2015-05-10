// Copyright 2002-2015, University of Colorado Boulder

/**
 * Representation of the back of a HeaterCoolerNode.  It is independent from the front of the HeaterCoolerNode so that one can easily layer
 * objects between the heater/cooler front and back.  The back contains the elliptical hole and the fire and ice images.
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

  //images
  var fireImage = require( 'image!SCENERY_PHET/flame.png' );
  var iceImage = require( 'image!SCENERY_PHET/ice-cube-stack.png' );

  /**
   * Constructor for a HeaterCoolerBack.
   *
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function HeaterCoolerBack( options ) {

    Node.call( this, options );

    options = _.extend( {
      baseColor: new Color( 159, 182, 205 ), //  Base color used for the stove body.
      width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
      snapToZero: true, // controls whether the slider will snap to the off.
      heatCoolLevelProperty: new Property( 0 ), // Property set through interaction with slider.  Max value for heating, min for cooling.
      heatEnabled: true, // Can this node heat the environment?
      coolEnabled: true // Can this node cool the environment?
    }, options );

    // Dimensions for the rest of the stove, dependent on the desired stove width.
    var burnerOpeningHeight = options.width * 0.1;

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
    options.heatCoolLevelProperty.link( function( heat ) {
      if ( heat > 0 ) {
        fireNode.setTranslation( (burnerInterior.width - fireNode.width) / 2, -heat * fireImage.height * 0.85 );
      }
      else if ( heat < 0 ) {
        iceNode.setTranslation( (burnerInterior.width - iceNode.width) / 2, heat * iceImage.height * 0.85 );
      }
      iceNode.setVisible( heat < 0 );
      fireNode.setVisible( heat > 0 );
    } );

    this.addChild( burnerInterior );
    this.addChild( fireNode );
    this.addChild( iceNode );

    this.mutate( options );

  }

  return inherit( Node, HeaterCoolerBack, {

    /**
     * Convenience function that returns the correct position for the front of the HeaterCoolerNode.  Specifically,
     * this returns the left center of the burner opening under the assumption that the burner opening height is 0.1
     * times the burner width.
     *
     * @returns {Vector2}
     */
    getHeaterFrontPosition: function() {
      return new Vector2( this.leftTop.x, this.leftTop.y + this.width * 0.1 / 2 );
    }

  } );
} );

