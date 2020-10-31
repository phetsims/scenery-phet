// Copyright 2020, University of Colorado Boulder

/**
 * A dialog with a few basic UI components with self-voicing and gesture control to give
 * the user a chance to play with components before interacting with them in the simulation.
 * This is intended for use only in prototypes for user interviews. The hope is that providing
 * user with a chance to play with components before jumping into the sim will separate
 * learning of the controls versus learning of the content.
 *
 * @author Jesse Greenberg
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Display from '../../../../scenery/js/display/Display.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import HSlider from '../../../../sun/js/HSlider.js';
import SelfVoicingUtterance from '../../../../utterance-queue/js/SelfVoicingUtterance.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import SelfVoicingInputListener from './SelfVoicingInputListener.js';
import SelfVoicingWrapperNode from './SelfVoicingWrapperNode.js';

// constants
const contentFont = new PhetFont( 16 );
const titleFont = new PhetFont( 32 );

const titleString = 'Gestures';
const dialogDescriptionString = 'Welcome! This simulation uses web speech and some custom gestures, here are a couple ' +
                                'to test out to get things going. When ready, continue to simulation.';
const continueButtonContent = 'Continue to simulation';
const testButtonContent = 'Activate Me!';
const pressedString = 'Thanks for activating me! You rock!';
const sliderLabelString = 'Move Me';
const grabDragHintString = sceneryPhetStrings.a11y.selfVoicing.grabDragHint;
const grabbedAlertString = sceneryPhetStrings.a11y.selfVoicing.grabbedAlert;
const releasedString = sceneryPhetStrings.a11y.grabDrag.released;

class SelfVoicingIntroDialog extends Dialog {
  constructor( options ) {
    if ( options ) {
      assert && assert( options.title === undefined, 'SelfVoicingIntroDialog sets title' );
    }

    options = merge( {
      title: new Text( titleString, {
        font: titleFont,
        tagName: 'h1',
        innerContent: titleString
      } )
    }, options );

    const descriptionParagraph = new RichText( dialogDescriptionString, {
      lineWrap: 500,
      boundsMethod: 'accurate',

      tagName: 'p',
      innerContent: dialogDescriptionString
    } );

    const speakDescriptionParagraph = () => {
      const utterance = new SelfVoicingUtterance( {
        alert: dialogDescriptionString,
        cancelOther: false
      } );
      phet.joist.sim.selfVoicingUtteranceQueue.addToBack( utterance );
    };

    // a wrapper that surrounds the descriptionParagraph with a Node that is focusable
    // and has input listeners that make it possible to click the text to hear information
    // about it
    const selfVoicingWrapper = new SelfVoicingWrapperNode( descriptionParagraph, {
      listenerOptions: {
        onFocusIn: speakDescriptionParagraph,
        onPress: speakDescriptionParagraph
      }
    } );
    selfVoicingWrapper.addChild( descriptionParagraph );

    const exampleButton = new TextPushButton( testButtonContent, {
      font: contentFont,
      listener: () => {
        phet.joist.sim.selfVoicingUtteranceQueue.addToBack( pressedString );
      }
    } );

    const exampleSliderProperty = new NumberProperty( 5 );
    const exampleSliderRange = new Range( 0, 10 );
    const exampleSlider = new HSlider( exampleSliderProperty, new Range( 0, 10 ) );

    const exampleComponents = new HBox( {
      children: [ exampleButton, exampleSlider ]
    } );

    // continues to the simulation, closing this dialog
    const continueButton = new TextPushButton( continueButtonContent, {
      font: contentFont,
      listener: () => {
        this.hide();
      }
    } );

    const content = new VBox( {
      children: [ selfVoicingWrapper, exampleComponents, continueButton ],
      spacing: 50
    } );

    super( content, options );

    // @private {Node}
    this.selfVoicingWrapper = selfVoicingWrapper;

    // listeners that provide actual self-voicing content on the example components
    exampleButton.addInputListener( new SelfVoicingInputListener( {
      onFocusIn: () => {
        phet.joist.sim.selfVoicingUtteranceQueue.addToBack( testButtonContent );
      }
    } ) );

    exampleSlider.addInputListener( new SelfVoicingInputListener( {
      onFocusIn: () => {
        phet.joist.sim.selfVoicingUtteranceQueue.addToBack( sliderLabelString );
      }
    } ) );

    continueButton.addInputListener(  new SelfVoicingInputListener( {
      onFocusIn: () => {
        phet.joist.sim.selfVoicingUtteranceQueue.addToBack( continueButtonContent );
      }
    } ) );

    exampleSlider.addInputListener( {
      click: () => {
        phet.joist.sim.selfVoicingUtteranceQueue.addToBack( grabDragHintString );
      }
    } );

    // this is a workaround to speak the label of the close button when this dialog is
    // open - when this feature gets built out more thoroughly this would just be
    // attached to focus of the Dialog's private close button - but I really didn't want
    // to add code to Dialog, and I didn't want to work in a branch so this is here for now
    Display.focusProperty.lazyLink( focus => {
      if ( focus && focus.trail.lastNode().innerContent === 'Close' ) {
        phet.joist.sim.selfVoicingUtteranceQueue.addToBack( 'Close' );
      }
    } );

    const valueChangeUtterance = new SelfVoicingUtterance();
    exampleSliderProperty.lazyLink( value => {
      valueChangeUtterance.alert = value + '';
      phet.joist.sim.selfVoicingUtteranceQueue.addToBack( valueChangeUtterance );
    } );

    let positionOnValueChange = null;
    exampleSlider.swipeStart = event => {
      phet.joist.sim.selfVoicingUtteranceQueue.addToBack( grabbedAlertString );
      positionOnValueChange = event.pointer.point;
    };
    exampleSlider.swipeEnd = () => {
      const releasedAlert = new SelfVoicingUtterance( {
        cancelOther: false,
        alert: releasedString
      } );
      phet.joist.sim.selfVoicingUtteranceQueue.addToBack( releasedAlert );
    };
    exampleSlider.swipeMove = event => {
      const nextSwipePosition = event.pointer.point;
      const swipeDelta = nextSwipePosition.minus( positionOnValueChange );
      const distance = nextSwipePosition.distance( positionOnValueChange );

      if ( distance > 30 ) {
        const swipeAngle = swipeDelta.angle;

        const swipeRight = Utils.equalsEpsilon( Math.abs( swipeAngle ), 0, Math.PI / 4 );
        const swipeLeft = Utils.equalsEpsilon( Math.abs( swipeAngle ), Math.PI, Math.PI / 4 );
        const swipeUp = Utils.equalsEpsilon( swipeAngle, -Math.PI / 2, Math.PI / 4 );
        const swipeDown = Utils.equalsEpsilon( swipeAngle, Math.PI / 2, Math.PI / 4 );

        let nextValue = exampleSliderProperty.value;
        if ( swipeRight || swipeUp ) {
          nextValue++;
        }
        else if ( swipeLeft || swipeDown ) {
          nextValue--;
        }

        if ( exampleSliderRange.contains( nextValue ) ) {
          exampleSliderProperty.set( nextValue );
        }

        positionOnValueChange = nextSwipePosition;
      }
    };
  }

  /**
   * Puts focus on the intro paragraph, useful to do when the dialog first opens.
   * @public
   */
  focusIntroDescription() {
    this.selfVoicingWrapper.focus();
  }
}

sceneryPhet.register( 'SelfVoicingIntroDialog', SelfVoicingIntroDialog );
export default SelfVoicingIntroDialog;