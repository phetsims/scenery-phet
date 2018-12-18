// Copyright 2013-2017, University of Colorado Boulder

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
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // constants
  var RESET_ALL_BUTTON_RADIUS = 24; // derived from the image files that were originally used for this button

  // strings
  var resetAllButtonNameString = require( 'string!SCENERY_PHET/ResetAllButton.name' );

  // a11y strings - not translatable
  var resetAllAlertString = SceneryPhetA11yStrings.resetAllAlertString.value;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetAllButton( options ) {

    options = _.extend( {
      radius: RESET_ALL_BUTTON_RADIUS,
      baseColor: PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR,
      arrowColor: 'white',
      tandem: Tandem.required,

      phetioDocumentation: 'The orange, round button that can be used to restore the initial state',

      // a11y
      innerContent: resetAllButtonNameString
    }, options );

    ResetButton.call( this, options );

    this.focusHighlight = new Shape().circle( 0, 0, options.radius + 5 );

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
    this.isFiringProperty.lazyLink( function( isFiring ) {
      utteranceQueue.enabled = !isFiring;

      if ( isFiring ) {
        utteranceQueue.clear();
      }
      else {
        utteranceQueue.addToBack( new Utterance( {
          alert: resetAllAlertString,

          // wait for the user to finish clicking the button before speaking the utterance, this is important if the
          // user holds down "enter" on the button - but this is also kind of a workaround and we want a better
          // way to handle this for all buttons, see https://github.com/phetsims/sun/issues/424
          uniqueGroupId: 'resetAllButtonAlert',
          delayTime: 500
        } ) );
      }
    } );
  }

  sceneryPhet.register( 'ResetAllButton', ResetAllButton );

  return inherit( ResetButton, ResetAllButton, {

    /**
     * Make eligible for garbage collection.
     * @public
     */
    dispose: function() {

      this.isFiringProperty.dispose();

      ResetButton.prototype.dispose.call( this );
    }
  } );
} );
