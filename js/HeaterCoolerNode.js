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
  const Dimension2 = require( 'DOT/Dimension2' );
  const HeaterCoolerBack = require( 'SCENERY_PHET/HeaterCoolerBack' );
  const HeaterCoolerFront = require( 'SCENERY_PHET/HeaterCoolerFront' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const DEFAULT_HEAT_COOL_AMOUNT_PROPERTY = new NumberProperty( 0, {
    range: new Range( -1, 1 ) // +1 for max heating, -1 for max cooling
  } );

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
        heatCoolAmountProperty: DEFAULT_HEAT_COOL_AMOUNT_PROPERTY, // Property set through interaction with slider.
        heatEnabled: true, // Can this node heat the environment?
        coolEnabled: true, // Can this node cool the environment?

        // slider options
        thumbSize: new Dimension2( 22, 45 ),
        thumbTouchAreaXDilation: 11,
        thumbTouchAreaYDilation: 11,
        thumbMouseAreaXDilation: 0,
        thumbMouseAreaYDilation: 0
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

      // @public Dispose function used for GC
      this.disposeHeaterCoolerNode = function() {
        this.heatCoolAmountProperty.dispose();
        heaterCoolerBack.dispose();
        heaterCoolerFront.dispose();
      };

      this.mutate( options );
    }

    /**
     * @public
     */
    dispose() {
      Node.prototype.dispose.call( this );
      this.disposeHeaterCoolerNode();
    }
  }

  return sceneryPhet.register( 'HeaterCoolerNode', HeaterCoolerNode );
} );

