// Copyright 2015-2020, University of Colorado Boulder

/**
 * Failure message displayed when a WebGL context loss is experienced and we can't recover. Offers a button to reload
 * the simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import TextPushButton from '../../sun/js/buttons/TextPushButton.js';
import Dialog from '../../sun/js/Dialog.js';
import FontAwesomeNode from '../../sun/js/FontAwesomeNode.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './scenery-phet-strings.js';
import sceneryPhet from './sceneryPhet.js';

const webglWarningContextLossFailureString = sceneryPhetStrings.webglWarning.contextLossFailure;
const webglWarningContextLossReloadString = sceneryPhetStrings.webglWarning.contextLossReload;

/**
 *
 * @constructor
 */
function ContextLossFailureDialog( options ) {

  const self = this;

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

  // @private
  this.reload = options.reload;

  const warningSign = new FontAwesomeNode( 'warning_sign', {
    fill: '#E87600', // "safety orange", according to Wikipedia
    scale: 0.6
  } );

  const text = new Text( webglWarningContextLossFailureString, { font: new PhetFont( 12 ) } );

  const button = new TextPushButton( webglWarningContextLossReloadString, {
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

export default inherit( Dialog, ContextLossFailureDialog, {

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