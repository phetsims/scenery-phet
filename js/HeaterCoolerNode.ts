// Copyright 2015-2022, University of Colorado Boulder

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

import NumberProperty from '../../axon/js/NumberProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import optionize from '../../phet-core/js/optionize.js';
import { Color, Node, NodeOptions } from '../../scenery/js/imports.js';
import VSlider from '../../sun/js/VSlider.js';
import Tandem from '../../tandem/js/Tandem.js';
import HeaterCoolerBack, { HeaterCoolerBackOptions } from './HeaterCoolerBack.js';
import HeaterCoolerFront, { HeaterCoolerFrontOptions } from './HeaterCoolerFront.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  // color of the stove body, applied to HeaterCoolerFront and HeaterCoolerBack
  baseColor?: Color | string;

  // options passed to HeaterCoolerFront
  frontOptions?: HeaterCoolerFrontOptions;

  // options passed to HeaterCoolerBack
  backOptions?: HeaterCoolerBackOptions;
};

export type HeaterCoolerNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class HeaterCoolerNode extends Node {

  public readonly heatCoolAmountProperty: NumberProperty;

  // With public visibility annotation comes great power - use it wisely.
  // See https://github.com/phetsims/scenery-phet/issues/442
  public readonly slider: VSlider;

  private readonly disposeHeaterCoolerNode: () => void;

  /**
   * @param heatCoolAmountProperty +1 for max heating, -1 for max cooling, 0 for no change
   * @param providedOptions
   */
  public constructor( heatCoolAmountProperty: NumberProperty, providedOptions?: HeaterCoolerNodeOptions ) {
    super();

    const options = optionize<HeaterCoolerNodeOptions, StrictOmit<SelfOptions, 'frontOptions' | 'backOptions'>, NodeOptions>()( {

      // SelfOptions
      baseColor: HeaterCoolerFront.DEFAULT_BASE_COLOR,

      // NodeOptions
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'HeaterCoolerNode'
    }, providedOptions );

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

      // HeaterCoolerFront can be instrumented as a composite in some usages. Here, HeaterCoolerNode is the composite, so
      // don't instrument the HeaterCoolerFront.
      phetioInstrument: false,
      tandem: options.tandem // Keep the same tandem so that things like slider are instrumented directly underneat this Node.
    }, options.frontOptions ) );

    this.slider = heaterCoolerFront.slider;

    options.children = [ heaterCoolerBack, heaterCoolerFront ];

    this.mutate( options );

    this.disposeHeaterCoolerNode = function() {
      heaterCoolerBack.dispose();
      heaterCoolerFront.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'HeaterCoolerNode', this );
  }

  public override dispose(): void {
    this.disposeHeaterCoolerNode();
    super.dispose();
  }
}

sceneryPhet.register( 'HeaterCoolerNode', HeaterCoolerNode );