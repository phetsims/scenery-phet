// Copyright 2015-2025, University of Colorado Boulder

/**
 * Failure message displayed when a WebGL context loss is experienced and we can't recover. Offers a button to reload
 * the simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import optionize from '../../phet-core/js/optionize.js';
import HBox from '../../scenery/js/layout/nodes/HBox.js';
import Path from '../../scenery/js/nodes/Path.js';
import Text from '../../scenery/js/nodes/Text.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Dialog, { DialogOptions } from '../../sun/js/Dialog.js';
import warningSignShape from '../../sun/js/shapes/warningSignShape.js';
import Tandem from '../../tandem/js/Tandem.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';

type SelfOptions = {

  // By default, pressing the Reload button reloads the simulation in the browser.
  // Provided as an option so that scenery-phet demo app can test without causing automated-testing failures.
  // See https://github.com/phetsims/scenery-phet/issues/375
  reload?: () => void;
};

export type ContextLossFailureDialogOptions = SelfOptions & DialogOptions;

export default class ContextLossFailureDialog extends Dialog {

  private readonly reload: () => void; // see SelfOptions.reload

  private readonly disposeContextLossFailureDialog: () => void;

  public constructor( providedOptions?: ContextLossFailureDialogOptions ) {

    const options = optionize<ContextLossFailureDialogOptions, SelfOptions, DialogOptions>()( {

      // ContextLossFailureDialogOptions
      reload: () => window.location.reload(),

      // Dialog options
      xSpacing: 30,
      topMargin: 30,
      bottomMargin: 30,
      leftMargin: 30,

      tandem: Tandem.OPT_OUT

    }, providedOptions );

    const warningSign = new Path( warningSignShape, {
      fill: '#E87600', // "safety orange", according to Wikipedia
      scale: 1.2
    } );

    const text = new Text( SceneryPhetStrings.webglWarning.contextLossFailureStringProperty, {
      font: new PhetFont( 12 )
    } );

    const button = new TextPushButton( SceneryPhetStrings.webglWarning.contextLossReloadStringProperty, {
      font: new PhetFont( 12 ),
      baseColor: '#E87600',
      listener: () => this.hide(),
      tandem: Tandem.OPT_OUT
    } );

    const content = new HBox( {
      children: [ warningSign, text, button ],
      spacing: 10
    } );

    super( content, options );

    this.reload = options.reload;

    this.disposeContextLossFailureDialog = () => {
      text.dispose();
      button.dispose();
    };
  }

  public override dispose(): void {
    this.disposeContextLossFailureDialog();
    super.dispose();
  }

  /**
   * Invokes the reload callback when the dialog is hidden.
   * See https://github.com/phetsims/scenery-phet/issues/373.
   */
  public override hide(): void {
    this.reload();
    super.hide();
  }

  /**
   * Hides the dialog without invoking the reload callback.
   */
  public hideWithoutReload(): void {
    super.hide();
  }
}

sceneryPhet.register( 'ContextLossFailureDialog', ContextLossFailureDialog );