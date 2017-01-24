// Copyright 2015-2016, University of Colorado Boulder

/**
 * This is the graphical representation of a stove that can be used to heat or cool things.  The HeaterCoolerNode is
 * composed of HeaterCoolerFront and HeaterCoolerBack so that objects can be layered inside of the heater to create a
 * 3D effect.  This is a convenience node that puts the back and the front together for cases where nothing other than
 * the flame and the ice needs to come out of the bucket.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HeaterCoolerFront = require( 'SCENERY_PHET/HeaterCoolerFront' );
  var HeaterCoolerBack = require( 'SCENERY_PHET/HeaterCoolerBack' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * Constructor for a HeaterCoolerNode.
   *
   * @param {Object} [options] that can be passed on to the underlying node
   * @constructor
   */
  function HeaterCoolerNode( options ) {
    Tandem.indicateUninstrumentedCode();

    Node.call( this );

    options = _.extend( {
      baseColor: new Color( 159, 182, 205 ), //  Base color used for the stove body.
      width: 120, // In screen coords, much of the rest of the size of the stove derives from this value.
      snapToZero: true, // controls whether the slider will snap to the off.
      heatCoolAmountProperty: new Property( 0 ), // Property set through interaction with slider.  +1 for max heating, -1 for max cooling.
      heatEnabled: true, // Can this node heat the environment?
      coolEnabled: true // Can this node cool the environment?
    }, options );

    // @public
    this.heatCoolAmountProperty = options.heatCoolAmountProperty;

    // Add the HeaterCoolerBack which contains the heater opening and the fire/ice images
    var heaterCoolerBack = new HeaterCoolerBack( options );
    this.addChild( heaterCoolerBack );

    // Add the HeaterCoolerFront which contains the labels, stove body, and control slider.
    var heaterCoolerFront = new HeaterCoolerFront( options );
    heaterCoolerFront.leftTop = heaterCoolerBack.getHeaterFrontPosition();
    this.addChild( heaterCoolerFront );

    this.mutate( options );
  }

  sceneryPhet.register( 'HeaterCoolerNode', HeaterCoolerNode );

  return inherit( Node, HeaterCoolerNode );
} );

