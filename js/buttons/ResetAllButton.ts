// Copyright 2013-2023, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { KeyboardListener, voicingUtteranceQueue } from '../../../scenery/js/imports.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import resetAllSoundPlayer from '../../../tambo/js/shared-sound-players/resetAllSoundPlayer.js';
import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ActivationUtterance from '../../../utterance-queue/js/ActivationUtterance.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import ResetButton, { ResetButtonOptions } from './ResetButton.js';

const MARGIN_COEFFICIENT = 5 / SceneryPhetConstants.DEFAULT_BUTTON_RADIUS;

type SelfOptions = {
  phetioRestoreScreenStateOnReset?: boolean;
};

export type ResetAllButtonOptions = SelfOptions & StrictOmit<ResetButtonOptions, 'xMargin' | 'yMargin'>;

export default class ResetAllButton extends ResetButton {

  private readonly disposeResetAllButton: () => void;

  public constructor( providedOptions?: ResetAllButtonOptions ) {

    const options = optionize<ResetAllButtonOptions, SelfOptions, ResetButtonOptions>()( {

      // ResetAllButtonOptions
      radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS,

      // {boolean} - option specific to ResetAllButton. If true, then the reset all button will reset back to the
      // previous PhET-iO state, if applicable.
      phetioRestoreScreenStateOnReset: true,

      // Fine tuned in https://github.com/phetsims/tasks/issues/985 and should not be overridden lightly
      touchAreaDilation: 5.2,
      baseColor: PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR,
      arrowColor: 'white',
      listener: _.noop, // {function}

      // phet-io
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'ResetAllButton',
      phetioDocumentation: 'The orange, round button that can be used to restore the initial state',

      // sound generation
      soundPlayer: resetAllSoundPlayer,

      // pdom
      innerContent: SceneryPhetStrings.a11y.resetAll.labelStringProperty,

      // voicing
      voicingNameResponse: SceneryPhetStrings.a11y.resetAll.labelStringProperty,
      voicingContextResponse: SceneryPhetStrings.a11y.voicing.resetAll.contextResponseStringProperty
    }, providedOptions );

    // Wrap the listener for all cases, since PhET-iO won't be able to call this.isPhetioInstrumented() until the super
    // call is complete.
    const passedInListener = options.listener;
    options.listener = () => {
      passedInListener && passedInListener();

      // every ResetAllButton has the option to reset to the last PhET-iO state if desired.
      if ( Tandem.PHET_IO_ENABLED && options.phetioRestoreScreenStateOnReset &&

           // even though this is Tandem.REQUIRED, still be graceful if not yet instrumented
           this.isPhetioInstrumented() ) {
        phet.phetio.phetioEngine.phetioStateEngine.restoreStateForScreen( options.tandem );
      }
    };

    assert && assert( options.xMargin === undefined && options.yMargin === undefined, 'resetAllButton sets margins' );
    options.xMargin = options.yMargin = options.radius * MARGIN_COEFFICIENT;

    super( options );

    // a11y - when reset all button is fired, disable alerts so that there isn't an excessive stream of alerts
    // while many Properties are reset. When callbacks are ended for reset all, enable alerts again and announce an
    // alert that everything was reset.
    const resetUtterance = new ActivationUtterance( { alert: SceneryPhetStrings.a11y.resetAll.alertStringProperty } );
    let voicingEnabledOnFire = voicingUtteranceQueue.enabled;
    const ariaEnabledOnFirePerUtteranceQueueMap = new Map(); // Keep track of the enabled of each connected description UtteranceQueue
    this.pushButtonModel.isFiringProperty.lazyLink( ( isFiring: boolean ) => {

      // Handle voicingUtteranceQueue
      if ( isFiring ) {
        voicingEnabledOnFire = voicingUtteranceQueue.enabled;
        voicingUtteranceQueue.enabled = false;
        voicingUtteranceQueue.clear();
      }
      else {

        // restore the enabled state to each utteranceQueue after resetting
        voicingUtteranceQueue.enabled = voicingEnabledOnFire;
        this.voicingSpeakFullResponse();
      }

      // Handle each connected description UtteranceQueue
      this.forEachUtteranceQueue( utteranceQueue => {

        if ( isFiring ) {

          // mute and clear the utteranceQueue
          ariaEnabledOnFirePerUtteranceQueueMap.set( utteranceQueue, utteranceQueue.enabled );
          utteranceQueue.enabled = false;
          utteranceQueue.clear();
        }
        else {
          utteranceQueue.enabled = ariaEnabledOnFirePerUtteranceQueueMap.get( utteranceQueue ) || utteranceQueue.enabled;
          utteranceQueue.addToBack( resetUtterance );
        }
      } );
    } );

    const keyboardListener = new KeyboardListener( {
      keys: [ 'alt+r' ],
      callback: () => this.pdomClick(),
      global: true,

      // fires on up because the listener will often call interruptSubtreeInput (interrupting this keyboard listener)
      listenerFireTrigger: 'up'
    } );
    this.addInputListener( keyboardListener );

    this.disposeResetAllButton = () => {
      this.removeInputListener( keyboardListener );
      ariaEnabledOnFirePerUtteranceQueueMap.clear();
    };
  }

  public override dispose(): void {
    this.disposeResetAllButton();
    super.dispose();
  }
}

sceneryPhet.register( 'ResetAllButton', ResetAllButton );