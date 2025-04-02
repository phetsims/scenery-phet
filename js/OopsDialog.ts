// Copyright 2019-2025, University of Colorado Boulder

/**
 * OopsDialog is displayed when some limitation of the simulation is encountered.
 * So named because the message typically begins with 'Oops!', so that's how people referred to it.
 * See https://github.com/phetsims/equality-explorer/issues/48
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../scenery/js/nodes/RichText.js';
import Dialog, { DialogOptions } from '../../sun/js/Dialog.js';
import IOType from '../../tandem/js/types/IOType.js';
import phetGirlWaggingFinger_png from '../images/phetGirlWaggingFinger_png.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  // Icon that will be placed to the right of the image.
  // If not provided, then a PhET Girl image is used.
  // If provided, the caller is responsible for all aspects of the icon, including scale.
  iconNode?: Node;

  // Position of optional icon, relative to message text.
  iconPosition?: 'left' | 'right';

  // Passed to RichText node that displays messageString
  richTextOptions?: RichTextOptions;
};

export type OopsDialogOptions = SelfOptions & DialogOptions;

export default class OopsDialog extends Dialog {

  private readonly disposeOopsDialog: () => void;

  /**
   * @param messageString - supports RichText formatting
   * @param [providedOptions]
   */
  public constructor( messageString: string | ReadOnlyProperty<string>, providedOptions?: OopsDialogOptions ) {

    const options = optionize<OopsDialogOptions, StrictOmit<SelfOptions, 'iconNode' | 'richTextOptions'>, DialogOptions>()( {

      // SelfOptions
      iconPosition: 'right', // default is 'right' because default icon (phetGirlWaggingFinger_png) faces to the left

      // DialogOptions
      topMargin: 20,
      bottomMargin: 20,

      // phet-io
      phetioType: OopsDialog.OopsDialogIO
    }, providedOptions );

    const text = new RichText( messageString, optionize<RichTextOptions, EmptySelfOptions, RichTextOptions>()( {
      font: new PhetFont( 20 ),
      maxWidth: 600,
      maxHeight: 400
    }, options.richTextOptions ) );

    const iconNode = options.iconNode || new Image( phetGirlWaggingFinger_png, {
      maxHeight: 132 // determined empirically
    } );

    const content = new HBox( {
      spacing: 20,
      children: ( options.iconPosition === 'left' ) ? [ iconNode, text ] : [ text, iconNode ]
    } );

    super( content, options );

    this.disposeOopsDialog = () => {
      text.dispose();
    };

    if ( typeof messageString !== 'string' ) {
      this.addLinkedElement( messageString );
    }
  }

  public override dispose(): void {
    this.disposeOopsDialog();
    super.dispose();
  }

  public static readonly OopsDialogIO = new IOType<IntentionalAny, IntentionalAny>( 'OopsDialogIO', {
    valueType: OopsDialog,
    supertype: Dialog.DialogIO
  } );
}

sceneryPhet.register( 'OopsDialog', OopsDialog );