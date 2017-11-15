// Copyright 2013-2017, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var UtteranceQueue = require( 'SCENERY_PHET/accessibility/UtteranceQueue' );

  // constants
  var RESET_ALL_BUTTON_RADIUS = 24; // derived from the image files that were originally used for this button

  // strings
  var resetAllButtonNameString = require( 'string!SCENERY_PHET/ResetAllButton.name' );

  // a11y strings - not translatable
  var resetAllAlertString = SceneryPhetA11yStrings.resetAllAlertString;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetAllButton( options ) {

    options = _.extend( {
      radius: RESET_ALL_BUTTON_RADIUS,
      baseColor: PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR,
      arrowColor: 'white',
      tandem: Tandem.tandemRequired(),

      // a11y
      tagName: 'input',
      inputType: 'button',
      accessibleLabel: resetAllButtonNameString,
      useAriaLabel: true,

      // We want to be able to make the ResetAllButton fully interoperable, which means opting in and passing that to
      // the button model.
      phetioReadOnly: false
    }, options );

    ResetButton.call( this, options );

    this.focusHighlight = new Shape().circle( 0, 0, options.radius + 5 );

    // @private - Mirrored property of `buttonModel.isFiringProperty`, but is phet-io instrumented.
    this.isFiringProperty = new DerivedProperty( [ this.buttonModel.isFiringProperty ], function( a ) { return a; }, {
      tandem: options.tandem.createTandem( 'isFiringProperty' ),
      phetioType: DerivedPropertyIO( BooleanIO ),
      phetioState: options.phetioState,
      phetioReadOnly: options.phetioReadOnly
    } );

    // a11y - when reset all button is fired, disable alerts so that there isn't an excessive stream of alerts
    // while many Properties are reset. When callbacks are ended for reset all, enable alerts again and announce an
    // alert that everything was reset.
    this.isFiringProperty.lazyLink( function( isFiring ) {
      UtteranceQueue.enabled = !isFiring;

      !isFiring && UtteranceQueue.addToBack( new Utterance( resetAllAlertString, {
        typeId: 'resetAllButtonAlert'
      } ) );
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
