// Copyright 2020, University of Colorado Boulder

/**
 * A Dialog with information about the self-voicing feature, and a button
 * to enable web speech within the sim. Many browsers do not allow speech synthesis
 * until user has made some activation. It is intended for use only in interviews
 * that are coming up in November of 2020, so that it is as easy as possilbe to enable this feature
 * in interviews with BVI participants. In the long run this feature will be enabled with
 * some user setting so this will not be necessary.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import webSpeaker from '../../../../scenery/js/accessibility/speaker/webSpeaker.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';

// constants
const contentFont = new PhetFont( 16 );
const titleFont = new PhetFont( 32 );

// strings
const titleString = 'Web Speech!';
const descriptionString = 'This page uses Web Speech to describe what is available and what is happening. ' +
                          'Please turn off your screen reader and press the button below to enable web speech.';
const enableButtonContent = 'Enable Speech';
const speechEnabledString = 'Speech Enabled';

class SelfVoicingLandingDialog extends Dialog {
  constructor( options ) {
    if ( options ) {
      assert && assert( options.title === undefined, 'SelfVoicingLandingDialog sets title' );
      assert && assert( options.closeButtonListener === undefined, 'SelfVoicingLandingDialog sets closeButtonListener' );
    }

    options = merge( {

      title: new Text( titleString, {
        font: titleFont,
        tagName: 'h1',
        innerContent: titleString
      } ),

      closeButtonListener: () => {

        // speak must be called directly, for some reason if this gets deferred by the delay
        // in utteranceQueue iOS Safari will never speak it
        webSpeaker.speak( speechEnabledString );
        this.hide();
      }
    }, options );

    // paragraph describing the dialog and this feature
    const descriptionParagraph = new RichText( descriptionString, {
      lineWrap: 500,
      tagName: 'p',
      innerContent: descriptionString
    } );

    const enableButton = new TextPushButton( enableButtonContent, {
      listener: () => {

        // speak must be called directly, for some reason if this gets deferred by the delay
        // in utteranceQueue iOS Safari will never speak it
        webSpeaker.speak( speechEnabledString );
        this.hide();
      },

      font: contentFont
    } );

    const content = new VBox( {
      children: [ descriptionParagraph, enableButton ]
    } );

    super( content, options );
  }
}

sceneryPhet.register( 'SelfVoicingLandingDialog', SelfVoicingLandingDialog );
export default SelfVoicingLandingDialog;