// Copyright 2019, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that contains a GeneralKeyboardHelpSection and a SliderKeyboardHelpSection.
 * Often sim interaction only involves sliders and basic tab and button interaction. For those sims, this
 * content will be usable for the Dialog.
 * 
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const merge = require( 'PHET_CORE/merge' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SliderKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/SliderKeyboardHelpSection' );
  const TwoColumnKeyboardHelpContent = require( 'SCENERY_PHET/keyboard/help/TwoColumnKeyboardHelpContent' );

  class SliderAndGeneralKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options =  merge( {

        // {null|*} - options passed to the SliderKeyboardHelpSection
        sliderSectionOptions: null,

        // {null|*} - options passed to the GeneralKeyboardHelpSection
        generalSectionOptions: null,

        // i18n, a bit shorter than default so general and slider sections fits side by side
        labelMaxWidth: 160
      }, options );

      const sliderHelpSection = new SliderKeyboardHelpSection( options.sliderSectionOptions );
      const generalNavigationHelpSection = new GeneralKeyboardHelpSection( options.generalSectionOptions);

      super( [ sliderHelpSection ], [ generalNavigationHelpSection ], options );
    }
  }

  return sceneryPhet.register( 'SliderAndGeneralKeyboardHelpContent', SliderAndGeneralKeyboardHelpContent );
} );