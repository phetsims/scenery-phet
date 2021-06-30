// Copyright 2013-2021, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../phet-core/js/merge.js';
import voicingUtteranceQueue from '../../../scenery/js/accessibility/voicing/voicingUtteranceQueue.js';
import resetAllSoundPlayer from '../../../tambo/js/shared-sound-players/resetAllSoundPlayer.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ActivationUtterance from '../../../utterance-queue/js/ActivationUtterance.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import sceneryPhetStrings from '../sceneryPhetStrings.js';
import ResetButton from './ResetButton.js';

const resetAllButtonNameString = sceneryPhetStrings.a11y.resetAll.label;
const resetAllAlertString = sceneryPhetStrings.a11y.resetAll.alert;
const resetAllContextResponseString = sceneryPhetStrings.a11y.voicing.resetAll.contextResponse;

const resetAllButtonMarginCoefficient = 5 / SceneryPhetConstants.DEFAULT_BUTTON_RADIUS;

class ResetAllButton extends ResetButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS,

      // Fine tuned in https://github.com/phetsims/tasks/issues/985 and should not be overridden lightly
      touchAreaDilation: 5.2,
      baseColor: PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR,
      arrowColor: 'white',
      listener: _.noop, // {function}

      // {boolean} - option specific to ResetAllButton. If true, then the reset all button will reset back to the
      // previous PhET-iO state, if applicable.
      phetioRestoreScreenStateOnReset: true,
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'The orange, round button that can be used to restore the initial state',

      // sound generation
      soundPlayer: resetAllSoundPlayer,

      // pdom
      innerContent: resetAllButtonNameString,

      // voicing
      voicingNameResponse: resetAllButtonNameString,
      voicingContextResponse: resetAllContextResponseString
    }, options );

    const passedInListener = options.listener;

    // Wrap the listener for all cases, since PhET-iO won't be able to call this.isPhetioInstrumented() until the super call is complete.
    options.listener = () => {
      passedInListener();

      // every ResetAllButton has the option to reset to the last PhET-iO state if desired.
      if ( Tandem.PHET_IO_ENABLED && options.phetioRestoreScreenStateOnReset &&

           // even though this is Tandem.REQUIRED, still be graceful if not yet instrumented
           this.isPhetioInstrumented() ) {
        phet.phetio.phetioEngine.phetioStateEngine.restoreStateForScreen( options.tandem );
      }
    };

    assert && assert( options.xMargin === undefined && options.yMargin === undefined, 'resetAllButton sets margins' );
    options.xMargin = options.yMargin = options.radius * resetAllButtonMarginCoefficient;

    super( options );

    // a11y - when reset all button is fired, disable alerts so that there isn't an excessive stream of alerts
    // while many Properties are reset. When callbacks are ended for reset all, enable alerts again and announce an
    // alert that everything was reset.
    const resetUtterance = new ActivationUtterance( { alert: resetAllAlertString } );
    this.buttonModel.isFiringProperty.lazyLink( isFiring => {
      phet.joist.sim.utteranceQueue.enabled = !isFiring;
      voicingUtteranceQueue.enabled = !isFiring;

      if ( isFiring ) {
        phet.joist.sim.utteranceQueue.clear();
      }
      else {
        phet.joist.sim.utteranceQueue.addToBack( resetUtterance );
        this.voicingSpeakFullResponse();
      }
    } );
  }
}

sceneryPhet.register( 'ResetAllButton', ResetAllButton );
export default ResetAllButton;