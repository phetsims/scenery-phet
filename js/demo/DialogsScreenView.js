// Copyright 2018-2021, University of Colorado Boulder

/**
 * Demonstration of scenery-phet dialogs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../sun/js/Dialog.js';
import batteryDCellImage from '../../images/battery-D-cell_png.js';
import CanvasWarningNode from '../CanvasWarningNode.js';
import ContextLossFailureDialog from '../ContextLossFailureDialog.js';
import IE11StencilWarningNode from '../IE11StencilWarningNode.js';
import OopsDialog from '../OopsDialog.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';

// constants
const TEXT_OPTIONS = {
  font: new PhetFont( 20 )
};

class DialogsScreenView extends ScreenView {
  constructor() {
    super();

    // Context Loss Failure
    let contextLossFailureDialog = null;
    const contextLossFailureButton = new RectangularPushButton( {
      content: new Text( 'Context Loss Failure', TEXT_OPTIONS ),
      listener: () => {
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

    // Canvas Warning
    let canvasWarningDialog = null;
    const canvasWarningButton = new RectangularPushButton( {
      content: new Text( 'Canvas Warning', TEXT_OPTIONS ),
      listener: () => {
        if ( !canvasWarningDialog ) {
          canvasWarningDialog = new Dialog( new CanvasWarningNode() );
        }
        canvasWarningDialog.show();
      }
    } );

    // IE11 Stencil Warning
    let ie11StencilWarningDialog = null;
    const ie11StencilWarningButton = new RectangularPushButton( {
      content: new Text( 'IE11 Stencil Warning', TEXT_OPTIONS ),
      listener: () => {
        if ( !ie11StencilWarningDialog ) {
          ie11StencilWarningDialog = new Dialog( new IE11StencilWarningNode() );
        }
        ie11StencilWarningDialog.show();
      }
    } );

    // Oops!
    let oopsDialog = null;
    const oopsButton = new RectangularPushButton( {
      content: new Text( 'OopsDialog', TEXT_OPTIONS ),
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
        canvasWarningButton,
        ie11StencilWarningButton,
        oopsButton
      ],
      spacing: 20,
      center: this.layoutBounds.center
    } ) );
  }
}

sceneryPhet.register( 'DialogsScreenView', DialogsScreenView );
export default DialogsScreenView;