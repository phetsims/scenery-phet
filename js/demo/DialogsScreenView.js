// Copyright 2018-2019, University of Colorado Boulder

/**
 * Demonstration of scenery-phet dialogs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ContextLossFailureDialog = require( 'SCENERY_PHET/ContextLossFailureDialog' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const OopsDialog = require( 'SCENERY_PHET/OopsDialog' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const batteryDCellImage = require( 'image!SCENERY_PHET/battery-D-cell.png' );

  // constants
  var BUTTON_OPTIONS = {
    font: new PhetFont( 20 )
  };

  /**
   * @constructor
   */
  function DialogsScreenView() {
    ScreenView.call( this );

    // reuse one instance of the dialog
    var contextLossFailureDialog = null;
    var contextLossFailureButton = new RectangularPushButton( {
      content: new Text( 'ContextLossFailureDialog', BUTTON_OPTIONS ),
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

    var oopsDialog = null;
    var oopsButton = new RectangularPushButton( {
      content: new Text( 'OopsDialog', BUTTON_OPTIONS ),
      listener: () => {
        if ( !oopsDialog ) {
          oopsDialog = new OopsDialog( 'Oops!<br><br>Your battery appears to be dead.', {
            iconNode: new Image( batteryDCellImage, { rotation: -Math.PI / 2 } )
          } );
        }
        oopsDialog.show();
      }
    });

    this.addChild( new VBox( {
      children: [
        contextLossFailureButton,
        oopsButton
      ],
      spacing: 20,
      center: this.layoutBounds.center
    } ) );
  }

  sceneryPhet.register( 'DialogsScreenView', DialogsScreenView );

  return inherit( ScreenView, DialogsScreenView );
} );