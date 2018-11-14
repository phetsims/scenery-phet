// Copyright 2015-2017, University of Colorado Boulder

/**
 * This is the graphical representation of a stove that can be used to heat or cool things.  The HeaterCoolerNode is
 * composed of HeaterCoolerFront and HeaterCoolerBack so that objects can be layered inside of the heater to create a
 * 3D effect.  This is a convenience node that puts the back and the front together for cases where nothing other than
 * the flame and the ice needs to come out of the bucket.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const HeaterCoolerBack = require( 'SCENERY_PHET/HeaterCoolerBack' );
  const HeaterCoolerFront = require( 'SCENERY_PHET/HeaterCoolerFront' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );

  class HeaterCoolerNode extends Node {
    /**
     * Constructor for a HeaterCoolerNode.
     *
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    constructor( options ) {
      super();
      Tandem.indicateUninstrumentedCode();

      options = _.extend( {
        baseColor: new Color( 159, 182, 205 ), //  Base color used for the stove body.
        width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
        snapToZero: true, // controls whether the slider will snap to the off through end drag.
        heatCoolAmountProperty: new Property( 0 ), // Property set through interaction with slider.  +1 for max heating, -1 for max cooling.
        heatEnabled: true, // Can this node heat the environment?
        coolEnabled: true // Can this node cool the environment?
      }, options );

      // @public
      this.heatCoolAmountProperty = options.heatCoolAmountProperty;

      // Add the HeaterCoolerBack which contains the heater opening and the fire/ice images
      let heaterCoolerBack = new HeaterCoolerBack( options );
      this.addChild( heaterCoolerBack );

      // Add the HeaterCoolerFront which contains the labels, stove body, and control slider.
      let heaterCoolerFront = new HeaterCoolerFront( options );
      heaterCoolerFront.leftTop = heaterCoolerBack.getHeaterFrontPosition();
      this.addChild( heaterCoolerFront );

      this.mutate( options );
    }


  }

  return sceneryPhet.register( 'HeaterCoolerNode', HeaterCoolerNode );
} );

