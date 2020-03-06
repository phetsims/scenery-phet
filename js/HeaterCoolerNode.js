// Copyright 2015-2020, University of Colorado Boulder

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

import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Tandem from '../../tandem/js/Tandem.js';
import HeaterCoolerBack from './HeaterCoolerBack.js';
import HeaterCoolerFront from './HeaterCoolerFront.js';
import sceneryPhet from './sceneryPhet.js';

// const
const DEFAULT_BASE_COLOR = 'rgb( 159, 182, 205 )';

class HeaterCoolerNode extends Node {

  /**
   * @param {NumberProperty} heatCoolAmountProperty +1 for max heating, -1 for max cooling, 0 for no change
   * @param {Object} [options]
   * @constructor
   */
  constructor( heatCoolAmountProperty, options ) {
    super();

    options = merge( {

      // {Color|string} color of the body, applied to HeaterCoolerBack and HeaterCoolerFront
      baseColor: DEFAULT_BASE_COLOR,

      // {*|null} options passed to HeaterCoolerFront
      frontOptions: null,

      // {*|null} options passed to HeaterCoolerBack
      backOptions: null,

      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.heatCoolAmountProperty = heatCoolAmountProperty;

    // Add the HeaterCoolerBack which contains the heater opening and the fire/ice images
    assert && assert( !options.backOptions || !options.backOptions.baseColor,
      'HeaterCoolerNode sets baseColor for HeaterCoolerBack' );
    const heaterCoolerBack = new HeaterCoolerBack( heatCoolAmountProperty, merge( {
      baseColor: options.baseColor
    }, options.backOptions ) );

    // Add the HeaterCoolerFront which contains the labels, stove body, and control slider.
    assert && assert( !options.frontOptions || !options.frontOptions.baseColor,
      'HeaterCoolerNode sets baseColor for HeaterCoolerFront' );
    const heaterCoolerFront = new HeaterCoolerFront( heatCoolAmountProperty, merge( {
      baseColor: options.baseColor,
      leftTop: heaterCoolerBack.getHeaterFrontPosition(),
      heaterCoolerBack: heaterCoolerBack,

      // The front takes the entire tandem since we are treating it as a consolidated component (client doesn't need
      // to know about front vs back)
      tandem: options.tandem
    }, options.frontOptions ) );

    // @public (read-only) With this visibility annotation comes great power - use it wisely.
    // See https://github.com/phetsims/scenery-phet/issues/442
    this.slider = heaterCoolerFront.slider;

    assert && assert( !options.children, 'HeaterCoolerNode sets children' );
    options.children = [ heaterCoolerBack, heaterCoolerFront ];

    super.mutate( merge( {}, options, {

      // Do not propagate options.tandem to super because HeaterCoolerFront is the only part of HeaterCoolerNode that's
      // instrumented, so it will pass the same Tandem to super instead.
      // See https://github.com/phetsims/scenery-phet/issues/579
      tandem: Tandem.OPTIONAL
    } ) );

    // @public Dispose function used for GC
    this.disposeHeaterCoolerNode = function() {
      heaterCoolerBack.dispose();
      heaterCoolerFront.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'HeaterCoolerNode', this );
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

sceneryPhet.register( 'HeaterCoolerNode', HeaterCoolerNode );
export default HeaterCoolerNode;