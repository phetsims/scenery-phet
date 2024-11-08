// Copyright 2014-2024, University of Colorado Boulder

/**
 * Demonstration of scenery-phet sliders.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'slider' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DemosScreenView, { DemosScreenViewOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import sceneryPhet from '../../sceneryPhet.js';
import demoNumberControl from './demoNumberControl.js';
import demoNumberControlWithSpectrum from './demoNumberControlWithSpectrum.js';
import demoSliderWithSpectrum from './demoSliderWithSpectrum.js';
import demoWavelengthNumberControl from './demoWavelengthNumberControl.js';

type SelfOptions = EmptySelfOptions;
type SlidersScreenViewOptions = SelfOptions & PickRequired<DemosScreenViewOptions, 'tandem'>;

export default class SlidersScreenView extends DemosScreenView {

  public constructor( options: SlidersScreenViewOptions ) {

    // To add a demo, add an entry here of type DemoItemData.
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