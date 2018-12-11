// Copyright 2015-2018, University of Colorado Boulder

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
  const HeaterCoolerBack = require( 'SCENERY_PHET/HeaterCoolerBack' );
  const HeaterCoolerFront = require( 'SCENERY_PHET/HeaterCoolerFront' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );

  class HeaterCoolerNode extends Node {
    /**
     * Constructor for a HeaterCoolerNode.
     *
     * @param {NumberProperty} [heatCoolAmountProperty] +1 for max heating, -1 for max cooling
     * @param {Object} [options] that can be passed on to the underlying node
     * @constructor
     */
    constructor( heatCoolAmountProperty, options ) {
      super();
      Tandem.indicateUninstrumentedCode();

      options = _.extend( {
        backOptions: null,
        frontOptions: null
      }, options );

      // @public
      this.heatCoolAmountProperty = heatCoolAmountProperty;

      // Add the HeaterCoolerBack which contains the heater opening and the fire/ice images
      let heaterCoolerBack = new HeaterCoolerBack( heatCoolAmountProperty, options.backOptions );
      this.addChild( heaterCoolerBack );

      // Add the HeaterCoolerFront which contains the labels, stove body, and control slider.
      let heaterCoolerFront = new HeaterCoolerFront( heatCoolAmountProperty, options.frontOptions );
      heaterCoolerFront.leftTop = heaterCoolerBack.getHeaterFrontPosition();
      this.addChild( heaterCoolerFront );

      // @public Dispose function used for GC
      this.disposeHeaterCoolerNode = function() {
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

