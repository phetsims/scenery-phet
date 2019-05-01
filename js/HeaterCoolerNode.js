// Copyright 2015-2019, University of Colorado Boulder

/**
 * This is the graphical representation of a stove that can be used to heat or cool things.  The HeaterCoolerNode is
 * composed of HeaterCoolerFront and HeaterCoolerBack so that objects can be layered inside of the heater to create a
 * 3D effect.  This is a convenience node that puts the back and the front together for cases where nothing other than
 * the flame and the ice needs to come out of the bucket.
 *
 * @author Siddhartha Chinthapally (Actual Concepts) on 20-11-2014.
 * @author Jesse Greenberg
 * @author Denzell Barnett (PhET Interactive Sims)
 * @author Chris Malley  (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HeaterCoolerBack = require( 'SCENERY_PHET/HeaterCoolerBack' );
  const HeaterCoolerFront = require( 'SCENERY_PHET/HeaterCoolerFront' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );

  // const
  const DEFAULT_BASE_COLOR = 'rgb( 159, 182, 205 )';

  class HeaterCoolerNode extends Node {

    /**
     * @param {NumberProperty} heatCoolAmountProperty +1 for max heating, -1 for max cooling
     * @param {Object} [options]
     * @constructor
     */
    constructor( heatCoolAmountProperty, options ) {
      super();
      Tandem.indicateUninstrumentedCode();

      options = _.extend( {

        // {Color|string} color of the body, applied to HeaterCoolerBack and HeaterCoolerFront
        baseColor: DEFAULT_BASE_COLOR,

        // {*|null} options passed to HeaterCoolerFront
        frontOptions: null,

        // {*|null} options passed to HeaterCoolerBack
        backOptions: null
      }, options );

      // @public
      this.heatCoolAmountProperty = heatCoolAmountProperty;

      // Add the HeaterCoolerBack which contains the heater opening and the fire/ice images
      assert && assert( !options.backOptions || !options.backOptions.baseColor,
        'HeaterCoolerNode sets baseColor for HeaterCoolerBack' );
      const heaterCoolerBack = new HeaterCoolerBack( heatCoolAmountProperty, _.extend( {
        baseColor: options.baseColor
      }, options.backOptions ) );

      // Add the HeaterCoolerFront which contains the labels, stove body, and control slider.
      assert && assert( !options.frontOptions || !options.frontOptions.baseColor,
        'HeaterCoolerNode sets baseColor for HeaterCoolerFront' );
      const heaterCoolerFront = new HeaterCoolerFront( heatCoolAmountProperty, _.extend( {
        baseColor: options.baseColor,
        leftTop: heaterCoolerBack.getHeaterFrontPosition()
      }, options.frontOptions ) );

      // @public (read-only) With this visibility annotation comes great power - use it wisely.
      // See https://github.com/phetsims/scenery-phet/issues/442
      this.slider = heaterCoolerFront.slider;

      assert && assert( !options.children, 'HeaterCoolerNode sets children' );
      options.children = [ heaterCoolerBack, heaterCoolerFront ];

      super.mutate( options );

      // @public Dispose function used for GC
      this.disposeHeaterCoolerNode = function() {
        heaterCoolerBack.dispose();
        heaterCoolerFront.dispose();
      };
    }
    
    /**
     * @public
     * @override
     */
    dispose() {
      this.disposeHeaterCoolerNode();
      super.dispose();
    }
  }

  return sceneryPhet.register( 'HeaterCoolerNode', HeaterCoolerNode );
} );

