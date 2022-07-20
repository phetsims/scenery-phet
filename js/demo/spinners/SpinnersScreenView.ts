// Copyright 2020-2022, University of Colorado Boulder

/**
 * Demonstration of various spinners.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DemosScreenView, { DemosScreenViewOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import sceneryPhet from '../../sceneryPhet.js';
import demoFineCoarseSpinner from './demoFineCoarseSpinner.js';

type SelfOptions = EmptySelfOptions;
type SpinnersScreenViewOptions = SelfOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class SpinnersScreenView extends DemosScreenView {

  public constructor( providedOptions: SpinnersScreenViewOptions ) {

    const options = optionize<SpinnersScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      // nothing for now
    }, providedOptions );

    // To add a demo, add an entry here of type SunDemo.
    const demos = [
      { label: 'FineCoarseSpinner', createNode: demoFineCoarseSpinner }
    ];

    super( demos, options );
  }
}

sceneryPhet.register( 'SpinnersScreenView', SpinnersScreenView );