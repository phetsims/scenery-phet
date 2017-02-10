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

    // a11y - wrap the listener with a function that disables all accessibility alerts and announces a summary of the 
    // reset action after the listener returns. Rather than announce all of the alerts that could trigger as the screen
    // is reset, it is prefereable to announce a short summary that is consistent every time the ResetAllButton is
    // pressed.
    // stored by value so that options.listener doesn't call accessibleListener recursively
    var resetAllListener = options.listener;
    var accessibleListener = function() {
      resetAllListener && AriaHerald.callWithDisabledAlerts( resetAllListener );
      AriaHerald.announceAssertiveWithAlert( resetAllAlertString );
    };
    options.listener = accessibleListener;

    ResetButton.call( this, options );

    // @private - a11y
    this.accessibleClickListener = { click: accessibleListener };
    this.addAccessibleInputListener( this.accessibleClickListener );
  }

  sceneryPhet.register( 'ResetAllButton', ResetAllButton );

  return inherit( ResetButton, ResetAllButton, {

    /**
     * Make eligible for garbage collection.
     * @public
     */
    dispose: function() {
      this.removeAccessibleInputListener( this.accessibleClickListener );
      ResetButton.prototype.dispose && ResetButton.prototype.dispose.call( this );
    }
  } );
} );
