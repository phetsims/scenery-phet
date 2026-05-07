// Copyright 2026, University of Colorado Boulder

/**
 * The keyboard help section that describes how to interact with a FineCoarseSpinner.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../../sceneryPhet.js';
import SpinnerControlsKeyboardHelpSection, { SpinnerControlsKeyboardHelpSectionOptions } from './SpinnerControlsKeyboardHelpSection.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = SpinnerControlsKeyboardHelpSectionOptions;
export type FineCoarseSpinnerKeyboardHelpSectionOptions = SelfOptions & StrictOmit<ParentOptions, 'includeSmallerStepsRow'>;

export default class FineCoarseSpinnerKeyboardHelpSection extends SpinnerControlsKeyboardHelpSection {
  public constructor( providedOptions?: FineCoarseSpinnerKeyboardHelpSectionOptions ) {

    const options = optionize<FineCoarseSpinnerKeyboardHelpSectionOptions, SelfOptions, ParentOptions>()( {
      includeSmallerStepsRow: true
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'FineCoarseSpinnerKeyboardHelpSection', FineCoarseSpinnerKeyboardHelpSection );
