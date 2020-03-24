// Copyright 2013-2020, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../axon/js/DerivedPropertyIO.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import resetAllSoundPlayer from '../../../tambo/js/shared-sound-players/resetAllSoundPlayer.js';
import Tandem from '../../../tandem/js/Tandem.js';
import BooleanIO from '../../../tandem/js/types/BooleanIO.js';
import ActivationUtterance from '../../../utterance-queue/js/ActivationUtterance.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import ResetButton from './ResetButton.js';

// constants
const RESET_ALL_BUTTON_RADIUS = 20.8;

const resetAllButtonNameString = sceneryPhetStrings.a11y.resetAll.label;
const resetAllAlertString = sceneryPhetStrings.a11y.resetAll.alert;

/**
 * @param {Object} [options]
 * @constructor
 */
function ResetAllButton( options ) {

  options = merge( {
    radius: RESET_ALL_BUTTON_RADIUS,

    // Fine tuned in https://github.com/phetsims/tasks/issues/985 and should not be overriden lightly
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

    // a11y
    innerContent: resetAllButtonNameString
  }, options );

  const passedInListener = options.listener;
  options.listener = () => {
    passedInListener();

    // every ResetAllButton has the option to reset to the last PhET-iO state if desired.
    if ( options.phetioRestoreScreenStateOnReset &&
         this.isPhetioInstrumented() && // even though this is Tandem.REQUIRED, still be graceful if not yet instrumented
         _.hasIn( window, 'phet.phetIo.phetioEngine' ) ) {
      phet.phetIo.phetioEngine.phetioStateEngine.restoreStateForScreen( options.tandem );
    }
  };

  ResetButton.call( this, options );

  // @private - Mirrored property of `buttonModel.isFiringProperty`, but is phet-io instrumented.
  this.isFiringProperty = new DerivedProperty( [ this.buttonModel.isFiringProperty ], function( a ) { return a; }, {
    tandem: options.tandem.createTandem( 'isFiringProperty' ),
    phetioDocumentation: 'Temporarily becomes true while the Reset All button is firing.  Commonly used to disable audio effects during reset.',
    phetioType: DerivedPropertyIO( BooleanIO ),
    phetioState: false // this is a transient property based on user interaction, should not be stored in the state
  } );

  // a11y - when reset all button is fired, disable alerts so that there isn't an excessive stream of alerts
  // while many Properties are reset. When callbacks are ended for reset all, enable alerts again and announce an
  // alert that everything was reset.
  const resetUtterance = new ActivationUtterance( { alert: resetAllAlertString } );
  this.isFiringProperty.lazyLink( function( isFiring ) {
    phet.joist.sim.utteranceQueue.enabled = !isFiring;

    if ( isFiring ) {
      phet.joist.sim.utteranceQueue.clear();
    }
    else {
      phet.joist.sim.utteranceQueue.addToBack( resetUtterance );
    }
  } );
}

sceneryPhet.register( 'ResetAllButton', ResetAllButton );

export default inherit( ResetButton, ResetAllButton, {

  /**
   * Make eligible for garbage collection.
   * @public
   */
  dispose: function() {

    this.isFiringProperty.dispose();

    ResetButton.prototype.dispose.call( this );
  }
} );