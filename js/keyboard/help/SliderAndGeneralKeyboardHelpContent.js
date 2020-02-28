// Copyright 2019-2020, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that contains a GeneralKeyboardHelpSection and a SliderKeyboardHelpSection.
 * Often sim interaction only involves sliders and basic tab and button interaction. For those sims, this
 * content will be usable for the Dialog.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';
import GeneralKeyboardHelpSection from './GeneralKeyboardHelpSection.js';
import SliderKeyboardHelpSection from './SliderKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from './TwoColumnKeyboardHelpContent.js';

class SliderAndGeneralKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {null|*} - options passed to the SliderKeyboardHelpSection
      sliderSectionOptions: null,

      // {null|*} - options passed to the GeneralKeyboardHelpSection
      generalSectionOptions: null,

      // i18n, a bit shorter than default so general and slider sections fits side by side
      labelMaxWidth: 160
    }, options );

    const sliderHelpSection = new SliderKeyboardHelpSection( options.sliderSectionOptions );
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection( options.generalSectionOptions );

    super( [ sliderHelpSection ], [ generalNavigationHelpSection ], options );
  }
}

sceneryPhet.register( 'SliderAndGeneralKeyboardHelpContent', SliderAndGeneralKeyboardHelpContent );
export default SliderAndGeneralKeyboardHelpContent;