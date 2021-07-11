// Copyright 2015-2021, University of Colorado Boulder

/**
 * Failure message displayed when a WebGL context loss is experienced and we can't recover. Offers a button to reload
 * the simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import merge from '../../phet-core/js/merge.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Path from '../../scenery/js/nodes/Path.js';
import Text from '../../scenery/js/nodes/Text.js';
import exclamationTriangleSolidShape from '../../sherpa/js/fontawesome-5/exclamationTriangleSolidShape.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Dialog from '../../sun/js/Dialog.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';

class ContextLossFailureDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

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

    const warningSign = new Path( exclamationTriangleSolidShape, {
      fill: '#E87600', // "safety orange", according to Wikipedia
      scale: 0.048
    } );

    const text = new Text( sceneryPhetStrings.webglWarning.contextLossFailure, { font: new PhetFont( 12 ) } );

    const button = new TextPushButton( sceneryPhetStrings.webglWarning.contextLossReload, {
      font: new PhetFont( 12 ),
      baseColor: '#E87600',
      listener: () => this.hide()
    } );

    const content = new HBox( {
      children: [ warningSign, text, button ],
      spacing: 10
    } );

    super( content, options );

    // @private
    this.reload = options.reload;
  }

  /**
   * Perform reload (or provided callback) regardless of how the dialog is hidden.
   * See https://github.com/phetsims/scenery-phet/issues/373.
   * @public
   * @override
   */
  hide() {
    this.reload();
    super.hide();
  }
}

sceneryPhet.register( 'ContextLossFailureDialog', ContextLossFailureDialog );
export default ContextLossFailureDialog;