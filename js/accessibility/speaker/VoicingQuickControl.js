// Copyright 2020, University of Colorado Boulder

/**
 * Controls that appear if voicing content is enabled. Allows user to mute all speech.
 * Also has buttons to read other content.
 *
 * This is a prototype, and is still under active design and development.
 *
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import VoicingUtterance from '../../../../utterance-queue/js/VoicingUtterance.js';
import VoicingPreferencesDialog from './VoicingPreferencesDialog.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import BooleanRectangularStickyToggleButton from '../../../../sun/js/buttons/BooleanRectangularStickyToggleButton.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Panel from '../../../../sun/js/Panel.js';
import voicingIconImage from '../../../images/self-voicing-icon_png.js';
import sceneryPhet from '../../sceneryPhet.js';
import levelSpeakerModel from './levelSpeakerModel.js';
import VoicingInputListener from './VoicingInputListener.js';

// strings for voicing content - these should not be translatable and are therefore not
// added to the strings file - I also don't know if "prototype" strings can go into translatable files
// so keeping these here for now
const hintPleaseString = 'Hint Please!';
const simOverviewString = 'Sim Overview';
const currentDetailsString = 'Current Details';
const stopSpeechString = 'Stop Speech';
const muteSpeechString = 'Mute Speech';
const hideString = 'Hide';
const showString = 'Show';
const preferencesString = 'Preferences';
const expandCollapseButtonPatternString = '{{action}} Voicing Quick Menu';
const voicingQuickMenuShown = 'Read-me buttons & speech controls shown.';
const voicingQuickMenuHidden = 'Voicing Quick Menu hidden.';
const voicingDialogAlert = 'Voicing Preferences shown.';

class VoicingQuickControl extends Node {

  /**
   * @param {WebSpeaker} webSpeaker
   * @param {Object } [options]
   */
  constructor( webSpeaker, options ) {

    options = merge( {

      // {function} - Returns string, callback that creates the content for a voicing hint when the
      // hint button is pressed
      createHintContent: () => '',

      // {function} - Returns string, callback that creates the content for a voicing overview when the
      // overview button is pressed
      createOverviewContent: () => '',

      // {function} - Returns string, callback that creates content for a self-vicing descriptin when the
      // details button is presses
      createDetailsContent: () => ''
    }, options );

    super( options );

    // @private {function}
    this.createHintContent = options.createHintContent;
    this.createOverviewContent = options.createOverviewContent;
    this.createDetailsContent = options.createDetailsContent;

    // a reference to the preferences dialog that will
    let preferencesDialog = null;

    // a placeholder icon until we get a more thorough design
    const iconImage = new Image( voicingIconImage, {
      scale: 0.18
    } );

    // visible when the webSpeaker is disabled to indicate that there will be no speech output
    const disabledIndicator = new Text( 'X', {
      fill: 'red',
      font: new PhetFont( { size: 24 } ),
      center: iconImage.rightCenter.minusXY( iconImage.width / 3.5, iconImage.height / 7 )
    } );

    // the ion contained in a grey rectangle
    const rectangleDimension = Math.max( iconImage.width, iconImage.height ) + 5;
    const iconRectangle = new Rectangle( 0, 0, rectangleDimension, rectangleDimension, 5, 5, {
      fill: 'rgba(99,99,99,1)'
    } );
    iconImage.center = iconRectangle.center;
    iconRectangle.addChild( iconImage );

    const openProperty = new BooleanProperty( false );

    // @private {ExpandCollapseButton} - the button expands/collapses the controls
    this.expandCollapseButton = new ExpandCollapseButton( openProperty, {
      sideLength: 20
    } );

    this.expandCollapseButton.addInputListener( new VoicingInputListener( {
      onFocusIn: () => {
        const string = StringUtils.fillIn( expandCollapseButtonPatternString, {
          action: openProperty.get() ? hideString : showString
        } );
        phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( string ) );
      },
      highlightTarget: this.expandCollapseButton
    } ) );

    openProperty.lazyLink( open => {
      const response = open ? voicingQuickMenuShown : voicingQuickMenuHidden;
      phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( response ) );
    } );

    // creates content for each button and puts it into an AlignGroup so that
    // all buttons can have the same dimensions
    const alignGroup = new AlignGroup();
    const createSpeechButtonContent = buttonString => {
      return alignGroup.createBox( new Text( buttonString ) );
    };

    const hintButtonContent = createSpeechButtonContent( hintPleaseString );
    const simOverviewContent = createSpeechButtonContent( simOverviewString );
    const detailsContent = createSpeechButtonContent( currentDetailsString );
    const stopSpeechContent = createSpeechButtonContent( stopSpeechString );
    const muteSpeechContent = createSpeechButtonContent( muteSpeechString );
    const preferencesContent = createSpeechButtonContent( preferencesString );

    // creates the actual button with provided content and behavior
    const createSpeechButton = ( buttonContent, contentString, listener ) => {
      const button = new RectangularPushButton( {
        content: buttonContent,
        listener: listener
      } );

      button.addInputListener( new VoicingInputListener( {
        onFocusIn: () => {
          phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( contentString ) );
        },
        highlightTarget: button
      } ) );

      return button;
    };

    // the webSpeaker uses enabledProperty, the push button uses "muted" terminology -
    // dynamic Property maps between the two so that the button can be pressed when
    // it it is actually not enabled
    const mutedProperty = new DynamicProperty( new Property( webSpeaker.enabledProperty ), {
      bidirectional: true,
      map: enabled => !enabled,
      inverseMap: muted => !muted
    } );

    const hintButton = createSpeechButton( hintButtonContent, hintPleaseString, this.speakHintContent.bind( this ) );
    const overviewButton = createSpeechButton( simOverviewContent, simOverviewString, this.speakOverviewContent.bind( this ) );
    const detailsButton = createSpeechButton( detailsContent, currentDetailsString, this.speakDetailsContent.bind( this ) );
    const stopSpeechButton = createSpeechButton( stopSpeechContent, stopSpeechString, webSpeaker.cancel.bind( webSpeaker ) );
    const muteSpeechButton = new BooleanRectangularStickyToggleButton( mutedProperty, {
      content: muteSpeechContent
    } );
    const preferencesButton = createSpeechButton( preferencesContent, preferencesString, () => {
      if ( !preferencesDialog ) {
        preferencesDialog = new VoicingPreferencesDialog( {
          hideCallback: () => {
            preferencesButton.focus();
          }
        } );
      }
      preferencesDialog.show();
      preferencesDialog.focusCloseButton();

      // object response describing the open dialog - polite so the first focusable element
      // to be described
      const utterance = new VoicingUtterance( {
        alert: voicingDialogAlert,
        cancelOther: false
      } );
      phet.joist.sim.voicingUtteranceQueue.addToBack( utterance );
    } );

    // other listeners are added in createSpeechButton
    muteSpeechButton.addInputListener( new VoicingInputListener( {
      onFocusIn: () => {
        phet.joist.sim.voicingUtteranceQueue.addToBack( levelSpeakerModel.collectResponses( muteSpeechString ) );
      },
      highlightTarget: muteSpeechButton
    } ) );

    // layout code
    const topRow = new HBox( {
      children: [ new HStrut( this.expandCollapseButton.width ), overviewButton, detailsButton, hintButton ],
      spacing: 5
    } );
    const bottomRow = new HBox( {
      children: [ new HStrut( this.expandCollapseButton.width ), stopSpeechButton, muteSpeechButton, preferencesButton ],
      spacing: 5
    } );

    const buttonGroup = new VBox( {
      children: [ topRow, bottomRow ],
      spacing: 5,
      align: 'right'
    } );
    const buttonsPanel = new Panel( buttonGroup, {
      backgroundPickable: true
    } );

    openProperty.link( open => buttonsPanel.setVisible( open ) );

    // layout - panel "opens upward" from the button - its bounds are not included
    // in layout so that this Node can be positioned relative to the always-visible
    // content, the panel can occlude other things
    this.excludeInvisibleChildrenFromBounds = true;
    this.expandCollapseButton.leftBottom = iconRectangle.rightBottom.plusXY( 6, 0 );
    buttonsPanel.leftBottom = this.expandCollapseButton.leftBottom.plusXY( -4, 4 );

    this.children = [
      iconRectangle,
      buttonsPanel,
      disabledIndicator,
      this.expandCollapseButton
    ];

    // expandCollapseButton first
    this.pdomOrder = [ this.expandCollapseButton ];

    // when the webSpeaker becomes disabled the various content buttons should also be disabled
    webSpeaker.enabledProperty.link( enabled => {
      hintButton.enabled = enabled;
      overviewButton.enabled = enabled;
      detailsButton.enabled = enabled;
      stopSpeechButton.enabled = enabled;

      disabledIndicator.visible = !enabled;
    } );

    // the quick menu can be hidden independently from user settings (the speech icon remains
    // visible to indicate that voicing is enabled, but the menu button is removed)
    levelSpeakerModel.showQuickMenuProperty.link( visible => {

      // close the menu if we are making the button invisible
      if ( !visible ) {
        openProperty.set( false );
      }

      this.expandCollapseButton.visible = visible;
    } );

    // mutate with options after Node has been assembled
    this.mutate( options );
  }

  /**
   * Speaks the hint content when the "Hint Please" button is pressed.
   * @private
   */
  speakHintContent() {
    phet.joist.sim.voicingUtteranceQueue.addToBack( this.createHintContent() );
  }

  /**
   * Speak an overview summary for the sim, generally the content from GravityForceLabScreenSummaryNode
   * @private
   */
  speakOverviewContent() {
    phet.joist.sim.voicingUtteranceQueue.addToBack( this.createOverviewContent() );
  }

  /**
   * Speak details about the current state of the simulation. Pulls content that is used
   * in the screen summary and puts them together in a single paragraph.
   * @private
   */
  speakDetailsContent() {
    phet.joist.sim.voicingUtteranceQueue.addToBack( this.createDetailsContent() );
  }

  /**
   * After certain intro dialogs close in prototypes, we want focus to land on this button.
   * This function makes this possible without exposing the entire button.
   * @public
   */
  focusExpandCollapseButton() {
    this.expandCollapseButton.focus();
  }
}

sceneryPhet.register( 'VoicingQuickControl', VoicingQuickControl );
export default VoicingQuickControl;