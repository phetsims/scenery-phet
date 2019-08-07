// Copyright 2013-2019, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ActivationUtterance = require( 'SCENERY_PHET/accessibility/ActivationUtterance' );
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var soundManager = require( 'TAMBO/soundManager' );
  var Tandem = require( 'TANDEM/Tandem' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // constants
  var RESET_ALL_BUTTON_RADIUS = 20.8;

  // sounds
  const resetAllSound = require( 'sound!TAMBO/reset-all.mp3' );

  // a11y strings - not translatable
  var resetAllButtonNameString = SceneryPhetA11yStrings.resetAllLabelString.value;
  var resetAllAlertString = SceneryPhetA11yStrings.resetAllAlertString.value;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetAllButton( options ) {

    options = _.extend( {
      radius: RESET_ALL_BUTTON_RADIUS,

      // Fine tuned in https://github.com/phetsims/tasks/issues/985 and should not be overriden lightly
      touchAreaDilation: 5.2,
      baseColor: PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR,
      arrowColor: 'white',
      tandem: Tandem.required,

      phetioDocumentation: 'The orange, round button that can be used to restore the initial state',

      // sound, supply an alternative if desired or set to null for no sound
      soundInfo: resetAllSound,

      // a11y
      innerContent: resetAllButtonNameString
    }, options );

    ResetButton.call( this, options );

    // @private - Mirrored property of `buttonModel.isFiringProperty`, but is phet-io instrumented.
    var isFiringProperty = new DerivedProperty( [ this.buttonModel.isFiringProperty ], function( a ) { return a; }, {
      tandem: options.tandem.createTandem( 'isFiringProperty' ),
      phetioDocumentation: 'Temporarily becomes true while the Reset All button is firing.  Commonly used to disable audio effects during reset.',
      phetioType: DerivedPropertyIO( BooleanIO ),
      phetioState: false // this is a transient property based on user interaction, should not be stored in the state
    } );

    // sound generation
    let resetAllSoundClip;
    if ( options.soundInfo ) {
      resetAllSoundClip = new SoundClip( options.soundInfo, { initialOutputLevel: 0.7 } );
      soundManager.addSoundGenerator( resetAllSoundClip );

      // play the sound when fired
      isFiringProperty.lazyLink( function( isFiring ) {
        if ( isFiring ) {
          resetAllSoundClip.play();
        }
      } );
    }

    // a11y - when reset all button is fired, disable alerts so that there isn't an excessive stream of alerts
    // while many Properties are reset. When callbacks are ended for reset all, enable alerts again and announce an
    // alert that everything was reset.
    var resetUtterance = new ActivationUtterance( { alert: resetAllAlertString } );
    isFiringProperty.lazyLink( function( isFiring ) {
      utteranceQueue.enabled = !isFiring;

      if ( isFiring ) {
        utteranceQueue.clear();
      }
      else {
        utteranceQueue.addToBack( resetUtterance );
      }
    } );

    // @private - dispose function
    this.disposeResetAllButton = function() {
      if ( options.soundInfo ) {
        soundManager.removeSoundGenerator( resetAllSoundClip );
        resetAllSoundClip.dispose();
      }
      isFiringProperty.dispose();
    };
  }

  sceneryPhet.register( 'ResetAllButton', ResetAllButton );

  return inherit( ResetButton, ResetAllButton, {

    /**
     * Make eligible for garbage collection.
     * @public
     */
    dispose: function() {
      this.disposeResetAllButton();
      ResetButton.prototype.dispose.call( this );
    }
  } );
} );
