// Copyright 2018-2022, University of Colorado Boulder

/**
 * Demonstration of scenery-phet dialogs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Image, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import batteryDCell_png from '../../../images/batteryDCell_png.js';
import CanvasWarningNode from '../../CanvasWarningNode.js';
import ContextLossFailureDialog from '../../ContextLossFailureDialog.js';
import OopsDialog from '../../OopsDialog.js';
import PhetFont from '../../PhetFont.js';
import sceneryPhet from '../../sceneryPhet.js';

// constants
const TEXT_OPTIONS = {
  font: new PhetFont( 20 )
};

type SelfOptions = EmptySelfOptions;
type DialogsScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class DialogsScreenView extends ScreenView {
  public constructor( providedOptions: DialogsScreenViewOptions ) {

    super( providedOptions );

    // Context Loss Failure
    let contextLossFailureDialog: Dialog | null = null;
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
    let canvasWarningDialog: Dialog | null = null;
    const canvasWarningButton = new RectangularPushButton( {
      content: new Text( 'Canvas Warning', TEXT_OPTIONS ),
      listener: () => {
        if ( !canvasWarningDialog ) {
          canvasWarningDialog = new Dialog( new CanvasWarningNode() );
        }
        canvasWarningDialog.show();
      }
    } );

    // Oops!
    let oopsDialog: Dialog | null = null;
    const oopsButton = new RectangularPushButton( {
      content: new Text( 'OopsDialog', TEXT_OPTIONS ),
      listener: () => {
        if ( !oopsDialog ) {
          oopsDialog = new OopsDialog( 'Oops!<br><br>Your battery appears to be dead.', {
            iconNode: new Image( batteryDCell_png, { rotation: -Math.PI / 2 } )
          } );
        }
        oopsDialog.show();
      }
    } );

    this.addChild( new VBox( {
      children: [
        contextLossFailureButton,
        canvasWarningButton,
        oopsButton
      ],
      spacing: 20,
      center: this.layoutBounds.center
    } ) );
  }
}

sceneryPhet.register( 'DialogsScreenView', DialogsScreenView );