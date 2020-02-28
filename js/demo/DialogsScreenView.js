// Copyright 2018-2020, University of Colorado Boulder

/**
 * Demonstration of scenery-phet dialogs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import batteryDCellImage from '../../images/battery-D-cell_png.js';
import ContextLossFailureDialog from '../ContextLossFailureDialog.js';
import OopsDialog from '../OopsDialog.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';

// constants
const BUTTON_OPTIONS = {
  font: new PhetFont( 20 )
};

/**
 * @constructor
 */
function DialogsScreenView() {
  ScreenView.call( this );

  // reuse one instance of the dialog
  let contextLossFailureDialog = null;
  const contextLossFailureButton = new RectangularPushButton( {
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

  let oopsDialog = null;
  const oopsButton = new RectangularPushButton( {
    content: new Text( 'OopsDialog', BUTTON_OPTIONS ),
    listener: () => {
      if ( !oopsDialog ) {
        oopsDialog = new OopsDialog( 'Oops!<br><br>Your battery appears to be dead.', {
          iconNode: new Image( batteryDCellImage, { rotation: -Math.PI / 2 } )
        } );
      }
      oopsDialog.show();
    }
  } );

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

inherit( ScreenView, DialogsScreenView );
export default DialogsScreenView;