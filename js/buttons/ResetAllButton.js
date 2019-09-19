// Copyright 2013-2019, University of Colorado Boulder

/**
 * Reset All button, typically used to reset everything ('reset all') on a Screen.
 * Extends ResetButton, adding things that are specific to 'reset all'.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ActivationUtterance = require( 'SCENERY_PHET/accessibility/ActivationUtterance' );
  const BooleanIO = require( 'TANDEM/types/BooleanIO' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const ResetAllButtonIO = require( 'SCENERY_PHET/buttons/ResetAllButtonIO' );
  const ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const Tandem = require( 'TANDEM/Tandem' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // constants
  const RESET_ALL_BUTTON_RADIUS = 20.8;

  // a11y strings - not translatable
  const resetAllButtonNameString = SceneryPhetA11yStrings.resetAllLabelString.value;
  const resetAllAlertString = SceneryPhetA11yStrings.resetAllAlertString.value;

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
      phetioType: ResetAllButtonIO,

      // a11y
      innerContent: resetAllButtonNameString
    }, options );

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
      utteranceQueue.enabled = !isFiring;

      if ( isFiring ) {
        utteranceQueue.clear();
      }
      else {
        utteranceQueue.addToBack( resetUtterance );
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
