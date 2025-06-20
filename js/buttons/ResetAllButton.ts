// Copyright 2013-2025, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import optionize from '../../../phet-core/js/optionize.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import voicingUtteranceQueue from '../../../scenery/js/accessibility/voicing/voicingUtteranceQueue.js';
import HotkeyData from '../../../scenery/js/input/HotkeyData.js';
import KeyboardListener from '../../../scenery/js/listeners/KeyboardListener.js';
import Node from '../../../scenery/js/nodes/Node.js';
import sharedSoundPlayers from '../../../tambo/js/sharedSoundPlayers.js';
import Tandem from '../../../tandem/js/Tandem.js';
import ActivationUtterance from '../../../utterance-queue/js/ActivationUtterance.js';
import isResettingAllProperty from '../isResettingAllProperty.js';
import TextKeyNode from '../keyboard/TextKeyNode.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import ResetButton, { ResetButtonOptions } from './ResetButton.js';

const MARGIN_COEFFICIENT = 5 / SceneryPhetConstants.DEFAULT_BUTTON_RADIUS;

type SelfOptions = {

  // option specific to ResetAllButton. If true, then the reset all button will reset back to the
  // previous PhET-iO state, if applicable.
  phetioRestoreScreenStateOnReset?: boolean;

  // When reset all is called, search for all ancestor Nodes that are JOIST/ScreenView and call
  // Node.interruptSubtreeInput() on each. See https://github.com/phetsims/scenery-phet/issues/861
  interruptScreenViewInput?: boolean;
};

export type ResetAllButtonOptions = SelfOptions & StrictOmit<ResetButtonOptions, 'xMargin' | 'yMargin'>;

export default class ResetAllButton extends ResetButton {

  private readonly disposeResetAllButton: () => void;

  public constructor( providedOptions?: ResetAllButtonOptions ) {

    const options = optionize<ResetAllButtonOptions, SelfOptions, ResetButtonOptions>()( {

      // ResetAllButtonOptions
      radius: SceneryPhetConstants.DEFAULT_BUTTON_RADIUS,

      phetioRestoreScreenStateOnReset: true,
      interruptScreenViewInput: true,

      // Fine tuned in https://github.com/phetsims/tasks/issues/985 and should not be overridden lightly.
      touchAreaDilation: 5.2,
      baseColor: PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR,
      arrowColor: 'white',

      // phet-io
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'ResetAllButton',
      phetioDocumentation: 'The orange, round button that can be used to restore the initial state',

      // sound generation
      soundPlayer: sharedSoundPlayers.get( 'resetAll' ),

      // pdom
      accessibleName: SceneryPhetStrings.a11y.resetAll.accessibleNameStringProperty,

      // voicing - set here instead of using accessibleContextResponse because we make a manual request to speak
      // the response after the button fires.
      voicingContextResponse: SceneryPhetStrings.a11y.resetAll.accessibleContextResponseStringProperty
    }, providedOptions );

    assert && assert( options.xMargin === undefined && options.yMargin === undefined, 'resetAllButton sets margins' );
    options.xMargin = options.yMargin = options.radius * MARGIN_COEFFICIENT;

    super( options );

    // a11y - When reset all button is fired, disable alerts so that there isn't an excessive stream of alerts while
    // many Properties are reset. When callbacks are ended for reset all, enable alerts again and announce an alert that
    // everything was reset.
    const resetUtterance = new ActivationUtterance( { alert: SceneryPhetStrings.a11y.resetAll.accessibleContextResponseStringProperty } );
    let voicingEnabledOnFire = voicingUtteranceQueue.enabled;
    const ariaEnabledOnFirePerUtteranceQueueMap = new Map(); // Keep track of the enabled of each connected description UtteranceQueue
    this.pushButtonModel.isFiringProperty.lazyLink( ( isFiring: boolean ) => {
      isResettingAllProperty.value = isFiring;

      // Handle voicingUtteranceQueue.
      if ( isFiring ) {

        // Interrupt before doing anything else.
        options.interruptScreenViewInput && this.interruptScreenViewInput();

        voicingEnabledOnFire = voicingUtteranceQueue.enabled;
        voicingUtteranceQueue.enabled = false;
        voicingUtteranceQueue.clear();
      }
      else {

        // Every ResetAllButton has the option to reset to the last PhET-iO state if desired.
        if ( Tandem.PHET_IO_ENABLED && options.phetioRestoreScreenStateOnReset &&

             // Even though this is Tandem.REQUIRED, still be graceful if not yet instrumented.
             this.isPhetioInstrumented() ) {
          phet.phetio.phetioEngine.phetioStateEngine.restoreStateForScreen( options.tandem );
        }

        // Restore the enabled state to each utteranceQueue after resetting.
        voicingUtteranceQueue.enabled = voicingEnabledOnFire;
        this.voicingSpeakFullResponse();
      }

      // Handle each connected description UtteranceQueue.
      this.forEachUtteranceQueue( utteranceQueue => {

        if ( isFiring ) {

          // Mute and clear the utteranceQueue.
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

    const keyboardListener = KeyboardListener.createGlobal( this, {
      keyStringProperties: ResetAllButton.RESET_ALL_HOTKEY_DATA.keyStringProperties,
      fire: () => this.pdomClick(),

      // fires on up because the listener will often call interruptSubtreeInput (interrupting this keyboard listener)
      fireOnDown: false
    } );

    this.disposeResetAllButton = () => {
      keyboardListener.dispose();
      ariaEnabledOnFirePerUtteranceQueueMap.clear();
    };
  }

  private interruptScreenViewInput(): void {
    const screenViews = this.getParentScreenViews();

    for ( let i = 0; i < screenViews.length; i++ ) {
      screenViews[ i ].interruptSubtreeInput();
    }
  }

  private getParentScreenViews(): Node[] {
    const ScreenViewClass = window.phet?.joist?.ScreenView;
    if ( !ScreenViewClass ) {
      return [];
    }
    const trails = this.getTrails();

    const screenViews: Node[] = [];
    for ( let i = 0; i < trails.length; i++ ) {
      const trail = trails[ i ];
      const nodes = trail.nodes;

      // Start at the closest ancestor
      for ( let j = nodes.length - 1; j >= 0; j-- ) {
        const node = nodes[ j ];
        if ( node instanceof ScreenViewClass ) {
          screenViews.push( node );
          break; // Stop at first ScreenView
        }
      }
    }

    return _.uniq( screenViews );
  }

  public override dispose(): void {
    this.disposeResetAllButton();
    super.dispose();
  }

  public static readonly RESET_ALL_HOTKEY_DATA = new HotkeyData( {

    // alt+r
    keyStringProperties: [ new Property( 'alt+r' ) ],

    // visual label for this Hotkey in the Keyboard Help dialog
    keyboardHelpDialogLabelStringProperty: SceneryPhetStrings.keyboardHelpDialog.resetAllStringProperty,

    // PDOM description for this Hotkey in the Keyboard Help dialog
    keyboardHelpDialogPDOMLabelStringProperty: StringUtils.fillIn( SceneryPhetStrings.a11y.keyboardHelpDialog.general.resetAllDescriptionPatternStringProperty, {
      altOrOption: TextKeyNode.getAltKeyString()
    } ),

    repoName: sceneryPhet.name,
    global: true
  } );
}

sceneryPhet.register( 'ResetAllButton', ResetAllButton );