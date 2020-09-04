// Copyright 2020, University of Colorado Boulder

/**
 * Controls that appear if self-voicing content is enabled. Allows user to mute all speech.
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
import webSpeaker from '../../../../scenery/js/accessibility/speaker/webSpeaker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import BooleanRectangularStickyToggleButton from '../../../../sun/js/buttons/BooleanRectangularStickyToggleButton.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Panel from '../../../../sun/js/Panel.js';
import selfVoicingIconImage from '../../../images/self-voicing-icon_png.js';
import sceneryPhet from '../../sceneryPhet.js';

class SelfVoicingQuickControl extends Node {

  /**
   * @param {WebSpeaker} webSpeaker
   * @param {Object } [options]
   */
  constructor( webSpeaker, options ) {

    options = merge( {

      // {function} - Returns string, callback that creates the content for a self-voicing hint when the
      // hint button is pressed
      createHintContent: () => '',

      // {function} - Returns string, callback that creates the content for a self-voicing overview when the
      // overview button is pressed
      createOverviewContent: () => '',

      // {function} - Returns string, callback that creates content for a self-vicing descriptin when the
      // details button is presses
      createDetailsContent: () => ''
    }, options );

    super();

    // @private {function}
    this.createHintContent = options.createHintContent;
    this.createOverviewContent = options.createOverviewContent;
    this.createDetailsContent = options.createDetailsContent;

    // a placeholder icon until we get a more thorough design
    const iconImage = new Image( selfVoicingIconImage, {
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

    // the button expands/collapses the controls
    const openProperty = new BooleanProperty( false );
    const expandCollapseButton = new ExpandCollapseButton( openProperty, {
      sideLength: 20
    } );

    // creates content for each button and puts it into an AlignGroup so that
    // all buttons can have the same dimensions
    const alignGroup = new AlignGroup();
    const createSpeechButtonContent = buttonString => {
      return alignGroup.createBox( new Text( buttonString ) );
    };

    const hintButtonContent = createSpeechButtonContent( 'Hint Please!' );
    const simOverviewContent = createSpeechButtonContent( 'Sim Overview' );
    const detailsContent = createSpeechButtonContent( 'Current Details' );
    const stopSpeechContent = createSpeechButtonContent( 'Stop Speech' );
    const muteSpeechContent = createSpeechButtonContent( 'Mute Speech' );

    // creates the actual button with provided content and behavior
    const createSpeechButton = ( buttonContent, listener ) => {
      return new RectangularPushButton( {
        content: buttonContent,
        listener: listener
      } );
    };

    // the webSpeaker uses enabledProperty, the push button uses "muted" terminology -
    // dynamic Property maps between the two so that the button can be pressed when
    // it it is actually not enabled
    const dynamicProperty = new DynamicProperty( new Property( webSpeaker.enabledProperty ), {
      bidirectional: true,
      map: enabled => !enabled,
      inverseMap: muted => !muted
    } );

    const hintButton = createSpeechButton( hintButtonContent, this.speakHintContent.bind( this ) );
    const overviewButton = createSpeechButton( simOverviewContent, this.speakOverviewContent.bind( this ) );
    const detailsButton = createSpeechButton( detailsContent, this.speakDetailsContent.bind( this ) );
    const stopSpeechButton = createSpeechButton( stopSpeechContent, webSpeaker.cancel.bind( webSpeaker ) );
    const muteSpeechButton = new BooleanRectangularStickyToggleButton( dynamicProperty, {
      content: muteSpeechContent
    } );

    // spacer is required to make room for the ExpandCollapseButton in the panel
    const spacer = new Spacer( 0, expandCollapseButton.height );
    const buttonGroup = new VBox( {
      children: [
        hintButton,
        overviewButton,
        detailsButton,
        stopSpeechButton,
        muteSpeechButton,
        spacer
      ],
      spacing: 5
    } );
    const buttonsPanel = new Panel( buttonGroup, {
      backgroundPickable: true
    } );

    openProperty.link( open => buttonsPanel.setVisible( open ) );

    // layout - panel "opens upward" from the button - its bounds are not included
    // in layout so that this Node can be positioned relative to the always-visible
    // content, the panel can occlude other things
    this.excludeInvisibleChildrenFromBounds = true;
    expandCollapseButton.leftTop = iconRectangle.rightTop.plusXY( 6, 0 );
    buttonsPanel.leftBottom = expandCollapseButton.leftBottom.plusXY( -4, 4 );

    this.children = [
      iconRectangle,
      buttonsPanel,
      disabledIndicator,
      expandCollapseButton
    ];

    // when the webSpeaker becomes disabled the various content buttons should also be disabled
    webSpeaker.enabledProperty.link( enabled => {
      hintButton.enabled = enabled;
      overviewButton.enabled = enabled;
      detailsButton.enabled = enabled;
      stopSpeechButton.enabled = enabled;

      disabledIndicator.visible = !enabled;
    } );

    // mutate with options after Node has been assembled
    this.mutate( options );
  }

  /**
   * Speaks the hint content when the "Hint Please" button is pressed.
   * @private
   */
  speakHintContent() {
    webSpeaker.speak( this.createHintContent() );
  }

  /**
   * Speak an overview summary for the sim, generally the content from GravityForceLabScreenSummaryNode
   * @private
   */
  speakOverviewContent() {
    webSpeaker.speak( this.createOverviewContent() );
  }

  /**
   * Speak details about the current state of the simulation. Pulls content that is used
   * in the screen summary and puts them together in a single paragraph.
   * @private
   */
  speakDetailsContent() {
    webSpeaker.speak( this.createDetailsContent() );
  }
}

sceneryPhet.register( 'SelfVoicingQuickControl', SelfVoicingQuickControl );
export default SelfVoicingQuickControl;