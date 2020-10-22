// Copyright 2020, University of Colorado Boulder

/**
 * Content for an "Options" dialog, only used if the ?selfVoicing query parameter is used to explore prototype
 * "self voicing" feature set. This dialog allows control of output verbosity and settings for the speech synthesizer.
 *
 * PROTOTYPE! Do not use in production code.
 *
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import webSpeaker from '../../../../scenery/js/accessibility/speaker/webSpeaker.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import HSlider from '../../../../sun/js/HSlider.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import levelSpeakerModel from './levelSpeakerModel.js';

// constants
const TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const LABEL_FONT = new PhetFont( { size: 12 } );
const INPUT_SPACING = 8;

class WebSpeechDialogContent extends VBox {
  constructor() {

    // controls which layer of content will be spoken (object, context, hints)
    const modeControls = new LevelModeControls();

    // controls for speech synthesis, such as the rate, pitch, and voice
    const voiceRateSlider = WebSpeechDialogContent.createLabelledSlider( webSpeaker.voiceRateProperty, 'Rate', 'New Voice Rate' );
    const voicePitchSlider = WebSpeechDialogContent.createLabelledSlider( webSpeaker.voicePitchProperty, 'Pitch', 'New Voice Pitch' );

    const comboBoxItems = [];

    // only grab the first 12 options for the ComboBox, its all we have space for
    webSpeaker.voices.splice( 0, 12 ).forEach( voice => {
      comboBoxItems.push( new ComboBoxItem( new Text( voice.name, { font: LABEL_FONT } ), voice ) );
    } );
    const voiceComboBox = new ComboBox( comboBoxItems, webSpeaker.voiceProperty, phet.joist.sim.topLayer, {
      listPosition: 'above'
    } );

    const voiceControls = new VBox( {
      children: [ voiceRateSlider, voicePitchSlider, voiceComboBox ],
      spacing: INPUT_SPACING
    } );

    const labelledVoiceControls = new VBox( {
      children: [
        new Text( 'Voice Options', { font: TITLE_FONT } ),
        voiceControls
      ],
      align: 'center',
      spacing: INPUT_SPACING
    } );

    super( {
      children: [ modeControls, labelledVoiceControls ],
      spacing: 30,
      pickable: true
    } );

    webSpeaker.voiceProperty.lazyLink( voice => {
      webSpeaker.speak( 'New voice selected' );
    } );
  }
}

// @private
// @static
WebSpeechDialogContent.createLabelledSlider = ( numberProperty, label, changeSuccessDescription ) => {
  const changeSuccessPatternString = '{{successDescription}}, {{newValue}}';

  const slider = new HSlider( numberProperty, numberProperty.range, {
    endDrag: () => {
      const utterance = StringUtils.fillIn( changeSuccessPatternString, {
        successDescription: changeSuccessDescription,
        newValue: Utils.toFixed( numberProperty.get(), 2 )
      } );
      webSpeaker.speak( utterance );
    }
  } );
  return new HBox( {
    children: [ new Text( label, { font: LABEL_FONT } ), slider ],
    spacing: INPUT_SPACING
  } );
};

class LevelModeControls extends VBox {
  constructor() {
    const levelsCheckboxGroup = new VerticalCheckboxGroup( [
      {
        node: new Text( 'Voice Object Changes & Screen Text', { font: LABEL_FONT } ),
        property: levelSpeakerModel.objectChangesProperty,
        options: { enabledProperty: new BooleanProperty( true ) }
      },
      {
        node: new Text( 'Voice Context Changes', { font: LABEL_FONT } ),
        property: levelSpeakerModel.contextChangesProperty,
        options: { enabledProperty: new BooleanProperty( true ) }

      },
      {
        node: new Text( 'Voice Helpful Hints', { font: LABEL_FONT } ),
        property: levelSpeakerModel.hintsProperty,
        options: { enabledProperty: new BooleanProperty( true ) }
      }
    ] );

    const generalCheckboxGroup = new VerticalCheckboxGroup( [
      {
        node: new Text( 'Show Interactive Highlights', { font: LABEL_FONT } ),
        property: levelSpeakerModel.showHoverHighlightsProperty
      },
      {
        node: new Text( 'Show Self Voicing Quick Menu', { font: LABEL_FONT } ),
        property: levelSpeakerModel.showQuickMenuProperty
      },
      {
        node: new Text( 'Enable Gesture Control', { font: LABEL_FONT } ),
        property: levelSpeakerModel.gestureControlProperty
      }
    ] );

    const visualOptionsBox = new VBox( {
      children: [
        new Text( 'General Options', { font: TITLE_FONT } ),
        generalCheckboxGroup
      ],
      spacing: 10
    } );

    const speechOutputBox = new VBox( {
      children: [
        new Text( 'Speech Output Levels', { font: TITLE_FONT } ),
        levelsCheckboxGroup
      ],
      spacing: 10
    } );


    super( {
      children: [
        visualOptionsBox,
        speechOutputBox
      ],
      spacing: 20
    } );
  }
}

sceneryPhet.register( 'WebSpeechDialogContent', WebSpeechDialogContent );

export default WebSpeechDialogContent;
