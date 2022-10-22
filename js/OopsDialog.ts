// Copyright 2019-2022, University of Colorado Boulder

/**
 * OopsDialog is displayed when some limitation of the simulation is encountered.
 * So named because the messages typically begin with 'Oops!', so that's how people referred to it.
 * See https://github.com/phetsims/equality-explorer/issues/48
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { HBox, Image, Node, RichText, RichTextOptions } from '../../scenery/js/imports.js';
import Dialog, { DialogOptions } from '../../sun/js/Dialog.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import phetGirlWaggingFinger_png from '../images/phetGirlWaggingFinger_png.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  // Optional icon that will be placed to the right of the image.
  // If not provided, then a PhET Girl image is used.
  // If provided, the caller is responsible for all aspects of the icon, including scale.
  iconNode?: Node;

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
  public constructor( messageString: string | TReadOnlyProperty<string>, providedOptions?: OopsDialogOptions ) {

    const options = optionize<OopsDialogOptions, StrictOmit<SelfOptions, 'iconNode' | 'richTextOptions'>, DialogOptions>()( {

      // DialogOptions
      topMargin: 20,
      bottomMargin: 20,

      // phet-io
      tandem: Tandem.OPTIONAL,
      phetioType: OopsDialog.OopsDialogIO
    }, providedOptions );

    const text = new RichText( messageString, optionize<RichTextOptions, EmptySelfOptions, RichTextOptions>()( {
      font: new PhetFont( 20 ),
      maxWidth: 600,
      maxHeight: 400,
      tandem: options.tandem.createTandem( 'text' )
    }, options.richTextOptions ) );

    const iconNode = options.iconNode || new Image( phetGirlWaggingFinger_png, {
      maxHeight: 132 // determined empirically
    } );

    const content = new HBox( {
      spacing: 20,
      children: [ text, iconNode ]
    } );

    super( content, options );

    this.disposeOopsDialog = () => {
      text.dispose();
    };
  }

  public override dispose(): void {
    this.disposeOopsDialog();
    super.dispose();
  }

  public static readonly OopsDialogIO = new IOType( 'OopsDialogIO', {
    valueType: OopsDialog,
    supertype: Dialog.DialogIO
  } );
}

sceneryPhet.register( 'OopsDialog', OopsDialog );