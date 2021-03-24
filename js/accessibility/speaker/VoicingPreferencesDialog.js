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
import Display from '../../../../scenery/js/display/Display.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Dialog from '../../../../sun/js/Dialog.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import GestureControlledSlider from '../../../../tappi/js/view/GestureControlledSlider.js';
import VoicingUtterance from '../../../../utterance-queue/js/VoicingUtterance.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import levelSpeakerModel from './levelSpeakerModel.js';
import VoicingInputListener from './VoicingInputListener.js';

// constants
const TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const LABEL_FONT = new PhetFont( { size: 12 } );
const INPUT_SPACING = 8;

// strings - as this is a loosely designed prototype, these are not translatable yet
const newVoiceSelectedString = 'New Voice Selected.';
const changeVoiceString = 'Change Voice';
const sliderPatternString = '{{successDescription}}, {{newValue}}';
const objectChangesString = 'Voice Object Changes & On-Screen Text';
const contextChangesString = 'Voice Context Changes';
const hintsString = 'Voice Helpful Hints';
const interactiveHighlightsString = 'Show Interactive Highlights';
const quickMenuString = 'Show Self Voicing Quick Menu';
const gestureControlString = 'Enable Gesture Control';
const generalOptionsString = 'General Options';
const outputString = 'Speech Output Levels';
const rateString = 'Rate';
const pitchString = 'Pitch';
const voiceRateString = 'Voice Rate';
const voicePitchString = 'Voice Pitch';
const newVoiceRateString = 'New Voice Rate';
const newVoicePitchString = 'New Voice Pitch';
const highlightsShownString = 'Interactive Highlights Shown';
const highlightsHiddenString = 'Interactive Highlights hidden';
const menuShownString = 'Self Voicing Quick Menu Shown';
const menuHiddenString = 'Self Voicing Quick Menu Hidden';
const gestureControlsEnabledString = 'Custom gesture controls enabled.';
const gestureControlsDisabledString = 'Custom gesture controls disabled.';
const speakingObjectChangesString = 'Speaking object changes and on screen text.';
const mutingObjectChangesString = 'Muting object changes and on screen text.';
const speakingContextChangesString = 'Speaking context changes.';
const mutingContextChangesString = 'Muting context changes.';
const speakingHintsString = 'Speaking hints.';
const mutingHintsString = 'Muting hints.';


class VoicingPreferencesDialog extends Dialog {
  constructor( options ) {

    // controls which layer of content will be spoken (object, context, hints)
    const modeControls = new LevelModeControls();

    // controls for speech synthesis, such as the rate, pitch, and voice
    const voiceRateSlider = VoicingPreferencesDialog.createLabelledSlider( webSpeaker.voiceRateProperty, rateString, voiceRateString, newVoiceRateString );
    const voicePitchSlider = VoicingPreferencesDialog.createLabelledSlider( webSpeaker.voicePitchProperty, pitchString, voicePitchString, newVoicePitchString );

    const comboBoxItems = [];

    // only grab the first 12 options for the ComboBox, its all we have space for
    webSpeaker.voices.splice( 0, 12 ).forEach( voice => {
      const textNode = new Text( voice.name, { font: LABEL_FONT } );
      comboBoxItems.push( new ComboBoxItem( textNode, voice, {
        a11yLabel: voice.name
      } ) );
    } );
    const voiceComboBox = new ComboBox( comboBoxItems, webSpeaker.voiceProperty, phet.joist.sim.topLayer, {
      listPosition: 'above'
    } );

    // Hack alert - The listBox is private but we need to be able to speak the selected voice.
    // This is just a proof of concept so I would rather hack this here than put in ComboBox/
    // ComboBoxListItemNode. self-voicing ends up being a long term feature we will move this
    // kind of thing to those types with more consideration.
    voiceComboBox.listBox.addInputListener( new VoicingInputListener( {
      onFocusIn: event => {
        const response = levelSpeakerModel.collectResponses( Display.focusedNode.innerContent );
        phet.joist.sim.voicingUtteranceQueue.addToBack( response );
      }
    } ) );

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

    const content = new VBox( {
      children: [ modeControls, labelledVoiceControls ],
      spacing: 30,
      pickable: true
    } );

    webSpeaker.voiceProperty.lazyLink( voice => {
      const content = levelSpeakerModel.collectResponses( newVoiceSelectedString );
      phet.joist.sim.voicingUtteranceQueue.addToBack( content );
    } );

    voiceComboBox.addInputListener( new VoicingInputListener( {
      onFocusIn: () => {
        const response = levelSpeakerModel.collectResponses( changeVoiceString );

        // this utterance is polite because we want to hear 'New Voice Selected' when
        // a new voice is chosen
        const changeVoiceUtterance = new VoicingUtterance( {
          alert: response,
          cancelOther: false
        } );
        phet.joist.sim.voicingUtteranceQueue.addToBack( changeVoiceUtterance );
      }
    } ) );

    super( content, options );
  }
}

