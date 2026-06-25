// Copyright 2019-2025, University of Colorado Boulder

/**
 * TwoColumnKeyboardHelpContentOptions handles layout of KeyboardHelpSections in 2 columns.
 *
 * @author Jesse Greenberg
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import MultiColumnKeyboardHelpContent, { MultiColumnKeyboardHelpContentOptions } from './MultiColumnKeyboardHelpContent.js';

type SelfOptions = EmptySelfOptions;

export type TwoColumnKeyboardHelpContentOptions = SelfOptions & MultiColumnKeyboardHelpContentOptions;

export default class TwoColumnKeyboardHelpContent extends MultiColumnKeyboardHelpContent {

  /**
   * @param leftSections - KeyboardHelpSections for the left column
   * @param rightSections - KeyboardHelpSections for the right column
   * @param [providedOptions]
   */
  public constructor( leftSections: KeyboardHelpSection[], rightSections: KeyboardHelpSection[],
                      providedOptions?: TwoColumnKeyboardHelpContentOptions ) {
    super( [ leftSections, rightSections ], providedOptions );
  }
}

sceneryPhet.register( 'TwoColumnKeyboardHelpContent', TwoColumnKeyboardHelpContent );