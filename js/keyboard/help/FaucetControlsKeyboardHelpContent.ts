// Copyright 2022-2024, University of Colorado Boulder

//TODO https://github.com/phetsims/scenery-phet/issues/839 move to scenery-phet
/**
 * FaucetControlsKeyboardHelpContent is the keyboard-help section that describes how to interact with FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import SliderControlsKeyboardHelpSection from './SliderControlsKeyboardHelpSection.js';
import phScale from '../../../../ph-scale/js/phScale.js';

//TODO https://github.com/phetsims/scenery-phet/issues/839 i18n, add to scenery-phet-strings_en.json
const faucetControlsStringProperty = new StringProperty( 'Faucet Controls' );
const fluidFlowStringProperty = new StringProperty( 'fluid flow' );

export default class FaucetControlsKeyboardHelpContent extends SliderControlsKeyboardHelpSection {

  public constructor() {
    super( {
      headingStringProperty: faucetControlsStringProperty,
      sliderStringProperty: fluidFlowStringProperty
    } );
  }
}

phScale.register( 'FaucetControlsKeyboardHelpContent', FaucetControlsKeyboardHelpContent );