// @private
// @static
VoicingPreferencesDialog.createLabelledSlider = ( numberProperty, label, selfVoicingLabel, changeSuccessDescription ) => {

  const slider = new GestureControlledSlider( numberProperty, numberProperty.range, {
    selfVoicingLabel: selfVoicingLabel
  } );

  const utterance = new VoicingUtterance( {
    alertStableDelay: 500,
    alertMaximumDelay: 1000
  } );
  numberProperty.lazyLink( value => {
    const content = StringUtils.fillIn( sliderPatternString, {
      successDescription: changeSuccessDescription,
      newValue: Utils.toFixed( value, 2 )
    } );
    utterance.alert = levelSpeakerModel.collectResponses( content );
    phet.joist.sim.voicingUtteranceQueue.addToBack( utterance );
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
        node: new Text( objectChangesString, { font: LABEL_FONT } ),
        property: levelSpeakerModel.objectChangesProperty,
        options: {
          labelContent: objectChangesString,
          enabledProperty: new BooleanProperty( true )
        }
      },
      {
        node: new Text( contextChangesString, { font: LABEL_FONT } ),
        property: levelSpeakerModel.contextChangesProperty,
        options: {
          labelContent: contextChangesString,
          enabledProperty: new BooleanProperty( true )
        }

      },
      {
        node: new Text( hintsString, { font: LABEL_FONT } ),
        property: levelSpeakerModel.hintsProperty,
        options: {
          labelContent: hintsString,
          enabledProperty: new BooleanProperty( true )
        }
      }
    ] );

    const generalCheckboxGroup = new VerticalCheckboxGroup( [
      {
        node: new Text( interactiveHighlightsString, { font: LABEL_FONT } ),
        property: levelSpeakerModel.showHoverHighlightsProperty,
        options: {
          labelContent: interactiveHighlightsString
        }
      },
      {
        node: new Text( quickMenuString, { font: LABEL_FONT } ),
        property: levelSpeakerModel.showQuickMenuProperty,
        options: {
          labelContent: quickMenuString
        }
      },
      {
        node: new Text( gestureControlString, { font: LABEL_FONT } ),
        property: levelSpeakerModel.gestureControlProperty,
        options: {
          labelContent: gestureControlString
        }
      }
    ] );

    const visualOptionsBox = new VBox( {
      children: [
        new Text( generalOptionsString, { font: TITLE_FONT } ),
        generalCheckboxGroup
      ],
      spacing: 10
    } );

    const speechOutputBox = new VBox( {
      children: [
        new Text( outputString, { font: TITLE_FONT } ),
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

    // self-voicing behavior for the checkboxes themselves
    levelsCheckboxGroup.children.forEach( child => {
      child.addInputListener( new VoicingInputListener( {
        onFocusIn: () => {
          const response = levelSpeakerModel.collectResponses( child.labelContent );
          phet.joist.sim.voicingUtteranceQueue.addToBack( response );
        }
      } ) );
    } );

    generalCheckboxGroup.children.forEach( child => {
      child.addInputListener( new VoicingInputListener( {
        onFocusIn: () => {
          const response = levelSpeakerModel.collectResponses( child.labelContent );
          phet.joist.sim.voicingUtteranceQueue.addToBack( response );
        }
      } ) );
    } );

    // speak when the various Properties change
    levelSpeakerModel.showHoverHighlightsProperty.lazyLink( shown => {
      const content = shown ? highlightsShownString : highlightsHiddenString;
      phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( content ) );
    } );

    levelSpeakerModel.showQuickMenuProperty.lazyLink( shown => {
      const content = shown ? menuShownString : menuHiddenString;
      phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( content ) );
    } );

    levelSpeakerModel.gestureControlProperty.lazyLink( enabled => {
      const content = enabled ? gestureControlsEnabledString : gestureControlsDisabledString;
      phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( content ) );
    } );

    levelSpeakerModel.objectChangesProperty.lazyLink( enabled => {
      const content = enabled ? speakingObjectChangesString : mutingObjectChangesString;
      phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( content ) );
    } );

    levelSpeakerModel.contextChangesProperty.lazyLink( enabled => {
      const content = enabled ? speakingContextChangesString : mutingContextChangesString;
      phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( content ) );
    } );

    levelSpeakerModel.hintsProperty.lazyLink( enabled => {
      const content = enabled ? speakingHintsString : mutingHintsString;
      phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( content ) );
    } );
  }
}

sceneryPhet.register( 'VoicingPreferencesDialog', VoicingPreferencesDialog );

export default VoicingPreferencesDialog;
