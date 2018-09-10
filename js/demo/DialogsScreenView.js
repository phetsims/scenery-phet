// Copyright 2018, University of Colorado Boulder

/**
 * Demonstration of scenery-phet dialogs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ContextLossFailureDialog = require( 'SCENERY_PHET/ContextLossFailureDialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var BUTTON_LABEL_FONT = new PhetFont( 20 );

  /**
   * @constructor
   */
  function DialogsScreenView() {
    ScreenView.call( this );

    // reuse one instance of the dialog
    var contextLossFailureDialog = null;

    var contextLossFailureButton = new RectangularPushButton( {
      content: new Text( 'context loss failure', { font: BUTTON_LABEL_FONT } ),
      listener: function() {
        if ( !contextLossFailureDialog ) {
          contextLossFailureDialog = new ContextLossFailureDialog( {

            // So that we don't cause problems with automated testing.
            // See https://github.com/phetsims/scenery-phet/issues/375
            reload: function() {
              console.log( 'Reload' );
            }
          } );
        }
        contextLossFailureDialog.show();
      }
    } );

    this.addChild( new VBox( {
      children: [ contextLossFailureButton ],
      spacing: 20,
      center: this.layoutBounds.center
    } ) );
  }

  sceneryPhet.register( 'DialogsScreenView', DialogsScreenView );

  return inherit( ScreenView, DialogsScreenView );
} );