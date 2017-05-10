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
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var Shape = require( 'KITE/Shape' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );
  var SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  var TandemEmitter = require( 'TANDEM/axon/TandemEmitter' );
  var TResetAllButton = require( 'SUN/buttons/TResetAllButton' );

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
      focusHighlight: new Shape().circle( 0, 0, RESET_ALL_BUTTON_RADIUS )
    }, options );

    var tandem = options.tandem;
    options.tandem = tandem.createSupertypeTandem();

    this.startedCallbacksForResetEmitter = new TandemEmitter( {
      tandem: tandem.createTandem( 'startedResetEmitted' ),
      phetioArgumentTypes: [ ],
      phetioEmitData: false
    } );
    this.endedCallbacksForResetEmitter = new TandemEmitter( {
      tandem: tandem.createTandem( 'endedResetEmitted' ),
      phetioArgumentTypes: [ ],
      phetioEmitData: false
    } );

    ResetButton.call( this, options );

    tandem.addInstance( this, TResetAllButton );
  }

  sceneryPhet.register( 'ResetAllButton', ResetAllButton );

  return inherit( ResetButton, ResetAllButton, {

    /**
     * Make eligible for garbage collection.
     * @public
     */
    dispose: function() {
      this.clickListener && this.removeAccessibleInputListener( this.clickListener );
      ResetButton.prototype.dispose && ResetButton.prototype.dispose.call( this );
    },

    /**
     * Add a listener to the ResetAllButton, wrapping it in a function that handles keyboard navigation and
     * accessibility announcements. All accessibility alerts are disabled during reset. Rather than announce
     * all alerts that trigger when the Screen is reset, a short and consistent summary of the reset action
     * is announced.
     * @public
     * @param {function} listener
     */
    addListener: function( listener ) {
      var self = this;

      // wrap the listener in a function that disables alerts until the listener
      // returns - then announce that the Screen has been reset 
      var accessibleListener = function() {
        self.startedCallbacksForResetEmitter.emit();

        AriaHerald.callWithDisabledAlerts( listener );
        AriaHerald.announcePolite( resetAllAlertString );

        self.endedCallbacksForResetEmitter.emit();
      };

      // @private - add the accessibility listener so button fires on 'enter' or 'spacebar'
      this.clickListener = this.addAccessibleInputListener( { click: accessibleListener } );

      ResetButton.prototype.addListener.call( this, accessibleListener );
    }
  } );
} );
