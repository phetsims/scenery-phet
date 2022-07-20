// Copyright 2014-2022, University of Colorado Boulder

/**
 * Demonstration of scenery-phet sliders.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'slider' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DemosScreenView, { DemosScreenViewOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetQueryParameters from '../../sceneryPhetQueryParameters.js';
import demoNumberControl from './demoNumberControl.js';
import demoSliderWithSpectrum from './demoSliderWithSpectrum.js';
import demoWavelengthNumberControl from './demoWavelengthNumberControl.js';
import demoNumberControlWithSpectrum from './demoNumberControlWithSpectrum.js';

type SelfOptions = EmptySelfOptions;
type SlidersScreenViewOptions = SelfOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class SlidersScreenView extends DemosScreenView {

  public constructor( providedOptions: SlidersScreenViewOptions ) {

    const options = optionize<SlidersScreenViewOptions, SelfOptions, DemosScreenViewOptions>()( {
      selectedDemoLabel: sceneryPhetQueryParameters.slider
    }, providedOptions );

    // To add a demo, add an entry here of type SunDemo.
    const demos = [
      { label: 'NumberControl', createNode: demoNumberControl },
      { label: 'WavelengthNumberControl', createNode: demoWavelengthNumberControl },
      { label: 'SpectrumSliderTrack', createNode: demoSliderWithSpectrum },
      { label: 'NumberControlWithSpectrum', createNode: demoNumberControlWithSpectrum }
    ];

    super( demos, options );
  }
}

sceneryPhet.register( 'SlidersScreenView', SlidersScreenView );