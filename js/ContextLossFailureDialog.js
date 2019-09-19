// Copyright 2015-2019, University of Colorado Boulder

/**
 * Failure message displayed when a WebGL context loss is experienced and we can't recover. Offers a button to reload
 * the simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  const webglWarningContextLossFailureString = require( 'string!SCENERY_PHET/webglWarning.contextLossFailure' );
  const webglWarningContextLossReloadString = require( 'string!SCENERY_PHET/webglWarning.contextLossReload' );

  /**
   *
   * @constructor
   */
  function ContextLossFailureDialog( options ) {

    var self = this;
    
    options = _.extend( {

      // Provided as an option so that scenery-phet demo app can test without causing automated-testing failures.
      // See https://github.com/phetsims/scenery-phet/issues/375
      reload: function() {
        window.location.reload();
      },

      // Dialog options
      xSpacing: 30,
      topMargin: 30,
      bottomMargin: 30,
      leftMargin: 30

    }, options );

    // @private
    this.reload = options.reload;

    var warningSign = new FontAwesomeNode( 'warning_sign', {
      fill: '#E87600', // "safety orange", according to Wikipedia
      scale: 0.6
    } );

    var text = new Text( webglWarningContextLossFailureString, { font: new PhetFont( 12 ) } );

    var button = new TextPushButton( webglWarningContextLossReloadString, {
      font: new PhetFont( 12 ),
      baseColor: '#E87600',
      listener: function() { self.hide(); }
    } );

    Dialog.call( this, new HBox( {
      children: [ warningSign, text, button ],
      spacing: 10
    } ), options );
  }

  sceneryPhet.register( 'ContextLossFailureDialog', ContextLossFailureDialog );

  return inherit( Dialog, ContextLossFailureDialog, {

    /**
     * Perform reload (or provided callback) regardless of how the dialog is hidden.
     * See https://github.com/phetsims/scenery-phet/issues/373.
     * @public
     * @override
     */
    hide: function() {
      this.reload();
      Dialog.prototype.hide.call( this );
    }
  } );
} );
