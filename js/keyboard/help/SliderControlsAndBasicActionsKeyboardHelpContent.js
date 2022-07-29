// Copyright 2019-2022, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that contains a BasicActionsKeyboardHelpSection and a SliderControlsKeyboardHelpSection.
 * Often sim interaction only involves sliders and basic tab and button interaction. For those sims, this
 * content will be usable for the Dialog.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../sceneryPhet.js';
import BasicActionsKeyboardHelpSection from './BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from './SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from './TwoColumnKeyboardHelpContent.js';

class SliderControlsAndBasicActionsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {null|*} - options passed to the SliderControlsKeyboardHelpSection
      sliderSectionOptions: null,

      // {null|*} - options passed to the BasicActionsKeyboardHelpSection
      generalSectionOptions: null,

      // i18n, a bit shorter than default so general and slider sections fits side by side
      textMaxWidth: 160
    }, options );

    const sliderHelpSection = new SliderControlsKeyboardHelpSection( options.sliderSectionOptions );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( options.generalSectionOptions );

    super( [ sliderHelpSection ], [ basicActionsHelpSection ], options );
  }
}

sceneryPhet.register( 'SliderControlsAndBasicActionsKeyboardHelpContent', SliderControlsAndBasicActionsKeyboardHelpContent );
export default SliderControlsAndBasicActionsKeyboardHelpContent;