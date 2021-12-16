// Copyright 2020, University of Colorado Boulder

/**
 * Keyboard sections that are general, and defined in the scenery-phet repo.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import BasicActionsKeyboardHelpSection from '../keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../keyboard/help/TwoColumnKeyboardHelpContent.js';
import sceneryPhet from '../sceneryPhet.js';

class SceneryPhetKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor() {

    const helpContentOptions = {

      // i18n, restricts both labelText and maxWidth, see KeyboardHelpSection
      labelMaxWidth: 130
    };

    const basicActionsHelpContent = new BasicActionsKeyboardHelpSection( merge( helpContentOptions, {
      withCheckboxContent: true
    } ) );
    const sliderControlsKeyboardHelpSection = new SliderControlsKeyboardHelpSection( helpContentOptions );

    const grabDragHelpContent = KeyboardHelpSection.getGrabReleaseHelpSection( 'Grabbable', 'grabbable', helpContentOptions );
    const leftHelpContent = [ basicActionsHelpContent ];

    KeyboardHelpSection.alignHelpSectionIcons( [ grabDragHelpContent, sliderControlsKeyboardHelpSection ] );
    const rightHelpContent = [ grabDragHelpContent, sliderControlsKeyboardHelpSection ];

    super( leftHelpContent, rightHelpContent );
  }
}

sceneryPhet.register( 'SceneryPhetKeyboardHelpContent', SceneryPhetKeyboardHelpContent );

export default SceneryPhetKeyboardHelpContent;