// Copyright 2020-2022, University of Colorado Boulder

/**
 * Demonstration of various spinners.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Range from '../../../dot/js/Range.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import { NodeOptions, Text, VBox } from '../../../scenery/js/imports.js';
import Checkbox from '../../../sun/js/Checkbox.js';
import DemosScreenView, { DemosScreenViewOptions } from '../../../sun/js/demo/DemosScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FineCoarseSpinner from '../FineCoarseSpinner.js';
import NumberPicker from '../../../sun/js/NumberPicker.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetQueryParameters from '../sceneryPhetQueryParameters.js';

type SelfOptions = EmptyObjectType;
type SpinnersScreenViewOptions = SelfOptions & DemosScreenViewOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class SpinnersScreenView extends DemosScreenView {

  public constructor( providedOptions: SpinnersScreenViewOptions ) {

    const options = optionize<SpinnersScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      selectedDemoLabel: sceneryPhetQueryParameters.component
    }, providedOptions );

    super( [

      /**
       * To add a demo, add an object literal here. Each object has these properties:
       *
       * {string} label - label in the combo box
       * {function(Bounds2): Node} createNode - creates the scene graph for the demo
       */
      { label: 'FineCoarseSpinner', createNode: demoFineCoarseSpinner },
      { label: 'NumberPicker', createNode: demoNumberPicker }
    ], options );
  }
}

// Creates a demo for FineCoarseSpinner
function demoFineCoarseSpinner( layoutBounds: Bounds2, providedOptions?: NodeOptions ) {

  const options = optionize<NodeOptions, EmptyObjectType, NodeOptions>()( {
    tandem: Tandem.OPTIONAL
  }, providedOptions );

  const numberProperty = new NumberProperty( 0, {
    range: new Range( 0, 100 ),
    tandem: options.tandem.createTandem( 'numberProperty' )
  } );

  const enabledProperty = new BooleanProperty( true, {
    tandem: options.tandem.createTandem( 'enabledProperty' )
  } );

  const spinner = new FineCoarseSpinner( numberProperty, {
    enabledProperty: enabledProperty,
    tandem: options.tandem.createTandem( 'spinner' )
  } );

  const checkbox = new Checkbox( enabledProperty, new Text( 'enabled', {
    font: new PhetFont( 20 ),
    tandem: options.tandem.createTandem( 'checkbox' )
  } ) );

  return new VBox( {
    spacing: 60,
    children: [ spinner, checkbox ],
    center: layoutBounds.center
  } );
}

// Creates a demo for NumberPicker
function demoNumberPicker( layoutBounds: Bounds2 ) {

  const enabledProperty = new BooleanProperty( true );

  const numberPicker = new NumberPicker( new Property( 0 ), new Property( new Range( -10, 10 ) ), {
    font: new PhetFont( 40 ),
    enabledProperty: enabledProperty
  } );

  const enabledCheckbox = new Checkbox( enabledProperty, new Text( 'enabled', { font: new PhetFont( 20 ) } ) );

  return new VBox( {
    spacing: 40,
    children: [ numberPicker, enabledCheckbox ],
    center: layoutBounds.center
  } );
}

sceneryPhet.register( 'SpinnersScreenView', SpinnersScreenView );