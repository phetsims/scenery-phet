// Copyright 2020, University of Colorado Boulder

/**
 * Keyboard sections that are general, and defined in the scenery-phet repo.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import GeneralKeyboardHelpSection from '../keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpSection from '../keyboard/help/KeyboardHelpSection.js';
import SliderKeyboardHelpSection from '../keyboard/help/SliderKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../keyboard/help/TwoColumnKeyboardHelpContent.js';
import sceneryPhet from '../sceneryPhet.js';

class SceneryPhetKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor() {

    const helpContentOptions = {

      // i18n, restricts both labelText and maxWidth, see KeyboardHelpSection
      labelMaxWidth: 130
    };

    const generalNavigationHelpContent = new GeneralKeyboardHelpSection( merge( helpContentOptions, {
      withGroupContent: true,
      withCheckboxContent: true
    } ) );
    const sliderKeyboardHelpSection = new SliderKeyboardHelpSection( helpContentOptions );

    const grabDragHelpContent = KeyboardHelpSection.getGrabReleaseHelpSection( 'Grabbable', 'grabbable', helpContentOptions );
    const leftHelpContent = [ generalNavigationHelpContent ];

    KeyboardHelpSection.alignHelpSectionIcons( [ grabDragHelpContent, sliderKeyboardHelpSection ] );
    const rightHelpContent = [ grabDragHelpContent, sliderKeyboardHelpSection ];

    super( leftHelpContent, rightHelpContent );
  }
}

sceneryPhet.register( 'SceneryPhetKeyboardHelpContent', SceneryPhetKeyboardHelpContent );

export default SceneryPhetKeyboardHelpContent;